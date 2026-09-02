# Research: SEO and social for the portfolio

Spec section: `.scratch/portfolio-spec/spec.md`, section 9.
Date: 2026-09-02
Sources: Google Search Central, schema.org, ogp.me, the X card reference (Wayback capture, 2024), LinkedIn Help, Cloudflare Pages docs, web.dev, Vite docs, the Public Suffix List, the Claude Code docs. Each finding cites its source.

## 1. Question

What does the build put in the head, in the static files, and in the structured data so that an engineering lead or recruiter finds Emil Vladinov for "software engineer Copenhagen" and for "agentic coding" or "Claude Code" queries, on a static Vite site at `https://<project>.pages.dev/` with one extra page at `/build-log/`? Which local signals help a person, and where can the niche terms go without a change to the final copy?

## 2. Summary

- Google renders JavaScript. Static head tags plus React-rendered copy are enough for two pages. No prerender step. Social scrapers read only the static HTML, so every share tag sits in the HTML entry, not in React.
- The canonical for the second page is `/build-log/` with a slash. Cloudflare Pages answers `/build-log` with a 307 to the slash form.
- Production `<project>.pages.dev` is indexable. Only preview deployments get `X-Robots-Tag: noindex`. `pages.dev` is on the Public Suffix List, so Google treats the site as its own host. Search Console needs a URL-prefix property with HTML file verification. A domain property is not possible.
- A `*.pages.dev` host does not rank worse by any Google rule. A later custom domain is a full site move: Bulk Redirect on Cloudflare plus Change of Address in Search Console. One URL constant makes that move cheap.
- Google Business Profile is not for an employed engineer. For a person, the local signals are the city in the title, description, and page text, a `PostalAddress` in Person JSON-LD, and the same city on LinkedIn and GitHub.
- The shared vocabulary in Anthropic docs, Copenhagen job posts, and practitioner writing is "agentic". Job posts name Claude Code and Cursor as tools. The copy already carries "AI agents", "agentic coding", and "agentic workflows". The metadata adds "Claude Code" in the descriptions.
- Google sets no character limit on titles or descriptions. It truncates to the device width. The 60 and 155 figures are practitioner limits, kept here as the target.

## 3. Findings with sources

### 3.1 Client-rendered React and indexing

- Google crawls, renders, and indexes JavaScript pages "with an evergreen version of Chromium". A page can wait in the render queue "a few seconds, but it can take longer than that". https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Same page: "Server-side or pre-rendering is still a great idea because it makes your website faster for users and crawlers, and not all bots can run JavaScript."
- Google reads JSON-LD that JavaScript injects. https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Vite has no built-in prerender. Its SSR API "is a low-level API meant for library and framework authors". https://vite.dev/guide/ssr
- Vite writes `build-log/index.html` to `dist/build-log/index.html` through `rollupOptions.input`. https://vite.dev/guide/build

### 3.2 Structured data

- ProfilePage: for "About Me" pages and employee pages. Required: `mainEntity` (Person) with `name`. Recommended on Person: `alternateName`, `description`, `identifier`, `image`, `sameAs`. Recommended on ProfilePage: `dateCreated`, `dateModified`. https://developers.google.com/search/docs/appearance/structured-data/profile-page
- schema.org Person: `name`, `jobTitle`, `worksFor`, `address` (PostalAddress), `homeLocation`, `sameAs`, `url`, `email`, `knowsAbout`, `image`. https://schema.org/Person
- Google policy: "Don't mark up content that is not visible to readers of the page." "Your structured data must be a true representation of the page content." Image URLs must be crawlable. Link entities with `@id`. https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google describes `sameAs` for Organization as "The URL of a page on another website with additional information". No Google page says that Person `sameAs` feeds a knowledge panel. https://developers.google.com/search/docs/appearance/structured-data/organization
- Article author markup: Google recommends `url` or `sameAs` on the author and `jobTitle` for the title. https://developers.google.com/search/docs/appearance/structured-data/article
- JSON-LD can sit in `<head>` or `<body>`. JSON-LD is the recommended format. https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google has no rich result for Person or WebSite. The value is entity disambiguation, not a SERP feature.

### 3.3 Canonical and trailing slash

- Use absolute URLs in `rel="canonical"`. The link counts only in `<head>`. A self-referencing canonical on the canonical page is recommended. https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Cloudflare Pages: "/about/index.html will be redirected to /about/". The docs do not give the status code. https://developers.cloudflare.com/pages/configuration/serving-pages/
- Probe on 2026-09-02 against developers.cloudflare.com (a Pages site): `/path` without a slash answers `307 Temporary Redirect` to `/path/`. The slash URL answers 200.

### 3.4 Sitemap and robots

