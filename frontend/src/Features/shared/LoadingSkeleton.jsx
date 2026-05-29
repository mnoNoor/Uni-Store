export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse glass-card rounded-2xl overflow-hidden">
      <div className="bg-slate-200 aspect-[3/4]" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-5 bg-slate-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}
