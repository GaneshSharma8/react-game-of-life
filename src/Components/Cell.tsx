import type React from "react";

export type CellState = 'alive' | 'dead';

export interface ICellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state: CellState;
  onClick: () => void;
}

// Centralized Style Dictionary: Modify these classes to change the look globally
const CELL_THEME_CLASSES: Record<CellState, string> = {
  alive: "bg-emerald-500 shadow-sm shadow-emerald-500/20",
  dead: "bg-slate-900 hover:bg-slate-700/50",
};

const CELL_LABEL: Record<string, string> = {
  [CELL_THEME_CLASSES.alive]: 'Alive Cell',
  [CELL_THEME_CLASSES.dead]: 'Dead Cell',
}

export const Cell: React.FC<ICellProps> = ({
  onClick,
  state,
  className = '',
  ...props
}) => {
  // 2. Base structural size and interaction tokens
  const baseStyles = "w-3.5 h-3.5 transition-colors duration-100 border border-slate-800/40 rounded-sm focus:outline-none";
  const stateStyles = CELL_THEME_CLASSES[state];
  
  return (
    <button
      onClick={onClick}
      type="button"
      className={`${baseStyles} ${stateStyles} ${className}`}
      aria-label={CELL_LABEL[state]}
      {...props}
    />
  );
}
