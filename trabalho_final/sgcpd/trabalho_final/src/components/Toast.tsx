"use client";
import { useEffect, useState } from "react";
export default function Toast({ text }: { text: string }) {
  const [show,setShow]=useState(true);
  useEffect(()=>{ const id=setTimeout(()=>setShow(false),2500); return ()=>clearTimeout(id); },[]);
  if(!show) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <div className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow">{text}</div>
    </div>
  );
}
