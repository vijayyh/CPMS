"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateVendorStatus(vendorId: string, newStatus: "ACTIVE" | "INACTIVE" | "BLACKLISTED") {
  try {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { status: newStatus }
    });
    revalidatePath(`/admin/vendors/${vendorId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateVendorNotes(vendorId: string, notes: string) {
  try {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { notes }
    });
    revalidatePath(`/admin/vendors/${vendorId}`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
