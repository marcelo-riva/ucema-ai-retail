"use client";

import { useState } from "react";

type MetricKey = "revenue" | "margin" | "capital";

type MetricConfig = {
  key: MetricKey;
  label: string;
  unit: string;
  historical: number[];
  baseline: number[];
  team: number[];
};

const metrics: MetricConfig[] = [
  {
    key: "revenue",
    label: "Revenue",
    unit: "$M",
    historical: [94, 98, 96, 101, 105, 99, 103, 97, 95, 92, 90, 91],
    baseline: [92, 92, 93],
    team: [90, 91, 93]
  },
  {
    key: "margin",
    label: "Margen",
    unit: "$M",
    historical: [18, 19, 18, 20, 21, 19, 20, 18, 18, 17, 17, 17],
    baseline: [17, 17, 18],
    team: [18, 19, 20]
  },
  {
    key: "capital",
    label: "Capital de trabajo",
    unit: "$M",
    historical: [58, 60, 63, 65, 67, 68, 70, 72, 74, 75, 76, 77],
    baseline: [78, 79, 80],
    team: [74, 70, 66]
  }
];

const labels = ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12", "M13", "M14", "M15"];
const width = 760;
const height = 240;
const padding = 34;

function buildPath(values: Array<number | null>, min: number, max: number): string {
  return values
    .map((value, index) => {
      if (value === null) return "";
      const x = padding + (index * (width - padding * 2)) / (labels.length - 1);
      const y = height - padding - ((value - min) / (max - min)) * (height - padding * 2);
      return `${index === 0 || values[index - 1] === null ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");
}

export function TrendProjectionChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("revenue");
  const metric = metrics.find((item) => item.key === selectedMetric) ?? metrics[0];
  const projectionStartX = padding + (12 * (width - padding * 2)) / (labels.length - 1);
  const historicalValues = [...metric.historical, null, null, null];
  const baselineValues = [...Array(12).fill(null), ...metric.baseline];
  const teamValues = [...Array(12).fill(null), ...metric.team];
  const allValues = [...metric.historical, ...metric.baseline, ...metric.team];
  const min = Math.min(...allValues) * 0.94;
  const max = Math.max(...allValues) * 1.06;

  return (
    <section className="card">
      <div className="eyebrow">Histórico + preview de impacto</div>
      <h2>Vista ilustrativa de dirección</h2>
      <p className="muted">
        Vista ilustrativa. En Portfolio se usa para entender dirección del impacto. La
        proyección detallada se trabaja en Forecast.
      </p>

      <div className="segmentedControl" aria-label="Seleccionar métrica">
        {metrics.map((item) => (
          <button
            className={item.key === selectedMetric ? "active" : ""}
            key={item.key}
            onClick={() => setSelectedMetric(item.key)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="chartWrap">
        <svg aria-label={`${metric.label}: histórico, baseline y escenario equipo`} viewBox={`0 0 ${width} ${height}`}>
          <rect className="projectionZone" height={height - padding} width={width - projectionStartX} x={projectionStartX} y="0" />
          <line className="axis" x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} />
          <line className="divider" x1={projectionStartX} x2={projectionStartX} y1={padding / 2} y2={height - padding} />
          <path className="lineRevenue" d={buildPath(historicalValues, min, max)} />
          <path className="lineBaseline" d={buildPath(baselineValues, min, max)} />
          <path className="lineTeam" d={buildPath(teamValues, min, max)} />
          {labels.map((label, index) => {
            const x = padding + (index * (width - padding * 2)) / (labels.length - 1);
            return (
              <text className="chartLabel" key={label} x={x} y={height - 8}>
                {label}
              </text>
            );
          })}
          <text className="zoneLabel" x={padding + 10} y={24}>
            M01-M12: histórico
          </text>
          <text className="zoneLabel" x={projectionStartX + 10} y={24}>
            M13-M15: preview 90 días
          </text>
          <text className="zoneLabel" x={padding + 10} y={height - 42}>
            {metric.label} ({metric.unit})
          </text>
        </svg>
      </div>

      <div className="legend">
        <span><i className="legendRevenue" /> Histórico</span>
        <span><i className="legendBaseline" /> Baseline plataforma</span>
        <span><i className="legendTeam" /> Escenario equipo</span>
      </div>
    </section>
  );
}
