# Fuentes e indicadores

## Principios

- Preferir fuentes **oficiales o de datos abiertos** antes que redes sociales.
- Toda cifra lleva **fecha** y **URL o nombre de dataset**.
- Si no hay dato, escribir `N/D` — no inventar.

## Indicadores sugeridos (cualquier país)

| Código mental | Qué mide | Fuentes típicas |
|---------------|----------|-----------------|
| FX | Tipo de cambio / presión cambiaria | Banco central, Yahoo Finance, trading públicos |
| Inflación | IPC anual o mensual | Instituto de estadística, World Bank `FP.CPI.TOTL.ZG` |
| Crecimiento | PIB real (% anual) | World Bank `NY.GDP.MKTP.KD.ZG` |
| Empleo | Desempleo | World Bank `SL.UEM.TOTL.ZS`, instituto local |
| Riesgo | Spreads, CDS, rating (si hay) | Mercados, agencias (con cuidado de paywall) |
| Seguridad | Homicidios / indicadores oficiales | Policía, ministerio, ONU |
| Inversión | IED o formación bruta de capital | World Bank, banco central |
| Aprobación | Encuestas de gobierno | Firmas con metodología pública |

## APIs útiles en este repo (v1)

- **World Bank API** — sin key: script `escenarios.fetch_world_bank`
- `.env` opcional para FRED u otras (ver `.env.example`); no obligatorio

## Cómo guardar

1. Crudo: `data/raw/<fuente>-<fecha>.json` o `.csv`
2. Resumen: `data/processed/<pais>-indicadores.csv`
3. Referencia en el informe: sección **Fuentes** + `datos.md`

## Medios y documentos políticos

- Programas de gobierno, discursos, decretos, gacetas oficiales
- Resultado electoral / composición legislativa (autoridad electoral)
- Contraste: al menos **dos** medios o think tanks de línea distinta cuando el tema sea polarizado
