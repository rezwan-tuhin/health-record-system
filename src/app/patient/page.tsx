"use client";

import { useMemo, useState } from "react";
import {
  HeartHandshake,
  HeartOff,
  FileCheck2,
  CalendarClock,
  UserRound,
  ShieldCheck,
  Droplets,
  PhoneCall,
  Fingerprint,
  Plus,
  Stethoscope,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import EventLog from "@/components/ui/EventLog";
import Modal from "@/components/ui/Modal";
import {
  currentPatient,
  providers,
  consents as seedConsents,
  records,
  emergencySessions,
  auditLogs,
  type Consent,
} from "@/lib/dummy";

export default function PatientDashboard() {
  const [consents, setConsents] = useState<Consent[]>(seedConsents);
  const [grantOpen, setGrantOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [purpose, setPurpose] = useState("");
  const [expiry, setExpiry] = useState("7");

  const activeConsents = consents.filter((c) => c.active);
  const myRecords = records.filter((r) => r.patientAddress === currentPatient.address && !r.tombstoned);
  const activeEmergency = emergencySessions.filter((s) => s.active);

  const verifiedProviders = useMemo(
    () => providers.filter((p) => p.verified && !activeConsents.some((c) => c.providerAddress === p.address)),
    [activeConsents]
  );

  const handleGrant = () => {
    if (!selectedProvider || !purpose) return;
    const p = providers.find((x) => x.address === selectedProvider);
    if (!p) return;
    const expiresDate = new Date();
    expiresDate.setDate(expiresDate.getDate() + Number(expiry));
    const newConsent: Consent = {
      id: `c-${Date.now()}`,
      patientAddress: currentPatient.address,
      providerAddress: p.address,
      providerName: p.name,
      purpose,
      grantedAt: new Date().toISOString(),
      expiresAt: expiresDate.toISOString(),
      active: true,
    };
    setConsents([newConsent, ...consents]);
    setGrantOpen(false);
    setSelectedProvider("");
    setPurpose("");
    setExpiry("7");
  };

  const handleRevoke = (id: string) => {
    setConsents(consents.map((c) => (c.id === id ? { ...c, active: false } : c)));
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Patient Portal"
        title={`Welcome back, ${currentPatient.name.split(" ")[0]}`}
        description="You control who can access your health records and for how long. Every action is recorded on-chain."
        action={
          <Button variant="outline" size="sm">
            <CalendarClock className="h-4 w-4" /> Registered Nov 12, 2024
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={HeartHandshake} label="Active Consents" value={activeConsents.length} sub="providers with access" tone="teal" index={0} />
        <StatCard icon={FileCheck2} label="Records Anchored" value={myRecords.length} sub="verifiable on-chain" tone="sky" index={1} />
        <StatCard icon={ShieldCheck} label="Emergency Sessions" value={activeEmergency.length} sub="break-glass active" tone="red" index={2} />
        <StatCard icon={CalendarClock} label="Account Age" value="299 days" sub="since registration" tone="amber" index={3} />
      </div>

      {/* Profile + Identity */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-300">
              <UserRound className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-bold text-heading">{currentPatient.name}</p>
              <Badge tone="teal" dot pulse>
                Patient Registered
              </Badge>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/[0.03] p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted"><Droplets className="h-3 w-3" /> Blood Type</p>
              <p className="mt-1 font-semibold text-heading">{currentPatient.blood}</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted"><PhoneCall className="h-3 w-3" /> Emergency</p>
              <p className="mt-1 font-semibold text-heading">{currentPatient.emergencyContact}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {currentPatient.allergies.map((a) => (
              <span key={a} className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-medium text-red-300">
                ⚠ {a}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-heading">
            <Fingerprint className="h-4 w-4 text-teal-400" /> Decentralized Identity (DID)
          </p>
          <div className="rounded-xl border border-line bg-panel p-4">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">didURI</p>
            <p className="break-all font-mono text-sm text-teal-300">{currentPatient.didURI}</p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-panel p-4">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">Wallet Address</p>
              <p className="font-mono text-sm text-body">{currentPatient.address}</p>
            </div>
            <div className="rounded-xl border border-line bg-panel p-4">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted">Record Integrity</p>
              <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-300">
                <CheckCircle2 className="h-4 w-4" /> All records verified
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Consents */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-heading">My Consents</h2>
            <p className="text-xs text-muted">Purpose-bound, time-limited access you grant to providers</p>
          </div>
          <Button size="sm" onClick={() => setGrantOpen(true)} disabled={verifiedProviders.length === 0}>
            <Plus className="h-4 w-4" /> Grant Consent
          </Button>
        </div>

        {consents.length === 0 ? (
          <Card className="p-10 text-center text-sm text-muted">No consents yet — grant your first one above.</Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {consents.map((c) => {
                const expired = new Date(c.expiresAt).getTime() < Date.now();
                return (
                  <motion.div key={c.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <Card glow={c.active && !expired ? "teal" : "none"} className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.active && !expired ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-500/15 text-slate-400"}`}>
                            <Stethoscope className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-heading">{c.providerName}</p>
                            <p className="font-mono text-[10px] text-muted">{c.providerAddress}</p>
                          </div>
                        </div>
                        {c.active ? (
                          expired ? (
                            <Badge tone="slate">Expired</Badge>
                          ) : (
                            <Badge tone="green" dot pulse>Active</Badge>
                          )
                        ) : (
                          <Badge tone="red">Revoked</Badge>
                        )}
                      </div>
                      <p className="mt-3 text-sm text-body">{c.purpose}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted">
                          <CalendarClock className="h-3.5 w-3.5" />
                          expires{" "}
                          <span className="font-semibold text-body">
                            {expired ? "—”" : new Date(c.expiresAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </div>
                        {c.active && !expired && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleRevoke(c.id)}
                          >
                            <HeartOff className="h-3.5 w-3.5" /> Revoke
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Records */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-heading">My Records</h2>
              <p className="text-xs text-muted">Anchored hashes you can verify at any time</p>
            </div>
            <Badge tone="sky" dot>3 on-chain anchors</Badge>
          </div>
          <div className="space-y-3">
            {myRecords.map((r) => {
              const catTone = r.category === "Lab" ? "teal" : r.category === "Imaging" ? "sky" : r.category === "Prescription" ? "violet" : "amber";
              return (
                <Card key={r.id} className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-300">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-heading">{r.title}</p>
                      <Badge tone={catTone as "teal" | "sky" | "violet" | "amber"}>{r.category}</Badge>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-muted">{r.pointer}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-teal-400">
                      hash: {r.recordHash.slice(0, 14)}…{r.recordHash.slice(-6)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge tone="green" dot>Verified</Badge>
                    <span className="text-[10px] text-muted">by {r.anchoredBy}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Emergency + Audit side column */}
        <div className="space-y-5">
          <Card glow="red" className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-heading">
                <ShieldCheck className="h-4 w-4 text-red-400" /> Emergency Access
              </h3>
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
            </div>
            {activeEmergency.length === 0 ? (
              <p className="text-sm text-muted">No break-glass sessions active for your account.</p>
            ) : (
              activeEmergency.map((s) => (
                <div key={s.patientAddress}>
                  <div className="rounded-xl bg-red-500/10 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-red-200">{s.doctorName}</p>
                      <Badge tone="red" dot pulse>LIVE</Badge>
                    </div>
                    <p className="mt-1 text-xs text-red-200/80">{s.justification}</p>
                    <p className="mt-2 font-mono text-[10px] text-red-300/70">
                      valid until {new Date(s.validUntil).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-1/3 animate-pulse rounded-full bg-red-500" />
                  </div>
                </div>
              ))
            )}
          </Card>
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-teal-400" />
              <h3 className="text-sm font-semibold text-heading">Consent Status</h3>
            </div>
            <div className="space-y-2">
              {seedConsents.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs">
                  <span className="text-body">{c.providerName}</span>
                  {c.active ? (
                    <span className="font-semibold text-emerald-300">Active</span>
                  ) : (
                    <span className="font-semibold text-slate-400">Expired</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Audit trail */}
      <div className="mt-8">
        <Card className="p-5">
          <EventLog events={auditLogs.filter((e) => e.target === currentPatient.address)} compact />
        </Card>
      </div>

      {/* Grant consent modal */}
      <Modal open={grantOpen} onClose={() => setGrantOpen(false)} title="Grant Consent" size="sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
              Provider
            </label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-heading outline-none focus:border-teal-500/50"
            >
              <option value="">Select a verified provider…</option>
              {verifiedProviders.map((p) => (
                <option key={p.address} value={p.address}>
                  {p.name} — {p.specialty}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
              Purpose
            </label>
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Annual physical examination"
              className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-heading outline-none placeholder:text-muted focus:border-teal-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
              Expiration
            </label>
            <select
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-heading outline-none focus:border-teal-500/50"
            >
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="365">1 year</option>
            </select>
          </div>
          <Button fullWidth onClick={handleGrant} disabled={!selectedProvider || !purpose}>
            <HeartHandshake className="h-4 w-4" /> Grant Consent
          </Button>
          {/* TODO(smart-contract): call grantConsent(provider, purpose, expiresAt) via wagmi */}
        </div>
      </Modal>
    </AppShell>
  );
}