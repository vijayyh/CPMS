"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@cpms/utils";
import { updateTaskStatus } from "./actions";

type Task = {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: Date | null;
  progress: number;
};

export default function TaskList({ tasks: initialTasks }: { tasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isPending, startTransition] = useTransition();

  function toggle(task: Task) {
    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    startTransition(async () => {
      const res = await updateTaskStatus(task.id, nextStatus);
      if (res?.error) {
        toast.error(res.error);
        setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: task.status } : t)));
      }
    });
  }

  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: '32px 24px', gap: '32px' }}>
        <span className="text-muted font-medium text-sm">No tasks assigned for today.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ padding: '20px 24px', gap: '10px' }}>
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => toggle(task)}
          disabled={isPending}
          className="flex items-center rounded-xl bg-[var(--bg-card-solid)] hover:bg-[var(--bg-hover)] transition-all group cursor-pointer border border-[var(--bg-border-solid)] text-left"
          style={{ padding: '16px 20px', gap: '16px', opacity: task.status === "COMPLETED" ? 0.6 : 1 }}
        >
          <div className="shrink-0" style={{ color: task.status === "COMPLETED" ? "var(--color-success)" : "var(--text-muted)" }}>
            {task.status === "COMPLETED" ? <CheckCircle2 size={24} fill="currentColor" className="text-white dark:text-[var(--bg-card-solid)]" /> : <Circle size={24} />}
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <span className={`text-sm font-bold truncate ${task.status === "COMPLETED" ? "line-through text-muted" : "text-[var(--text-title)]"}`}>
              {task.title}
            </span>
            {task.description && <span className="text-xs text-muted truncate">{task.description}</span>}
            {task.dueDate && (
              <span className="text-[10px] text-muted font-black uppercase tracking-wide flex items-center" style={{ marginTop: '4px', gap: '6px' }}>
                <Clock size={12} className="shrink-0" /> Due {formatDate(task.dueDate)}
              </span>
            )}
          </div>
          <span className={`badge ${task.status === "COMPLETED" ? "badge-success" : task.status === "IN_PROGRESS" ? "badge-info" : "badge-muted"}`}>
            {task.status.replace("_", " ")}
          </span>
        </button>
      ))}
    </div>
  );
}
