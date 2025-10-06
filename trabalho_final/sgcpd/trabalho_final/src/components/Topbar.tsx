"use client";
import Logo from "./Logo";
import AvatarMenu from "./AvatarMenu";

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z"
      />
    </svg>
  );
}

export default function Topbar({ onSearch }: { onSearch?: (q: string) => void }) {
  return (
    <header className="h-14 bg-white border-b flex items-center gap-4 px-4">
      <div className="min-w-[140px]">
        <Logo size={28} />
      </div>

      {/* wrapper flex-1 para o input ocupar todo o espaço */}
      <div className="flex-1">
        <div className="relative">
          <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar notas..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="
              w-full pl-9 pr-4 py-2 rounded-xl
              bg-white border border-slate-300
              text-slate-800 placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400
              shadow-sm
            "
          />
        </div>
      </div>

      <AvatarMenu />
    </header>
  );
}
