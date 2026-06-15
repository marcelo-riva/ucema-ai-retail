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
      <h2>Ejercicios</h2>
      <div className="exerciseTimeline">
        {items.map((item) => (
          <article key={item.id}>
            <div className="timelineIndex">{item.order}</div>
            <div>
              <div className={`statusPill ${item.status}`}>{item.status}</div>
              <h3>{item.title}</h3>
              <p>{item.objective}</p>
              <p><strong>Hoja principal:</strong> {item.mainSheet}</p>
              <p><strong>Checkpoint:</strong> {item.checkpointName}</p>
              <Link className={`button ${item.status === "locked" ? "secondary" : "primary"}`} href={item.route}>
                Abrir
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
