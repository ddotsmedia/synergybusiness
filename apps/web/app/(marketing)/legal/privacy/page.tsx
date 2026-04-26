import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { getPageContent, getString } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Synergy Business collects, uses and protects your personal information under UAE Federal Decree-Law No. 45 of 2021 (PDPL).",
  alternates: { canonical: "/legal/privacy" },
  robots: { index: true, follow: true },
};

export const revalidate = 60;

export default async function Page() {
  const content = await getPageContent("legal-privacy");
  const title = getString(content, "header.title", "Privacy Policy");
  const updated = getString(content, "header.updated", "January 2026");
  const lead = getString(content, "header.lead", "");

  return (
    <LegalLayout title={title} updated={updated} lead={lead || undefined}>
      <p>
        Synergy Business Consultancy LLC (&ldquo;Synergy&rdquo;,
        &ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to protecting your
        privacy. This policy describes how we collect, use, disclose and
        safeguard your personal information when you use{" "}
        <a href="/">synergybusiness.ae</a> or engage us for business setup
        services. We process personal data in accordance with UAE Federal
        Decree-Law No. 45 of 2021 on the Protection of Personal Data
        (&ldquo;PDPL&rdquo;).
      </p>

      <h2>1. Information we collect</h2>
      <p>We collect personal information in the following categories:</p>
      <ul>
        <li>
          <strong>Identity & contact data:</strong> name, nationality,
          passport number, email, phone, date of birth, residential address.
        </li>
        <li>
          <strong>KYC & due diligence data:</strong> source of funds, bank
          references, proof of address, beneficial-ownership disclosures.
        </li>
        <li>
          <strong>Business data:</strong> proposed activity, shareholding
          structure, target markets and financial projections.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, browser type, device
          identifiers and pages visited (collected via cookies).
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To incorporate your company and obtain regulatory approvals</li>
        <li>
          To comply with UAE federal AML/CFT, ESR, and corporate tax
          obligations
        </li>
        <li>
          To respond to your enquiries and provide ongoing PRO and visa
          services
        </li>
        <li>
          To send service updates and renewal reminders (you can opt out)
        </li>
        <li>To improve our website and client portal experience</li>
      </ul>

      <h2>3. Lawful basis for processing</h2>
      <p>
        We process your data on the basis of consent, contract performance,
        compliance with UAE legal obligations, and legitimate business
        interests. Where consent is the basis, you may withdraw it at any time
        by emailing <a href="mailto:privacy@synergybusiness.ae">privacy@synergybusiness.ae</a>.
      </p>

      <h2>4. Sharing your information</h2>
      <p>We share personal data only with:</p>
      <ul>
        <li>
          UAE government authorities (DED, ADDED, MOHRE, GDRFA, ICA, MOFA,
          FTA, Ministry of Economy)
        </li>
        <li>
          Free zone authorities relevant to your incorporation (ADGM, KIZAD,
          twofour54, RAKEZ and others)
        </li>
        <li>
          Banks and financial institutions where you authorise us to make
          introductions
        </li>
        <li>
          Trusted technology vendors (e.g. cloud storage, CRM, email) under
          written data-processing agreements
        </li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>5. International transfers</h2>
      <p>
        Some of our technology vendors are located outside the UAE.
        Cross-border transfers occur only when adequate safeguards are in
        place (PDPL-compliant contracts, equivalent-protection assessments
        and, where required, your explicit consent).
      </p>

      <h2>6. Your rights</h2>
      <p>Under the PDPL you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion (subject to retention obligations)</li>
        <li>Object to direct marketing</li>
        <li>Restrict or object to certain processing</li>
        <li>Lodge a complaint with the UAE Data Office</li>
      </ul>
      <p>
        To exercise these rights, email{" "}
        <a href="mailto:privacy@synergybusiness.ae">
          privacy@synergybusiness.ae
        </a>
        . We respond within 30 days.
      </p>

      <h2>7. Data retention</h2>
      <p>
        We retain client KYC and engagement records for a minimum of 5 years
        after the end of our engagement, in line with UAE AML/CFT regulations.
        We retain other personal data only for as long as needed for the
        purposes described above.
      </p>

      <h2>8. Security</h2>
      <p>
        We use access controls, encryption in transit and at rest, regular
        backups and staff training to protect your data. No system is 100%
        secure; in the event of a personal-data breach we notify the UAE Data
        Office and affected individuals without undue delay.
      </p>

      <h2>9. Contact</h2>
      <p>
        Synergy Business Consultancy LLC
        <br />
        Office 24, Al Maryah Tower, Al Maryah Island, Abu Dhabi, UAE
        <br />
        <a href="mailto:privacy@synergybusiness.ae">
          privacy@synergybusiness.ae
        </a>
      </p>
    </LegalLayout>
  );
}
