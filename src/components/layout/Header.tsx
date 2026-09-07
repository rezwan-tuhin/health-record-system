"use client";

import { Stethoscope, UserRound, ShieldCheck, Siren, Wallet, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { connectWallet, disconnectWallet } from "@/store/slices/walletSlice";
import type { Role } from "@/lib/dummy";
import clsx from "clsx";

const roleBadge: Record<Role, { label: string; tone: string; Icon: React.ElementType }> = {
  patient: { label: "Patient View", tone: "bg-sky-500/15 text-sky-300", Icon: UserRound },
  provider: { label: "Provider View", tone: "bg-violet-500/15 text-violet-300", Icon: Stethoscope },
  admin: { label: "Regulator View", tone: "bg-amber-500/15 text-amber-300", Icon: ShieldCheck },
  emergency: { label: "Emergency View", tone: "bg-red-500/15 text-red-300", Icon: Siren },
};

export default function Header() {
  const activeRole = useAppSelector((s) => s.role.activeRole);
  const isConnected = useAppSelector((s) => s.wallet.isConnected);
  const address = useAppSelector((s) => s.wallet.address);
  const dispatch = useAppDispatch();
  const { label, tone, Icon } = roleBadge[activeRole];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-panel/85 px-6 backdrop-blur">
      <div className="flex items-center gap-2">
        <span
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
            tone
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="ml-1 hidden items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-emerald-300 sm:inline-flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Sepolia
        </span>
      </div>

      <div className="flex-1" />

      {/* TODO: replace with wagmi ConnectButton during integration */}
      {isConnected ? (
        <button
          onClick={() => dispatch(disconnectWallet())}
          className="flex h-10 items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 text-sm font-semibold text-teal-300 transition-all hover:bg-teal-500/20"
          title="Disconnect (demo)"
        >
          <Wallet className="h-4 w-4" />
          <span className="font-mono text-xs">{address}</span>
          <LogOut className="h-3.5 w-3.5 opacity-70" />
        </button>
      ) : (
        <button
          onClick={() =>
            dispatch(
              connectWallet({ address: "0x7B5f09ab…9C4a", chainId: 11155111 })
            )
          }
          className="flex h-10 items-center gap-2 rounded-xl border border-line bg-white/5 px-4 text-sm font-semibold text-body transition-all hover:bg-white/10 hover:text-heading"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </button>
      )}
    </header>
  );
}