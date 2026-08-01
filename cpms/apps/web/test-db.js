const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'employee@cpms.com' },
  });
  console.log('User found:', user);
  if (user) {
    const valid = await bcrypt.compare('password123', user.password);
    console.log('Password valid:', valid);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
