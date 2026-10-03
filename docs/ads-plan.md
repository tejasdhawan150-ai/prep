# PrepEve ad plan — IELTS (Google + Meta)

Offers: **Free IELTS webinar** (`/webinar`) and **Free IELTS assessment class** (`/book-demo`). French excluded for now.
Budget: ₹1,000–3,000/day. Location: all of India. Written 3 Oct 2026.

---

## 1. Budget split (start at ₹2,000/day, adjust after 7 days)

| Campaign | Platform | Daily | Landing page | Goal |
|---|---|---|---|---|
| G1 · Search · IELTS Webinar | Google | ₹600 | /webinar | Webinar registrations |
| G2 · Search · IELTS Coaching (demo) | Google | ₹600 | /book-demo | Demo bookings |
| M1 · Leads · IELTS Webinar | Meta | ₹800 | /webinar | Webinar registrations |

At ₹1,000/day: run G1 (₹400) + M1 (₹600) only. At ₹3,000/day: G1 ₹800, G2 ₹1,000, M1 ₹1,200.
Rule: don't change budgets or ads for the first 7 days unless something is broken. Then move money to whichever campaign has the lowest cost per lead.

---

## 2. Tracking (do this first)

- **Google Ads conversion** `AW-765652199/zZIDCPHd74McEOfZi-0C` already fires on webinar and demo form submits. In Google Ads → Goals → Conversions, check it shows "Recording conversions".
- **GA4** is installed (G-VR61XWFSW3). In GA4 → Admin → Events, mark `generate_lead` as a key event, then import it into Google Ads as a secondary conversion.
- **Meta Pixel**: create one in Meta Events Manager and send me the Pixel ID. I add it in one line (`PV_META_PIXEL_ID` in `assets/js/prepeve.js`); the site already fires PageView, Lead (thank-you page) and Contact (WhatsApp clicks). Without the pixel, M1 cannot optimise.
- Recommended: separate conversion actions "Webinar registration" and "Demo booking" in Google Ads (send me both labels) so each campaign optimises for its own lead.

---

## 3. Google Search campaigns

**Settings for both:** Search network only (untick Display), Location: India — "Presence: people in or regularly in". Language: English + Hindi. Bidding: start with **Maximise clicks** (cap ₹25 CPC) for 2 weeks, then switch to **Maximise conversions** once you have 15+ conversions. Ad schedule: all day. Devices: all.

### G1 · IELTS Webinar → /webinar

**Ad group: free webinar / class** (phrase match)
```
"ielts free class"
"free ielts webinar"
"ielts free online class"
"free ielts coaching online"
"ielts free demo class"
"free ielts preparation"
```
**Ad group: how to improve** (phrase match)
```
"how to get 7 in ielts"
"how to improve ielts score"
"ielts band 7 tips"
"ielts writing tips"
"ielts speaking tips"
```

**Headlines (≤30 chars, all checked):**
Free IELTS Webinar · Free Live IELTS Session · Sat & Sun, 7 PM IST · Find Where You Lose Marks · 60-Min Live Class, Free · Rated 4.7★ on Google · 15,000+ Students Trained · Know What to Fix First · Stuck at Band 6.5? · Reserve Your Free Seat · Online, Join on Your Phone · Academic & General Training · No Payment Needed · Get Your Link on WhatsApp · Plan Your Band 7 Prep

Pin "Free IELTS Webinar" to position 1.

**Descriptions (≤90 chars):**
1. Free 60-minute live IELTS session. See how examiners mark you and what to fix first.
2. Every Sat & Sun, 7 PM IST. Join on your phone. Link sent on WhatsApp. No payment.
3. Rated 4.7★ on Google from 300+ reviews. 15,000+ students trained online.
4. Missed your band by 0.5? Learn which skill is costing you marks. Reserve your seat.

### G2 · IELTS Coaching → /book-demo

**Ad group: online coaching** (phrase match)
```
"online ielts coaching"
"ielts online classes"
"ielts coaching online india"
"best online ielts coaching"
"ielts coaching near me"
"ielts classes"
"ielts coaching"
```
**Ad group: Canada PR / general training** (phrase match)
```
"ielts general training coaching"
"ielts coaching for canada pr"
"ielts for canada pr"
```

