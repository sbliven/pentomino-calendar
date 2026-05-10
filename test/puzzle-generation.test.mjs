import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const puzzlesPath = join(__dirname, "..", "data", "puzzles.json");

/** Must stay aligned with `src/puzzle/blockedCells.ts` (`getBlockedCells`). */
function coordKey([x, y]) {
  return `${x},${y}`;
}

function getBlockedCells(config, date) {
  const blocked = new Set(config.board.fixedBlocked.map(coordKey));
  blocked.add(coordKey(config.board.monthCells[date.month - 1]));
  blocked.add(coordKey(config.board.dayCells[date.day - 1]));
  blocked.add(coordKey(config.board.weekdayCells[date.weekday]));
  return blocked;
}

test("2026-05-14 blocked cells (May 14 Thu + fixed hole)", () => {
  assert.strictEqual(
    new Date(Date.UTC(2026, 4, 14)).getUTCDay(),
    4,
    "2026-05-14 (UTC) should be Thursday (weekday index 4)",
  );

  const raw = readFileSync(puzzlesPath, "utf8");
  const config = JSON.parse(raw);

  const blocked = getBlockedCells(config, { month: 5, day: 14, weekday: 4 });

  /* Board coords use [x, y]. Day 14 uses [7, 5] (same square as row-major [5, 7]). */

  assert.deepEqual(
    blocked,
    new Set([
      coordKey([0, 1]),
      coordKey([7, 5]),
      coordKey([7, 3]),
      coordKey([8, 5]),
    ]),
  );
});
