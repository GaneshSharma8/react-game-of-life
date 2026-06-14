import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import {
  toggleCellState,
  setSimulationRunning,
  clearGrid,
} from "../store/gameSlice";
import { GameGrid } from "./GameGrid";
import { ControlPanel } from "./ControlPanel";

export const Game: React.FC = () => {
  const dispatch = useDispatch();
  
  const grid = useSelector((state: RootState) => state.game.grid);
  const isRunning = useSelector((state: RootState) => state.game.isRunning);

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
