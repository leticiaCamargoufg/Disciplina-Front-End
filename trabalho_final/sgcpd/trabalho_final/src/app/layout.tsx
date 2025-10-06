import "./globals.css";

export const metadata = { title: "SGCPD", description: "Auth + CRUD" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-[#eaf4ff] antialiased">{children}</body>
    </html>
  );
}
