"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import {
  UserPlus,
  ShieldCheck,
  HeartHandshake,
  HeartOff,
  FileCheck2,
  FileX2,
  FileSearch,
  Siren,
} from "lucide-react";
import type { AuditEvent } from "@/lib/dummy";

const eventIcon: Record<AuditEvent["type"], React.ElementType> = {
  PatientRegistered: UserPlus,
  ProviderRegistered: UserPlus,
  ProviderVerified: ShieldCheck,
  ConsentGranted: HeartHandshake,
  ConsentRevoked: HeartOff,
  RecordAnchored: FileCheck2,
  RecordTombstoned: FileX2,
  RecordAccessed: FileSearch,
  EmergencyAccessTriggered: Siren,
};

const eventTone: Record<AuditEvent["type"], string> = {
  PatientRegistered: "bg-sky-500/15 text-sky-300",
  ProviderRegistered: "bg-violet-500/15 text-violet-300",
  ProviderVerified: "bg-amber-500/15 text-amber-300",
  ConsentGranted: "bg-emerald-500/15 text-emerald-300",
  ConsentRevoked: "bg-slate-500/15 text-slate-300",
  RecordAnchored: "bg-teal-500/15 text-teal-300",
  RecordTombstoned: "bg-red-500/15 text-red-300",
  RecordAccessed: "bg-sky-500/15 text-sky-300",
  EmergencyAccessTriggered: "bg-red-500/15 text-red-300",
};

interface EventLogProps {
  events: AuditEvent[];
  title?: string;
  compact?: boolean;
}

function formatTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EventLog({ events, title = "Audit Trail", compact = false }: EventLogProps) {
  return (
    <div className="flex h-full flex-col">
      {title && (
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-heading">{title}</h3>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted">
            {events.length} events
          </span>
        </div>
      )}
      <div className={clsx("space-y-1 overflow-y-auto", compact ? "max-h-72" : "pr-1")}>
        {events.map((e, i) => {
          const Icon = eventIcon[e.type];
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group relative flex gap-3 rounded-xl p-3 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex flex-col items-center">
                <div className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", eventTone[e.type])}>
                  <Icon className="h-4 w-4" />
                </div>
                {i < events.length - 1 && <div className="mt-1 w-px flex-1 bg-line" />}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-heading">{e.type}</span>
                  <span className="shrink-0 font-mono text-[10px] text-muted">{formatTime(e.timestamp)}</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-body">
                  <span className="font-medium text-teal-300">{e.actorName}</span>
                  <span className="text-muted"> → {e.details}</span>
                </p>
                <div className="mt-1.5 flex items-center gap-3 font-mono text-[10px] text-muted">
                  <span className="truncate">tx: {e.txHash}</span>
                  <span className="shrink-0">#{e.block}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}