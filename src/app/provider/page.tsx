"use client";

import { useState } from "react";
import {
  Stethoscope,
  ShieldCheck,
  BadgeCheck,
  FileCheck2,
  FilePlus2,
  UserRound,
  CalendarClock,
  Building2,
  Hash,
  ArrowUpFromDot,
  Users,
  FileSearch,
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
  providers,
  consents,
  records,
  auditLogs,
  registrarPatients,
  type RecordAnchor,
} from "@/lib/dummy";

// Demo is shown through the lens of a verified provider
const me = providers.find((p) => p.verified && p.specialty === "Cardiology")!;

const consentedPatients = registrarPatients.filter((pt) =>
  consents.some((c) => c.patientAddress === pt.address && c.providerAddress === me.address && c.active)
);

export default function ProviderDashboard() {
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [recordTitle, setRecordTitle] = useState("");
  const [recordHash, setRecordHash] = useState("");
  const [pointer, setPointer] = useState("");
  const [anchored, setAnchored] = useState<RecordAnchor[]>(records.filter((r) => r.anchoredBy === me.name || r.anchoredBy === "Sarah Martinez"));

  const myAnchors = anchored.filter((r) => r.anchoredBy === me.name || !r.tombstoned);
  const accessEvents = auditLogs.filter((e) => e.actor === me.address);

  const handleAnchor = () => {
    if (!selectedPatient || !recordTitle || !recordHash || !pointer) return;
    const patient = registrarPatients.find((p) => p.address === selectedPatient);
    const newAnchor: RecordAnchor = {
      id: `r-${Date.now()}`,
      patientAddress: selectedPatient,
      title: recordTitle,
      recordHash,
      pointer,
      anchoredBy: me.name,
      anchoredAt: new Date().toISOString(),
      tombstoned: false,
      category: "Diagnosis",
    };
    setAnchored([newAnchor, ...anchored]);
    setAnchorOpen(false);
    setSelectedPatient("");
    setRecordTitle("");
    setRecordHash("");
    setPointer("");
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Provider Portal"
        title={`Dr. ${me.name.replace("Dr. ", "")}`}
        description="Verified providers can anchor patient records and access them strictly under active consent."
        action={
          <Badge tone="green" dot pulse>
            <BadgeCheck className="h-3.5 w-3.5" /> VERIFIED_PROVIDER_ROLE
          </Badge>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShieldCheck} label="Verification" value="Verified" sub="Since Dec 3, 2024" tone="green" index={0} />
        <StatCard icon={Users} label="Consented Patients" value={consentedPatients.length} sub="active consents" tone="teal" index={1} />
        <StatCard icon={FileCheck2} label="Records Anchored" value={myAnchors.length} sub="by you · on-chain" tone="sky" index={2} />
        <StatCard icon={FileSearch} label="Access Events" value={accessEvents.length} sub="audited on-chain" tone="violet" index={3} />
      </div>

      {/* Profile */}
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card glow="teal" className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
              <Stethoscope className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-bold text-heading">{me.name}</p>
              <p className="text-xs text-muted">{me.specialty}</p>
            </div>
          </div>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-3">
              <Building2 className="h-4 w-4 text-muted" />
              <span className="text-body">{me.hospital}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-3">
              <Hash className="h-4 w-4 text-muted" />
              <span className="font-mono text-body">{me.licenseNo}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-3">
              <CalendarClock className="h-4 w-4 text-muted" />
              <span className="text-muted">Verified {me.verifiedAt ? new Date(me.verifiedAt + "Z").toLocaleDateString() : "—"}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <p className="mb-4 text-sm font-semibold text-heading">Your Access Authority</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-panel p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                <BadgeCheck className="h-4 w-4 text-emerald-400" /> hasValidAccess
              </p>
              <p className="mt-2 text-xs leading-relaxed text-body">
                You can read patient data <span className="text-emerald-300">only when consent is active</span> and unexpired.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-panel p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted">
                <FileCheck2 className="h-4 w-4 text-teal-400" /> anchorRecord
              </p>
              <p className="mt-2 text-xs leading-relaxed text-body">
                Anchor hashes + IPFS pointers for records you create or update under consent.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Consented patients + anchoring */}
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-heading">Patients with Active Consent</h2>
              <p className="text-xs text-muted">You have verified access — anchor records on their behalf</p>
            </div>
            <Button size="sm" onClick={() => setAnchorOpen(true)} disabled={consentedPatients.length === 0}>
              <FilePlus2 className="h-4 w-4" /> Anchor Record
            </Button>
          </div>

          {consentedPatients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No active consents yet"
              description="When a patient grants you consent, their profile will appear here and you can anchor records."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <AnimatePresence>
                {consentedPatients.map((pt, i) => (
                  <motion.div key={pt.address} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
                          <UserRound className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-heading">{pt.name}</p>
                          <p className="font-mono text-[10px] text-muted">{pt.address}</p>
                        </div>
                        <Badge tone="green" dot className="ml-auto">Consent</Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5 text-xs text-muted">
                        <span>{pt.blood} · {pt.age} yrs</span>
                        <span className="font-medium text-teal-300">Access OK</span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Records I anchored */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-bold text-heading">Records You've Anchored</h2>
            <div className="space-y-3">
              {myAnchors.map((r) => (
                <Card key={r.id} className="flex items-center gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-300">
                    <ArrowUpFromDot className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-heading">{r.title}</p>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-muted">{r.pointer}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-teal-400">
                      {r.recordHash.slice(0, 20)}…
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <Badge tone={r.tombstoned ? "red" : "green"} dot>{r.tombstoned ? "Tombstoned" : "Verified"}</Badge>
                    <span className="text-[10px] text-muted">by {r.anchoredBy}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-heading">Recent Access Activity</h3>
            <div className="space-y-2">
              {accessEvents.map((e) => (
                <div key={e.id} className="rounded-lg bg-white/[0.03] p-3">
                  <p className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-teal-300">{e.type}</span>
                    <span className="text-muted">{new Date(e.timestamp).toLocaleDateString()}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted">{e.details}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-heading">
              <ShieldCheck className="h-4 w-4 text-violet-400" /> Your Roles
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge tone="violet" dot>VERIFIED_PROVIDER_ROLE</Badge>
              <Badge tone="slate">REGULATOR_ROLE {me.isERQualified ? "" : "(via admin)"}</Badge>
            </div>
          </Card>
        </div>
      </div>

      {/* Anchor modal */}
      <Modal open={anchorOpen} onClose={() => setAnchorOpen(false)} title="Anchor a Record" size="sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">Patient</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-heading outline-none focus:border-teal-500/50"
            >
              <option value="">Select patient…</option>
              {consentedPatients.map((p) => (
                <option key={p.address} value={p.address}>{p.name} — {p.address}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">Record Title</label>
            <input
              value={recordTitle}
              onChange={(e) => setRecordTitle(e.target.value)}
              placeholder="e.g. Echocardiogram Report"
              className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-heading outline-none placeholder:text-muted focus:border-teal-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">Record Hash (keccak256)</label>
            <input
              value={recordHash}
              onChange={(e) => setRecordHash(e.target.value)}
              placeholder="0x…64 hex chars"
              className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 font-mono text-xs text-heading outline-none placeholder:text-muted focus:border-teal-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">Pointer (IPFS CID)</label>
            <input
              value={pointer}
              onChange={(e) => setPointer(e.target.value)}
              placeholder="ipfs://Qm…"
              className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 font-mono text-xs text-heading outline-none placeholder:text-muted focus:border-teal-500/50"
            />
          </div>
          <Button fullWidth onClick={handleAnchor} disabled={!selectedPatient || !recordTitle || !recordHash || !pointer}>
            <ArrowUpFromDot className="h-4 w-4" /> Anchor to Chain
          </Button>
          {/* TODO(smart-contract): call anchorRecord(patient, recordId, recordHash, pointer) via wagmi */}
        </div>
      </Modal>
    </AppShell>
  );
}