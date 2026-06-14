export interface IGameGridProps extends React.HTMLAttributes<HTMLDivElement> {
  // A 2D array of ('alive' | 'dead')[][]
  grid: CellState[][]; 
  onCellClick: (row: number, col: number) => void;
}

export type CellState = 'alive' | 'dead';

export interface ICellProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  state: CellState;
  onClick: () => void;
}

export interface IControlPanelProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export type ButtonVariant = 'emerald' | 'amber' | 'slate'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: string;
  children: React.ReactNode;
}

export interface GameState {
  rows: number;
  cols: number;
  grid: CellState[][];
  isRunning: boolean;
}
