export default function Card({ children, wide=false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`mx-auto mt-24 bg-white rounded-2xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] p-8 ${wide ? "max-w-4xl" : "max-w-md"}`}>
      {children}
    </div>
  );
}
