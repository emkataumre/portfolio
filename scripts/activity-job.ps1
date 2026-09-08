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
# the exit code after every one of them. A stop preference would turn plain
# stderr output from git into a terminating error, so keep it on Continue.
$ErrorActionPreference = 'Continue'

$NodeExe = 'C:\Program Files\nodejs\node.exe'
$LogDirectory = Join-Path $env:LOCALAPPDATA 'portfolio-activity'
$LogPath = Join-Path $LogDirectory 'activity.log'
$DataPath = 'src/activity/activity.json'

# The collector prints one line that starts with this prefix, and it prints
# that line on every path that reaches the end of main().
$SummaryPrefix = '^activity: '

# One line per run, appended forever. A run that changes no number publishes
# nothing, so this file is the only place that shows the job is alive.
function Write-JobLog {
    param(
        [string]$Outcome,
        [int]$Code,
        [string]$Detail
    )
    $stamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    $line = "$stamp $Outcome exit=$Code $Detail" -replace '\s*\r?\n\s*', ' '
    try {
        New-Item -ItemType Directory -Path $LogDirectory -Force | Out-Null
        Add-Content -Path $LogPath -Value $line -Encoding UTF8
    } catch {
        # A log failure must not hide the outcome of the run.
    }
}

# Complete-Run writes the log line and then ends the process. It never returns
# to the caller. The name uses the approved verb Complete.
function Complete-Run {
    param(
        [string]$Outcome,
        [int]$Code,
        [string]$Detail
    )
    Write-JobLog -Outcome $Outcome -Code $Code -Detail $Detail
    exit $Code
}

# Invoke-Git runs one git command in the job clone. It returns $true when git
# exits 0. It puts the merged output of git, stdout and stderr together, in
# $GitOutput, so a caller can log the reason that git gave.
$GitOutput = ''
function Invoke-Git {
    param(
        [Parameter(ValueFromRemainingArguments = $true)]
        [string[]]$Arguments
    )
    $result = & git -C $CloneRoot @Arguments 2>&1
    $code = $LASTEXITCODE
    # ToString on each record keeps the message of a stderr line and drops the
    # PowerShell error banner around it, so the log line stays one line.
    $script:GitOutput = (($result | ForEach-Object { $_.ToString() }) -join ' ').Trim()
    return ($code -eq 0)
}

# The preference above makes a cmdlet failure non-terminating, so this trap
# catches only a genuine terminating error. In this file that is the
# Resolve-Path call below, which carries -ErrorAction Stop.
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
if (-not (Invoke-Git -Arguments @('fetch', 'origin'))) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail "git fetch origin failed: $GitOutput"
}
# A detached HEAD makes the commit land on no branch. The push then reports
# "Everything up-to-date" and exits 0, and this run would log a success that
# published nothing. A normal clone stays on main, so this is a cheap guard
# against a clone that somebody changed by hand.
if (-not (Invoke-Git -Arguments @('checkout', 'main'))) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail "git checkout main failed: $GitOutput"
}
if (-not (Invoke-Git -Arguments @('reset', '--hard', 'origin/main'))) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail "git reset --hard origin/main failed: $GitOutput"
}

# The collector compares import.meta.url against the resolved process.argv[1].
# A junction, a symbolic link, or an 8.3 short path makes that test fail, and
# then main() never runs, the process prints no summary line, and it exits 0.
# A node warning or a gh warning can still fill the output, so the guard reads
# the collector's own prefix and not the length of the output.
$OutputLines = & $NodeExe $ScriptPath 2>&1
$CollectorCode = $LASTEXITCODE
$Output = ($OutputLines | Out-String).Trim()
$Summary = $Output -split "`r?`n" |
    Where-Object { $_ -match $SummaryPrefix } |
    Select-Object -Last 1

if ($CollectorCode -ne 0) {
    Complete-Run -Outcome 'FAIL' -Code 5 -Detail "collector exit=$CollectorCode $Output"
}
if (-not $Summary) {
    Complete-Run -Outcome 'FAIL' -Code 5 -Detail "collector printed no summary line, so main() did not run: $Output"
}
$Summary = $Summary.Trim()

# The collector writes a file that is the same byte for byte when no number
# moved. No change means no commit and no deploy.
if (-not (Invoke-Git -Arguments @('status', '--porcelain', '--', $DataPath))) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail "git status failed: $GitOutput"
}
if ([string]::IsNullOrWhiteSpace($GitOutput)) {
    Complete-Run -Outcome 'NOCHANGE' -Code 0 -Detail $Summary
}

# Stage this one path. A collector that dies in the middle of a write can leave
# src/activity/activity.json.new behind, and `git add -A` would commit it.
if (-not (Invoke-Git -Arguments @('add', '--', $DataPath))) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail "git add failed: $GitOutput"
}

# A machine wrote this commit. The subject says the date and nothing else. No
# body, no trailer, no session link.
$Subject = 'activity: ' + (Get-Date).ToString('yyyy-MM-dd')
if (-not (Invoke-Git -Arguments @('-c', 'user.name=activity-bot', '-c', 'user.email=activity-bot@users.noreply.github.com', 'commit', '-m', $Subject))) {
    Complete-Run -Outcome 'FAIL' -Code 4 -Detail "git commit failed: $GitOutput"
}

# A failed push can be a rejection, a lost network, or a token that expired.
# Log the reason that git gave. Do not retry, do not run the collector again,
# and never force. Every GitHub number is rebuilt from scratch, so the next run
# makes the same result again.
if (-not (Invoke-Git -Arguments @('push', 'origin', 'main'))) {
    Complete-Run -Outcome 'FAIL' -Code 6 -Detail "push failed, $Subject stays local: $GitOutput"
}

Complete-Run -Outcome 'PUSHED' -Code 0 -Detail $Summary
