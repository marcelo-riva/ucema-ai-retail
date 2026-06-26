type MetricListProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  items: string[];
};

export function MetricList({ eyebrow, title, intro, items }: MetricListProps) {
  return (
    <section className="card">
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {intro ? <p className="muted">{intro}</p> : null}
      <ul className="simpleList">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
