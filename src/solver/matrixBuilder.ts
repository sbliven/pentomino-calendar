import { coordKey, getBlockedCells } from "../puzzle/blockedCells";
import type { Coord, DateKey, Placement, PuzzleConfig } from "../types";
import { getPieceVariants } from "./pieceVariants";

interface MatrixBuildResult {
  sparseMatrix: number[][];
  rowPlacements: Placement[];
  blockedCells: Set<string>;
}

function parseKey(key: string): Coord {
  const [x, y] = key.split(",").map(Number);
  return [x, y];
}

export function buildExactCoverMatrix(config: PuzzleConfig, date: DateKey): MatrixBuildResult {
  const blockedCells = getBlockedCells(config, date);
  const playableKeys: string[] = [];
  for (let y = 0; y < config.board.height; y += 1) {
    for (let x = 0; x < config.board.width; x += 1) {
      const key = `${x},${y}`;
      if (!blockedCells.has(key)) playableKeys.push(key);
    }
  }

  if (playableKeys.length !== 50) {
    throw new Error(`Expected 50 playable cells, got ${playableKeys.length}`);
  }

  const cellColumnIndex = new Map<string, number>();
  playableKeys.forEach((key, idx) => cellColumnIndex.set(key, idx));

  const pieceColumnOffset = playableKeys.length;
  const sparseMatrix: number[][] = [];
  const rowPlacements: Placement[] = [];

  config.pieces.forEach((pieceId, pieceIndex) => {
    const variants = getPieceVariants(pieceId);
    variants.forEach((variant) => {
      const maxX = Math.max(...variant.map(([x]) => x));
      const maxY = Math.max(...variant.map(([, y]) => y));
      for (let y = 0; y <= config.board.height - maxY - 1; y += 1) {
        for (let x = 0; x <= config.board.width - maxX - 1; x += 1) {
          const translated = variant.map(([vx, vy]) => [x + vx, y + vy] as Coord);
          const translatedKeys = translated.map(coordKey);
          if (translatedKeys.some((cellKey) => !cellColumnIndex.has(cellKey))) continue;

          const row = [pieceColumnOffset + pieceIndex];
          translatedKeys.forEach((cellKey) => row.push(cellColumnIndex.get(cellKey)!));
          row.sort((a, b) => a - b);
          sparseMatrix.push(row);
          rowPlacements.push({
            pieceId,
            cells: translatedKeys.map(parseKey),
          });
        }
      }
    });
  });

  return { sparseMatrix, rowPlacements, blockedCells };
}
