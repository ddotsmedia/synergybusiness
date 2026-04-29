import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ChatWidget } from "@/components/ai/ChatWidget";
import { siteUrl } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0a2540" },
    { media: "(prefers-color-scheme: dark)", color: "#0a2540" },
  ],
};

const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: { "en-AE": "/" },
  },
  title: {
    default: "Synergy Business | Business Setup in Abu Dhabi, UAE",
    template: "%s | Synergy Business",
  },
  description:
    "Synergy Business is Abu Dhabi's trusted business setup consultancy. Company formation, free zone setup, PRO services, Golden Visa, and visa processing across all UAE emirates.",
  keywords: [
    "business setup Abu Dhabi",
    "company formation UAE",
    "free zone setup Abu Dhabi",
    "trade license Abu Dhabi",
    "Golden Visa UAE",
    "PRO services Abu Dhabi",
    "ADGM",
    "KIZAD",
    "Mainland license UAE",
  ],
  authors: [{ name: "Synergy Business" }],
  creator: "Synergy Business",
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: siteUrl,
    siteName: "Synergy Business",
    title: "Synergy Business | Business Setup in Abu Dhabi, UAE",
    description:
      "Fast, simple, trusted business setup in Abu Dhabi. Trade licenses, free zones, visa services, and PRO support across the UAE.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synergy Business | Business Setup in Abu Dhabi, UAE",
    description:
      "Fast, simple, trusted business setup in Abu Dhabi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tree = (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
        <ChatWidget />
      </body>
    </html>
  );

  return clerkConfigured ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}
