export const ECFR_BASE = "https://www.ecfr.gov";
export const USER_AGENT = "itarAI-ecfr-mcp/1.0";
export const MAX_CHARS = 80_000;

type TitlesPayload = {
  titles: { number: number; latest_issue_date?: string; up_to_date_as_of?: string }[];
  meta?: { date?: string };
};

let titlesCache: TitlesPayload | null = null;

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function resolveDate(title?: string, explicit?: string): Promise<string> {
  if (explicit) return explicit;
  const titles = await loadTitles();
  if (title) {
    const row = titles.titles.find((item) => String(item.number) === String(title));
    if (row?.latest_issue_date) return row.latest_issue_date;
    if (row?.up_to_date_as_of) return row.up_to_date_as_of;
  }
  return titles.meta?.date ?? todayUtc();
}

async function loadTitles(): Promise<TitlesPayload> {
  if (titlesCache) return titlesCache;
  const result = await ecfrFetch("/api/versioner/v1/titles.json");
  if (!result.ok) {
    throw new Error(`eCFR titles HTTP ${result.status}: ${result.text}`);
  }
  titlesCache = JSON.parse(result.text) as TitlesPayload;
  return titlesCache;
}

export function clip(text: string): string {
  if (text.length <= MAX_CHARS) return text;
  return `${text.slice(0, MAX_CHARS)}\n\n[truncated: ${text.length} chars, showing first ${MAX_CHARS}. Narrow with part/section or pagination.]`;
}

export function buildUrl(path: string, query: Record<string, unknown> = {}): URL {
  const url = new URL(path, ECFR_BASE);
  for (const [key, value] of Object.entries(query)) {
    if (value == null || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item == null || item === "") continue;
        url.searchParams.append(key, String(item));
      }
      continue;
    }
    url.searchParams.set(key, String(value));
  }
  return url;
}

export async function ecfrFetch(
  path: string,
  query: Record<string, unknown> = {},
): Promise<{ ok: boolean; status: number; text: string; url: string }> {
  const url = buildUrl(path, query);
  const xml = path.endsWith(".xml");
  const res = await fetch(url, {
    headers: {
      Accept: xml ? "application/xml" : "application/json",
      "User-Agent": USER_AGENT,
    },
  });
  const raw = await res.text();
  return {
    ok: res.ok,
    status: res.status,
    url: url.toString(),
    text: res.ok ? clip(raw) : clip(raw.slice(0, 4000)),
  };
}
