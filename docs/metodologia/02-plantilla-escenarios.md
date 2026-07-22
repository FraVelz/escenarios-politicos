# Plantilla de informe de escenarios

Copiar a `outputs/<pais>-<YYYY-MM-DD>/informe.md` (o usar `python -m escenarios.build_skeleton`).

---

```markdown
# Informe de escenarios — <País>

- **Fecha del informe:** YYYY-MM-DD
- **Acto analizado:** …
- **Horizontes:** 30 / 90 / 365 días
- **Pregunta central:** …

## 1. Resumen ejecutivo

3–6 viñetas. Sin porcentajes inventados.

## 2. Acto y contexto

Qué ocurrió, cuándo, y por qué importa ahora.

## 3. Mapa de poder

Tabla o lista: ejecutivo, congreso, cortes, banca central, FFAA, subnacionales, externos.

## 4. Promesas vs capacidad

Agenda vs votos, caja fiscal, calendario, restricciones.

## 5. Indicadores baseline

| Indicador | Valor | Fecha | Fuente |
|-----------|-------|-------|--------|
| … | … | … | … |

Detalle en `datos.md`.

## 6. Escenarios

### 6.1 Base

- Narrativa (90/365 días):
- Condiciones implícitas:
- **Señales de confirmación:**
- **Señales de invalidación:**

### 6.2 Optimista

- Narrativa:
- Condiciones necesarias:
- **Señales de confirmación:**
- **Señales de invalidación:**

### 6.3 Pesimista

- Narrativa:
- Condiciones de riesgo:
- **Señales de confirmación:**
- **Señales de invalidación:**

## 7. Señales a monitorear (próximas 2–4 semanas)

Lista corta y accionable (nombramientos, votos clave, FX, protestas, etc.).

## 8. Fuentes

Enlaces o referencias con fecha de acceso.

## 9. Límites

Qué no se puede afirmar con la evidencia actual.
```

## Secciones obligatorias para `validate_report`

El validador exige encabezados que contengan (case-insensitive):

- `Escenarios`
- `Señales`
- `Fuentes`
- `Límites`
