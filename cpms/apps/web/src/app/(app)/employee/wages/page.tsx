export default function WagesPage() {
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="glass-panel p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Daily Wages & Salary</h1>
          <p className="text-muted text-sm mt-1">Track your earnings and download payslips.</p>
        </div>
      </div>
      <div className="glass-panel p-12 text-center text-muted">
        Wage information will appear here.
      </div>
    </div>
  );
}
