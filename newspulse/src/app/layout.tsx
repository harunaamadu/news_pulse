import type { Metadata, Viewport } from "next";
import {
  Cinzel,
  Playfair_Display,
  Source_Serif_4,
  // Plus_Jakarta_Sans,
  JetBrains_Mono,
  Inter,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { MotionProvider } from "@/components/providers/motion-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";

import { OfflineIndicator } from "@/components/pwa/offline-indicator";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

const fontDisplay = Cinzel({
  subsets: ["latin"],
  variable: "--font-display",
});

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontProse = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-prose",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Personalized editorial news`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,

  applicationName: siteConfig.name,
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default",
  },

  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body
        className={cn(
          "h-full min-h-full flex flex-col font-sans",
          "antialiased",
          fontDisplay.variable,
          fontSerif.variable,
          fontProse.variable,
          inter.variable,
          fontMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MotionProvider>{children}</MotionProvider>
          <OfflineIndicator />
          <ServiceWorkerRegister />
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
