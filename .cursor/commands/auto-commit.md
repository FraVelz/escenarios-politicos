# Autocommit — escenarios-politicos

Usar cuando el usuario pida **hacer commit**. **No** push salvo petición explícita.

## Prohibido (co-autor Cursor)

Cumplir [`.cursor/rules/git-commits.mdc`](../rules/git-commits.mdc): sin `Co-authored-by: Cursor`, commit con `-F`, verificar con `git log -1 --format=%B` antes de push.

## Antes de commitear

1. `git status` / `git diff` / `git log -12 --oneline`
2. Respetar borrados: no restaurar archivos eliminados salvo petición.
3. No incluir `.env`, secretos ni datos sensibles.

## Estilo de mensaje

Conventional Commits en español o inglés claro:

```text
feat: scaffold metodología y scripts de escenarios
docs: actualizar brief de Colombia
fix: validar secciones obligatorias del informe
```

Tipos: `feat`, `docs`, `fix`, `chore`, `refactor`.

## Commit

```bash
printf '%s\n' "mensaje" > /tmp/commit-msg.txt
git commit -F /tmp/commit-msg.txt
git log -1 --format=%B
```
