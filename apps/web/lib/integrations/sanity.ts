import "server-only";
import { createClient, type SanityClient } from "@sanity/client";
import {
  BLOG_POSTS,
  getPost as getSeedPost,
  getRelatedPosts as getSeedRelated,
  type BlogBlock,
  type BlogPost,
} from "@/lib/blog-data";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = "2024-12-01";

let cachedClient: SanityClient | null = null;
function client(): SanityClient | null {
  if (!projectId) return null;
  if (cachedClient) return cachedClient;
  cachedClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true, // public read API; auth-required reads should set false
    token: process.env.SANITY_API_TOKEN,
  });
  return cachedClient;
}

export const sanityConfigured = Boolean(projectId);

/**
 * Sanity returns Portable Text for `body`. We map a small subset to our
 * `BlogBlock` discriminated union so the renderer stays the same whether
 * data comes from Sanity or the in-repo seed file.
 */
type PortableTextBlock = {
  _type: "block";
  style?: string;
  listItem?: "bullet" | "number";
  children: { text: string }[];
};

type PortableTextCallout = {
  _type: "callout";
  title?: string;
  body?: string;
};

type PortableText = (PortableTextBlock | PortableTextCallout)[];

function fromPortableText(blocks: PortableText): BlogBlock[] {
  const out: BlogBlock[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length) {
      out.push({ type: "ul", items: listBuffer });
      listBuffer = [];
    }
  };

  for (const block of blocks) {
    if (block._type === "callout") {
      flushList();
      out.push({
        type: "callout",
        title: block.title ?? "",
        body: block.body ?? "",
      });
      continue;
    }
    if (block._type !== "block") continue;
    const text = (block.children ?? []).map((c) => c.text ?? "").join("");
    if (block.listItem === "bullet") {
      listBuffer.push(text);
      continue;
    }
    flushList();
    if (block.style === "h2") out.push({ type: "h2", text });
    else if (block.style === "h3") out.push({ type: "h3", text });
    else out.push({ type: "p", text });
  }
  flushList();
  return out;
}

const POST_PROJECTION = `
  "slug": slug.current,
  title,
  excerpt,
  category,
  publishedAt,
  readingMinutes,
  author{ name, role },
  body,
  tags
`;

type SanityPostRaw = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogPost["category"];
  publishedAt: string;
  readingMinutes: number;
  author: { name: string; role: string };
  body: PortableText;
  tags?: string[];
};

function fromSanity(raw: SanityPostRaw): BlogPost {
  return {
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt,
    category: raw.category,
    publishedAt: raw.publishedAt,
    readingMinutes: raw.readingMinutes,
    author: raw.author,
    body: fromPortableText(raw.body),
    tags: raw.tags ?? [],
  };
}

export async function listPosts(): Promise<BlogPost[]> {
  const c = client();
  if (!c) return BLOG_POSTS;
  try {
    const rows = await c.fetch<SanityPostRaw[]>(
      `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {${POST_PROJECTION}}`,
    );
    if (!rows || rows.length === 0) return BLOG_POSTS;
    return rows.map(fromSanity);
  } catch (err) {
    console.error("[sanity] listPosts failed, falling back to seed:", err);
    return BLOG_POSTS;
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const c = client();
  if (!c) return getSeedPost(slug);
  try {
    const row = await c.fetch<SanityPostRaw | null>(
      `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0]{${POST_PROJECTION}}`,
      { slug },
    );
    if (!row) return getSeedPost(slug);
    return fromSanity(row);
  } catch (err) {
    console.error("[sanity] getPost failed, falling back to seed:", err);
    return getSeedPost(slug);
  }
}

export async function getRelatedPosts(
  slug: string,
  limit = 2,
): Promise<BlogPost[]> {
  const c = client();
  if (!c) return getSeedRelated(slug, limit);
  try {
    const current = await getPost(slug);
    if (!current) return [];
    const rows = await c.fetch<SanityPostRaw[]>(
      `*[_type == "post" && slug.current != $slug && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...10]{${POST_PROJECTION}}`,
      { slug },
    );
    const mapped = rows.map(fromSanity);
    const sameCategory = mapped.filter((p) => p.category === current.category);
    if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
    const others = mapped.filter((p) => p.category !== current.category);
    return [...sameCategory, ...others].slice(0, limit);
  } catch (err) {
    console.error("[sanity] getRelatedPosts failed, falling back to seed:", err);
    return getSeedRelated(slug, limit);
  }
}

export async function listPostSlugs(): Promise<string[]> {
  const c = client();
  if (!c) return BLOG_POSTS.map((p) => p.slug);
  try {
    const rows = await c.fetch<{ slug: string }[]>(
      `*[_type == "post" && !(_id in path("drafts.**"))]{ "slug": slug.current }`,
    );
    if (!rows || rows.length === 0) return BLOG_POSTS.map((p) => p.slug);
    return rows.map((r) => r.slug).filter(Boolean);
  } catch {
    return BLOG_POSTS.map((p) => p.slug);
  }
}
