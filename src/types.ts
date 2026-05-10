export type Coord = [number, number];

export interface PuzzleConfig {
  board: {
    width: number;
    height: number;
    fixedBlocked: Coord[];
    /** Cells listed for layout/UI; they remain playable for packing (not solver-blocked). */
    blanks?: Coord[];
    monthCells: Coord[];
    dayCells: Coord[];
    weekdayCells: Coord[];
  };
  months: string[];
  weekdays: string[];
  /** Day numbers 1–31 aligned with `dayCells` indices. */
  days: number[];
  pieces: string[];
}

export interface DateKey {
  month: number;
  day: number;
  weekday: number;
}

export interface Placement {
  pieceId: string;
  cells: Coord[];
}

export interface SolvedPuzzle {
  blockedCells: Set<string>;
  placements: Placement[];
}
