import { TADOW_INSTRUCTIONS } from "../../ai/instructions.mjs";
const MAX_BODY_BYTES = 12_000;
const MAX_HISTORY_MESSAGES = 8;
const MAX_MESSAGE_CHARS = 2_500;
const MAX_OUTPUT_TOKENS = 900;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 12;
const SUPPORTED_LANGUAGES = new Set(["en", "ko", "uz", "ru", "es", "de"]);

// Best-effort instance-level protection. Use a shared rate limiter before scaling publicly.
const requestLog = globalThis.__tadowRequestLog ??= new Map();

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function addOrigin(set, value) {
  if (!value) return;
  try {
    const parsed = new URL(value.trim());
    if (parsed.protocol === "https:" || parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      set.add(parsed.origin);
    }
  } catch {
    // Ignore malformed environment values rather than widening access.
  }
}

function isAllowedOrigin(request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    const parsedOrigin = new URL(origin).origin;
    const allowed = new Set([
      "https://nayimovulugbek.com",
      "https://www.nayimovulugbek.com",
      "https://nayimovulugbek.netlify.app",
    ]);
    addOrigin(allowed, process.env.URL);
    addOrigin(allowed, process.env.DEPLOY_PRIME_URL);
    for (const value of (process.env.TADOW_ALLOWED_ORIGINS || "").split(",")) addOrigin(allowed, value);
    if (process.env.CONTEXT === "dev" || process.env.NETLIFY_DEV === "true") {
      allowed.add("http://localhost:8888");
      allowed.add("http://127.0.0.1:8888");
    }
    return allowed.has(parsedOrigin);
  } catch {
    return false;
  }
}

function isRateLimited(request) {
  const ip = request.headers.get("x-nf-client-connection-ip") || "unknown";
  const now = Date.now();
  const previous = (requestLog.get(ip) || []).filter(timestamp => now - timestamp < WINDOW_MS);
  if (previous.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(ip, previous);
    return true;
  }
  previous.push(now);
  requestLog.set(ip, previous);
  if (requestLog.size > 1000) {
    for (const [key, values] of requestLog) {
      if (!values.length || now - values[values.length - 1] > WINDOW_MS) requestLog.delete(key);
    }
  }
  return false;
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history.slice(-MAX_HISTORY_MESSAGES).flatMap(item => {
    if (!item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string") return [];
    const content = item.content.trim().slice(0, MAX_MESSAGE_CHARS);
    return content ? [{ role: item.role, content }] : [];
  });
}

function extractAnswerAndCitations(result) {
  const answerParts = [];
  const citations = [];
  for (const item of result?.output || []) {
    if (item?.type !== "message") continue;
    for (const part of item.content || []) {
      if (part?.type !== "output_text" || typeof part.text !== "string") continue;
      answerParts.push(part.text);
      for (const annotation of part.annotations || []) {
        if (annotation?.type !== "url_citation" || typeof annotation.url !== "string") continue;
        try {
          const url = new URL(annotation.url);
          if (url.protocol !== "https:") continue;
          if (!citations.some(entry => entry.url === url.href)) {
            citations.push({ title: String(annotation.title || url.hostname).slice(0, 180), url: url.href });
          }
        } catch {
          // Skip malformed citations.
        }
      }
    }
  }
  const answer = answerParts.join("\n\n").trim() || (typeof result?.output_text === "string" ? result.output_text.trim() : "");
  return { answer, citations: citations.slice(0, 8) };
}

export default async function handler(request) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  if (!isAllowedOrigin(request)) return json({ error: "Origin not allowed." }, 403);
  if (!(request.headers.get("content-type") || "").toLowerCase().includes("application/json")) {
    return json({ error: "Content-Type must be application/json." }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) return json({ error: "Your message is too large." }, 413);

  let body;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) return json({ error: "Your message is too large." }, 413);
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: "Invalid request format." }, 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "The request body must be a JSON object." }, 400);

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return json({ error: "Please enter a message." }, 400);
  if (message.length > MAX_MESSAGE_CHARS) return json({ error: `Please keep messages under ${MAX_MESSAGE_CHARS} characters.` }, 400);
  if (isRateLimited(request)) return json({ error: "Too many messages. Please wait a few minutes and try again." }, 429);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return json({ error: "TADOW AI is not configured yet. Please try again later." }, 503);

  const language = SUPPORTED_LANGUAGES.has(body.language) ? body.language : "en";
  const input = [...cleanHistory(body.history), { role: "user", content: message }];
  const payload = {
    model: process.env.OPENAI_MODEL || "gpt-6.1-sol",
    instructions: `${TADOW_INSTRUCTIONS}\n\nThe visitor's selected website language is ${language}. Reply in that language.`,
    input,
    max_output_tokens: MAX_OUTPUT_TOKENS,
    store: false,
  };
  if (process.env.TADOW_ENABLE_WEB_SEARCH === "true") {
    payload.tools = [{ type: "web_search", search_context_size: "low" }];
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("TADOW AI provider error:", response.status, result?.error?.type || "unknown");
      if (response.status === 429) return json({ error: "TADOW AI is receiving too many requests. Please try again shortly." }, 503);
      if ([401, 403].includes(response.status)) return json({ error: "TADOW AI configuration needs attention. Please contact the website owner." }, 503);
      return json({ error: "TADOW AI could not complete that request. Please try again." }, 502);
    }
    const { answer, citations } = extractAnswerAndCitations(result);
    if (!answer) return json({ error: "I couldn't prepare an answer just now. Please try again." }, 502);
    return json({ answer, citations });
  } catch (error) {
    console.error("TADOW AI request failed:", error?.name || "Error");
    return json({ error: error?.name === "AbortError" ? "That took too long. Please try again." : "Connection problem. Please try again shortly." }, 502);
  } finally {
    clearTimeout(timeout);
  }
}
