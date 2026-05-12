"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCopy,
  FiCheck,
  FiTrendingDown,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import Link from "next/link";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Recommendation = {
  toolName: string;
  currentPlan: string;
  currentSeats: number;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan: string;
  monthlySavings: number;
  reason: string;
  status: "overspending" | "optimal" | "consider-switching";
  credexOpportunity: boolean;
};

type Audit = {
  id: string;
  tools: unknown;
  team_size: string;
  use_case: string;
  total_monthly_spend: number;
  total_monthly_savings: number;
  total_annual_savings: number;
  is_high_savings: boolean;
  is_optimal: boolean;
  recommendations: Recommendation[];
  ai_summary: string | null;
};

const STATUS_CONFIG = {
  overspending: {
    label: "Overspending",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    icon: <FiAlertCircle size={12} />,
  },
  "consider-switching": {
    label: "Review",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    icon: <FiTrendingDown size={12} />,
  },
  optimal: {
    label: "Optimal",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    icon: <FiCheckCircle size={12} />,
  },
};

function SavingsBar({ spend, savings }: { spend: number; savings: number }) {
  const pct = spend > 0 ? Math.min((savings / spend) * 100, 100) : 0;
  return (
    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, delay: 0.4, ease }}
        className="h-full rounded-full bg-[#086841]"
      />
    </div>
  );
}

