import puzzleData from "../data/puzzles.json";
import { coordKey, getBlockedCells } from "./puzzle/blockedCells";
import { solveDate } from "./solver/dlxSolver";
import type { DateKey, PuzzleConfig, SolvedPuzzle } from "./types";

const config = puzzleData as PuzzleConfig;
const cellColors = ["#ef4444", "#14b8a6", "#3b82f6", "#f59e0b", "#8b5cf6", "#22c55e", "#ec4899", "#f97316", "#6366f1", "#10b981"];

type SolveState = "idle" | "loading" | "ready" | "error";

export function mountApp(root: HTMLDivElement): void {
  root.innerHTML = `
    <main class="container">
      <p class="subtitle">Pick a date, reveal hints one piece at a time, or show the full solution.</p>
      <div class="toolbar">
        <div class="toolbar-row">
          <span class="toolbar-label">Date</span>
          <button type="button" id="date-today">Today</button>
          <button type="button" id="date-tomorrow">Tomorrow</button>
          <input id="date-input" type="date" aria-label="Date" />
        </div>
        <div class="toolbar-row">
          <span class="toolbar-label">Hint</span>
          <button type="button" id="show-hint">Show Hint</button>
          <button type="button" id="show-full">Show Full Solution</button>
          <button type="button" id="reset">Reset</button>
        </div>
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

  const showHintBtn = root.querySelector<HTMLButtonElement>("#show-hint")!;
  const showFullBtn = root.querySelector<HTMLButtonElement>("#show-full")!;
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
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function syncDateInput(): void {
    dateInput.value = formatDate(activeDate);
  }

  function visiblePlacements(): SolvedPuzzle["placements"] {
    if (!solved) return [];
    return solved.placements.slice(0, hintLevel);
  }

  function escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function labelTextsForDate(date: Date): Map<string, string> {
    const dk = toDateKey(date);
    const labels = new Map<string, string>();
    labels.set(coordKey(config.board.monthCells[dk.month - 1]), config.months[dk.month - 1]);
    const dayIdx = config.days.findIndex((d) => d === dk.day);
    if (dayIdx >= 0) labels.set(coordKey(config.board.dayCells[dayIdx]), String(dk.day));
    labels.set(coordKey(config.board.weekdayCells[dk.weekday]), config.weekdays[dk.weekday]);
    return labels;
  }

  function renderBoard(): void {
    const dk = toDateKey(activeDate);
    const blocked = solved?.blockedCells ?? getBlockedCells(config, dk);
    const labels = labelTextsForDate(activeDate);
    const revealedCells = new Map<string, number>();
    visiblePlacements().forEach((placement, index) => {
      placement.cells.forEach(([x, y]) => revealedCells.set(`${x},${y}`, index));
    });

    const cells: string[] = [];
    for (let y = 0; y < config.board.height; y += 1) {
      for (let x = 0; x < config.board.width; x += 1) {
        const key = `${x},${y}`;
        const label = labels.get(key);
        const revealIndex = revealedCells.get(key);
        const color =
          revealIndex === undefined ? "" : ` style="background:${cellColors[revealIndex % cellColors.length]}"`;

        if (label !== undefined) {
          cells.push(
            `<div class="cell blocked label-slot"${color}><span class="cell-label-text">${escapeHtml(label)}</span></div>`,
          );
          continue;
        }

        const blockedClass = blocked.has(key) ? "blocked" : "open";
        cells.push(`<div class="cell ${blockedClass}"${color}></div>`);
      }
    }
    board.innerHTML = cells.join("");
  }

  function renderLegend(): void {
    if (!solved) {
      legend.innerHTML = "";
      return;
    }
    const chips = visiblePlacements()
      .map(
        (placement, idx) =>
          `<span class="legend-chip"><span class="swatch" style="background:${cellColors[idx % cellColors.length]}"></span>${escapeHtml(placement.pieceId)}</span>`,
      )
      .join('<span class="legend-sep" aria-hidden="true">·</span>');
    legend.innerHTML = `<div class="legend-row"><h2 class="legend-heading">Revealed Pieces</h2><div class="legend-chips">${chips || "None"}</div></div>`;
  }

  function syncRevealButtons(): void {
    const n = solved?.placements.length ?? 0;
    const canReveal = solveState === "ready" && n > 0 && hintLevel < n;
    showHintBtn.disabled = !canReveal;
    showFullBtn.disabled = !canReveal;
  }

  function render(): void {
    renderBoard();
    renderLegend();
    syncRevealButtons();
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

  showHintBtn.addEventListener("click", () => {
    if (!solved) return;
    const n = solved.placements.length;
    if (hintLevel < n) hintLevel += 1;
    render();
  });
  showFullBtn.addEventListener("click", () => {
    if (!solved) return;
    hintLevel = solved.placements.length;
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

  root.querySelector<HTMLButtonElement>("#date-today")!.addEventListener("click", () => {
    activeDate = new Date();
    syncDateInput();
    void solveForDate(activeDate);
  });

  root.querySelector<HTMLButtonElement>("#date-tomorrow")!.addEventListener("click", () => {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    activeDate = next;
    syncDateInput();
    void solveForDate(activeDate);
  });

  syncDateInput();
  void solveForDate(activeDate);
}
