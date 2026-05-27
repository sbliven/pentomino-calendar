import assert from "node:assert/strict";
import test from "node:test";
import type { Placement } from "../types";
import { orderHintPlacements, placementKey } from "./orderHints";

function placement(pieceId: string, cells: Array<[number, number]>): Placement {
  return { pieceId, cells };
}

test("orders reference-solution hints by descending placement frequency", () => {
  const pA = placement("A", [[0, 0], [1, 0]]);
  const pB = placement("B", [[2, 0], [2, 1]]);
  const pBAlt = placement("B", [[7, 0], [7, 1]]);
  const pC = placement("C", [[3, 0], [3, 1]]);
  const pD = placement("D", [[4, 0], [4, 1]]);

  const solutions: Placement[][] = [
    [pA, pB, pC, pD],
    [pA, pB, pC, pD],
    [pA, pBAlt, pC, pD],
  ];

  const ordered = orderHintPlacements(solutions, "2026-5-27");
  assert.deepEqual(
    ordered.map((p) => p.pieceId),
    ["A", "C", "D", "B"],
  );
});

test("tie-break is deterministic per date seed and can vary between dates", () => {
  const pA = placement("A", [[0, 0], [1, 0]]);
  const pB = placement("B", [[2, 0], [2, 1]]);
  const pC = placement("C", [[3, 0], [3, 1]]);

  const solutions: Placement[][] = [[pA, pB, pC]];

  const orderedA1 = orderHintPlacements(solutions, "2026-5-27").map(placementKey);
  const orderedA2 = orderHintPlacements(solutions, "2026-5-27").map(placementKey);
  const orderedB = orderHintPlacements(solutions, "2026-5-28").map(placementKey);

  assert.deepEqual(orderedA1, orderedA2);
  assert.notDeepEqual(orderedA1, orderedB);
});
