# Prompts

## Summarise Route — Current Prompt

File: `app/api/summarise/route.ts`

```
You are a CFO advisor. Write exactly 2 concise sentences summarising this AI tool
audit for a startup founder. Be specific with dollar amounts. No fluff, no bullet
points, no markdown.

Current monthly AI spend: ${audit.total_monthly_spend}
Potential monthly savings: ${audit.total_monthly_savings}
Potential annual savings: ${audit.total_annual_savings}
Number of tools audited: ${audit.recommendations.length}
Top recommendation: ${topRec.reason}
Team size: ${audit.team_size}
Use case: ${audit.use_case}

Start the first sentence with the savings figure.
```

Model: `gemini-2.0-flash`
Temperature: default (1.0)
Max output tokens: not set (relies on the "exactly 2 sentences" instruction)

---

## First Attempt (Didn't Work Well)

The first version had no persona and no constraint on format:

```
Summarise this AI tool audit. The team spends $X/month and could save $Y/month.
Write a short paragraph for a startup founder.
```

**What went wrong:** The output was 4–5 sentences and read like a press release.
Phrases like "leveraging AI tools strategically" and "optimise your investment
portfolio" appeared consistently. It sounded nothing like advice a real CFO would
give and added no information that was not already visible on the results page.

**What changed:**

- Added the "CFO advisor" persona — significantly improved directness
- Changed "short paragraph" to "exactly 2 concise sentences" — enforced brevity
- Added "No fluff, no bullet points, no markdown" — stopped the model hedging
- Added "Start the first sentence with the savings figure" — put the most
  important number first instead of burying it

**Result:** Output went from "Your team is well-positioned to optimise its AI
investment by reviewing current tooling..." to "Your team could recover $X/month
($Y annually) by switching two tools to lower-tier plans. The biggest single
action is [top recommendation]." The second version is what actually ships.

---

## Fallback

If the Gemini call fails or returns an empty string, `ResultsClient.tsx` falls
back to:

```
This audit identified $X/month ($Y/year) in potential savings across N tools.
```

This is hardcoded in the `.catch()` handler on the client-side fetch.
