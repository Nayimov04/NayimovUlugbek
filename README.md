# Nayimov Ulugbek — Official Website

Static HTML/CSS/JavaScript website with six language options and the TADOW AI integration.

## TADOW AI setup (Netlify)

1. Push this project to the existing GitHub repository connected to Netlify.
2. In Netlify, open **Site configuration → Environment variables**.
3. Add `OPENAI_API_KEY` with your OpenAI API key. Make sure its scope includes **Functions**. Never put the key in this repository or browser JavaScript.
4. Optional: add `OPENAI_MODEL` if you want to override the default model (`gpt-6-astra`) with a model enabled for your API project.
5. Optional: set `TADOW_ENABLE_WEB_SEARCH` to `true` to allow the assistant to use OpenAI web search for current questions. This may increase API usage costs.
6. If you connect a custom domain later, set `TADOW_ALLOWED_ORIGINS` to its full HTTPS origin(s), comma-separated, then redeploy.
7. Trigger a fresh deploy after adding or changing environment variables.
8. Test the floating TADOW AI button on desktop and mobile.

The chat keeps a short conversation context in page memory only; refreshing or closing the page clears it. The server sends `store: false` to the Responses API. The function includes request-size and input-length limits plus best-effort per-instance throttling. For a high-traffic public launch, add a durable shared rate limiter and usage alerts.

## Local development

Install the Netlify CLI, set `OPENAI_API_KEY` in your local environment (never commit it), and run `netlify dev`. The function endpoint is `/.netlify/functions/tadow-ai`.

## Public knowledge policy

`ai/knowledge.mjs` contains only facts intentionally published on the official website. Update it when public biography or project status changes. Do not add private personal information.
