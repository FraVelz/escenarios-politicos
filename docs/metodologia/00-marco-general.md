# Marco general — cualquier país

Pipeline fijo para analizar un acto o transición política. No produce certezas; produce **escenarios revisables**.

## Pasos

### 1. Definir el acto

- ¿Qué ocurrió o está ocurriendo? (elección, posesión, decreto, crisis, reforma, ruptura de coalición)
- Fecha y horizonte de análisis: **30 / 90 / 365 días**
- Qué se pregunta exactamente (economía, seguridad, instituciones, exterior)

### 2. Mapa de poder

Listar actores y capacidad real:

| Actor | Quién / composición | Capacidad vs el acto |
|-------|---------------------|----------------------|
| Ejecutivo | | |
| Congreso / parlamento | | |
| Cortes / constitucional | | |
| Banca central | | |
| FFAA / policía | | |
| Gobiernos subnacionales | | |
| Actores económicos clave | | |
| Actores externos (si aplica) | | |

### 3. Promesas vs capacidad

- Promesas o agenda pública del actor dominante
- Votos / coaliciones disponibles
- Espacio fiscal y calendario legislativo
- Restricciones institucionales (constitución, tratados, independencia del banco central)

### 4. Indicadores baseline

Tomar valores **citados** (fecha + fuente). Ver [01-fuentes-e-indicadores.md](./01-fuentes-e-indicadores.md).

Mínimo deseable: FX, inflación, riesgo/país o proxy, seguridad (homicidios u otro), inversión/IED o proxy, aprobación (si existe encuesta seria).

### 5. Tres escenarios

Usar la plantilla en [02-plantilla-escenarios.md](./02-plantilla-escenarios.md):

1. **Base** — trayectoria más plausible con la información actual
2. **Optimista** — mejora relativa bajo condiciones explícitas
3. **Pesimista** — deterioro bajo condiciones explícitas

Cada uno con **señales de confirmación** e **invalidación**.

### 6. Límites

Declarar qué **no** se puede afirmar (guerra externa, choques de commodities, salud del presidente, etc.).

## Salida

Carpeta `outputs/<pais>-<YYYY-MM-DD>/` con al menos:

- `informe.md` — análisis completo
- `datos.md` — tabla de indicadores y rutas a CSV en `data/processed/`
