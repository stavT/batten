<p align="center">
  <img src="assets/icon.svg" width="80" alt="itarAI" />
</p>

<h1 align="center">itarAI</h1>

<p align="center">
The secure AI computer for defense companies.
</p>

<div align="center">

<table>
<tbody>
<td align="center">
<a href="./docs/README.md"><strong>Docs</strong></a>
</td>
<td align="center">
<a href="./control-plane/README.md"><strong>Control Plane</strong></a>
</td>
<td align="center">
<a href="#policy-before-the-model"><strong>Trust</strong></a>
</td>
<td align="center">
<a href="./business-development"><strong>Business Development</strong></a>
</td>
</tbody>
</table>

</div>

<br>

<div align="center">
<table>
<tr>
<td align="center" width="50%">

### Workspace

Claude-like chat, documents, and agents
on approved models. Runs on the
contractor's machine — not our cloud.

<a href="./apps/workspace/README.md">Learn more</a>
<br><br>

</td>
<td align="center" width="50%">

### Control Plane

Identity, classification, model routing,
tool permissions, egress, and audit.
The AI firewall for the DIB.

<a href="./control-plane/README.md">Learn more</a>
<br><br>

</td>
</tr>
<tr>
<td align="center" width="50%">

### Coding

A Cline-class agent through the
control plane. GitHub, tests, and PRs
with policy on every tool call.

<a href="./apps/coding/README.md">Learn more</a>
<br><br>

</td>
<td align="center" width="50%">

### Deploy

Install → sign in → choose a project.
Sensitive work stays in the customer's
environment. Target: one day, not a program.

<a href="./docs/README.md">Learn more</a>
<br><br>

</td>
</tr>
</table>
</div>

<div align="center">
<table>
<tr>
<td align="center">

### Why this exists

Mid-sized defense contractors want Claude / Cursor / Cline. Security will not let sensitive engineering work leave the building through ordinary commercial AI. The alternative today is assembling models, gateways, identity, logging, and compliance into a months-long platform project.

itarAI is that environment as a product. We do not build another LLM.

</td>
</tr>
</table>
</div>

---

## Index

| Section | Description | Location |
|---------|------------|----------|
| **Workspace** | Desktop AI environment for chat, documents, and agents. | [`apps/workspace/`](./apps/workspace) |
| **Coding** | Secure coding-agent wedge. | [`apps/coding/`](./apps/coding) |
| **Control plane** | Policy, routing, tools, egress, audit, evidence. | [`control-plane/`](./control-plane) |
| **Docs** | Install, policy, and operator guides. | [`docs/`](./docs) |
| **eCFR** | stdio MCP for the public eCFR API. ITAR is Title 22; EAR is Title 15. | [`apps/ecfr-mcp/`](./apps/ecfr-mcp) |
| **Business Development** | Founder-only market research and company-building docs. | Private submodule: [`business-development/`](./business-development) |

## Runs In The Customer's Environment

Sensitive work does not go to a vendor SaaS by default. The workspace and control plane deploy where the contractor already works. Approved frontier endpoints are used only when policy allows it. Air-gap is a deployment mode, not the pitch.

## Policy Before The Model

Every request is classified before a model sees it.

```text
ITAR repo  → local approved US/allied model, local tools, no web
CUI        → approved endpoint or local model
Public Q   → approved frontier model + controlled web
Unknown    → blocked
```

GitHub read can be allowed while push requires approval. Unapproved models and Chinese-origin families are blocked. Security gets a log of who, what, which model, which tool, and which policy.

## Works With Approved Models

We are not locked to one provider. We are locked to an **approved catalog**.

| Family | Role |
|---|---|
| Llama, Gemma, Phi, Granite | Local general and coding |
| Mistral / Codestral | Allied-origin general and coding |
| Claude / GPT | Frontier reasoning, controlled egress only |
| China-origin families | Excluded |

The product abstracts the model. The customer should see Fast / Reasoning / Coding — not GGUF files.

## One-Day Deployment

The stack underneath can include Jan, Cline, Bifrost, OPA, Keycloak, and local inference. The customer should never operate that stack. If install takes a three-week professional-services project, the product has failed.

## eCFR

Live CFR lookup for this repo. stdio MCP over the public [eCFR API](https://www.ecfr.gov/developers/documentation/api/v1) — search, structure, and section XML. No HTTP listener.

ITAR is Title 22 Subchapter M. EAR is Title 15. Cursor already points at it in [`.cursor/mcp.json`](./.cursor/mcp.json).

```sh
cd apps/ecfr-mcp
npm install
npm run smoke
```

Tools and fetch limits: [`apps/ecfr-mcp/`](./apps/ecfr-mcp). This is a repo tool, not the product.

## Business Development

Company-building research is a [private submodule](https://github.com/stavT/itarAI-business-development). It is not part of the public product tree.

## License

Copyright 2026 Stav Tsechansky.

This repository and the [itarAI-business-development](https://github.com/stavT/itarAI-business-development) submodule are licensed under the Apache License, Version 2.0. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).
