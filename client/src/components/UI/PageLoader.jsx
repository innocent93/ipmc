export default function PageLoader() {
  return (
    <div
      className="min-h-[60vh] w-full flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
        <span className="text-sm text-gray-400 tracking-wide">Loading…</span>
      </div>
    </div>
  );
}
