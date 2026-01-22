# Repository Guidelines

## Project Structure & Modules

- `src/extension.ts`: activation, editor decorations, and the `veil.toggle` command wiring.
- `src/utils/fileMatcher.ts` and `patternProvider.ts`: file targeting and masking pattern definitions; add new regexes here.
- `src/test/*.test.ts`: Mocha-style tests run via the VS Code harness; `out/` holds compiled test output.
- Build outputs and configs: `dist/` (bundled extension), `esbuild.js` (build pipeline), `tsconfig.json` (strict TS), `eslint.config.mjs` (lint rules).

## Build, Test & Development Commands

- `pnpm install`: install dependencies (pnpm preferred; lockfiles are present).
- `pnpm compile`: typecheck, lint, and bundle to `dist/`.
- `pnpm watch`: parallel esbuild and TypeScript watch for fast iteration.
- `pnpm lint`: ESLint over `src`.
- `pnpm format`: Prettier formatting across the repo.
- `pnpm test`: runs the VS Code extension tests (pretest compiles and lints first).
- `pnpm package`: production build suitable for publishing.

## Coding Style & Naming

- TypeScript with strict settings; ES2022/Node16 module target.
- Prettier handles layout—run `pnpm format` instead of hand-tuning spacing.
- ESLint enforces `curly`, `eqeqeq`, `no-throw-literal`, `semi`, and import naming (`camelCase`/`PascalCase`).
- Keep `extension.ts` slim; push helpers into `src/utils`. Group new masking patterns logically in `patternProvider`.

## Testing Guidelines

- Tests live beside code in `src/test` with `.test.ts` suffix.
- Use `pnpm test` for full runs; `pnpm watch-tests` to emit to `out/` while iterating.
- Add regression cases near the touched area; cover new patterns and file-matching edges. Keep fixtures minimal and readable.

## Commit & PR Guidelines

- Use conventional commits (`type(scope): subject`), e.g., `fix(extension): handle multiple editors`.
- Keep commits focused; avoid mixing refactors with behavior changes.
- PRs should include a brief summary, linked issue if any, and test commands run. Add before/after notes or screenshots when masking behavior is user-visible in VS Code.
- Mention any new file patterns or opt-out behaviors introduced.

## Security & Configuration Tips

- Never log sensitive file contents; logging should stay at file/line counts or toggle states.
- Masking must remain non-destructive (decorations only). Respect `# veil: off` opt-outs in any new logic paths.
