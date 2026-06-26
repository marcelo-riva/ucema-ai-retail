"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../../components/AppShell";
import { AdminExerciseManager } from "../../components/AdminExerciseManager";
import { AdminSubmissionTable } from "../../components/AdminSubmissionTable";
import { AdminDiagnostics } from "../../components/AdminDiagnostics";
import type { Submission } from "../../lib/repositories/labRepository.types";
import { getLabRepository } from "../../lib/repositories/labRepository";

export default function AdminPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    try {
      const repo = getLabRepository();
      const all = await repo.listSubmissions();
      setSubmissions(all);
    } catch (err) {
      setError(String(err));
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const repo = getLabRepository();
        const session = await repo.getSession();
        if (!session || session.role !== "admin") {
          router.push("/login");
          return;
        }
        setRole(session.role);
        await loadSubmissions();
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router, loadSubmissions]);

  if (loading) {
    return (
      <AppShell>
        <section className="card">
          <p className="muted">Cargando admin...</p>
        </section>
      </AppShell>
    );
  }

  if (role !== "admin") {
    return null; // redirigiendo
  }

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Admin</div>
          <h1>Dashboard de gestión</h1>
          <p className="lead">
            Gestión de ejercicios, revisión de submissions y diagnóstico técnico.
          </p>
        </div>
      </header>

      {error ? (
        <section className="card">
          <div className="message error">{error}</div>
        </section>
      ) : null}

      <section className="card">
        <div className="eyebrow">Gestión de ejercicios</div>
        <h2>Estado de los ejercicios</h2>
        <AdminExerciseManager />
      </section>

      <AdminSubmissionTable submissions={submissions} onRefresh={loadSubmissions} />

      <AdminDiagnostics />
    </AppShell>
  );
}
