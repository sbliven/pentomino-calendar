import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const puzzlesPath = join(__dirname, "..", "data", "puzzles.json");

/**
 * @param {unknown} data
 */
function validatePuzzlesJson(data) {
  assert.ok(data && typeof data === "object", "Root must be an object");

  assert.ok("board" in data && data.board && typeof data.board === "object", "Missing board");

  const board = /** @type {{ width: number; height: number; fixedBlocked?: unknown; blanks?: unknown; monthCells?: unknown; dayCells?: unknown; weekdayCells?: unknown }} */ (
    data.board
  );

  assert.equal(typeof board.width, "number");
  assert.equal(typeof board.height, "number");

  const months = /** @type {unknown} */ (data.months);
  const weekdays = /** @type {unknown} */ (data.weekdays);
  const days = /** @type {unknown} */ (data.days);

  assert.ok(Array.isArray(months), "months must be an array");
  assert.ok(Array.isArray(weekdays), "weekdays must be an array");
  assert.ok(Array.isArray(days), "days must be an array");

  assert.ok(Array.isArray(board.monthCells), "monthCells must be an array");
  assert.ok(Array.isArray(board.weekdayCells), "weekdayCells must be an array");
  assert.ok(Array.isArray(board.dayCells), "dayCells must be an array");

  assert.equal(board.monthCells.length, months.length, "monthCells and months must have the same length");
  assert.equal(months.length, 12, "months must have length 12");

  assert.equal(board.weekdayCells.length, weekdays.length, "weekdayCells and weekdays must have the same length");
  assert.equal(weekdays.length, 7, "weekdays must have length 7");

  assert.equal(board.dayCells.length, days.length, "dayCells and days must have the same length");
  assert.equal(days.length, 31, "days must have length 31");

  const fixedBlocked = Array.isArray(board.fixedBlocked) ? board.fixedBlocked : [];
  const blanks = Array.isArray(board.blanks) ? board.blanks : [];

  const expectedCells = board.width * board.height;

  /** @type {Array<[string, unknown[]]>} */
  const sections = [
    ["fixedBlocked", fixedBlocked],
    ["blanks", blanks],
    ["monthCells", /** @type {unknown[]} */ (board.monthCells)],
    ["dayCells", /** @type {unknown[]} */ (board.dayCells)],
    ["weekdayCells", /** @type {unknown[]} */ (board.weekdayCells)],
  ];

  /** @type {Map<string, string[]>} */
  const owners = new Map();

  for (const [sectionName, coords] of sections) {
    assert.ok(Array.isArray(coords), `${sectionName} must be an array`);

    for (const coord of coords) {
      assert.ok(Array.isArray(coord) && coord.length === 2, `${sectionName} entries must be [x,y] tuples`);
      const x = Number(coord[0]);
      const y = Number(coord[1]);
      assert.ok(Number.isInteger(x) && Number.isInteger(y), `${sectionName} has non-integer coordinates`);

      assert.ok(x >= 0 && x < board.width, `${sectionName} x out of bounds: ${JSON.stringify(coord)}`);
      assert.ok(y >= 0 && y < board.height, `${sectionName} y out of bounds: ${JSON.stringify(coord)}`);

      const key = `${x},${y}`;
      if (!owners.has(key)) owners.set(key, []);
      owners.get(key).push(sectionName);
    }
  }

  let totalEntries = 0;
  for (const [, coords] of sections) totalEntries += coords.length;

  assert.equal(totalEntries, expectedCells, `section lengths must sum to board area (${expectedCells})`);

  const duplicated = [...owners.entries()].filter(([, names]) => names.length > 1);
  assert.deepEqual(
    duplicated,
    [],
    duplicated.length ? `duplicate cell assignments: ${JSON.stringify(duplicated)}` : undefined,
  );

  assert.equal(owners.size, expectedCells, `every board cell must appear exactly once (got ${owners.size}, expected ${expectedCells})`);
}

test("puzzles.json validates", () => {
  const raw = readFileSync(puzzlesPath, "utf8");
  const data = JSON.parse(raw);
  validatePuzzlesJson(data);
});
