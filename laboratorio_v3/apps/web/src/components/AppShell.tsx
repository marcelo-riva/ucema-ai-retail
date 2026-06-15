"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, LayoutDashboard, ShieldCheck } from "lucide-react";

const navItems = [
  { href: "/labs", label: "Laboratorios", icon: LayoutDashboard },
  { href: "/labs/lab-01/exercises/ex-01", label: "Ejercicio 1", icon: ClipboardList },
  { href: "/labs/lab-01/scoreboard", label: "Scoreboard", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: ShieldCheck }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="brandBlock">
          <div className="brandMark">NEXUS</div>
          <div className="brandTitle">Retail Labs</div>
        </div>

        <nav className="nav" aria-label="Navegación principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link key={item.href} className={`navLink ${isActive ? "active" : ""}`} href={item.href}>
                <Icon aria-hidden size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <p className="sideNote">La plataforma guía. Tu AI analiza. Tu equipo decide.</p>
      </aside>

      <main className="main">
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
