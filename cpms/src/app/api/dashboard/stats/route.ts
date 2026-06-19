import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    totalVendors,
    totalMaterials,
    activeProjects,
    pendingIndents,
    openPOs,
    totalSpend,
    recentPOs,
    recentIndents,
    vendorSpend,
    projectBudget,
  ] = await Promise.all([
    prisma.vendor.count({ where: { status: "ACTIVE" } }),
    prisma.material.count(),
    prisma.project.count({ where: { status: "ACTIVE" } }),
    prisma.materialIndent.count({ where: { status: { in: ["SUBMITTED", "DRAFT"] } } }),
    prisma.purchaseOrder.count({ where: { status: { in: ["DRAFT", "SENT", "ACKNOWLEDGED"] } } }),
    prisma.purchaseOrder.aggregate({ _sum: { grandTotal: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.purchaseOrder.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { vendor: true, project: true },
    }),
    prisma.materialIndent.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { project: true, raisedBy: true },
    }),
    // Spend by vendor (top 6)
    prisma.purchaseOrder.groupBy({
      by: ["vendorId"],
      _sum: { grandTotal: true },
      orderBy: { _sum: { grandTotal: "desc" } },
      take: 6,
      where: { status: { not: "CANCELLED" } },
    }),
    // Budget utilization per project
    prisma.project.findMany({
      where: { status: "ACTIVE" },
      include: {
        purchaseOrders: {
          where: { status: { not: "CANCELLED" } },
          select: { grandTotal: true },
        },
      },
    }),
  ]);

  // Enrich vendor spend with names
  const vendorIds = vendorSpend.map((v) => v.vendorId);
  const vendors   = await prisma.vendor.findMany({
    where: { id: { in: vendorIds } },
    select: { id: true, name: true },
  });
  const vendorMap = Object.fromEntries(vendors.map((v) => [v.id, v.name]));

  const spendByVendor = vendorSpend.map((v) => ({
    name:  vendorMap[v.vendorId] ?? "Unknown",
    spend: v._sum.grandTotal ?? 0,
  }));

  const projectUtil = projectBudget.map((p) => ({
    name:    p.name,
    budget:  p.budget,
    spent:   p.purchaseOrders.reduce((s, o) => s + o.grandTotal, 0),
    status:  p.status,
  }));

  return NextResponse.json({
    kpis: {
      totalVendors,
      totalMaterials,
      activeProjects,
      pendingIndents,
      openPOs,
      totalSpend: totalSpend._sum.grandTotal ?? 0,
    },
    recentPOs,
    recentIndents,
    spendByVendor,
    projectUtil,
  });
}
