# Product Requirements Document (PRD)
**Product:** AutoPro Garage Website
**Version:** 1.0
**Owner:** Brian Mugambi Mbaabu — CEO & Founder
**Last updated:** 2026-10-05

---

## 1. Problem & Opportunity
Vehicle owners in Kenya struggle to find a trustworthy, transparent repair workshop that communicates clearly, prices fairly and schedules on time. AutoPro Garage already serves 18,000+ customers; a premium digital front door converts walk-ins to bookings and signals a tier change from "mechanic" to "automotive brand."

## 2. Goals
| # | Goal | Metric | Target Q4 2026 |
|---|---|---|---|
| 1 | Make bookings easy on mobile | Mobile form completion rate | ≥ 55% |
| 2 | Shorten booking lead time | Booking → confirmed on WhatsApp | ≤ 10 min median |
| 3 | Signal premium quality | Average Lighthouse Performance | ≥ 90 |
| 4 | Capture organic traffic | Indexed pages, LCP | 100% indexed, LCP ≤ 2.5s |
| 5 | Give operations visibility | % bookings handled via dashboard | 100% |

## 3. Non-goals
- No online payments (M-Pesa Paybill contact only, for now).
- No real-time repair tracking (phase 2).
- No multi-branch booking logic (single workshop in Nairobi).

## 4. Users & personas
- **Nairobi Driver (primary):** 28–55, Millennials/Gen X, owns a mid-to-premium car. Books by phone or WhatsApp. Values trust, speed, cleanliness, English/Swahili communication.
- **Fleet Manager:** books in batches, needs invoicing and status visibility.
- **Insurance Assessor:** needs clear repair reports.
- **Admin / Service Advisor (AutoPro staff):** triages bookings, updates status, handles WhatsApp replies.

## 5. User stories
1. As a driver, I can book a service in under 90 seconds on my phone and continue the chat on WhatsApp.
2. As a driver, I can see before/after transformations to trust the quality.
3. As a driver, I can view services, mission, team and testimonials without clutter.
4. As a service advisor, I can see new bookings in a dashboard and mark them Confirmed / In-Progress / Completed.
5. As a visitor, I can read the privacy policy and manage cookie consent.

## 6. Scope — v1
### Public site
- Hero · Before/After gallery · Services (8) · Mission/Vision/Values · Stats · Hierarchy · Testimonials · Contact + Map · Footer with partners & sitemap link.
- Floating WhatsApp CTA.
- Pages: `/`, `/privacy`, `/terms`.

### Booking API
- `POST /api/bookings` → persist + return WhatsApp URL.
- Validation (Zod), rate-limit (5/min/IP), IP hashing for privacy.

### Admin
- `/admin/login` — email + password, JWT (httpOnly, 8h).
- `/admin/dashboard` — list, filter, search, update status.
- Audit log on status changes.

### Compliance
- Cookie banner (necessary / analytics / marketing).
- GDPR + Kenya DPA 2019 Privacy Policy.
- Right of access / erasure contact.

## 7. Success criteria
- Lighthouse mobile ≥ 90 Performance, 100 Accessibility, 100 SEO.
- WhatsApp redirect works on first click from mobile.
- Admin can log in and manage bookings in staging.
- All forms respect reduced-motion and screen-reader labels.

## 8. Risks
| Risk | Mitigation |
|---|---|
| WhatsApp number changes | Env var `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| Neon downtime | Vercel can retry; graceful 500 page |
| Admin password leak | Bcrypt + 5-attempt rate limit + rotate secret |
| Image hotlinking cost | Switch to signed `next/image` with Vercel caching |

## 9. Milestones
- M1 — Scaffold, DB, booking flow (done at v1.0 of this repo).
- M2 — Content polish, real workshop photography.
- M3 — Fleet account portal, M-Pesa STK push integration.
