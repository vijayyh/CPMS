import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectClient from "./ProjectClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      manager: true,
      labourLogs: {
        orderBy: { date: 'desc' }
      },
      purchaseOrders: {
        include: { vendor: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!project) {
    return notFound();
  }

  return (
    <div className="dashboard-container animate-fade-in p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6">
      
      {/* Back & Header */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-sm font-bold text-muted hover:text-[var(--text-title)] transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <ProjectClient project={project} />

    </div>
  );
}
