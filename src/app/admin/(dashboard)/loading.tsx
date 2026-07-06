export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-9 w-48 rounded-lg bg-[rgb(var(--card))]" />
      <div className="mt-2 h-5 w-96 rounded bg-[rgb(var(--card))]" />
      <div className="mt-6 space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-4 h-20" />
        ))}
      </div>
    </div>
  );
}
