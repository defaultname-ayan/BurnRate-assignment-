# Tests

## Running Tests

```bash
npm run test
```

Tests are written with Vitest. The audit engine is pure TypeScript with no
external dependencies so every test runs offline with no mocking needed.

---

## Test 1 — Overspend on wrong plan tier

**File:** `lib/__tests__/auditEngine.test.ts`
**What it tests:** A user on Cursor Pro+ ($60/seat) with 1 seat when they
could be on Cursor Pro ($20/seat) — the engine should flag overspending and
recommend the cheaper plan.

```ts
it("flags cursor pro+ as overspend for single seat", () => {
  const result = runAudit({
    tools: [{ toolId: "cursor", plan: "Pro+ · $60/seat/mo", seats: 1, monthlySpend: 60 }],
    teamSize: "1–5",
    useCase: "coding",
  });
  expect(result.recommendations[0].status).toBe("overspending");
  expect(result.totalMonthlySavings).toBeGreaterThan(0);
});
```

---

## Test 2 — Optimal spend returns correct status

**What it tests:** A user on Cursor Pro ($20/seat) with 1 seat spending exactly
$20 — should be marked optimal with zero savings.

```ts
it("marks cursor pro single seat as optimal", () => {
  const result = runAudit({
    tools: [{ toolId: "cursor", plan: "Pro · $20/seat/mo", seats: 1, monthlySpend: 20 }],
    teamSize: "1–5",
    useCase: "coding",
  });
  expect(result.recommendations[0].status).toBe("optimal");
  expect(result.totalMonthlySavings).toBe(0);
  expect(result.isOptimal).toBe(true);
});
```

---

## Test 3 — Annual savings is 12x monthly savings

**What it tests:** The relationship between monthly and annual savings is
always exactly 12x. A calculation error here would silently show wrong numbers
on the results page.

```ts
it("annual savings equals 12x monthly savings", () => {
  const result = runAudit({
    tools: [{ toolId: "cursor", plan: "Pro+ · $60/seat/mo", seats: 1, monthlySpend: 60 }],
    teamSize: "1–5",
    useCase: "coding",
  });
  expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
});
```

---

## Test 4 — Multiple tools aggregate savings correctly

**What it tests:** With two overspending tools, total savings equals the sum
of individual tool savings. Tests the reduce logic in the engine.

```ts
it("aggregates savings across multiple tools", () => {
  const result = runAudit({
    tools: [
      { toolId: "cursor", plan: "Pro+ · $60/seat/mo", seats: 1, monthlySpend: 60 },
      { toolId: "claude", plan: "Max · $100/mo", seats: 1, monthlySpend: 100 },
    ],
    teamSize: "1–5",
    useCase: "coding",
  });
  const manualSum = result.recommendations.reduce((s, r) => s + r.monthlySavings, 0);
  expect(result.totalMonthlySavings).toBe(manualSum);
});
```

---

## Test 5 — isHighSavings threshold

**What it tests:** `isHighSavings` should be true when monthly savings exceed
$500, false when below. This flag controls whether the Credex CTA is shown on
the results page.

```ts
it("sets isHighSavings true when savings exceed 500", () => {
  const highResult = runAudit({
    tools: [
      { toolId: "cursor", plan: "Ultra · $200/seat/mo", seats: 5, monthlySpend: 1000 },
    ],
    teamSize: "6–15",
    useCase: "coding",
  });
  expect(highResult.isHighSavings).toBe(true);
});

it("sets isHighSavings false when savings are under 500", () => {
  const lowResult = runAudit({
    tools: [{ toolId: "cursor", plan: "Pro · $20/seat/mo", seats: 1, monthlySpend: 20 }],
    teamSize: "1–5",
    useCase: "coding",
  });
  expect(lowResult.isHighSavings).toBe(false);
});
```
