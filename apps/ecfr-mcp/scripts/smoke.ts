import { spawn } from "node:child_process";
import { ecfrFetch, resolveDate } from "../src/client.ts";

function send(child: ReturnType<typeof spawn>, msg: object) {
  child.stdin!.write(`${JSON.stringify(msg)}\n`);
}

async function mcpSmoke(): Promise<void> {
  const child = spawn("npx", ["tsx", "src/index.ts"], {
    cwd: new URL("..", import.meta.url).pathname,
    stdio: ["pipe", "pipe", "pipe"],
  });

  let buffer = "";
  const lines: string[] = [];
  child.stdout!.on("data", (chunk: Buffer) => {
    buffer += chunk.toString();
    let idx;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (line) lines.push(line);
    }
  });

  const err: string[] = [];
  child.stderr!.on("data", (chunk: Buffer) => {
    err.push(chunk.toString());
  });

  send(child, {
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "ecfr-mcp-smoke", version: "1.0.0" },
    },
  });

  const deadline = Date.now() + 20000;
  while (lines.length === 0 && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 50));
  }

  if (lines.length === 0) {
    child.kill();
    throw new Error(`no MCP initialize response. stderr=${err.join("")}`);
  }

  const init = JSON.parse(lines[0]);
  if (!init.result?.serverInfo?.name) {
    child.kill();
    throw new Error(`bad initialize: ${lines[0]}`);
  }

  send(child, { jsonrpc: "2.0", method: "notifications/initialized" });
  send(child, { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
  send(child, {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: { name: "search_results", arguments: { query: "ITAR", per_page: 1 } },
  });

  while (lines.length < 3 && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 50));
  }
  child.kill();

  const listed = JSON.parse(lines[1] ?? "{}");
  const names = (listed.result?.tools ?? []).map((t: { name: string }) => t.name);
  if (names.length < 15) {
    throw new Error(`expected 15 tools, got ${names.length}: ${names.join(", ")} stderr=${err.join("")}`);
  }
  const called = JSON.parse(lines[2] ?? "{}");
  const body = called.result?.content?.[0]?.text ?? "";
  if (called.error || called.result?.isError || !body.includes("results")) {
    throw new Error(`search_results call failed: ${lines[2] ?? "missing"}`);
  }
  console.log(`mcp ok: ${init.result.serverInfo.name} tools=${names.length} search_results`);
}

const titles = await ecfrFetch("/api/versioner/v1/titles.json");
if (!titles.ok) throw new Error(`titles HTTP ${titles.status}`);
const parsed = JSON.parse(titles.text) as { titles: { number: number }[] };
if (parsed.titles.length < 40) throw new Error("titles payload too small");

const snapshot = await resolveDate("22");
const section = await ecfrFetch(`/api/versioner/v1/full/${snapshot}/title-22.xml`, {
  part: "120",
  section: "120.1",
});
if (!section.ok) throw new Error(`22 CFR 120.1 HTTP ${section.status}: ${section.text.slice(0, 400)}`);
if (!section.text.includes("120.1") && !section.text.includes("DIVISION")) {
  throw new Error("22 CFR 120.1 XML missing expected markers");
}

console.log(`api ok: ${parsed.titles.length} titles, 22 CFR 120.1 ${section.text.length} chars`);
await mcpSmoke();
