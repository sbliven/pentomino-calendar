import type { Coord, DateKey, PuzzleConfig } from "../types";

export function coordKey([x, y]: Coord): string {
  return `${x},${y}`;
}

/** Cells that cannot contain pentominoes for this date (fixed holes + active month/day/weekday slots). */
export function getBlockedCells(config: PuzzleConfig, date: DateKey): Set<string> {
  const blocked = new Set<string>(config.board.fixedBlocked.map(coordKey));
  blocked.add(coordKey(config.board.monthCells[date.month - 1]));
  blocked.add(coordKey(config.board.dayCells[date.day - 1]));
  blocked.add(coordKey(config.board.weekdayCells[date.weekday]));
  return blocked;
}
