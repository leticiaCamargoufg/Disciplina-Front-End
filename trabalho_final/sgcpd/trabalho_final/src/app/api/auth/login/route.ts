import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/lib/validators";
import { comparePassword } from "@/lib/hash";
import { signJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.format(), { status: 400 });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });

  const token = signJwt({ uid: user.id, role: user.role });
  return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
