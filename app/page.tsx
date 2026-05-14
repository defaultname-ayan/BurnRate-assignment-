"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const TOOLS = [
  {
    name: "GitHub Copilot",
    plan: "Business · 95 seats",
    spend: "$1,900",
    rec: "Remove 12 inactive seats",
    savings: "-$228",
    image: "/copilot.png",
  },
  {
    name: "ChatGPT",
    plan: "Team · 40 seats",
    spend: "$1,000",
    rec: "Downgrade 15 seats to Plus",
    savings: "-$225",
    image: "/chatgpt.png",
  },
  {
    name: "Claude",
    plan: "Pro Tier",
    spend: "$400",
    rec: "Consolidate to API direct usage",
    savings: "-$120",
    image: "/claude.png",
  },
  {
    name: "Cursor",
    plan: "Business",
    spend: "$800",
    rec: "Switch 10 seats to Hobby",
    savings: "-$200",
    image: "/cursor.png",
  },
];

const STATS = [
  { value: "$4.2k", label: "Average monthly waste identified per org" },
  { value: "73%", label: "Of engineering teams overpay for AI seats" },
  { value: "15m", label: "To generate a full-stack audit report" },
];

const STEPS = [
  {
    num: "01",
    title: "Connect Workspace",
    desc: "Grant read-only access via SSO or upload billing CSVs. Zero infrastructure changes required.",
  },
  {
    num: "02",
    title: "Usage Analysis",
    desc: "We cross-reference provisioned seats against actual developer activity and active API tokens.",
  },
  {
    num: "03",
    title: "Surgical Reductions",
    desc: "Review a line-by-line breakdown of exactly which seats to revoke and which tiers to downgrade.",
  },
];

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useReveal(amount = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount,
    margin: "0px 0px -40px 0px",
  });
  return [ref, inView] as const;
}

