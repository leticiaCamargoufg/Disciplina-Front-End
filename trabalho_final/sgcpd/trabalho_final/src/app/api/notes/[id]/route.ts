import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/current-user";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, date, categoryName, tagNames, status } = await req.json();

  // categoria (opcional)
  let categoryId: string | undefined = undefined;
  if (categoryName) {
    const c = await prisma.category.upsert({
      where: { userId_name: { userId: auth.uid, name: String(categoryName) } },
      create: { name: String(categoryName), userId: auth.uid },
      update: {},
    });
    categoryId = c.id;
  }

  const note = await prisma.note.update({
    where: { id: params.id },
    data: {
      title: title ?? undefined,
      content: content ?? undefined,
      date: date ? new Date(date) : undefined,
      status: status ?? undefined,
      categoryId,
    },
  });

  await prisma.noteTag.deleteMany({ where: { noteId: note.id } });
  if (Array.isArray(tagNames)) {
    for (const name of tagNames) {
      const t = await prisma.tag.upsert({
        where: { userId_name: { userId: auth.uid, name: String(name) } },
        create: { name: String(name), userId: auth.uid },
        update: {},
      });
      await prisma.noteTag.create({ data: { noteId: note.id, tagId: t.id } });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.note.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
