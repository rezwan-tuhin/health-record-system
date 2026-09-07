"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  FileX2,
  FileSearch,
  Stethoscope,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  UserRoundCheck,
  Scale,
  Activity,
  BadgeCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import SectionTitle from "@/components/ui/SectionTitle";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import EventLog from "@/components/ui/EventLog";
import EmptyState from "@/components/ui/EmptyState";
import { providers as seedProviders, auditLogs, type Provider } from "@/lib/dummy";

export default function AdminConsole() {
  const [providers, setProviders] = useState<Provider[]>(seedProviders);
  const [paused, setPaused] = useState(false);

  const unverified = providers.filter((p) => !p.verified);

  const handleVerify = (address: string, verified: boolean, erQualified: boolean) => {
    setProviders(
      providers.map((p) =>
        p.address === address
          ? {
              ...p,
              verified,
              isERQualified: verified ? erQualified : false,
              verifiedAt: verified ? new Date().toISOString() : p.verifiedAt,
            }
          : p
      )
    );
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Regulator Console"
        title="System Administration"
        description="Regulators verify providers, enforce compliance, and manage the emergency circuit breaker."
        action={
          <Badge tone="amber" dot pulse>
            REGULATOR_ROLE · DEFAULT_ADMIN_ROLE
          </Badge>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UserRoundCheck} label="Registered Providers" value={providers.length} sub={`${providers.length - unverified.length} verified`} tone="violet" index={0} />
        <StatCard icon={Scale} label="Verification Queue" value={unverified.length} sub="awaiting review" tone="amber" index={1} />
        <StatCard icon={FileX2} label="Tombstoned Records" value={1} sub="across system" tone="red" index={2} />
        <StatCard icon={Activity} label="Audit Events" value={auditLogs.length} sub="tracked on-chain" tone="teal" index={3} />
      </div>

      {/* Circuit breaker */}
      <Card glow={paused ? "red" : "teal"} className="mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${paused ? "bg-red-500/15 text-red-300" : "bg-teal-500/15 text-teal-300"}`}>
            {paused ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </div>
          <div>
            <p className="font-semibold text-heading">Pausable Circuit Breaker</p>
            <p className="text-sm text-muted">
              {paused
                ? "Contract is PAUSED — all mutating functions are blocked (whenNotPaused)."
                : "Contract is running — registrations, consents and anchoring are enabled."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={paused ? "red" : "green"} dot pulse>
            {paused ? "Paused" : "Active"}
          </Badge>
          <Button variant={paused ? "primary" : "warning"} size="sm" onClick={() => setPaused(!paused)}>
            {paused ? "Resume Contract" : "Pause Contract"}
          </Button>
        </div>
      </Card>

      {/* Verification queue */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-heading">Provider Verification Queue</h2>
        {unverified.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="Queue is clear"
            description="Every registered provider has been reviewed. New providers will appear here for verification."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence>
              {unverified.map((p, i) => (
                <motion.div
                  key={p.address}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card glow="amber" className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-heading">{p.name}</p>
                        <p className="text-xs text-muted">{p.specialty} · {p.hospital}</p>
                      </div>
                      <Badge tone="amber" dot className="ml-auto">Pending</Badge>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted">
                      <div className="rounded-lg bg-white/[0.03] p-2.5">
                        <span className="block text-[10px] uppercase tracking-widest text-muted">License</span>
                        <span className="mt-0.5 block font-mono text-body">{p.licenseNo}</span>
                      </div>
                      <div className="rounded-lg bg-white/[0.03] p-2.5">
                        <span className="block text-[10px] uppercase tracking-widest text-muted">Wallet</span>
                        <span className="mt-0.5 block font-mono text-body">{p.address}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-amber-300"
                        onClick={() => handleVerify(p.address, false, false)}
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleVerify(p.address, true, false)}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verify
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-red-300"
                        onClick={() => handleVerify(p.address, true, true)}
                      >
                        <ShieldAlert className="h-3.5 w-3.5" /> Verify + ER
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Verified providers */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-heading">Verified Providers</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {providers.filter((p) => p.verified).map((p) => (
            <Card key={p.address} className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                  <BadgeCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-heading">{p.name}</p>
                  <p className="truncate text-xs text-muted">{p.specialty}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="green" dot>Verified</Badge>
                {p.isERQualified && (
                  <Badge tone="red" dot pulse>ER Specialist</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Full audit trail */}
      <div className="mt-8">
        <Card className="p-5">
          <EventLog events={auditLogs} title="System-Wide Audit Trail" />
        </Card>
      </div>
    </AppShell>
  );
}