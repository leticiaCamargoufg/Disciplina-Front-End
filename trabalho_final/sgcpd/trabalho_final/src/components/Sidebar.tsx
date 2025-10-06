"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Item = ({ href, icon, label }:{href:string; icon:string; label:string}) => {
  const path = usePathname();
  const active = path.startsWith(href);
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm
      ${active ? "bg-[#dcebff] text-[#0e5cc4]" : "text-slate-700 hover:bg-slate-100"}`}>
      <span className="w-5 text-center">{icon}</span>
      {label}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#eaf4ff] h-[calc(100vh-56px)] border-r px-3 py-4">
      <div className="space-y-2">
        <Item href="/dashboard" icon="🏠" label="Dashboard" />
        <Item href="/dashboard/mine" icon="📝" label="Minhas Notas" />
        <Item href="/dashboard/categories" icon="🗂️" label="Categorias" />
        <Item href="/dashboard/tags" icon="🏷️" label="Tags" />
      </div>
      <div className="absolute bottom-4 left-3">
        <Link href="/settings" className="text-slate-500 text-sm">⚙️ Configurações</Link>
      </div>
    </aside>
  );
}
