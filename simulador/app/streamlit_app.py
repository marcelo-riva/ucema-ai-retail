from __future__ import annotations

from html import escape
import sys
from pathlib import Path

import pandas as pd
import streamlit as st


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
if str(SRC) not in sys.path:
    sys.path.insert(0, str(SRC))

from pharmalink.simulation import CATEGORY_BASELINE, Scenario, advisor_feedback, simulate
from pharmalink.storage import list_scenarios, load_scenario, save_scenario


FOCUS_OPTIONS = {
    "balanced": "Balanceada",
    "cash_first": "Caja primero",
    "margin_first": "Margen primero",
    "customer_first": "Cliente primero",
    "omnichannel_first": "Omnicanal primero",
    "network_efficiency": "Red eficiente",
}

LABS = [
    ("diagnostico", "Diagnostico"),
    ("inventory", "Inventario"),
    ("pricing", "Pricing"),
    ("customer", "Clientes"),
    ("digital", "Digital"),
    ("network", "Red & CAPEX"),
    ("board", "Board Meeting"),
]

CATEGORY_SLUGS = {
    "Medicamentos cronicos": "medicamentos_cronicos",
    "OTC y cuidado diario": "otc_cuidado_diario",
    "Dermocosmetica": "dermocosmetica",
    "Perfumeria y belleza": "perfumeria_belleza",
    "Suplementos y bienestar": "suplementos_bienestar",
}

LAB_GUIDES = {
    "diagnostico": {
        "title": "Que tienen que hacer ahora",
        "objective": "Elegir una hipotesis estrategica para el turnaround antes de tocar palancas.",
        "moves": [
            "Definir si van a priorizar caja, margen, clientes, omnicanalidad o eficiencia de red.",
            "Escribir una hipotesis breve que puedan defender frente al board.",
        ],
        "watch": [
            "Consistencia entre la hipotesis y las decisiones posteriores.",
            "Alertas iniciales de caja y FCF.",
        ],
    },
    "inventory": {
        "title": "Laboratorio de inventario",
        "objective": "Liberar capital de trabajo sin romper disponibilidad ni categorias sensibles.",
        "moves": [
            "Bajar DDI para liberar caja mas temprano.",
            "Reducir SKUs y cobertura para simplificar surtido.",
        ],
        "watch": [
            "Meses M02-M04, donde aparece la liberacion de capital de trabajo.",
            "Quiebres por categoria, especialmente medicamentos cronicos y OTC.",
        ],
    },
    "pricing": {
        "title": "Laboratorio de pricing",
        "objective": "Mejorar margen sin destruir volumen ni trafico.",
        "moves": [
            "Mover PVP promedio.",
            "Diferenciar categorias sensibles vs premium.",
        ],
        "watch": [
            "Margen bruto, revenue y riesgo de volumen por categoria.",
            "Medicamentos/OTC reaccionan mas que dermocosmetica.",
        ],
    },
    "customer": {
        "title": "Laboratorio de clientes",
        "objective": "Decidir a que clientes proteger y cuanto crecimiento comprar.",
        "moves": [
            "Asignar foco entre VIPs, riesgo de fuga y oportunistas.",
            "Aumentar o bajar nuevos clientes por mes.",
        ],
        "watch": [
            "Churn, marketing cost y FCF mensual.",
            "Si el crecimiento nuevo financia o empeora la caja.",
        ],
    },
    "digital": {
        "title": "Laboratorio digital",
        "objective": "Crecer conveniencia omnicanal sin romper cost-to-serve.",
        "moves": [
            "Elegir mix delivery, pick-up y push de hubs.",
            "Balancear promesa de servicio contra costo logistico.",
        ],
        "watch": [
            "Costo logistico como porcentaje de ventas.",
            "Categorias con mayor afinidad digital.",
        ],
    },
    "network": {
        "title": "Laboratorio de red",
        "objective": "Redisenar tiendas y nodos sin exceder CAPEX ni perder cobertura.",
        "moves": [
            "Abrir flagships o hubs.",
            "Cerrar tiendas de proximidad.",
        ],
        "watch": [
            "CAPEX en M03, M06, M09 y M11.",
            "Caja final y meses consecutivos de FCF negativo.",
        ],
    },
    "board": {
        "title": "Board final",
        "objective": "Defender la estrategia integral y los trade-offs.",
        "moves": [
            "Comparar iteraciones guardadas.",
            "Explicar que eligieron no hacer.",
        ],
        "watch": [
            "Caja, FCF mensual, categorias afectadas y consistencia.",
            "Preguntas que haria el board antes de aprobar el plan.",
        ],
    },
}

CLASS_SEQUENCE = [
    ("Clase 1", "Diagnostico", "Definir la tesis estrategica y el problema ejecutivo."),
    ("Clase 2", "Inventario", "Probar caja vs disponibilidad por categoria."),
    ("Clase 3", "Pricing", "Probar margen vs volumen y sensibilidad de categorias."),
    ("Clase 4", "Clientes", "Probar retencion, churn, adquisicion y CAC."),
    ("Clase 5", "Digital", "Probar conveniencia vs costo logistico."),
    ("Clase 6", "Red & CAPEX", "Probar cobertura, formatos, hubs e inversion."),
    ("Cierre", "Board Meeting", "Defender el plan integral y los trade-offs."),
]

