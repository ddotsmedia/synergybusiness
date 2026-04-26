# FULL AUTO KICKSTART — Synergy Business Website
# Paste everything inside the code block into Claude Code terminal

---

```
You are going to fully automate the setup of a new Next.js website project called "Synergy Business" on my local machine. Do everything without asking for confirmation at each step — just execute and report what you did.

## Step 1: Create project folder on Desktop

Run these commands:
```bash
cd ~/Desktop
mkdir -p synergybusiness
cd synergybusiness
```

## Step 2: Create CLAUDE.md in the project root

Write the following content to ~/Desktop/synergybusiness/CLAUDE.md — this is the master project spec file you must read every session.

(Paste full CLAUDE.md content from your CLAUDE.md file here — or instruct Claude Code to write it inline)

## Step 3: Scaffold the Next.js 14 monorepo

Run the following commands in order:

```bash
cd ~/Desktop/synergybusiness

# Initialize pnpm workspaces
cat > package.json << 'EOF'
{
  "name": "synergybusiness",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "typecheck": "pnpm --filter web typecheck"
  },
  "workspaces": ["apps/*", "packages/*"]
}
EOF

# Create workspace folders
mkdir -p apps packages/types packages/config packages/db

# Scaffold Next.js app
cd apps
pnpm create next-app@latest web --typescript --tailwind --eslint --app --no-src-dir --no-import-alias --yes
cd web

# Install all dependencies
pnpm add framer-motion lucide-react @anthropic-ai/sdk zod react-hook-form @hookform/resolvers clsx tailwind-merge next-sitemap @sanity/client @clerk/nextjs resend
pnpm add -D @types/node

# Initialize shadcn/ui
pnpm dlx shadcn@latest init --yes --defaults
pnpm dlx shadcn@latest add button card input textarea select badge dialog sheet tabs accordion separator avatar dropdown-menu navigation-menu --yes
```

## Step 4: Create all project folders

```bash
cd ~/Desktop/synergybusiness/apps/web

mkdir -p app/\(marketing\)/services/mainland
mkdir -p app/\(marketing\)/services/free-zone
mkdir -p app/\(marketing\)/services/offshore
mkdir -p app/\(marketing\)/services/pro-services
mkdir -p app/\(marketing\)/services/visa
mkdir -p app/\(marketing\)/services/golden-visa
mkdir -p app/\(marketing\)/free-zones
mkdir -p app/\(marketing\)/cost-calculator
mkdir -p app/\(marketing\)/blog/\[slug\]
mkdir -p app/\(marketing\)/about
mkdir -p app/\(marketing\)/contact
mkdir -p app/\(portal\)/dashboard
mkdir -p app/\(portal\)/applications
mkdir -p app/\(portal\)/documents
mkdir -p app/\(portal\)/invoices
mkdir -p app/api/ai/chat
mkdir -p app/api/trpc
mkdir -p app/api/webhooks
mkdir -p components/ui
mkdir -p components/layout
mkdir -p components/marketing
mkdir -p components/ai
mkdir -p components/portal
mkdir -p lib
mkdir -p public/images
```

## Step 5: Set up Tailwind config with brand design system

Overwrite ~/Desktop/synergybusiness/apps/web/tailwind.config.ts with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A2540",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#C9A84C",
          light: "#E8C96B",
          foreground: "#0A2540",
        },
        surface: {
          DEFAULT: "#F8F9FC",
          dark: "#071A2E",
        },
        muted: {
          DEFAULT: "#6B7E96",
          foreground: "#1A2B3C",
        },
        border: "#E2E8F0",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "gold-shimmer": "goldShimmer 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        goldShimmer: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

## Step 6: Set up Google Fonts in layout

Overwrite ~/Desktop/synergybusiness/apps/web/app/layout.tsx with:

```tsx
import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
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
  ],
  openGraph: {
    type: "website",
    locale: "en_AE",
    url: "https://synergybusiness.com",
    siteName: "Synergy Business",
    title: "Synergy Business | Business Setup in Abu Dhabi, UAE",
    description:
      "Fast, simple, trusted business setup in Abu Dhabi. Trade licenses, free zones, visa services, and PRO support across the UAE.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synergy Business | Business Setup in Abu Dhabi, UAE",
    description: "Fast, simple, trusted business setup in Abu Dhabi.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased bg-surface text-[#1A2B3C]">
        {children}
      </body>
    </html>
  );
}
```

## Step 7: Create shared types package

Write ~/Desktop/synergybusiness/packages/types/index.ts:

```ts
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  serviceInterest: ServiceType;
  message?: string;
  source: "website" | "whatsapp" | "referral" | "walk-in";
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  createdAt: Date;
}

