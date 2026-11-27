# TADOW AI v1 — Website Assistant

This is an overlay package built from the latest supplied Nayimov Ulugbek homepage. Merge it into your existing website repository; do not delete or replace existing certificate, CV, profile-photo or other asset folders. Those complete site assets were not all included with the latest HTML upload. It is a first working foundation, not a claim that the complete long-term TADOW AI platform is finished.

## Included

- The latest supplied homepage, with TADOW AI added as a floating assistant.
- Six-language interface: English, Korean, Uzbek, Russian, Spanish and German.
- Netlify Function using the OpenAI Responses API.
- Public-only creator knowledge, separated from private information.
- Optional web search with source links returned to the widget.
- `store: false`, input limits, output limits, timeouts, origin checks and best-effort per-instance throttling.
- Basic Node.js tests for the server function.

## Required before the live site can answer

1. Deploy this package to a Netlify site with Functions enabled.
2. In Netlify, add `OPENAI_API_KEY` as an environment variable available to Functions. Never put it in HTML, JavaScript, GitHub or this file.
3. Optional: set `OPENAI_MODEL` to a model available to your API project. Default: `gpt-6.1-sol`.
4. Optional: set `TADOW_ENABLE_WEB_SEARCH=true` to enable live web research and source links. Web search adds API usage charges.
5. Add `TADOW_ALLOWED_ORIGINS=https://nayimovulugbek.com,https://www.nayimovulugbek.com` if you use those custom-domain origins; they are already in the default allowlist.
6. Trigger a new Netlify deploy after setting environment variables.

The OpenAI API is billed separately from a ChatGPT subscription. Set an API project budget/usage alert before public launch.

## Local testing

- Install Node.js and Netlify CLI.
- Set `OPENAI_API_KEY` in your local shell (do not commit it).
- Run `netlify dev` from the project root.
- Open the local site through Netlify Dev so the function route is available.

## Tests

Run `node --test tests/tadow-ai.test.mjs`.

## Privacy and limits

- The website does not save the chat transcript to local storage or a database. Short context exists in the page while it remains open.
- The server sends `store: false` to the Responses API. This is not a blanket statement about all provider-side retention; review the provider's current data controls and policies.
- The included rate limiter is per serverless instance and best-effort. It is not a durable global abuse-control system. Before high-traffic public launch, add a shared rate limiter or challenge and configure strict API usage limits/alerts.
- The browser calls only the Netlify Function. The OpenAI API key remains server-side.

## Project status

TADOW AI v1 is an initial website assistant. Persistent memory, user accounts, file uploads, document analysis, autonomous agents, code execution, MT5 integration and an independent platform are future work and are not included in this release.