GUIDED_PLAYS = {
    "inventory": [
        {
            "name": "Jugada A — Caja agresiva",
            "intent": "Ver cuanta caja aparece cuando bajo inventario de forma fuerte.",
            "sliders": [
                "Cobertura %: 0.88",
                "Reduccion SKUs %: 0.18",
                "DDI objetivo: 44",
                "Medicamentos cronicos: 0.00",
                "OTC y cuidado diario: -0.08",
                "Dermocosmetica: -0.10",
                "Perfumeria y belleza: -0.10",
                "Suplementos y bienestar: -0.06",
            ],
            "watch": "M02-M04: caja y FCF. Categorias: quiebres en OTC y cronicos.",
            "learning": "Aprender que liberar caja puede crear riesgo comercial si se corta disponibilidad.",
            "month": 3,
            "values": {
                "inventory_coverage_pct": 0.88,
                "inventory_sku_reduction_pct": 0.18,
                "inventory_ddi_target": 44,
                "inventory_category_delta_medicamentos_cronicos": 0.00,
                "inventory_category_delta_otc_cuidado_diario": -0.08,
                "inventory_category_delta_dermocosmetica": -0.10,
                "inventory_category_delta_perfumeria_belleza": -0.10,
                "inventory_category_delta_suplementos_bienestar": -0.06,
            },
        },
        {
            "name": "Jugada B — Caja cuidando cronicos",
            "intent": "Proteger la categoria que sostiene recurrencia y bajar donde duele menos.",
            "sliders": [
                "Cobertura %: 0.91",
                "Reduccion SKUs %: 0.12",
                "DDI objetivo: 48",
                "Medicamentos cronicos: +0.05",
                "OTC y cuidado diario: -0.04",
                "Dermocosmetica: -0.07",
                "Perfumeria y belleza: -0.08",
                "Suplementos y bienestar: -0.04",
            ],
            "watch": "Comparar contra Jugada A: caja perdida vs quiebres evitados.",
            "learning": "Aprender segmentacion operativa: no todas las categorias admiten el mismo recorte.",
            "month": 3,
            "values": {
                "inventory_coverage_pct": 0.91,
                "inventory_sku_reduction_pct": 0.12,
                "inventory_ddi_target": 48,
                "inventory_category_delta_medicamentos_cronicos": 0.05,
                "inventory_category_delta_otc_cuidado_diario": -0.04,
                "inventory_category_delta_dermocosmetica": -0.07,
                "inventory_category_delta_perfumeria_belleza": -0.08,
                "inventory_category_delta_suplementos_bienestar": -0.04,
            },
        },
        {
            "name": "Jugada C — Conservadora defendible",
            "intent": "Construir una decision que el equipo pueda defender ante un board.",
            "sliders": [
                "Cobertura %: 0.93",
                "Reduccion SKUs %: 0.08",
                "DDI objetivo: 52",
                "Medicamentos cronicos: +0.03",
                "OTC y cuidado diario: 0.00",
                "Dermocosmetica: -0.05",
                "Perfumeria y belleza: -0.05",
                "Suplementos y bienestar: -0.03",
            ],
            "watch": "M12: caja final y consistencia. Feedback IA: preguntas de board.",
            "learning": "Aprender que el mejor escenario pedagogico no siempre maximiza caja: maximiza explicabilidad.",
            "month": 12,
            "values": {
                "inventory_coverage_pct": 0.93,
                "inventory_sku_reduction_pct": 0.08,
                "inventory_ddi_target": 52,
                "inventory_category_delta_medicamentos_cronicos": 0.03,
                "inventory_category_delta_otc_cuidado_diario": 0.00,
                "inventory_category_delta_dermocosmetica": -0.05,
                "inventory_category_delta_perfumeria_belleza": -0.05,
                "inventory_category_delta_suplementos_bienestar": -0.03,
            },
        },
    ],
    "pricing": [
        {
            "name": "Jugada A — Margen agresivo",
            "intent": "Subir precios para ver elasticidad y margen.",
            "sliders": [
                "Cambio PVP promedio: +0.06",
                "Cambio PVP categorias sensibles: +0.04",
                "Cambio PVP categorias premium: +0.10",
            ],
            "watch": "Margen bruto vs impacto volumen por categoria.",
            "learning": "Aprender que subir todo puede mejorar margen pero destruir volumen en categorias sensibles.",
            "month": 5,
            "values": {
                "pricing_avg_pvp_change_pct": 0.06,
                "pricing_sensitive_category_change_pct": 0.04,
                "pricing_premium_category_change_pct": 0.10,
            },
        },
        {
            "name": "Jugada B — Proteger sensibles",
            "intent": "Diferenciar pricing entre canasta sensible y premium.",
            "sliders": [
                "Cambio PVP promedio: +0.02",
                "Cambio PVP categorias sensibles: -0.03",
                "Cambio PVP categorias premium: +0.12",
            ],
            "watch": "Mix de categorias y revenue.",
            "learning": "Aprender que precio es arquitectura, no promedio.",
            "month": 5,
            "values": {
                "pricing_avg_pvp_change_pct": 0.02,
                "pricing_sensitive_category_change_pct": -0.03,
                "pricing_premium_category_change_pct": 0.12,
            },
        },
        {
            "name": "Jugada C — Balanceada",
            "intent": "Buscar margen defendible sin tensionar demasiado volumen.",
            "sliders": [
                "Cambio PVP promedio: +0.03",
                "Cambio PVP categorias sensibles: 0.00",
                "Cambio PVP categorias premium: +0.08",
            ],
            "watch": "Consistencia con foco estrategico y preguntas de board.",
            "learning": "Aprender a defender bandas de cambio por categoria.",
            "month": 12,
            "values": {
                "pricing_avg_pvp_change_pct": 0.03,
                "pricing_sensitive_category_change_pct": 0.00,
                "pricing_premium_category_change_pct": 0.08,
            },
        },
    ],
}


