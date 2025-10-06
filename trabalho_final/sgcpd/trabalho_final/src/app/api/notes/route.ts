import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/current-user";

export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q") || undefined;
  const category = req.nextUrl.searchParams.get("category") || undefined;
  const tag = req.nextUrl.searchParams.get("tag") || undefined;
  const status = req.nextUrl.searchParams.get("status") || undefined;

  const notes = await prisma.note.findMany({
    where: {
      userId: auth.uid,
      ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { content: { contains: q, mode: "insensitive" } }] } : {}),
      ...(category ? { category: { name: category, userId: auth.uid } } : {}),
      ...(status ? { status: status as any } : {}),
      ...(tag ? { tags: { some: { tag: { name: tag, userId: auth.uid } } } } : {}),
    },
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    notes.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      date: n.date,
      status: n.status,
      category: n.category?.name || null,
      tags: n.tags.map(t => ({ id: t.tagId, name: t.tag.name })),
    }))
  );
}

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, date, categoryName, tagNames, status } = await req.json();

  if (!title || !String(title).trim()) {
    return NextResponse.json({ error: "Título é obrigatório" }, { status: 400 });
  }

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

  // cria nota
  const note = await prisma.note.create({
    data: {
      title: String(title),
      content: content ? String(content) : null,
      date: date ? new Date(date) : undefined,
      status: status ?? null, // se tiver enum
      userId: auth.uid,
      categoryId,
    },
  });

  // tags (opcionais)
  if (Array.isArray(tagNames) && tagNames.length) {
    for (const name of tagNames) {
      const t = await prisma.tag.upsert({
        where: { userId_name: { userId: auth.uid, name: String(name) } },
        create: { name: String(name), userId: auth.uid },
        update: {},
      });
      await prisma.noteTag.create({ data: { noteId: note.id, tagId: t.id } });
    }
  }

  return NextResponse.json({ id: note.id }, { status: 201 });
}
