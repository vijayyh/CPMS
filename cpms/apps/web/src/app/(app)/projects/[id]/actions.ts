"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProjectBudget(projectId: string, newBudget: number) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { budget: newBudget }
    });
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateProjectStatus(projectId: string, newStatus: any) {
  try {
    await prisma.project.update({
      where: { id: projectId },
      data: { status: newStatus }
    });
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function addLabourLog(projectId: string, labourType: string, count: number, rate: number) {
  try {
    await prisma.labour.create({
      data: {
        projectId,
        labourType,
        count,
        dailyRate: rate,
        totalCost: count * rate
      }
    });
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteLabourLog(logId: string, projectId: string) {
  try {
    await prisma.labour.delete({
      where: { id: logId }
    });
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
