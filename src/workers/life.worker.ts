import type { CellState } from "../Components/Cell";

const countLiveNeighbors = (grid: CellState[][], r: number, c: number, maxRows: number, maxCols: number): number => {
  const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  let count = 0;
  offsets.forEach(([x, y]) => {
    const targetR = r + x;
    const targetC = c + y;
    if (targetR >= 0 && targetR < maxRows && targetC >= 0 && targetC < maxCols) {
      if (grid[targetR][targetC] === "alive") count++;
    }
  });
  return count;
};

// Listen for processing batch chunks from the main thread
self.onmessage = (e: MessageEvent<{ grid: CellState[][]; startRow: number; endRow: number; cols: number; rows: number }>) => {
  const { grid, startRow, endRow, cols, rows } = e.data;
  const processedRows: CellState[][] = [];

  // Only calculate the assigned subset of rows
  for (let r = startRow; r < endRow; r++) {
    const newRow: CellState[] = [];
    for (let c = 0; c < cols; c++) {
      const liveNeighbors = countLiveNeighbors(grid, r, c, rows, cols);
      const currentCell = grid[r][c];

      if (currentCell === "alive" && (liveNeighbors < 2 || liveNeighbors > 3)) {
        newRow.push("dead");
      } else if (currentCell === "dead" && liveNeighbors === 3) {
        newRow.push("alive");
      } else {
        newRow.push(currentCell);
      }
    }
    processedRows.push(newRow);
  }

  // Post the processed chunk back to the main thread along with its offset index
  self.postMessage({ processedRows, startRow });
};
