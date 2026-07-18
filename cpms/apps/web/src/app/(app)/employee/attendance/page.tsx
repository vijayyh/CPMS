export default function AttendancePage() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="glass-panel p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Attendance</h1>
          <p className="text-muted text-sm mt-1">View your daily clock in/out history and working hours.</p>
        </div>
      </div>
      <div className="glass-panel p-12 text-center text-muted">
        Attendance history will appear here.
      </div>
    </div>
  );
}
