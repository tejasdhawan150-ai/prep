# PrepEve SEO and AEO audit

**Date:** 8 November 2026
**Site:** https://www.prepeve.com (static HTML on Vercel)
**Scope:** all 161 deployable pages (159 indexable, plus `/404` and `/thank-you`, which are noindex). The five unpublished `prepeve-vs-*` drafts, `docs/`, `scripts/` and `assets/partials.html` are excluded from deployment by `.vercelignore`, so they were not audited as live pages.

---

## 1. Summary

| | Count |
|---|---|
| Pages audited | 161 (159 indexable) |
| Issues found | **30** |
| Critical | 2 (both fixed) |
| High | 6 (4 fixed, 2 need a decision or content work) |
| Medium | 12 (9 fixed, 3 pending) |
| Low | 10 (2 fixed, 8 pending or no action recommended) |
| **Fixed** | **17** |
| **Pending** | **13** |

**What was wrong, in plain terms**

- **Internal links (the biggest problem).** About 60 of the 159 pages had no internal links at all, or only a handful. This covered all 32 city pages (Lucknow had none) and 32 guides, some with hundreds of monthly impressions. Google treats pages that nothing links to as unimportant.
- **Duplicate URLs.** Four pages were indexed under two addresses, with and without a trailing "/". One page, Mohali, was never reachable because an old redirect sent it to Chandigarh.
- **Schema and freshness.** Article authors had no name in the structured data. Two important pages described a rule change from 3 November 2026 as still upcoming.
- **Templated city pages.** About 78% of each city page's text also appears on other city pages. For an online-only business, Google's spam policy treats this as a doorway-page risk.

**What changed:** PRs #129 to #132, all live, plus this report.

**What needs your decision:** see section 10. Merging two competing "online IELTS coaching" pages, noindexing three webinar ad pages, and a plan for the city pages.

---

## 2. Baseline: Google Search Console (28 Sep – 6 Nov 2026)

| Metric | Value |
|---|---|
| Clicks | 311 |
| Impressions | 34,603 |
| CTR | 0.9% |
| Average position | ~11 (mobile 8.8, desktop 14.4) |
| Weekly clicks | 23 → 17 → 47 → 65 → 103 → 56 (5 days) |
| Top countries | India 244 clicks, Canada 23, UK 7, USA 9, UAE 1 |

**What the data says**

- **Visibility is growing.** Impressions went from about 10 a day to 1,200–2,600 a day, and clicks from about 2–3 a day to about 11.
- **Most pages rank at positions 7–12.** On phones, that's below the AI answer, "People also ask" and the official IELTS sites, so few people click.
- **The largest query group is navigational.** "ielts booking", "ielts exam booking", "idp ielts booking" and similar got 2,535 impressions and 0 clicks; those people want the IDP website. That traffic isn't worth chasing.
- **The money queries are mostly on page 2.** "ielts coaching fees", "best online ielts coaching", "ielts coaching <city>" and "online ielts coaching" sit at positions 8–45.
- **Brand searches.** "prepeve" got 107 impressions and 40 clicks.

Re-check these numbers 4 weeks after 8 November 2026.

---

## 3. Setup reviewed

| Area | Finding |
|---|---|
| Framework | Static HTML, one folder per page, `cleanUrls: true`, `trailingSlash: false` (Vercel) |
| Redirects | 72 in `vercel.json`; no chains, no missing destinations |
| robots.txt | Allows all crawlers. Explicitly allows OAI-SearchBot, ChatGPT-User, GPTBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot and Applebot-Extended. Disallows `/thank-you`. Lists the sitemap. |
| Sitemap | 159 URLs, matching the 159 indexable pages exactly |
| llms.txt | Present, with 154 links |
| IndexNow | Key file present (`433bbf…txt`) |
| Shared assets | `prepeve.css` (33 KB) and `prepeve.js` (16 KB, deferred), versioned with `?v=` by `scripts/bump-assets.sh` |
| QA | `scripts/site-check.js` checks broken links, single H1, banned claims, JSON-LD validity, FAQ visibility, layout at 375, 1024 and 1440px, and JS errors |
| Analytics | Google tag (GA4 + Ads), async |

---

## 4. What already passed

