type CriteriaBlock = {
  title: string;
  items?: string[];
  content?: string;
};

type CriteriaItem = {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  blocks: CriteriaBlock[];
};

type CriteriaGridProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  items: CriteriaItem[];
};

export function CriteriaGrid({ eyebrow, title, intro, items }: CriteriaGridProps) {
  return (
    <section className="card">
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      {title ? <h2>{title}</h2> : null}
      {intro ? <p className="muted">{intro}</p> : null}
      <div className="criterionGrid">
        {items.map((item) => (
          <article className="criterionCard" key={item.id}>
            <div className="criterionHeader">
              <h3>{item.title}</h3>
              {item.subtitle ? <span>{item.subtitle}</span> : null}
            </div>
            <p className="muted">{item.description}</p>
            {item.blocks.map((block, index) => (
              <div className="criterionBlock" key={`${item.id}-block-${index}`}>
                <strong>{block.title}</strong>
                {block.items ? (
                  <ul className="simpleList">
                    {block.items.map((blockItem) => (
                      <li key={blockItem}>{blockItem}</li>
                    ))}
                  </ul>
                ) : null}
                {block.content ? <p className="muted" style={{ margin: 0 }}>{block.content}</p> : null}
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
