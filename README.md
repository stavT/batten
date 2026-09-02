<p align="center">
  <img src="assets/icon.svg" width="72" alt="Batten" />
</p>

<h1 align="center">Batten</h1>

<p align="center">
  <strong>ITAR-safe ChatGPT for defense work. On your computer. Free.</strong>
</p>

<p align="center">
  Talk to it. Drop in a spec or a briefing. Let it use the files and tools security allows.
  ITAR and CUI stay in your building.
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
ITAR-safe. Free and open source. No seats. No vendor cloud. No $25k middleman.
</p>

## What you get

An ITAR-safe app anyone at a defense company can open. Capture. Program. Systems. Finance. Engineering. If you were told no ChatGPT because the data is export-controlled, this is for you.

<div align="center">
<table>
<tr>
<td align="center" width="50%">

### Chat and documents

Ask a question. Drop a spec, a CDRL, or a briefing.
It feels like the ChatGPT or Claude you already know.

<a href="./apps/workspace/README.md">The app</a>
<br><br>

</td>
<td align="center" width="50%">

### It can do work, not just talk

Open files. Use the tools your company allows.
When something is blocked, you see why.

<a href="./control-plane/README.md">What security sees</a>
<br><br>

</td>
</tr>
<tr>
<td align="center" width="50%">

### ITAR-safe by design

ITAR and CUI stay on your machines.
Only approved models. Nothing from China.

<a href="#trust">How trust works</a>
<br><br>

</td>
<td align="center" width="50%">

### Free on purpose

Download it. Run it. Share it.
Defense work should not wait on a giant contract.

<a href="./LICENSE">License</a>
<br><br>

</td>
</tr>
</table>
</div>

**Status:** we are building this in the open. Star the repo to catch the first desktop release.

## Why this exists

You want ChatGPT at work. Security said no.

Claude for Government is fine for some CUI. It is not ITAR. The big name in government AI sells to the government, not to your shop. Everything else is a cloud program or a bill you cannot take to your boss.

Engineers can stand up their own servers. Everyone else is stuck. Batten is the ITAR-safe app for everyone else. Install. Sign in. Get back to work.

We do not build the model. We build the assistant security can allow on export-controlled work.

## How it works

Install, then sign in, then open a project, then talk or drop files.

Every request is checked before a model sees it.

```text
ITAR     stays local, approved US or allied model, no web
CUI      approved connection or local
Public   stronger model, only if security allows
Unknown  blocked
```

You pick Fast, Smart, or Write. You do not pick infrastructure.

| What you can use | When |
|---|---|
| Local US and allied models | Everyday and export-controlled work |
| Claude or GPT | Only when security says that data may leave |
| Anything from China | Never |

## Trust

There is no government stamp that says ITAR certified AI. Anyone selling you that stamp is lying.

Batten is ITAR-safe because of where it runs and what it is allowed to touch.

- Your computer or your company's room. Not our cloud.
- Only the model list security approved.
- Web and outside tools stay off unless a project is allowed to use them.
- Security gets a log. Who asked. What they touched. Which model. What was blocked.

A software license is not compliance. A badge on someone else's cloud is not ITAR.

## Index

| | | |
|---|---|---|
| **The app** | ITAR-safe chat, documents, and an assistant that can use files. | [`apps/workspace/`](./apps/workspace) |
| **What security sees** | Who is signed in, what is allowed, and the log. | [`control-plane/`](./control-plane) |
| **Coding** | Later. Software teams often already have a painful workaround. | [`apps/coding/`](./apps/coding) |
| **Docs** | Install and how to run it. | [`docs/`](./docs) |

## License

Copyright 2026 Stav Tsechansky.

Apache License 2.0. Free as in you do not pay us to do defense work. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

## Business Development

Company-building notes. Ideas, not the product.

Private: [itarAI-business-development](https://github.com/stavT/itarAI-business-development).