def ensure_state() -> None:
    if "scenario" not in st.session_state:
        st.session_state.scenario = Scenario()
    ensure_scenario_defaults(st.session_state.scenario)
    if "saved_counts" not in st.session_state:
        st.session_state.saved_counts = {lab: 0 for lab, _ in LABS}
    if "last_saved_path" not in st.session_state:
        st.session_state.last_saved_path = None


def ensure_scenario_defaults(scenario: Scenario) -> None:
    if not hasattr(scenario, "current_month"):
        scenario.current_month = 1
    scenario.current_month = max(1, min(12, int(scenario.current_month)))
    inventory = scenario.decisions.setdefault("inventory", {})
    inventory.setdefault("coverage_pct", 0.95)
    inventory.setdefault("sku_reduction_pct", 0.05)
    inventory.setdefault("ddi_target", 54)
    category_delta = inventory.setdefault("category_coverage_delta", {})
    for category in CATEGORY_BASELINE:
        category_delta.setdefault(category["name"], 0.0)


def sync_scenario_from_widgets(scenario: Scenario) -> None:
    bindings = {
        "strategic_focus": ("strategic_focus",),
        "inventory_coverage_pct": ("decisions", "inventory", "coverage_pct"),
        "inventory_sku_reduction_pct": ("decisions", "inventory", "sku_reduction_pct"),
        "inventory_ddi_target": ("decisions", "inventory", "ddi_target"),
        "pricing_avg_pvp_change_pct": ("decisions", "pricing", "avg_pvp_change_pct"),
        "pricing_sensitive_category_change_pct": (
            "decisions",
            "pricing",
            "sensitive_category_change_pct",
        ),
        "pricing_premium_category_change_pct": (
            "decisions",
            "pricing",
            "premium_category_change_pct",
        ),
        "customer_vip_retention_focus": ("decisions", "customer", "vip_retention_focus"),
        "customer_at_risk_retention_focus": (
            "decisions",
            "customer",
            "at_risk_retention_focus",
        ),
        "customer_opportunistic_retention_focus": (
            "decisions",
            "customer",
            "opportunistic_retention_focus",
        ),
        "customer_new_customers_monthly": ("decisions", "customer", "new_customers_monthly"),
        "digital_delivery_mix": ("decisions", "digital", "delivery_mix"),
        "digital_pickup_mix": ("decisions", "digital", "pickup_mix"),
        "digital_hub_push": ("decisions", "digital", "hub_push"),
        "network_flagship_openings": ("decisions", "network", "flagship_openings"),
        "network_hub_openings": ("decisions", "network", "hub_openings"),
        "network_proximity_closures": ("decisions", "network", "proximity_closures"),
    }
    for key, path in bindings.items():
        if key not in st.session_state:
            continue
        if path == ("strategic_focus",):
            scenario.strategic_focus = st.session_state[key]
            continue
        target = scenario
        for part in path[:-1]:
            target = getattr(target, part) if isinstance(part, str) and hasattr(target, part) else target[part]
        target[path[-1]] = st.session_state[key]

    category_delta = scenario.decisions["inventory"]["category_coverage_delta"]
    for category in CATEGORY_BASELINE:
        key = f"inventory_category_delta_{CATEGORY_SLUGS[category['name']]}"
        if key in st.session_state:
            category_delta[category["name"]] = st.session_state[key]


def fmt_mm(value: float) -> str:
    return f"ARS {value:,.0f} MM".replace(",", ".")


def fmt_pct(value: float) -> str:
    return f"{value * 100:.1f}%"


def fmt_delta_pct(value: float) -> str:
    return f"{value * 100:+.1f}%"


def neutral_baseline(current_month: int) -> Scenario:
    scenario = Scenario(
        name="Baseline sin nuevas decisiones",
        strategic_focus="balanced",
        current_lab="diagnostico",
        current_month=current_month,
    )
    scenario.decisions["inventory"] = {
        "coverage_pct": 0.95,
        "sku_reduction_pct": 0.00,
        "ddi_target": 62,
        "category_coverage_delta": {
            category["name"]: 0.0 for category in CATEGORY_BASELINE
        },
    }
    scenario.decisions["pricing"] = {
        "avg_pvp_change_pct": 0.0,
        "sensitive_category_change_pct": 0.0,
        "premium_category_change_pct": 0.0,
    }
    scenario.decisions["customer"] = {
        "vip_retention_focus": 0.50,
        "at_risk_retention_focus": 0.50,
        "opportunistic_retention_focus": 0.00,
        "new_customers_monthly": 50000,
    }
    scenario.decisions["digital"] = {
        "delivery_mix": 0.05,
        "pickup_mix": 0.08,
        "hub_push": 0.02,
    }
    scenario.decisions["network"] = {
        "flagship_openings": 0,
        "hub_openings": 0,
        "proximity_closures": 0,
    }
    return scenario


def comparison_rows(current: dict, baseline: dict) -> list[dict[str, str]]:
    metrics = [
        ("Revenue anual", "annual_revenue", fmt_mm),
        ("EBITDA anual", "annual_ebitda", fmt_mm),
        ("FCF anual", "annual_fcf", fmt_mm),
        ("Caja final", "ending_cash", fmt_mm),
        ("CAPEX usado", "capex_used", fmt_mm),
        ("Margen bruto", "gross_margin", fmt_pct),
        ("DDI", "ddi", lambda value: f"{value:.0f} dias"),
        ("Quiebres", "stockout_rate", fmt_pct),
        ("Costo logistico", "logistics_cost_rate", fmt_pct),
        ("Churn", "churn_rate", fmt_pct),
        ("Consistencia", "consistency_score", lambda value: f"{value:.0f}/100"),
    ]
    rows = []
    for label, key, formatter in metrics:
        current_value = current["kpis"][key]
        baseline_value = baseline["kpis"][key]
        delta = current_value - baseline_value
        rows.append(
            {
                "Variable": label,
                "Actual": formatter(current_value),
                "Baseline": formatter(baseline_value),
                "Delta": formatter(delta) if key not in {"consistency_score", "ddi"} else f"{delta:+.0f}",
            }
        )
    return rows


