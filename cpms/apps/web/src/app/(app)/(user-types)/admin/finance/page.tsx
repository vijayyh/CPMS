import { prisma } from "@/lib/prisma";
import FinanceClient from "./FinanceClient";

export default async function FinanceDashboardPage() {
  const projects = await prisma.project.findMany({
    orderBy: { budget: 'desc' },
    take: 5,
    include: {
      labourLogs: true,
      purchaseOrders: {
        include: {
          lineItems: true
        }
      }
    }
  });

  const vendors = await prisma.vendor.findMany({
    orderBy: { rating: 'desc' },
    take: 5,
    include: {
      purchaseOrders: true
    }
  });

  const processedProjects = projects.map(p => {
    const labourSpend = p.labourLogs.reduce((acc, l) => acc + l.totalCost, 0);
    const poSpend = p.purchaseOrders.reduce((acc, po) => acc + po.grandTotal, 0);
    return {
      ...p,
      spent: labourSpend + poSpend
    };
  });

  const processedVendors = vendors.map(v => {
    const spend = v.purchaseOrders.reduce((acc, po) => acc + po.grandTotal, 0);
    return {
      ...v,
      spend
    };
  });

  return <FinanceClient projects={processedProjects} vendors={processedVendors} />;
}