function LeadCaptureModal({
  auditId,
  isHighSavings,
  monthlySavings,
  onClose,
}: {
  auditId: string;
  isHighSavings: boolean;
  monthlySavings: number;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, role, auditId, website }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.3, ease }}
        className="w-full max-w-md rounded-2xl border border-zinc-200/70 p-6"
        style={{
          backgroundColor: "#f9f8f5",
          boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
        }}
      >
        {done ? (
          <div className="text-center py-4">
            <div className="w-10 h-10 rounded-full bg-[#086841]/10 flex items-center justify-center mx-auto mb-4">
              <FiCheck size={20} className="text-[#086841]" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 mb-1">
              You&apos;re on the list
            </h3>
            <p className="text-sm text-zinc-500 mb-4">
              We&apos;ll be in touch about actioning your savings.
            </p>
            <button
              onClick={onClose}
              className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="text-xs font-medium text-[#086841] uppercase tracking-widest mb-1">
                {isHighSavings ? "Credex can help" : "Stay optimised"}
              </p>
              <h3 className="text-lg font-semibold text-zinc-900 leading-snug">
                {isHighSavings
                  ? `We can save you $${monthlySavings}/mo`
                  : "Get notified when better plans launch"}
              </h3>
              <p className="text-sm text-zinc-500 mt-1">
                {isHighSavings
                  ? "Credex negotiates group discounts and handles vendor management for you."
                  : "We monitor pricing changes across all major AI tools."}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                  clip: "rect(0,0,0,0)",
                  whiteSpace: "nowrap",
                }}
              >
                <label htmlFor="lc-website">Website</label>
                <input
                  id="lc-website"
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3 py-2.5 text-sm border border-zinc-200/80 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#086841]/50 transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Inc"
                    className="w-full px-3 py-2.5 text-sm border border-zinc-200/80 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#086841]/50 transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
                    Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="CTO"
                    className="w-full px-3 py-2.5 text-sm border border-zinc-200/80 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#086841]/50 transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#086841] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#065032] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Submitting..."
                    : isHighSavings
                      ? "Talk to Credex"
                      : "Notify me"}
                  {!loading && <FiArrowRight size={14} />}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm text-zinc-400 hover:text-zinc-600 transition-colors px-2"
                >
                  Skip
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ResultsClient({ audit }: { audit: Audit }) {
  const [copied, setCopied] = useState(false);
  const [summary, setSummary] = useState<string | null>(audit.ai_summary);
  const [summaryLoading, setSummaryLoading] = useState(!audit.ai_summary);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowModal(true), 5000);
    return () => clearTimeout(t);
  }, []);

  // Fetch AI summary on the client if it wasn't pre-generated server-side
  useEffect(() => {
    if (audit.ai_summary) return;
    fetch("/api/summarise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audit }),
    })
      .then((r) => r.json())
      .then((d) => setSummary(d.summary))
      .catch(() =>
        setSummary(
          `This audit identified $${audit.total_monthly_savings}/month ($${audit.total_annual_savings}/year) in potential savings across ${audit.recommendations.length} tools.`,
        ),
      )
      .finally(() => setSummaryLoading(false));
  }, [audit]);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const overspendingCount = audit.recommendations.filter(
    (r) => r.status === "overspending",
  ).length;

  const sortedRecs = [...audit.recommendations].sort((a, b) => {
    const order = { overspending: 0, "consider-switching": 1, optimal: 2 };
    return order[a.status] - order[b.status];
  });

  return (
    <>
      <div
        className="min-h-screen text-zinc-900 font-[family-name:var(--font-syne)] relative"
        style={{ backgroundColor: "#f5f4f0" }}
      >
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "192px 192px",
          }}
        />
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 50% at 50% -5%, rgba(8,104,65,0.06) 0%, transparent 100%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-24 mt-5">
          <Link
            href="/audit"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors mb-8"
          >
            <FiArrowLeft size={12} />
            New audit
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[#086841] uppercase tracking-widest mb-2">
                  Audit Complete
                </p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 leading-[1.15]">
                  {audit.is_optimal
                    ? "You're spending efficiently"
                    : `Save $${audit.total_monthly_savings.toLocaleString()}/mo`}
                </h1>
                <p className="text-zinc-500 text-sm mt-2">
                  {audit.is_optimal
                    ? "No major inefficiencies found in your AI stack."
                    : `$${audit.total_annual_savings.toLocaleString()} saved annually · ${overspendingCount} tool${overspendingCount !== 1 ? "s" : ""} overspending`}
                </p>
              </div>
              <button
                onClick={copyLink}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-500 border border-zinc-200/80 rounded-lg hover:border-[#086841]/30 hover:text-[#086841] transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
              >
                {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </motion.div>
          {!audit.is_optimal && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
              className="rounded-xl p-6 mb-4 border border-[#086841]/15"
              style={{
                background:
                  "linear-gradient(135deg, rgba(8,104,65,0.06) 0%, rgba(8,104,65,0.02) 100%)",
              }}
            >
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Current Spend
                  </p>
                  <p className="text-xl font-light text-zinc-900">
                    ${audit.total_monthly_spend.toLocaleString()}
                    <span className="text-xs text-zinc-400 ml-1">/mo</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Monthly Savings
                  </p>
                  <p className="text-xl font-semibold text-[#086841]">
                    ${audit.total_monthly_savings.toLocaleString()}
                    <span className="text-xs text-[#086841]/60 ml-1">/mo</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">
                    Annual Savings
                  </p>
                  <p className="text-xl font-semibold text-[#086841]">
                    ${audit.total_annual_savings.toLocaleString()}
                    <span className="text-xs text-[#086841]/60 ml-1">/yr</span>
                  </p>
                </div>
              </div>
              <SavingsBar
                spend={audit.total_monthly_spend}
                savings={audit.total_monthly_savings}
              />
              <p className="text-[10px] text-zinc-400 mt-1.5">
                {Math.round(
                  (audit.total_monthly_savings / audit.total_monthly_spend) *
                    100,
                )}
                % of current spend recoverable
              </p>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="border border-zinc-200/70 rounded-xl p-5 mb-4"
            style={{
              backgroundColor: "rgba(255,255,255,0.75)",
              boxShadow: "0 2px 12px rgba(8,104,65,0.04)",
            }}
          >
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-2">
              Summary
            </p>
            {summaryLoading ? (
              <div className="space-y-2">
                <div className="h-3 bg-zinc-200/60 rounded animate-pulse w-full" />
                <div className="h-3 bg-zinc-200/60 rounded animate-pulse w-4/5" />
                <div className="h-3 bg-zinc-200/60 rounded animate-pulse w-3/5" />
              </div>
            ) : (
              <p className="text-sm text-zinc-600 leading-relaxed">{summary}</p>
            )}
          </motion.div>
          <div className="space-y-3 mb-6">
            {sortedRecs.map((rec, i) => {
              const cfg = STATUS_CONFIG[rec.status];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.06, ease }}
                  className="border border-zinc-200/70 rounded-xl p-5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.75)",
                    boxShadow: "0 2px 12px rgba(8,104,65,0.03)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-zinc-900">
                        {rec.toolName}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </div>
                    {rec.monthlySavings > 0 && (
                      <p className="text-sm font-semibold text-[#086841] shrink-0">
                        −${rec.monthlySavings.toLocaleString()}/mo
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-zinc-50/80 rounded-lg px-3 py-2">
                      <p className="text-[10px] text-zinc-400 mb-0.5 uppercase tracking-wider">
                        Current
                      </p>
                      <p className="text-xs font-medium text-zinc-700">
                        {rec.currentPlan}
                      </p>
                      <p className="text-xs text-zinc-400">
                        ${rec.currentSpend}/mo · {rec.currentSeats} seat
                        {rec.currentSeats !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {rec.status !== "optimal" ? (
                      <div className="bg-[#086841]/[0.04] rounded-lg px-3 py-2 border border-[#086841]/10">
                        <p className="text-[10px] text-[#086841]/60 mb-0.5 uppercase tracking-wider">
                          Recommended
                        </p>
                        <p className="text-xs font-medium text-zinc-700">
                          {rec.recommendedPlan}
                        </p>
                        <p className="text-xs text-[#086841]/70">
                          {rec.recommendedAction}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/80 rounded-lg px-3 py-2 border border-emerald-100/80 flex items-center justify-center">
                        <p className="text-xs text-emerald-600 font-medium">
                          No action needed
                        </p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed border-t border-zinc-100 pt-3">
                    {rec.reason}
                  </p>
                </motion.div>
              );
            })}
          </div>
          {audit.is_high_savings && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease }}
              className="rounded-xl p-6 border border-[#086841]/20 mb-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(8,104,65,0.08) 0%, rgba(8,104,65,0.03) 100%)",
              }}
            >
              <p className="text-xs font-medium text-[#086841] uppercase tracking-widest mb-2">
                Credex can help
              </p>
              <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                We can action these savings for you
              </h2>
              <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                Credex negotiates group discounts on AI tools and handles vendor
                management — so your team keeps the savings without the admin
                overhead.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-[#086841] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#065032] transition-colors"
                style={{ boxShadow: "0 4px 16px rgba(8,104,65,0.25)" }}
              >
                Talk to Credex
                <FiArrowRight size={14} />
              </button>
            </motion.div>
          )}
          {audit.is_optimal && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease }}
              className="rounded-xl p-6 border border-zinc-200/70 text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.75)" }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <FiCheckCircle size={18} className="text-emerald-500" />
              </div>
              <h2 className="text-base font-semibold text-zinc-900 mb-1">
                You&apos;re spending efficiently
              </h2>
              <p className="text-sm text-zinc-500 mb-4">
                Want to stay that way as you scale? Credex monitors your AI
                spend and alerts you when better plans become available.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#086841] border border-[#086841]/20 px-4 py-2 rounded-lg hover:bg-[#086841]/[0.04] transition-colors"
              >
                Stay notified
                <FiArrowRight size={13} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
      {showModal && (
        <LeadCaptureModal
          auditId={audit.id}
          isHighSavings={audit.is_high_savings}
          monthlySavings={audit.total_monthly_savings}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
