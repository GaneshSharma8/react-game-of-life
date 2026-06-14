import type React from "react";
import { useState, useRef } from "react";
import { Cell } from "./Cell";
import { GRID_THEME } from "./ui/GameGrid.theme";
import type { IGameGridProps } from "../types";

export const GameGrid: React.FC<IGameGridProps> = ({
  grid,
  onCellClick,
  onCellDraw,
  className = "",
  ...props
}) => {
  const numColumns = grid?.[0]?.length || 0;
  const { gap, minTrackSize, maxTrackSize } = GRID_THEME.layoutDefaults;

  const [isDrawing, setIsDrawing] = useState(false);
  // Cache to prevent duplicate dispatches for the exact same cell position
  const lastCellRef = useRef<{ r: number; c: number } | null>(null);

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDrawing) return;

    const element = document.elementFromPoint(clientX, clientY);
    if (!element) return;

    // Traverse upwards to see if it's one of our cells containing row/col metadata
    const cellElement = element.closest("[data-row]");
    if (!cellElement) return;

    const r = parseInt(cellElement.getAttribute("data-row") || "", 10);
    const c = parseInt(cellElement.getAttribute("data-col") || "", 10);

    // Guard: Don't dispatch if the cursor is dragging around inside the same box
    if (lastCellRef.current?.r === r && lastCellRef.current?.c === c) return;

    lastCellRef.current = { r, c };
    onCellDraw(r, c);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastCellRef.current = null;
  };

  return (
    <div 
      // 'touch-none' to lock out the mobile browser window panning engines completely
      className={`${GRID_THEME.viewportWrapper} ${className} select-none touch-none`}
      {...props}
      
      // Desktop Mouse Tracking
      onMouseDown={(e) => {
        if (e.button !== 0) return; // Only draw on primary left-click
        setIsDrawing(true);
      }}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}

      // Mobile Touchscreen Tracking
      onTouchStart={(e) => {
        e.preventDefault(); // Prevents default double-tap zoom behavior 
        setIsDrawing(true);
      }}
      onTouchEnd={stopDrawing}
      onTouchMove={(e) => {
        e.preventDefault(); // Forces the mobile view structure to process drawing coordinates instead of page scrolling
        const touch = e.touches[0];
        if (touch) {
          handlePointerMove(touch.clientX, touch.clientY);
        }
      }}
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
              onClick={(_e) => onCellClick(rowIndex, colIndex)}
              
              // Inject structural row/col attributes directly into the HTML node
              {...({
                "data-row": rowIndex,
                "data-col": colIndex
              } as React.HTMLAttributes<HTMLButtonElement>)}
            />
          ))
        )}
      </div>
    </div>
  );
};
