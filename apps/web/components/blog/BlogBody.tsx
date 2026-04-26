import type { BlogBlock } from "@/lib/blog-data";

export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-5 text-[16px] leading-relaxed text-[#1a2b3c]">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "p":
            return <p key={idx}>{block.text}</p>;
          case "h2":
            return (
              <h2
                key={idx}
                className="font-display text-2xl sm:text-3xl text-[#0a2540] mt-10 mb-2 tracking-tight"
              >
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={idx}
                className="font-display text-xl text-[#0a2540] mt-6 mb-1"
              >
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5">
                {block.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside
                key={idx}
                className="rounded-xl border-l-4 border-[#c9a84c] bg-[#f8f9fc] px-5 py-4"
              >
                <p className="font-display text-base text-[#0a2540]">
                  {block.title}
                </p>
                <p className="mt-1 text-sm text-[#1a2b3c]">{block.body}</p>
              </aside>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
