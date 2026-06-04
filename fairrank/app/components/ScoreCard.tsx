
interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon?: React.ReactNode;
  trust?: number;
}

export default function ScoreCard({
  title,
  score,
  maxScore = 100,
  icon,
  trust,
}: ScoreCardProps) {
  const color =
    score >= 75
      ? 'bg-green-500'
      : score >= 50
      ? 'bg-yellow-500'
      : 'bg-red-500';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>

      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">{score}</span>
          <span className="text-gray-500">/ {maxScore}</span>
        </div>
      </div>

      <progress
        className={`score-progress ${color} mb-2`}
        value={Math.min(Math.max(score, 0), maxScore)}
        max={maxScore}
        aria-label={`${title} score`}
      />

      {trust !== undefined && (
        <p className="text-xs text-gray-500">
          Confidence: {Math.round(trust)}%
        </p>
      )}
    </div>
  );
}
