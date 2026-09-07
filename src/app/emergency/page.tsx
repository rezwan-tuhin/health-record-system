"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Siren,
  Timer,
  HeartPulse,
  FileSearch,
  Stethoscope,
  UserRound,
  ShieldAlert,
  Activity,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";
import {
  registrarPatients,
  records,
  auditLogs,
  emergencySessions as seedSessions,
  type EmergencySession,
} from "@/lib/dummy";

const erDoctor = "Dr. Marcus Webb";

export default function EmergencyRoom() {
  const [sessions, setSessions] = useState<EmergencySession[]>(seedSessions);
  const [triggerOpen, setTriggerOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [justification, setJustification] = useState("");
  const [duration, setDuration] = useState("60");

  const activeSession = sessions.find((s) => s.active);

  // Live countdown for the active session
  const ttlSeconds = useMemo(() => activeSession?.ttlSeconds ?? 0, [activeSession]);
  const [, force] = useState(0);
  useEffect(() => {
    if (!activeSession) return;
    const t = setInterval(() => force((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [activeSession]);
  const remaining = activeSession ? Math.max(0, ttlSeconds - ttlSeconds * 0) : 0;

  const emergencyEvents = auditLogs.filter((e) => e.type === "EmergencyAccessTriggered");
  const emergencyAccessible = activeSession
    ? records.filter((r) => r.patientAddress === activeSession.patientAddress && !r.tombstoned)
    : [];

  const trigger = () => {
    if (!selectedPatient || !justification) return;
    const patient = registrarPatients.find((p) => p.address === selectedPatient);
    if (!patient) return;
    const mins = Number(duration);
    const validUntil = new Date(Date.now() + mins * 60_000).toISOString();
    const session: EmergencySession = {
      patientAddress: patient.address,
      patientName: patient.name,
      doctor: "0xF1cA...4B6d",
      doctorName: erDoctor,
      justification,
      triggeredAt: new Date().toISOString(),
      validUntil,
      active: true,
      ttlSeconds: mins * 60,
    };
    setSessions([session, ...sessions.filter((s) => !s.active)]);
    setTriggerOpen(false);
    setSelectedPatient("");
    setJustification("");
    setDuration("60");
  };

  const endSession = () => {
    setSessions(sessions.map((s) => (s.active ? { ...s, active: false, ttlSeconds: 0 } : s)));
  };

  const fmt = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Emergency Department"
        title="Break-Glass Emergency Access"
        description="Life-threatening situations bypass consent. Every bypass is justified, time-boxed, and fully audited."
        action={
          <Badge tone="red" dot pulse>
            ER_SPECIALIST_ROLE
          </Badge>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Siren} label="Active Sessions" value={sessions.filter((s) => s.active).length} sub="break-glass windows" tone="red" index={0} />
        <StatCard icon={Timer} label="Sessions Logged" value={sessions.length + 1} sub="complete history" tone="sky" index={1} />
        <StatCard icon={Activity} label="Emergency Events" value={emergencyEvents.length} sub="audited on-chain" tone="amber" index={2} />
      </div>

      {/* Live session */}
      {activeSession ? (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card glow="red" className="relative mt-6 overflow-hidden p-6">
            <div className="absolute right-6 top-6 flex items-center gap-2">
              <Badge tone="red" dot pulse>ACCESS ACTIVE</Badge>
              <Button size="sm" variant="outline" onClick={endSession}>
                End Session
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20 text-red-300">
                  <HeartPulse className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-lg font-bold text-heading">{activeSession.patientName}</p>
                  <p className="font-mono text-xs text-muted">{activeSession.patientAddress}</p>
                </div>
              </div>
              <div className="rounded-xl bg-red-500/10 px-5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">Remaining Window</p>
                <p className="font-mono text-4xl font-bold tracking-wider text-red-200">
                  {fmt(remaining)}
                </p>
              </div>
              <div className="min-w-0 flex-1 rounded-xl bg-white/[0.03] p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">Justification</p>
                <p className="text-sm leading-relaxed text-body">{activeSession.justification}</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
              <div className="h-full animate-pulse rounded-full bg-red-500" style={{ width: `${(remaining / activeSession.ttlSeconds) * 100}%` }} />
            </div>
          </Card>

          {/* Emergency-visible records */}
          <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-heading">
              <FileSearch className="h-5 w-5 text-red-400" /> Emergency Records Access
            </h2>
            {emergencyAccessible.length === 0 ? (
              <EmptyState icon={FileSearch} title="No records available" description="The patient has no active, non-tombstoned record anchors." />
            ) : (
              <div className="grid gap-3">
                {emergencyAccessible.map((r) => (
                  <Card key={r.id} glow="red" className="flex items-center gap-4 p-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-300">
                      <FileSearch className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-heading">{r.title}</p>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-muted">{r.pointer}</p>
                    </div>
                    <Badge tone={r.tombstoned ? "slate" : "green"} dot>{r.tombstoned ? "Tombstoned" : "Intact"}</Badge>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ) : (
        <Card className="mt-6 p-6">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-muted">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-heading">No active emergency window</h3>
            <p className="mt-1 max-w-md text-sm text-muted">
              To access a patient's records without consent, trigger a break-glass session. The window is time-boxed and fully auditable.
            </p>
            <Button className="mt-6" onClick={() => setTriggerOpen(true)}>
              <Siren className="h-4 w-4" /> Trigger Emergency Access
            </Button>
          </div>
        </Card>
      )}

      {/* Past sessions */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-bold text-heading">Session History</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {sessions.filter((s) => !s.active).map((s, i) => (
                <motion.div key={s.validUntil} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <Card className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/15 text-slate-300">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-heading">{s.patientName}</p>
                        <Badge tone="slate">Closed</Badge>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted">{s.justification}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end text-right">
                      <p className="font-mono text-xs text-muted">{new Date(s.triggeredAt).toLocaleString()}</p>
                      <p className="text-[10px] text-muted">by {s.doctorName}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Trigger modal */}
      <Modal open={triggerOpen} onClose={() => setTriggerOpen(false)} title="Trigger Emergency Access" size="sm">
        <div className="space-y-4">
          <div className="rounded-xl bg-red-500/10 p-3 text-xs leading-relaxed text-red-200">
            ⚠ Bypasses patient consent. Only for life-threatening situations. Duration is capped and every interaction is logged with justification.
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">Patient</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-heading outline-none focus:border-red-500/50"
            >
              <option value="">Select patient…</option>
              {registrarPatients.map((p) => (
                <option key={p.address} value={p.address}>{p.name} — {p.address}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">Justification</label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={3}
              placeholder="e.g. Unconscious patient, suspected cardiac event — immediate vitals required"
              className="w-full resize-none rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-heading outline-none placeholder:text-muted focus:border-red-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">Duration (minutes)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-heading outline-none focus:border-red-500/50"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="120">2 hours (max)</option>
            </select>
          </div>
          <Button variant="danger" fullWidth onClick={trigger} disabled={!selectedPatient || !justification}>
            <Play className="h-4 w-4" /> Activate Break-Glass
          </Button>
          {/* TODO(smart-contract): call triggerEmergencyAccess(patient, justification, duration*60) via wagmi */}
        </div>
      </Modal>
    </AppShell>
  );
}