- A sitemap is optional under about 500 pages. It does not guarantee crawling. https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Format: UTF-8, absolute URLs. Google uses `<lastmod>` only "if it's consistently and verifiably accurate". Google ignores `<priority>` and `<changefreq>`. https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- robots.txt: at the host root, one per host. The `Sitemap:` value "must be a fully-qualified URL". All files are allowed unless the file says otherwise. https://developers.google.com/search/docs/crawling-indexing/robots/create-robots-txt
- Cloudflare: "By default, every preview deployment generated by Cloudflare Pages includes the X-Robots-Tag: noindex HTTP response header." Production does not. https://developers.cloudflare.com/pages/configuration/preview-deployments/
- `pages.dev` is in the PRIVATE DOMAINS section of the Public Suffix List under "Cloudflare, Inc.". https://publicsuffix.org/list/public_suffix_list.dat

### 3.5 Search Console and Bing

- URL-prefix properties accept HTML file upload at the root or an HTML meta tag in `<head>`. "The only way to verify a Domain property" is a DNS record. https://support.google.com/webmasters/answer/9008080
- A domain property "Includes all subdomains" and needs DNS. A URL-prefix property "Includes only URLs with the specified prefix, including the protocol". https://support.google.com/webmasters/answer/34592
- Sitemap submission: the Sitemaps report, or the robots.txt line. https://support.google.com/webmasters/answer/7451001
- Bing Webmaster Tools imports sites and sitemaps from Search Console. https://blogs.bing.com/webmaster/september-2019/Import-sites-from-Search-Console-to-Bing-Webmaster-Tools
- Cloudflare `CF_PAGES_URL` is the "url-of-current-deployment". On previews it is `<hash>.<project>.pages.dev`. It is not a canonical. https://developers.cloudflare.com/pages/configuration/build-configuration/

### 3.6 Title, snippet, headings

- Title: "descriptive and concise", distinct per page, brand "at the beginning or end" with a delimiter, no repeated words. "There's no limit on how long a `<title>` element can be", Google truncates to the device width. The home title "is a reasonable place to include some additional information about your site". https://developers.google.com/search/docs/appearance/title-link
- Snippet: Google uses the meta description "if it might give users a more accurate description". No length limit. Identical descriptions across pages are not helpful. https://developers.google.com/search/docs/appearance/snippet
- Starter guide: "Think about the words that a user might search for". Keyword stuffing is a spam policy violation. Heading order matters for screen readers, "from Google Search perspective, it doesn't matter if you're using them out of order". https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Lighthouse `heading-order`: "Heading elements appear in a sequentially-descending order". The axe rule is a best practice, not a WCAG failure. https://dequeuniversity.com/rules/axe/4.10/heading-order
- Image alt: "Avoid filling alt attributes with keywords". Best example: "Dalmatian puppy playing fetch". https://developers.google.com/search/docs/appearance/google-images
- Meta keywords: "not used by Google Search". https://developers.google.com/search/docs/crawling-indexing/special-tags

### 3.7 Open Graph, X cards, LinkedIn

- ogp.me required: `og:title`, `og:type`, `og:image`, `og:url`. Optional: `og:description`, `og:site_name`, `og:locale`, `og:image:width`, `og:image:height`, `og:image:alt`. https://ogp.me/
- X: `twitter:title`, `twitter:description`, `twitter:image`, and `twitter:image:alt` fall back to the `og:` values. Alt maximum 420 characters. https://developer.x.com/en/docs/x-for-websites/cards/overview/markup (Wayback, 2024)
- X `summary_large_image`: aspect 2:1, minimum 300x157, maximum 4096x4096, under 5 MB, JPG, PNG, WEBP, GIF. No SVG. https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image (Wayback, 2024)
- LinkedIn: minimum 1200x627, ratio 1.91:1, maximum 5 MB. https://www.linkedin.com/help/linkedin/answer/a521928
- LinkedIn caches the preview. The Post Inspector refreshes it. https://www.linkedin.com/help/linkedin/answer/a6233775
- LinkedIn Featured pulls the Open Graph title and image. https://www.linkedin.com/help/linkedin/answer/a1513395

### 3.8 Favicons

- Google: `rel` `icon` or `apple-touch-icon`, square, "48x48px or greater" or a multiple of 48, formats include ICO, PNG, SVG, crawlable, stable URL, home page only. https://developers.google.com/search/docs/appearance/favicon-in-search
- Minimal set: `favicon.ico`, `icon.svg`, `apple-touch-icon.png` 180x180. Manifest only for a PWA. https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs (secondary)

### 3.9 Core Web Vitals

- LCP 2.5 s, INP 200 ms, CLS 0.1, at the 75th percentile. https://web.dev/articles/vitals
- "your LCP resource should be discoverable from the HTML source". Use `fetchpriority="high"` on the LCP image. Never lazy-load it. https://web.dev/articles/optimize-lcp
- Always set width and height on images, or reserve space with CSS. https://web.dev/articles/optimize-cls
- WOFF2 only. `font-display: swap` shows text fast with a shift risk. https://web.dev/articles/font-best-practices

### 3.10 Custom domain

- Google on subdomain against subdirectory: "do whatever makes sense for your business". No Google page says a `*.pages.dev` host ranks worse. https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Site move with URL change: permanent redirects page to page, new canonicals, new sitemap, Change of Address, redirects for at least one year. https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Cloudflare: "You can use the account-level Bulk Redirect feature to redirect your *.pages.dev URL to a custom domain". `_redirects` does not do domain-level redirects. https://developers.cloudflare.com/pages/configuration/custom-domains/ and https://developers.cloudflare.com/pages/configuration/redirects/
- `_headers` format and examples, including `X-Content-Type-Options: nosniff` and immutable cache for fingerprinted assets. https://developers.cloudflare.com/pages/configuration/headers/

