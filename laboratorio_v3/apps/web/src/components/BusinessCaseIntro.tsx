export function BusinessCaseIntro() {
  const dataCards = [
    { title: "8.224 SKUs", body: "Productos activos para clasificar como CORE, REVIEW o ELIMINAR." },
    { title: "12 meses históricos", body: "M01-M12 es historia real. Sirve para mirar tendencia antes de decidir." },
    { title: "Ventas, precios y costos", body: "Datos para entender revenue, margen y cambios de precio o costo." },
    { title: "Stock y DDI", body: "DDI significa días de inventario disponible. Ayuda a detectar exceso de stock." },
    { title: "Categoría y cobertura", body: "Sirve para ver si un producto tiene rol comercial aunque venda poco." }
  ];

  return (
    <section className="grid" style={{ gap: 22 }}>
      <div className="caseHero">
        <div>
          <div className="eyebrow">Contexto de negocio</div>
          <h2>Qué problema tiene Nexus Retail</h2>
          <p>
            Nexus Retail tiene un portfolio amplio. Algunos productos venden bien y
            aportan margen. Otros ocupan stock, inmovilizan capital y casi no contribuyen
            al negocio.
          </p>
          <p>
            El comité ejecutivo necesita una recomendación simple: qué productos mantener,
            cuáles revisar y cuáles retirar o liquidar.
          </p>
        </div>
        <div className="decisionFrame">
          <span>Decisión principal</span>
          <strong>Clasificar SKUs en CORE, REVIEW o ELIMINAR con evidencia.</strong>
        </div>
      </div>

      <section>
        <div className="eyebrow">Base disponible</div>
        <h2>Qué información vas a mirar</h2>
        <p className="muted">
          M01-M12 es historia real. Sirve para mirar tendencia, margen y stock antes de
          decidir.
        </p>
        <div className="factGrid">
          {dataCards.map((card) => (
            <article className="factCard" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
