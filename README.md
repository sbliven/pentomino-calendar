# Calendar Pentomino Hint App

Static TypeScript + Vite web app that solves a daily 9x6 pentomino calendar puzzle in the browser using npm `dlx`.

## Features

- Date picker defaults to today.
- Runtime exact-cover solve in the browser.
- Three hint levels:
  - one piece
  - two pieces
  - full solution
- Reset button to hide hints.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

- Workflow: `.github/workflows/pages.yml`
- Vite base path is set in `vite.config.ts`.
- For a repository named `calendar_puzzle`, the site is deployed from `dist`.

## Puzzle Data

`data/puzzles.json` contains:

- static board dimensions and fixed blocked cells
- month/day/weekday coordinate mapping
- pentomino piece IDs

See `docs/puzzle-data-format.md` for coordinate conventions and date mapping.
