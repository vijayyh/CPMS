export default function AnnouncementsPage() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="glass-panel p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-muted text-sm mt-1">Latest company updates, safety alerts, and notices.</p>
        </div>
      </div>
      <div className="glass-panel p-12 text-center text-muted">
        Announcements will appear here.
      </div>
    </div>
  );
}
