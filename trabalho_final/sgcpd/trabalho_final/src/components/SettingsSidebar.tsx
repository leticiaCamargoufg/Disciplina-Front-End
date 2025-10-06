"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Ícones SVG (leves e sem dependências)
function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"/>
    </svg>
  );
}
function IconMoon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
    </svg>
  );
}
function IconExit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M16 17l1.41-1.41L14.83 13H21v-2h-6.17l2.58-2.59L16 7l-5 5 5 5ZM3 21h8v-2H5V5h6V3H3v18Z"/>
    </svg>
  );
}

export default function SettingsSidebar() {
  // ativação por hash (#profile ou #theme)
  const [hash, setHash] = useState<string>("");
  useEffect(() => {
    const update = () => setHash(window.location.hash || "#profile");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const item = (href: string, icon: React.ReactNode, label: string) => {
    const active = (hash || "#profile") === href;
    return (
      <Link
        href={`/${href}`}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-[15px] 
          ${active
            ? "bg-[#dcebff] text-[#0e5cc4] font-medium"
            : "text-slate-700 hover:bg-slate-100"}`}
      >
        <span
          className={`w-5 h-5 ${active ? "text-[#0e5cc4]" : "text-slate-500"}`}
        >
          {icon}
        </span>
        {label}
      </Link>
    );
  };

  const logout = () => {
    localStorage.removeItem("token");
    location.href = "/";
  };

  return (
    <aside className="w-64 bg-[#eaf4ff] h-[calc(100vh-56px)] border-r px-3 py-4">
      <div className="flex flex-col gap-2">
        {item("settings#profile", <IconUser className="w-5 h-5" />, "Perfil")}
        {item("dashboard", <IconMoon className="w-5 h-5" />, "dashboard")}
      </div>
      <IconMoon className="w-5 h-5" />
      <button
        onClick={logout}
        className="mt-8 ml-1 flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
        title="Sair"
      >
        <IconExit className="w-4 h-4" />
        Sair
      </button>
    </aside>
  );
}
