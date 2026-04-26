"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveContent } from "@/lib/admin/content-actions";
import type {
  FieldDef,
  PageSchema,
} from "@/lib/admin/page-schemas";
import type { Content } from "@/lib/site-content";

type Props = {
  schema: PageSchema;
  current: Content;
};

export function PageContentForm({ schema, current }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await saveContent(schema.slug, formData);
      if (result.ok) {
        setSavedAt(new Date());
        router.refresh();
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {schema.sections.map((section) => (
        <section
          key={section.title}
          className="rounded-2xl bg-white border border-border p-6"
        >
          <header className="border-b border-border pb-4 mb-5">
            <h2 className="font-display text-xl text-[#0a2540]">
              {section.title}
            </h2>
            {section.description && (
              <p className="mt-1 text-sm text-[#6b7e96]">
                {section.description}
              </p>
            )}
          </header>

          <div className="space-y-5">
            {section.fields.map((field) => (
              <FieldRow
                key={field.key}
                field={field}
                value={current[field.key]}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 z-10 rounded-2xl bg-[#0a2540] text-white p-4 shadow-lg flex items-center justify-between gap-4">
        <div className="text-sm text-white/85">
          {errorMsg ? (
            <span className="text-red-300">{errorMsg}</span>
          ) : savedAt ? (
            <span className="inline-flex items-center gap-1.5 text-[#e8c96b]">
              <Check className="h-4 w-4" />
              Saved at {savedAt.toLocaleTimeString()}
            </span>
          ) : (
            <span>
              Empty fields will fall back to the built-in defaults on the
              live site.
            </span>
          )}
        </div>
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
              Save changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function FieldRow({
  field,
  value,
}: {
  field: FieldDef;
  value: string | string[] | null | undefined;
}) {
  const idBase = `field-${field.key.replace(/\./g, "-")}`;

  return (
    <div>
      <label
        htmlFor={idBase}
        className="block text-sm font-medium text-[#0a2540]"
      >
        {field.label}
      </label>
      {field.help && (
        <p className="mt-0.5 text-xs text-[#6b7e96]">{field.help}</p>
      )}

      {field.type === "text" || field.type === "url" ? (
        <Input
          id={idBase}
          name={field.key}
          type={field.type === "url" ? "text" : "text"}
          defaultValue={
            typeof value === "string" ? value : field.defaultValue
          }
          placeholder={field.defaultValue}
          className="mt-1.5"
        />
      ) : field.type === "textarea" ? (
        <Textarea
          id={idBase}
          name={field.key}
          rows={field.rows ?? 3}
          defaultValue={
            typeof value === "string" ? value : field.defaultValue
          }
          placeholder={field.defaultValue}
          className="mt-1.5 resize-y"
        />
      ) : field.type === "list" ? (
        <ListEditor
          name={field.key}
          itemLabel={field.itemLabel ?? "Item"}
          initialValues={
            Array.isArray(value)
              ? value
              : field.defaultValue.length > 0
                ? field.defaultValue
                : [""]
          }
        />
      ) : null}

      <p className="mt-1.5 text-xs text-[#94a8c0]">
        Default:{" "}
        {Array.isArray(field.defaultValue)
          ? field.defaultValue.join(" / ")
          : field.defaultValue}
      </p>
    </div>
  );
}

function ListEditor({
  name,
  itemLabel,
  initialValues,
}: {
  name: string;
  itemLabel: string;
  initialValues: string[];
}) {
  const [items, setItems] = useState<string[]>(
    initialValues.length > 0 ? initialValues : [""],
  );

  return (
    <div className="mt-1.5 space-y-2">
      {items.map((val, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            name={name}
            defaultValue={val}
            placeholder={`${itemLabel} ${i + 1}`}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => setItems((curr) => curr.filter((_, j) => j !== i))}
            disabled={items.length <= 1}
            className="h-9 w-9 rounded-lg border border-border flex items-center justify-center text-[#6b7e96] hover:text-red-700 hover:border-red-300 disabled:opacity-40"
            aria-label="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => setItems((curr) => [...curr, ""])}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a2540] hover:text-[#c9a84c]"
      >
        <Plus className="h-3.5 w-3.5" />
        Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}
