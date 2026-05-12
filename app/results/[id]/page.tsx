import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ResultsClient from "../ResultClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("audits")
    .select("total_monthly_savings, total_annual_savings")
    .eq("id", id)
    .single();

  if (!data) return { title: "Audit Not Found" };

  return {
    title: `AI Spend Audit — Save $${data.total_monthly_savings}/mo`,
    description: `This audit found $${data.total_annual_savings}/year in potential AI tool savings.`,
    openGraph: {
      title: `I could save $${data.total_monthly_savings}/mo on AI tools`,
      description: `Free audit by BurnRate — see where your team is overpaying.`,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: audit, error } = await supabase
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !audit) notFound();

  return <ResultsClient audit={audit} />;
}
