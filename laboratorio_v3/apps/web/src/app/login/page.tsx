"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import type { Group } from "../../types/lab";
import { getGroups, setCurrentGroup } from "../../services/mockLabService";

export default function LoginPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("group_01");

  useEffect(() => {
    getGroups().then(setGroups);
  }, []);

  async function handleLogin() {
    await setCurrentGroup(selectedGroupId);
    router.push(selectedGroupId === "admin" ? "/admin" : "/labs");
  }

  return (
    <main className="main" style={{ marginLeft: 0 }}>
      <section className="content" style={{ maxWidth: 760, paddingTop: 72 }}>
        <div className="eyebrow">NEXUS Retail Labs</div>
        <h1>Laboratorio ejecutivo de decisiones con AI personal</h1>
        <p className="lead">
          Seleccioná tu grupo para entrar al entorno mock. Esta versión no tiene backend:
          todo se guarda localmente en este navegador.
        </p>

        <div className="card" style={{ marginTop: 28 }}>
          <label className="formField">
            <span className="formLabel">Grupo</span>
            <select value={selectedGroupId} onChange={(event) => setSelectedGroupId(event.target.value)}>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </label>

          <button className="button primary" onClick={handleLogin} style={{ marginTop: 18 }} type="button">
            <LogIn size={17} /> Entrar
          </button>
        </div>
      </section>
    </main>
  );
}
