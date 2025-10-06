"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import NoteCard from "@/components/NoteCard";
import Fab from "@/components/Fab";
import Modal from "@/components/Modal";
import Toast from "@/components/Toast";
import TagPill from "@/components/TagPill";

type Note = {
  id: string;
  title: string;
  content?: string;
  date: string;
  status?: "todo" | "doing" | "done";
  category: string | null;
  tags: { id: string; name: string }[];
};

export default function Dashboard() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

  const auth: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [tag, setTag] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  
  const [view, setView] = useState<Note | null>(null);
  const [edit, setEdit] = useState<Note | null>(null);
  const [del, setDel] = useState<Note | null>(null);
  const [toast, setToast] = useState<string>("");
  const params = useMemo(() => {
    const s = new URLSearchParams();
    if (q) s.set("q", q);
    if (category) s.set("category", category);
    if (tag) s.set("tag", tag);
    if (status) s.set("status", status);
    return s.toString();
  }, [q, category, tag, status]);

  const load = async () => {
    const r = await fetch(`/api/notes${params ? `?${params}` : ""}`, {
      headers: { ...auth },
    });
    if (r.ok) setNotes(await r.json());
    else location.href = "/";
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // criar/editar
  const save = async (data: {
    id?: string;
    title: string;
    content?: string;
    categoryName?: string | null;
    tagNames?: string[];
    date?: string;
    status?: string;
  }) => {
    if (!data.title.trim()) return setToast("Título é obrigatório");
    const method = data.id ? "PUT" : "POST";
    const url = data.id ? `/api/notes/${data.id}` : "/api/notes";
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify(data),
    });
    if (r.ok) {
      setToast(data.id ? "Nota atualizada" : "Nota criada");
      setEdit(null);
      await load();
    } else setToast("Erro ao salvar");
  };

  const remove = async () => {
    if (!del) return;
    const r = await fetch(`/api/notes/${del.id}`, {
      method: "DELETE",
      headers: { ...auth },
    });
    if (r.ok) {
      setToast("Nota excluída");
      setDel(null);
      await load();
    } else setToast("Erro ao excluir");
  };

  // Filtros (Categoria, Tag, Status)
  const FilterBar = () => (
    <div className="flex items-center gap-3 mb-4">
      <select
        value={category ?? ""}
        onChange={(e) => setCategory(e.target.value || undefined)}
        className="
          px-3 py-2 rounded-lg
          bg-white border border-slate-300
          text-slate-800
          focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
          shadow-sm
        "
      >
        <option value="">Categoria</option>
        {/* gera dinâmico a partir das notas carregadas */}
        {[...new Set(notes.map((n) => n.category).filter(Boolean))].map((c) => (
          <option key={c as string} value={c as string}>
            {c as string}
          </option>
        ))}
      </select>

      <select
        value={tag ?? ""}
        onChange={(e) => setTag(e.target.value || undefined)}
        className="
          px-3 py-2 rounded-lg
          bg-white border border-slate-300
          text-slate-800
          focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
          shadow-sm
        "
      >
        <option value="">Tag</option>
        {[...new Set(notes.flatMap((n) => n.tags.map((t) => t.name)))].map(
          (t) => (
            <option key={t} value={t}>
              {t}
            </option>
          )
        )}
      </select>

      <select
        value={status ?? ""}
        onChange={(e) => setStatus(e.target.value || undefined)}
        className="
          px-3 py-2 rounded-lg
          bg-white border border-slate-300
          text-slate-800
          focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
          shadow-sm
        "
      >
        <option value="">Status</option>
        <option value="todo">A Fazer</option>
        <option value="doing">Fazendo</option>
        <option value="done">Concluída</option>
      </select>

      <button
        onClick={() => {
          setCategory(undefined);
          setTag(undefined);
          setStatus(undefined);
          setQ("");
        }}
        className="text-sm text-slate-600 underline"
      >
        Limpar
      </button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col">
      <Topbar onSearch={(v) => setQ(v)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <FilterBar />

          {notes.length === 0 ? (
            <div className="h-[70vh] grid place-content-center">
              <div className="text-center">
                <div className="text-[#0e5cc4] font-bold text-lg mb-2">
                  NOTAS NÃO ENCONTRADAS
                </div>
                <button
                  onClick={() =>
                    setEdit({
                      id: "",
                      title: "",
                      content: "",
                      date: new Date().toISOString(),
                      category: null,
                      tags: [],
                    })
                  }
                  className="mt-3 px-4 py-2 rounded bg-[#0e87ff] text-white"
                >
                  Criar Nota
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {notes.map((n) => (
                <NoteCard
                  key={n.id}
                  title={n.title}
                  content={n.content}
                  date={n.date}
                  tags={n.tags}
                  onOpen={() => setView(n)}
                  onEdit={() => setEdit(n)}
                  onDelete={() => setDel(n)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FAB */}
      <Fab
        onClick={() =>
          setEdit({
            id: "",
            title: "",
            content: "",
            date: new Date().toISOString(),
            category: null,
            tags: [],
          })
        }
      />

      {/* Modal Visualizar */}
      <Modal
        open={!!view}
        onClose={() => setView(null)}
        title={view?.title || ""}
        footer={
          <button
            onClick={() => setView(null)}
            className="px-4 py-2 rounded bg-slate-500 text-white"
          >
            Voltar
          </button>
        }
      >
        {view && (
          <div className="space-y-4">
            <div className="text-sm text-right text-slate-500">
              Criado: {new Date(view.date).toLocaleDateString()}
            </div>
            {view.content && <p className="text-slate-700">{view.content}</p>}
            <div>
              <div className="text-sm text-slate-600 mb-2">Tags</div>
              <div className="flex gap-2 flex-wrap">
                {view.tags.map((t) => (
                  <TagPill key={t.id}>{t.name}</TagPill>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Editar / Criar */}
      <Modal
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? "Editar" : "Nova Nota"}
        footer={
          <>
            <button
              onClick={() => setEdit(null)}
              className="px-4 py-2 rounded bg-slate-500 text-white"
            >
              Voltar
            </button>
            <button
              onClick={() => {
                if (!edit) return;
                const payload = {
                  id: edit.id || undefined,
                  title: (document.getElementById("f-title") as HTMLInputElement)
                    .value,
                  content: (
                    document.getElementById("f-content") as HTMLTextAreaElement
                  ).value,
                  categoryName: (
                    document.getElementById("f-category") as HTMLInputElement
                  ).value || null,
                  tagNames: (
                    document.getElementById("f-tags") as HTMLInputElement
                  )
                    .value.split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  status: (
                    document.getElementById("f-status") as HTMLSelectElement
                  )?.value || undefined,
                  date:
                    (
                      document.getElementById("f-date") as HTMLInputElement
                    ).value || undefined,
                };
                save(payload);
              }}
              className="px-4 py-2 rounded bg-emerald-600 text-white"
            >
              Salvar
            </button>
          </>
        }
      >
        {edit && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Título
              </label>
              <input
                id="f-title"
                defaultValue={edit.title}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                           text-slate-800 placeholder:text-slate-400
                           focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                           shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Descrição
              </label>
              <textarea
                id="f-content"
                defaultValue={edit.content}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                           text-slate-800 placeholder:text-slate-400
                           focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                           shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tags (separe por vírgula)
                </label>
                <input
                  id="f-tags"
                  defaultValue={edit.tags?.map((t) => t.name).join(", ")}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                             shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Categoria
                </label>
                <input
                  id="f-category"
                  defaultValue={edit.category ?? ""}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                             shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Status
                </label>
                <select
                  id="f-status"
                  defaultValue={edit.status || ""}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                             text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                             shadow-sm"
                >
                  <option value="">—</option>
                  <option value="todo">A Fazer</option>
                  <option value="doing">Fazendo</option>
                  <option value="done">Concluída</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Data
                </label>
                <input
                  id="f-date"
                  type="date"
                  defaultValue={
                    edit.date ? new Date(edit.date).toISOString().slice(0, 10) : ""
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                             text-slate-800 placeholder:text-slate-400
                             focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
                             shadow-sm"
                />
                <div className="text-xs text-slate-400 mt-1">
                  Se não selecionar uma data, a data atual será adicionada
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Excluir */}
      <Modal
        open={!!del}
        onClose={() => setDel(null)}
        title="Deseja excluir?"
          size="sm"

        footer={
          <>
            <button
              onClick={() => setDel(null)}
              className="px-4 py-2 rounded bg-slate-500 text-white"
            >
              Não
            </button>
            <button
              onClick={remove}
              className="px-4 py-2 rounded bg-red-600 text-white"
            >
              Sim
            </button>
          </>
        }
      >
        <p>
          Esta ação removerá a nota <b>{del?.title}</b>.
        </p>
      </Modal>

      {toast && <Toast text={toast} />}
    </div>
  );
}
