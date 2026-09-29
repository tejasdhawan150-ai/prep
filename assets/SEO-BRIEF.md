# PrepEve SEO / GEO content brief

Binding for every content page. Read together with `assets/COPY-BRIEF.md` (voice + CLAIMS LEDGER). Not deployed.

## Source of truth (PrepEve facts)
Only facts in the COPY-BRIEF claims ledger. Summary:
- PrepEve: online IELTS (Academic & General Training) coaching + French for Canada PR; based in India and Canada (owner-confirmed); core offering and main differentiator is ONLINE IELTS coaching; students join from anywhere. No city/office details verified.
- Live Coaching ₹14,999 (30 days): alternate-day live sessions of 1.5 hrs, max 5 students per batch, 1-on-1 speaking mock interviews, unlimited writing evaluations, 5 full-length mock tests, WhatsApp doubt support.
- 1-on-1 Mentorship ₹19,999 (30 days): dedicated coach, alternate-day 1-on-1 sessions (1.5 hrs), custom study plan, priority feedback within 4 hours, everything in Live Coaching.
- Self-Paced ₹4,999 (30-day access): 30 recorded lectures, all 4 modules, 2 mock tests, notes, WhatsApp support for queries.
- Guarantee: REMOVED by the owner (29 Sep 2026). Never mention a money-back, exam-cleared or score guarantee.
- 15,000+ students trained; 4.7★ on Google from 300+ reviews; 6,000+ students taught French.
- Trainers: Sanjita (founder & trainer, Regulated Canadian Immigration Consultant), Lesancy Sharma (master trainer), Khushpreet (trainer).
- Free: live demo class (level assessed, study plan to keep) → /book-demo; free 60-min live webinar Sat & Sun 7:00 PM IST → /webinar.
- Real outcomes: Taranjeet (Canada PR) 6.5 → 8.5 in 30 days; Pratishtha (UCL, UK) 6.0 → 8.0; Deepanshu 6.5 → 7.5; Google reviews by Anooj Motghare (8.5), Yashaswini Palakonda (8.0), Shashikanth Revelly (7.5) — exact review links are on the homepage.
- NOT verified (never state): physical office/city, years in business, trainer years of experience or certifications beyond the above, any pass rate (the 97% figure is removed), batch start dates, recordings policy.
If a page needs a fact not listed → `[VERIFY: …]` in an HTML comment and leave it out of visible copy.

## Competitor & external facts
Only from `research/sources.md` (official sources, dated). Cite inline as a numbered source list at the end of the page ("Sources", with links and "checked September 2026"). Never rank providers, never say best/worst/#1/winner about any company. Compare documented characteristics only. Unknown cells → "Not published".

## Page structure (answer-engine friendly)
1. Breadcrumb (Home › [Hub] › Page) + BreadcrumbList JSON-LD.
2. H1 exactly matching the search intent.
3. **Direct answer** paragraph of 40–60 words right under the H1 (class `answer`), answering the query plainly.
4. "Last updated: 28 September 2026" line + "Written by the PrepEve team" (no fake author bios).
5. Key facts box where relevant (dl or short table).
6. H2s phrased as the questions people ask; each H2 is followed immediately by a 1–3 sentence direct answer, then detail (lists, tables).
7. "Where PrepEve fits" section — factual, from the source of truth.
8. FAQ (4–8 real questions) rendered as `<details>` in `.faq`; FAQPage JSON-LD ONLY mirroring the visible text exactly.
9. Contextual CTA matched to intent (see below), related pages block, Sources list.
Target 900–1,800 words of genuinely useful content; no filler.

## Writing rules
No "In today's fast-paced world", "whether you're…", "look no further", "unlock", "embark", "comprehensive and holistic", "journey", "game-changer". Short sentences, plain English for non-native readers. Every paragraph answers, proves, explains a decision, shows expertise or helps choose.

