import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/current-user";

export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const u = await prisma.user.findUnique({ where: { id: auth.uid } });
  if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role });
}

export async function PUT(req: NextRequest) {
  const auth = await getUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, email } = await req.json();

  const u = await prisma.user.update({
    where: { id: auth.uid },
    data: { name: name ?? undefined, email: email ?? undefined }
  });

  return NextResponse.json({ id: u.id, name: u.name, email: u.email, role: u.role });
}
export async function DELETE(req: NextRequest) {
  const auth = await getUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // (opcional) peça confirmação por senha atual:
  // const { currentPassword } = await req.json(); ... validar ...

  // graças ao onDelete: Cascade, isso remove notas/categorias/tags do usuário
  await prisma.user.delete({ where: { id: auth.uid } });

  // não retorna dados sensíveis
  return NextResponse.json({ ok: true });
}