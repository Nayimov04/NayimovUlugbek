# TADOW AI v1 status

This is a first website-integrated assistant build. It is not the final independent TADOW AI platform.

Implemented in this package: six-language chat UI, Netlify server function, OpenAI Responses API adapter, creator public-knowledge file, optional web search/citations, bounded in-memory session context, request validation, origin checks, timeouts, best-effort rate limiting and basic tests.

Not implemented: persistent visitor memory, user accounts, file/document uploads, code execution, autonomous agents, MT5 connection, voice, independent app/platform, durable global rate limiting.

No API key is included. A valid OpenAI API key must be configured as a server-side Netlify environment variable before the assistant can answer live requests.
