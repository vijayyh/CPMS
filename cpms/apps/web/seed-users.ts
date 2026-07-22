import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const roles = Object.values(Role);
  const password = await bcrypt.hash('password123', 10);
  
  console.log('Creating dummy users for all roles...');

  const credentials: { role: string; email: string; pass: string }[] = [];

  for (const role of roles) {
    const email = `${role.toLowerCase()}@cpms.com`;
    
    // Upsert to avoid duplicate errors if run multiple times
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password, // Reset password to password123
        name: `Dummy ${role}`
      },
      create: {
        email,
        password,
        role,
        name: `Dummy ${role}`
      }
    });

    credentials.push({
      role: user.role,
      email: user.email,
      pass: 'password123'
    });
    
    console.log(`Created/Updated ${role}: ${email}`);
  }

  console.log('\n--- DUMMY CREDENTIALS CREATED ---');
  console.table(credentials);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
