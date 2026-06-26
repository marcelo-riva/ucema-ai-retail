"use client";

import Link from "next/link";
import type { ExerciseMeta, Role } from "../lib/repositories/labRepository.types";

type ExerciseProgressNavProps = {
  items: ExerciseMeta[];
  role?: Role;
};

export function ExerciseProgressNav({ items, role = "group" }: ExerciseProgressNavProps) {
  if (items.length === 0) {
    return (
      <section className="card">
        <div className="eyebrow">Secuencia Laboratorio 1</div>
        <h2>Ejercicios del laboratorio</h2>
        <p className="muted">No hay ejercicios habilitados para este rol.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="eyebrow">Secuencia Laboratorio 1</div>
      <h2>Ejercicios del laboratorio</h2>
      <div className="exerciseCardGrid">
        {items.map((item) => (
          <article className="exerciseCard" key={item.id}>
            <div className="exerciseCardTop">
              <div className="exerciseNumber">{`Ej. ${item.order}`}</div>
              {role === "admin" ? (
                <div className={`statusPill ${item.status}`}>{item.status}</div>
              ) : null}
            </div>
            <h3>{item.title}</h3>
            <p className="muted">{item.path}</p>
            <Link className="button primary" href={item.path} prefetch={false}>
              Abrir
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
