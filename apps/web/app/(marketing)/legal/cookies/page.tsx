import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { getPageContent, getString } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How synergybusiness.ae uses cookies and how you can control them.",
  alternates: { canonical: "/legal/cookies" },
};

export const revalidate = 60;

export default async function Page() {
  const content = await getPageContent("legal-cookies");
  const title = getString(content, "header.title", "Cookie Policy");
  const updated = getString(content, "header.updated", "January 2026");
  const lead = getString(content, "header.lead", "");

  return (
    <LegalLayout title={title} updated={updated} lead={lead || undefined}>
      <p>
        This policy explains how Synergy Business Consultancy LLC uses
        cookies and similar tracking technologies on{" "}
        <a href="/">synergybusiness.ae</a> and what choices you have.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a
        website. They allow the site to recognise your device and store
        information about your visit, such as language preferences and login
        state.
      </p>

      <h2>2. How we use cookies</h2>
      <p>We use cookies in three categories:</p>
      <ul>
        <li>
          <strong>Strictly necessary:</strong> required for the site to work
          (session, security, load balancing). These cannot be disabled.
        </li>
        <li>
          <strong>Performance & analytics:</strong> help us understand how
          visitors interact with the site so we can improve it. We aggregate
          and anonymise this data.
        </li>
        <li>
          <strong>Marketing:</strong> measure the effectiveness of our
          advertising and remember the channels that brought you to us. We do
          not run third-party retargeting without your explicit consent.
        </li>
      </ul>

      <h2>3. Third-party cookies</h2>
      <p>We may use the following third-party services:</p>
      <ul>
        <li>
          <strong>Google Analytics</strong> — anonymised usage statistics
        </li>
        <li>
          <strong>HubSpot</strong> — CRM and lead-form analytics
        </li>
        <li>
          <strong>Vercel</strong> — performance and uptime monitoring
        </li>
      </ul>
      <p>
        Each of these providers operates under their own privacy and cookie
        policies.
      </p>

      <h2>4. Managing cookies</h2>
      <p>
        You can control cookies via your browser settings (block all, accept
        only first-party, etc.). Disabling strictly necessary cookies will
        break parts of the site. You can also opt out of analytics cookies via
        the browser&apos;s &ldquo;Do Not Track&rdquo; setting, which we
        honour.
      </p>

      <h2>5. Updates</h2>
      <p>
        We may update this policy. The current version is always posted on
        this page with the &ldquo;last updated&rdquo; date.
      </p>

      <h2>6. Contact</h2>
      <p>
        Questions about cookies? Email{" "}
        <a href="mailto:privacy@synergybusiness.ae">
          privacy@synergybusiness.ae
        </a>
        .
      </p>
    </LegalLayout>
  );
}
