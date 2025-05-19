import * as React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // from 0 to 100
}

export function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`w-full h-2 rounded bg-muted ${className || ''}`}
      {...props}
    >
      <div
        className="h-2 rounded bg-primary transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
