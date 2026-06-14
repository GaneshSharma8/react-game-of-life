import type React from "react";
import { Cell } from "./Cell";
import { GRID_THEME } from "./ui/GameGrid.theme";
import type { IGameGridProps } from "../types";

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
