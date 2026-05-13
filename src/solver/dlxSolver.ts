import dlx from "dlx";
import type { DateKey, Placement, PuzzleConfig, SolvedPuzzle } from "../types";
import { buildExactCoverMatrix } from "./matrixBuilder";

function stableSortPlacements(placements: Placement[], pieceOrder: string[]): Placement[] {
  const rank = new Map(pieceOrder.map((piece, idx) => [piece, idx]));
  return [...placements].sort((a, b) => (rank.get(a.pieceId)! - rank.get(b.pieceId)!));
}

export function solveDate(config: PuzzleConfig, date: DateKey): SolvedPuzzle {
  const { sparseMatrix, rowPlacements, blockedCells } = buildExactCoverMatrix(config, date);
  const rawSolutions = dlx.solve_sparse_matrix(sparseMatrix);

  if (!rawSolutions.length) {
    throw new Error("No solution found for this date.");
  }

  const solutions = rawSolutions.map((rowIndices) =>
    stableSortPlacements(
      rowIndices.map((rowIndex) => rowPlacements[rowIndex]),
      config.pieces,
    ),
  );

  return { blockedCells, solutions };
}
