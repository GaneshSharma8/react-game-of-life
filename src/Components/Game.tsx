import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../store";
import {
  toggleCellState,
  setCellAlive,
  setSimulationRunning,
  clearGrid,
  advanceGeneration,
  hydrateGridFromUrl,
} from "../store/gameSlice";
import { GameGrid } from "./GameGrid";
import { ControlPanel } from "./ControlPanel";
import { createGrid, createToken } from "../utils/url";

export const Game: React.FC = () => {
  const dispatch = useDispatch();
  
  const grid = useSelector((state: RootState) => state.game.grid);
  const isRunning = useSelector((state: RootState) => state.game.isRunning);

  // ON PAGE INITIALIZATION (READ URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startParam = params.get("start");

    if (startParam) {
      try {
        const targetGrid = createGrid(startParam, 50, 50);
        dispatch(hydrateGridFromUrl(targetGrid));
      } catch (error) {
        console.error("Failed to decode grid state from share link:", error);
      }
    }
  }, [dispatch]);

  // BACKGROUND SIMULATION TICKER
  useEffect(() => {
    if (!isRunning) return;
    const tick = () => dispatch(advanceGeneration());
    const intervalId = setInterval(tick, 100);
    return () => clearInterval(intervalId);
  }, [isRunning, dispatch]);

  const handleCellClick = (row: number, col: number) => {
    dispatch(toggleCellState({ row, col }));
  };

  const handleCellDraw = (row: number, col: number) => {
    dispatch(setCellAlive({ row, col }));
  };

  const handleStart = () => {
    // Generate the deterministic compressed token from current state
    const compressedToken = createToken(grid);
    
    // Set url search query parameter without reloading the client tab
    const newUrl = `${window.location.pathname}?start=${compressedToken}`;
    window.history.pushState({ path: newUrl }, "", newUrl);

    // Start the loop
    dispatch(setSimulationRunning(true));
  };

  const handleStop = () => {
    dispatch(setSimulationRunning(false));
  };

  const handleReset = () => {
    // 1. Clean query strings and reset pathname back to pure slash layout
    window.history.pushState({ path: window.location.pathname }, "", window.location.pathname);
    
    // 2. Clean out datastore memory nodes
    dispatch(clearGrid());
  };

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
        <GameGrid 
          grid={grid} 
          onCellClick={handleCellClick} 
          onCellDraw={handleCellDraw} 
        />
      </section>
    </main>
  );
};
