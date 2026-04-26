import { Resend } from "resend";

export type LeadEmailInput = {
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message?: string;
  source?: string;
};

export type EmailResult =
  | { status: "ok"; id: string | null }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

const FROM_DEFAULT = "Synergy Business <onboarding@resend.dev>";
const NOTIFY_DEFAULT = "hello@synergybusiness.ae";

function resendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const SERVICE_LABELS: Record<string, string> = {
  mainland: "Mainland Setup",
  "free-zone": "Free Zone Setup",
  offshore: "Offshore Company",
  "pro-services": "PRO Services",
  visa: "Visa Services",
  "golden-visa": "Golden Visa",
  other: "Other",
};

function labelOf(slug: string) {
  return SERVICE_LABELS[slug] ?? slug;
}

function escape(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function userConfirmationHtml(input: LeadEmailInput) {
  return `
    <div style="font-family:'DM Sans',Arial,sans-serif;background:#f8f9fc;padding:32px 0;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(10,37,64,0.08);">
        <div style="background:#0a2540;padding:28px 32px;color:#ffffff;">
          <div style="font-family:'Playfair Display',Georgia,serif;font-size:24px;line-height:1;letter-spacing:-0.01em;">
            Synergy <span style="color:#c9a84c;">Business</span>
          </div>
        </div>
        <div style="padding:28px 32px;color:#1a2b3c;line-height:1.6;font-size:15px;">
          <p style="margin:0 0 12px;">Hi ${escape(input.name.split(/\s+/)[0] || "there")},</p>
          <p style="margin:0 0 12px;">
            Thanks for reaching out — we&rsquo;ve received your enquiry about
            <strong>${escape(labelOf(input.serviceInterest))}</strong>.
            A Synergy consultant will reply within one business hour with a
            recommendation and an itemised quote.
          </p>
          <p style="margin:0 0 12px;">
            If you&rsquo;d like to chat sooner, WhatsApp us at
            <a href="https://wa.me/971500000000" style="color:#c9a84c;">+971 50 000 0000</a>.
          </p>
          <p style="margin:24px 0 0;color:#6b7e96;font-size:13px;">
            — The Synergy team<br/>
            Office 24, Al Maryah Tower, Abu Dhabi
          </p>
        </div>
      </div>
    </div>
  `;
}

function internalNotificationHtml(input: LeadEmailInput) {
  return `
    <div style="font-family:'DM Sans',Arial,sans-serif;background:#f8f9fc;padding:24px 0;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#0a2540;padding:16px 20px;color:#c9a84c;font-weight:bold;letter-spacing:0.04em;text-transform:uppercase;font-size:12px;">
          New website lead
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#1a2b3c;">
          <tr><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;width:140px;color:#6b7e96;">Name</td><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;">${escape(input.name)}</td></tr>
          <tr><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;color:#6b7e96;">Email</td><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;"><a href="mailto:${escape(input.email)}" style="color:#0a2540;">${escape(input.email)}</a></td></tr>
          <tr><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;color:#6b7e96;">Phone</td><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;"><a href="tel:${escape(input.phone)}" style="color:#0a2540;">${escape(input.phone)}</a></td></tr>
          <tr><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;color:#6b7e96;">Service</td><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;">${escape(labelOf(input.serviceInterest))}</td></tr>
          <tr><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;color:#6b7e96;">Source</td><td style="padding:12px 20px;border-bottom:1px solid #eef1f6;">${escape(input.source ?? "website")}</td></tr>
          ${
            input.message
              ? `<tr><td style="padding:12px 20px;color:#6b7e96;vertical-align:top;">Message</td><td style="padding:12px 20px;white-space:pre-wrap;">${escape(input.message)}</td></tr>`
              : ""
          }
        </table>
      </div>
    </div>
  `;
}

export async function sendLeadConfirmation(
  input: LeadEmailInput,
): Promise<EmailResult> {
  const client = resendClient();
  if (!client) {
    return { status: "skipped", reason: "RESEND_API_KEY not set" };
  }
  try {
    const { data, error } = await client.emails.send({
      from: process.env.EMAIL_FROM ?? FROM_DEFAULT,
      to: [input.email],
      subject: "We've got your enquiry — Synergy Business",
      html: userConfirmationHtml(input),
    });
    if (error) return { status: "error", message: error.message };
    return { status: "ok", id: data?.id ?? null };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Resend send failed",
    };
  }
}

export async function sendInternalLeadNotification(
  input: LeadEmailInput,
): Promise<EmailResult> {
  const client = resendClient();
  if (!client) {
    return { status: "skipped", reason: "RESEND_API_KEY not set" };
  }
  const to = (process.env.LEAD_NOTIFICATION_EMAIL ?? NOTIFY_DEFAULT)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  try {
    const { data, error } = await client.emails.send({
      from: process.env.EMAIL_FROM ?? FROM_DEFAULT,
      to,
      subject: `New lead — ${input.name} (${labelOf(input.serviceInterest)})`,
      replyTo: input.email,
      html: internalNotificationHtml(input),
    });
    if (error) return { status: "error", message: error.message };
    return { status: "ok", id: data?.id ?? null };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Resend send failed",
    };
  }
}
