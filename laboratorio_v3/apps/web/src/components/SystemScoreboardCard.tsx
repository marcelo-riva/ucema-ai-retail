import type { SystemScoreboard } from "../types/lab";
import { formatMoney, formatNumber } from "../lib/format";

export function SystemScoreboardCard({ scoreboard }: { scoreboard: SystemScoreboard }) {
  return (
    <section className="card">
      <div className="eyebrow">Scoreboard consolidado</div>
      <h2>Dashboard del Lab 1</h2>
      <div className="metricGrid">
        <div className="metric"><div className="metricLabel">Estado</div><div className="metricValue metricText">{scoreboard.stateVersion}</div></div>
        <div className="metric"><div className="metricLabel">Checkpoints</div><div className="metricValue">{scoreboard.checkpointCount ?? 0}</div></div>
        <div className="metric"><div className="metricLabel">Revenue</div><div className="metricValue">{formatMoney(scoreboard.revenueProjected)}</div></div>
        <div className="metric"><div className="metricLabel">Margen</div><div className="metricValue">{formatMoney(scoreboard.grossMarginProjected)}</div></div>
        <div className="metric"><div className="metricLabel">EBITDA</div><div className="metricValue">{formatMoney(scoreboard.ebitdaImpact)}</div></div>
        <div className="metric"><div className="metricLabel">Capital trabajo</div><div className="metricValue">{formatMoney(scoreboard.workingCapitalProjected)}</div></div>
        <div className="metric"><div className="metricLabel">DDI actual / objetivo</div><div className="metricValue metricText">{scoreboard.ddiCurrent ?? "-"} / {scoreboard.ddiTarget ?? "-"}</div></div>
        <div className="metric"><div className="metricLabel">SKUs</div><div className="metricValue">{formatNumber(scoreboard.totalSkus)}</div></div>
      </div>
    </section>
  );
}
