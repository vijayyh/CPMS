"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestLeave(data: { startDate: string; endDate: string; type: string; reason: string }) {
  const session = await auth();
  const userId = (session?.user as any)?.id;
  if (!userId) return { error: "Unauthorized" };

  if (!data.startDate || !data.endDate || !data.reason.trim()) {
    return { error: "All fields are required" };
  }
  if (new Date(data.endDate) < new Date(data.startDate)) {
    return { error: "End date must be after start date" };
  }

  await prisma.leaveRequest.create({
    data: {
      userId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      type: data.type as any,
      reason: data.reason.trim(),
    },
  });

  revalidatePath("/employee/leave");
  return { success: true };
}
