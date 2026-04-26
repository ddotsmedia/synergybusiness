import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of synergybusiness.ae and Synergy Business Consultancy LLC services.",
  alternates: { canonical: "/legal/terms" },
};

export default function Page() {
  return (
    <LegalLayout title="Terms of Service" updated="January 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of{" "}
        <a href="/">synergybusiness.ae</a> (the &ldquo;Site&rdquo;) and the
        services provided by Synergy Business Consultancy LLC
        (&ldquo;Synergy&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a limited
        liability company licensed by the Abu Dhabi Department of Economic
        Development. By using the Site or engaging us, you accept these
        Terms.
      </p>

      <h2>1. Eligibility</h2>
      <p>
        You must be at least 18 years old and legally able to enter into
        contracts to use our services. By engaging Synergy you confirm that
        the information you provide is accurate and complete.
      </p>

      <h2>2. Scope of services</h2>
      <p>
        We provide UAE business setup, PRO, visa and Golden Visa services as
        agreed in a separate written engagement letter. The engagement letter
        prevails over these Terms in case of conflict. We act as your agent
        with UAE government and free-zone authorities; we do not provide
        legal, tax or audit advice unless explicitly stated.
      </p>

      <h2>3. Fees and payment</h2>
      <ul>
        <li>
          Fees are quoted in AED and are exclusive of UAE VAT (5%) unless
          stated.
        </li>
        <li>
          Government and free-zone fees are passed through at cost. Synergy
          service fees are payable in advance unless otherwise agreed.
        </li>
        <li>
          Government fees are non-refundable once paid to the relevant
          authority. Synergy service fees are refundable on a pro-rata basis
          if we have not yet performed the work.
        </li>
      </ul>

      <h2>4. Client obligations</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate, complete and timely KYC documentation</li>
        <li>
          Notify us promptly of changes to ownership, activity or contact
          details
        </li>
        <li>
          Comply with all UAE laws and regulations applicable to your business
        </li>
        <li>Not use our services for any unlawful purpose</li>
      </ul>

      <h2>5. Confidentiality</h2>
      <p>
        We treat all information shared by you as strictly confidential. We
        disclose your information only to government authorities, regulators,
        banks (where you authorise) and our internal team on a need-to-know
        basis. We do not share client lists or commercial information with
        third parties without your consent.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        The Site and its content (text, graphics, logos, software) are owned
        by Synergy or licensed to us, and are protected by UAE and
        international intellectual-property laws. You may not reproduce,
        distribute or create derivative works without our written permission.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by UAE law, our aggregate liability
        for any claim arising out of these Terms or our services is limited
        to the fees paid by you to us in the 12 months preceding the claim.
        We are not liable for indirect, incidental or consequential damages.
        Nothing in these Terms limits liability for fraud or for matters that
        cannot be limited under UAE law.
      </p>

      <h2>8. Government processing risk</h2>
      <p>
        Synergy does not control UAE government processing times, fees or
        approval outcomes. While we apply best practice and follow up
        diligently, we cannot guarantee specific timelines or licence /
        visa outcomes. Government fees that are paid and subsequently
        forfeited due to applicant changes or rejection are not refundable.
      </p>

      <h2>9. Termination</h2>
      <p>
        Either party may terminate the engagement in writing. On termination,
        you remain responsible for fees earned and disbursements incurred up
        to the termination date. We may retain records as required by UAE
        AML/CFT regulations.
      </p>

      <h2>10. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of the Emirate of Abu Dhabi and
        applicable UAE federal laws. Disputes are submitted to the exclusive
        jurisdiction of the Abu Dhabi courts.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms from time to time. The current version is
        always posted on this page with the &ldquo;last updated&rdquo; date.
        Continued use of the Site after changes constitutes acceptance.
      </p>

      <h2>12. Contact</h2>
      <p>
        Synergy Business Consultancy LLC
        <br />
        Office 24, Al Maryah Tower, Al Maryah Island, Abu Dhabi, UAE
        <br />
        <a href="mailto:legal@synergybusiness.ae">
          legal@synergybusiness.ae
        </a>
      </p>
    </LegalLayout>
  );
}
