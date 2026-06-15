import Link from "next/link";

type ProgressItem = {
  id: string;
  order: number;
  title: string;
  route: string;
  objective: string;
  status: string;
  checkpointName: string;
  mainSheet: string;
  supportSheets: string[];
  output: string;
};

export function ExerciseProgressNav({ items }: { items: ProgressItem[] }) {
  return (
    <section className="card">
      <div className="eyebrow">Secuencia Laboratorio 1</div>
      <h2>Ejercicios del laboratorio</h2>
      <div className="exerciseCardGrid">
        {items.map((item) => (
          <article className="exerciseCard" key={item.id}>
            <div className="exerciseCardTop">
              <div className="exerciseNumber">{item.id === "final-plan" ? "Cierre" : `Ej. ${item.order}`}</div>
              <div className={`statusPill ${item.status}`}>{item.status}</div>
            </div>
            <h3>{item.title}</h3>
            <p className="muted">{item.objective}</p>
            <div className="exerciseMeta">
              <span>Hoja principal</span>
              <strong>{item.mainSheet}</strong>
            </div>
            <div className="exerciseMeta">
              <span>Checkpoint</span>
              <strong>{item.checkpointName}</strong>
            </div>
            <Link
              className={`button ${item.status === "locked" ? "secondary" : "primary"}`}
              href={item.route}
              prefetch={false}
            >
              Abrir
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
