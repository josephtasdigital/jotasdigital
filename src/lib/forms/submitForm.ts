// Unified form submission system.
// - Submits to Formspree (JSON)
// - Builds a single standardized lead event for dataLayer / GTM
// - Applies Consent Mode v2 gating for user-provided identifiers
// - Generates a stable event_id for downstream deduplication

import { getConsentState, type ConsentState } from "@/lib/cookie-consent";
import { getAttribution } from "./attribution";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    BreadTracker?: {
      send: (event: string, payload: Record<string, unknown>) => void;
    };
  }
}

export type FormType =
  | "contact"
  | "audit"
  | "service"
  | "partner_offer"
  | "newsletter"
  | "other";

export interface FormConfig {
  /** Stable machine name used by GTM/GA4, e.g. "contact_main". */
  form_name: string;
  /** DOM id / instance id. */
  form_id: string;
  form_type: FormType;
  /** Page section or modal where the form lives. */
  form_location: string;
  /** Used by Ads / CRM, e.g. "audit-request", "service-inquiry". */
  lead_type: string;
  /** Optional contextual metadata. */
  service_name?: string;
  popup_name?: string;
  page_context?: string;
  /** Override the Formspree endpoint. Defaults to VITE_FORMSPREE_URL. */
  formspreeUrl?: string;
}

/** Fields known to carry PII; gated by ad/analytics consent. */
export interface UserDataInput {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
}

export interface FormDataInput {
  company?: string;
  message?: string;
  selected_service?: string;
  [key: string]: unknown;
}

export interface SubmitParams {
  config: FormConfig;
  /** Payload sent to Formspree (will be merged with metadata). */
  payload: Record<string, unknown>;
  user?: UserDataInput;
  formData?: FormDataInput;
}

export interface LeadEvent {
  event: "lead_form_submit";
  event_id: string;
  event_time: string;
  form_name: string;
  form_id: string;
  form_type: FormType;
  form_location: string;
  lead_type: string;
  service_name?: string;
  popup_name?: string;
  page_context?: string;
  page_location: string;
  page_path: string;
  page_title: string;
  referrer: string | null;
  language: string;
  attribution: ReturnType<typeof getAttribution>;
  consent: ConsentState;
  user_data: {
    email_address?: string;
    phone_number?: string;
    address?: { first_name?: string; last_name?: string };
  };
  form_data: {
    company?: string;
    message_length?: number;
    selected_service?: string;
  };
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // RFC4122-ish fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Hash an email for non-PII identifiers when consent is denied. */
async function sha256(text: string): Promise<string | undefined> {
  try {
    const buf = new TextEncoder().encode(text.trim().toLowerCase());
    const digest = await crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return undefined;
  }
}

export function createLeadEventPayload(
  params: SubmitParams,
  eventId: string,
  consent: ConsentState,
): LeadEvent {
  const { config, user = {}, formData = {} } = params;

  const adAllowed = consent.ad_user_data === "granted";

  const user_data: LeadEvent["user_data"] = {};
  if (adAllowed) {
    if (user.email) user_data.email_address = user.email;
    if (user.phone) user_data.phone_number = user.phone;
    if (user.first_name || user.last_name) {
      user_data.address = {
        first_name: user.first_name,
        last_name: user.last_name,
      };
    }
  }

  return {
    event: "lead_form_submit",
    event_id: eventId,
    event_time: new Date().toISOString(),
    form_name: config.form_name,
    form_id: config.form_id,
    form_type: config.form_type,
    form_location: config.form_location,
    lead_type: config.lead_type,
    service_name: config.service_name,
    popup_name: config.popup_name,
    page_context: config.page_context,
    page_location: typeof window !== "undefined" ? window.location.href : "",
    page_path: typeof window !== "undefined" ? window.location.pathname : "",
    page_title: typeof document !== "undefined" ? document.title : "",
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    language:
      typeof document !== "undefined" ? document.documentElement.lang || "en" : "en",
    attribution: getAttribution(),
    consent,
    user_data,
    form_data: {
      company: formData.company,
      message_length: formData.message ? String(formData.message).length : undefined,
      selected_service: formData.selected_service,
    },
  };
}

function pushDataLayer(event: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

/** In-flight & success guards keyed by form_id, prevent double-fires. */
const inflight = new Set<string>();
const sentEventIds = new Set<string>();

export interface SubmitResult {
  ok: boolean;
  event_id: string;
  error?: string;
}

export async function submitTrackedForm(params: SubmitParams): Promise<SubmitResult> {
  const { config, payload, user = {}, formData = {} } = params;
  const consent = getConsentState();
  const eventId = uuid();

  if (inflight.has(config.form_id)) {
    return { ok: false, event_id: eventId, error: "submission_in_flight" };
  }
  inflight.add(config.form_id);

  // Optional attempt event for debugging funnels.
  pushDataLayer({
    event: "lead_form_attempt",
    event_id: eventId,
    form_name: config.form_name,
    form_id: config.form_id,
    form_type: config.form_type,
  });

  const formspreeUrl =
    config.formspreeUrl ||
    (import.meta as ImportMeta & { env: Record<string, string> }).env
      ?.VITE_FORMSPREE_URL ||
    "https://formspree.io/f/xnjgavkv";

  // Merge meta into the Formspree payload for inbox readability.
  const body = {
    _subject: payload._subject ?? `${config.lead_type} — ${config.form_name}`,
    form_name: config.form_name,
    form_type: config.form_type,
    form_location: config.form_location,
    lead_type: config.lead_type,
    service_name: config.service_name,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
    event_id: eventId,
    ...payload,
  };

  try {
    const res = await fetch(formspreeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      pushDataLayer({
        event: "lead_form_error",
        event_id: eventId,
        form_name: config.form_name,
        form_id: config.form_id,
        status: res.status,
      });
      return { ok: false, event_id: eventId, error: `http_${res.status}` };
    }

    // Success — fire exactly once per event_id.
    if (!sentEventIds.has(eventId)) {
      sentEventIds.add(eventId);
      const leadEvent = createLeadEventPayload({ config, payload, user, formData }, eventId, consent);
      pushDataLayer(leadEvent as unknown as Record<string, unknown>);

      // Bridge to BreadTracker (server-side) without duplicating event_id work.
      try {
        // Hash email for downstream CAPI use even when raw PII is gated.
        const email_sha256 = user.email ? await sha256(user.email) : undefined;
        window.BreadTracker?.send("generate_lead", {
          event_id: eventId,
          lead_type: config.lead_type,
          form_name: config.form_name,
          form_type: config.form_type,
          service_name: config.service_name,
          consent,
          user_data: leadEvent.user_data,
          user_data_hashed: email_sha256 ? { email_sha256 } : undefined,
          attribution: leadEvent.attribution,
        });
      } catch (err) {
        // Tracker is best-effort; never break the submission UX.
        console.warn("BreadTracker bridge failed:", err);
      }
    }

    return { ok: true, event_id: eventId };
  } catch (err) {
    pushDataLayer({
      event: "lead_form_error",
      event_id: eventId,
      form_name: config.form_name,
      form_id: config.form_id,
      error: (err as Error).message,
    });
    return { ok: false, event_id: eventId, error: (err as Error).message };
  } finally {
    inflight.delete(config.form_id);
  }
}
