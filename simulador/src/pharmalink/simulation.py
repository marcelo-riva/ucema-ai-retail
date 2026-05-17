from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


MONTHS = 12
MONTH_LABELS = [f"M{i:02d}" for i in range(1, MONTHS + 1)]

CATEGORY_BASELINE = [
    {
        "name": "Medicamentos cronicos",
        "mix": 0.38,
        "gross_margin": 0.305,
        "elasticity": 1.25,
        "inventory_sensitivity": 1.25,
        "digital_affinity": 0.75,
        "role": "Trae recurrencia y exige disponibilidad.",
    },
    {
        "name": "OTC y cuidado diario",
        "mix": 0.22,
        "gross_margin": 0.355,
        "elasticity": 1.10,
        "inventory_sensitivity": 0.90,
        "digital_affinity": 0.95,
        "role": "Categoria sensible a precio y promociones.",
    },
    {
        "name": "Dermocosmetica",
        "mix": 0.16,
        "gross_margin": 0.485,
        "elasticity": 0.58,
        "inventory_sensitivity": 0.60,
        "digital_affinity": 1.10,
        "role": "Aporta margen, experiencia y ticket.",
    },
    {
        "name": "Perfumeria y belleza",
        "mix": 0.14,
        "gross_margin": 0.415,
        "elasticity": 0.74,
        "inventory_sensitivity": 0.70,
        "digital_affinity": 1.00,
        "role": "Puede sostener margen si no se pierde trafico.",
    },
    {
        "name": "Suplementos y bienestar",
        "mix": 0.10,
        "gross_margin": 0.455,
        "elasticity": 0.82,
        "inventory_sensitivity": 0.65,
        "digital_affinity": 1.18,
        "role": "Crece con digital y nuevos clientes.",
    },
]


@dataclass(frozen=True)
class Baseline:
    monthly_revenue: float = 29984.5
    starting_cash: float = -25000.0
    starting_inventory: float = 60000.0
    starting_ddi: float = 62.0
    base_ebitda_margin: float = 0.0294
    gross_margin: float = 0.36
    capex_limit: float = 50000.0
    max_negative_fcf_months: int = 3


@dataclass
class Scenario:
    team_id: str = "team-01"
    name: str = "Escenario actual"
    strategic_focus: str = "balanced"
    current_lab: str = "diagnostico"
    current_month: int = 1
    notes: str = ""
    iteration: int = 1
    decisions: dict[str, Any] = field(
        default_factory=lambda: {
            "inventory": {
                "coverage_pct": 0.95,
                "sku_reduction_pct": 0.05,
                "ddi_target": 54,
                "category_coverage_delta": {
                    "Medicamentos cronicos": 0.0,
                    "OTC y cuidado diario": 0.0,
                    "Dermocosmetica": 0.0,
                    "Perfumeria y belleza": 0.0,
                    "Suplementos y bienestar": 0.0,
                },
            },
            "pricing": {
                "avg_pvp_change_pct": 0.0,
                "sensitive_category_change_pct": 0.0,
                "premium_category_change_pct": 0.0,
            },
            "customer": {
                "vip_retention_focus": 0.50,
                "at_risk_retention_focus": 0.50,
                "opportunistic_retention_focus": 0.00,
                "new_customers_monthly": 50000,
            },
            "digital": {
                "delivery_mix": 0.05,
                "pickup_mix": 0.08,
                "hub_push": 0.02,
            },
            "network": {
                "flagship_openings": 3,
                "hub_openings": 8,
                "proximity_closures": 11,
            },
        }
    )

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, payload: dict[str, Any]) -> "Scenario":
        return cls(**payload)


def _consecutive_negative(values: list[float]) -> int:
    max_run = 0
    current = 0
    for value in values:
        if value < 0:
            current += 1
            max_run = max(max_run, current)
        else:
            current = 0
    return max_run


