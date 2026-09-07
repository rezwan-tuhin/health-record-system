"use client";

import { useState } from "react";
import {
  Fingerprint,
  Search,
  CheckCircle2,
  XCircle,
  ArchiveX,
  Info,
  FileCheck2,
  ShieldQuestion,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { records } from "@/lib/dummy";

interface VerifyResult {
  matches: boolean;
  tombstoned: boolean;
  record?: (typeof records)[number];
}

export default function VerifyPage() {
  const [mode, setMode] = useState<"preset" | "manual">("preset");
  const [selectedRecord, setSelectedRecord] = useState("");
  const [patientAddress, setPatientAddress] = useState("");
  const [recordId, setRecordId] = useState("");
  const [candidateHash, setCandidateHash] = useState("");
  const [tampered, setTampered] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [verifying, setVerifying] = useState(false);

  const runVerify = () => {
    setVerifying(true);
    setResult(null);

    let target = selectedRecord;
    let hash = "";
    let tombstoned = false;

    if (mode === "preset") {
      const rec = records.find((r) => r.id === target);
      if (!rec) {
        setVerifying(false);
        return;
      }
      hash = tampered
        ? rec.recordHash.slice(0, -2) + (rec.recordHash.endsWith("00") ? "11" : "00")
        : rec.recordHash;
      tombstoned = rec.tombstoned;
      target = rec.title;
    } else {
      hash = candidateHash;
      tombstoned = records.find((r) => r.id === recordId)?.tombstoned ?? false;
    }

    const recordIdValue = mode === "preset" ? target : recordId;
    // Simulated on-chain call — TODO: replace with verifyRecordHash(patient, recordId, candidateHash)
    setTimeout(() => {
      const matches = mode === "preset"
        ? !tampered
        : records.some(
            (r) =>
              r.recordHash.toLowerCase() === hash.toLowerCase() &&
              (recordIdValue === r.id || recordIdValue === r.title)
          );
      setResult({
        matches,
        tombstoned,
        record: mode === "preset" ? records.find((r) => r.id === selectedRecord) : undefined,
      });
      setVerifying(false);
    }, 900);
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Public Verifier"
        title="Record Integrity Verification"
        description="Anyone can verify that an off-chain record matches its immutable on-chain anchor — without exposing the data itself."
        action={
          <Badge tone="sky" dot>
            verifyRecordHash()
          </Badge>
        }
      />

      {/* How it works strip */}
      <Card className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 p-4">
        <p className="flex items-center gap-2 text-xs text-muted">
          <Fingerprint className="h-4 w-4 text-teal-400" /> On-chain anchor stores <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-teal-300">recordHash</code>
        </p>
        <p className="flex items-center gap-2 text-xs text-muted">
          <Search className="h-4 w-4 text-sky-400" /> You recompute a hash from the record's content
        </p>
        <p className="flex items-center gap-2 text-xs text-muted">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Equal hashes ⇒ content is authentic
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Verifier form */}
        <Card className="h-fit p-6">
          <div className="mb-5 flex gap-2">
            <Button
              size="sm"
              variant={mode === "preset" ? "primary" : "ghost"}
              onClick={() => {
                setMode("preset");
                setResult(null);
              }}
            >
              Demo Records
            </Button>
            <Button
              size="sm"
              variant={mode === "manual" ? "primary" : "ghost"}
              onClick={() => {
                setMode("manual");
                setResult(null);
              }}
            >
              Manual Input
            </Button>
          </div>

          <div className="space-y-4">
            {mode === "preset" ? (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Anchored Record
                  </label>
                  <select
                    value={selectedRecord}
                    onChange={(e) => setSelectedRecord(e.target.value)}
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 text-sm text-heading outline-none focus:border-teal-500/50"
                  >
                    <option value="">Select a demo record…</option>
                    {records.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}{r.tombstoned ? " (tombstoned)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line bg-panel px-4 py-3">
                  <span className="flex items-center gap-2 text-sm text-body">
                    <ShieldQuestion className="h-4 w-4 text-amber-400" />
                    Simulate tampered content
                  </span>
                  <button
                    type="button"
                    onClick={() => setTampered(!tampered)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${tampered ? "bg-red-500/80" : "bg-white/10"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${tampered ? "left-[22px]" : "left-0.5"}`}
                    />
                  </button>
                </label>
              </>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Patient Address
                  </label>
                  <input
                    value={patientAddress}
                    onChange={(e) => setPatientAddress(e.target.value)}
                    placeholder="0x…"
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 font-mono text-xs text-heading outline-none placeholder:text-muted focus:border-teal-500/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Record ID
                  </label>
                  <input
                    value={recordId}
                    onChange={(e) => setRecordId(e.target.value)}
                    placeholder="e.g. r1 or record title"
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 font-mono text-xs text-heading outline-none placeholder:text-muted focus:border-teal-500/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted">
                    Candidate Hash
                  </label>
                  <input
                    value={candidateHash}
                    onChange={(e) => setCandidateHash(e.target.value)}
                    placeholder="0x… recomputed hash of the record"
                    className="w-full rounded-xl border border-line bg-panel px-3 py-2.5 font-mono text-xs text-heading outline-none placeholder:text-muted focus:border-teal-500/50"
                  />
                </div>
              </>
            )}

            <Button
              fullWidth
              loading={verifying}
              onClick={runVerify}
              disabled={mode === "preset" ? !selectedRecord : !patientAddress || !recordId || !candidateHash}
            >
              <Search className="h-4 w-4" /> Verify Integrity
            </Button>
            {/* TODO(smart-contract): replace with readContract('verifyRecordHash', [patient, recordId, candidateHash]) */}
          </div>
        </Card>

        {/* Result panel */}
        <div>
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card
                  glow={result.matches && !result.tombstoned ? "teal" : result.tombstoned ? "amber" : "red"}
                  className="p-6"
                >
                  {result.matches && !result.tombstoned ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                        <CheckCircle2 className="h-9 w-9" />
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-emerald-300">RECORD INTACT</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        The candidate hash matches the on-chain anchor. The record content has not been tampered with since it was anchored.
                      </p>
                      <div className="mt-5 w-full rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-left">
                        <p className="text-xs text-emerald-200">✓ Hash match confirmed</p>
                        <p className="text-xs text-emerald-200">✓ Anchor not tombstoned</p>
                        <p className="mt-2 text-[10px] text-emerald-300/70">
                          {result.record ? result.record.recordHash : "manual candidate hash"}
                        </p>
                      </div>
                    </div>
                  ) : result.tombstoned ? (
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 text-amber-400">
                        <ArchiveX className="h-9 w-9" />
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-amber-300">RECORD SUPERSEDED</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        This anchor has been tombstoned. The record is legally or clinically superseded — history is preserved but marked as deprecated.
                      </p>
                      {result.matches && (
                        <p className="mt-4 rounded-full bg-amber-500/10 px-3 py-1 text-xs text-amber-200">
                          Hash integrity intact, but anchor is tombstoned
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                        <XCircle className="h-9 w-9" />
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-red-300">TAMPER DETECTED</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        The candidate hash does NOT match the on-chain anchor. The record content was modified after it was anchored.
                      </p>
                      <p className="mt-4 rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-200">
                        closest anchor: {result.record ? `${result.record.recordHash.slice(0, 20)}…` : "—"}
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="flex h-full min-h-[320px] flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-muted">
                    <FileCheck2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-base font-semibold text-heading">Awaiting verification</h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    Try it: pick a demo record and toggle simulated tampering — the verifier returns an on-chain-style match verdict instantly.
                  </p>
                  <div className="mt-6 flex items-start gap-2 rounded-xl bg-white/[0.03] p-3 text-left">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
                    <p className="text-xs leading-relaxed text-muted">
                      This is the core of on-chain data integrity: <span className="text-teal-300">content lives off-chain</span>,{" "}
                      <span className="text-teal-300">truth lives on-chain</span>.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}