- Canonical tags: 159/159 self-referencing and on `https://www.`.
- One H1 on every page. No duplicate titles. No duplicate meta descriptions.
- No broken internal links, no links to redirecting URLs, no non-www or http internal links.
- Every image has `alt`, `width` and `height`. Every local image has a WebP source. Below-the-fold images are lazy-loaded.
- Fonts: preloaded WOFF2 with `font-display: swap`.
- The LCP element is text (H1 or answer paragraph) on all 8 key templates tested. Layout shift (CLS) is 0.000.
- JSON-LD is valid on every page. FAQ schema questions match the visible FAQ on all 144 pages that use it.
- No self-serving review or rating markup (correct, per Google's policy).
- No horizontal overflow at 375, 1024 or 1440px (site-check).
- Answer-first structure: 146 of 159 pages open with a direct answer, and 151 have a visible FAQ.

---

## 5. Issues and status

Severity scale:
- **Critical:** blocks indexing, or affects a large share of the site.
- **High:** major ranking or CTR impact on important pages.
- **Medium:** moderate impact or a best-practice gap.
- **Low:** polish.

| ID | Severity | Area | Issue and evidence | Status |
|---|---|---|---|---|
| C1 | Critical | Indexability | `/ielts-coaching-mohali` was unreachable. A redirect from 3 Oct (before the page existed) overrode the page, and the sitemap listed a redirecting URL. | **Fixed** (#129): redirect removed |
| C2 | Critical | Internal linking | About 60 indexable pages (~40% of the site) were orphaned or near-orphaned. City pages had 0–4 internal links (Lucknow 0, Toronto 2, Mumbai 3), and 32 guides had none. Those guides include /toefl-exam-fee (566 impressions), /ielts-eligibility (464), /toefl-2026-changes (397), /pte-result (292), /clb-8-ielts-score (275) and /canada-pr-process-from-india (271). | **Fixed** (#129, #131): orphans 32 → 2, city pages ~157 links each |
| H1 | High | Duplicate URLs | 168 internal links pointed to `/page/`, so 4 pages were indexed twice. /best-online-ielts-coaching-india ranked 12.7 on one URL and 43.5 on the other. | **Fixed** (#129) |
| H2 | High | Content / policy | City pages are near-duplicates: a median 78% of 6-word sequences also appear on other city pages, and Calgary vs Edmonton overlap 75%. For an online-only service, this is a doorway-page risk under Google's spam policies. | **Pending:** needs verified local content (section 10) |
| H3 | High | Structured data | The organisation entity was defined on only 2 pages. On 105 Article pages, author and publisher pointed to an `@id` that wasn't on the page, so Google saw no author name. | **Fixed** (#131): defined on 145 pages |
| H4 | High | Freshness | The CRS calculator (top non-brand page, 57 clicks) and the Canada PR process page described the 3 November 2026 CRS change as upcoming ("Coming soon", "What changes on 3 November"). | **Fixed** (#131) |
| H5 | High | Site architecture | Hubs didn't link their child pages. The IELTS hub was missing 18 pages, including the fee & booking page (4,632 impressions, the site's largest). The Canada PR cluster had no hub links. The TOEFL, PTE and Duolingo hubs missed their fee, score and result pages. | **Fixed** (#131) |
| H6 | High | Cannibalisation | Several pages compete for "online IELTS coaching India": /online-ielts-coaching-india (895 words, pos 36.5, 2 internal links), /best-online-ielts-coaching-india (2,325 words, pos 12.7), /ielts-coaching-online (Ads page, indexable) and the home page. | **Pending approval:** merge with a 301 (section 10) |
| M1 | Medium | Meta | 27 meta descriptions over 160 characters were cut off in results. | **Fixed** (#131): 0 left |
| M2 | Medium | Meta | 13 titles over 65 characters. | **Fixed for 7** (#131). 6 city titles kept unchanged until ~24 Nov (changed 3 Nov; need stable data) |
| M3 | Medium | UX / internal links | In-text links on 151 guide and city pages looked like plain text (same colour, no underline). | **Fixed** (#129) |
| M4 | Medium | Internal linking | The home page (strongest page) linked to only ~15 inner pages. | **Fixed** (#129): free tools and guides block |
| M5 | Medium | E-E-A-T | "Written by the PrepEve team" wasn't linked to any author or team page. | **Fixed** (#131): linked to /about on 145 pages |
| M6 | Medium | Structured data | `/webinar` had an Event without the required `startDate` (a recurring event a static page can't keep current). | **Fixed** (#131): removed |
| M7 | Medium | Performance | Versioned CSS/JS were served with `max-age=0`, so every page view revalidated both files. | **Fixed** (#131): cached 1 year; site-check guards the version stamp |
| M8 | Medium | AEO | The 3 `/ielts-guide/*` pages had no direct answer at the top (band-scores: 747 impressions, pos 27). | **Fixed** (#131): answer blocks plus visible "Updated" dates |
| M9 | Medium | Content | A stale promise ("provider comparisons are coming soon") on /best-online-ielts-coaching-india. | **Fixed** (#131) |
| M10 | Medium | Indexability | Webinar ad landing pages (/ielts-band-7, /ielts-canada-pr, /ielts-retake) are indexable, in the sitemap, orphaned, and overlap /webinar. | **Pending approval:** noindex (section 10) |
| M11 | Medium | Thin content | Pages with impressions but little depth: /how-long-to-prepare-for-ielts (461 words; 224 impr, pos 9.0), /ielts-band-descriptors (517; 136, pos 9.5), /toefl-duolingo-canada-pr (517; 104, pos 4.2), /ielts-validity-canada-pr (626). | **Pending:** expand with sourced facts |
| M12 | Medium | Search intent | /ielts-coaching-fees-india gets "ielts course fees" and "ielts coaching fees" (~514 impr, pos 7–13, 1 click) but shows no typical fee figures. Only Self-Paced ₹4,999 may be published. | **Pending:** owner decision on what prices to show, or sourced market data |
| L1 | Low | Headings | CRS calculator skipped from H1 to H3. | **Fixed** (#131) |
| L2 | Low | Meta robots | No `max-image-preview:large`, which limits large image previews in Search and AI answers. | **Fixed** (#131): 159 pages |
| L3 | Low | Meta | /privacy, /terms and /refund have short titles and no Open Graph tags. | Pending (low value) |
| L4 | Low | Social / AI previews | The same `og-image.jpg` is used on all 156 pages that have one. | Pending (needs design; infographics were declined) |
| L5 | Low | robots.txt | `/thank-you` is both disallowed and noindexed, so Google can't see the noindex. | No action (not linked publicly) |
| L6 | Low | Performance | YouTube thumbnails load as JPG (WebP variants exist). | Pending (tiny gain) |
| L7 | Low | Performance | The Google tag (gtag.js) loads on every page. It's async, but it's the heaviest third-party script. | No action (needed for Ads); revisit if INP is flagged |
| L8 | Low | Structured data | 7 landing pages have visible FAQs without FAQPage markup. | No action (FAQ rich results are limited to gov/health sites; AI engines read the visible FAQ) |
| L9 | Low | Consistency | /book-demo uses "— PrepEve" in its title, not "\| PrepEve". | Pending (trivial) |
| L10 | Low | Mobile | Table captions are clipped inside scrollable tables at 375px. | Pending (cosmetic) |

**Also done in this session (requests, not audit findings)**

- #130: new page /tcf-canada-exam-centres-india; corrected the TCF centre list on the fee page.
- #132: removed the optional email field from all 9 lead forms.

---

## 6. Before and after

| Measure | Before | After |
|---|---|---|
| Pages with no internal links (orphans) | 32 (+ 32 city pages with 0–4 links) | **2** (webinar ad pages, pending decision) |
| Internal links to each city page | 0–4 | **~157** |
| Pages more than 3 clicks from the home page | 2 at depth 4, plus 32 unreachable | **0** |
| Internal links to `/page/` (duplicate URLs) | 168 | **0** |
| Pages split across two URLs | 4 | 0 (Google needs to recrawl) |
| Reachable Mohali page | No | **Yes** |
| Meta descriptions > 160 chars | 27 | **0** |
| Titles > 65 chars | 13 | **6** (city titles, by design) |
| Pages defining the organisation entity | 2 | **145** |
| Bylines linked to /about | 0 | **145** |
| Pages with a direct answer block | 143 | **146** |
| Invalid Event schema | 1 | **0** |
| Stale "upcoming" statements about past dates | 3 | **0** |
| `max-image-preview:large` | 0 | **159** |
| CSS/JS revalidation requests per repeat page view | 2 | **0** (1-year cache) |
| Lead forms asking for email | 9 | **0** |
| Sitemap URLs | 158 | **159** (+ TCF centres page) |

---

## 7. Structured data

**Inventory after fixes** (number of indexable pages using each type)

| Type | Pages | Notes |
|---|---|---|
| BreadcrumbList | 147 | Every item points to a real page |
| FAQPage | 144 | Questions match the visible FAQ |
| EducationalOrganization (`#org`) | 146 | Name, URL, logo and sameAs (YouTube) on every page that references it |
| Article | 106 | headline, dates, image; author and publisher resolve to `#org` |
| WebPage | 41 | Landing and tool pages |
| Service + Offer + City | 31–38 | City pages. Indian city pages show only Self-Paced ₹4,999; Canada and UAE pages have no PrepEve prices |
| WebApplication | 11 | Calculators (free, Offer price 0) |
| Course + CourseInstance | 7 | About and coaching pages. Only Self-Paced has a price |
| WebSite | 6 | Home and landing pages |
| Person | 1 | /about: Sanjita, Lesancy Sharma, Khushpreet (as shown on the page) |

**Not used, on purpose**

- LocalBusiness: there's no address (online only).
- AggregateRating and Review: self-serving reviews aren't eligible, and Google reviews can't be re-marked up.
- HowTo: deprecated.
- Event for the webinar: a recurring event needs real dates.

**Next steps**

- Add official profile URLs to `sameAs`: Instagram, Facebook, LinkedIn and the Google Business Profile, once you confirm them.
- Add Person schema for article reviewers only if real reviewer names and credentials are provided.

---

## 8. AEO: AI Overviews, ChatGPT Search, Perplexity, Copilot, Gemini

**Already in place (verified)**

- AI crawlers are explicitly allowed in robots.txt.
- `llms.txt` lists the main pages with descriptions.
- Most pages open with a direct answer (`p.answer`), then a key-facts list, tables, and an FAQ that matches its schema.
- Facts carry dates ("Last updated", "checked on") and link to official sources (IRCC, IDP, Pearson, ETS, Alliance Française, France Éducation international).
- Pages are plain static HTML, so every crawler sees the full content with no JavaScript rendering needed.

**Improved in this audit**

- One consistent organisation entity on every page, and bylines that link to the team page.
- Direct answers on the 3 older guides, and stale statements corrected. Out-of-date facts are the quickest way to lose AI citations.
- A hub-and-pillar structure, so each topic cluster reads as a body of related content:
  - IELTS: /ielts-preparation
  - Canada PR: /canada-pr-process-from-india and /canada-pr-language-requirements
  - Tests: /language-tests
  - French: /french-for-canada-pr

**Recommendations**

- Keep the "answer first, then evidence" pattern on every new page. Date every fee and rule, and link the official source.
- Get PrepEve mentioned on third-party sites (directories, Quora/Reddit answers, partner blogs). AI engines cite sources that others corroborate.
- Add real reviewer bios with credentials on Canada PR pages, if the founder reviews them.

---

## 9. Performance

Measured locally in Chromium with Pixel 5 emulation and no network throttling. The live site can't be reached from the audit sandbox, so real-user Core Web Vitals should be read from Search Console's Core Web Vitals report.

| Page type | LCP element | CLS | Transfer | Requests |
|---|---|---|---|---|
| Home | H1 text | 0.000 | ~550 KB | 25 |
| City page | Answer paragraph | 0.000 | ~200 KB | 11 |
| Guide | Answer paragraph | 0.000 | ~200 KB | 11 |
| CRS calculator | Answer paragraph | 0.000 | ~150 KB | 8 |
| Book demo | H1 text | 0.000 | ~527 KB | 22 |

**Strengths**
- One small CSS file and deferred JS.
- Preloaded fonts with swap.
- Lazy-loaded WebP images with dimensions.
- YouTube videos load only on click.

**Changed:** CSS/JS are now cached for a year. The site-check fails if a page references an outdated `?v=` stamp, so nobody can ship CSS that browsers never refresh.

**Remaining:** YouTube WebP thumbnails (minor); review the Google tag's effect on INP if Search Console flags it.

---

## 10. Decisions needed (potentially destructive, not done)

1. **Merge /online-ielts-coaching-india into /best-online-ielts-coaching-india** with a 301 redirect.
   - Impact: one stronger page for "online IELTS coaching India". The weaker URL (pos 36.5, 2 internal links) disappears, and its few signals pass on.
   - Risk: low. The content would need a short merged section.
2. **Noindex /ielts-band-7, /ielts-canada-pr and /ielts-retake** (webinar ad landing pages) and remove them from the sitemap.
   - Impact: organic signals concentrate on /webinar. The ads keep working, since noindex doesn't affect Google Ads.
3. **City pages: differentiate or consolidate.**
   - Recommended: add verified local content to the 10 city pages with the most impressions: Lucknow, Vadodara, Mumbai, Ludhiana, Edmonton, Calgary, Ambala, Surrey, Jaipur, Delhi. That means real nearby test venues, local exam context and student goals, written only from verified sources.
   - Alternative: consolidate the most similar pages (Calgary, Edmonton and Winnipeg into the Canada page) with 301s.

---

## 11. Content and topical authority

**Gaps from Search Console queries**

| Gap | Evidence | Action |
|---|---|---|
| TCF Canada centres by city | ~190 impr ("tcf bhopal", "tcf kolkata"…) | **Done** (#130) |
| IELTS coaching and course fees | ~514 impr, pos 7–13, 1 click | Needs a pricing decision or sourced market ranges (M12) |
| IELTS band descriptors | ~54 impr, pos 9–10; page only 517 words | Expand with official descriptor detail |
| How long to prepare for IELTS | 224 impr, pos 9.0; 461 words | Expand with study-hour guidance by starting band (cite sources) |
| CLB 9 in IELTS | 125 impr, pos 9.4 (8777 page) | Strengthen CLB 9 wording and the CRS table |
| Total cost of Canada PR from India | 60 impr, pos 6.4, 0 clicks | Add a total-cost summary to /canada-pr-fees, built from its existing figures |
| IELTS sample questions / examples | ~205 impr, pos 42–44 | Needs more practice content and backlinks |

**Pillars:** IELTS preparation, Canada PR process, language tests, French for Canada PR. All four now link to every page in their cluster.

**Cannibalisation:** see H6 and M10. /ielts-coaching-canada ("coaching in Canada") and /ielts-coaching-for-canada ("for Canada PR") serve different intents. Keep both, and monitor.

---

## 12. Off-page opportunities

Moving from position 8–12 into the top 3 depends mostly on authority from other sites.

1. **YouTube:** add a link to the matching page in every video description (CRS calculator, 8777, TCF centres, city pages).
2. **Google Business Profile:** website link, weekly posts and service areas. No address is needed for an online business.
3. **Education directories and listings,** such as UrbanPro and Sulekha, with a consistent name and a website link.
4. **Answer questions** on Quora and Reddit (r/IELTS, r/ImmigrationCanada) with a link to the relevant guide. Be helpful, not promotional.
5. **Promote the free tools as linkable assets:** CRS calculator, IELTS-to-CLB, TEF/TCF-to-NCLC.
6. **Partners:** ask immigration consultants and study-abroad blogs to link to the calculators or guides.
7. **Bing Webmaster Tools:** verify the site and submit the sitemap. The IndexNow key file is already in place.

---

## 13. Roadmap

| When | Work |
|---|---|
| This week (owner) | Request indexing in Search Console for /ielts-coaching-mohali, /tcf-canada-exam-centres-india, /ielts-preparation, /canada-pr-language-requirements and /canada-pr-process-from-india. Decide on section 10. Add YouTube description links. |
| Weeks 1–3 | Apply the approved merges and noindex changes. Start city-page differentiation (top 10). Expand the 4 thin pages. |
| ~24 November | Review city-page titles and positions, three weeks after the 3 November title change. |
| Month 1–2 | Fees page decision (M12); CLB 9, band descriptors and total-cost upgrades; page-specific OG images; reviewer bios if available. |
| Month 2–3 | Off-page programme (section 12), new content for the gaps in section 11, then re-audit. |

---

## 14. Re-running the checks

- `NODE_PATH=$(npm root -g) node scripts/site-check.js`: links, H1, claims, JSON-LD, FAQ visibility, layout, JS errors, asset version.
- After editing `assets/css/prepeve.css` or `assets/js/prepeve.js`, run `sh scripts/bump-assets.sh`. The site-check fails until you do.
