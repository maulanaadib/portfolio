export default function Loading() {
  return (
    <div className="container-x py-32">
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="w-28 h-28 rounded-full mx-auto bg-[rgb(var(--card))] border-2 border-[rgb(var(--border))]" />
        <div className="mt-6 h-10 w-2/3 mx-auto rounded-lg bg-[rgb(var(--card))]" />
        <div className="mt-3 h-6 w-1/2 mx-auto rounded-lg bg-[rgb(var(--card))]" />
        <div className="mt-8 flex justify-center gap-3">
          <div className="h-10 w-32 rounded-lg bg-[rgb(var(--card))]" />
          <div className="h-10 w-32 rounded-lg bg-[rgb(var(--card))]" />
        </div>
      </div>
    </div>
  );
}
