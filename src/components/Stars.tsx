export function Rating({ value, count, compact }: { value: number; count: number; compact?: boolean }) {
  const full = Math.round(value);
  return (
    <span className="rating" aria-label={`Rated ${value} out of 5 from ${count} reviews`}>
      <span className="stars" aria-hidden="true">
        {'★'.repeat(full)}
        <span style={{ opacity: 0.3 }}>{'★'.repeat(5 - full)}</span>
      </span>
      <span>
        {value.toFixed(1)}
        {!compact && ` · ${count} reviews`}
        {compact && ` (${count})`}
      </span>
    </span>
  );
}
