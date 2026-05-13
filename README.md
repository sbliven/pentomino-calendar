# Pentomino Calendar Solver

## The Puzzle

This is a web-based solver for the puzzle [Calendarium](https://www.twistypuzzles.com/forum/viewtopic.php?t=39609) by Dmitry Andreev (Pluton). The original version was in [Russian](https://collectionerus.ru/collections/pp/178/), while english variants are available from sources like [Puzzle Guy](https://puzzleguy.store/products/calendar-puzzle-each-day-a-new-challenge).

The goal of the puzzle is to arrange 10 pentomino tiles in such a way that they cover all squares except for today's month, day, and weekday. There is one problem with this: _finding a solution is incredibly hard_. And, you know, some mornings I just to complete a calendar before my coffee is finished.

This website can provide hints in the form of one or two pieces, or display the full solution.


## Features

Static TypeScript + Vite web app that solves a daily 9x6 pentomino calendar puzzle in the browser using npm `dlx`.

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
