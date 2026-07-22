# 02 — Discurso de campaña: frecuencia, detalle y credibilidad %

## Dimensiones (no confundir)

| Dimensión | Qué mide | Tipo |
|-----------|----------|------|
| Frecuencia | Veces mencionado | entero (`n_menciones`) |
| Especificidad | ¿Dice *cómo*? | 0–100 |
| Credibilidad % | Score auditable del relato | 0–100 + desglose |
| Importancia | Impacto si se ejecutara | alta/media/baja/N/D |
| Factibilidad | Capacidad real | alta/media/baja/N/D |
| Función retórica | votos / agenda / ambiguedad | enum |
| Discurso identidad | Eje del candidato | boolean |

**Credibilidad ≠ probabilidad de cumplimiento.** Factibilidad se evalúa aparte con mapa de poder ([04-investigar.md](./04-investigar.md)).

## Ejemplo guía

- Decir mil veces “voy a crear empleos” sin plan → alta frecuencia, **baja** especificidad → credibilidad limitada.
- Decirlo una vez con equipo, plan, plazos y fuente de recursos → **mayor** credibilidad aunque `n_menciones = 1`.
- Si además es el **discurso identidad** de campaña → máxima centralidad.

## Fórmula (obligatoria; recalcular en n8n WF-D)

```
credibilidad = clamp(0, 100,
  0.45 * especificidad
+ 0.25 * repeticion_norm
+ 0.30 * centralidad
)
```

### Especificidad (peso 45%) — checklist con evidencia

Cada ítem **solo suma si hay cita + URL** en menciones/evidencias:

| Ítem | Puntos |
|------|--------|
| Plan / mecanismo | +25 |
| Responsables / equipo | +20 |
| Plazos / hitos | +15 |
| Recursos / fuente de plata | +20 |
| Métricas de éxito | +10 |
| Contraste con status quo | +10 |

Cap en 100. Sin evidencia → ese ítem no suma.

### Repetición normalizada (peso 25%)

Escala log (aprox.):

| n_menciones | repeticion_norm |
|-------------|-----------------|
| 1 | 20 |
| 3 | 40 |
| 10 | 70 |
| 30+ | 100 |

Fórmula práctica: `min(100, round(20 * log10(n_menciones) / log10(30) * 5))` o tabla anterior. El spam no debe dominar al detalle.

Implementación de referencia en `src/credibilidad.ts` (web) / lógica equivalente en n8n Code node.

### Centralidad (peso 30%)

| Situación | Valor |
|-----------|-------|
| `discurso_identidad = true` | 100 |
| Tema de cierre recurrente | 70 |
| Mención lateral | 20 |
| Periférica única | 10 |

## Alertas

1. Alta frecuencia + baja especificidad → ruido vacío.
2. Baja frecuencia + alta especificidad → no ignorar.
3. `discurso_identidad` → siempre en home.
4. Alta credibilidad + baja factibilidad → relato fuerte, ejecución difícil.
5. Campos `N/D` → gap en `/gaps`.

## Guardar siempre

```json
"credibilidad_desglose": {
  "especificidad": 0,
  "repeticion_norm": 0,
  "centralidad": 0
}
```