def _category_price_change(name: str, avg_price: float, sensitive_price: float, premium_price: float) -> float:
    if name in {"Medicamentos cronicos", "OTC y cuidado diario"}:
        return avg_price + sensitive_price
    if name in {"Dermocosmetica", "Perfumeria y belleza"}:
        return avg_price + premium_price
    return avg_price + premium_price * 0.45


def simulate(scenario: Scenario, baseline: Baseline | None = None) -> dict[str, Any]:
    """Run a compact pedagogical simulation.

    The formulas intentionally simplify the Excel model. The goal for the MVP is
    interaction design and systemic feedback. Later phases should calibrate these
    formulas against the workbook.
    """

    base = baseline or Baseline()
    inv = scenario.decisions["inventory"]
    pricing = scenario.decisions["pricing"]
    customer = scenario.decisions["customer"]
    digital = scenario.decisions["digital"]
    network = scenario.decisions["network"]

    ddi_delta = base.starting_ddi - float(inv["ddi_target"])
    global_coverage = float(inv["coverage_pct"])
    category_coverage_delta = inv.get("category_coverage_delta", {})
    sku_reduction = float(inv["sku_reduction_pct"])
    stockout_from_ddi = max(0.0, 45 - float(inv["ddi_target"])) * 0.004
    category_stockout_map = {}
    category_coverage_map = {}
    stockout_rate = 0.0
    category_release_gap = 0.0
    for category in CATEGORY_BASELINE:
        coverage_delta = float(category_coverage_delta.get(category["name"], 0.0))
        category_coverage = min(1.0, max(0.65, global_coverage + coverage_delta))
        category_gap = max(0.0, 0.95 - category_coverage)
        category_stockout = min(
            0.24,
            (category_gap * 0.9 + stockout_from_ddi) * category["inventory_sensitivity"],
        )
        category_coverage_map[category["name"]] = category_coverage
        category_stockout_map[category["name"]] = category_stockout
        stockout_rate += category_stockout * category["mix"]
        category_release_gap += category_gap * category["mix"]
    stockout_rate = min(0.18, stockout_rate)
    waste_saving_rate = min(0.018, sku_reduction * 0.06)
    inventory_release = max(
        0.0,
        base.starting_inventory * (ddi_delta / base.starting_ddi) * 0.72
        + base.starting_inventory * category_release_gap * 0.18,
    )

    avg_price = float(pricing["avg_pvp_change_pct"])
    sensitive_price = float(pricing["sensitive_category_change_pct"])
    premium_price = float(pricing["premium_category_change_pct"])
    price_volume_effect = -(avg_price * 0.72 + sensitive_price * 1.15 + premium_price * 0.42)
    price_margin_effect = avg_price * 0.52 + sensitive_price * 0.24 + premium_price * 0.64
    pricing_revenue_factor = 1 + avg_price + premium_price * 0.22 + price_volume_effect

    retention_power = (
        float(customer["vip_retention_focus"]) * 0.28
        + float(customer["at_risk_retention_focus"]) * 0.52
        + float(customer["opportunistic_retention_focus"]) * 0.12
    )
    new_customers = float(customer["new_customers_monthly"])
    customer_revenue = (retention_power * 280 + (new_customers - 50000) * 0.0038) * MONTHS
    marketing_cost = (
        float(customer["vip_retention_focus"]) * 78
        + float(customer["at_risk_retention_focus"]) * 114
        + float(customer["opportunistic_retention_focus"]) * 46
        + new_customers * 0.0045
    ) * MONTHS
    churn_rate = max(0.018, 0.062 - retention_power * 0.035)

    delivery_mix = float(digital["delivery_mix"])
    pickup_mix = float(digital["pickup_mix"])
    hub_push = float(digital["hub_push"])
    digital_penetration = delivery_mix + pickup_mix + hub_push
    logistics_cost_rate = 0.025 + delivery_mix * 0.105 + pickup_mix * 0.03 + hub_push * 0.065
    convenience_uplift = min(0.045, digital_penetration * 0.18)

    flagship_openings = int(network["flagship_openings"])
    hub_openings = int(network["hub_openings"])
    proximity_closures = int(network["proximity_closures"])
    capex_used = flagship_openings * 6100 + hub_openings * 2250
    network_revenue = flagship_openings * 520 + hub_openings * 120 - proximity_closures * 92
    fixed_cost_saving = proximity_closures * 38 - flagship_openings * 64 - hub_openings * 26

    gross_margin = max(0.23, base.gross_margin + price_margin_effect + waste_saving_rate)
    annual_revenue_before_stockouts = (
        base.monthly_revenue * MONTHS * pricing_revenue_factor * (1 + convenience_uplift)
        + customer_revenue
        + network_revenue
    )
    revenue = max(0.0, annual_revenue_before_stockouts * (1 - stockout_rate))
    gross_profit = revenue * gross_margin
    logistics_cost = revenue * logistics_cost_rate
    operating_cost = revenue * 0.265 - fixed_cost_saving
    ebitda = gross_profit - logistics_cost - operating_cost - marketing_cost

    seasonality = [0.92, 0.94, 0.98, 1.02, 1.08, 1.12, 1.10, 1.06, 1.01, 0.98, 0.94, 0.85]
    ramp = [
        1
        + convenience_uplift * (i / (MONTHS - 1)) * 0.45
        + max(0, flagship_openings - proximity_closures * 0.15) * 0.0025 * (i / (MONTHS - 1))
        for i in range(MONTHS)
    ]
    monthly_weights = [seasonality[i] * ramp[i] for i in range(MONTHS)]
    monthly_weight_total = sum(monthly_weights)
    monthly_revenue = [revenue * weight / monthly_weight_total for weight in monthly_weights]
    monthly_ebitda = [
        ebitda * (month_revenue / revenue) if revenue else 0.0 for month_revenue in monthly_revenue
    ]
    monthly_wc_release = [0.0 for _ in range(MONTHS)]
    monthly_wc_release[1] = inventory_release * 0.46
    monthly_wc_release[2] = inventory_release * 0.34
    monthly_wc_release[3] = inventory_release * 0.20
    monthly_capex = [0.0 for _ in range(MONTHS)]
    if capex_used:
        monthly_capex[2] = capex_used * 0.32
        monthly_capex[5] = capex_used * 0.26
        monthly_capex[8] = capex_used * 0.22
        monthly_capex[10] = capex_used * 0.20

    monthly_fcf = [
        monthly_ebitda[i] + monthly_wc_release[i] - monthly_capex[i] for i in range(MONTHS)
    ]
    cash_balance = []
    running_cash = base.starting_cash
    for fcf in monthly_fcf:
        running_cash += fcf
        cash_balance.append(running_cash)
    ending_cash = base.starting_cash + sum(monthly_fcf)
    negative_run = _consecutive_negative(monthly_fcf)

    category_rows = []
    category_weight_total = 0.0
    weighted_categories = []
    for category in CATEGORY_BASELINE:
        price_change = _category_price_change(
            category["name"], avg_price, sensitive_price, premium_price
        )
        volume_effect = (
            -price_change * category["elasticity"]
            - category_stockout_map[category["name"]]
            + convenience_uplift * category["digital_affinity"]
            + retention_power * 0.018
        )
        raw_weight = max(0.02, category["mix"] * (1 + price_change + volume_effect))
        category_weight_total += raw_weight
        weighted_categories.append((category, price_change, volume_effect, raw_weight))

    for category, price_change, volume_effect, raw_weight in weighted_categories:
        category_revenue = revenue * raw_weight / category_weight_total if category_weight_total else 0.0
        category_margin = max(
            0.18,
            category["gross_margin"] + price_change * 0.34 + waste_saving_rate * 0.55,
        )
        category_stockout = category_stockout_map[category["name"]]
        risk = "OK"
        if category_stockout > 0.08:
            risk = "Quiebre"
        elif volume_effect < -0.08:
            risk = "Volumen"
        elif category_margin < category["gross_margin"] - 0.015:
            risk = "Margen"
        category_rows.append(
            {
                "Categoria": category["name"],
                "Rol": category["role"],
                "Revenue anual": category_revenue,
                "Mix": category_revenue / revenue if revenue else 0.0,
                "Margen bruto": category_margin,
                "Cobertura": category_coverage_map[category["name"]],
                "Cambio PVP": price_change,
                "Impacto volumen": volume_effect,
                "Quiebres": category_stockout,
                "Riesgo": risk,
            }
        )

    alerts = []
    if capex_used > base.capex_limit:
        alerts.append("CAPEX supera el limite anual.")
    if negative_run > base.max_negative_fcf_months:
        alerts.append("Mas de 3 meses consecutivos de FCF negativo.")
    if ending_cash < 0:
        alerts.append("Caja final negativa.")
    if stockout_rate > 0.07:
        alerts.append("Riesgo alto de quiebres por cobertura/DDI.")
    if logistics_cost_rate > 0.05:
        alerts.append("Cost-to-serve elevado por mix digital.")

    consistency = 100
    focus = scenario.strategic_focus
    if focus == "cash_first" and capex_used > base.capex_limit * 0.75:
        consistency -= 18
    if focus == "customer_first" and churn_rate > 0.048:
        consistency -= 18
    if focus == "omnichannel_first" and digital_penetration < 0.16:
        consistency -= 18
    if focus == "margin_first" and gross_margin < base.gross_margin:
        consistency -= 18
    consistency -= min(30, len(alerts) * 8)
    consistency = max(0, consistency)

    return {
        "kpis": {
            "annual_revenue": revenue,
            "annual_ebitda": ebitda,
            "annual_fcf": sum(monthly_fcf),
            "ending_cash": ending_cash,
            "capex_used": capex_used,
            "negative_fcf_months": negative_run,
            "gross_margin": gross_margin,
            "ddi": float(inv["ddi_target"]),
            "stockout_rate": stockout_rate,
            "logistics_cost": logistics_cost,
            "logistics_cost_rate": logistics_cost_rate,
            "churn_rate": churn_rate,
            "consistency_score": consistency,
        },
        "monthly": {
            "month": MONTH_LABELS,
            "revenue": monthly_revenue,
            "ebitda": monthly_ebitda,
            "working_capital_release": monthly_wc_release,
            "capex": monthly_capex,
            "fcf": monthly_fcf,
            "cash_balance": cash_balance,
        },
        "categories": category_rows,
        "alerts": alerts,
    }


