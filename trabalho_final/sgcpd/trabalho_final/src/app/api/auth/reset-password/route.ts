import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ResetSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ResetSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.format(), { status: 400 });

  const { token, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: { gt: new Date() }
    }
  });

  if (!user) return NextResponse.json({ error: "Token inválido/expirado" }, { status: 400 });

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(password), resetToken: null, resetTokenExpires: null }
  });

  return NextResponse.json({ ok: true });
}
