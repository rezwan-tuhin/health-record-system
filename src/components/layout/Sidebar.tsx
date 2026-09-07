"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  Stethoscope,
  ShieldCheck,
  Siren,
  Fingerprint,
  ChevronLeft,
  Activity,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import { setActiveRole } from "@/store/slices/roleSlice";
import { toggleSidebar } from "@/store/slices/uiSlice";
import type { Role } from "@/lib/dummy";
import clsx from "clsx";

const roleMeta: Record<
  Role,
  { label: string; icon: React.ElementType; nav: { label: string; href: string; icon: React.ElementType }[] }
> = {
  patient: {
    label: "Patient",
    icon: UserRound,
    nav: [
      { label: "Overview", href: "/patient", icon: LayoutDashboard },
      { label: "Verify Record", href: "/verify", icon: Fingerprint },
    ],
  },
  provider: {
    label: "Provider",
    icon: Stethoscope,
    nav: [
      { label: "Overview", href: "/provider", icon: LayoutDashboard },
      { label: "Verify Record", href: "/verify", icon: Fingerprint },
    ],
  },
  admin: {
    label: "Regulator",
    icon: ShieldCheck,
    nav: [
      { label: "Console", href: "/admin", icon: LayoutDashboard },
      { label: "Verify Record", href: "/verify", icon: Fingerprint },
    ],
  },
  emergency: {
    label: "Emergency",
    icon: Siren,
    nav: [
      { label: "ER Unit", href: "/emergency", icon: Activity },
      { label: "Verify Record", href: "/verify", icon: Fingerprint },
    ],
  },
};

const roleOrder: Role[] = ["patient", "provider", "admin", "emergency"];

export default function Sidebar() {
  const activeRole = useAppSelector((s) => s.role.activeRole);
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const meta = roleMeta[activeRole];

  return (
    <aside
      className={clsx(
        "flex h-full shrink-0 flex-col border-r border-line bg-panel transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-line px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400">
          <Activity className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-heading">ChainHealth</p>
            <p className="truncate text-[11px] text-muted">HealthRecordSystem.sol</p>
          </div>
        )}
      </div>

      {/* Role switcher */}
      <div className="border-b border-line p-3">
        <p className={clsx("mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted", collapsed && "text-center")}>
          {collapsed ? "Role" : "Demo Role"}
        </p>
        <div className="grid grid-cols-1 gap-1">
          {roleOrder.map((r) => {
            const item = roleMeta[r];
            const Icon = item.icon;
            const isActive = r === activeRole;
            return (
              <button
                key={r}
                onClick={() => {
                  dispatch(setActiveRole(r));
                }}
                title={item.label}
                className={clsx(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-teal-500/15 text-teal-300 shadow-[inset_0_0_0_1px_rgba(20,184,166,0.3)]"
                    : "text-body hover:bg-white/5 hover:text-heading"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role nav */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className={clsx("mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted", collapsed && "text-center")}>
          {collapsed ? "Menu" : "Menu"}
        </p>
        <nav className="space-y-1">
          {meta.nav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={clsx(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-white/8 text-heading shadow-[inset_0_0_0_1px_rgba(148,163,184,0.15)]"
                    : "text-muted hover:bg-white/5 hover:text-heading"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-line p-3">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className={clsx(
            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-heading",
            collapsed && "justify-center"
          )}
        >
          <ChevronLeft className={clsx("h-4 w-4 transition-transform", !collapsed && "rotate-180")} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}