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

// Valores históricos reales del workbook (en miles de millones = MM).
// Basado en la validación de Hernán: revenue = PVP × vol_diario × días_mes.
const metrics: MetricConfig[] = [
  {
    key: "revenue",
    label: "Revenue",
    unit: "$MM",
    historical: [3.86, 3.06, 3.59, 3.10, 3.77, 3.62, 4.29, 4.35, 4.47, 4.89, 4.88, 5.62],
    baseline: [4.9, 4.9, 4.9],
    team: [5.1, 5.2, 5.3]
  },
  {
    key: "margin",
    label: "Margen",
    unit: "$MM",
    historical: [1.12, 0.91, 1.06, 0.84, 1.03, 1.07, 1.30, 1.24, 1.22, 1.37, 1.28, 1.57],
    baseline: [1.35, 1.35, 1.35],
    team: [1.45, 1.50, 1.55]
  },
  {
    key: "capital",
    label: "Capital de trabajo",
    unit: "$MM",
    historical: [10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 11.0, 11.1, 11.2, 11.3, 11.4],
    baseline: [11.5, 11.6, 11.7],
    team: [10.9, 10.6, 10.3]
  }
];

const labels = ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12", "M13", "M14", "M15"];
const width = 760;
const height = 240;
const padding = { top: 24, right: 24, bottom: 34, left: 50 };

function yForValue(value: number, min: number, max: number): number {
  return height - padding.bottom - ((value - min) / (max - min)) * (height - padding.top - padding.bottom);
}

function xForIndex(index: number): number {
  return padding.left + (index * (width - padding.left - padding.right)) / (labels.length - 1);
}

function buildPath(values: Array<number | null>, min: number, max: number): string {
  return values
    .map((value, index) => {
      if (value === null) return "";
      const x = xForIndex(index);
      const y = yForValue(value, min, max);
      return `${index === 0 || values[index - 1] === null ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");
}

function buildTicks(min: number, max: number): { value: number; y: number }[] {
  const count = 5;
  return Array.from({ length: count + 1 }, (_, i) => {
    const value = min + ((max - min) * i) / count;
    return { value, y: yForValue(value, min, max) };
  });
}

export function TrendProjectionChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("revenue");
  const metric = metrics.find((item) => item.key === selectedMetric) ?? metrics[0];
  const projectionStartX = xForIndex(12);
  const historicalValues = [...metric.historical, null, null, null];
  const baselineValues = [...Array(12).fill(null), ...metric.baseline];
  const teamValues = [...Array(12).fill(null), ...metric.team];
  const allValues = [...metric.historical, ...metric.baseline, ...metric.team].filter((v): v is number => v !== null);
  const min = Math.min(...allValues) * 0.92;
  const max = Math.max(...allValues) * 1.08;
  const ticks = buildTicks(min, max);

  return (
    <section className="card">
      <div className="eyebrow">Histórico + preview de impacto</div>
      <h2>Vista de dirección</h2>
      <p className="muted">
        Histórico real M01-M12 del workbook. La proyección M13-M15 es ilustrativa;
        el escenario detallado se trabaja en el ejercicio de Forecast.
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
          <rect className="projectionZone" height={height - padding.bottom} width={width - projectionStartX} x={projectionStartX} y="0" />

          {/* Grid lines and Y-axis ticks */}
          {ticks.map((tick, i) => (
            <g key={i}>
              <line
                className="gridLine"
                x1={padding.left}
                x2={width - padding.right}
                y1={tick.y}
                y2={tick.y}
              />
              <text className="chartLabel" x={padding.left - 8} y={tick.y + 4} textAnchor="end">
                {tick.value.toFixed(1)}
              </text>
            </g>
          ))}

          <line className="axis" x1={padding.left} x2={width - padding.right} y1={height - padding.bottom} y2={height - padding.bottom} />
          <line className="divider" x1={projectionStartX} x2={projectionStartX} y1={padding.top} y2={height - padding.bottom} />
          <path className="lineRevenue" d={buildPath(historicalValues, min, max)} />
          <path className="lineBaseline" d={buildPath(baselineValues, min, max)} />
          <path className="lineTeam" d={buildPath(teamValues, min, max)} />
          {labels.map((label, index) => {
            const x = xForIndex(index);
            return (
              <text className="chartLabel" key={label} x={x} y={height - 8} textAnchor="middle">
                {label}
              </text>
            );
          })}
          <text className="zoneLabel" x={padding.left + 10} y={18}>
            M01-M12: histórico
          </text>
          <text className="zoneLabel" x={projectionStartX + 10} y={18}>
            M13-M15: preview 90 días
          </text>
          <text className="zoneLabel" x={padding.left + 10} y={height - 52}>
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
