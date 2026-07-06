export function MiniSparkline({ data, color = "#2a78d6" }: { data: number[]; color?: string }) {
  const width = 96;
  const height = 28;

  if (data.length < 2 || data.every((v) => v === 0)) {
    return <svg width={width} height={height} aria-hidden />;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} aria-hidden className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
