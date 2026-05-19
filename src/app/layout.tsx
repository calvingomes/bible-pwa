import type { Metadata, Viewport } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Header } from "@/components/Header";
import { Navbar } from "@/components/Navbar";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catholic Bible | கத்தோலிக்க திருவிவிலியம்",
  description: "Offline Roman Catholic Bible supporting English and Tamil Canon. Read, search, and bookmark fully offline.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Catholic Bible",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#b37d14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <SettingsProvider>
            <div className="app-container">
              <Header />
              <main className="main-content">
                {children}
              </main>
              <Navbar />
              <ServiceWorkerRegister />
            </div>
          </SettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
