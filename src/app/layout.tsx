import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";


const siteTitle = "Monkestation - Space Station 13 Server Hub";
const siteDescription = "Server index for monkestation";
const siteKeywords = ["monkestation", "space station 13", "ss13", "gaming", "byond", "roleplay"];
const siteUrl = 'https://play.monkestation.com';
const siteName = 'Monkestation';

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  keywords: siteKeywords,
  authors: [{ name: "Monkestation Team" }, { name: "Catgirl coders" }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName: siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
