import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Absen PKL - Sistem Absensi Prakerin",
  description: "Aplikasi absensi Prakerin/PKL modern dengan fitur lengkap dan tampilan yang menarik",
  keywords: ["absen", "pkl", "prakerin", "siswa", "sekolah", "absensi"],
  authors: [{ name: "Absen PKL Team" }],
  openGraph: {
    title: "Absen PKL - Sistem Absensi Prakerin",
    description: "Aplikasi absensi Prakerin/PKL modern dengan fitur lengkap dan tampilan yang menarik",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Absen PKL - Sistem Absensi Prakerin",
    description: "Aplikasi absensi Prakerin/PKL modern dengan fitur lengkap dan tampilan yang menarik",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
