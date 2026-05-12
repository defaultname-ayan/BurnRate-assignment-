import { createClient } from "@/utils/supabase/server";
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipSubmissions = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipSubmissions.get(ip);

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipSubmissions.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) return true;

  record.count += 1;
  return false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, company, role, auditId, website } = body;

    if (website) {
      return Response.json({ ok: true });
    }

    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: existing } = await supabase
      .from("leads")
      .select("id")
      .eq("email", email)
      .eq("audit_id", auditId)
      .single();

    if (existing) {
      return Response.json({ ok: true, duplicate: true });
    }

    const { error } = await supabase.from("leads").insert({
      email,
      company: company || null,
      role: role || null,
      audit_id: auditId,
    });

    if (error) throw new Error(error.message);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[capture-lead]", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
