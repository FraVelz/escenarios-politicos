# Fuentes — Colombia

Lista de partida. El agente debe verificar URLs y añadir fecha de acceso en el informe.

## Oficiales / datos

| Fuente | Uso |
|--------|-----|
| [Presidencia de la República](https://www.presidencia.gov.co/) | Agenda, comunicados |
| [Congreso de la República](https://www.congreso.gov.co/) | Proyectos, votaciones |
| [Registraduría Nacional](https://www.registraduria.gov.co/) | Electoral |
| [Banco de la República](https://www.banrep.gov.co/) | Política monetaria, FX, estudios |
| [DANE](https://www.dane.gov.co/) | IPC, empleo, cuentas |
| [Ministerio de Hacienda](https://www.minhacienda.gov.co/) | Fiscal, Marco Fiscal |
| [DIAN](https://www.dian.gov.co/) | Recaudo (si aplica) |
| [Corte Constitucional](https://www.corteconstitucional.gov.co/) | Sentencias relevantes al acto |

## Datos abiertos internacionales

| Fuente | Uso |
|--------|-----|
| [World Bank Open Data](https://data.worldbank.org/) / API | Inflación, PIB, desempleo (`COL`) |
| Script del repo | `python -m escenarios.fetch_world_bank --country COL` |

## Medios / análisis (contrastar ≥2 líneas)

- El Tiempo, El Espectador, La Silla Vacía, Portafolio, Bloomberg Línea (o equivalentes vigentes)
- Think tanks o centros con metodología pública cuando se citen proyecciones

## Seguridad / orden público

- Preferir series oficiales (Policía, MinDefensa, Fiscalía) sobre cifras virales sin metodología.

## Checklist de calidad

- [ ] Toda cifra con fecha y URL
- [ ] Al menos una fuente oficial + una de datos (DANE/Banrep/World Bank)
- [ ] Contraste de lectura política si el tema está polarizado
