# Runs the activity collector in the job clone and publishes the result.
#
# Windows Task Scheduler starts this file twice a day. The wizard at
# .scratch/wizards/activity-schedule.sh creates the clone and registers the
# task. This file lives in the repository, so every run updates the wrapper
# itself before it does any work.
#
# Exit code 0 means the run finished. That includes the run that finds no new
# number and publishes nothing. Any other code means the run failed.

# Native commands report failure through the exit code, and this file tests
# $LASTEXITCODE after every one of them. A stop preference would turn plain
# stderr output from git into a terminating error, so keep it on Continue and
# let the trap below catch a real cmdlet failure.
$ErrorActionPreference = 'Continue'

$NodeExe = 'C:\Program Files\nodejs\node.exe'
$LogDirectory = Join-Path $env:LOCALAPPDATA 'portfolio-activity'
$LogPath = Join-Path $LogDirectory 'activity.log'
$DataPath = 'src/activity/activity.json'

# One line per run, appended forever. A run that changes no number publishes
# nothing, so this file is the only place that shows the job is alive.
function Write-JobLog {
    param(
        [string]$Outcome,
        [int]$Code,
        [string]$Detail
    )
    $stamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    $line = "$stamp $Outcome exit=$Code $Detail"
    try {
        New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null
        Add-Content -Path $LogPath -Value $line -Encoding UTF8
    } catch {
        # A log failure must not hide the outcome of the run.
    }
}

function Complete-Run {
    param(
        [string]$Outcome,
        [int]$Code,
        [string]$Detail
    )
    Write-JobLog -Outcome $Outcome -Code $Code -Detail $Detail
    exit $Code
}

trap {
    Write-JobLog -Outcome 'FAIL' -Code 1 -Detail "unexpected error: $_"
    exit 1
}

# The collector reads a token per account with `gh auth token --user <login>`.
# `gh` returns the environment token and ignores --user when GH_TOKEN or
# GITHUB_TOKEN is set. Both accounts would then resolve to one token, and the
# run would write wrong numbers and still exit 0.
Remove-Item Env:GH_TOKEN -ErrorAction SilentlyContinue
Remove-Item Env:GITHUB_TOKEN -ErrorAction SilentlyContinue

# The clone root is the parent of this file, so the wrapper works from any
# clone directory.
$CloneRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..') -ErrorAction Stop).Path

if (-not (Test-Path -LiteralPath $NodeExe)) {
    Complete-Run -Outcome 'FAIL' -Code 3 -Detail "node not found at $NodeExe"
}

$ScriptPath = Join-Path $CloneRoot 'scripts\activity.mjs'
if (-not (Test-Path -LiteralPath $ScriptPath)) {
    Complete-Run -Outcome 'FAIL' -Code 3 -Detail "collector not found at $ScriptPath"
}

# The clone holds no work that a human wrote, so a reset can lose nothing. A
# rebase can stop on a conflict and keep the job stuck for weeks. Reset every
# run instead.
& git -C $CloneRoot fetch origin 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail 'git fetch origin failed'
}
& git -C $CloneRoot reset --hard origin/main 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail 'git reset --hard origin/main failed'
}

# The collector compares import.meta.url against the resolved process.argv[1].
# A junction, a symbolic link, or an 8.3 short path makes that test fail, and
# then main() never runs, the process prints nothing, and it exits 0. Pass the
# real path, and treat empty output as a failure.
$OutputLines = & $NodeExe $ScriptPath 2>&1
$CollectorCode = $LASTEXITCODE
$Output = ($OutputLines | Out-String).Trim()

if ($CollectorCode -ne 0) {
    Complete-Run -Outcome 'FAIL' -Code 5 -Detail "collector exit=$CollectorCode $Output"
}
if ([string]::IsNullOrWhiteSpace($Output)) {
    Complete-Run -Outcome 'FAIL' -Code 5 -Detail 'collector printed nothing, so main() did not run'
}

$Summary = (($Output -split "`n")[-1]).Trim()

# The collector writes a file that is the same byte for byte when no number
# moved. No change means no commit and no deploy.
$Status = & git -C $CloneRoot status --porcelain -- $DataPath
if ($LASTEXITCODE -ne 0) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail 'git status failed'
}
if ([string]::IsNullOrWhiteSpace(($Status | Out-String))) {
    Complete-Run -Outcome 'NOCHANGE' -Code 0 -Detail $Summary
}

# Stage this one path. A collector that dies in the middle of a write can leave
# src/activity/activity.json.new behind, and `git add -A` would commit it.
& git -C $CloneRoot add -- $DataPath
if ($LASTEXITCODE -ne 0) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail 'git add failed'
}

# A machine wrote this commit. The subject says the date and nothing else. No
# body, no trailer, no session link.
$Subject = 'activity: ' + (Get-Date).ToString('yyyy-MM-dd')
& git -C $CloneRoot -c user.name=activity-bot -c user.email=activity-bot@users.noreply.github.com commit -m $Subject 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail 'git commit failed'
}

# A rejected push means another commit landed first. Do not retry, do not run
# the collector again, and never force. Every GitHub number is rebuilt from
# scratch, so the next run makes the same result again.
& git -C $CloneRoot push origin main 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Complete-Run -Outcome 'FAIL' -Code 6 -Detail "push rejected, $Subject stays local"
}

Complete-Run -Outcome 'PUSHED' -Code 0 -Detail $Summary