def apply_guided_play(scenario: Scenario, lab: str, play: dict) -> None:
    scenario.current_lab = lab
    scenario.current_month = int(play.get("month", scenario.current_month))
    for key, value in play.get("values", {}).items():
        st.session_state[key] = value
    scenario.name = play["name"]


def inject_css() -> None:
    st.markdown(
        """
        <style>
          .block-container {
            padding-top: 2rem;
          }

          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
            gap: 0.55rem;
            margin: 0.35rem 0 0.75rem;
          }

          .kpi-card {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: #ffffff;
            padding: 0.62rem 0.68rem;
            min-height: 76px;
            box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
          }

          .kpi-label {
            display: flex;
            align-items: center;
            gap: 0.28rem;
            min-width: 0;
            color: #667085;
            font-size: 0.72rem;
            line-height: 1.12;
            font-weight: 760;
            text-transform: uppercase;
            letter-spacing: 0;
          }

          .kpi-help {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 auto;
            width: 16px;
            height: 16px;
            border-radius: 999px;
            border: 1px solid #cbd5e1;
            color: #475467;
            background: #f8fafc;
            font-size: 0.68rem;
            font-weight: 800;
            cursor: help;
          }

          .kpi-value {
            margin-top: 0.38rem;
            color: #18212f;
            font-size: 1.02rem;
            line-height: 1.12;
            font-weight: 820;
            overflow-wrap: anywhere;
          }

          .kpi-value.warning {
            color: #b34242;
          }

          .kpi-value.ok {
            color: #2e7d57;
          }
        </style>
        """,
        unsafe_allow_html=True,
    )


def kpi_card(label: str, value: str, help_text: str, status: str = "") -> str:
    status_class = f" {status}" if status else ""
    return (
        '<div class="kpi-card">'
        '<div class="kpi-label">'
        f"<span>{escape(label)}</span>"
        f'<span class="kpi-help" title="{escape(help_text)}">?</span>'
        "</div>"
        f'<div class="kpi-value{status_class}">{escape(value)}</div>'
        "</div>"
    )


def render_cockpit(result: dict) -> None:
    k = result["kpis"]
    st.subheader("Cockpit ejecutivo")
    cards = [
        kpi_card("EBITDA anual", fmt_mm(k["annual_ebitda"]), "Resultado operativo anual despues de costos comerciales, logisticos y de red.", "ok" if k["annual_ebitda"] >= 0 else "warning"),
        kpi_card("FCF anual", fmt_mm(k["annual_fcf"]), "FCF significa Free Cash Flow: flujo de caja libre disponible luego de operaciones, capital de trabajo y CAPEX.", "ok" if k["annual_fcf"] >= 0 else "warning"),
        kpi_card("Caja final", fmt_mm(k["ending_cash"]), "Caja estimada al final del horizonte de 12 meses.", "ok" if k["ending_cash"] >= 0 else "warning"),
        kpi_card("CAPEX usado", fmt_mm(k["capex_used"]), "CAPEX significa Capital Expenditure: inversion en aperturas, hubs, tecnologia o red.", "warning" if k["capex_used"] > 50000 else ""),
        kpi_card("DDI", f"{k['ddi']:.0f} dias", "DDI significa Dias de Inventario: cuantos dias de venta cubre el stock disponible."),
        kpi_card("Consistencia", f"{k['consistency_score']:.0f}/100", "Score pedagogico de coherencia entre foco estrategico, palancas y constraints.", "ok" if k["consistency_score"] >= 75 else "warning"),
        kpi_card("Revenue", fmt_mm(k["annual_revenue"]), "Ventas netas simuladas en el horizonte anual."),
        kpi_card("Margen bruto", fmt_pct(k["gross_margin"]), "Margen antes de costos operativos, logisticos, marketing y red."),
        kpi_card("Quiebres", fmt_pct(k["stockout_rate"]), "Estimacion simplificada de faltantes por baja cobertura o DDI agresivo.", "warning" if k["stockout_rate"] > 0.07 else ""),
        kpi_card("Costo logistico", fmt_pct(k["logistics_cost_rate"]), "Costo logistico como porcentaje de ventas, afectado por delivery, pick-up y hubs.", "warning" if k["logistics_cost_rate"] > 0.05 else ""),
        kpi_card("Churn", fmt_pct(k["churn_rate"]), "Churn es la tasa de clientes que se pierden en el periodo.", "warning" if k["churn_rate"] > 0.055 else ""),
    ]
    st.markdown(f"""<div class="kpi-grid">{''.join(cards)}</div>""", unsafe_allow_html=True)

    if result["alerts"]:
        st.error(" | ".join(result["alerts"]))
    else:
        st.success("Sin alertas criticas en esta iteracion.")


