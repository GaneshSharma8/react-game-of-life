import type { CellState } from "../../types";

export const CELL_THEME_CLASSES: Record<CellState, string> = {
  alive: "bg-emerald-500 shadow-sm shadow-emerald-500/20",
  dead: "bg-slate-900 hover:bg-slate-700/50",
};

export const CELL_LABEL: Record<string, string> = {
  [CELL_THEME_CLASSES.alive]: 'Alive Cell',
  [CELL_THEME_CLASSES.dead]: 'Dead Cell',
}
