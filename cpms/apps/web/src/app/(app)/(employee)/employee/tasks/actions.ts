"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(taskId: string, status: "PENDING" | "IN_PROGRESS" | "COMPLETED") {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return { error: "Unauthorized" };

  const task = await prisma.employeeTask.findUnique({ where: { id: taskId } });
  if (!task || task.userId !== userId) return { error: "Task not found" };

  await prisma.employeeTask.update({
    where: { id: taskId },
    data: { status, progress: status === "COMPLETED" ? 100 : task.progress },
  });

  revalidatePath("/employee/tasks");
  revalidatePath("/employee/dashboard");
  return { success: true };
}
