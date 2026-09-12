import type { Metadata } from "next";
import { Beiruti, Roboto } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const beiruti = Beiruti({
  subsets: ["arabic", "latin"],
  variable: "--font-beiruti",
  display: "swap",
  weight: "variable",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: "variable",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://falcon-design.vercel.app/",
  ),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline.ar,
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={`${beiruti.variable} ${roboto.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
