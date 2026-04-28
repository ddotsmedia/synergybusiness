import { buildMetadata } from "@/lib/seo";
import { BookAppointmentPage } from "@/components/marketing/BookAppointmentPage";

export const metadata = buildMetadata({
  title: "Book an Appointment",
  description:
    "Schedule a free 30-minute consultation with a Synergy Business setup specialist in Abu Dhabi, Dubai, Ras Al Khaimah, or by video call.",
  path: "/book",
});

export default function Page() {
  return <BookAppointmentPage />;
}
