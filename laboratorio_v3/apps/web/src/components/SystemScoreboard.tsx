import type { SystemScoreboard as SystemScoreboardType } from "../types/lab";
import { formatMoney, formatNumber } from "../lib/format";

export function SystemScoreboard({ scoreboard }: { scoreboard: SystemScoreboardType }) {
  return (
    <section className="card">
      <div className="topbar" style={{ marginBottom: 16 }}>
        <div>
          <div className="eyebrow">Scoreboard del sistema</div>
          <h2>Impacto estimado de Portfolio</h2>
          <p className="muted" style={{ marginBottom: 0 }}>
            Este scoreboard es una estimación oficial de la plataforma a partir de la
            entrega del equipo. Antes de enviar, se muestra en modo mock. Revenue en
            riesgo son ventas que podrían perderse si se retiran productos.
          </p>
        </div>
        <div className="statusPill success">Base actual: state_{scoreboard.stateVersion}</div>
      </div>

      <div className="metricGrid">
        <div className="metric">
          <div className="metricLabel">SKUs totales</div>
          <div className="metricValue">{formatNumber(scoreboard.totalSkus)}</div>
        </div>
        <div className="metric">
          <div className="metricLabel">CORE / REVIEW / ELIMINAR</div>
          <div className="metricValue metricText">
            {formatNumber(scoreboard.coreSkus)} / {formatNumber(scoreboard.reviewSkus)} /{" "}
            {formatNumber(scoreboard.eliminateSkus)}
          </div>
        </div>
        <div className="metric">
          <div className="metricLabel">% portfolio eliminado</div>
          <div className="metricValue">
            {scoreboard.totalSkus > 0
              ? `${Math.round((scoreboard.eliminateSkus / scoreboard.totalSkus) * 100)}%`
              : "0%"}
          </div>
        </div>
        <div className="metric">
          <div className="metricLabel">Capital liberado estimado</div>
          <div className="metricValue">{formatMoney(scoreboard.capitalReleased)}</div>
        </div>
        <div className="metric">
          <div className="metricLabel">Revenue en riesgo</div>
          <div className="metricValue">{formatMoney(scoreboard.revenueAtRisk)}</div>
        </div>
        <div className="metric">
          <div className="metricLabel">Margen estimado</div>
          <div className="metricValue">{formatMoney(scoreboard.grossMarginProjected)}</div>
        </div>
        <div className="metric">
          <div className="metricLabel">Impacto EBITDA estimado</div>
          <div className="metricValue">{formatMoney(scoreboard.ebitdaImpact)}</div>
        </div>
      </div>
    </section>
  );
}
