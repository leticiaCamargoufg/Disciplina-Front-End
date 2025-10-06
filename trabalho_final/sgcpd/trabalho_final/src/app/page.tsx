"use client";
import { useState } from "react";
import Card from "@/components/Card";
import Logo from "@/components/Logo";
import { Input } from "@/components/Input";
import Button from "@/components/Button";
import Link from "next/link";

export default function LoginPage() {
  const [email,setEmail] = useState(""); const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (email == null || email ==''){
      return setError("Email vazio");
    }
  if (password == null || password ==''){
      return setError("senha vazia");
    }
    const r = await fetch("/api/auth/login",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email, password })});
    const data = await r.json();
    if(!r.ok) return setError(data.error || "Falha no login");
    localStorage.setItem("token", data.token);
    location.href = "/dashboard";
  }

  return (
    <Card>
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <form onSubmit={submit} className="w-full">
          <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          <Input placeholder="Senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <Button type="submit">Confirmar</Button>
        </form>
        <div className="text-center mt-4">
          <Link href="/signup" className="text-[#0e87ff] font-semibold">Cadastre-se</Link>
          <div className="text-slate-400 text-sm">
            <Link href="/forgot">esqueceu a senha?</Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
