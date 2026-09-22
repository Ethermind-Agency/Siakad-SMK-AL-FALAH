import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIMS SMKS AL-FALAH — Sistem Informasi Manajemen Sekolah",
  description: "Sistem Informasi Manajemen Sekolah SMKS AL-FALAH Kubu Raya (NPSN: 69984368) — E-Office, Absensi Digital & CMS Profil Sekolah.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
