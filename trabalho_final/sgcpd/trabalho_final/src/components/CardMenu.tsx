"use client";
import { useEffect, useRef, useState } from "react";

function DotsVertical(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="12" cy="12" r="1.8" />
      <circle cx="12" cy="19" r="1.8" />
    </svg>
  );
}

export default function CardMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
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

  const itemBase =
    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors";

  return (
    <div ref={ref} className="relative z-40">
      {/* Botão dos 3 pontos: escuro + hover + focus ring */}
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 flex items-center justify-center rounded-full
                   text-slate-600 hover:text-slate-800 hover:bg-slate-100
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        <DotsVertical className="w-4 h-4 fill-current" />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-1 w-32 bg-white text-slate-800
                     rounded-lg shadow-lg border border-slate-200 p-1 z-50"
        >
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className={`${itemBase} hover:bg-slate-100`}
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className={`${itemBase} text-red-600 hover:bg-red-50`}
          >
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
