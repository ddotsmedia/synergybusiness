/**
 * Single source of truth for site URLs and contact details.
 * Pulls from env where set, falls back to the canonical .ae domain.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_APP_URL ?? "https://synergybusiness.ae"
).replace(/\/$/, "");

export const siteHost = siteUrl.replace(/^https?:\/\//, "");

export const contactEmails = {
  general: "hello@synergybusiness.ae",
  legal: "legal@synergybusiness.ae",
  privacy: "privacy@synergybusiness.ae",
} as const;

export const phoneNumbers = {
  abuDhabi: "+971 2 000 0000",
  dubai: "+971 4 000 0000",
  rak: "+971 7 000 0000",
  whatsapp: "+971 50 000 0000",
} as const;

export const whatsappLink = "https://wa.me/971500000000";

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
