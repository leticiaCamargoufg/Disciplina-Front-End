import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ForgotSchema } from "@/lib/validators";
import crypto from "crypto";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ForgotSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.format(), { status: 400 });

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ ok: true }); // não revela se existe

  const token = crypto.randomBytes(32).toString("hex");
  const exp = new Date(Date.now() + 1000 * 60 * 30); // 30 min

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpires: exp }
  });

  // TODO: enviar email. Por enquanto retorno para facilitar testes
  return NextResponse.json({ ok: true, token });
}
