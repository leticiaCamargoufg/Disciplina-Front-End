"use client";
import { useState } from "react";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import { Input } from "@/components/Input";
import Button from "@/components/Button";

export default function Forgot() {
  const [email,setEmail] = useState(""); const [msg,setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/auth/forgot-password",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email })});
    const data = await r.json();
    setMsg(r.ok ? `Email enviado! (token p/ teste: ${data.token ?? "verifique seu email"})` : "Erro ao enviar");
  };

  return (
    <Card>
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <h2 className="text-[#0e5cc4] text-2xl font-extrabold">Recuperar Senha</h2>
        <form onSubmit={submit} className="w-full">
          <Input placeholder="Confirmar  Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Button type="submit">Confirmar</Button>
        </form>
        {msg && <p className="text-slate-600 text-sm">{msg}</p>}
      </div>
    </Card>
  );
}
