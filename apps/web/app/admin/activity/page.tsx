import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { listActivity } from "@/lib/admin/activity";

export const metadata = { title: "Activity log" };
export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const items = await listActivity(100);

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <p className="text-xs uppercase tracking-wider text-[#c9a84c] font-semibold">
          Audit trail
        </p>
        <h1 className="mt-1 font-display text-3xl text-[#0a2540]">
          Activity log
        </h1>
        <p className="mt-1 text-sm text-[#6b7e96]">
          Every state change made by an admin user, with actor + timestamp.
        </p>
      </header>

      <section className="rounded-2xl bg-white border border-border p-5">
        <ActivityFeed items={items} />
      </section>
    </div>
  );
}
