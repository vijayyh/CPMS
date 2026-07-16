export default function TasksPage() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="glass-panel p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Today's Tasks</h1>
          <p className="text-muted text-sm mt-1">Manage and update your daily assignments.</p>
        </div>
      </div>
      <div className="glass-panel p-12 text-center text-muted">
        Task list will appear here.
      </div>
    </div>
  );
}
