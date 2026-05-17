from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


SCENARIO_ROOT = Path(__file__).resolve().parents[2] / "data" / "scenarios"


def team_dir(team_id: str) -> Path:
    safe_team_id = "".join(ch for ch in team_id.strip().lower() if ch.isalnum() or ch in "-_")
    path = SCENARIO_ROOT / (safe_team_id or "team-01")
    path.mkdir(parents=True, exist_ok=True)
    return path


def list_scenarios(team_id: str) -> list[Path]:
    path = team_dir(team_id)
    return sorted(path.glob("*.json"), key=lambda item: item.stat().st_mtime, reverse=True)


def save_scenario(
    team_id: str,
    lab: str,
    scenario: dict[str, Any],
    result: dict[str, Any],
    feedback: dict[str, Any],
) -> Path:
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    iteration = scenario.get("iteration", 1)
    filename = f"{timestamp}-{lab}-iter-{iteration}.json"
    payload = {
        "saved_at": timestamp,
        "team_id": team_id,
        "lab": lab,
        "scenario": scenario,
        "results_snapshot": result,
        "ai_feedback": feedback,
    }
    output_path = team_dir(team_id) / filename
    output_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return output_path


def load_scenario(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))

