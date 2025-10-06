type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };
export function Input({ label, ...props }: Props) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm text-slate-600 mb-1">{label}</label>}
      <input
        {...props}
        className="w-full rounded-lg border border-slate-200 bg-[#eef6ff] px-4 py-3 text-slate-800 shadow-[inset_0_1px_2px_rgba(0,0,0,.05)] focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
