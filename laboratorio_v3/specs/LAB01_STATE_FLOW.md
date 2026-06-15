# LAB01 State Flow

## Estados mock

- `state_v0`: workbook inicial descargado.
- `state_v0_explored`: checkpoint de exploración enviado.
- `state_v1_portfolio`: checkpoint de portfolio enviado.
- `state_v2_pricing`: checkpoint de pricing enviado.
- `state_v3_forecast`: checkpoint de forecast enviado.
- `state_v4_inventory`: checkpoint de inventario enviado.
- `state_final_plan`: plan final enviado.

## Desbloqueo

En modo normal, cada ejercicio se habilita cuando el estado requerido fue alcanzado.
En modo demo, todos los ejercicios se pueden abrir para probar la experiencia.

## Persistencia Fase 0

Usar `localStorage`:

- `nexus.lab01.checkpoints`
- `nexus.lab01.demoMode`
- `nexus.scoreboards`