## CTA by intent
- Research/fees/"best" queries (early): "Attend the free IELTS webinar" (/webinar) + "Estimate my band" (/ielts-band-calculator).
- Skill queries (writing/speaking/band 7): "Book a free demo class — get your level assessed" (/book-demo).
- Comparison / PrepEve-named queries (late): "Compare PrepEve's programs" (/#pricing) + "Book a free demo class" (/book-demo) + WhatsApp.
- Country pages: webinar + matching ad page is NOT linked (noindex); link /book-demo and the relevant guide.
Use `data-cta="<slug>-<position>"` on every CTA.

## Internal linking hub
Hub: /ielts-preparation/ (links to every guide/page). Every page links: to the hub (breadcrumb), to 2–4 closely related pages with descriptive anchors (vary the wording; don't repeat exact-match anchors), and to one conversion page.
Pages: /ielts-preparation/ (hub) · /best-online-ielts-coaching-india/ · /ielts-coaching-fees-india/ · /best-ielts-coaching-for-band-7/ · /ielts-coaching-for-working-professionals/ · /ielts-writing-coaching/ · /ielts-speaking-coaching/ · /ielts-coaching-for-canada/ · /ielts-coaching-for-uk/ · /ielts-coaching-for-australia/ · /prepeve-vs-british-council/ · /prepeve-vs-idp/ · /prepeve-vs-jamboree/ · /prepeve-vs-manya/ · /prepeve-vs-leap-scholar/ · existing: /ielts-guide/band-scores/ · /ielts-guide/writing-task-2-mistakes/ · /ielts-guide/general-vs-academic-canada-pr/ · /ielts-band-calculator/ · /about/ · /webinar · /book-demo · /book-demo-french

## Template
Copy structure from `/ielts-guide/band-scores/index.html` (head, nav, footer, article layout, CSS classes, gtag, fonts, versioned CSS/JS links `?v=…` — copy the exact current href). Canonical `https://www.prepeve.com/<path>` (no trailing slash in canonical, matches `trailingSlash:false`). `index, follow`. OG/Twitter with `https://www.prepeve.com/og-image.jpg`. JSON-LD `@graph`: `Article` (headline, description, datePublished/dateModified 2026-09-28, author+publisher `{"@id":"https://www.prepeve.com/#org"}`, mainEntityOfPage), `BreadcrumbList`, optional `FAQPage`. No AggregateRating/Review schema.

## Language & PR clusters (added 28 Sep 2026 — overrides earlier sections where they conflict)
Owner decisions:
- PrepEve is ONLINE. Never mention an address, office, centre or city location. "Online coaching, based in India and Canada" is the only location statement.
- No generic "Sources" citation lists. BUT every page that mentions immigration/visa rules or official test facts carries a compact "Official resources" box (links only to government / test-owner sites) plus "Last reviewed: 28 September 2026 — requirements change, so confirm on the official page before applying."
- Make PrepEve the confident recommendation ("why students choose PrepEve") using verified facts; never "#1/best" as a stated fact.

What PrepEve coaches (verified from the owner's original site):
- English tests: IELTS (Academic & General), PTE, CELPIP, TOEFL, Duolingo English Test — same trainers (Sanjita, Lesancy Sharma, Khushpreet). IELTS prices/features are in the ledger; for PTE/CELPIP/TOEFL/Duolingo prices and course structure → "ask us on WhatsApp for current batches and fees" (not published).
- French for Canada PR: live online classes toward NCLC 7; DELF, TEF Canada and TCF Canada preparation; 6,000+ students taught French; free French demo at /book-demo-french. French prices not published → ask on WhatsApp.
- OET: out of scope (owner decision). Do not create OET pages or mention OET.

Immigration content rules:
- Coaching ≠ immigration advice. Attribute rules: "According to IRCC…", "According to the Department of Home Affairs…", "According to UK Visas and Immigration…". Never promise PR, visa, CRS points, admission or jobs from a course or score. Add a one-line note: "PrepEve provides language coaching, not immigration advice."
- Official sites cannot be fetched from the build environment, so ONLY state stable, long-standing facts; anything numeric that changes (CRS cut-offs, per-program score minimums, Australian band thresholds, UK CEFR levels, test fees, TEF/TCF→NCLC score tables) → do not state the number; explain the concept and link the official page.
- Stable facts you may state: Express Entry requires an approved language test less than 2 years old; approved English tests for Express Entry are IELTS General Training, CELPIP-General and PTE Core; approved French tests are TEF Canada and TCF Canada; results convert to CLB (English) / NCLC (French) levels; CELPIP levels map one-to-one to CLB levels (CELPIP 7 = CLB 7); French NCLC 7+ in all four skills gives up to 50 additional CRS points (50 if English is CLB 5+, 25 if CLB 4 or lower); IELTS General→CLB table (copy from /ielts-guide/general-vs-academic-canada-pr/); Australia skilled visas define Competent / Proficient / Superior English and accept several tests incl. IELTS and PTE Academic; UK visas need a Secure English Language Test (SELT) from an approved provider (IELTS for UKVI is one); TOEFL is mainly used for university admissions.
Official links to use (from docs/competitor-sources-VERIFY.md and well-known official domains): canada.ca IRCC language test pages, immi.homeaffairs.gov.au English language pages, gov.uk SELT/knowledge-of-English pages, ielts.org, pearsonpte.com, celpip.ca, lefrancaisdesaffaires.fr (TEF Canada), france-education-international.fr (TCF Canada), ets.org/toefl.

Page template for clusters: same as above (copy /ielts-writing-coaching/index.html structure, drop its Sources block, keep versioned CSS/JS hrefs). Add a TOC for pages > 900 words. Every page links: its cluster hub, 2–4 siblings, /language-tests (master hub) in the breadcrumb, and one conversion page.
Cluster hubs: /language-tests (master) · /french-for-canada-pr (French pillar) · /canada-pr-language-requirements (Canada PR) · /australia-pr-english-test (Australia) · /pte · /celpip · /toefl · /ielts-preparation (IELTS, exists).
