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

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

- Workflow: `.github/workflows/pages.yml`
- Vite `base` is derived from the repo name in CI (`GITHUB_REPOSITORY`), so assets resolve under `/<repo>/` on GitHub Pages and on custom domains that use the same path.

## Puzzle Data

`data/puzzles.json` contains:

- static board dimensions and fixed blocked cells
- month/day/weekday coordinate mapping
- pentomino piece IDs

See `docs/puzzle-data-format.md` for coordinate conventions and date mapping.
