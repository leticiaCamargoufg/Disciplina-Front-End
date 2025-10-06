"use client";
import { useState } from "react";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import { Input } from "@/components/Input";
import Button from "@/components/Button";

export default function Reset() {
  const [token,setToken] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirm] = useState("");
  const [msg,setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/auth/reset-password",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ token, password, confirmPassword })});
    setMsg(r.ok ? "Senha alterada! Faça login." : "Erro ao alterar senha");
  };

  return (
    <Card>
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <h2 className="text-[#0e5cc4] text-2xl font-extrabold">Recuperar Senha</h2>
        <form onSubmit={submit} className="w-full">
          <Input placeholder="Token" value={token} onChange={e=>setToken(e.target.value)} />
          <Input placeholder="Nova senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Input placeholder="Confirmar senha" type="password" value={confirmPassword} onChange={e=>setConfirm(e.target.value)} />
          <Button type="submit">Confirmar</Button>
        </form>
        {msg && <p className="text-slate-600 text-sm">{msg}</p>}
      </div>
    </Card>
  );
}
