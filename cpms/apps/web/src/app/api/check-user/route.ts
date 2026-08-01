import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'employee@cpms.com' },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found in DB" }, { status: 404 });
    }

    const isValid = await bcrypt.compare('password123', user.password);

    return NextResponse.json({
      message: "User found",
      user,
      passwordValid: isValid,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
