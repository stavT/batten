# eCFR

stdio MCP for the public [eCFR API](https://www.ecfr.gov/developers/documentation/api/v1). Search and fetch CFR text from Cursor or any MCP host. ITAR is Title 22; EAR is Title 15.

This is a repo tool, not the product. Security still lives in the [control plane](../../control-plane/README.md).

**Status:** runnable. Public eCFR only — no auth, no local cache. Repo index: [root README](../../README.md#ecfr).

Base URL: `https://www.ecfr.gov`

## Tools

| Tool | eCFR endpoint |
| --- | --- |
| `list_agencies` | `GET /api/admin/v1/agencies.json` |
| `list_corrections` | `GET /api/admin/v1/corrections.json` |
| `list_title_corrections` | `GET /api/admin/v1/corrections/title/{title}.json` |
| `search_results` | `GET /api/search/v1/results` |
| `search_count` | `GET /api/search/v1/count` |
| `search_summary` | `GET /api/search/v1/summary` |
| `search_counts_daily` | `GET /api/search/v1/counts/daily` |
| `search_counts_titles` | `GET /api/search/v1/counts/titles` |
| `search_counts_hierarchy` | `GET /api/search/v1/counts/hierarchy` |
| `search_suggestions` | `GET /api/search/v1/suggestions` |
| `list_titles` | `GET /api/versioner/v1/titles.json` |
| `get_structure` | `GET /api/versioner/v1/structure/{date}/title-{title}.json` |
| `get_ancestry` | `GET /api/versioner/v1/ancestry/{date}/title-{title}.json` |
| `get_full` | `GET /api/versioner/v1/full/{date}/title-{title}.xml` |
| `list_versions` | `GET /api/versioner/v1/versions/title-{title}.json` |

Omitted snapshot dates use that title's latest issue date. `get_full` / large structure payloads truncate at 80k characters — pass `part` or `section` (ITAR is Title 22; EAR is Title 15).

## Run

```sh
cd apps/ecfr-mcp
npm install
npm run smoke
npx tsx src/index.ts
```

Repo already wires this in [`.cursor/mcp.json`](../../.cursor/mcp.json) via the local `tsx` binary. Reload MCP in Cursor after `npm install`.

Inspector:

```sh
npm run inspector
```
