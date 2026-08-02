<!--
  wlylabs — GitHub profile README
  Palette: clay #D97757 · violet #412991 · ink #0D1117
-->

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:D97757,100:412991&height=200&section=header&text=wlylabs&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Solidity%20%C2%B7%20Next.js%20%C2%B7%20Edge%20AI%20%C2%B7%20Automation&descAlignY=58&descSize=18" width="100%" alt="wlylabs — Solidity, Next.js, edge AI, automation" />

<a href="https://x.com/wly0x_">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=800&color=D97757&center=true&vCenter=true&width=680&lines=Solo+builder.+Full+stack+of+one.;Bonding-curve+ERC20s+tested+with+Foundry.;Streaming+LLM+apps+on+the+edge.;Pipelines+that+run+while+I+sleep." alt="Solo builder — smart contracts, edge AI apps, automation pipelines" />
</a>

<p>
  <a href="https://x.com/wly0x_"><img src="https://img.shields.io/badge/Follow-%40wly0x__-000000?style=for-the-badge&logo=x&logoColor=white&labelColor=0D1117" alt="Follow @wly0x_ on X" /></a>
  <img src="https://img.shields.io/badge/Status-Shipping-D97757?style=for-the-badge&labelColor=0D1117" alt="Status: shipping" />
  <img src="https://komarev.com/ghpvc/?username=wlylabs&style=for-the-badge&color=412991&label=PROFILE+VIEWS" alt="Profile views" />
</p>

</div>

<br />

## 🚀 About Me

I'm an independent **solo builder**. No team, no standups — just an idea, a terminal,
and a clean commit history.

The work spans three layers and I own all of them: **onchain** (Solidity contracts
that hold real ETH), **the app in front of it** (Next.js, wallets, auth, PWA), and
**the automation behind it** (edge functions, AI pipelines, scheduled CI).

I build **AI-native** — designing, writing and reviewing alongside AI — but nothing
ships on vibes alone: contracts land with fuzz and invariant suites, endpoints land
with rate limits and a CSP, and every repo has CI that has to go green first.

<br />

## 🧰 What I've Built

<table>
<tr>
<th align="left" width="20%">Project</th>
<th align="left" width="46%">What it is</th>
<th align="left" width="34%">Stack</th>
</tr>

<tr>
<td valign="top">

