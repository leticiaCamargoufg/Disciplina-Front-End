import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/current-user";

export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const list = await prisma.tag.findMany({ where: { userId: auth.uid }, orderBy: { name: "asc" } });
  return NextResponse.json(list);
}
