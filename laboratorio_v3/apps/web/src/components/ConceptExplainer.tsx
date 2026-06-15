export function ConceptExplainer({ concepts }: { concepts: Array<{ term: string; definition: string }> }) {
  return (
    <section className="card">
      <div className="eyebrow">Conceptos clave</div>
      <div className="factGrid">
        {concepts.map((concept) => (
          <article className="factCard" key={concept.term}>
            <h3>{concept.term}</h3>
            <p>{concept.definition}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
