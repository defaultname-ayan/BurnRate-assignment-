import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/utils/supabase/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { audit } = await req.json();
    if (audit.ai_summary) {
      return Response.json({ summary: audit.ai_summary });
    }
    const topRec = audit.recommendations?.[0];
    const prompt = `You are a CFO advisor. Write exactly 2 concise sentences summarising this AI tool audit for a startup founder. Be specific with dollar amounts. No fluff, no bullet points, no markdown.
    Current monthly AI spend: $${audit.total_monthly_spend}
                Potential monthly savings: $${audit.total_monthly_savings}
                Potential annual savings: $${audit.total_annual_savings}
                Number of tools audited: ${audit.recommendations?.length ?? 0}
                Top recommendation: ${topRec?.reason ?? "No recommendations found"}
                Team size: ${audit.team_size}
                Use case: ${audit.use_case}

                Start the first sentence with the savings figure.`;
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const summary = response.text?.trim() ?? fallbackSummary(audit);
    const supabase = await createClient();
    await supabase
      .from("audits")
      .update({ ai_summary: summary })
      .eq("id", audit.id);

    return Response.json({ summary });
  } catch (err) {
    console.error("[summarise]", err);
    return Response.json({ summary: fallbackSummary({}) });
  }
}
function fallbackSummary(audit: {
  total_monthly_savings?: number;
  total_annual_savings?: number;
  recommendations?: unknown[];
}) {
  return `This audit identified $${audit.total_monthly_savings ?? 0}/month ($${audit.total_annual_savings ?? 0}/year) in potential savings. The biggest opportunity is optimising your highest-cost tool to a more appropriate plan tier.`;
}
