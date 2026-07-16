export default function LeavePage() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="glass-panel p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Leave Requests</h1>
          <p className="text-muted text-sm mt-1">Check your leave balance and apply for time off.</p>
        </div>
      </div>
      <div className="glass-panel p-12 text-center text-muted">
        Leave management will appear here.
      </div>
    </div>
  );
}
