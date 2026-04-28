import { buildMetadata } from "@/lib/seo";
import { BookAppointmentPage } from "@/components/marketing/BookAppointmentPage";
import { getPageContent } from "@/lib/site-content";

export const metadata = buildMetadata({
  title: "Book an Appointment",
  description:
    "Schedule a free 30-minute consultation with a Synergy Business setup specialist in Abu Dhabi, Dubai, Ras Al Khaimah, or by video call.",
  path: "/book",
});

export const revalidate = 60;

export default async function Page() {
  const content = await getPageContent("book");
  return <BookAppointmentPage content={content} />;
}
