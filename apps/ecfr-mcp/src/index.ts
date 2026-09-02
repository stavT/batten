import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { ecfrFetch, resolveDate } from "./client.ts";

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .describe("YYYY-MM-DD");

const title = z.string().describe("CFR title number, e.g. 15, 22, 32");

const hierarchy = {
  subtitle: z.string().optional().describe("Uppercase letter: A, B, C"),
  chapter: z.string().optional().describe("Roman numerals or digits: I, X, 1"),
  subchapter: z.string().optional().describe("Requires chapter. A, B, I"),
  part: z.string().optional().describe("Part identifier, e.g. 120"),
  subpart: z.string().optional().describe("Requires part. A, B, C"),
  section: z.string().optional().describe("Requires part. e.g. 120.1"),
  appendix: z.string().optional().describe("Requires subtitle, chapter, or part. A, III, App. A"),
};

const searchFilters = {
  query: z.string().optional().describe("Search headings and full text"),
  agency_slugs: z
    .array(z.string())
    .optional()
    .describe("Agency slugs from list_agencies, e.g. state-department"),
  date: date.optional().describe("Limit to content present on this date"),
  last_modified_after: date.optional(),
  last_modified_on_or_after: date.optional(),
  last_modified_before: date.optional(),
  last_modified_on_or_before: date.optional(),
};

type HierarchyArgs = {
  subtitle?: string;
  chapter?: string;
  subchapter?: string;
  part?: string;
  subpart?: string;
  section?: string;
  appendix?: string;
};

type SearchArgs = {
  query?: string;
  agency_slugs?: string[];
  date?: string;
  last_modified_after?: string;
  last_modified_on_or_after?: string;
  last_modified_before?: string;
  last_modified_on_or_before?: string;
  per_page?: number;
  page?: number;
  order?: string;
  paginate_by?: string;
};

function hierarchyQuery(args: HierarchyArgs): Record<string, unknown> {
  return {
    subtitle: args.subtitle,
    chapter: args.chapter,
    subchapter: args.subchapter,
    part: args.part,
    subpart: args.subpart,
    section: args.section,
    appendix: args.appendix,
  };
}

function searchQuery(args: SearchArgs): Record<string, unknown> {
  return {
    query: args.query,
    "agency_slugs[]": args.agency_slugs,
    date: args.date,
    last_modified_after: args.last_modified_after,
    last_modified_on_or_after: args.last_modified_on_or_after,
    last_modified_before: args.last_modified_before,
    last_modified_on_or_before: args.last_modified_on_or_before,
    per_page: args.per_page,
    page: args.page,
    order: args.order,
    paginate_by: args.paginate_by,
  };
}

function asToolResult(result: Awaited<ReturnType<typeof ecfrFetch>>) {
  if (!result.ok) {
    return {
      content: [{ type: "text" as const, text: `eCFR HTTP ${result.status} for ${result.url}\n${result.text}` }],
      isError: true,
    };
  }
  return { content: [{ type: "text" as const, text: result.text }] };
}

