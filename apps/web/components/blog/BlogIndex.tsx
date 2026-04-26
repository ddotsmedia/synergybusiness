"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BLOG_CATEGORIES,
  type BlogCategory,
  type BlogPost,
} from "@/lib/blog-data";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<BlogCategory | null>(null);

  const filtered = useMemo(
    () => (category ? posts.filter((p) => p.category === category) : posts),
    [posts, category],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <section className="relative overflow-hidden bg-navy-pattern text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#c9a84c]/10 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#c9a84c]/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
              Synergy Insights
            </span>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight">
              Practical guides for{" "}
              <span className="text-gold-gradient">UAE founders</span>.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
              Setup decisions, free-zone comparisons, visa eligibility,
              banking and compliance — written by the consultants doing the
              work.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 z-20 bg-white/85 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap gap-1.5">
          <CategoryChip
            label="All"
            active={category === null}
            onClick={() => setCategory(null)}
          />
          {BLOG_CATEGORIES.map((c) => (
            <CategoryChip
              key={c}
              label={c}
              active={category === c}
              onClick={() => setCategory(category === c ? null : c)}
            />
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-[#f8f9fc]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!featured ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
              <p className="text-[#6b7e96]">
                No posts yet in this category. Check back soon.
              </p>
            </div>
          ) : (
            <>
              <Link
                href={`/blog/${featured.slug}`}
                className="group block rounded-2xl border border-border bg-white p-6 sm:p-10 hover:shadow-xl transition-shadow"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
                      <Tag className="h-3.5 w-3.5" />
                      {featured.category}
                      <span className="text-[#6b7e96]">·</span>
                      <span className="text-[#6b7e96] normal-case font-normal">
                        Featured
                      </span>
                    </div>
                    <h2 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl text-[#0a2540] tracking-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-4 text-[#6b7e96] leading-relaxed">
                      {featured.excerpt}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#6b7e96]">
                      <span>{featured.author.name}</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(featured.publishedAt)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {featured.readingMinutes} min read
                      </span>
                    </div>
                  </div>
                  <div className="hidden lg:flex items-center justify-end">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#0a2540] px-5 py-2.5 text-sm text-white group-hover:bg-[#071a2e] transition-colors">
                      Read article
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>

              {rest.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {rest.map((post, i) => (
                    <motion.article
                      key={post.slug}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group block h-full rounded-2xl bg-white border border-border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
                          <Tag className="h-3.5 w-3.5" />
                          {post.category}
                        </div>
                        <h3 className="mt-3 font-display text-xl text-[#0a2540] tracking-tight">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-sm text-[#6b7e96] leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="mt-5 flex items-center justify-between text-xs text-[#6b7e96]">
                          <span>{formatDate(post.publishedAt)}</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {post.readingMinutes} min
                          </span>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
        active
          ? "bg-[#0a2540] text-white border-[#0a2540]"
          : "bg-white text-[#1a2b3c] border-border hover:border-[#c9a84c] hover:text-[#0a2540]",
      )}
    >
      {label}
    </button>
  );
}