def render_system_context(scenario: Scenario, result: dict, baseline_result: dict) -> None:
    st.subheader("Lectura del sistema")
    tab_months, tab_categories, tab_baseline, tab_iterations, tab_map = st.tabs(
        [
            "Progresion 12 meses",
            "Categorias",
            "Baseline vs actual",
            "Iteraciones",
            "Mapa de decisiones",
        ]
    )

    with tab_months:
        monthly = result["monthly"]
        current_idx = max(0, min(11, scenario.current_month - 1))
        monthly_df = pd.DataFrame(
            {
                "Mes": monthly["month"],
                "Momento": [
                    "Estas aca" if index == current_idx else "" for index in range(len(monthly["month"]))
                ],
                "Revenue": monthly["revenue"],
                "EBITDA": monthly["ebitda"],
                "FCF": monthly["fcf"],
                "Caja": monthly["cash_balance"],
                "Capital trabajo": monthly["working_capital_release"],
                "CAPEX": monthly["capex"],
            }
        )
        st.caption(
            f"Estas leyendo {monthly['month'][current_idx]}. Este selector no avanza el juego: "
            "solo cambia el punto de lectura de la curva. Mover una palanca recalcula el plan completo de 12 meses."
        )
        st.markdown(
            "<div class=\"kpi-grid\">"
            + "".join(
                [
                    kpi_card("Revenue mes", fmt_mm(monthly["revenue"][current_idx]), "Ventas estimadas del mes seleccionado."),
                    kpi_card("EBITDA mes", fmt_mm(monthly["ebitda"][current_idx]), "Resultado operativo del mes seleccionado."),
                    kpi_card("FCF mes", fmt_mm(monthly["fcf"][current_idx]), "Flujo de caja libre del mes seleccionado.", "ok" if monthly["fcf"][current_idx] >= 0 else "warning"),
                    kpi_card("Caja acum.", fmt_mm(monthly["cash_balance"][current_idx]), "Caja acumulada hasta el mes seleccionado.", "ok" if monthly["cash_balance"][current_idx] >= 0 else "warning"),
                ]
            )
            + "</div>",
            unsafe_allow_html=True,
        )
        st.line_chart(
            monthly_df.set_index("Mes")[["Revenue", "EBITDA", "FCF", "Caja"]],
            height=260,
        )
        st.dataframe(
            monthly_df.assign(
                Revenue=monthly_df["Revenue"].map(fmt_mm),
                EBITDA=monthly_df["EBITDA"].map(fmt_mm),
                FCF=monthly_df["FCF"].map(fmt_mm),
                Caja=monthly_df["Caja"].map(fmt_mm),
                **{
                    "Capital trabajo": monthly_df["Capital trabajo"].map(fmt_mm),
                    "CAPEX": monthly_df["CAPEX"].map(fmt_mm),
                },
            ),
            use_container_width=True,
            hide_index=True,
        )

    with tab_categories:
        categories_df = pd.DataFrame(result["categories"])
        display_df = categories_df.assign(
            **{
                "Revenue anual": categories_df["Revenue anual"].map(fmt_mm),
                "Mix": categories_df["Mix"].map(fmt_pct),
                "Margen bruto": categories_df["Margen bruto"].map(fmt_pct),
                "Cobertura": categories_df["Cobertura"].map(fmt_pct),
                "Cambio PVP": categories_df["Cambio PVP"].map(fmt_delta_pct),
                "Impacto volumen": categories_df["Impacto volumen"].map(fmt_delta_pct),
                "Quiebres": categories_df["Quiebres"].map(fmt_pct),
            }
        )
        st.dataframe(display_df, use_container_width=True, hide_index=True)

    with tab_baseline:
        st.caption(
            "Compara el escenario actual contra un baseline neutral sin nuevas decisiones de inventario, pricing ni red. "
            "Sirve para ver si la jugada crea valor o solo mueve el problema de lugar."
        )
        st.dataframe(
            pd.DataFrame(comparison_rows(result, baseline_result)),
            use_container_width=True,
            hide_index=True,
        )

    with tab_iterations:
        files = list_scenarios(scenario.team_id)
        if not files:
            st.info("Todavia no hay iteraciones guardadas. Guarda la Jugada A, B y C para compararlas aca.")
        else:
            rows = []
            for path in files[:12]:
                payload = load_scenario(path)
                kpis = payload["results_snapshot"]["kpis"]
                rows.append(
                    {
                        "Archivo": path.name,
                        "Lab": payload["lab"],
                        "EBITDA": fmt_mm(kpis["annual_ebitda"]),
                        "FCF": fmt_mm(kpis["annual_fcf"]),
                        "Caja final": fmt_mm(kpis["ending_cash"]),
                        "CAPEX": fmt_mm(kpis["capex_used"]),
                        "Quiebres": fmt_pct(kpis["stockout_rate"]),
                        "Consistencia": f"{kpis['consistency_score']:.0f}/100",
                    }
                )
            st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)

    with tab_map:
        st.markdown(
            """
            **Como leer la perturbacion**

            Cada movimiento cambia varias cosas a la vez. Inventario mueve caja temprana y quiebres;
            pricing mueve margen y volumen; clientes mueve churn y marketing; digital mueve revenue y
            costo logistico; red mueve CAPEX, cobertura y costos fijos.
            """
        )
        st.dataframe(
            pd.DataFrame(
                [
                    ["Inventario", "DDI, cobertura, SKUs", "Caja M2-M4, quiebres, mix por categoria"],
                    ["Pricing", "PVP promedio, sensibles, premium", "Margen, volumen, revenue por categoria"],
                    ["Clientes", "Retencion, adquisicion", "Churn, marketing, FCF"],
                    ["Digital", "Delivery, pick-up, hubs", "Revenue, costo logistico, afinidad digital"],
                    ["Red", "Flagships, hubs, cierres", "CAPEX, caja, cobertura"],
                ],
                columns=["Tema", "Palancas", "Variables que se afectan"],
            ),
            use_container_width=True,
            hide_index=True,
        )


