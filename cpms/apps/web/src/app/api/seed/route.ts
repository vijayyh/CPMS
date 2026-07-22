import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const roles = [
      'ADMIN',
      'MANAGER',
      'PM',
      'SITE_ENGINEER',
      'PROCUREMENT',
      'ACCOUNTS',
      'VENDOR',
      'EMPLOYEE'
    ];
    const password = await bcrypt.hash('password123', 10);
    const credentials = [];

    for (const role of roles) {
      const email = `${role.toLowerCase()}@cpms.com`;
      
      const user = await prisma.user.upsert({
        where: { email },
        update: {
          password,
          name: `Dummy ${role}`,
          role: role as any,
        },
        create: {
          email,
          password,
          role: role as any,
          name: `Dummy ${role}`
        }
      });

      credentials.push({
        role: user.role,
        email: user.email,
        password: 'password123'
      });
    }

    return NextResponse.json({
      message: "Successfully created/updated dummy credentials",
      credentials
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
