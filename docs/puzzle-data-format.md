# Puzzle Data Format

`data/puzzles.json` defines the static calendar-board mapping.

## Fields

- `board.width`, `board.height`: board dimensions (must be `9` x `6`).
- `board.fixedBlocked`: cells always unavailable.
- `board.monthCells`: 12 coordinates, one cell per month index (`month - 1`).
- `board.dayCells`: 31 coordinates, one cell per day index (`day - 1`).
- `board.weekdayCells`: 7 coordinates, one cell per weekday (`Date.getDay()`).
- `months`, `weekdays`: display labels for UI.
- `pieces`: pentomino identifiers used by the solver.

## Coordinate Convention

- Every coordinate is `[x, y]`.
- `x` grows left-to-right from `0` to `8`.
- `y` grows top-to-bottom from `0` to `5`.

## Date Mapping

For a selected date, the app marks these as blocked:

1. `fixedBlocked`
2. `monthCells[month - 1]`
3. `dayCells[day - 1]`
4. `weekdayCells[weekday]`

All remaining cells are exact-cover targets for 10 pentominoes.
