"use client";

import { motion } from "framer-motion";
import { KeyRound, ShieldAlert, FileCheck2 } from "lucide-react";
import Card from "@/components/ui/Card";

const features = [
  {
    icon: KeyRound,
    title: "Patient Sovereignty",
    description:
      "Every interaction starts with the patient. Access is granted through time-bound, purpose-specific consent that only the patient controls and can revoke at any moment.",
    accent: "text-teal-300",
    iconBg: "bg-teal-500/15",
    tag: "grantConsent()",
  },
  {
    icon: ShieldAlert,
    title: "Break-Glass Emergency",
    description:
      "Life-threatening situations bypass consent through a fully audited emergency window. ER specialists can access records, but every action is logged and justified on-chain.",
    accent: "text-red-300",
    iconBg: "bg-red-500/15",
    tag: "triggerEmergencyAccess()",
  },
  {
    icon: FileCheck2,
    title: "Immutable Record Anchoring",
    description:
      "Records are cryptographically hashed and anchored on-chain while the data itself stays off-chain. Anyone can verify a record's integrity without exposing its contents.",
    accent: "text-sky-300",
    iconBg: "bg-sky-500/15",
    tag: "verifyRecordHash()",
  },
];

export default function FeatureCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + i * 0.1, duration: 0.45 }}
        >
          <Card className="group h-full p-6 transition-all duration-300 hover:-translate-y-1">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${f.iconBg}`}>
              <f.icon className={`h-6 w-6 ${f.accent}`} />
            </div>
            <h3 className="text-base font-semibold text-heading">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.description}</p>
            <code className="mt-4 inline-block rounded-lg bg-white/5 px-2.5 py-1 font-mono text-[11px] text-teal-300">
              {f.tag}
            </code>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}