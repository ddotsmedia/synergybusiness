import Link from "next/link";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="bg-navy-pattern text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <p className="text-xs uppercase tracking-wide text-[#c9a84c] font-semibold">
            Legal
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl tracking-tight">
            {title}
          </h1>
          <p className="mt-4 text-sm text-white/65">Last updated {updated}</p>
        </div>
      </section>

      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 mb-10">
            <strong>Draft notice:</strong> this page contains template language
            and must be reviewed by your UAE legal counsel before publishing.
            Replace the placeholders with your final commercial terms.
          </div>

          <article className="space-y-8 text-[15px] leading-relaxed text-[#1a2b3c] [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-[#0a2540] [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:font-display [&_h3]:text-lg [&_h3]:text-[#0a2540] [&_h3]:mt-6 [&_h3]:mb-1 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_li]:my-1 [&_a]:text-[#c9a84c] [&_a]:underline">
            {children}
          </article>

          <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row gap-3 justify-between text-sm text-[#6b7e96]">
            <Link href="/legal/privacy" className="hover:text-[#c9a84c]">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-[#c9a84c]">
              Terms of Service
            </Link>
            <Link href="/legal/cookies" className="hover:text-[#c9a84c]">
              Cookie Policy
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
