export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-lg p-4 shadow-sm">
      <div className="bg-gray-200 h-40 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  );
}
