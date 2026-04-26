"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  createBlogPostAction,
  deleteBlogPost,
  updateBlogPostAction,
} from "@/lib/admin/entity-actions";
import type { BlogBlock, BlogCategory, BlogPost } from "@/lib/blog-data";

const CATEGORIES: BlogCategory[] = [
  "Setup",
  "Free Zones",
  "Visas",
  "Compliance",
  "Banking",
];

const BLOCK_TYPES = [
  { value: "p", label: "Paragraph" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "ul", label: "Bullet list" },
  { value: "callout", label: "Callout" },
] as const;

type Mode = "create" | "edit";

export function BlogEditor({
  post,
  mode,
}: {
  post: BlogPost & { status?: "draft" | "published" };
  mode: Mode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [slug, setSlug] = useState(post.slug);
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [category, setCategory] = useState<BlogCategory>(post.category);
  const [publishedAt, setPublishedAt] = useState(
    post.publishedAt.slice(0, 10),
  );
  const [readingMinutes, setReadingMinutes] = useState(
    post.readingMinutes.toString(),
  );
  const [authorName, setAuthorName] = useState(post.author.name);
  const [authorRole, setAuthorRole] = useState(post.author.role);
  const [tags, setTags] = useState(post.tags.join(", "));
  const [body, setBody] = useState<BlogBlock[]>(post.body);
  const [status, setStatus] = useState<"draft" | "published">(
    post.status ?? "draft",
  );

  const bodyJson = useMemo(() => JSON.stringify(body), [body]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        if (mode === "create") {
          await createBlogPostAction(fd);
        } else {
          await updateBlogPostAction(post.slug, fd);
        }
      } catch (err) {
        // redirect() inside server actions throws NEXT_REDIRECT —
        // that's the success path; let it propagate.
        throw err;
      }
    });
  }

  function onDelete() {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    startTransition(async () => {
      const res = await deleteBlogPost(post.slug);
      if (!res.ok) {
        setErrorMsg(res.error);
      } else {
        router.push("/admin/blog");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="body" value={bodyJson} />

      <Section title="Identity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            name="slug"
            label="URL slug"
            value={slug}
            onChange={setSlug}
            help="Lowercase letters, numbers, hyphens. Becomes /blog/<slug>."
            required
          />
          <Field
            name="title"
            label="Title"
            value={title}
            onChange={setTitle}
            required
          />
        </div>
        <Field
          name="excerpt"
          label="Excerpt"
          value={excerpt}
          onChange={setExcerpt}
          textarea
          rows={3}
          help="One sentence shown on the index page and in search results."
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SelectField
            label="Category"
            name="category"
            value={category}
            onChange={(v) => setCategory(v as BlogCategory)}
            options={CATEGORIES}
          />
          <Field
            name="publishedAt"
            label="Published date"
            type="date"
            value={publishedAt}
            onChange={setPublishedAt}
            required
          />
          <Field
            name="readingMinutes"
            label="Reading minutes"
            type="number"
            value={readingMinutes}
            onChange={setReadingMinutes}
            required
          />
        </div>
      </Section>

      <Section title="Author">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            name="authorName"
            label="Name"
            value={authorName}
            onChange={setAuthorName}
            required
          />
          <Field
            name="authorRole"
            label="Role"
            value={authorRole}
            onChange={setAuthorRole}
            required
          />
        </div>
        <Field
          name="tags"
          label="Tags"
          value={tags}
          onChange={setTags}
          help="Comma-separated. e.g. golden visa, residency, UAE"
        />
      </Section>

      <Section title="Body">
        <BodyEditor value={body} onChange={setBody} />
      </Section>

      <Section title="Publishing">
        <div className="flex flex-wrap items-center gap-3">
          <SelectField
            label="Status"
            name="status"
            value={status}
            onChange={(v) => setStatus(v as "draft" | "published")}
            options={["draft", "published"]}
          />
          {status === "draft" && (
            <p className="text-xs text-amber-800">
              Draft posts are hidden from the public site.
            </p>
          )}
        </div>
      </Section>

      <div className="sticky bottom-4 z-10 rounded-2xl bg-[#0a2540] text-white p-4 shadow-lg flex items-center justify-between gap-4">
        <div className="text-sm text-white/85 flex-1">
          {errorMsg && <span className="text-red-300">{errorMsg}</span>}
        </div>
        <div className="flex items-center gap-2">
          {mode === "edit" && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDelete}
              disabled={pending}
              className="border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Delete
            </Button>
          )}
          <Button
            type="submit"
            disabled={pending}
            className="bg-[#c9a84c] hover:bg-[#b6962f] text-[#0a2540] font-semibold"
          >
            {pending ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                {mode === "create" ? "Create post" : "Save post"}
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

function BodyEditor({
  value,
  onChange,
}: {
  value: BlogBlock[];
  onChange: (v: BlogBlock[]) => void;
}) {
  function update(i: number, next: BlogBlock) {
    onChange(value.map((b, idx) => (idx === i ? next : b)));
  }
  function remove(i: number) {
    if (value.length <= 1) return;
    onChange(value.filter((_, idx) => idx !== i));
  }
  function add(type: BlogBlock["type"]) {
    const block: BlogBlock =
      type === "p"
        ? { type: "p", text: "" }
        : type === "h2"
          ? { type: "h2", text: "" }
          : type === "h3"
            ? { type: "h3", text: "" }
            : type === "ul"
              ? { type: "ul", items: [""] }
              : { type: "callout", title: "", body: "" };
    onChange([...value, block]);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const copy = [...value];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  }

  return (
    <div className="space-y-3">
      {value.map((block, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-[#f8f9fc] p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-[#6b7e96]" />
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#6b7e96]">
                {BLOCK_TYPES.find((t) => t.value === block.type)?.label ??
                  block.type}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="h-7 w-7 rounded hover:bg-white text-[#6b7e96] disabled:opacity-30 flex items-center justify-center"
                aria-label="Move up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === value.length - 1}
                className="h-7 w-7 rounded hover:bg-white text-[#6b7e96] disabled:opacity-30 flex items-center justify-center"
                aria-label="Move down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={value.length <= 1}
                className="h-7 w-7 rounded hover:bg-red-50 text-red-700 disabled:opacity-30 flex items-center justify-center"
                aria-label="Delete"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <BlockEditor
            block={block}
            onChange={(b) => update(i, b)}
          />
        </div>
      ))}

      <div className="flex flex-wrap gap-2 pt-1">
        <span className="text-xs text-[#6b7e96] mr-1 self-center">
          Add block:
        </span>
        {BLOCK_TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => add(t.value)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium hover:border-[#c9a84c] hover:text-[#0a2540]"
          >
            <Plus className="h-3 w-3" />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
}: {
  block: BlogBlock;
  onChange: (b: BlogBlock) => void;
}) {
  if (block.type === "p" || block.type === "h2" || block.type === "h3") {
    return (
      <Textarea
        rows={block.type === "p" ? 4 : 1}
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
        placeholder={
          block.type === "p"
            ? "Paragraph text..."
            : block.type === "h2"
              ? "Heading 2"
              : "Heading 3"
        }
        className="resize-y bg-white"
      />
    );
  }
  if (block.type === "ul") {
    return (
      <div className="space-y-1.5">
        {block.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) =>
                onChange({
                  ...block,
                  items: block.items.map((it, j) =>
                    j === i ? e.target.value : it,
                  ),
                })
              }
              placeholder={`Item ${i + 1}`}
              className="bg-white"
            />
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...block,
                  items: block.items.filter((_, j) => j !== i),
                })
              }
              disabled={block.items.length <= 1}
              className="h-9 w-9 rounded-lg border border-border bg-white flex items-center justify-center text-[#6b7e96] hover:text-red-700 disabled:opacity-30"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange({ ...block, items: [...block.items, ""] })}
          className="text-xs text-[#0a2540] font-semibold hover:text-[#c9a84c] inline-flex items-center gap-1"
        >
          <Plus className="h-3 w-3" />
          Add item
        </button>
      </div>
    );
  }
  if (block.type === "callout") {
    return (
      <div className="space-y-2">
        <Input
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
          placeholder="Callout title"
          className="bg-white"
        />
        <Textarea
          rows={3}
          value={block.body}
          onChange={(e) => onChange({ ...block, body: e.target.value })}
          placeholder="Callout body"
          className="resize-y bg-white"
        />
      </div>
    );
  }
  return null;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white border border-border p-6">
      <header className="border-b border-border pb-4 mb-5">
        <h2 className="font-display text-xl text-[#0a2540]">{title}</h2>
      </header>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  textarea = false,
  rows = 3,
  type = "text",
  required = false,
  help,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  type?: string;
  required?: boolean;
  help?: string;
}) {
  return (
    <div>
      <label
        htmlFor={`f-${name}`}
        className="block text-sm font-medium text-[#0a2540]"
      >
        {label}
      </label>
      {help && <p className="mt-0.5 text-xs text-[#6b7e96]">{help}</p>}
      {textarea ? (
        <Textarea
          id={`f-${name}`}
          name={name}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="mt-1.5 resize-y"
        />
      ) : (
        <Input
          id={`f-${name}`}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="mt-1.5"
        />
      )}
    </div>
  );
}

function SelectField<T extends string>({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#0a2540]">
        {label}
      </label>
      <Select value={value} onValueChange={(v) => v && onChange(v as T)}>
        <SelectTrigger className="mt-1.5">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
