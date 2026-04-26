export type HubSpotLeadInput = {
  name: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message?: string;
  source?: string;
};

const HUBSPOT_API = "https://api.hubapi.com";

export type HubSpotResult =
  | { status: "ok"; contactId: string }
  | { status: "skipped"; reason: string }
  | { status: "error"; message: string };

export async function pushLeadToHubSpot(
  input: HubSpotLeadInput,
): Promise<HubSpotResult> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) {
    return { status: "skipped", reason: "HUBSPOT_API_KEY not set" };
  }

  const [firstName, ...rest] = input.name.trim().split(/\s+/);
  const lastName = rest.join(" ") || "—";

  const properties: Record<string, string> = {
    email: input.email,
    firstname: firstName ?? "",
    lastname: lastName,
    phone: input.phone,
    service_interest: input.serviceInterest,
    lead_source: input.source ?? "website",
  };
  if (input.message) properties.message = input.message;

  try {
    const res = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    });

    if (res.ok) {
      const json = (await res.json()) as { id: string };
      return { status: "ok", contactId: json.id };
    }

    // 409 Conflict = contact already exists. Try to update by email.
    if (res.status === 409) {
      const update = await fetch(
        `${HUBSPOT_API}/crm/v3/objects/contacts/${encodeURIComponent(input.email)}?idProperty=email`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ properties }),
        },
      );
      if (update.ok) {
        const json = (await update.json()) as { id: string };
        return { status: "ok", contactId: json.id };
      }
      return {
        status: "error",
        message: `HubSpot update failed: ${update.status}`,
      };
    }

    const body = await res.text();
    return {
      status: "error",
      message: `HubSpot ${res.status}: ${body.slice(0, 200)}`,
    };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "HubSpot fetch failed",
    };
  }
}
