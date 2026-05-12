export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type AuditStatus = "overspending" | "optimal" | "consider-switching";

export type ToolEntry = {
  toolId: ToolId;
  plan: string;
  seats: number;
  monthlySpend: number;
};

export type ToolRecommendation = {
  toolName: string;
  currentPlan: string;
  currentSeats: number;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan: string;
  monthlySavings: number;
  reason: string;
  status: AuditStatus;
  credexOpportunity: boolean;
};

export type AuditResult = {
  recommendations: ToolRecommendation[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  isOptimal: boolean;
};

export type AuditInput = {
  tools: ToolEntry[];
  teamSize: string;
  useCase: UseCase;
};

const PRICING = {
  cursor: {
    hobby: 0,
    pro: 20,
    "pro-plus": 60,
    ultra: 200,
    business: 40,
  },
  "github-copilot": {
    pro: 10,
    "pro-plus": 39,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 25,
    enterprise: null as null,
  },
  chatgpt: {
    go: 8,
    plus: 20,
    pro: 100,
    business: 20,
    enterprise: null as null,
  },
  gemini: {
    free: 0,
    "ai-plus": 7.99,
    "ai-pro": 19.99,
    "ai-ultra": 249.99,
  },
  windsurf: {
    free: 0,
    pro: 20,
    max: 200,
    teams: 40,
    enterprise: null as null,
  },
} as const;

function normalisePlan(plan: string): string {
  return plan
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseTeamSize(teamSize: string): number {
  if (teamSize.includes("200+")) return 250;
  const digits = teamSize.match(/\d+/g);
  if (!digits) return 10;
  const nums = digits.map(Number);
  return nums.length === 2 ? Math.round((nums[0] + nums[1]) / 2) : nums[0];
}

function positiveSavings(raw: number): number {
  return Math.max(0, Math.round(raw));
}

function makeOptimal(toolName: string, entry: ToolEntry): ToolRecommendation {
  return {
    toolName,
    currentPlan: entry.plan,
    currentSeats: entry.seats,
    currentSpend: entry.monthlySpend,
    recommendedAction: "No action needed",
    recommendedPlan: entry.plan,
    monthlySavings: 0,
    reason:
      "You're on the most cost-efficient plan for your current usage profile.",
    status: "optimal",
    credexOpportunity: false,
  };
}

function isNonCodingUseCase(useCase: UseCase): boolean {
  return ["writing", "data", "research"].includes(useCase);
}

function seatLabel(n: number): string {
  return `${n} seat${n !== 1 ? "s" : ""}`;
}

function auditCursor(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const { plan, monthlySpend } = entry;
  const n = entry.seats;
  const p = normalisePlan(plan);

  if (p.includes("ultra")) {
    if (isNonCodingUseCase(useCase)) {
      return {
        toolName: "Cursor",
        currentPlan: plan,
        currentSeats: n,
        currentSpend: monthlySpend,
        recommendedAction: "Cancel - wrong tool for your use case",
        recommendedPlan: "Claude Pro for writing/research tasks",
        monthlySavings: positiveSavings(monthlySpend),
        reason: `Cursor Ultra at $200/seat is an IDE for software engineers. Your primary use case (${useCase}) gets zero value from a code editor at any tier.`,
        status: "overspending",
        credexOpportunity: false,
      };
    }
    if (n <= 5) {
      const savings = positiveSavings(
        monthlySpend - n * PRICING.cursor["pro-plus"],
      );
      return {
        toolName: "Cursor",
        currentPlan: plan,
        currentSeats: n,
        currentSpend: monthlySpend,
        recommendedAction: "Downgrade to Pro+",
        recommendedPlan: `Cursor Pro+ - ${seatLabel(n)}`,
        monthlySavings: savings,
        reason: `Cursor Ultra ($200/seat) provides 20x model usage - a ceiling very few developers hit in practice. Pro+ ($60/seat) gives 3x usage and covers intensive sessions for most engineers - saving $${savings}/mo.`,
        status: "overspending",
        credexOpportunity: savings > 0,
      };
    }
  }

  if (p.includes("pro-plus") || p.includes("pro+")) {
    if (isNonCodingUseCase(useCase)) {
      const savings = positiveSavings(monthlySpend - n * PRICING.claude.pro);
      return {
        toolName: "Cursor",
        currentPlan: plan,
        currentSeats: n,
        currentSpend: monthlySpend,
        recommendedAction: "Consider switching to Claude Pro",
        recommendedPlan: `Claude Pro - ${seatLabel(n)}`,
        monthlySavings: savings,
        reason: `Cursor Pro+ is an IDE for developers. For ${useCase} workflows, Claude Pro ($20/seat) provides better-suited capabilities at a fraction of the cost - saving $${savings}/mo.`,
        status: "consider-switching",
        credexOpportunity: savings > 0,
      };
    }
    const savings = positiveSavings(monthlySpend - n * PRICING.cursor.pro);
    return {
      toolName: "Cursor",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Evaluate whether Pro+ usage limits are regularly hit",
      recommendedPlan: `Cursor Pro - ${seatLabel(n)}`,
      monthlySavings: savings,
      reason: `Cursor Pro+ ($60/seat) is worth it only if your team consistently hits Pro's model usage ceiling mid-session. If rate-limit messages are rare, downgrading to Pro ($20/seat) saves $${savings}/mo with no day-to-day difference.`,
      status: "consider-switching",
      credexOpportunity: savings > 0,
    };
  }

  if (p.includes("business") && n <= 10) {
    const savings = positiveSavings(monthlySpend - n * PRICING.cursor.pro);
    return {
      toolName: "Cursor",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Pro",
      recommendedPlan: `Cursor Pro - ${seatLabel(n)}`,
      monthlySavings: savings,
      reason: `Business at $40/seat adds centralised admin controls and SSO that teams under 10 rarely need. Pro at $20/seat covers all AI completion, codebase indexing, and model access - saving $${savings}/mo.`,
      status: savings > 0 ? "overspending" : "optimal",
      credexOpportunity: savings > 0,
    };
  }

  if (isNonCodingUseCase(useCase)) {
    const savings = positiveSavings(monthlySpend - n * PRICING.claude.pro);
    return {
      toolName: "Cursor",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Consider switching to Claude Pro",
      recommendedPlan: `Claude Pro - ${seatLabel(n)}`,
      monthlySavings: savings,
      reason: `Cursor is purpose-built for software development. For ${useCase} workflows, Claude Pro ($20/seat) provides the same underlying model access without the IDE overhead.`,
      status: "consider-switching",
      credexOpportunity: savings > 0,
    };
  }

  return makeOptimal("Cursor", entry);
}

function auditGithubCopilot(
  entry: ToolEntry,
  useCase: UseCase,
): ToolRecommendation {
  const { plan, monthlySpend } = entry;
  const n = entry.seats;
  const p = normalisePlan(plan);

  if (isNonCodingUseCase(useCase)) {
    return {
      toolName: "GitHub Copilot",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Cancel - wrong tool for your use case",
      recommendedPlan: "Claude Pro or ChatGPT Plus",
      monthlySavings: positiveSavings(monthlySpend),
      reason: `GitHub Copilot is exclusively a code-completion tool. Your primary use case (${useCase}) gets no benefit from it. Cancelling saves the full $${monthlySpend}/mo.`,
      status: "overspending",
      credexOpportunity: false,
    };
  }

  if (p.includes("enterprise") && n < 20) {
    const savings = positiveSavings(
      monthlySpend - n * PRICING["github-copilot"].business,
    );
    return {
      toolName: "GitHub Copilot",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Business",
      recommendedPlan: `Copilot Business - ${seatLabel(n)}`,
      monthlySavings: savings,
      reason: `Enterprise features (SAML SSO, audit logs, fine-grained policy controls) are only practical at 20+ seats. Business at $19/seat has identical AI completion capability - saving $${savings}/mo.`,
      status: "overspending",
      credexOpportunity: savings > 0,
    };
  }

  if (p.includes("pro-plus") || p.includes("pro+")) {
    const savings = positiveSavings(
      monthlySpend - n * PRICING["github-copilot"].pro,
    );
    return {
      toolName: "GitHub Copilot",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Evaluate whether Pro+ limits are actively consumed",
      recommendedPlan: `Copilot Pro - ${seatLabel(n)}`,
      monthlySavings: savings,
      reason: `Copilot Pro+ ($39/seat) unlocks higher request limits and additional frontier models. If your developers aren't hitting Pro's daily limits, downgrading to Pro ($10/seat) saves $${savings}/mo with no practical difference in completions.`,
      status: "consider-switching",
      credexOpportunity: savings > 0,
    };
  }

  if (p.includes("business") && n <= 3) {
    const savings = positiveSavings(
      monthlySpend - n * PRICING["github-copilot"].pro,
    );
    return {
      toolName: "GitHub Copilot",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Pro",
      recommendedPlan: `Copilot Pro - ${seatLabel(n)}`,
      monthlySavings: savings,
      reason: `Business adds org-level policy management and admin controls that serve no purpose for ${n} developer${n !== 1 ? "s" : ""}. Pro at $10/seat is identical in day-to-day completions - saving $${savings}/mo.`,
      status: "overspending",
      credexOpportunity: savings > 0,
    };
  }

  return makeOptimal("GitHub Copilot", entry);
}

function auditClaude(
  entry: ToolEntry,
  useCase: UseCase,
  teamSize: string,
): ToolRecommendation {
  const { plan, monthlySpend } = entry;
  const n = entry.seats;
  const p = normalisePlan(plan);
  const teamNum = parseTeamSize(teamSize);

  if (p.includes("max") && n <= 2) {
    const savings = positiveSavings(monthlySpend - n * PRICING.claude.pro);
    return {
      toolName: "Claude",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Pro",
      recommendedPlan: `Claude Pro - ${n} user${n !== 1 ? "s" : ""}`,
      monthlySavings: savings,
      reason: `Claude Max ($100/seat) is for users who hit Pro's rate limits every single day - typically 100+ messages daily. For ${n} user${n !== 1 ? "s" : ""}, Pro at $20/seat is almost always sufficient - saving $${savings}/mo.`,
      status: "overspending",
      credexOpportunity: true,
    };
  }

  if (p.includes("team") && n <= 2) {
    const savings = positiveSavings(monthlySpend - n * PRICING.claude.pro);
    return {
      toolName: "Claude",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Switch to individual Pro plans",
      recommendedPlan: `Claude Pro x ${n}`,
      monthlySavings: savings,
      reason: `Team plan ($25/seat) adds collaborative workspaces and admin controls that add no value for ${n} user${n !== 1 ? "s" : ""}. Individual Pro plans at $20/seat save $${savings}/mo with identical model access.`,
      status: "overspending",
      credexOpportunity: savings > 0,
    };
  }

  if (p.includes("enterprise") && teamNum < 10) {
    return {
      toolName: "Claude",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Review Enterprise necessity",
      recommendedPlan: "Claude Team may be sufficient",
      monthlySavings: 0,
      reason: `Claude Enterprise is designed for large organisations needing SSO, audit logs, and extended context at scale. At your team size, the Team plan ($25/seat) likely covers your needs - worth reviewing with your Anthropic rep.`,
      status: "consider-switching",
      credexOpportunity: false,
    };
  }

  if ((p.includes("api") || p.includes("direct")) && monthlySpend > 100) {
    const savings = positiveSavings(monthlySpend * 0.4);
    return {
      toolName: "Claude (API)",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction:
        "Route batch tasks to Claude Haiku + enable prompt caching",
      recommendedPlan: "Haiku for background tasks - Sonnet for interactive",
      monthlySavings: savings,
      reason: `Haiku costs ~$0.25/MTok vs Sonnet's $3/MTok - a 12x cost difference. Routing non-realtime work (classification, summarisation, extraction) to Haiku, combined with prompt caching on repeated system prompts, typically cuts API spend by 40-60%.`,
      status: "overspending",
      credexOpportunity: true,
    };
  }

  return makeOptimal("Claude", entry);
}

function auditChatGPT(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const { plan, monthlySpend } = entry;
  const n = entry.seats;
  const p = normalisePlan(plan);

  if (p === "pro") {
    const savings = positiveSavings(monthlySpend - PRICING.chatgpt.plus);
    return {
      toolName: "ChatGPT",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Downgrade to Plus unless GPT-5.5 Pro is needed daily",
      recommendedPlan: "ChatGPT Plus",
      monthlySavings: savings,
      reason: `ChatGPT Pro ($100/mo) grants 5x-20x usage and access to GPT-5.5 Pro. Unless you're consistently hitting Plus's limits and need frontier reasoning daily, Plus at $20/mo covers full GPT-4o access - saving $${savings}/mo.`,
      status: "consider-switching",
      credexOpportunity: false,
    };
  }

  if (p === "go") {
    return {
      toolName: "ChatGPT",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Monitor if Go limits are being hit",
      recommendedPlan:
        "ChatGPT Go (current) - upgrade to Plus if limits are hit",
      monthlySavings: 0,
      reason: `ChatGPT Go ($8/mo) is well-priced for light usage. If your team runs into message limits or needs image generation and extended memory, Plus at $20/mo adds substantial capability. No action needed yet.`,
      status: "optimal",
      credexOpportunity: false,
    };
  }

  if (p.includes("business") && n === 1) {
    const savings = positiveSavings(monthlySpend - PRICING.chatgpt.plus);
    return {
      toolName: "ChatGPT",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Switch to Plus",
      recommendedPlan: "ChatGPT Plus",
      monthlySavings: savings,
      reason: `ChatGPT Business ($20/seat) adds SSO, SAML, 60+ app integrations, and admin controls that benefit no one on a solo plan. Plus at $20/mo gives identical model access without unused overhead.`,
      status: savings > 0 ? "overspending" : "optimal",
      credexOpportunity: false,
    };
  }

  if (p.includes("enterprise")) {
    return {
      toolName: "ChatGPT",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Review Enterprise vs Business plan",
      recommendedPlan: "ChatGPT Business may be sufficient",
      monthlySavings: 0,
      reason: `ChatGPT Enterprise adds extended context windows, custom GPTs at scale, and deeper compliance controls. Evaluate whether these are actively used - the Business plan ($20/seat) already covers SAML SSO, MFA, and admin controls for most growing teams.`,
      status: "consider-switching",
      credexOpportunity: false,
    };
  }

  if ((p.includes("api") || p.includes("direct")) && monthlySpend > 200) {
    const savings = positiveSavings(monthlySpend * 0.35);
    return {
      toolName: "ChatGPT (API)",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Route simple tasks to GPT-4o-mini",
      recommendedPlan: "GPT-4o for reasoning - GPT-4o-mini for everything else",
      monthlySavings: savings,
      reason: `GPT-4o-mini costs $0.15/MTok input vs GPT-4o's $2.50/MTok - a 16x cost difference. Routing classification, summarisation, and structured extraction to mini typically cuts API spend by 30-40% with minimal quality impact on those tasks.`,
      status: "overspending",
      credexOpportunity: true,
    };
  }

  return makeOptimal("ChatGPT", entry);
}

function auditAnthropicAPI(entry: ToolEntry): ToolRecommendation {
  const { monthlySpend } = entry;

  if (monthlySpend > 500) {
    const savings = positiveSavings(monthlySpend * 0.45);
    return {
      toolName: "Anthropic API",
      currentPlan: "Pay-as-you-go",
      currentSeats: entry.seats,
      currentSpend: monthlySpend,
      recommendedAction: "Implement model routing + prompt caching",
      recommendedPlan: "Haiku for batch/background - Sonnet for interactive",
      monthlySavings: savings,
      reason: `At $${monthlySpend}/mo, two levers matter most: (1) route non-realtime tasks to Haiku ($0.25/MTok vs Sonnet's $3/MTok - 12x cheaper), and (2) enable prompt caching on repeated system prompts, which cuts cached token costs by up to 90%. Combined, expect 40-50% savings.`,
      status: "overspending",
      credexOpportunity: true,
    };
  }

  if (monthlySpend > 100) {
    const savings = positiveSavings(monthlySpend * 0.25);
    return {
      toolName: "Anthropic API",
      currentPlan: "Pay-as-you-go",
      currentSeats: entry.seats,
      currentSpend: monthlySpend,
      recommendedAction: "Enable prompt caching",
      recommendedPlan: "Same plan + prompt caching enabled",
      monthlySavings: savings,
      reason: `Anthropic's prompt caching reduces input token costs by up to 90% on repeated context (system prompts, few-shot examples, long documents). If your app sends the same system prompt on every request, enabling caching is a one-line change that typically saves ~25% overall.`,
      status: "overspending",
      credexOpportunity: false,
    };
  }

  return makeOptimal("Anthropic API", entry);
}

function auditOpenAIAPI(entry: ToolEntry): ToolRecommendation {
  const { monthlySpend } = entry;

  if (monthlySpend > 300) {
    const savings = positiveSavings(monthlySpend * 0.4);
    return {
      toolName: "OpenAI API",
      currentPlan: "Pay-as-you-go",
      currentSeats: entry.seats,
      currentSpend: monthlySpend,
      recommendedAction: "Route batch tasks to GPT-4o-mini",
      recommendedPlan: "GPT-4o + GPT-4o-mini hybrid routing",
      monthlySavings: savings,
      reason: `GPT-4o-mini at $0.15/MTok input vs GPT-4o at $2.50/MTok - a 16x cost difference. For tasks that don't require frontier reasoning (classification, extraction, summarisation, simple generation), mini is equivalent in quality at a fraction of the cost. Expect 35-45% overall spend reduction.`,
      status: "overspending",
      credexOpportunity: true,
    };
  }

  return makeOptimal("OpenAI API", entry);
}

function auditGemini(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const { plan, monthlySpend } = entry;
  const n = entry.seats;
  const p = normalisePlan(plan);

  if (p.includes("api") || p.includes("direct")) {
    if (monthlySpend > 100) {
      const savings = positiveSavings(monthlySpend * 0.35);
      return {
        toolName: "Gemini (API)",
        currentPlan: plan,
        currentSeats: n,
        currentSpend: monthlySpend,
        recommendedAction: "Route simple tasks to Gemini Flash",
        recommendedPlan: "Gemini Pro for complex - Flash for simple tasks",
        monthlySavings: savings,
        reason: `Gemini Flash is significantly cheaper than Gemini Pro for API usage. For tasks like summarisation, classification, or simple extraction, Flash performs comparably - typically saving 30-40% on API spend.`,
        status: "overspending",
        credexOpportunity: false,
      };
    }
    return makeOptimal("Gemini (API)", entry);
  }

  if (p.includes("ultra")) {
    const savings = positiveSavings(
      monthlySpend - n * PRICING.gemini["ai-pro"],
    );
    return {
      toolName: "Gemini",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Downgrade to AI Pro",
      recommendedPlan: `Gemini AI Pro - ${seatLabel(n)}`,
      monthlySavings: savings,
      reason: `Gemini AI Ultra ($249.99/mo) adds 30 TB storage, Veo 3 video generation, Deep Think, and Genie 3 - features rarely needed for standard AI workflows. AI Pro ($19.99/mo) covers higher limits, 5 TB storage, Code Assist, and Jules coding agent - saving $${savings}/mo.`,
      status: "overspending",
      credexOpportunity: savings > 0,
    };
  }

  if (p.includes("ai-pro") || p === "pro") {
    if (isNonCodingUseCase(useCase)) {
      const savings = positiveSavings(
        monthlySpend - n * PRICING.gemini["ai-plus"],
      );
      if (savings > 0) {
        return {
          toolName: "Gemini",
          currentPlan: plan,
          currentSeats: n,
          currentSpend: monthlySpend,
          recommendedAction: "Downgrade to AI Plus",
          recommendedPlan: `Gemini AI Plus - ${seatLabel(n)}`,
          monthlySavings: savings,
          reason: `Gemini AI Pro ($19.99/mo) includes Jules (coding agent), Code Assist, and Gemini CLI - none relevant to ${useCase} workflows. AI Plus ($7.99/mo) still gives Gemini 3.1 Pro access and Deep Research at a lower cost - saving $${savings}/mo.`,
          status: "overspending",
          credexOpportunity: false,
        };
      }
    }
  }

  if ((p.includes("ai-plus") || p.includes("plus")) && useCase === "coding") {
    return {
      toolName: "Gemini",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Consider upgrading to AI Pro for coding workflows",
      recommendedPlan: `Gemini AI Pro - ${seatLabel(n)}`,
      monthlySavings: 0,
      reason: `Gemini AI Plus ($7.99/mo) doesn't include Gemini Code Assist or the Jules async coding agent. For coding use cases, AI Pro ($19.99/mo) adds IDE integrations and agentic development tooling that can significantly accelerate workflows. Evaluate whether the $12/mo upgrade is worth it.`,
      status: "consider-switching",
      credexOpportunity: false,
    };
  }

  return makeOptimal("Gemini", entry);
}

function auditWindsurf(entry: ToolEntry, useCase: UseCase): ToolRecommendation {
  const { plan, monthlySpend } = entry;
  const n = entry.seats;
  const p = normalisePlan(plan);

  if (isNonCodingUseCase(useCase)) {
    return {
      toolName: "Windsurf",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Cancel - wrong tool for your use case",
      recommendedPlan: "Not suited for your use case",
      monthlySavings: positiveSavings(monthlySpend),
      reason: `Windsurf is an AI-native code editor. Your primary use case (${useCase}) gets no value from an IDE. Cancelling saves the full $${monthlySpend}/mo - redirect that budget to a general-purpose AI tool.`,
      status: "overspending",
      credexOpportunity: false,
    };
  }

  if (p.includes("max")) {
    const savings = positiveSavings(monthlySpend - n * PRICING.windsurf.pro);
    return {
      toolName: "Windsurf",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Evaluate whether Max quotas are regularly consumed",
      recommendedPlan: `Windsurf Pro - ${seatLabel(n)}`,
      monthlySavings: savings,
      reason: `Windsurf Max ($200/mo) is designed for developers who consistently hit Pro's usage ceiling. If your team isn't regularly exhausting Pro's frontier model quota, downgrading to Pro ($20/seat) saves $${savings}/mo with no practical difference.`,
      status: "consider-switching",
      credexOpportunity: savings > 0,
    };
  }

  if (p.includes("teams") && n <= 3) {
    const savings = positiveSavings(monthlySpend - n * PRICING.windsurf.pro);
    return {
      toolName: "Windsurf",
      currentPlan: plan,
      currentSeats: n,
      currentSpend: monthlySpend,
      recommendedAction: "Switch to individual Pro plans",
      recommendedPlan: `Windsurf Pro x ${n}`,
      monthlySavings: savings,
      reason: `Teams plan ($40/seat) adds an admin dashboard, analytics, and automated zero data retention that aren't necessary for ${n} developer${n !== 1 ? "s" : ""}. Individual Pro at $20/seat has the same AI capabilities - saving $${savings}/mo.`,
      status: "overspending",
      credexOpportunity: savings > 0,
    };
  }

  return makeOptimal("Windsurf", entry);
}

function detectOverlaps(
  tools: ToolEntry[],
  recommendations: ToolRecommendation[],
): ToolRecommendation[] {
  const ids = new Set(tools.map((t) => t.toolId));
  const result = [...recommendations];

  if (ids.has("cursor") && ids.has("github-copilot")) {
    const copilotEntry = tools.find((t) => t.toolId === "github-copilot")!;
    const idx = result.findIndex((r) => r.toolName === "GitHub Copilot");
    if (idx !== -1) {
      result[idx] = {
        ...result[idx],
        recommendedAction: "Cancel - fully redundant with Cursor",
        recommendedPlan: "Remove Copilot, keep Cursor Pro",
        monthlySavings: positiveSavings(copilotEntry.monthlySpend),
        reason: `You are paying for both Cursor and GitHub Copilot. These tools have near-identical code completion capabilities - both run on Claude/GPT-4 under the hood. Cursor's Pro plan supersedes Copilot for every workflow. Cancelling Copilot eliminates $${copilotEntry.monthlySpend}/mo of direct redundancy.`,
        status: "overspending",
        credexOpportunity: false,
      };
    }
  }

  if (ids.has("claude") && ids.has("chatgpt")) {
    const chatgptEntry = tools.find((t) => t.toolId === "chatgpt")!;
    const idx = result.findIndex(
      (r) => r.toolName === "ChatGPT" || r.toolName === "ChatGPT (API)",
    );
    if (idx !== -1 && result[idx].status === "optimal") {
      result[idx] = {
        ...result[idx],
        recommendedAction: "Evaluate vs Claude - cancel the one you use less",
        recommendedPlan: "One LLM subscription is enough for most teams",
        monthlySavings: positiveSavings(chatgptEntry.monthlySpend),
        reason: `You subscribe to both Claude and ChatGPT. For most use cases - writing, coding support, research - one LLM subscription is sufficient. Audit which model your team actually opens daily and cancel the other. That's $${chatgptEntry.monthlySpend}/mo recovered.`,
        status: "consider-switching",
        credexOpportunity: false,
      };
    }
  }

  return result;
}

export function runAudit(input: AuditInput): AuditResult {
  const { tools, teamSize, useCase } = input;

  const validTools = tools.filter(
    (t) =>
      t.monthlySpend >= 0 &&
      t.seats >= 1 &&
      typeof t.toolId === "string" &&
      typeof t.plan === "string",
  );

  const rawRecommendations: ToolRecommendation[] = validTools.map((entry) => {
    switch (entry.toolId) {
      case "cursor":
        return auditCursor(entry, useCase);
      case "github-copilot":
        return auditGithubCopilot(entry, useCase);
      case "claude":
        return auditClaude(entry, useCase, teamSize);
      case "chatgpt":
        return auditChatGPT(entry, useCase);
      case "anthropic-api":
        return auditAnthropicAPI(entry);
      case "openai-api":
        return auditOpenAIAPI(entry);
      case "gemini":
        return auditGemini(entry, useCase);
      case "windsurf":
        return auditWindsurf(entry, useCase);
      default:
        return makeOptimal(entry.toolId, entry);
    }
  });

  const recommendations = detectOverlaps(validTools, rawRecommendations);

  const totalMonthlySpend = validTools.reduce(
    (sum, t) => sum + t.monthlySpend,
    0,
  );
  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings,
    0,
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  return {
    recommendations,
    totalMonthlySpend,
    totalMonthlySavings,
    totalAnnualSavings,
    isHighSavings: totalMonthlySavings > 500,
    isOptimal: totalMonthlySavings < 100,
  };
}
