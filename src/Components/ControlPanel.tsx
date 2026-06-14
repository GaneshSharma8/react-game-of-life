import type React from "react";
import { Button } from "./ui/Button";
import type { IControlPanelProps } from "../types";


export const ControlPanel: React.FC<IControlPanelProps> = ({
  isRunning,
  onStart,
  onStop,
  onReset,
}) => {
  return (
    <div className="w-full max-w-md mx-auto mb-6 p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="emerald"
          icon="▶"
          onClick={onStart}
          disabled={isRunning}
          aria-label="Start Simulation"
        >
          Start
        </Button>

        <Button
          variant="amber"
          icon="⏸"
          onClick={onStop}
          disabled={!isRunning}
          aria-label="Stop Simulation"
        >
          Stop
        </Button>

        <Button
          variant="slate"
          icon="↻"
          onClick={onReset}
          aria-label="Reset Simulation"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