def render_lab_guide(lab: str) -> None:
    guide = LAB_GUIDES[lab]
    st.info(f"**{guide['title']}**  \n{guide['objective']}")
    cols = st.columns(2)
    with cols[0]:
        st.markdown("**Movidas disponibles**")
        for item in guide["moves"]:
            st.write(f"- {item}")
    with cols[1]:
        st.markdown("**Que mirar antes de guardar**")
        for item in guide["watch"]:
            st.write(f"- {item}")


def render_sidebar_hint(lab: str) -> None:
    guide = LAB_GUIDES[lab]
    st.sidebar.divider()
    st.sidebar.markdown("**Ahora**")
    st.sidebar.caption(guide["objective"])
    st.sidebar.markdown("**Mirar antes de guardar**")
    for item in guide["watch"]:
        st.sidebar.caption(f"- {item}")


def render_class_sequence() -> None:
    with st.sidebar.expander("Secuencia clase -> lab", expanded=False):
        for class_name, lab_name, purpose in CLASS_SEQUENCE:
            st.markdown(f"**{class_name}: {lab_name}**")
            st.caption(purpose)


def render_guided_plays(scenario: Scenario, lab: str) -> None:
    plays = GUIDED_PLAYS.get(lab)
    if not plays:
        return

    with st.expander("Guia de 3 jugadas para practicar", expanded=True):
        st.caption(
            "Usa estas jugadas como protocolo de aprendizaje. En cada una cambia solo las variables indicadas, "
            "mira el impacto y guarda la iteracion antes de pasar a la siguiente."
        )
        for play in plays:
            st.markdown(f"**{play['name']}**")
            st.write(play["intent"])
            cols = st.columns([1.05, 0.95, 1, 0.72])
            with cols[0]:
                st.markdown("**Sliders**")
                for item in play["sliders"]:
                    st.write(f"- {item}")
            with cols[1]:
                st.markdown("**Mirar**")
                st.write(play["watch"])
            with cols[2]:
                st.markdown("**Aprendizaje**")
                st.write(play["learning"])
            with cols[3]:
                st.markdown("**Accion**")
                if st.button(f"Aplicar {play['name'].split(' — ')[0]}", key=f"apply_{lab}_{play['name']}"):
                    apply_guided_play(scenario, lab, play)
                    st.rerun()


def render_feedback(feedback: dict) -> None:
    st.subheader("Feedback IA")
    st.caption("Modo actual: IA mockeada por reglas, sin llamadas a modelos ni costo variable.")
    st.write(feedback["diagnosis"])
    cols = st.columns(3)
    with cols[0]:
        st.markdown("**Riesgos**")
        for item in feedback["risks"]:
            st.write(f"- {item}")
    with cols[1]:
        st.markdown("**Recomendaciones**")
        for item in feedback["recommendations"]:
            st.write(f"- {item}")
    with cols[2]:
        st.markdown("**Preguntas Board**")
        for item in feedback["board_questions"]:
            st.write(f"- {item}")


def render_iteration_controls(lab: str, result: dict, feedback: dict) -> None:
    scenario: Scenario = st.session_state.scenario
    st.divider()
    st.caption(
        "Mover sliders recalcula el escenario. Guardar iteracion solo congela la jugada para compararla; "
        "no hace falta tocar todos los laboratorios en cada jugada."
    )
    cols = st.columns([1, 1, 2])
    with cols[0]:
        if st.button("Guardar iteracion", type="primary", use_container_width=True):
            path = save_scenario(
                scenario.team_id,
                lab,
                scenario.to_dict(),
                result,
                feedback,
            )
            st.session_state.saved_counts[lab] += 1
            scenario.iteration += 1
            st.session_state.last_saved_path = str(path)
            st.rerun()
    with cols[1]:
        if st.button("Nueva iteracion", use_container_width=True):
            scenario.iteration += 1
            st.rerun()
    with cols[2]:
        saved_count = st.session_state.saved_counts.get(lab, 0)
        if saved_count < 2 and lab not in {"diagnostico", "board"}:
            st.info(f"Sugerencia: guardar al menos 2 iteraciones antes de pasar de tema. Guardadas: {saved_count}.")
        elif st.session_state.last_saved_path:
            st.success(f"Ultima jugada guardada: {st.session_state.last_saved_path}")


def render_diagnosis(scenario: Scenario) -> None:
    st.header("Diagnostico inicial")
    st.write("Definan una hipotesis de turnaround antes de mover palancas.")
    scenario.strategic_focus = st.selectbox(
        "Foco estrategico",
        options=list(FOCUS_OPTIONS.keys()),
        format_func=lambda key: FOCUS_OPTIONS[key],
        index=list(FOCUS_OPTIONS.keys()).index(scenario.strategic_focus),
        key="strategic_focus",
        help="El foco se usa para evaluar consistencia entre lo que el equipo declara y las decisiones que toma.",
    )
    scenario.notes = st.text_area(
        "Hipotesis del equipo",
        value=scenario.notes,
        placeholder="Ejemplo: priorizar caja en los primeros 100 dias sin abandonar categorias premium.",
        height=120,
    )


