# Autocommit — escenarios-politicos

Use when the user asks to **make a commit**. **Do not** push unless explicitly requested.

## Commit language

**All commit messages must be in English** (Conventional Commits). Never use Spanish for subject or body.

## Forbidden (Cursor co-author)

Follow [`.cursor/rules/git-commits.mdc`](../rules/git-commits.mdc): no `Co-authored-by: Cursor`, commit with `-F`, verify with `git log -1 --format=%B` before push.

## Before committing

1. `git status` / `git diff` / `git log -12 --oneline`
2. Respect deletions: do not restore deleted files unless asked.
3. Do not include `.env`, secrets, or sensitive data.

## Message style

Conventional Commits in **English**:

```text
feat: scaffold methodology and scenario scripts
docs: update Colombia brief
fix: validate required report sections
```

Types: `feat`, `docs`, `fix`, `chore`, `refactor`.

## Commit

```bash
printf '%s\n' "message" > /tmp/commit-msg.txt
git commit -F /tmp/commit-msg.txt
git log -1 --format=%B
```
