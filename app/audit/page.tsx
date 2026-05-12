"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiArrowRight, FiChevronDown } from "react-icons/fi";
import { runAudit, type ToolId, type UseCase } from "@/lib/auditEngine";
import { createClient } from "@/utils/supabase/client";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const TOOLS_CATALOG: {
  id: ToolId;
  name: string;
  image: string;
  plans: string[];
}[] = [
  {
    id: "cursor",
    name: "Cursor",
    image: "/cursor.png",
    plans: [
      "Hobby (Free)",
      "Pro · $20/seat/mo",
      "Pro+ · $60/seat/mo",
      "Ultra · $200/seat/mo",
      "Business · $40/seat/mo",
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    image: "/copilot.png",
    plans: [
      "Pro · $10/seat/mo",
      "Pro+ · $39/seat/mo",
      "Business · $19/seat/mo",
      "Enterprise · $39/seat/mo",
    ],
  },
  {
    id: "claude",
    name: "Claude",
    image: "/claude.png",
    plans: [
      "Free",
      "Pro · $20/mo",
      "Max · $100/mo",
      "Team · $25/seat/mo",
      "Enterprise",
      "API Direct",
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    image: "/chatgpt.png",
    plans: [
      "Go · $8/mo",
      "Plus · $20/mo",
      "Pro · $100/mo",
      "Business · $20/seat/mo",
      "Enterprise",
      "API Direct",
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    image: "/claude.png",
    plans: ["Pay-as-you-go"],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    image: "/chatgpt.png",
    plans: ["Pay-as-you-go"],
  },
  {
    id: "gemini",
    name: "Gemini",
    image: "/gemini.png",
    plans: [
      "Free",
      "AI Plus · $7.99/mo",
      "AI Pro · $19.99/mo",
      "AI Ultra · $249.99/mo",
      "API",
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    image: "/windsurf.png",
    plans: [
      "Free",
      "Pro · $20/mo",
      "Max · $200/mo",
      "Teams · $40/seat/mo",
      "Enterprise",
    ],
  },
];

const USE_CASES: UseCase[] = ["coding", "writing", "data", "research", "mixed"];
const USE_CASE_LABELS: Record<UseCase, string> = {
  coding: "Coding",
  writing: "Writing",
  data: "Data",
  research: "Research",
  mixed: "Mixed",
};

const DEFAULT_ENTRIES = [
  {
    id: "1",
    toolId: "cursor" as ToolId,
    plan: "",
    seats: "",
    monthlySpend: "",
  },
];

type ToolEntry = {
  id: string;
  toolId: ToolId;
  plan: string;
  seats: string;
  monthlySpend: string;
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

function loadDraft(): {
  entries: ToolEntry[];
  teamSize: string;
  useCase: UseCase | "";
} {
  if (typeof window === "undefined") {
    return { entries: DEFAULT_ENTRIES, teamSize: "", useCase: "" };
  }
  try {
    const saved = localStorage.getItem("audit-draft");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        entries: parsed.entries ?? DEFAULT_ENTRIES,
        teamSize: parsed.teamSize ?? "",
        useCase: parsed.useCase ?? "",
      };
    }
  } catch {
    // corrupt storage — fall through to defaults
  }
  return { entries: DEFAULT_ENTRIES, teamSize: "", useCase: "" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ToolBadge({ image, name }: { image: string; name: string }) {
  return (
    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white border border-zinc-200/80 shadow-sm shrink-0">
      <img src={image} alt={name} className="w-5 h-5 object-contain" />
    </div>
  );
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-zinc-200/80 rounded-lg text-left transition-colors hover:border-[#086841]/30 focus:outline-none focus:border-[#086841]/50"
        style={{
          color: value ? "#18181b" : "#a1a1aa",
          backgroundColor: "rgba(255,255,255,0.7)",
        }}
      >
        <span className="truncate">{value || placeholder}</span>
        <FiChevronDown
          className="shrink-0 ml-2 transition-transform duration-200"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            color: "#a1a1aa",
          }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-[100] mt-1 w-full border border-zinc-200/80 rounded-lg overflow-hidden max-h-60 overflow-y-auto"
            style={{
              backgroundColor: "rgba(255,255,255,0.98)",
              boxShadow:
                "0 8px 24px rgba(8,104,65,0.08), 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            {options.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-zinc-700 hover:bg-[#086841]/[0.04] hover:text-[#086841] transition-colors"
                >
                  {opt}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolRow({
  entry,
  index,
  onUpdate,
  onRemove,
}: {
  entry: ToolEntry;
  index: number;
  onUpdate: (id: string, field: keyof ToolEntry, value: string) => void;
  onRemove: (id: string) => void;
}) {
  const tool = TOOLS_CATALOG.find((t) => t.id === entry.toolId)!;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.3, ease }}
      className="relative border border-zinc-200/70 rounded-xl p-5 group"
      style={{
        backgroundColor: "rgba(255,255,255,0.75)",
        boxShadow: "0 2px 12px rgba(8,104,65,0.04), 0 1px 3px rgba(0,0,0,0.03)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <ToolBadge image={tool.image} name={tool.name} />
          <div>
            <p className="text-sm font-medium text-zinc-900">{tool.name}</p>
            <p className="text-xs text-zinc-400 mt-0.5">Tool {index + 1}</p>
          </div>
        </div>
        <button
          onClick={() => onRemove(entry.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          aria-label="Remove tool"
        >
          <FiTrash2 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
            Plan
          </label>
          <CustomSelect
            value={entry.plan}
            onChange={(v) => onUpdate(entry.id, "plan", v)}
            options={tool.plans}
            placeholder="Select plan"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
            Seats
          </label>
          <input
            type="number"
            min="1"
            value={entry.seats}
            onChange={(e) => onUpdate(entry.id, "seats", e.target.value)}
            placeholder="1"
            className="w-full px-3 py-2 text-sm border border-zinc-200/80 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#086841]/50 transition-colors hover:border-[#086841]/30"
            style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
            Monthly Spend ($)
          </label>
          <input
            type="number"
            min="0"
            value={entry.monthlySpend}
            onChange={(e) => onUpdate(entry.id, "monthlySpend", e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-sm border border-zinc-200/80 rounded-lg text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#086841]/50 transition-colors hover:border-[#086841]/30"
            style={{ backgroundColor: "rgba(255,255,255,0.7)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function AddToolPanel({
  onAdd,
  existingToolIds,
}: {
  onAdd: (toolId: ToolId) => void;
  existingToolIds: ToolId[];
}) {
  const [open, setOpen] = useState(false);
  const available = TOOLS_CATALOG.filter(
    (t) => !existingToolIds.includes(t.id),
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={available.length === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-zinc-300/80 rounded-xl text-sm text-zinc-500 hover:border-[#086841]/40 hover:text-[#086841] hover:bg-[#086841]/[0.02] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <FiPlus size={15} />
        Add AI tool
      </button>
      <AnimatePresence>
        {open && available.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-[100] top-full mt-2 left-0 right-0 border border-zinc-200/80 rounded-xl overflow-hidden max-h-72 overflow-y-auto"
            style={{
              backgroundColor: "rgba(255,255,255,0.98)",
              boxShadow:
                "0 8px 32px rgba(8,104,65,0.1), 0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider px-4 pt-3 pb-2 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-zinc-100">
              Available tools
            </p>
            <div className="py-1">
              {available.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    onAdd(t.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#086841]/[0.04] transition-colors text-left"
                >
                  <ToolBadge image={t.image} name={t.name} />
                  <span className="text-sm font-medium text-zinc-700">
                    {t.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const router = useRouter();

  // Initialise all state from localStorage on first render
  const draft = loadDraft();
  const [entries, setEntries] = useState<ToolEntry[]>(draft.entries);
  const [teamSize, setTeamSize] = useState<string>(draft.teamSize);
  const [useCase, setUseCase] = useState<UseCase | "">(draft.useCase);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Persist draft to localStorage whenever form state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "audit-draft",
        JSON.stringify({ entries, teamSize, useCase }),
      );
    } catch {
      // Storage quota exceeded or private browsing — silently ignore
    }
  }, [entries, teamSize, useCase]);

  const totalSpend = entries.reduce(
    (sum, e) => sum + (parseFloat(e.monthlySpend) || 0),
    0,
  );
  const filledCount = entries.filter((e) => e.plan && e.monthlySpend).length;
  const canSubmit = filledCount > 0 && teamSize && useCase && !isLoading;

  const addTool = (toolId: ToolId) => {
    setEntries((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        toolId,
        plan: "",
        seats: "",
        monthlySpend: "",
      },
    ]);
  };

  const removeTool = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateTool = (id: string, field: keyof ToolEntry, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };

  async function handleSubmit() {
    if (!useCase || !teamSize) return;
    setIsLoading(true);
    setSubmitError(null);

    try {
      const result = runAudit({
        tools: entries.map((e) => ({
          toolId: e.toolId,
          plan: e.plan,
          seats: parseInt(e.seats) || 1,
          monthlySpend: parseFloat(e.monthlySpend) || 0,
        })),
        teamSize,
        useCase,
      });

      const supabase = createClient();
      const { data, error } = await supabase
        .from("audits")
        .insert({
          tools: entries,
          team_size: teamSize,
          use_case: useCase,
          total_monthly_spend: result.totalMonthlySpend,
          total_monthly_savings: result.totalMonthlySavings,
          total_annual_savings: result.totalAnnualSavings,
          is_high_savings: result.isHighSavings,
          is_optimal: result.isOptimal,
          recommendations: result.recommendations,
        })
        .select("id")
        .single();

      if (error) throw new Error(error.message);
      if (!data) throw new Error("Failed to create audit record");

      // Clear draft now that we've successfully submitted
      try {
        localStorage.removeItem("audit-draft");
      } catch {
        // ignore
      }

      router.push(`/results/${data.id}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen text-zinc-900 font-[family-name:var(--font-syne)] selection:bg-[#086841]/20 selection:text-[#086841] relative"
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
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 100% 100%, rgba(8,104,65,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-instrument-serif font-extrabold tracking-tight text-zinc-900 mb-3 leading-[1.15]">
            What&apos;s in your AI stack?
          </h1>
          <p className="text-zinc-500 text-base leading-relaxed">
            Enter your current tools and spend. We&apos;ll identify exact
            savings and show you where you&apos;re overpaying.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {entries.map((entry, i) => (
              <ToolRow
                key={entry.id}
                entry={entry}
                index={i}
                onUpdate={updateTool}
                onRemove={removeTool}
              />
            ))}
          </AnimatePresence>

          <AddToolPanel
            onAdd={addTool}
            existingToolIds={entries.map((e) => e.toolId)}
          />

          <div className="pt-2 pb-1">
            <div className="h-px bg-gradient-to-r from-transparent via-zinc-200/80 to-transparent" />
          </div>

          <div
            className="border border-zinc-200/70 rounded-xl p-5"
            style={{
              backgroundColor: "rgba(255,255,255,0.75)",
              boxShadow:
                "0 2px 12px rgba(8,104,65,0.04), 0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-4">
              Team Context
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
                  Team Size
                </label>
                <CustomSelect
                  value={teamSize}
                  onChange={setTeamSize}
                  options={["1–5", "6–15", "16–50", "51–200", "200+"]}
                  placeholder="Select size"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1.5 block">
                  Primary Use Case
                </label>
                {/* FIX: display the label but store the lowercase UseCase key */}
                <CustomSelect
                  value={useCase ? USE_CASE_LABELS[useCase] : ""}
                  onChange={(v) => {
                    const key = USE_CASES.find(
                      (uc) => USE_CASE_LABELS[uc] === v,
                    );
                    if (key) setUseCase(key);
                  }}
                  options={USE_CASES.map((uc) => USE_CASE_LABELS[uc])}
                  placeholder="Select use case"
                />
              </div>
            </div>
          </div>

          {submitError && (
            <p className="text-center text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {submitError}
            </p>
          )}

          <div
            className="border border-zinc-200/70 rounded-xl p-5 flex items-center justify-between"
            style={{
              backgroundColor: "rgba(255,255,255,0.75)",
              boxShadow:
                "0 2px 12px rgba(8,104,65,0.04), 0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <div>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-1">
                Declared spend
              </p>
              <p className="text-2xl font-light text-zinc-900 tracking-tight">
                ${totalSpend.toLocaleString()}
                <span className="text-sm text-zinc-400 ml-1">/ mo</span>
              </p>
            </div>
            <motion.button
              type="submit"
              disabled={!canSubmit}
              whileHover={
                canSubmit ? { scale: 1.02, backgroundColor: "#065032" } : {}
              }
              whileTap={canSubmit ? { scale: 0.98 } : {}}
              className="flex items-center gap-2 bg-[#086841] text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                boxShadow: canSubmit
                  ? "0 4px 16px rgba(8,104,65,0.25)"
                  : "none",
              }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  Run Audit
                  <FiArrowRight size={15} />
                </>
              )}
            </motion.button>
          </div>

          {!canSubmit && filledCount === 0 && !isLoading && (
            <p className="text-center text-xs text-zinc-400">
              Fill in at least one tool with a plan and monthly spend to
              continue
            </p>
          )}
        </motion.form>
      </div>
    </div>
  );
}
