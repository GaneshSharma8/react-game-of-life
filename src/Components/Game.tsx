import type React from 'react';
import { GameGrid } from './GameGrid';
import { ControlPanel } from './ControlPanel';
import type { CellState } from './Cell';
import { useState } from 'react';

const ROWS = 50;
const COLUMNS = 50;

// Helper to instantiate a clean 50x50 multi-dimensional array
const createInitialGrid = (): CellState[][] =>
  Array.from({ length: ROWS }, () => Array(COLUMNS).fill('dead'));

export const Game: React.FC = () => {
  const [grid, setGrid] = useState<CellState[][]>(() => createInitialGrid());
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleCellClick = (row: number, col: number) => {
    setGrid((prevGrid) => {
      // Map over previous rows to guarantee immutability
      return prevGrid.map((currentRow, rIdx) =>
        currentRow.map((cellState, cIdx) => {
          if (rIdx === row && cIdx === col) {
            return cellState === 'alive' ? 'dead' : 'alive';
          }
          return cellState;
        })
      );
    });
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setGrid(createInitialGrid());
  };

  return (
    <main className="game-container min-h-screen bg-slate-900 py-8 px-4 flex flex-col items-center">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
          Conway's Game of Life
        </h1>
      </header>

      {/* Control Panel Section */}
      <section aria-label="Control Panel" className="w-full mb-4">
        <ControlPanel
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
        />
      </section>

      {/* Game Grid Section */}
      <section className="w-full">
        <GameGrid grid={grid} onCellClick={handleCellClick} />
      </section>
    </main>
  );
}
