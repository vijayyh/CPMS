import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL! });
const prisma   = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding CPMS database…");

  // ── Users ────────────────────────────────────────────────────────────────
  const hashedPw = await bcrypt.hash("admin123", 12);
  const pmPw     = await bcrypt.hash("pm123456", 12);

  const admin = await prisma.user.upsert({
    where:  { email: "admin@cpms.com" },
    update: {},
    create: { name: "Vijay H", email: "admin@cpms.com", password: hashedPw, role: "ADMIN" },
  });

  const pm1 = await prisma.user.upsert({
    where:  { email: "pm.rajesh@cpms.com" },
    update: {},
    create: { name: "Rajesh Kumar", email: "pm.rajesh@cpms.com", password: pmPw, role: "PM" },
  });

  const pm2 = await prisma.user.upsert({
    where:  { email: "pm.anita@cpms.com" },
    update: {},
    create: { name: "Anita Sharma", email: "pm.anita@cpms.com", password: pmPw, role: "PM" },
  });

  console.log("✅ Users created");

  // ── Vendors ──────────────────────────────────────────────────────────────
  const [v1, v2, v3, v4, v5, v6] = await Promise.all([
    prisma.vendor.upsert({
      where: { code: "VND-001" }, update: {},
      create: { name: "Ramesh Cement Distributors", code: "VND-001", contactName: "Ramesh Gupta", contactPhone: "+91 98765 11001", contactEmail: "ramesh@rcd.in", address: "Plot 45, Industrial Area Phase 1", city: "Mumbai", gstNumber: "27AAAAA0001A1Z5", rating: 4.5, status: "ACTIVE" },
    }),
    prisma.vendor.upsert({
      where: { code: "VND-002" }, update: {},
      create: { name: "Krishna Steel & TMT Bars", code: "VND-002", contactName: "Krishna Iyer", contactPhone: "+91 98765 22002", contactEmail: "iyer@krishnasteel.com", address: "NH-4, MIDC Industrial Zone", city: "Pune", gstNumber: "27AAAAA0002B1Z3", rating: 4.2, status: "ACTIVE" },
    }),
    prisma.vendor.upsert({
      where: { code: "VND-003" }, update: {},
      create: { name: "Sunrise Plywood & Timber", code: "VND-003", contactName: "Suresh Nair", contactPhone: "+91 98765 33003", contactEmail: "suresh@sunriseplywood.com", address: "Timber Market, Sector 11", city: "Bangalore", gstNumber: "29AAAAA0003C1Z1", rating: 3.8, status: "ACTIVE" },
    }),
    prisma.vendor.upsert({
      where: { code: "VND-004" }, update: {},
      create: { name: "Metro Tiles & Ceramics", code: "VND-004", contactName: "Priya Mehta", contactPhone: "+91 98765 44004", contactEmail: "priya@metrotiles.com", address: "Morbi Tile Hub, Industrial Plot 7", city: "Morbi", gstNumber: "24AAAAA0004D1Z9", rating: 4.7, status: "ACTIVE" },
    }),
    prisma.vendor.upsert({
      where: { code: "VND-005" }, update: {},
      create: { name: "National Sand & Aggregate", code: "VND-005", contactName: "Mohan Das", contactPhone: "+91 98765 55005", contactEmail: "mohan@nationalsand.com", address: "Quarry Road, Km 12", city: "Chennai", gstNumber: "33AAAAA0005E1Z7", rating: 3.5, status: "ACTIVE" },
    }),
    prisma.vendor.upsert({
      where: { code: "VND-006" }, update: {},
      create: { name: "ElectroFit Wiring Solutions", code: "VND-006", contactName: "Farhan Khan", contactPhone: "+91 98765 66006", contactEmail: "farhan@electrofit.in", address: "Electronics Hub, Building C", city: "Hyderabad", gstNumber: "36AAAAA0006F1Z5", rating: 4.1, status: "ACTIVE" },
    }),
  ]);

  console.log("✅ Vendors created");

  // ── Materials ────────────────────────────────────────────────────────────
  const materials = await Promise.all([
    prisma.material.upsert({ where: { code: "CEM-001" }, update: {}, create: { name: "OPC 53 Grade Cement", code: "CEM-001", category: "STRUCTURAL", unit: "BAG", description: "50 kg bag, Ultratech/ACC brand", hsn: "2523" } }),
    prisma.material.upsert({ where: { code: "STL-001" }, update: {}, create: { name: "Fe 500 TMT Steel Bar 12mm", code: "STL-001", category: "STRUCTURAL", unit: "TONNE", description: "Tor steel, Fe-500 grade", hsn: "7214" } }),
    prisma.material.upsert({ where: { code: "STL-002" }, update: {}, create: { name: "Fe 500 TMT Steel Bar 16mm", code: "STL-002", category: "STRUCTURAL", unit: "TONNE", description: "Tor steel, Fe-500 grade", hsn: "7214" } }),
    prisma.material.upsert({ where: { code: "SND-001" }, update: {}, create: { name: "M-Sand (Manufactured Sand)", code: "SND-001", category: "STRUCTURAL", unit: "CUBIC_MT", description: "Washed M-Sand for concrete", hsn: "2505" } }),
    prisma.material.upsert({ where: { code: "AGG-001" }, update: {}, create: { name: "20mm Crushed Aggregate", code: "AGG-001", category: "STRUCTURAL", unit: "CUBIC_MT", description: "Granite crush 20mm down", hsn: "2517" } }),
    prisma.material.upsert({ where: { code: "PLY-001" }, update: {}, create: { name: "Shuttering Plywood 18mm", code: "PLY-001", category: "STRUCTURAL", unit: "PIECE", description: "18mm phenol formaldehyde plywood for formwork", hsn: "4412" } }),
    prisma.material.upsert({ where: { code: "TIL-001" }, update: {}, create: { name: "Vitrified Floor Tile 600x600mm", code: "TIL-001", category: "FINISHING", unit: "SQFT", description: "Double charge vitrified, 24x24 inch", hsn: "6907" } }),
    prisma.material.upsert({ where: { code: "TIL-002" }, update: {}, create: { name: "Wall Tile 300x600mm Glossy", code: "TIL-002", category: "FINISHING", unit: "SQFT", description: "Ceramic wall tile, glossy finish", hsn: "6907" } }),
    prisma.material.upsert({ where: { code: "PNT-001" }, update: {}, create: { name: "Exterior Emulsion Paint 20L", code: "PNT-001", category: "FINISHING", unit: "PIECE", description: "Weathershield exterior emulsion", hsn: "3209" } }),
    prisma.material.upsert({ where: { code: "ELC-001" }, update: {}, create: { name: "PVC Conduit Pipe 25mm", code: "ELC-001", category: "ELECTRICAL", unit: "METER", description: "ISI marked PVC rigid conduit", hsn: "3917" } }),
    prisma.material.upsert({ where: { code: "ELC-002" }, update: {}, create: { name: "Copper Wiring 4 sq mm", code: "ELC-002", category: "ELECTRICAL", unit: "METER", description: "FR PVC insulated copper wire", hsn: "8544" } }),
    prisma.material.upsert({ where: { code: "PLM-001" }, update: {}, create: { name: "CPVC Pipe 25mm", code: "PLM-001", category: "PLUMBING", unit: "METER", description: "Astral/Prince CPVC pipe SDR-11", hsn: "3917" } }),
  ]);

  console.log("✅ Materials created");

  // ── Contracts ────────────────────────────────────────────────────────────
  const thirtyDays  = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const ninetyDays  = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  const yearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  await Promise.all([
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v1.id, materialId: materials[0].id } }, update: {},
      create: { vendorId: v1.id, materialId: materials[0].id, negotiatedRate: 380, minOrderQty: 100, validFrom: new Date(), validTo: yearFromNow },
    }),
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v2.id, materialId: materials[1].id } }, update: {},
      create: { vendorId: v2.id, materialId: materials[1].id, negotiatedRate: 58000, minOrderQty: 5, validFrom: new Date(), validTo: yearFromNow },
    }),
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v2.id, materialId: materials[2].id } }, update: {},
      create: { vendorId: v2.id, materialId: materials[2].id, negotiatedRate: 60000, minOrderQty: 5, validFrom: new Date(), validTo: yearFromNow },
    }),
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v5.id, materialId: materials[3].id } }, update: {},
      create: { vendorId: v5.id, materialId: materials[3].id, negotiatedRate: 1800, minOrderQty: 10, validFrom: new Date(), validTo: ninetyDays },
    }),
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v5.id, materialId: materials[4].id } }, update: {},
      create: { vendorId: v5.id, materialId: materials[4].id, negotiatedRate: 1400, minOrderQty: 10, validFrom: new Date(), validTo: ninetyDays },
    }),
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v3.id, materialId: materials[5].id } }, update: {},
      create: { vendorId: v3.id, materialId: materials[5].id, negotiatedRate: 1200, minOrderQty: 20, validFrom: new Date(), validTo: yearFromNow },
    }),
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v4.id, materialId: materials[6].id } }, update: {},
      create: { vendorId: v4.id, materialId: materials[6].id, negotiatedRate: 48, minOrderQty: 500, validFrom: new Date(), validTo: yearFromNow },
    }),
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v4.id, materialId: materials[7].id } }, update: {},
      create: { vendorId: v4.id, materialId: materials[7].id, negotiatedRate: 36, minOrderQty: 500, validFrom: new Date(), validTo: yearFromNow },
    }),
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v6.id, materialId: materials[9].id } }, update: {},
      create: { vendorId: v6.id, materialId: materials[9].id, negotiatedRate: 95, minOrderQty: 100, validFrom: new Date(), validTo: yearFromNow },
    }),
    prisma.vendorContract.upsert({
      where: { vendorId_materialId: { vendorId: v6.id, materialId: materials[10].id } }, update: {},
      create: { vendorId: v6.id, materialId: materials[10].id, negotiatedRate: 55, minOrderQty: 200, validFrom: new Date(), validTo: yearFromNow },
    }),
  ]);

  console.log("✅ Contracts created");

  // ── Projects ─────────────────────────────────────────────────────────────
  const [proj1, proj2, proj3] = await Promise.all([
    prisma.project.upsert({
      where: { code: "PROJ-001" }, update: {},
      create: {
        name: "Greenfield Residential Tower A",
        code: "PROJ-001",
        location: "Whitefield, Bangalore",
        client: "Prestige Developers",
        budget: 75000000,
        startDate: new Date("2024-01-15"),
        endDate: new Date("2026-12-31"),
        status: "ACTIVE",
        managerId: pm1.id,
        description: "G+12 residential tower, 120 apartments, full civil & MEP work",
      },
    }),
    prisma.project.upsert({
      where: { code: "PROJ-002" }, update: {},
      create: {
        name: "NH-48 Overpass Bridge",
        code: "PROJ-002",
        location: "Pune-Mumbai Expressway, Km 34",
        client: "NHAI",
        budget: 180000000,
        startDate: new Date("2024-03-01"),
        endDate: new Date("2027-03-01"),
        status: "ACTIVE",
        managerId: pm2.id,
        description: "4-lane road overpass, RCC construction",
      },
    }),
    prisma.project.upsert({
      where: { code: "PROJ-003" }, update: {},
      create: {
        name: "Sunrise Commercial Complex",
        code: "PROJ-003",
        location: "Andheri East, Mumbai",
        client: "Sunrise Realty Pvt Ltd",
        budget: 55000000,
        startDate: new Date("2024-06-01"),
        status: "PLANNING",
        description: "B+G+8 commercial complex with basement parking",
      },
    }),
  ]);

  console.log("✅ Projects created");

  // ── Purchase Orders ───────────────────────────────────────────────────────
  const po1 = await prisma.purchaseOrder.upsert({
    where: { poNumber: "PO-SEED001" }, update: {},
    create: {
      poNumber: "PO-SEED001",
      vendorId: v1.id,
      projectId: proj1.id,
      createdById: admin.id,
      status: "RECEIVED",
      totalAmount: 1140000,
      taxAmount: 205200,
      grandTotal: 1345200,
      expectedDate: new Date("2024-02-15"),
      deliveryAddress: "Greenfield Tower A, Whitefield",
      paymentTerms: "30 days net",
      lineItems: {
        create: [{
          materialId: materials[0].id,
          quantity: 3000,
          unitRate: 380,
          taxPercent: 18,
          amount: 1140000,
          taxAmount: 205200,
          totalAmount: 1345200,
          receivedQty: 3000,
        }],
      },
    },
  });

  const po2 = await prisma.purchaseOrder.upsert({
    where: { poNumber: "PO-SEED002" }, update: {},
    create: {
      poNumber: "PO-SEED002",
      vendorId: v2.id,
      projectId: proj1.id,
      createdById: admin.id,
      status: "RECEIVED",
      totalAmount: 580000,
      taxAmount: 104400,
      grandTotal: 684400,
      expectedDate: new Date("2024-02-20"),
      deliveryAddress: "Greenfield Tower A, Whitefield",
      lineItems: {
        create: [{
          materialId: materials[1].id,
          quantity: 10,
          unitRate: 58000,
          taxPercent: 18,
          amount: 580000,
          taxAmount: 104400,
          totalAmount: 684400,
          receivedQty: 10,
        }],
      },
    },
  });

  const po3 = await prisma.purchaseOrder.upsert({
    where: { poNumber: "PO-SEED003" }, update: {},
    create: {
      poNumber: "PO-SEED003",
      vendorId: v4.id,
      projectId: proj1.id,
      createdById: admin.id,
      status: "SENT",
      totalAmount: 768000,
      taxAmount: 138240,
      grandTotal: 906240,
      expectedDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      deliveryAddress: "Greenfield Tower A, Whitefield",
      lineItems: {
        create: [{
          materialId: materials[6].id,
          quantity: 16000,
          unitRate: 48,
          taxPercent: 18,
          amount: 768000,
          taxAmount: 138240,
          totalAmount: 906240,
        }],
      },
    },
  });

  const po4 = await prisma.purchaseOrder.upsert({
    where: { poNumber: "PO-SEED004" }, update: {},
    create: {
      poNumber: "PO-SEED004",
      vendorId: v5.id,
      projectId: proj2.id,
      createdById: admin.id,
      status: "RECEIVED",
      totalAmount: 1800000,
      taxAmount: 324000,
      grandTotal: 2124000,
      expectedDate: new Date("2024-04-01"),
      deliveryAddress: "NH-48 Bridge Site, Km 34",
      lineItems: {
        create: [
          { materialId: materials[3].id, quantity: 500, unitRate: 1800, taxPercent: 18, amount: 900000, taxAmount: 162000, totalAmount: 1062000, receivedQty: 500 },
          { materialId: materials[4].id, quantity: 643, unitRate: 1400, taxPercent: 18, amount: 900200, taxAmount: 162036, totalAmount: 1062236, receivedQty: 643 },
        ],
      },
    },
  });

  console.log("✅ Purchase Orders created");

  // ── GRNs ─────────────────────────────────────────────────────────────────
  await prisma.goodsReceipt.upsert({
    where: { grnNumber: "GRN-SEED001" }, update: {},
    create: {
      grnNumber: "GRN-SEED001",
      poId: po1.id,
      createdById: admin.id,
      status: "CONFIRMED",
      receivedDate: new Date("2024-02-16"),
      vehicleNo: "MH 01 AB 1234",
      driverName: "Suresh More",
      invoiceNo: "RCD/24/001245",
      items: {
        create: [{
          materialId: materials[0].id,
          orderedQty: 3000,
          receivedQty: 3000,
          acceptedQty: 3000,
          rejectedQty: 0,
          unitRate: 380,
          totalAmount: 1140000,
        }],
      },
    },
  });

  // ── Site Inventory ─────────────────────────────────────────────────────
  await Promise.all([
    prisma.siteInventory.upsert({
      where: { projectId_materialId: { projectId: proj1.id, materialId: materials[0].id } }, update: {},
      create: { projectId: proj1.id, materialId: materials[0].id, currentStock: 1200, consumedStock: 1800, unit: "BAG" },
    }),
    prisma.siteInventory.upsert({
      where: { projectId_materialId: { projectId: proj1.id, materialId: materials[1].id } }, update: {},
      create: { projectId: proj1.id, materialId: materials[1].id, currentStock: 4, consumedStock: 6, unit: "TONNE" },
    }),
    prisma.siteInventory.upsert({
      where: { projectId_materialId: { projectId: proj2.id, materialId: materials[3].id } }, update: {},
      create: { projectId: proj2.id, materialId: materials[3].id, currentStock: 180, consumedStock: 320, unit: "CUBIC_MT" },
    }),
    prisma.siteInventory.upsert({
      where: { projectId_materialId: { projectId: proj2.id, materialId: materials[4].id } }, update: {},
      create: { projectId: proj2.id, materialId: materials[4].id, currentStock: 230, consumedStock: 413, unit: "CUBIC_MT" },
    }),
  ]);

  // ── Labour Logs ──────────────────────────────────────────────────────────
  const labourEntries = [
    { projectId: proj1.id, date: new Date("2024-05-20"), labourType: "Mason",      count: 18, dailyRate: 700 },
    { projectId: proj1.id, date: new Date("2024-05-21"), labourType: "Helper",     count: 30, dailyRate: 500 },
    { projectId: proj1.id, date: new Date("2024-05-22"), labourType: "Carpenter",  count: 8,  dailyRate: 750 },
    { projectId: proj1.id, date: new Date("2024-05-23"), labourType: "Steel Fixer",count: 12, dailyRate: 720 },
    { projectId: proj2.id, date: new Date("2024-05-20"), labourType: "Mason",      count: 25, dailyRate: 700 },
    { projectId: proj2.id, date: new Date("2024-05-21"), labourType: "Helper",     count: 40, dailyRate: 500 },
    { projectId: proj2.id, date: new Date("2024-05-22"), labourType: "Electrician",count: 6,  dailyRate: 800 },
  ];

  for (const entry of labourEntries) {
    await prisma.labour.create({
      data: {
        ...entry,
        totalCost: entry.count * entry.dailyRate,
        supervisorName: "Site Incharge",
      },
    }).catch(() => {}); // skip if already exists
  }

  // ── Material Indents ─────────────────────────────────────────────────────
  await prisma.materialIndent.upsert({
    where: { indentNo: "IND-SEED001" }, update: {},
    create: {
      indentNo: "IND-SEED001",
      projectId: proj1.id,
      raisedById: pm1.id,
      approvedById: admin.id,
      status: "APPROVED",
      urgency: "HIGH",
      requiredBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: "Urgent requirement for floor 5 slab work",
      items: {
        create: [
          { materialId: materials[0].id, requestedQty: 500, approvedQty: 500, unit: "BAG" },
          { materialId: materials[1].id, requestedQty: 3, approvedQty: 3, unit: "TONNE" },
        ],
      },
    },
  });

  await prisma.materialIndent.upsert({
    where: { indentNo: "IND-SEED002" }, update: {},
    create: {
      indentNo: "IND-SEED002",
      projectId: proj2.id,
      raisedById: pm2.id,
      status: "SUBMITTED",
      urgency: "NORMAL",
      requiredBy: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      notes: "Foundation footing work — Phase 2",
      items: {
        create: [
          { materialId: materials[3].id, requestedQty: 80, unit: "CUBIC_MT" },
          { materialId: materials[4].id, requestedQty: 60, unit: "CUBIC_MT" },
        ],
      },
    },
  });

  console.log("✅ Indents created");
  console.log("\n🎉 CPMS database seeded successfully!");
  console.log("\n🔑 Login Credentials:");
  console.log("   Admin:  admin@cpms.com / admin123");
  console.log("   PM:     pm.rajesh@cpms.com / pm123456");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
