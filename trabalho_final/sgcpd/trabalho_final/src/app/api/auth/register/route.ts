import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = RegisterSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json(parsed.error.format(), { status: 400 });

  const { name, email, password } = parsed.data;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });

  const passwordHash = await hashPassword(password);
  await prisma.user.create({ data: { name, email, passwordHash } });

  return NextResponse.json({ ok: true });
}
