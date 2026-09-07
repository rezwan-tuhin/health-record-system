"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  UserRound,
  Stethoscope,
  ShieldCheck,
  Siren,
  GitBranch,
  Database,
  Fingerprint,
  HeartPulse,
} from "lucide-react";
import FeatureCards from "@/components/landing/FeatureCards";
import { setActiveRole } from "@/store/slices/roleSlice";
import { useAppDispatch } from "@/store";
import type { Role } from "@/lib/dummy";

const demoRoles: {
  role: Role;
  label: string;
  description: string;
  Icon: React.ElementType;
  href: string;
  tone: string;
  iconBg: string;
}[] = [
  {
    role: "patient",
    label: "Patient Demo",
    description: "Manage consent, view records, see the audit trail",
    Icon: UserRound,
    href: "/patient",
    tone: "text-teal-300",
    iconBg: "bg-teal-500/15",
  },
  {
    role: "provider",
    label: "Provider Demo",
    description: "Anchor records for consented patients",
    Icon: Stethoscope,
    href: "/provider",
    tone: "text-violet-300",
    iconBg: "bg-violet-500/15",
  },
  {
    role: "admin",
    label: "Regulator Demo",
    description: "Verify providers, audit and tombstone",
    Icon: ShieldCheck,
    href: "/admin",
    tone: "text-amber-300",
    iconBg: "bg-amber-500/15",
  },
  {
    role: "emergency",
    label: "Emergency Demo",
    description: "Break-glass access with live countdown",
    Icon: Siren,
    href: "/emergency",
    tone: "text-red-300",
    iconBg: "bg-red-500/15",
  },
];

const flowSteps = [
  {
    Icon: UserRound,
    title: "Register",
    desc: "Patient & providers register with a DID URI",
    color: "text-sky-300 bg-sky-500/15",
  },
  {
    Icon: ShieldCheck,
    title: "Verify",
    desc: "Regulator verifies providers into roles",
    color: "text-amber-300 bg-amber-500/15",
  },
  {
    Icon: HeartPulse,
    title: "Consent",
    desc: "Patient grants time-bound consent",
    color: "text-emerald-300 bg-emerald-500/15",
  },
  {
    Icon: Database,
    title: "Anchor",
    desc: "Record hash + IPFS pointer stored on-chain",
    color: "text-teal-300 bg-teal-500/15",
  },
  {
    Icon: Fingerprint,
    title: "Verify",
    desc: "Anyone verifies integrity anytime",
    color: "text-violet-300 bg-violet-500/15",
  },
];

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <main className="grid-bg min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-1.5 text-xs font-medium text-muted">
            <Activity className="h-3.5 w-3.5 text-teal-400" />
            Smart Contract Demo · HealthRecordSystem.sol
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-heading sm:text-6xl">
            Health Records on the{" "}
            <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
              Blockchain
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-body">
            A consent-driven, auditable health record system where{" "}
            <span className="text-teal-300">patients own their data</span>, verified{" "}
            <span className="text-violet-300">providers get access</span>, regulators
            enforce the rules, and every action is{" "}
            <span className="text-sky-300">immutable on-chain</span>.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => {
                dispatch(setActiveRole("patient"));
                router.push("/patient");
              }}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-teal-500 px-6 text-base font-semibold text-slate-950 shadow-[0_0_28px_-6px_rgba(20,184,166,0.8)] transition-all hover:bg-teal-400 active:scale-[0.98]"
            >
              Explore the Demo
              <ArrowRight className="h-4 w-4" />
            </motion.button>
            <span className="rounded-full border border-line bg-white/5 px-4 py-2 text-xs text-muted">
              5 live dashboards · 4 roles
            </span>
          </div>
        </motion.div>
      </section>

      {/* Feature pillars */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-heading">Three Core Pillars</h2>
          <p className="mt-2 text-sm text-muted">
            Every feature in this system maps back to a production-grade smart contract module.
          </p>
        </div>
        <FeatureCards />
      </section>

      {/* Role demo entry */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-heading">Enter as Any Role</h2>
          <p className="mt-2 text-sm text-muted">
            Pick a role to explore its dedicated dashboard — built for live classroom demonstration.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demoRoles.map((r, i) => (
            <motion.button
              key={r.role}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => {
                dispatch(setActiveRole(r.role));
                router.push(r.href);
              }}
              className="panel group rounded-2xl p-5 text-left transition-all hover:-translate-y-1 hover:bg-white/[0.04]"
            >
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${r.iconBg}`}>
                <r.Icon className={`h-5 w-5 ${r.tone}`} />
              </div>
              <p className="font-semibold text-heading">{r.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{r.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-300 opacity-0 transition-opacity group-hover:opacity-100">
                Open dashboard <ArrowRight className="h-3 w-3" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Flow diagram */}
      <section className="border-t border-line bg-panel/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-teal-400">
              <GitBranch className="h-4 w-4" />
              Lifecycle
            </div>
            <h2 className="text-2xl font-bold text-heading">How a Record Moves Through the System</h2>
          </div>
          <div className="grid items-stretch gap-3 md:grid-cols-5">
            {flowSteps.map((s, i) => (
              <div key={s.title} className="relative">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`panel flex h-full flex-col items-center p-5 text-center ${i % 2 === 0 ? "glow-teal" : ""}`}
                >
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${s.color.split(" ")[1]}`}>
                    <s.Icon className={`h-5 w-5 ${s.color.split(" ")[0]}`} />
                  </div>
                  <p className="text-sm font-semibold text-heading">{s.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{s.desc}</p>
                  <span className="mt-2 font-mono text-[10px] text-muted">step {i + 1}</span>
                </motion.div>
                {i < flowSteps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-teal-500/70 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-6">
          <p className="flex items-center gap-2 text-xs text-muted">
            <Activity className="h-4 w-4 text-teal-400" />
            ChainHealth · Educational blockchain demo
          </p>
          <p className="font-mono text-xs text-muted">
            contract: HealthRecordSystem.sol · ^0.8.24
          </p>
        </div>
      </footer>
    </main>
  );
}