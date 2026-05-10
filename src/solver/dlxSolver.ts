import dlx from "dlx";
import type { DateKey, Placement, PuzzleConfig, SolvedPuzzle } from "../types";
import { buildExactCoverMatrix } from "./matrixBuilder";

function stableSortPlacements(placements: Placement[], pieceOrder: string[]): Placement[] {
  const rank = new Map(pieceOrder.map((piece, idx) => [piece, idx]));
  return [...placements].sort((a, b) => (rank.get(a.pieceId)! - rank.get(b.pieceId)!));
}

export function solveDate(config: PuzzleConfig, date: DateKey): SolvedPuzzle {
  const { sparseMatrix, rowPlacements, blockedCells } = buildExactCoverMatrix(config, date);
  const solutions = dlx.solve_sparse_matrix(sparseMatrix);

  if (!solutions.length) {
    throw new Error("No solution found for this date.");
  }

  const placements = stableSortPlacements(
    solutions[0].map((rowIndex) => rowPlacements[rowIndex]),
    config.pieces,
  );

  return { blockedCells, placements };
}
