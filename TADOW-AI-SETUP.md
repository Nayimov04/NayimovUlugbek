# TADOW AI v1 — deployment checklist

1. Back up the current GitHub repository before changing it.
2. Copy/merge the contents of this package into the repository root (do not add an extra nested folder). Preserve all existing certificate, CV, profile-photo and other asset folders; this overlay does not contain every asset from your full website.
3. Confirm `netlify.toml` uses the correct publish directory and functions directory for the existing site.
4. Add `OPENAI_API_KEY` in Netlify environment variables with Functions runtime access. Never commit the key.
5. Keep `OPENAI_MODEL` unset to use `gpt-6.1-sol`, or set it to a model enabled for your API project.
6. For live research and clickable source links, set `TADOW_ENABLE_WEB_SEARCH=true`. This adds usage charges; keep it off until an API budget/alert is configured.
7. Deploy and test on the Netlify deploy URL before changing the primary domain.
8. Test all six languages, mobile layout, error states and the source links returned by web search.
9. In browser DevTools, verify that the browser calls `/.netlify/functions/tadow-ai` and never sends requests directly to `api.openai.com`.
10. Search the deployed source and Git history to ensure no API key is exposed.

The function accepts requests only from the official custom domains, the existing Netlify domain, and Netlify's deployment URLs. Local Netlify Dev origins are allowed only in local development.

Before a public launch, add a durable shared rate limiter or bot challenge, set OpenAI usage limits/alerts, and review provider data-retention settings. The current in-memory limiter is best-effort only.