function FloatingBadges() {
  const badges = [
    { src: "/copilot.png", top: "12%", left: "5%", delay: 0 },
    { src: "/cursor.png", top: "35%", right: "8%", delay: 0.2 },
    { src: "/chatgpt.png", bottom: "18%", right: "12%", delay: 0.4 },
    { src: "/claude.png", bottom: "25%", left: "10%", delay: 0.6 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block overflow-hidden max-w-7xl mx-auto z-0">
      {badges.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 + b.delay, ease }}
          className="absolute"
          style={{ top: b.top, left: b.left, right: b.right, bottom: b.bottom }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: b.delay,
            }}
            className="w-16 h-16 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-zinc-100 flex items-center justify-center rotate-[-4deg]"
          >
            <img
              src={b.src}
              alt="AI Tool"
              className="w-8 h-8 object-contain drop-shadow-sm"
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

function Ticker() {
  const items = [
    "ChatGPT",
    "Cursor",
    "Claude",
    "Copilot",
    "Gemini",
    "Windsurf",
    "ChatGPT",
    "Cursor",
    "Claude",
    "Copilot",
  ];
  const doubled = [...items, ...items];
  return (
    <div
      className="overflow-hidden border-y border-zinc-200/50 py-[18px] bg-white/30 backdrop-blur-sm"
      style={{
        maskImage:
          "linear-gradient(to right,transparent,black 8%,black 92%,transparent)",
      }}
    >
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((w, i) => (
          <span
            key={i}
            className="text-[10px] font-semibold tracking-[0.28em] uppercase text-zinc-400 select-none"
          >
            {w}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function HeroCard() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0, y: 48, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 1, delay: 0.35, ease }}
      className="w-full max-w-[640px] mx-auto mt-16 px-0"
    >
      <div className="relative">
        <div
          className="absolute -inset-px rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,104,65,0.3) 0%, rgba(8,104,65,0.05) 60%, transparent 100%)",
          }}
        />
        <div
          className="relative rounded-2xl overflow-hidden border border-white/60 bg-white/80"
          style={{
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 32px 80px -12px rgba(8,104,65,0.12), 0 8px 32px -4px rgba(0,0,0,0.06)",
          }}
        >
          <div
            className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-zinc-100/80"
            style={{ background: "rgba(249,249,247,0.8)" }}
          >
            <div className="flex gap-1.5">
              {["bg-zinc-300/70", "bg-zinc-300/70", "bg-zinc-300/70"].map(
                (c, i) => (
                  <div key={i} className={`w-2.5 h-2.5 rounded-full ${c}`} />
                ),
              )}
            </div>
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-zinc-400">
              Audit Report
            </span>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4, ease }}
              className="text-[11px] font-bold tracking-wide text-[#086841] bg-[#086841]/10 border border-[#086841]/20 px-3 py-1 rounded-md font-mono"
            >
              −$673 / mo
            </motion.div>
          </div>

          <div className="divide-y divide-zinc-100/70">
            {TOOLS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
                className="flex items-center justify-between px-4 sm:px-5 py-3.5 transition-colors duration-200 cursor-default"
                style={{
                  background:
                    hovered === i ? "rgba(8,104,65,0.035)" : "transparent",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white border border-zinc-100 shadow-sm shrink-0">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-4 h-4 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-900 leading-none mb-1 truncate">
                      {t.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {t.plan}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-[13px] font-semibold text-zinc-900 font-mono">
                    {t.spend}
                  </p>
                  <p className="text-[11px] font-semibold text-[#086841] mt-0.5">
                    Save {t.savings.replace("-", "")}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCell({
  value,
  label,
  index,
}: {
  value: string;
  label: string;
  index: number;
}) {
  const [ref, inView] = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease }}
      className="text-center py-12 px-8"
    >
      <p
        className="text-[44px] sm:text-[52px] font-light leading-none mb-3 tracking-tight text-zinc-900"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        {value}
      </p>
      <p className="text-[13px] text-zinc-400 leading-relaxed max-w-[160px] mx-auto">
        {label}
      </p>
    </motion.div>
  );
}

function Step({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const [ref, inView] = useReveal();
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative py-10 px-8 border-l border-zinc-200 overflow-hidden cursor-default bg-white/40 backdrop-blur-sm"
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, rgba(8,104,65,0.04) 0%, transparent 100%)",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: hovered ? "0%" : "-100%" }}
        transition={{ duration: 0.4, ease: [0.32, 0, 0.67, 0] }}
      />
      <motion.div
        className="absolute bottom-0 left-8 right-8 h-px bg-[#086841]"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        style={{ transformOrigin: "left" }}
        transition={{ duration: 0.35, ease }}
      />
      <p className="text-[10px] font-bold text-[#086841] tracking-[0.2em] mb-6 relative z-10">
        {step.num} ——
      </p>
      <h3 className="text-[17px] font-semibold text-zinc-900 mb-3 relative z-10 tracking-tight">
        {step.title}
      </h3>
      <p className="text-[13px] text-zinc-500 leading-relaxed relative z-10">
        {step.desc}
      </p>
    </motion.div>
  );
}

function HowItWorksHeading() {
  const [ref, inView] = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className="mb-16 max-w-xl"
    >
      <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#086841] mb-5">
        How it works
      </p>
      <h2
        className="text-[36px] sm:text-[42px] leading-[1.05] tracking-tight text-zinc-900 mb-5"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Identify waste in minutes.
      </h2>
      <p className="text-[15px] text-zinc-500 leading-relaxed">
        We integrate directly with your identity provider and billing APIs to
        build a comprehensive map of your organization&apos;s SaaS utilization.
      </p>
    </motion.div>
  );
}

function AuditHeading() {
  const [ref, inView] = useReveal();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
    >
      <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#086841] mb-5">
        Sample audit
      </p>
      <h2
        className="text-[36px] sm:text-[42px] leading-[1.05] tracking-tight text-zinc-900 mb-5"
        style={{ fontFamily: "'DM Serif Display', serif" }}
      >
        Actionable intelligence.
      </h2>
      <p className="text-[15px] text-zinc-500 leading-relaxed max-w-xl">
        Stop relying on manual spreadsheets. Get a definitive, line-by-line
        breakdown of exactly where capital is being misallocated.
      </p>
    </motion.div>
  );
}

