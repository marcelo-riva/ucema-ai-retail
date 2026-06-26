type ScenarioItem = {
  id: string;
  title: string;
  objective: string;
  logic: string;
  eliminate: string[];
  maintain: string[];
  tradeoff: string;
};

type ScenarioGridProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  items: ScenarioItem[];
};

export function ScenarioGrid({ eyebrow, title, intro, items }: ScenarioGridProps) {
  return (
    <section className="card">
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {intro ? <p className="muted">{intro}</p> : null}
      <div className="criterionGrid">
        {items.map((scenario) => (
          <article className="criterionCard" key={scenario.id}>
            <div className="criterionHeader">
              <h3>{scenario.title}</h3>
              <span>{scenario.objective}</span>
            </div>
            <p className="muted">{scenario.logic}</p>
            <div className="criterionBlock">
              <strong>Tiende a eliminar</strong>
              <ul className="simpleList">
                {scenario.eliminate.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="criterionBlock">
              <strong>Tiende a mantener o revisar</strong>
              <ul className="simpleList">
                {scenario.maintain.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="criterionBlock">
              <strong>Trade-off</strong>
              <p className="muted" style={{ margin: 0 }}>{scenario.tradeoff}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
