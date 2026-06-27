"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  User
} from "lucide-react";
import { getLabRepository } from "../lib/repositories/labRepository";
import type { ExerciseMeta, ExerciseStatus, Session } from "../lib/repositories/labRepository.types";

const DATA_MODE = process.env.NEXT_PUBLIC_DATA_MODE ?? "local";

const exerciseLabels: Record<string, string> = {
  "ex-00": "Ejercicio 0",
  "ex-01": "Ejercicio 1",
  ex02: "Ejercicio 2",
  "ex-03": "Ejercicio 3",
  "ex-04": "Ejercicio 4",
  "lab02-ex01": "Ejercicio 1",
  "lab02-ex02": "Ejercicio 2",
  "lab02-ex03": "Ejercicio 3",
  "lab02-ex04": "Ejercicio 4",
  "lab02-ex05": "Ejercicio 5"
};

const labTitles: Record<string, string> = {
  "lab-01": "Laboratorio 1",
  "lab-02": "Laboratorio 2"
};

function getActiveHref(
  pathname: string,
  allLinks: Array<{ href: string }>
): string | null {
  if (pathname === "/") return "/";
  const candidates = allLinks.filter(
    (link) => link.href !== "/" && pathname.startsWith(link.href)
  );
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
    const exerciseMatch = pathname.match(/\/exercises\/(ex-?\d+|lab\d+-ex\d+)/);
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
    const crumbs = [
      { label: "Laboratorios", href: "/labs" },
      { label: "Laboratorio 2", href: "/labs/lab-02" }
    ];
    const exerciseMatch = pathname.match(/\/exercises\/(ex-?\d+|lab\d+-ex\d+)/);
    if (exerciseMatch) {
      crumbs.push({ label: exerciseLabels[exerciseMatch[1]] ?? "Ejercicio", href: pathname });
    }
    return crumbs;
  }
  return [];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [lab01Links, setLab01Links] = useState<Array<{ href: string; label: string; status?: ExerciseStatus }>>([]);
  const [lab02Links, setLab02Links] = useState<Array<{ href: string; label: string; status?: ExerciseStatus }>>([]);
  const [allLinks, setAllLinks] = useState<Array<{ href: string }>>([
    { href: "/" },
    { href: "/labs" },
    { href: "/admin" }
  ]);

  useEffect(() => {
    getLabRepository()
      .getSession()
      .then(async (currentSession) => {
        setSession(currentSession);
        const role = currentSession?.role ?? "group";
        const allExercises = await getLabRepository().listExercises({ role });
        const visible =
          role === "admin"
            ? allExercises
            : allExercises.filter((exercise) => exercise.status === "active");

        const visibleLab01 = visible.filter((exercise) => exercise.labId === "lab-01");
        const visibleLab02 = visible.filter((exercise) => exercise.labId === "lab-02");

        const lab01Nav = [
          { href: "/labs/lab-01", label: "Overview" },
          ...visibleLab01.map((exercise: ExerciseMeta) => ({
            href: exercise.path,
            label: exercise.title,
            status: exercise.status
          }))
        ];
        const lab02Nav = [
          { href: "/labs/lab-02", label: "Overview" },
          ...visibleLab02.map((exercise: ExerciseMeta) => ({
            href: exercise.path,
            label: exercise.title,
            status: exercise.status
          }))
        ];

        setLab01Links(lab01Nav);
        setLab02Links(lab02Nav);

        const baseLinks = [{ href: "/" }, { href: "/labs" }];
        if (role === "admin") {
          baseLinks.push({ href: "/admin" });
        }
        setAllLinks([...baseLinks, ...lab01Nav, ...lab02Nav]);
      })
      .catch(() => {
        setLab01Links([]);
        setLab02Links([]);
      });
  }, []);

  const activeHref = getActiveHref(pathname, allLinks);
  const inLab01 = pathname.startsWith("/labs/lab-01");
  const inLab02 = pathname.startsWith("/labs/lab-02");
  const breadcrumbs = buildBreadcrumbs(pathname);

  async function handleLogout() {
    await getLabRepository().logout();
    setSession(null);
    router.push("/login");
  }

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
                  {item.status && session?.role === "admin" ? (
                    <span className={`statusPill ${item.status}`} style={{ marginLeft: "auto", fontSize: 10 }}>
                      {item.status}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : null}

          {inLab02 ? (
            <div className="navSection">
              <div className="navSectionTitle">Laboratorio 2</div>
              {lab02Links.map((item) => (
                <Link
                  className={`navSubLink ${activeHref === item.href ? "active" : ""}`}
                  href={item.href}
                  key={item.href}
                  prefetch={false}
                >
                  <ClipboardList aria-hidden size={15} />
                  <span>{item.label}</span>
                  {item.status && session?.role === "admin" ? (
                    <span className={`statusPill ${item.status}`} style={{ marginLeft: "auto", fontSize: 10 }}>
                      {item.status}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          ) : null}

          {session?.role === "admin" ? (
            <Link className={`navLink ${activeHref === "/admin" ? "active" : ""}`} href="/admin" prefetch={false}>
              <ShieldCheck aria-hidden size={18} />
              <span>Admin</span>
            </Link>
          ) : null}
        </nav>

        <p className="sideNote">La plataforma guía. Tu AI analiza. Tu equipo decide.</p>

        <div className="panel" style={{ marginTop: "auto", background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)", padding: 10 }}>
          <div className="eyebrow" style={{ color: "#8fc6b9" }}>Data mode</div>
          <span className={`statusPill ${DATA_MODE === "local" ? "active" : "draft"}`} style={{ marginTop: 6 }}>
            {DATA_MODE === "local" ? "local (default)" : DATA_MODE}
          </span>
        </div>

        {session ? (
          <div className="panel" style={{ marginTop: "auto", background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.12)" }}>
            <div className="eyebrow" style={{ color: "#8fc6b9" }}>Sesión</div>
            <div style={{ alignItems: "center", display: "flex", gap: 8, marginTop: 8 }}>
              <User size={16} />
              <span style={{ fontWeight: 600 }}>{session.username}</span>
            </div>
            <p className="muted" style={{ color: "rgba(246,250,246,0.64)", fontSize: 12, margin: "6px 0 12px" }}>
              {session.role === "admin" ? "Administrador" : `Grupo: ${session.groupId ?? "-"}`}
              {" · "}
              Data mode: {DATA_MODE}
            </p>
            <button
              className="button secondary"
              onClick={handleLogout}
              style={{ width: "100%" }}
              type="button"
            >
              <LogOut size={16} /> Cerrar sesión
            </button>
          </div>
        ) : null}
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
