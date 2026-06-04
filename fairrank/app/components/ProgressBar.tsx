
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
      <progress
        className="progress-track"
        value={Math.min(Math.max(value, 0), maxValue)}
        max={maxValue}
        aria-label={label}
      />
    </div>
  );
}
