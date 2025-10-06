"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/Topbar";
import SettingsSidebar from "@/components/SettingsSidebar";

export default function Settings() {
  // token p/ chamadas autenticadas
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const auth: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  // estado do perfil
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // alterar senha
  const [currentPassword, setCur] = useState("");
  const [newPassword, setNew] = useState("");
  const [changingPwd, setChangingPwd] = useState(false);

  // tema
  const [theme, setTheme] = useState<string>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  // carrega o usuário
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/me", { headers: { ...auth } });
      if (!r.ok) {
        location.href = "/";
        return;
      }
      const u = await r.json();
      setName(u.name || "");
      setEmail(u.email || "");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // salvar perfil
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify({ name, email }),
    });
    alert(r.ok ? "Salvo!" : "Falha ao salvar");
  };

  // alterar senha
  const changePass = async () => {
    const r = await fetch("/api/me/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...auth },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    alert(r.ok ? "Senha alterada" : "Falha ao alterar senha");
    setCur("");
    setNew("");
    setChangingPwd(false);
  };

  // aplica tema e persiste
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // logout utilitário
  const logout = () => {
    localStorage.removeItem("token");
    location.href = "/";
  };

  return (
    <div className="h-screen flex flex-col">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* MENU LATERAL */}
        <aside className="w-64 bg-[#eaf4ff] h-[calc(100vh-56px)] border-r px-3 py-4">
          <SettingsSidebar />
          <button
            onClick={logout}
            className="text-red-600 text-sm mt-6 inline-flex items-center gap-2"
          >
            <span>⎋</span> Sair
          </button>
        </aside>

        {/* CONTEÚDO */}
        <main className="flex-1 p-6">
          {/* PERFIL */}
          <section className="max-w-2xl mx-auto bg-white rounded-2xl shadow border p-6">
            <h2 className="settings-heading mb-4">Perfil</h2>

            <form onSubmit={save} className="grid grid-cols-1 gap-4">
              <div>
                <label className="settings-label block mb-1">Nome</label>
                <input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                             text-slate-800 placeholder:text-slate-500
                             focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="settings-label block mb-1">Email</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                             text-slate-800 placeholder:text-slate-500
                             focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-lg bg-[#0e87ff] text-white font-medium hover:brightness-110"
              >
                Salvar
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={() => setChangingPwd((v) => !v)}
                className="text-[#0e5cc4] hover:underline"
              >
                Alterar Senha
              </button>
            </div>

            {changingPwd && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="settings-label block mb-1">
                    Senha atual
                  </label>
                  <input
                    placeholder="••••••••"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCur(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                               text-slate-800 placeholder:text-slate-500
                               focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="settings-label block mb-1">
                    Nova senha
                  </label>
                  <input
                    placeholder="nova senha"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNew(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white
                               text-slate-800 placeholder:text-slate-500
                               focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    onClick={changePass}
                    className="w-full h-10 rounded-lg bg-slate-600 text-white font-medium hover:bg-slate-700"
                  >
                    Confirmar alteração de senha
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ZONA DE PERIGO */}
          <section className="max-w-2xl mx-auto mt-6 bg-white rounded-2xl shadow p-6 border">
            <h2 className="text-lg font-semibold mb-2 text-red-600">
              Zona de Perigo
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Esta ação é permanente. Todas as suas notas, categorias e tags
              serão removidas.
            </p>
            <button
              onClick={async () => {
                const sure = confirm(
                  "Tem certeza que deseja apagar sua conta? Esta ação não pode ser desfeita."
                );
                if (!sure) return;

                const r = await fetch("/api/me", {
                  method: "DELETE",
                  headers: { ...auth },
                });

                if (r.ok) {
                  localStorage.removeItem("token");
                  alert("Conta removida com sucesso.");
                  location.href = "/";
                } else {
                  const data = await r.json().catch(() => ({}));
                  alert(data?.error || "Não foi possível apagar a conta.");
                }
              }}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              Apagar minha conta
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
