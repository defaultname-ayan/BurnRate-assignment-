# Economics

## Unit Economics

### What a lead is worth to Credex

Credex's model is managing AI spend for startups and taking a percentage of
savings negotiated. Assume:

- Average startup AI spend: $500/month ($6,000/year)
- Credex negotiates 20% savings on average: $100/month ($1,200/year)
- Credex fee: 30% of savings = $30/month per customer ($360/year)
- Average customer lifetime: 18 months
- LTV per customer: $30 × 18 = **$540**

### Funnel assumptions

| Stage | Rate | Number |
|---|---|---|
| Audit completed | — | 1,000 |
| Email captured | 15% | 150 |
| Sales call booked | 20% of leads | 30 |
| Closed as customer | 40% of calls | 12 |

Conversion: audit → customer = **1.2%**

### CAC

If 1,000 audits cost nothing to acquire (organic/free distribution):
- CAC = $0 in direct spend
- Fully loaded CAC (founder time, infra): ~$50–100

At $540 LTV and ~$75 CAC: **LTV:CAC = ~7x**

---

## Path to $1M ARR

$1,000,000 ARR ÷ $360/customer/year = **2,778 customers**

Working backwards:
- 2,778 customers requires ~231,500 audits completed at 1.2% conversion
- At 500 audits/month that's ~38 months
- At 2,000 audits/month (achievable with Product Hunt + press) that's ~10 months

The constraint is not conversion rate — it is top of funnel volume. Every
initiative should be measured against "does this increase audits per week."

### Levers to accelerate

1. **Increase audit volume** — more distribution channels, shareable results
2. **Increase email capture rate** (currently 15%) — better modal copy,
   earlier trigger for high-savings audits
3. **Increase deal size** — target companies with larger AI stacks (>$2k/month
   spend), which also have higher willingness to pay Credex fees
4. **Reduce sales cycle** — self-serve checkout for smaller deals so not every
   customer needs a call

---

## Why the free tool makes sense as a CAC strategy

The audit tool has zero marginal cost per user (Supabase free tier covers the
first 50,000 rows, Gemini API free tier covers the first N summaries). A user
who completes an audit and sees a $300/month savings figure is self-qualifying —
they have demonstrated both the problem and the spend level. This is a better
qualified lead than anything a cold email campaign produces.
