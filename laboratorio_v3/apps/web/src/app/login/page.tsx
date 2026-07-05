"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import { getLabRepository } from "../../lib/repositories/labRepository";

// Login del curso. La sesión se mantiene en el navegador para el grupo activo.

export default function LoginPage() {
  const router = useRouter();
  const repo = getLabRepository();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    repo.getSession().then((session) => {
      if (session) {
        router.push(session.role === "admin" ? "/admin" : "/labs");
      }
    });
  }, [router, repo]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await repo.login({ username, password });
    setLoading(false);

    if (!result.ok || !result.session) {
      setError(result.error ?? "Usuario o contraseña incorrectos.");
      return;
    }

    await repo.setSession(result.session);
    router.push(result.session.role === "admin" ? "/admin" : "/labs");
  }

  return (
    <main className="main" style={{ marginLeft: 0 }}>
      <section className="content" style={{ maxWidth: 760, paddingTop: 72 }}>
        <div className="eyebrow">NEXUS Retail Labs</div>
        <h1>Laboratorio ejecutivo de decisiones con AI personal</h1>
        <p className="lead">
          Ingresá con tu usuario de grupo o admin para continuar el laboratorio.
        </p>

        <form className="card" onSubmit={handleSubmit} style={{ marginTop: 28 }}>
          <label className="formField">
            <span className="formLabel">Usuario</span>
            <input
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="iaec-grupo01, ero-grupo01 o admin"
              required
              type="text"
              value={username}
            />
          </label>

          <label className="formField" style={{ marginTop: 14 }}>
            <span className="formLabel">Contraseña</span>
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <div className="message error" style={{ marginTop: 16 }}>
              {error}
            </div>
          ) : null}

          <button
            className="button primary"
            disabled={loading}
            style={{ marginTop: 18 }}
            type="submit"
          >
            <LogIn size={17} /> {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
