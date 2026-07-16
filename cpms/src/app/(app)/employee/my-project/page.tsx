export default function MyProjectPage() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="glass-panel p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Assigned Project</h1>
          <p className="text-muted text-sm mt-1">Details about your current working site.</p>
        </div>
      </div>
      <div className="glass-panel p-12 text-center text-muted">
        Project details will appear here.
      </div>
    </div>
  );
}
