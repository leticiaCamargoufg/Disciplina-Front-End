import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { UserUpdateSchema } from "@/lib/validators";

export async function GET(req: NextRequest, { params }: { params: { id: string }}) {
  const a = requireAuth(req);
  if ("error" in a) return a.error;
  const u = await prisma.user.findUnique({ where: { id: params.id } });
  if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string }}) {
  const a = requireAuth(req);
  if ("error" in a) return a.error;
  const body = await req.json();
  const parsed = UserUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.format(), { status: 400 });
  const u = await prisma.user.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string }}) {
  const a = requireAuth(req);
  if ("error" in a) return a.error;
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