**Headlines (≤30 chars):**
Online IELTS Coaching · Free IELTS Assessment Class · Live Online IELTS Classes · Trainer Marks Every Essay · 1-on-1 Speaking Mocks · Rated 4.7★ on Google · 15,000+ Students Trained · Plans From ₹4,999 · Book Your Free Class · Find Your Score Gaps · Academic & General Training · IELTS Coaching for Canada PR · Join From Anywhere in India · WhatsApp Doubt Support · 5 Full-Length Mock Tests

**Descriptions (≤90 chars):**
1. Live online IELTS coaching. A trainer finds where you lose marks and fixes them with you.
2. Free assessment class: your level checked and a study plan to keep. No payment.
3. Every essay marked by a trainer. 1-on-1 speaking mocks. 5 full mock tests.
4. Plans from ₹4,999. Rated 4.7★ on Google from 300+ reviews. Book on WhatsApp.

### Negative keywords (add to both campaigns, account-level list)
```
pdf, free download, book pdf, cambridge book, answer key, result, results, score check,
registration, exam date, exam fee, test date, idp login, british council login, slot booking,
job, jobs, vacancy, salary, trainer job, teacher job, franchise, meaning, full form,
pte, toefl, duolingo, celpip, oet, french, tef, tcf, delf
```
(Remove "pte" etc. later if you advertise those tests.)

### Assets (extensions)
- **Sitelinks:** Free IELTS Webinar → /webinar · Free Assessment Class → /book-demo · Plans & Fees → /online-ielts-coaching-india · IELTS Band Calculator → /ielts-band-calculator
- **Callouts:** Live Online Classes · Trainer-Marked Essays · 1-on-1 Speaking Mocks · WhatsApp Support · No Payment for Free Class
- **Structured snippet (Courses):** Self-Paced, Live Coaching, 1-on-1 Mentorship
- **Call asset:** +91 98777 14284 (only during hours someone answers)
- **Price asset:** Self-Paced ₹4,999 · Live Coaching ₹14,999 · 1-on-1 Mentorship ₹19,999

---

## 4. Meta campaign (Facebook + Instagram)

**M1 · Leads → /webinar** — Objective: **Leads**, conversion location **Website**, event **Lead** (needs the Pixel). Advantage+ placements. Location India, age 18–40.

**Audiences (one ad set each to start, ₹400/day each):**
- **A · Interests:** IELTS, International English Language Testing System, Study abroad, Express Entry / Immigration to Canada, IDP Education, British Council.
- **B · Advantage+ audience** (broad, let Meta find people) with the same interests as suggestions.
After 7 days, keep the cheaper one.

**Creative (3 ads per ad set):**
1. **Scorecard image** — one of the redacted report forms (e.g. GT 8.5). Square 1080×1080.
2. **Review image** — Anooj's or Meera's Google review screenshot, large.
3. **Sanjita video (best performer usually)** — 20–30 s phone video, Sanjita speaking: "Most students at 6.5 are losing marks in one skill. In our free 60-minute webinar this weekend I'll show you which one. Link below."

**Primary text options:**
- Stuck at 6.5? Most students lose marks in one skill and don't know which. Our free 60-minute live IELTS webinar shows you how examiners mark you and what to fix first. Every Sat & Sun, 7 PM IST. Join on your phone.
- Before you pay for another IELTS attempt, spend one free hour finding out where your marks are going. Live session, every weekend, 7 PM IST. Rated 4.7★ on Google from 300+ reviews.

**Headline:** Free IELTS Webinar · Sat & Sun 7 PM
**Description:** Free · Live online · No payment
**Button:** Sign Up

---

## 5. Rules (keep ads approved and honest)
- No "guaranteed band", "100% success", "#1" or "best" claims. No score promises in ads.
- Only real numbers: 4.7★ (300+ reviews), 15,000+ students, prices above.
- Don't say "only 5 seats left" or fake countdowns.
- Meta may reject before/after framing about personal attributes; phrase as "Stuck at 6.5?" not "You are failing".

## 6. What to send me after 7 days
Screenshots of: Google Ads campaigns (clicks, CPC, conversions, cost/conversion), Search terms report, Meta Ads Manager (results, cost per result, CTR). Target to aim for: webinar lead under ₹100–150, demo booking under ₹300–500. I'll then cut the losers, add negatives, and write new ads.
