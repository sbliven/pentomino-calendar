export type Coord = [number, number];

export interface PuzzleConfig {
  board: {
    width: number;
    height: number;
    fixedBlocked: Coord[];
    monthCells: Coord[];
    dayCells: Coord[];
    weekdayCells: Coord[];
  };
  months: string[];
  weekdays: string[];
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