function CTASection() {
  const [ref, inView] = useReveal(0.2);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease }}
      className="rounded-3xl px-6 sm:px-10 py-20 sm:py-24 text-center relative overflow-hidden border border-[#086841]/15 shadow-xl shadow-[#086841]/5"
      style={{ background: "#061a0e" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(8,104,65,0.28) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />
      <div className="relative z-10 max-w-lg mx-auto">
        <p className="text-[10px] font-bold tracking-[0.24em] uppercase text-[#4ade80]/60 mb-6">
          For Engineering Leaders
        </p>
        <h2
          className="text-[40px] sm:text-[52px] leading-[1.0] tracking-[-0.02em] text-[#f5f4f0] mb-6"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          Optimize your stack today.
        </h2>
        <p className="text-[15px] text-[#f5f4f0]/40 leading-relaxed mb-10 font-normal">
          Deploy BurnRate seamlessly. Zero engineering required. Uncover
          thousands in monthly savings before your next billing cycle.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/audit"
            className="w-full sm:w-auto bg-[#fcfcfc] hover:bg-white text-[#061a0e] text-[13px] font-semibold tracking-wide px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 shadow-lg flex items-center justify-center"
          >
            Request an Audit
          </Link>
          <Link
            href="https://github.com/defaultname-ayan/BurnRate-assignment-.git"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-transparent border border-white/10 hover:border-white/25 text-[#f5f4f0]/55 hover:text-[#f5f4f0]/90 text-[13px] font-medium px-7 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center"
          >
            View Repository
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Mobile card view for each tool row
function AuditCard({
  tool,
  index,
  inView,
}: {
  tool: (typeof TOOLS)[number];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      className="bg-white/90 rounded-xl border border-zinc-100 p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-zinc-100 shadow-sm">
            <img
              src={tool.image}
              alt={tool.name}
              className="w-4 h-4 object-contain"
            />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-zinc-900">
              {tool.name}
            </p>
            <p className="text-[11px] text-zinc-400">
              {tool.plan.split("·")[0].trim()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[14px] font-bold text-zinc-900 font-mono">
            {tool.spend}
          </p>
          <p className="text-[11px] font-bold text-[#086841] font-mono">
            {tool.savings}
          </p>
        </div>
      </div>
      <div className="bg-[#086841]/5 rounded-lg px-3 py-2">
        <p className="text-[11px] text-zinc-500">
          <span className="font-semibold text-[#086841]">Action: </span>
          {tool.rec}
        </p>
      </div>
    </motion.div>
  );
}

function AuditTable() {
  const [ref, inView] = useReveal(0.1);
  return (
    <div ref={ref} className="mt-14">
      {/* Desktop table */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease }}
        className="hidden md:block rounded-2xl overflow-hidden border border-zinc-200/80 bg-white/80"
        style={{
          backdropFilter: "blur(16px)",
          boxShadow:
            "0 8px 40px -8px rgba(8,104,65,0.07), 0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <table className="w-full text-[13px] border-collapse">
          <thead>
            <tr
              className="border-b border-zinc-100/80"
              style={{ background: "rgba(249,249,247,0.9)" }}
            >
              {[
                "Service",
                "Plan",
                "Monthly Spend",
                "Action Required",
                "Impact",
              ].map((h, i) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-400 text-left ${i === 4 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TOOLS.map((t, i) => (
              <motion.tr
                key={t.name}
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                className="border-b border-zinc-50 hover:bg-[#086841]/[0.025] transition-colors duration-150"
              >
                <td className="px-6 py-4 font-semibold text-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-white border border-zinc-100 shadow-sm flex items-center justify-center shrink-0">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-4 h-4 object-contain"
                      />
                    </div>
                    {t.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {t.plan.split("·")[0].trim()}
                </td>
                <td className="px-6 py-4 text-zinc-900 font-mono">{t.spend}</td>
                <td className="px-6 py-4 text-zinc-400">{t.rec}</td>
                <td className="px-6 py-4 text-right font-bold text-[#086841] font-mono">
                  {t.savings}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Mobile cards */}
      <div className="flex md:hidden flex-col gap-3">
        {TOOLS.map((t, i) => (
          <AuditCard key={t.name} tool={t} index={i} inView={inView} />
        ))}
      </div>
    </div>
  );
}

export default function BurnRatePage() {
  return (
    <div
      className="min-h-screen text-zinc-900 selection:bg-[#086841]/20 selection:text-[#086841]"
      style={{
        backgroundColor: "#fcfcfc",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
          maskImage: "linear-gradient(to bottom, white 40%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, white 40%, transparent 100%)",
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.025'/%3E%3C/svg%3E")`,
          backgroundSize: "192px",
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 45% at 50% -2%, rgba(8,104,65,0.07) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10">
        <section className="pt-32 sm:pt-38 pb-24 px-5 max-w-5xl mx-auto relative">
          <FloatingBadges />

          <div className="text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
              className="leading-[0.95] tracking-[-0.03em] text-zinc-900 max-w-[820px] mx-auto mb-7"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(38px, 8vw, 88px)",
              }}
            >
              Stop overpaying for your{" "}
              <span className="text-[#086841] italic relative">
                AI developer stack
                <svg
                  className="absolute w-full -bottom-1 left-0 text-[#086841]/25"
                  viewBox="0 0 100 6"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M0 4 Q 25 0 50 4 Q 75 8 100 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease }}
              className="text-[15px] sm:text-[17px] text-zinc-500 max-w-[480px] mx-auto mb-10 leading-relaxed font-normal px-2"
            >
              The definitive platform for engineering leaders to discover unused
              licenses, consolidate overlapping tools, and reduce monthly SaaS
              burn automatically.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.26, ease }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 px-2"
            >
              <Link
                href="/audit"
                className="w-full sm:w-auto bg-[#086841] hover:bg-[#054229] text-white text-[13px] font-semibold tracking-wide px-8 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 shadow-[0_8px_20px_rgba(8,104,65,0.25)] flex items-center justify-center"
              >
                Connect Workspace
              </Link>
              <Link
                href="https://github.com/defaultname-ayan/BurnRate-assignment-.git"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white/80 hover:bg-white border border-zinc-200 hover:border-[#086841]/30 text-zinc-700 hover:text-[#086841] text-[13px] font-medium px-7 py-3.5 rounded-lg transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center"
                style={{ backdropFilter: "blur(8px)" }}
              >
                View Documentation
              </Link>
            </motion.div>
          </div>

          <HeroCard />
        </section>

        <Ticker />

        <section className="border-b border-zinc-200/50 bg-white/40">
          <div className="max-w-5xl mx-auto px-5">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200/50">
              {STATS.map((s, i) => (
                <StatCell key={s.value} {...s} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-b border-zinc-200/50 bg-[#fcfcfc]"
        >
          <div className="max-w-5xl mx-auto px-5 py-20 sm:py-28">
            <HowItWorksHeading />

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-zinc-200/60 pt-2">
              {STEPS.map((s, i) => (
                <Step key={s.num} step={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing-data"
          className="border-b border-zinc-200/50"
          style={{ background: "rgba(8,104,65,0.015)" }}
        >
          <div className="max-w-5xl mx-auto px-5 py-20 sm:py-28">
            <AuditHeading />
            <AuditTable />
          </div>
        </section>

        <section
          id="for-ctos"
          className="max-w-5xl mx-auto px-5 py-20 sm:py-28"
        >
          <CTASection />
        </section>

        <footer className="border-t border-zinc-200/50 bg-[#fcfcfc]">
          <div className="max-w-5xl mx-auto px-5 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-zinc-400/60">
              BurnRate.ai
            </span>
            <p className="text-[11px] text-zinc-400/50">
              © 2026 BurnRate Inc. All rights reserved.
            </p>
            <nav className="flex items-center gap-7">
              <Link
                href="https://github.com/defaultname-ayan/BurnRate-assignment-.git"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-zinc-400/60 hover:text-[#086841] transition-colors duration-200"
              >
                Source Code
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
