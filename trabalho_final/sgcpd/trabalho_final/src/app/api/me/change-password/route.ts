import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/current-user";
import { comparePassword, hashPassword } from "@/lib/hash";

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { currentPassword, newPassword } = await req.json();

  const u = await prisma.user.findUnique({ where: { id: auth.uid } });
  if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const ok = await comparePassword(currentPassword, u.passwordHash);
  if (!ok) return NextResponse.json({ error: "Senha atual inválida" }, { status: 400 });

  await prisma.user.update({
    where: { id: u.id },
    data: { passwordHash: await hashPassword(newPassword) }
  });

  return NextResponse.json({ ok: true });
}
