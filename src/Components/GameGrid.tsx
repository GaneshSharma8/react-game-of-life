import type React from "react";
import { Cell, type CellState } from "./Cell";

export interface IGameGridProps extends React.HTMLAttributes<HTMLDivElement> {
  // A 2D array of ('alive' | 'dead')[][]
  grid: CellState[][]; 
  onCellClick: (row: number, col: number) => void;
}

// Centralized Theme Configuration for the GameGrid Layout
export const GRID_THEME = {
  // Outer viewport panel layout tokens
  viewportWrapper: "w-full flex justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl max-w-5xl mx-auto overflow-auto",
  
  // Inner canvas layout tokens
  canvasContainer: "grid bg-slate-800/50 p-2 rounded-lg border border-slate-800",
  
  // Layout spacing defaults
  layoutDefaults: {
    gap: "1px",
    minTrackSize: "0",
    maxTrackSize: "1fr",
  }
};

export const GameGrid: React.FC<IGameGridProps> = ({
  grid,
  onCellClick,
  className = "",
  ...props
}) => {
  const numColumns = grid?.[0]?.length || 0;
  const { gap, minTrackSize, maxTrackSize } = GRID_THEME.layoutDefaults;

  return (
    <div 
      className={`${GRID_THEME.viewportWrapper} ${className}`}
      {...props}
    >
      <div
        className={GRID_THEME.canvasContainer}
        style={{
          gridTemplateColumns: `repeat(${numColumns}, minmax(${minTrackSize}, ${maxTrackSize}))`,
          gap: gap,
        }}
      >
        {grid?.map((row, rowIndex) =>
          row.map((cellState, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              state={cellState}
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};
