import type React from "react";
import type { ICellProps } from "../types";
import { CELL_LABEL, CELL_THEME_CLASSES } from "./ui/Cell.theme";

export const Cell: React.FC<ICellProps> = ({
  onClick,
  state,
  className = '',
  ...props
}) => {
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