function createServer(): McpServer {
  const server = new McpServer({
    name: "ecfr",
    version: "1.0.0",
  });

  server.registerTool(
    "list_agencies",
    {
      description:
        "List eCFR agencies in name order, including child agencies, slugs, and CFR title/chapter references.",
      inputSchema: z.object({}),
    },
    async () => asToolResult(await ecfrFetch("/api/admin/v1/agencies.json")),
  );

  server.registerTool(
    "list_corrections",
    {
      description:
        "List eCFR corrections. Filter by title, snapshot date, or the date a correction took effect.",
      inputSchema: z.object({
        title: title.optional(),
        date: date.optional().describe("Corrections on or before this date that were fixed on or after it"),
        error_corrected_date: date.optional().describe("Only corrections fixed on this date"),
      }),
    },
    async (args) =>
      asToolResult(
        await ecfrFetch("/api/admin/v1/corrections.json", {
          title: args.title,
          date: args.date,
          error_corrected_date: args.error_corrected_date,
        }),
      ),
  );

  server.registerTool(
    "list_title_corrections",
    {
      description: "List all eCFR corrections for one CFR title.",
      inputSchema: z.object({ title }),
    },
    async ({ title: titleNumber }) =>
      asToolResult(await ecfrFetch(`/api/admin/v1/corrections/title/${titleNumber}.json`)),
  );

  const searchExtra = {
    per_page: z.number().int().min(1).max(1000).optional().describe("Results per page, default 20, max 1000"),
    page: z.number().int().min(1).optional().describe("Page number. Cannot paginate past 10,000 results"),
    order: z
      .enum(["citations", "relevance", "hierarchy", "newest_first", "oldest_first", "suggestions"])
      .optional()
      .describe("Sort order. Default relevance"),
    paginate_by: z
      .enum(["results", "date"])
      .optional()
      .describe("date groups results by last-modified date and requires a last_modified_* filter"),
  };

  server.registerTool(
    "search_results",
    {
      description:
        "Search eCFR headings and full text. Returns matching sections and appendices with excerpts.",
      inputSchema: z.object({ ...searchFilters, ...searchExtra }),
    },
    async (args) => asToolResult(await ecfrFetch("/api/search/v1/results", searchQuery(args))),
  );

  const searchOnly = [
    ["search_count", "Count eCFR search matches for a query.", "/api/search/v1/count"],
    ["search_summary", "Search summary details for an eCFR query.", "/api/search/v1/summary"],
    ["search_counts_daily", "eCFR search match counts grouped by date.", "/api/search/v1/counts/daily"],
    ["search_counts_titles", "eCFR search match counts grouped by CFR title.", "/api/search/v1/counts/titles"],
    [
      "search_counts_hierarchy",
      "eCFR search match counts grouped by hierarchy (title, chapter, part, ...).",
      "/api/search/v1/counts/hierarchy",
    ],
    ["search_suggestions", "Suggested queries for an eCFR search term.", "/api/search/v1/suggestions"],
  ] as const;

  for (const [name, description, path] of searchOnly) {
    server.registerTool(
      name,
      { description, inputSchema: z.object(searchFilters) },
      async (args) => asToolResult(await ecfrFetch(path, searchQuery(args))),
    );
  }

  server.registerTool(
    "list_titles",
    {
      description:
        "Summary of every CFR title: name, latest amendment, latest issue date, up-to-date date, reserved flag.",
      inputSchema: z.object({}),
    },
    async () => asToolResult(await ecfrFetch("/api/versioner/v1/titles.json")),
  );

  server.registerTool(
    "get_structure",
    {
      description:
        "Point-in-time structure JSON for a CFR title (labels, identifiers, children; no section body text).",
      inputSchema: z.object({
        title,
        date: date.optional().describe("Snapshot date. Defaults to the title's latest issue date"),
      }),
    },
    async (args) =>
      asToolResult(
        await ecfrFetch(
          `/api/versioner/v1/structure/${await resolveDate(args.title, args.date)}/title-${args.title}.json`,
        ),
      ),
  );

  server.registerTool(
    "get_ancestry",
    {
      description:
        "Ancestors from a CFR node up through the title on a snapshot date. Pass part+section to pin a leaf.",
      inputSchema: z.object({
        title,
        date: date.optional().describe("Snapshot date. Defaults to the title's latest issue date"),
        ...hierarchy,
      }),
    },
    async (args) =>
      asToolResult(
        await ecfrFetch(
          `/api/versioner/v1/ancestry/${await resolveDate(args.title, args.date)}/title-${args.title}.json`,
          hierarchyQuery(args),
        ),
      ),
  );

  server.registerTool(
    "get_full",
    {
      description:
        "Source XML for a title or a subset. Prefer part/section; full titles can be tens of MB and are truncated.",
      inputSchema: z.object({
        title,
        date: date.optional().describe("Snapshot date. Defaults to the title's latest issue date"),
        ...hierarchy,
      }),
    },
    async (args) =>
      asToolResult(
        await ecfrFetch(
          `/api/versioner/v1/full/${await resolveDate(args.title, args.date)}/title-${args.title}.xml`,
          hierarchyQuery(args),
        ),
      ),
  );

  server.registerTool(
    "list_versions",
    {
      description:
        "Sections and appendices inside a title, filtered by issue date. At least one issue date is required; defaults to on-or-before the title's latest issue date.",
      inputSchema: z.object({
        title,
        issue_date_on: date.optional().describe("Content added on this issue date. Cannot combine with gte/lte"),
        issue_date_lte: date.optional().describe("Content added on or before this issue date"),
        issue_date_gte: date.optional().describe("Content added on or after this issue date"),
        page: z.number().int().min(1).optional().describe("Page number. 1000 records per page"),
        ...hierarchy,
      }),
    },
    async (args) => {
      const hasIssue = Boolean(args.issue_date_on || args.issue_date_lte || args.issue_date_gte);
      return asToolResult(
        await ecfrFetch(`/api/versioner/v1/versions/title-${args.title}.json`, {
          "issue_date[on]": args.issue_date_on,
          "issue_date[lte]":
            args.issue_date_lte ?? (hasIssue ? undefined : await resolveDate(args.title)),
          "issue_date[gte]": args.issue_date_gte,
          page: args.page,
          ...hierarchyQuery(args),
        }),
      );
    },
  );

  return server;
}

void serveStdio(createServer);
console.error("ecfr MCP running on stdio");