def render_inventory(scenario: Scenario) -> None:
    st.header("Laboratorio 1: Inventario y capital de trabajo")
    st.write("Objetivo: liberar caja sin romper disponibilidad.")
    decisions = scenario.decisions["inventory"]
    c1, c2, c3 = st.columns(3)
    decisions["coverage_pct"] = c1.slider(
        "Cobertura %",
        0.70,
        1.00,
        float(decisions["coverage_pct"]),
        0.01,
        key="inventory_coverage_pct",
        help="Porcentaje de surtido/categorias cubiertas. Menor cobertura puede liberar complejidad, pero aumenta riesgo de quiebre.",
    )
    decisions["sku_reduction_pct"] = c2.slider(
        "Reduccion SKUs %",
        0.00,
        0.35,
        float(decisions["sku_reduction_pct"]),
        0.01,
        key="inventory_sku_reduction_pct",
        help="SKU significa Stock Keeping Unit: unidad individual de surtido. Reducir SKUs simplifica inventario, pero puede afectar ventas.",
    )
    decisions["ddi_target"] = c3.slider(
        "DDI objetivo",
        35,
        80,
        int(decisions["ddi_target"]),
        1,
        key="inventory_ddi_target",
        help="DDI significa Dias de Inventario. Bajar DDI libera caja, pero puede aumentar quiebres.",
    )
    st.markdown("**Ajuste por categoria**")
    st.caption("Estos sliders mueven cobertura relativa a la cobertura base. Ejemplo: -5 pp en OTC significa menos stock/variedad en esa categoria que en el promedio.")
    category_delta = decisions["category_coverage_delta"]
    category_cols = st.columns(2)
    for index, category in enumerate(CATEGORY_BASELINE):
        container = category_cols[index % 2]
        name = category["name"]
        category_delta[name] = container.slider(
            name,
            -0.20,
            0.15,
            float(category_delta.get(name, 0.0)),
            0.01,
            key=f"inventory_category_delta_{CATEGORY_SLUGS[name]}",
            help=f"{category['role']} El valor ajusta la cobertura de esta categoria contra la cobertura base.",
        )


def render_pricing(scenario: Scenario) -> None:
    st.header("Laboratorio 2: Pricing y elasticidad")
    st.write("Objetivo: mejorar margen y competitividad sin destruir volumen.")
    decisions = scenario.decisions["pricing"]
    c1, c2, c3 = st.columns(3)
    decisions["avg_pvp_change_pct"] = c1.slider(
        "Cambio PVP promedio",
        -0.15,
        0.20,
        float(decisions["avg_pvp_change_pct"]),
        0.01,
        key="pricing_avg_pvp_change_pct",
        help="PVP significa Precio de Venta al Publico. Es el precio final que ve el consumidor.",
    )
    decisions["sensitive_category_change_pct"] = c2.slider(
        "Cambio PVP categorias sensibles",
        -0.20,
        0.20,
        float(decisions["sensitive_category_change_pct"]),
        0.01,
        key="pricing_sensitive_category_change_pct",
        help="Categorias con mayor elasticidad: pequenos cambios de PVP pueden mover mucho el volumen.",
    )
    decisions["premium_category_change_pct"] = c3.slider(
        "Cambio PVP categorias premium",
        -0.10,
        0.25,
        float(decisions["premium_category_change_pct"]),
        0.01,
        key="pricing_premium_category_change_pct",
        help="Categorias de mayor margen o experiencia, como dermocosmetica.",
    )


def render_customer(scenario: Scenario) -> None:
    st.header("Laboratorio 3: Clientes y marketing")
    st.write("Objetivo: proteger clientes rentables y crecer sin quemar caja.")
    decisions = scenario.decisions["customer"]
    c1, c2, c3, c4 = st.columns(4)
    decisions["vip_retention_focus"] = c1.slider(
        "Foco retencion VIPs",
        0.0,
        1.0,
        float(decisions["vip_retention_focus"]),
        0.05,
        key="customer_vip_retention_focus",
        help="VIPs son clientes de alto valor, mayor ticket y frecuencia.",
    )
    decisions["at_risk_retention_focus"] = c2.slider(
        "Foco retencion riesgo fuga",
        0.0,
        1.0,
        float(decisions["at_risk_retention_focus"]),
        0.05,
        key="customer_at_risk_retention_focus",
        help="Clientes con probabilidad alta de churn o abandono.",
    )
    decisions["opportunistic_retention_focus"] = c3.slider(
        "Foco oportunistas",
        0.0,
        1.0,
        float(decisions["opportunistic_retention_focus"]),
        0.05,
        key="customer_opportunistic_retention_focus",
        help="Clientes mas sensibles a promociones, con menor lealtad.",
    )
    decisions["new_customers_monthly"] = c4.number_input(
        "Nuevos clientes/mes",
        min_value=0,
        max_value=250000,
        value=int(decisions["new_customers_monthly"]),
        step=5000,
        key="customer_new_customers_monthly",
        help="Clientes adquiridos por mes. Crecen ventas, pero exigen CAC.",
    )


def render_digital(scenario: Scenario) -> None:
    st.header("Laboratorio 4: Digital, fulfillment y cost-to-serve")
    st.write("Objetivo: crecer conveniencia omnicanal sin destruir margen logistico.")
    decisions = scenario.decisions["digital"]
    c1, c2, c3 = st.columns(3)
    decisions["delivery_mix"] = c1.slider(
        "Mix delivery",
        0.00,
        0.25,
        float(decisions["delivery_mix"]),
        0.01,
        key="digital_delivery_mix",
        help="Porcentaje de ventas atendidas por delivery. Mejora conveniencia, pero suele tener mayor costo logistico.",
    )
    decisions["pickup_mix"] = c2.slider(
        "Mix pick-up",
        0.00,
        0.25,
        float(decisions["pickup_mix"]),
        0.01,
        key="digital_pickup_mix",
        help="Pick-up: compra digital con retiro en tienda. Balancea conveniencia y costo.",
    )
    decisions["hub_push"] = c3.slider(
        "Push hubs/dark stores",
        0.00,
        0.20,
        float(decisions["hub_push"]),
        0.01,
        key="digital_hub_push",
        help="Intensidad operativa de hubs/dark stores para mejorar fulfillment y SLA.",
    )


