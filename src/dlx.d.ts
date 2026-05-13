/**
 * Minimal typings for the npm **`dlx`** package — Knuth’s **Dancing Links** solver for the
 * **exact cover** problem (author: Johannes Laire).
 *
 * **Upstream:** [jlaire/dlx.js](https://github.com/jlaire/dlx.js) · npm `dlx@0.2.1`.
 * This package is not indexed on Context7; the `solve_sparse_matrix` notes below match that
 * release’s `lib/dlx.js` and `lib/LinkedMatrix.js`.
 */
declare module "dlx" {
  const dlx: {
    /**
     * Find **all** exact covers of a **sparse 0/1 matrix**.
     *
     * **Input shape:** `matrix` is an array over **row index** `y`. Each `matrix[y]` lists the
     * **column indices** where that row has a `1` (distinct non-negative integers). Columns not
     * listed are `0`. The column count is implied by the largest column index used anywhere.
     *
     * **Output:** An array of **solutions**. The implementation exhaustively enumerates covers
     * (`go` in `solve_linked_matrix`); it does **not** stop after the first solution. Each
     * solution is a **sorted** array of **row indices** `y` whose selected rows together hit every
     * column exactly once (exact cover). The outer array is sorted as well (upstream
     * `solutions.sort()`).
     *
     * Callers that only need one layout (e.g. this app) typically use `solutions[0]`.
     *
     * @param matrix sparse rows: for each row `y`, the set of columns set to `1`
     * @returns every solution; each entry is an ascending list of chosen row indices `y`
     */
    solve_sparse_matrix(matrix: number[][]): number[][];
  };
  export default dlx;
}
