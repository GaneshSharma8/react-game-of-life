import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import {
  toggleCellState,
  setSimulationRunning,
  clearGrid,
  advanceGeneration,
  updateWholeGrid,
} from "../store/gameSlice";
import { GameGrid } from "./GameGrid";
import { ControlPanel } from "./ControlPanel";
import type { CellState } from "./Cell";

export const Game: React.FC = () => {
  const dispatch = useDispatch();

  const grid = useSelector((state: RootState) => state.game.grid);
  const isRunning = useSelector((state: RootState) => state.game.isRunning);

  // Inside src/components/Game.tsx
  useEffect(() => {
    if (!isRunning) return;

    // Initialize two separate background thread workers
    const worker1 = new Worker(new URL("../workers/life.worker.ts", import.meta.url), { type: "module" });
    const worker2 = new Worker(new URL("../workers/life.worker.ts", import.meta.url), { type: "module" });

    const tick = async () => {
      // Divide our 50 rows into two parallel batches: 0-25 and 25-50
      const midPoint = 25;

      // Wrap worker messaging in promises so we can await their parallel resolution
      const runWorkerChunk = (worker: Worker, startRow: number, endRow: number) => {
        return new Promise<{ processedRows: CellState[][]; startRow: number }>((resolve) => {
          worker.onmessage = (e) => resolve(e.data);
          worker.postMessage({ grid, startRow, endRow, rows: 50, cols: 50 });
        });
      };

      // Fork: Fire off both threads simultaneously
      const [batch1, batch2] = await Promise.all([
        runWorkerChunk(worker1, 0, midPoint),
        runWorkerChunk(worker2, midPoint, 50)
      ]);

      // Join: Concatenate the processed row batches back into a single 50x50 matrix
      const nextGrid = [...batch1.processedRows, ...batch2.processedRows];

      // Commit transaction to Redux state
      dispatch(updateWholeGrid(nextGrid));
    };

    const intervalId = setInterval(tick, 100);

    // Terminate workers on stop/unmount to prevent memory leaks
    return () => {
      clearInterval(intervalId);
      worker1.terminate();
      worker2.terminate();
    };
  }, [isRunning, grid, dispatch]);

  const handleCellClick = (row: number, col: number) => {
    dispatch(toggleCellState({ row, col }));
  };

  const handleStart = () => dispatch(setSimulationRunning(true));
  const handleStop = () => dispatch(setSimulationRunning(false));
  const handleReset = () => dispatch(clearGrid());

  return (
    <main className="game-container min-h-screen bg-slate-900 py-8 px-4 flex flex-col items-center">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
          Game of Life
        </h1>
      </header>

      <section aria-label="Control Panel" className="w-full mb-4">
        <ControlPanel
          isRunning={isRunning}
          onStart={handleStart}
          onStop={handleStop}
          onReset={handleReset}
        />
      </section>

      <section className="w-full">
        <GameGrid grid={grid} onCellClick={handleCellClick} />
      </section>
    </main>
  );
};
