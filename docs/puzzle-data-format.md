# Puzzle Data Format

`data/puzzles.json` defines the static calendar-board mapping.

## Fields

- `board.width`, `board.height`: board dimensions (must be `9` x `6`).
- `board.fixedBlocked`, `board.blanks`, `board.monthCells`, `board.dayCells`, and `board.weekdayCells` together must list **every** board cell **exactly once** (full partition).
- `board.fixedBlocked`: cells always unavailable for packing.
- `board.blanks`: cells reserved as “blank” in the physical layout metadata; they are **playable** for the solver (pieces may cover them).
- `board.monthCells`: 12 coordinates, one cell per month index (`month - 1`).
- `board.dayCells`: 31 coordinates, one cell per day index (`day - 1`).
- `board.weekdayCells`: 7 coordinates, one cell per weekday (`Date.getDay()`).
- `months`, `weekdays`, `days`: display labels for UI.
- `pieces`: pentomino identifiers used by the solver.

## Coordinate Convention

- Every coordinate is `[x, y]`.
- `x` grows left-to-right from `0` to `8`.
- `y` grows top-to-bottom from `0` to `5`.

## Date Mapping

For a selected date, the solver treats these as **blocked** (non-playable):

1. `fixedBlocked`
2. `monthCells[month - 1]`
3. `dayCells[day - 1]`
4. `weekdayCells[weekday]`

`blanks` are **not** blocked for solving; they are included in the playable region together with all other non-blocked cells.

All playable cells are exact-cover targets for 10 pentominoes.
