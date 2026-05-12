# PRICING_DATA.md

All prices are USD per seat per month unless otherwise noted.
Every figure in `audit.ts` traces back to an official vendor pricing page.
Verified: **May 2026**

---

## Cursor

| Plan     | Price           | Source                                         |
| -------- | --------------- | ---------------------------------------------- |
| Hobby    | $0/month        | https://cursor.com/pricing — verified May 2026 |
| Pro      | $20/seat/month  | https://cursor.com/pricing — verified May 2026 |
| Pro+     | $60/seat/month  | https://cursor.com/pricing — verified May 2026 |
| Ultra    | $200/seat/month | https://cursor.com/pricing — verified May 2026 |
| Business | $40/seat/month  | https://cursor.com/pricing — verified May 2026 |

**Plan notes:**

- Pro+: Everything in Pro + 3x usage on all OpenAI, Claude, Gemini models
- Ultra: Everything in Pro + 20x usage + priority access to new features
- Business: Centralised admin controls and SSO

---

## GitHub Copilot

| Plan       | Price          | Source                                                  |
| ---------- | -------------- | ------------------------------------------------------- |
| Pro        | $10/seat/month | https://github.com/features/copilot — verified May 2026 |
| Pro+       | $39/seat/month | https://github.com/features/copilot — verified May 2026 |
| Business   | $19/seat/month | https://github.com/features/copilot — verified May 2026 |
| Enterprise | $39/seat/month | https://github.com/features/copilot — verified May 2026 |

**Plan notes:**

- Pro: Formerly "Individual" — same capabilities, renamed May 2025
- Pro+: Higher request limits + access to additional frontier models
- Business: Org-level policy management and admin controls
- Enterprise: SAML SSO, audit logs, fine-grained policy controls

---

## Claude (Anthropic)

| Plan       | Price                        | Source                                            |
| ---------- | ---------------------------- | ------------------------------------------------- |
| Free       | $0/month                     | https://anthropic.com/pricing — verified May 2026 |
| Pro        | $20/seat/month               | https://anthropic.com/pricing — verified May 2026 |
| Max        | $100/seat/month              | https://anthropic.com/pricing — verified May 2026 |
| Team       | $25/seat/month (min 5 seats) | https://anthropic.com/pricing — verified May 2026 |
| Enterprise | Custom / negotiated          | https://anthropic.com/pricing — verified May 2026 |

**API pricing (pay-as-you-go):**

- Claude Haiku 3.5: ~$0.25/MTok input — https://anthropic.com/pricing — verified May 2026
- Claude Sonnet 4: ~$3.00/MTok input — https://anthropic.com/pricing — verified May 2026

**Plan notes:**

- Max: 5x message limits vs Pro — justified only for 100+ messages/day users
- Team: Adds collaborative workspaces and admin controls (min 5 seats)

---

## ChatGPT (OpenAI)

| Plan       | Price               | Source                                                 |
| ---------- | ------------------- | ------------------------------------------------------ |
| Go         | $8/month            | https://openai.com/chatgpt/pricing — verified May 2026 |
| Plus       | $20/month           | https://openai.com/chatgpt/pricing — verified May 2026 |
| Pro        | $100/month          | https://openai.com/chatgpt/pricing — verified May 2026 |
| Business   | $20/seat/month      | https://openai.com/chatgpt/pricing — verified May 2026 |
| Enterprise | Custom / negotiated | https://openai.com/chatgpt/pricing — verified May 2026 |

**API pricing (pay-as-you-go):**

- GPT-4o: $2.50/MTok input — https://openai.com/api/pricing — verified May 2026
- GPT-4o-mini: $0.15/MTok input — https://openai.com/api/pricing — verified May 2026

**Plan notes:**

- Go: Basic tier — more GPT-5.5 Instant access, limited features
- Pro: 5x–20x usage, GPT-5.5 Pro access, unlimited file uploads
- Business: Same price as Plus + SAML SSO, MFA, admin controls, 60+ app integrations

---

## Gemini (Google)

| Plan     | Price         | Source                                                 |
| -------- | ------------- | ------------------------------------------------------ |
| Free     | $0/month      | https://one.google.com/about/plans — verified May 2026 |
| AI Plus  | $7.99/month   | https://one.google.com/about/plans — verified May 2026 |
| AI Pro   | $19.99/month  | https://one.google.com/about/plans — verified May 2026 |
| AI Ultra | $249.99/month | https://one.google.com/about/plans — verified May 2026 |

**Plan notes:**

- AI Plus: 200 GB storage, enhanced Gemini 3.1 Pro access, limited Veo 3.1 Lite
- AI Pro: 5 TB storage, higher limits, Gemini Code Assist, Jules coding agent, Gemini CLI
- AI Ultra: 30 TB storage, highest limits, Veo 3 video generation, Deep Think, Genie 3, YouTube Premium

---

## Windsurf (Codeium)

| Plan       | Price               | Source                                           |
| ---------- | ------------------- | ------------------------------------------------ |
| Free       | $0/month            | https://windsurf.com/pricing — verified May 2026 |
| Pro        | $20/month           | https://windsurf.com/pricing — verified May 2026 |
| Max        | $200/month          | https://windsurf.com/pricing — verified May 2026 |
| Teams      | $40/seat/month      | https://windsurf.com/pricing — verified May 2026 |
| Enterprise | Custom / negotiated | https://windsurf.com/pricing — verified May 2026 |

**Plan notes:**

- Pro: Increased quotas, frontier model access (OpenAI, Claude, Gemini), Devin Cloud sessions
- Max: Significantly higher quotas than Pro
- Teams: Centralised billing, admin dashboard with analytics, automated zero data retention

---

## Audit Engine Notes

- **API direct plans** have no fixed per-seat price. The engine uses actual `monthlySpend` values entered by the user and applies percentage-based optimisation estimates grounded in publicly documented model token pricing above.
- **Enterprise plans** (Claude, ChatGPT, Windsurf) are custom/negotiated. The engine flags them for manual review rather than inventing a savings figure.
- **Savings estimates are conservative.** Actual savings depend on usage patterns, prompt lengths, caching implementation specifics, and seat utilisation rates.