def advisor_feedback(scenario: Scenario, result: dict[str, Any]) -> dict[str, list[str] | str]:
    kpis = result["kpis"]
    alerts = result["alerts"]
    risks = list(alerts)
    recommendations: list[str] = []

    if kpis["stockout_rate"] > 0.06:
        recommendations.append("Revisar DDI/cobertura antes de seguir bajando inventario.")
    if kpis["capex_used"] > Baseline().capex_limit * 0.8:
        recommendations.append("Escalonar aperturas o priorizar hubs con mejor retorno.")
    if kpis["ending_cash"] < 0:
        recommendations.append("Buscar caja temprana: WC, timing de CAPEX o menor gasto comercial.")
    if kpis["logistics_cost_rate"] > 0.05:
        recommendations.append("Mover parte del crecimiento digital a pick-up o hubs mas eficientes.")
    if not recommendations:
        recommendations.append("El escenario no rompe constraints criticos; comparar contra otra estrategia.")

    diagnosis = (
        "El escenario mejora si mantiene equilibrio entre caja, margen y servicio. "
        "La lectura clave es mirar no solo EBITDA anual, sino timing de FCF y caja final."
    )

    return {
        "diagnosis": diagnosis,
        "risks": risks or ["Sin alertas criticas en esta iteracion."],
        "recommendations": recommendations,
        "board_questions": [
            "Que decidieron no hacer para proteger caja?",
            "Que variable se volveria critica si la demanda cae?",
            "La estrategia declarada coincide con las palancas que movieron?",
        ],
    }