def render_network(scenario: Scenario) -> None:
    st.header("Laboratorio 5: Red de PDV y CAPEX")
    st.write("Objetivo: redisenar la red sin exceder CAPEX ni destruir cobertura.")
    decisions = scenario.decisions["network"]
    c1, c2, c3 = st.columns(3)
    decisions["flagship_openings"] = c1.number_input(
        "Aperturas flagship",
        min_value=0,
        max_value=12,
        value=int(decisions["flagship_openings"]),
        step=1,
        key="network_flagship_openings",
        help="Flagship: tienda grande de alto impacto comercial y experiencia, con CAPEX alto.",
    )
    decisions["hub_openings"] = c2.number_input(
        "Aperturas hubs/dark stores",
        min_value=0,
        max_value=16,
        value=int(decisions["hub_openings"]),
        step=1,
        key="network_hub_openings",
        help="Hubs/dark stores: nodos operativos para preparar pedidos digitales y mejorar SLA.",
    )
    decisions["proximity_closures"] = c3.number_input(
        "Cierres proximidad",
        min_value=0,
        max_value=28,
        value=int(decisions["proximity_closures"]),
        step=1,
        key="network_proximity_closures",
        help="Cierre de tiendas de menor escala. Puede ahorrar costos, pero afecta cobertura y conveniencia.",
    )


def render_board(scenario: Scenario, result: dict) -> None:
    st.header("Board Meeting final")
    st.write("Revisen el escenario integral y preparen la defensa ejecutiva.")
    k = result["kpis"]
    summary = pd.DataFrame(
        [
            ["EBITDA anual", fmt_mm(k["annual_ebitda"])],
            ["FCF anual", fmt_mm(k["annual_fcf"])],
            ["Caja final", fmt_mm(k["ending_cash"])],
            ["CAPEX usado", fmt_mm(k["capex_used"])],
            ["Consistencia", f"{k['consistency_score']:.0f}/100"],
        ],
        columns=["Variable", "Resultado"],
    )
    st.dataframe(summary, use_container_width=True, hide_index=True)
    st.text_area(
        "Defensa de trade-offs",
        placeholder="Que decidieron hacer, que decidieron no hacer y por que?",
        height=140,
        help="La defensa deberia explicar renuncias explicitas, no solo resultados.",
    )


def render_saved_scenarios(team_id: str) -> None:
    with st.sidebar.expander("Jugadas guardadas", expanded=False):
        files = list_scenarios(team_id)
        if not files:
            st.caption("Todavia no hay jugadas guardadas para este equipo.")
            return
        options = {item.name: item for item in files}
        selected = st.selectbox("Archivo", list(options.keys()))
        if st.button("Cargar jugada", use_container_width=True):
            payload = load_scenario(options[selected])
            st.session_state.scenario = Scenario.from_dict(payload["scenario"])
            ensure_scenario_defaults(st.session_state.scenario)
            st.rerun()


def main() -> None:
    st.set_page_config(
        page_title="PharmaLink 360",
        page_icon="",
        layout="wide",
        initial_sidebar_state="expanded",
    )
    inject_css()
    ensure_state()
    scenario: Scenario = st.session_state.scenario

    st.sidebar.title("PharmaLink 360")
    scenario.team_id = st.sidebar.text_input(
        "Equipo",
        value=scenario.team_id,
        help="Identificador usado para guardar jugadas en data/scenarios/<equipo>/.",
    )
    scenario.name = st.sidebar.text_input("Nombre del escenario", value=scenario.name)
    lab_keys = [key for key, _ in LABS]
    lab_labels = {key: label for key, label in LABS}
    selected_lab = st.sidebar.radio(
        "Laboratorio",
        options=lab_keys,
        format_func=lambda key: lab_labels[key],
        index=lab_keys.index(scenario.current_lab),
        help="La experiencia pedagogica sugerida es avanzar en orden y guardar 2 iteraciones por laboratorio.",
    )
    scenario.current_lab = selected_lab
    scenario.current_month = st.sidebar.slider(
        "Mes de lectura",
        1,
        12,
        int(getattr(scenario, "current_month", 1)),
        1,
        help="No cambia la jugada. Solo cambia donde mirar la curva mensual para entender timing de caja, CAPEX e impactos.",
    )
    st.sidebar.caption(f"Iteracion actual: {scenario.iteration}")
    render_sidebar_hint(selected_lab)
    render_class_sequence()
    render_saved_scenarios(scenario.team_id)
    sync_scenario_from_widgets(scenario)

    st.title("Simulador ejecutivo PharmaLink 360")
    st.caption("MVP para iterar interfaz, laboratorios y persistencia de jugadas.")

    result = simulate(scenario)
    baseline_result = simulate(neutral_baseline(scenario.current_month))
    feedback = advisor_feedback(scenario, result)
    render_cockpit(result)
    render_system_context(scenario, result, baseline_result)
    st.divider()
    render_lab_guide(selected_lab)
    render_guided_plays(scenario, selected_lab)

    if selected_lab == "diagnostico":
        render_diagnosis(scenario)
    elif selected_lab == "inventory":
        render_inventory(scenario)
    elif selected_lab == "pricing":
        render_pricing(scenario)
    elif selected_lab == "customer":
        render_customer(scenario)
    elif selected_lab == "digital":
        render_digital(scenario)
    elif selected_lab == "network":
        render_network(scenario)
    elif selected_lab == "board":
        render_board(scenario, result)

    result = simulate(scenario)
    feedback = advisor_feedback(scenario, result)
    st.divider()
    render_feedback(feedback)
    render_iteration_controls(selected_lab, result, feedback)


if __name__ == "__main__":
    main()
