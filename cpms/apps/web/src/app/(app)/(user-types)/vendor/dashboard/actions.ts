"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVendorDashboardData() {
  const session = await auth();
  
  if (!session?.user?.email || (session.user as any).role !== "VENDOR") {
    return { error: "Unauthorized access or missing email" };
  }

  try {
    const vendor = await prisma.vendor.findFirst({
      where: { contactEmail: session.user.email },
      include: {
        contracts: true,
        purchaseOrders: {
          include: {
            project: { select: { name: true } },
            lineItems: { select: { amount: true, quantity: true, material: { select: { name: true, unit: true } } } },
          },
          orderBy: { createdAt: 'desc' }
        },
      }
    });

    if (!vendor) {
      return { error: "No vendor profile found for your account. Please contact support." };
    }

    const recentRequests = vendor.purchaseOrders.filter(po => po.status === 'SENT' || po.status === 'ACKNOWLEDGED');
    
    // Stats
    const activeContractsCount = vendor.contracts.filter(c => c.isActive).length;
    const pendingRequestsCount = vendor.purchaseOrders.filter(po => po.status === 'SENT').length;
    const totalOrderValue = vendor.purchaseOrders.reduce((acc, po) => acc + po.grandTotal, 0);

    return {
      vendor,
      recentRequests,
      activeContractsCount,
      pendingRequestsCount,
      totalOrderValue,
    };
  } catch (error: any) {
    console.error("Vendor data error:", error);
    return { error: "Failed to fetch vendor data" };
  }
}

export async function acknowledgePurchaseOrder(poId: string) {
  const session = await auth();
  
  if (!session?.user?.email || (session.user as any).role !== "VENDOR") {
    return { error: "Unauthorized" };
  }

  try {
    const vendor = await prisma.vendor.findFirst({
      where: { contactEmail: session.user.email },
    });

    if (!vendor) {
      return { error: "Vendor profile not found" };
    }

    const po = await prisma.purchaseOrder.findUnique({
      where: { id: poId }
    });

    if (!po || po.vendorId !== vendor.id || po.status !== 'SENT') {
      return { error: "Invalid purchase order" };
    }

    await prisma.purchaseOrder.update({
      where: { id: poId },
      data: { status: 'ACKNOWLEDGED' }
    });

    revalidatePath("/vendor/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Acknowledge PO error:", error);
    return { error: "Failed to acknowledge PO" };
  }
}
