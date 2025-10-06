"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z"/>
    </svg>
  );
}
function IconSun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79ZM1 13h3v-2H1v2Zm10 10h2v-3h-2v3Zm9.83-18.16l-1.79-1.79-1.8 1.79 1.8 1.79 1.79-1.79ZM20 11v2h3v-2h-3Zm-8 7a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm7 6h-2v-3h2v3ZM7 24H5v-3h2v3Z"/>
    </svg>
  );
}
function IconLogout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M16 17l1.41-1.41L14.83 13H21v-2h-6.17l2.58-2.59L16 7l-5 5 5 5ZM3 21h8v-2H5V5h6V3H3v18Z"/>
    </svg>
  );
}

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // fecha ao clicar fora
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    location.href = "/";
  };

  const baseItem =
    "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md text-slate-700 hover:bg-[#eef6ff] hover:text-[#0e5cc4]";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Abrir menu"
        className="w-8 h-8 rounded-full bg-slate-200 ring-1 ring-slate-300 hover:ring-slate-400"
      />
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white text-slate-700 rounded-lg shadow-lg border border-slate-200 p-2 z-50">
          <Link href="/settings" className={baseItem}>
            <IconUser className="w-4 h-4" />
            <span>Perfil</span>
          </Link>
          <Link href="/settings#theme" className={baseItem}>
            <IconSun className="w-4 h-4" />
            <span>Tema</span>
          </Link>
          <button onClick={logout} className={`${baseItem} text-red-600 hover:text-red-700`}>
            <IconLogout className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
}
