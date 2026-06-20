"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Home, LayoutDashboard, ShieldCheck } from "lucide-react";

const lab01Links = [
  { href: "/labs/lab-01", label: "Overview" },
  { href: "/labs/lab-01/exercises/ex-00", label: "Ejercicio 0" },
  { href: "/labs/lab-01/exercises/ex-01", label: "Ejercicio 1" },
  { href: "/labs/lab-01/exercises/ex-02", label: "Ejercicio 2" },
  { href: "/labs/lab-01/exercises/ex-03", label: "Ejercicio 3" },
  { href: "/labs/lab-01/exercises/ex-04", label: "Ejercicio 4" },
  { href: "/labs/lab-01/scoreboard", label: "Scoreboard" },
  { href: "/labs/lab-01/final-plan", label: "Plan final" }
];

const exerciseLabels: Record<string, string> = {
  "ex-00": "Ejercicio 0",
  "ex-01": "Ejercicio 1",
  "ex-02": "Ejercicio 2",
  "ex-03": "Ejercicio 3",
  "ex-04": "Ejercicio 4"
};

const allLinks = [
  { href: "/" },
  { href: "/labs" },
  { href: "/admin" },
  ...lab01Links
];

function getActiveHref(pathname: string): string | null {
  if (pathname === "/") return "/";
  const candidates = allLinks.filter(link => link.href !== "/" && pathname.startsWith(link.href));
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => b.href.length - a.href.length)[0].href;
}

function buildBreadcrumbs(pathname: string) {
  if (pathname === "/labs") {
    return [{ label: "Laboratorios", href: "/labs" }];
  }
  if (pathname.startsWith("/labs/lab-01")) {
    const crumbs = [
      { label: "Laboratorios", href: "/labs" },
      { label: "Laboratorio 1", href: "/labs/lab-01" }
    ];
    const exerciseMatch = pathname.match(/\/exercises\/(ex-\d+)/);
    if (exerciseMatch) {
      crumbs.push({ label: exerciseLabels[exerciseMatch[1]] ?? "Ejercicio", href: pathname });
    } else if (pathname.endsWith("/scoreboard")) {
      crumbs.push({ label: "Scoreboard", href: pathname });
    } else if (pathname.endsWith("/final-plan")) {
      crumbs.push({ label: "Plan final", href: pathname });
    }
    return crumbs;
  }
  if (pathname.startsWith("/labs/lab-02")) {
    return [
      { label: "Laboratorios", href: "/labs" },
      { label: "Laboratorio 2", href: "/labs/lab-02" }
    ];
  }
  return [];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);
  const inLab01 = pathname.startsWith("/labs/lab-01");
  const inLab02 = pathname.startsWith("/labs/lab-02");
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="brandBlock">
          <div className="brandMark">NEXUS</div>
          <div className="brandTitle">Retail Labs</div>
        </div>

        <nav className="nav" aria-label="Navegación principal">
          <Link className={`navLink ${activeHref === "/" ? "active" : ""}`} href="/" prefetch={false}>
            <Home aria-hidden size={18} />
            <span>Inicio</span>
          </Link>

          <Link className={`navLink ${activeHref === "/labs" ? "active" : ""}`} href="/labs" prefetch={false}>
            <LayoutDashboard aria-hidden size={18} />
            <span>Laboratorios</span>
          </Link>

          {inLab01 ? (
            <div className="navSection">
              <div className="navSectionTitle">Laboratorio 1</div>
              {lab01Links.map((item) => (
                <Link
                  className={`navSubLink ${activeHref === item.href ? "active" : ""}`}
                  href={item.href}
                  key={item.href}
                  prefetch={false}
                >
                  <ClipboardList aria-hidden size={15} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ) : null}

          {inLab02 ? (
            <div className="navSection">
              <div className="navSectionTitle">Laboratorio 2</div>
              <Link className={`navSubLink ${pathname === "/labs/lab-02" ? "active" : ""}`} href="/labs/lab-02" prefetch={false}>
                <ClipboardList aria-hidden size={15} />
                <span>Overview / Próximamente</span>
              </Link>
            </div>
          ) : null}

          <Link className={`navLink ${activeHref === "/admin" ? "active" : ""}`} href="/admin" prefetch={false}>
            <ShieldCheck aria-hidden size={18} />
            <span>Admin</span>
          </Link>
        </nav>

        <p className="sideNote">La plataforma guía. Tu AI analiza. Tu equipo decide.</p>
      </aside>

      <main className="main">
        <div className="content">
          {breadcrumbs.length > 0 ? (
            <nav aria-label="Breadcrumb" className="breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <span key={`${crumb.href}-${crumb.label}`}>
                  {index > 0 ? <span className="breadcrumbSeparator">/</span> : null}
                  {index === breadcrumbs.length - 1 ? (
                    <span>{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} prefetch={false}>{crumb.label}</Link>
                  )}
                </span>
              ))}
            </nav>
          ) : null}
          {children}
        </div>
      </main>
    </div>
  );
}