### 3.11 Local SEO for a person

- Google Business Profile: "If your business either has a physical location that customers can visit, or travels to customers where they are, you can create a Business Profile on Google." Support staff must not create their own profile. https://support.google.com/business/answer/3038177
- Knowledge Panel claim: possible only after a panel exists. Verification runs through Search Console, YouTube, X, or Facebook. https://support.google.com/knowledgepanel/answer/7534902
- Geo signals: a ccTLD is a strong signal, `.pages.dev` has none. Server location behind a CDN is not definitive. Other signals are "local addresses and phone numbers on the pages, the use of local language". Google ignores `geo.*` meta tags. https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
- The Search Console International Targeting report is deprecated. https://support.google.com/webmasters/answer/12474899
- Google does not use `lang` or hreflang to detect language. hreflang is for multiple language versions. https://developers.google.com/search/docs/specialty/international/localized-versions
- LinkedIn: country is required, city is optional. Set the city. https://www.linkedin.com/help/linkedin/answer/a564134
- LinkedIn Recruiter location filter: "There is an implied 100-mile radius to any Location selection you make". https://www.linkedin.com/help/recruiter/answer/a417339
- GitHub renders the profile website link with `rel="nofollow me"`. https://github.com/orgs/community/discussions/6248
- `rel="me"` marks profile equivalence for identity consolidation. https://microformats.org/wiki/rel-me
- Helpful content: "We strongly encourage adding accurate authorship information". https://developers.google.com/search/docs/fundamentals/creating-helpful-content

### 3.12 Niche vocabulary

- Anthropic: "Claude Code is an agentic coding tool". https://code.claude.com/docs/en/overview
- Claude Code legal page: "You can accurately say, in plain text, that your product has Claude Code preinstalled or that it runs Claude Code." No logo, no implied endorsement. https://code.claude.com/docs/en/legal-and-compliance
- Copenhagen job posts: Vivino asks for "experience in using AI tools (Cursor, Claude Code)" and "agentic engineering". https://thehub.io/jobs/69f53f3124ca04c47eb25e8f Wonderful asks for "agentic workflows". https://thehub.io/jobs/693fd9a51cd59309d171360d
- Pragmatic Engineer 2026 survey: Claude Code is the most used tool, "55% say they regularly use AI agents". https://newsletter.pragmaticengineer.com/p/ai-tooling-2026
- No personal site ranks for "agentic coding engineer portfolio". The names that surface (Addy Osmani, Sean Goedecke, HAMY) rank on article titles, not on their home title.

## 4. Recommendation

1. Static head per HTML entry. React renders the body. No prerender.
2. Canonicals `https://<project>.pages.dev/` and `https://<project>.pages.dev/build-log/`. Every internal link and the sitemap use the slash form.
3. Home JSON-LD `@graph`: `WebSite`, `ProfilePage`, `Person` with `PostalAddress` Copenhagen, DK, `worksFor` Inact and Solution 8, `sameAs` GitHub and LinkedIn, `knowsAbout` limited to topics on the page. Build Log JSON-LD: `WebPage` with `isPartOf`.
4. Home title keeps the headline and adds the name. Both descriptions carry "Copenhagen" and "Claude Code". No `meta keywords`.
5. One 1200x630 PNG for Open Graph, with `og:image:width`, `og:image:height`, `og:image:alt`, and the full `twitter:` set.
6. Favicons: `favicon.ico` 48 px, `icon.svg`, `apple-touch-icon.png` 180 px.
7. `robots.txt` allow all with the `Sitemap:` line. `sitemap.xml` with two URLs, no `lastmod`.
8. Search Console URL-prefix property, HTML file verification, sitemap submission, Bing import.
9. `_headers` with `nosniff`, frame deny, referrer policy, and immutable cache on `/assets/*`.
10. The production URL sits in one constant, and in the four static files that cannot read it. A later domain move is a Bulk Redirect plus Change of Address.
11. LinkedIn: city Copenhagen, portfolio URL in Contact info and Featured. GitHub: website field and location "Copenhagen, Denmark". Footer links carry `rel="me"`.

## 5. Open points

- The 307 for `/build-log` comes from a probe of developers.cloudflare.com, not from the Pages docs. Confirm with `curl -I` on the deployed site.
- The X card docs are gone from docs.x.com. The limits come from a 2024 Wayback capture.
- The 60 and 155 character targets are practitioner figures. Google states no limit.
- Google does not document that Person `sameAs`, `address`, or `worksFor` feed the Knowledge Graph.
- LinkedIn `rel="nofollow"` on profile links is reported by third parties only.
- The share of Copenhagen tech job posts in English is unsourced. English-only boards list about 3,300 Copenhagen roles. https://englishjobs.dk/in/kobenhavn
- Google autocomplete data was not available. Phrase popularity comes from result types.
