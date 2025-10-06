"use client";
import { useState } from "react";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import { Input } from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";

export default function Signup() {
  const [name,setName]=useState(""); const [email,setEmail]=useState("");
  const [password,setPassword]=useState(""); const [confirmPassword,setConfirm]=useState("");
  const [msg,setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg("");
    const r = await fetch("/api/auth/register",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name,email,password,confirmPassword })});
    const data = await r.json();
    if(!r.ok) return setMsg(data.error || "Erro no cadastro");
    setMsg("Cadastrado! Você já pode fazer login.");
  }

  return (
    <Card wide>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Logo size={72}/>
        <form onSubmit={submit}>
          <h1 className="text-2xl font-extrabold text-[#0f2b4d] text-center md:text-left mb-4">CADASTRO</h1>
          <Input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
          <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <Input placeholder="Confirmar Senha" type="password" value={confirmPassword} onChange={e=>setConfirm(e.target.value)} />
          {msg && <p className="text-sm text-slate-600 mb-2">{msg}</p>}
          <Button type="submit">Confirmar</Button>
          <div className="text-center mt-3">
            <Link href="/" className="text-slate-500">Fazer Login</Link>
          </div>
        </form>
      </div>
    </Card>
  );
}
