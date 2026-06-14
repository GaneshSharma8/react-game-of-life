import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CellState, GameState } from "../types";

const ROWS = 50;
const COLS = 50;

// Helper to instantiate a clean multi-dimensional array data layer
const generateEmptyGrid = (r: number, c: number): CellState[][] =>
  Array.from({ length: r }, () => Array(c).fill("dead"));

const initialState: GameState = {
  rows: ROWS,
  cols: COLS,
  grid: generateEmptyGrid(ROWS, COLS),
  isRunning: false,
};

// Pure utility function to count live neighbor cells around given grid indices
const countLiveNeighbors = (grid: CellState[][], r: number, c: number, maxRows: number, maxCols: number): number => {
  const neighborOffsets = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1]
  ];
  
  let liveCount = 0;
  
  neighborOffsets.forEach(([xOffset, yOffset]) => {
    const targetRow = r + xOffset;
    const targetCol = c + yOffset;

    if (targetRow >= 0 && targetRow < maxRows && targetCol >= 0 && targetCol < maxCols) {
      if (grid[targetRow][targetCol] === "alive") {
        liveCount++;
      }
    }
  });

  return liveCount;
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    toggleCellState: (state, action: PayloadAction<{ row: number; col: number }>) => {
      const { row, col } = action.payload;
      // Immer interceptor converts direct mutations to safe immutable updates
      state.grid[row][col] = state.grid[row][col] === "alive" ? "dead" : "alive";
    },
    setSimulationRunning: (state, action: PayloadAction<boolean>) => {
      state.isRunning = action.payload;
    },
    clearGrid: (state) => {
      state.grid = generateEmptyGrid(state.rows, state.cols);
      state.isRunning = false;
    },
    advanceGeneration: (state) => {
      const currentGrid = state.grid;
      // Map structures out to respect deep references
      const nextGrid = currentGrid.map((row) => [...row]);

      for (let r = 0; r < state.rows; r++) {
        for (let c = 0; c < state.cols; c++) {
          const liveNeighbors = countLiveNeighbors(currentGrid, r, c, state.rows, state.cols);
          const currentCell = currentGrid[r][c];

          if (currentCell === "alive" && (liveNeighbors < 2 || liveNeighbors > 3)) {
            nextGrid[r][c] = "dead"; // Death state
          } else if (currentCell === "dead" && liveNeighbors === 3) {
            nextGrid[r][c] = "alive"; // Reproduction state
          }
        }
      }
      state.grid = nextGrid;
    },
    hydrateGridFromUrl: (state, action: PayloadAction<CellState[][]>) => {
      state.grid = action.payload;
      state.isRunning = false;
    }
  },
});

export const { toggleCellState, setSimulationRunning, clearGrid, advanceGeneration, hydrateGridFromUrl } = gameSlice.actions;
export default gameSlice.reducer;
