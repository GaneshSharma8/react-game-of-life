export interface IGameGridProps extends React.HTMLAttributes<HTMLDivElement> {
  // A 2D array of ('alive' | 'dead')[][]
  grid: CellState[][]; 
  onCellClick: (row: number, col: number) => void;
  onCellDraw: (row: number, col: number) => void;
}

export type CellState = 'alive' | 'dead';

export interface ICellProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  state: CellState;
  // Allow React's standard onClick signature (MouseEventHandler) for <button>
  onClick: React.MouseEventHandler<HTMLButtonElement>; 
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

