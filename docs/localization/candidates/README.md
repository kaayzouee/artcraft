# Upstream localization candidates

These files are **staging drafts**, not runtime inputs to this ArtCraft fork.

- `vi/artcraft.tsv` is intended for submission to `storytold/craft-i18n/locales/vi/artcraft.tsv` once the maintainers confirm the contribution path and PR #2520's catalog integration is ready.
- It follows the three-column TSV format in `craft-i18n/docs/catalog-format.md`.
- Shared rows should remain in `locales/vi/common.tsv`; this candidate omits unchanged translations already present in that shared file.
- The current upstream PR #2520 only offers locales with an `artcraft.tsv` file in the external `CRAFT_I18N_DIR`. Keeping this file here does not enable Vietnamese in a build.
- Do not copy the prototype TypeScript TSV parser/runtime from the older `feat/vietnamese-localization-foundation` branch into the upstream PR. The upstream implementation uses `@storyteller/i18n` (i18next) and its `craftI18n` Vite plugin.

Before submission, run the shared catalog checker from a `craft-i18n` checkout and have the Vietnamese wording reviewed in context.
