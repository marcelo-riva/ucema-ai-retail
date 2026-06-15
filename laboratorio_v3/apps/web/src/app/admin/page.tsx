"use client";

import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { AdminSubmissionTable } from "../../components/AdminSubmissionTable";
import type { Submission } from "../../types/lab";
import { getAdminSubmissions } from "../../services/mockLabService";

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    getAdminSubmissions().then(setSubmissions);
  }, []);

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <div className="eyebrow">Admin Demo</div>
          <h1>Revisión de entregas</h1>
          <p className="lead">
            Vista mock para que el profesor vea estado, archivos cargados y trazabilidad básica
            de cada entrega registrada en localStorage.
          </p>
        </div>
      </header>

      <AdminSubmissionTable submissions={submissions} />
    </AppShell>
  );
}
