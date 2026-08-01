import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VendorClient from "./VendorClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function VendorProfilePage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const vendorId = resolvedParams.id;

  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      purchaseOrders: {
        include: { project: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!vendor) {
    return notFound();
  }

  return (
    <div className="dashboard-container animate-fade-in p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Back & Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/admin/dashboard"
          className="flex items-center gap-2 text-sm font-bold text-muted hover:text-[var(--text-title)] transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <VendorClient vendor={vendor} />

    </div>
  );
}
