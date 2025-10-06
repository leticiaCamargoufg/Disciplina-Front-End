import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { RegisterSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/hash";

export async function GET(req: NextRequest) {
  const a = requireAuth(req);
  if ("error" in a) return a.error;
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })));
}

export async function POST(req: NextRequest) {
  const a = requireAuth(req);
  if ("error" in a) return a.error;
  const body = await req.json();
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.format(), { status: 400 });
  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email usado" }, { status: 409 });

  const passwordHash = await hashPassword(password);
  const u = await prisma.user.create({ data: { name, email, passwordHash } });
  return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role });
}
