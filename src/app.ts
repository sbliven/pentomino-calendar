import puzzleData from "../data/puzzles.json";
import { solveDate } from "./solver/dlxSolver";
import type { DateKey, PuzzleConfig, SolvedPuzzle } from "./types";

const config = puzzleData as PuzzleConfig;
const cellColors = ["#ef4444", "#14b8a6", "#3b82f6", "#f59e0b", "#8b5cf6", "#22c55e", "#ec4899", "#f97316", "#6366f1", "#10b981"];

type SolveState = "idle" | "loading" | "ready" | "error";

export function mountApp(root: HTMLDivElement): void {
  root.innerHTML = `
    <main class="container">
      <h1>Calendar Pentomino Hints</h1>
      <p class="subtitle">Pick a date and reveal 1 piece, 2 pieces, or the full solution.</p>
      <div class="toolbar">
        <label>Date <input id="date-input" type="date" /></label>
        <button id="hint-1">Show Hint 1</button>
        <button id="hint-2">Show Hint 2</button>
        <button id="hint-3">Show Full Solution</button>
        <button id="reset">Reset</button>
      </div>
      <p id="status" class="status"></p>
      <div id="board" class="board"></div>
      <aside id="legend" class="legend"></aside>
    </main>
  `;

  const dateInput = root.querySelector<HTMLInputElement>("#date-input")!;
  const status = root.querySelector<HTMLParagraphElement>("#status")!;
  const board = root.querySelector<HTMLDivElement>("#board")!;
  const legend = root.querySelector<HTMLDivElement>("#legend")!;
  board.style.gridTemplateColumns = `repeat(${config.board.width}, 1fr)`;

  const solveCache = new Map<string, SolvedPuzzle>();
  let solveState: SolveState = "idle";
  let solved: SolvedPuzzle | null = null;
  let hintLevel = 0;
  let activeDate = new Date();

  function setStatus(message: string, state: SolveState): void {
    solveState = state;
    status.textContent = message;
    status.dataset.state = state;
  }

  function toDateKey(date: Date): DateKey {
    return { month: date.getMonth() + 1, day: date.getDate(), weekday: date.getDay() };
  }

  function dateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  function formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  function visiblePlacements(): SolvedPuzzle["placements"] {
    if (!solved) return [];
    if (hintLevel === 1) return solved.placements.slice(0, 1);
    if (hintLevel === 2) return solved.placements.slice(0, 2);
    if (hintLevel >= 3) return solved.placements;
    return [];
  }

  function renderBoard(): void {
    const blocked = solved?.blockedCells ?? new Set<string>();
    const revealedCells = new Map<string, number>();
    visiblePlacements().forEach((placement, index) => {
      placement.cells.forEach(([x, y]) => revealedCells.set(`${x},${y}`, index));
    });

    const cells: string[] = [];
    for (let y = 0; y < config.board.height; y += 1) {
      for (let x = 0; x < config.board.width; x += 1) {
        const key = `${x},${y}`;
        const blockedClass = blocked.has(key) ? "blocked" : "open";
        const revealIndex = revealedCells.get(key);
        const color = revealIndex === undefined ? "" : `style="background:${cellColors[revealIndex % cellColors.length]}"`;
        cells.push(`<div class="cell ${blockedClass}" ${color}></div>`);
      }
    }
    board.innerHTML = cells.join("");
  }

  function renderLegend(): void {
    if (!solved) {
      legend.innerHTML = "";
      return;
    }
    const items = visiblePlacements()
      .map((placement, idx) => `<li><span class="swatch" style="background:${cellColors[idx % cellColors.length]}"></span>${placement.pieceId}</li>`)
      .join("");
    legend.innerHTML = `<h2>Revealed Pieces</h2><ul>${items || "<li>None</li>"}</ul>`;
  }

  function render(): void {
    renderBoard();
    renderLegend();
  }

  async function solveForDate(date: Date): Promise<void> {
    const cacheKey = dateKey(date);
    hintLevel = 0;
    setStatus("Solving puzzle...", "loading");
    render();

    try {
      if (!solveCache.has(cacheKey)) {
        const result = solveDate(config, toDateKey(date));
        solveCache.set(cacheKey, result);
      }
      solved = solveCache.get(cacheKey)!;
      setStatus("Solved. Reveal hints when ready.", "ready");
    } catch (error) {
      solved = null;
      setStatus((error as Error).message, "error");
    }

    render();
  }

  root.querySelector<HTMLButtonElement>("#hint-1")!.addEventListener("click", () => {
    hintLevel = Math.max(hintLevel, 1);
    render();
  });
  root.querySelector<HTMLButtonElement>("#hint-2")!.addEventListener("click", () => {
    hintLevel = Math.max(hintLevel, 2);
    render();
  });
  root.querySelector<HTMLButtonElement>("#hint-3")!.addEventListener("click", () => {
    hintLevel = 3;
    render();
  });
  root.querySelector<HTMLButtonElement>("#reset")!.addEventListener("click", () => {
    hintLevel = 0;
    render();
  });

  dateInput.addEventListener("change", () => {
    if (!dateInput.value) return;
    activeDate = new Date(`${dateInput.value}T12:00:00`);
    void solveForDate(activeDate);
  });

  dateInput.value = formatDate(activeDate);
  void solveForDate(activeDate);
}
