import type { Metadata } from "next";
import { Beiruti, Roboto } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme/theme-provider";

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
    process.env.NEXT_PUBLIC_SITE_URL || "https://falcon-design.vercel.app",
  ),
  title: {
    default: `${siteConfig.nameAr} | أعمال الصلب والألمنيوم`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline.ar,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords.ar, ...siteConfig.keywords.en],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "ar_AE",
    alternateLocale: ["en_AE"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const themeBootScript = `(function(){try{var p=location.pathname;var loc=p==='/en'||p.indexOf('/en/')===0?'en':'ar';document.documentElement.lang=loc;document.documentElement.dir=loc==='ar'?'rtl':'ltr';var k='falcon-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className={`${beiruti.variable} ${roboto.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
