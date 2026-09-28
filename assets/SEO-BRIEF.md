# PrepEve SEO / GEO content brief

Binding for every content page. Read together with `assets/COPY-BRIEF.md` (voice + CLAIMS LEDGER). Not deployed.

## Source of truth (PrepEve facts)
Only facts in the COPY-BRIEF claims ledger. Summary:
- PrepEve: online IELTS (Academic & General Training) coaching + French for Canada PR; based in India and Canada (owner-confirmed); core offering and main differentiator is ONLINE IELTS coaching; students join from anywhere. No city/office details verified.
- Live Coaching ₹14,999 (30 days): alternate-day live sessions of 1.5 hrs, max 5 students per batch, 1-on-1 speaking mock interviews, unlimited writing evaluations, 5 full-length mock tests, WhatsApp doubt support.
- 1-on-1 Mentorship ₹19,999 (30 days): dedicated coach, alternate-day 1-on-1 sessions (1.5 hrs), custom study plan, priority feedback within 4 hours, everything in Live Coaching.
- Self-Paced ₹4,999 (30-day access): 30 recorded lectures, all 4 modules, 2 mock tests, notes, WhatsApp support for queries.
- Exam-Cleared Guarantee (Live + Mentorship only): attend every session, submit every practice task, take every mock test — if you still don't clear your exam, full fee refunded. Always show the conditions with it. Full terms page is not yet published → say "conditions apply; ask us on WhatsApp for the full terms".
- 15,000+ students trained; 4.7★ on Google from 300+ reviews; 6,000+ students taught French.
- Trainers: Sanjita (founder & trainer, Regulated Canadian Immigration Consultant), Lesancy Sharma (master trainer), Khushpreet (trainer).
- Free: live demo class (level assessed, study plan to keep) → /book-demo; free 60-min live webinar Sat & Sun 7:00 PM IST → /webinar.
- Real outcomes: Taranjeet (Canada PR) 6.5 → 8.5 in 30 days; Pratishtha (UCL, UK) 6.0 → 8.0; Deepanshu 6.5 → 7.5; Google reviews by Anooj Motghare (8.5), Yashaswini Palakonda (8.0), Shashikanth Revelly (7.5) — exact review links are on the homepage.
- NOT verified (never state): physical office/city, years in business, trainer years of experience or certifications beyond the above, pass rates beyond "97% of our students hit Band 7+ (PrepEve student data)" (max once per page, never in a heading), batch start dates, recordings policy.
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
7. "Where PrepEve fits" section — factual, from the source of truth, with the guarantee conditions if mentioned.
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
