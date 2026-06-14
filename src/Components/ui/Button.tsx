import type React from "react";

export type ButtonVariant = 'emerald' | 'amber' | 'slate'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "slate",
  icon,
  children,
  disabled,
  className = "",
  ...props
}) => {
  // 1. Core structural styling that applies to EVERY button
  const baseStyles = "flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium tracking-wide transition-all duration-200 shadow-md";
  
  // 2. Behavioral states (Scale down on click unless it's disabled)
  const motionStyles = disabled ? "cursor-not-allowed text-slate-500 bg-slate-700 border border-transparent" : "active:scale-95 text-white";

  // 3. Look-up table for color themes when active/enabled
  const variantStyles: Record<ButtonVariant, string> = {
    emerald: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30 border border-emerald-500/20",
    amber: "bg-amber-600 hover:bg-amber-500 shadow-amber-900/30 border border-amber-500/20",
    slate: "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600",
  };

  // Final class string, filtering out the default look if disabled
  const finalClassName = `${baseStyles} ${disabled ? motionStyles : `${variantStyles[variant]} ${motionStyles}`} ${className}`;

  return (
    <button disabled={disabled} className={finalClassName} {...props}>
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </button>
  );
}