export type ServiceType =
  | "mainland"
  | "free-zone"
  | "offshore"
  | "pro-services"
  | "visa"
  | "golden-visa"
  | "other";

export interface Application {
  id: string;
  leadId: string;
  serviceType: ServiceType;
  stage:
    | "draft"
    | "documents_pending"
    | "submitted"
    | "processing"
    | "approved"
    | "rejected";
  documents: Document[];
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  applicationId: string;
  name: string;
  type:
    | "passport"
    | "emirates_id"
    | "visa"
    | "noc"
    | "moa"
    | "bank_statement"
    | "other";
  fileUrl: string;
  verified: boolean;
  uploadedAt: Date;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  startingPrice?: number;
  currency: "AED";
}

export interface FreeZone {
  id: string;
  name: string;
  shortName: string;
  location: string;
  industry: string[];
  minCost: number;
  maxCost: number;
  officeRequired: boolean;
  visaQuota: number;
  foreignOwnership: number;
  highlights: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
```

## Step 8: Create .env.local

Write ~/Desktop/synergybusiness/apps/web/.env.local:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Anthropic Claude API
ANTHROPIC_API_KEY=

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/synergybusiness
REDIS_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/portal/dashboard

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# HubSpot CRM
HUBSPOT_API_KEY=

# Resend Email
RESEND_API_KEY=

# Cloudflare R2 (Document Storage)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=synergybusiness-docs
R2_PUBLIC_URL=
```

## Step 9: Create the AI Chat API route

Write ~/Desktop/synergybusiness/apps/web/app/api/ai/chat/route.ts:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a professional business setup consultant at Synergy Business, a leading consultancy in Abu Dhabi, UAE. 

You help entrepreneurs and investors set up businesses in the UAE. You are knowledgeable about:
- Mainland company formation (DED/ADDED licensing)
- Free zone setup (ADGM, KIZAD, twofour54, Masdar City, ADAFZ, RAKEZ, and others)
- Offshore company formation
- PRO services and government approvals
- UAE visa services (employment, family, visit visas)
- Golden Visa eligibility and processing
- Document requirements by nationality
- Approximate costs and timelines

Guidelines:
- Be concise, warm, and professional
- Always give practical, specific answers
- Quote approximate costs in AED when asked
- After 2-3 exchanges, offer to connect them with a human consultant
- Never give legal or financial advice — refer complex matters to consultants
- Always end responses under 150 words unless the question requires detail`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
            );
          }
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return new Response(JSON.stringify({ error: "AI service unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
```

## Step 10: Build the complete Home page

Now build the full home page. Write ~/Desktop/synergybusiness/apps/web/app/page.tsx as a full production-quality page with all these sections:

1. **Navbar** — sticky, logo "Synergy Business" (Playfair Display + gold accent), nav links, mobile hamburger Sheet
2. **Hero** — dark navy bg, animated gold gradient headline, two CTAs, 4 trust badges, geometric Abu Dhabi pattern background
3. **Services Grid** — 6 service cards with icons, hover gold border top
4. **How It Works** — 4-step horizontal stepper
5. **Free Zones** — logo/name grid for ADGM, KIZAD, twofour54, Masdar City, ADAFZ, RAKEZ
6. **Testimonials** — 3 cards with star ratings
7. **AI Calculator Teaser** — dark navy section, CTA to /cost-calculator
8. **FAQ Accordion** — 6 questions with JSON-LD schema
9. **Contact CTA** — gold-to-navy gradient, lead form, WhatsApp button
10. **Footer** — 4-column links, copyright, social icons

Use Framer Motion `whileInView` animations on each section. Use real UAE business content — no lorem ipsum. Make it premium, modern, and mobile-responsive.

## Step 11: Build the AI Chat Widget

Write ~/Desktop/synergybusiness/apps/web/components/ai/ChatWidget.tsx — a floating chat button (bottom-right, gold) that opens a Sheet with:
- Chat message history
- Input field + send button
- Streams responses from /api/ai/chat
- Shows typing indicator during streaming
- "Talk to a Consultant" button at bottom

## Step 12: Final checks and run

```bash
cd ~/Desktop/synergybusiness/apps/web
pnpm typecheck
pnpm dev
```

Report any TypeScript errors and fix them before finishing. When done, tell me:
- The localhost URL to view the site
- Any API keys I still need to add to .env.local
- What to work on next (Phase 1 remaining tasks)

Do all steps automatically without stopping unless there is a critical error that needs my input.
```