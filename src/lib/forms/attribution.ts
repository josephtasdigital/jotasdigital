// Attribution capture & persistence (consent-neutral, first-party).
// Stored in sessionStorage (session_*) and localStorage (original_*) so we
// retain both the entry context and the very first touch.

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_id",
  "utm_term",
  "utm_content",
] as const;

const CLICK_IDS = ["gclid", "wbraid", "gbraid", "fbclid"] as const;

const ATTR_KEYS = [...UTM_KEYS, ...CLICK_IDS] as const;

export type AttributionFields = Partial<Record<(typeof ATTR_KEYS)[number], string>>;

export interface AttributionPayload extends AttributionFields {
  landing_page: string | null;
  session_entry_page: string | null;
  original_referrer: string | null;
}

const SESSION_KEY = "bread_attribution_session";
const ORIGINAL_KEY = "bread_attribution_original";

interface StoredAttribution {
  fields: AttributionFields;
  landing_page: string;
  referrer: string | null;
  ts: number;
}

function readJSON<T>(storage: Storage | null, key: string): T | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(storage: Storage | null, key: string, value: unknown) {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota / privacy mode */
  }
}

function extractFromUrl(): AttributionFields {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out: AttributionFields = {};
  for (const key of ATTR_KEYS) {
    const v = params.get(key);
    if (v) out[key] = v;
  }
  return out;
}

/**
 * Call once on app boot. Captures the current URL's attribution params
 * into the session record (first touch wins per session) and locks an
 * original-touch record (first touch ever) if not present.
 */
export function initAttribution(): void {
  if (typeof window === "undefined") return;
  const session = window.sessionStorage ?? null;
  const local = window.localStorage ?? null;
  const fields = extractFromUrl();
  const hasFields = Object.keys(fields).length > 0;

  if (!readJSON<StoredAttribution>(session, SESSION_KEY)) {
    writeJSON(session, SESSION_KEY, {
      fields,
      landing_page: window.location.href,
      referrer: document.referrer || null,
      ts: Date.now(),
    } satisfies StoredAttribution);
  } else if (hasFields) {
    // Refresh fields if a later in-session page has new UTMs.
    const cur = readJSON<StoredAttribution>(session, SESSION_KEY)!;
    writeJSON(session, SESSION_KEY, { ...cur, fields: { ...cur.fields, ...fields } });
  }

  if (!readJSON<StoredAttribution>(local, ORIGINAL_KEY)) {
    writeJSON(local, ORIGINAL_KEY, {
      fields,
      landing_page: window.location.href,
      referrer: document.referrer || null,
      ts: Date.now(),
    } satisfies StoredAttribution);
  }
}

export function getAttribution(): AttributionPayload {
  if (typeof window === "undefined") {
    return { landing_page: null, session_entry_page: null, original_referrer: null };
  }
  const session = readJSON<StoredAttribution>(window.sessionStorage ?? null, SESSION_KEY);
  const original = readJSON<StoredAttribution>(window.localStorage ?? null, ORIGINAL_KEY);

  // Prefer session-level UTMs (current visit), fall back to original touch.
  const fields: AttributionFields = {
    ...(original?.fields ?? {}),
    ...(session?.fields ?? {}),
  };

  return {
    ...fields,
    landing_page: original?.landing_page ?? session?.landing_page ?? window.location.href,
    session_entry_page: session?.landing_page ?? null,
    original_referrer: original?.referrer ?? null,
  };
}
