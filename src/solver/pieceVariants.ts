import type { Coord } from "../types";

const BASE_PIECES: Record<string, Coord[]> = {
  F: [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 2],
    [2, 2],
  ],
  L: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 3],
  ],
  N: [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [3, 1],
  ],
  P: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [0, 2],
  ],
  T: [
    [0, 0],
    [1, 0],
    [2, 0],
    [1, 1],
    [1, 2],
  ],
  U: [
    [0, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  V: [
    [0, 0],
    [0, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  W: [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 2],
    [2, 2],
  ],
  Y: [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 1],
  ],
  Z: [
    [0, 0],
    [1, 0],
    [1, 1],
    [1, 2],
    [2, 2],
  ],
};

function normalize(shape: Coord[]): Coord[] {
  const minX = Math.min(...shape.map(([x]) => x));
  const minY = Math.min(...shape.map(([, y]) => y));
  return shape
    .map(([x, y]) => [x - minX, y - minY] as Coord)
    .sort(([ax, ay], [bx, by]) => ay - by || ax - bx);
}

function signature(shape: Coord[]): string {
  return shape.map(([x, y]) => `${x},${y}`).join(";");
}

function transform(shape: Coord[], variant: number): Coord[] {
  return shape.map(([x, y]) => {
    const fx = variant >= 4 ? -x : x;
    const r = variant % 4;
    if (r === 0) return [fx, y];
    if (r === 1) return [-y, fx];
    if (r === 2) return [-fx, -y];
    return [y, -fx];
  });
}

export function getPieceVariants(pieceId: string): Coord[][] {
  const base = BASE_PIECES[pieceId];
  if (!base) throw new Error(`Unknown piece: ${pieceId}`);

  const seen = new Set<string>();
  const variants: Coord[][] = [];

  for (let i = 0; i < 8; i += 1) {
    const normalized = normalize(transform(base, i));
    const key = signature(normalized);
    if (!seen.has(key)) {
      seen.add(key);
      variants.push(normalized);
    }
  }

  return variants.sort((a, b) => signature(a).localeCompare(signature(b)));
}
