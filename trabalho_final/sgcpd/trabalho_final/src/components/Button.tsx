export default function Button({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-lg bg-[#0e87ff] hover:bg-[#0b76dd] text-white font-semibold py-3 shadow-[0_4px_0_#0a62b8] active:translate-y-[1px]"
    >
      {children}
    </button>
  );
}