**[Folio](https://github.com/wlylabs/Folio)**
<br />
<sub>token launchpad</sub>

</td>
<td valign="top">

Every token launch is published as an article. Each launch clones an **ERC20 that is
its own bonding-curve market maker** — buys and sells price off one constant-product
curve, so the reserve always covers every circulating token. Live on **Robinhood
Chain** with real ETH, plus a **Uniswap v4 migration** path at graduation.

</td>
<td valign="top">

`Solidity 0.8.26` `Foundry` `EIP-1167`
`Uniswap v4` `OpenZeppelin` `Slither`
<br />
`Next.js 14` `TypeScript` `wagmi`
`viem` `RainbowKit` `Supabase`

</td>
</tr>

<tr>
<td valign="top">

**[wlybot](https://github.com/wlylabs/wlybot)**
<br />
<sub>AI chat assistant</sub>

</td>
<td valign="top">

Mobile-first chat PWA on **one edge function**. Streams from Groq, falls through to
Gemini, then OpenRouter — a rate limit at any vendor never takes the app down,
because fallback happens *before* the first byte reaches the browser. Web search and
news via **tool calling**; Python code blocks run in-browser through Pyodide.

</td>
<td valign="top">

`Vercel Edge` `SSE streaming`
`Groq` `Gemini` `OpenRouter`
<br />
`Vanilla JS` `Zero deps` `PWA`
`Pyodide` `CSP + HSTS`

</td>
</tr>

<tr>
<td valign="top">

**[wlystock](https://github.com/wlylabs/wlystock)**
<br />
<sub>AI stock photo pipeline</sub>

</td>
<td valign="top">

Turns a curated prompt library into submission-ready stock photography, unattended.
Generates with **FLUX.1-schnell**, normalizes to stock aspect ratios, then captions
with a **vision-language model** to emit a titles-and-keywords CSV. Every stage has a
fallback, so one dead endpoint never stalls a run.

</td>
<td valign="top">

`Python 3.11` `Hugging Face API`
`FLUX.1-schnell` `Qwen2.5-VL`
<br />
`Pillow` `GitHub Actions` `cron`

</td>
</tr>
</table>

<br />

## 🛠️ Skills — and where to see them

<table>
<tr>
<td width="50%" valign="top">

**⛓️ Smart contracts**
Bonding-curve AMM maths, EIP-1167 minimal-proxy clones, upgradeable ERC20s,
reentrancy and anti-sniper defenses. **300+ Foundry tests** across unit, fuzz,
invariant, adversarial and gas suites, plus Slither in the loop.
<sub>→ `Folio/contracts`</sub>

**🌐 Web3 frontend**
Wallet connection that constructs *nothing* until the reader asks for it, live
onchain pricing, multi-chain-aware reads and trades, deploy records as data
rather than constants.
<sub>→ `Folio/app`, `Folio/lib`</sub>

</td>
<td width="50%" valign="top">

**🤖 Applied AI**
Streaming completions, multi-provider failover, function calling, prompt design
that survives small models, untrusted-tool-output envelopes against prompt
injection, and image + vision-language generation.
<sub>→ `wlybot/api`, `wlystock/src`</sub>

**🔐 Security-minded by default**
SIWE (EIP-4361) sign-in minting a Supabase JWT that Postgres **row-level
security** enforces, origin checks, rate limits, body caps, HTML-escaped
rendering, CSP · HSTS · frame-deny headers.
<sub>→ `Folio/lib/schema.sql`, `wlybot/vercel.json`</sub>

</td>
</tr>
<tr>
<td width="50%" valign="top">

**⚙️ Automation & CI**
Typecheck · lint · test · build on every push, contract suites split by EVM
profile, nightly fork tests against live Uniswap v4, and scheduled pipelines
that publish their own artifacts.
<sub>→ `.github/workflows` in every repo</sub>

</td>
<td width="50%" valign="top">

**📱 Product polish**
Installable PWAs, offline routes, themes applied before first paint, safe-area
layouts, custom Markdown rendering, SEO and OG images — the last 10% that makes
it feel finished.
<sub>→ `Folio/app`, `wlybot`</sub>

</td>
</tr>
</table>

<br />

## 🧪 My Stack

<div align="center">

**Onchain**

<img src="https://img.shields.io/badge/Solidity-0D1117?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
<img src="https://img.shields.io/badge/Foundry-D97757?style=for-the-badge&logoColor=white" alt="Foundry" />
<img src="https://img.shields.io/badge/OpenZeppelin-412991?style=for-the-badge&logo=openzeppelin&logoColor=white" alt="OpenZeppelin" />
<img src="https://img.shields.io/badge/Uniswap_v4-0D1117?style=for-the-badge&logo=uniswap&logoColor=white" alt="Uniswap v4" />
<img src="https://img.shields.io/badge/wagmi_%2F_viem-0D1117?style=for-the-badge&logo=ethereum&logoColor=white" alt="wagmi and viem" />

<br /><br />

**Code &amp; Ship**

<img src="https://skillicons.dev/icons?i=ts,js,react,nextjs,nodejs&perline=5" alt="TypeScript, JavaScript, React, Next.js, Node.js" />
<br />
<img src="https://skillicons.dev/icons?i=python,tailwind,supabase,vercel,githubactions&perline=5" alt="Python, Tailwind CSS, Supabase, Vercel, GitHub Actions" />

<br /><br />

**AI &amp; Copilots**

<img src="https://img.shields.io/badge/Claude_Code-D97757?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude Code" />
<img src="https://img.shields.io/badge/Groq-0D1117?style=for-the-badge&logoColor=white" alt="Groq" />
<img src="https://img.shields.io/badge/Gemini-412991?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini" />
<img src="https://img.shields.io/badge/OpenRouter-0D1117?style=for-the-badge&logo=openai&logoColor=white" alt="OpenRouter" />
<img src="https://img.shields.io/badge/Hugging_Face-0D1117?style=for-the-badge&logo=huggingface&logoColor=white" alt="Hugging Face" />

</div>

<br />

## 🧠 How I Build

<table>
<tr>
<td width="50%" valign="top">

**🎯 Problem first**
I start from what has to be true, never from the boilerplate.

**⚡ Ship in slices**
Small, frequent iterations over big-bang releases.

</td>
<td width="50%" valign="top">

**🧾 Write down the why**
The reasoning lives next to the code, so future me doesn't re-litigate it.

**🛡️ Prove it, don't assume it**
Tests, fuzzing and CI decide when something is done.

</td>
</tr>
</table>

<br />

## 📫 Get in Touch

- 💬 Always open to chat about onchain products, AI apps, and indie building
- 🤝 Looking to collaborate with other solo builders and makers

<div align="center">

<br />

<a href="https://x.com/wly0x_"><img src="https://img.shields.io/badge/Say_hi_on_X-000000?style=for-the-badge&logo=x&logoColor=white&labelColor=0D1117" alt="Say hi on X" /></a>
<a href="https://github.com/wlylabs?tab=repositories"><img src="https://img.shields.io/badge/Browse_the_repos-412991?style=for-the-badge&logo=github&logoColor=white&labelColor=0D1117" alt="Browse the repositories" /></a>

</div>

<br />

<div align="center">

<sub>Built with curiosity, coffee, and good vibes ☕</sub>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:412991,100:D97757&height=100&section=footer" width="100%" alt="" />

</div>
