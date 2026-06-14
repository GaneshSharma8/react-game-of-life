// import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// import type { CellState } from '../Components/Cell';

// interface GameState {
//   rows: number;
//   cols: number;
//   grid: CellState[][];
//   isRunning: boolean;
// }

// const ROWS = 50;
// const COLS = 50;

// // Helper function to cleanly build a typed matrix canvas
// const generateEmptyGrid = (r: number, c: number): CellState[][] => 
//   Array.from({ length: r }, () => Array(c).fill('dead'));

// const initialState: GameState = {
//   rows: ROWS,
//   cols: COLS,
//   grid: generateEmptyGrid(ROWS, COLS),
//   isRunning: false,
// };

// export const gameSlice = createSlice({
//   name: 'game',
//   initialState,
//   reducers: {
//     // Toggles cell when clicked by user
//     toggleCellState: (state, action: PayloadAction<{ row: number; col: number }>) => {
//       const { row, col } = action.payload;
//       state.grid[row][col] = state.grid[row][col] === 'alive' ? 'dead' : 'alive';
//     },
//     setSimulationRunning: (state, action: PayloadAction<boolean>) => {
//       state.isRunning = action.payload;
//     },
//     clearGrid: (state) => {
//       state.grid = generateEmptyGrid(state.rows, state.cols);
//       state.isRunning = false;
//     },
//     // The core algorithmic execution ticks here
//     advanceGeneration: (state) => {
//       const currentGrid = state.grid;
//       // Deep copy matrix rows using map structure to respect RTK's Immer bounds
//       const nextGrid = currentGrid.map(row => [...row]);

//       // Map out index offsets for the 8 immediate bounding grid boxes
//       const neighborOffsets = [
//         [-1, -1], [-1, 0], [-1, 1],
//         [ 0, -1],          [ 0, 1],
//         [ 1, -1], [ 1, 0], [ 1, 1]
//       ];

//       for (let r = 0; r < state.rows; r++) {
//         for (let c = 0; c < state.cols; c++) {
//           let aliveNeighbors = 0;

//           // Scan coordinates for surrounding alive cell pointers
//           neighborOffsets.forEach(([xOffset, yOffset]) => {
//             const targetRow = r + xOffset;
//             const targetCol = c + yOffset;

//             if (
//               targetRow >= 0 && targetRow < state.rows && 
//               targetCol >= 0 && targetCol < state.cols
//             ) {
//               if (currentGrid[targetRow][targetCol] === 'alive') {
//                 aliveNeighbors++;
//               }
//             }
//           });

//           // Process the rules of cellular automata
//           const currentCell = currentGrid[r][c];
//           if (currentCell === 'alive' && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
//             nextGrid[r][c] = 'dead'; // Underpopulation / Overpopulation
//           } else if (currentCell === 'dead' && aliveNeighbors === 3) {
//             nextGrid[r][c] = 'alive'; // Reproduction
//           }
//         }
//       }

//       state.grid = nextGrid;
//     }
//   }
// });

// export const { toggleCellState, setSimulationRunning, clearGrid, advanceGeneration } = gameSlice.actions;
// export default gameSlice.reducer;
