export default function Logo({ size = 56 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 24 24" className="text-blue-500">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stopColor="#4ea3ff"/><stop offset="1" stopColor="#0e7cff"/>
          </linearGradient>
        </defs>
        <path fill="url(#g)" d="M12 2l7 3v5c0 5-3.5 9-7 12-3.5-3-7-7-7-12V5l7-3z"/>
      </svg>
      <span className="text-3xl font-extrabold text-[#0f2b4d]">SGCPD</span>
    </div>
  );
}
