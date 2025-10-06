"use client";

export default function Modal({
  open,
  onClose,
  children,
  title,
  footer,
  size = "md", // sm | md | lg
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  if (!open) return null;

  const maxW =
    size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-4xl" : "max-w-2xl";

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay escuro */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`w-full ${maxW} bg-white rounded-2xl shadow-2xl overflow-hidden`}
        >
          {title && (
            <div className="px-5 py-3 border-b border-slate-200 text-[15px] font-semibold text-slate-900">
              {title}
            </div>
          )}

          <div className="p-5 text-slate-700">{children}</div>

          {footer && (
            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
