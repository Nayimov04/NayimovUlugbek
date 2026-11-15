# TADOW AI — Phase 1 deployment checklist

## What is included

- Floating TADOW AI chat widget, visually matched to the site's black/crimson identity.
- Widget labels and welcome prompts in English, Korean, Uzbek, Russian, Spanish, and German.
- Reads the existing website language selector on every request.
- Netlify Function at `/.netlify/functions/tadow-ai`.
- OpenAI Responses API integration with a public-site-only knowledge base.
- Short in-page conversation context; it is not saved to localStorage or a database.
- `store: false` on Responses API requests.
- Input size limits, output limits, origin checks, and best-effort per-instance throttling.

## Publish to the existing GitHub repository

1. Keep a backup of the current repository before replacing or editing files.
2. Copy the contents of this project folder into the root of the existing repository. Do not create an extra nested `NayimovUlugbek-main` directory inside the repository.
3. Commit and push the changes to the branch currently connected to Netlify (normally `main`).
4. Confirm that Netlify starts a new deploy and that the deploy succeeds.

## Configure the OpenAI key in Netlify

1. Open the existing site in Netlify.
2. Go to **Site configuration → Environment variables** (the menu wording may vary).
3. Add `OPENAI_API_KEY` and paste the API key value.
4. Ensure the variable is available to **Functions** at runtime.
5. Do not put the key in `index.html`, any browser JavaScript, GitHub, or `netlify.toml`.
6. Trigger a new deploy after adding the variable.

If you later connect a custom domain, add `TADOW_ALLOWED_ORIGINS` in Netlify as a comma-separated list of full HTTPS origins, for example `https://nayimovulugbek.com,https://www.nayimovulugbek.com`. Add only domains you control, then redeploy.

## Optional configuration

- `OPENAI_MODEL`: override the default `gpt-6-astra` with a model that is enabled for the API project.
- `TADOW_ENABLE_WEB_SEARCH`: set to `true` to enable the Responses API web-search tool. Leave unset for the initial launch; enabling it may increase usage costs.

## Smoke tests after deployment

1. Open the homepage and verify the TADOW button appears at the bottom-right.
2. Open the chat and ask who Nayimov Ulugbek is.
3. Change the website language to Korean, Uzbek, Russian, Spanish, and German; ask a short question in each language.
4. Ask what the listed projects' statuses are; TADOW must preserve the website's `in progress` and `planned` labels.
5. Test on a narrow mobile screen.
6. Inspect the browser network panel: the browser should call the Netlify function, never OpenAI directly.
7. Confirm that no API key appears in page source, browser network requests, or the Git repository.

## Important production note

The included in-memory rate limiter is best-effort only because serverless instances can scale independently and restart. Before a high-traffic public launch, add a durable shared rate limiter and configure OpenAI usage limits/alerts. The OpenAI API key and API usage are separate from a ChatGPT subscription.
