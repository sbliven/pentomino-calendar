import type { Placement } from "../types";

function sortedCellKey(placement: Placement): string {
  const cells = [...placement.cells]
    .sort(([ax, ay], [bx, by]) => (ay - by) || (ax - bx))
    .map(([x, y]) => `${x},${y}`)
    .join("|");
  return `${placement.pieceId}:${cells}`;
}

// Fowler-Noll-Vo hash function (32-bit variant)
function fnv1a32(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function tieBreakWeight(seedKey: string, placementKey: string): number {
  return fnv1a32(`${seedKey}::${placementKey}`);
}

function buildPlacementFrequencies(solutions: Placement[][]): Map<string, number> {
  const frequencies = new Map<string, number>();
  for (const solution of solutions) {
    for (const placement of solution) {
      const key = sortedCellKey(placement);
      frequencies.set(key, (frequencies.get(key) ?? 0) + 1);
    }
  }
  return frequencies;
}

export function orderHintPlacements(solutions: Placement[][], seedKey: string): Placement[] {
  const reference = solutions[0] ?? [];
  if (reference.length === 0) return [];

  const frequencies = buildPlacementFrequencies(solutions);
  const keyed = reference.map((placement) => {
    const key = sortedCellKey(placement);
    return {
      placement,
      key,
      frequency: frequencies.get(key) ?? 0,
      tie: tieBreakWeight(seedKey, key),
    };
  });

  keyed.sort((a, b) => (b.frequency - a.frequency) || (a.tie - b.tie));
  return keyed.map((entry) => entry.placement);
}

export function placementFrequencyByKey(solutions: Placement[][]): Map<string, number> {
  return buildPlacementFrequencies(solutions);
}

export function placementKey(placement: Placement): string {
  return sortedCellKey(placement);
}
