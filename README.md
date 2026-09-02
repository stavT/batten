<p align="center">
  <img src="assets/icon.svg" width="72" alt="Batten" />
</p>

<h1 align="center">Batten</h1>

<p align="center">
  <strong>ChatGPT-class AI for defense work. On your machine. Free.</strong>
</p>

<p align="center">
  Chat, documents, agents, and tools — built so ITAR and CUI never have to leave the building.
</p>

<div align="center">

<table>
<tbody>
<td align="center">
<a href="#what-you-get"><strong>What you get</strong></a>
</td>
<td align="center">
<a href="#why-this-exists"><strong>Why it exists</strong></a>
</td>
<td align="center">
<a href="#trust"><strong>Trust</strong></a>
</td>
<td align="center">
<a href="./docs/README.md"><strong>Docs</strong></a>
</td>
</tbody>
</table>

</div>

<p align="center">
Apache 2.0 · No seats · No vendor cloud · No $25k gateway
</p>

---

## What you get

A **Jan-style desktop workspace** anyone at a defense company can open. Not a coding-only tool. Not a government portal. Not a pipe you have to wire.

<div align="center">
<table>
<tr>
<td align="center" width="50%">

### Chat & documents

Ask questions. Drop a spec, CDRL, or briefing.
Same muscle memory as Claude or ChatGPT.

<a href="./apps/workspace/README.md">Workspace</a>
<br><br>

</td>
<td align="center" width="50%">

### Agents & tools

MCP tools, files, and light agents — with
a deny you can see when something is blocked.

<a href="./control-plane/README.md">Control plane</a>
<br><br>

</td>
</tr>
<tr>
<td align="center" width="50%">

### ITAR-safe by design

Data stays in *your* environment. Local or
approved models only. No Chinese-origin families.

<a href="#trust">How trust works</a>
<br><br>

</td>
<td align="center" width="50%">

### Free, on purpose

Apache 2.0. Download it. Run it. Share it.
Defense innovation should not wait on a program office.

<a href="./LICENSE">License</a>
<br><br>

</td>
</tr>
</table>
</div>

**Status:** building in public. Star the repo for the first desktop build.

---

## Why this exists

You want ChatGPT at work. Security said no.

Claude for Government is FedRAMP / CUI — **not ITAR**. Ask Sage sells to the government. The rest are a GovCloud project or a $25k gateway. Engineers can stand up a cluster. Everyone else cannot.

Batten is the app for everyone else: capture, program, systems, finance, and engineering. Install. Sign in. Work.

We do not build another LLM. We make a general AI agent + tools that an ISSM can allow.

---

## How it works

```text
Install  →  Sign in  →  Open a project  →  Chat / docs / agents
```

Every request is classified **before** a model sees it.

```text
ITAR   →  local approved US/allied model, local tools, no web
CUI    →  approved endpoint or local model
Public →  approved frontier model, controlled web
Unknown →  blocked
```

You see Fast / Reasoning / Writing. Not GGUF files. Not a three-week integration.

| Family | Role |
|---|---|
| Llama, Gemma, Phi, Granite | Local general work |
| Mistral | Allied-origin general work |
| Claude / GPT | Frontier, only when policy allows egress |
| China-origin families | Blocked |

---

## Trust

There is **no** government “ITAR-certified AI” seal. Anyone who sells you one is lying.

Batten is ITAR-safe because of **where it runs and what it is allowed to call**:

- Your machine or your enclave — not our cloud
- Approved catalog only
- Tools and web are default-deny on controlled work
- Security gets a log: who, what, which model, which tool, which policy

That is the whole product. A license is not compliance. A FedRAMP badge on someone else’s SaaS is not ITAR.

---

## Index

| | | |
|---|---|---|
| **Workspace** | Chat, documents, agents — the thing people open. | [`apps/workspace/`](./apps/workspace) |
| **Control plane** | Identity, classification, tools, egress, audit. | [`control-plane/`](./control-plane) |
| **Coding** | Later pane for teams that already DIY on-prem. | [`apps/coding/`](./apps/coding) |
| **Docs** | Install and operator guides. | [`docs/`](./docs) |
| **eCFR** | Public CFR lookup MCP. Repo tool, not the product. | [`apps/ecfr-mcp/`](./apps/ecfr-mcp) |

---

## eCFR

stdio MCP over the public [eCFR API](https://www.ecfr.gov/developers/documentation/api/v1). ITAR is Title 22. EAR is Title 15.

```sh
cd apps/ecfr-mcp
npm install
npm run smoke
```

---

## License

Copyright 2026 Stav Tsechansky.

Apache License 2.0. Free as in you do not pay us to innovate on defense work. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

---

## Business Development

Company-building notes — ideas, not the product.

Private: [itarAI-business-development](https://github.com/stavT/itarAI-business-development).
