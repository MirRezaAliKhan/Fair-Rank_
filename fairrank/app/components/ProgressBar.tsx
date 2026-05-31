import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  maxValue?: number;
  showPercent?: boolean;
}

export default function ProgressBar({
  label,
  value,
  maxValue = 100,
  showPercent = true,
}: ProgressBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {showPercent && (
          <span className="text-sm font-semibold text-gray-900">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
