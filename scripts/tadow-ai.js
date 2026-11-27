(() => {
  "use strict";
  if (document.getElementById("tadow-ai-root")) return;

  const copy = {
    en: { open:"Open TADOW AI", close:"Close chat", subtitle:"AI ASSISTANT", welcome:"Hello. I'm TADOW AI, an AI assistant created by Nayimov Ulugbek. I can help with learning, reasoning, writing, coding concepts, business, technology and more. What shall we explore?", placeholder:"Message TADOW AI…", send:"Send message", note:"AI-generated responses. Verify important information. This website does not save your chat history.", quick:["What can you do?","Explain a difficult topic","What is TADOW AI?"], error:"I couldn't connect just now. Please try again.", sources:"Sources" },
    ko: { open:"TADOW AI 열기", close:"채팅 닫기", subtitle:"AI 어시스턴트", welcome:"안녕하세요. 저는 Nayimov Ulugbek이 만든 AI 어시스턴트 TADOW AI입니다. 학습, 추론, 글쓰기, 코딩 개념, 비즈니스, 기술 등 다양한 주제를 도와드릴 수 있습니다. 무엇을 함께 살펴볼까요?", placeholder:"TADOW AI에게 메시지 보내기…", send:"메시지 보내기", note:"AI 생성 답변입니다. 중요한 정보는 확인해 주세요. 이 웹사이트는 채팅 기록을 저장하지 않습니다.", quick:["무엇을 할 수 있나요?","어려운 주제를 설명해 주세요","TADOW AI란 무엇인가요?"], error:"지금 연결할 수 없습니다. 다시 시도해 주세요.", sources:"출처" },
    uz: { open:"TADOW AI'ni ochish", close:"Chatni yopish", subtitle:"AI YORDAMCHI", welcome:"Assalomu alaykum. Men Nayimov Ulugbek yaratgan TADOW AI sun’iy intellekt yordamchisiman. Ta’lim, tahlil, yozish, dasturlash tushunchalari, biznes, texnologiya va boshqa mavzularda yordam bera olaman. Nimani o‘rganamiz?", placeholder:"TADOW AI ga xabar yozing…", send:"Xabar yuborish", note:"Javoblar AI tomonidan yaratiladi. Muhim ma’lumotlarni tekshiring. Ushbu sayt chat tarixini saqlamaydi.", quick:["Nimalar qila olasiz?","Murakkab mavzuni tushuntiring","TADOW AI nima?"], error:"Hozir ulanib bo‘lmadi. Qayta urinib ko‘ring.", sources:"Manbalar" },
    ru: { open:"Открыть TADOW AI", close:"Закрыть чат", subtitle:"ИИ-АССИСТЕНТ", welcome:"Здравствуйте. Я TADOW AI — ИИ-ассистент, созданный Nayimov Ulugbek. Я могу помогать с обучением, анализом, текстами, концепциями программирования, бизнесом, технологиями и другими темами. Что изучим?", placeholder:"Напишите TADOW AI…", send:"Отправить", note:"Ответы созданы ИИ. Проверяйте важную информацию. Этот сайт не сохраняет историю чата.", quick:["Что вы умеете?","Объясните сложную тему","Что такое TADOW AI?"], error:"Не удалось подключиться. Попробуйте ещё раз.", sources:"Источники" },
    es: { open:"Abrir TADOW AI", close:"Cerrar chat", subtitle:"ASISTENTE DE IA", welcome:"Hola. Soy TADOW AI, un asistente de IA creado por Nayimov Ulugbek. Puedo ayudarte con aprendizaje, razonamiento, escritura, conceptos de programación, negocios, tecnología y mucho más. ¿Qué exploramos?", placeholder:"Escribe a TADOW AI…", send:"Enviar mensaje", note:"Respuestas generadas por IA. Verifica la información importante. Este sitio no guarda el historial del chat.", quick:["¿Qué puedes hacer?","Explica un tema difícil","¿Qué es TADOW AI?"], error:"No se pudo conectar. Inténtalo de nuevo.", sources:"Fuentes" },
    de: { open:"TADOW AI öffnen", close:"Chat schließen", subtitle:"KI-ASSISTENT", welcome:"Hallo. Ich bin TADOW AI, ein von Nayimov Ulugbek entwickelter KI-Assistent. Ich unterstütze beim Lernen, Analysieren, Schreiben, bei Programmierkonzepten, Wirtschaft, Technologie und mehr. Was möchten Sie erkunden?", placeholder:"Nachricht an TADOW AI…", send:"Nachricht senden", note:"KI-generierte Antworten. Bitte wichtige Informationen überprüfen. Diese Website speichert den Chatverlauf nicht.", quick:["Was kannst du tun?","Erkläre ein schwieriges Thema","Was ist TADOW AI?"], error:"Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.", sources:"Quellen" }
  };

  const root = document.createElement("div");
  root.id = "tadow-ai-root";
  root.innerHTML = `
    <button class="tadow-launcher" type="button" aria-label="Open TADOW AI" aria-expanded="false" aria-controls="tadow-panel">
      <span class="tadow-launcher-mark" aria-hidden="true">T</span>
    </button>
    <section class="tadow-panel" id="tadow-panel" role="dialog" aria-modal="false" aria-label="TADOW AI assistant" aria-hidden="true">
      <header class="tadow-header">
        <div class="tadow-mark" aria-hidden="true">T</div>
        <div class="tadow-heading"><strong>TADOW AI</strong><span data-role="subtitle">AI ASSISTANT</span></div>
        <button class="tadow-close" type="button" aria-label="Close chat">×</button>
      </header>
      <div class="tadow-messages" aria-live="polite" aria-relevant="additions"></div>
      <div class="tadow-quick" data-role="quick"></div>
      <form class="tadow-form">
        <textarea rows="1" maxlength="2500" aria-label="Message TADOW AI" placeholder="Message TADOW AI…" required></textarea>
        <button class="tadow-send" type="submit" aria-label="Send message"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12 20 4l-5 16-3-6-8-2Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m12 14 4-5" stroke="currentColor" stroke-width="1.7"/></svg></button>
      </form>
      <div class="tadow-note" data-role="note"></div>
    </section>`;
  document.body.appendChild(root);

  const launcher = root.querySelector(".tadow-launcher");
  const panel = root.querySelector(".tadow-panel");
  const closeButton = root.querySelector(".tadow-close");
  const messages = root.querySelector(".tadow-messages");
  const quick = root.querySelector('[data-role="quick"]');
  const form = root.querySelector(".tadow-form");
  const textarea = form.querySelector("textarea");
  const sendButton = form.querySelector("button");
  const history = [];
  let busy = false;
  let currentLanguage = "en";

  function getLanguage() {
    const selected = document.getElementById("language")?.value || document.documentElement.lang || "en";
    return copy[selected] ? selected : "en";
  }

  function addMessage(text, role, citations = []) {
    const item = document.createElement("div");
    item.className = `tadow-message ${role}`;
    const body = document.createElement("div");
    body.className = "tadow-message-text";
    body.textContent = text;
    item.appendChild(body);
    if (role === "assistant" && Array.isArray(citations) && citations.length) {
      const sourceBlock = document.createElement("div");
      sourceBlock.className = "tadow-sources";
      const label = document.createElement("strong");
      label.textContent = `${copy[currentLanguage].sources}:`;
      sourceBlock.appendChild(label);
      citations.slice(0, 8).forEach(source => {
        try {
          const url = new URL(source.url);
          if (url.protocol !== "https:") return;
          const link = document.createElement("a");
          link.href = url.href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.textContent = source.title || url.hostname;
          sourceBlock.appendChild(link);
        } catch { /* Ignore malformed citation URLs. */ }
      });
      if (sourceBlock.querySelector("a")) item.appendChild(sourceBlock);
    }
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function updateLanguage() {
    currentLanguage = getLanguage();
    const t = copy[currentLanguage];
    launcher.setAttribute("aria-label", panel.classList.contains("is-open") ? t.close : t.open);
    closeButton.setAttribute("aria-label", t.close);
    root.querySelector('[data-role="subtitle"]').textContent = t.subtitle;
    textarea.placeholder = t.placeholder;
    textarea.setAttribute("aria-label", t.placeholder);
    sendButton.setAttribute("aria-label", t.send);
    root.querySelector('[data-role="note"]').textContent = t.note;
    quick.replaceChildren();
    t.quick.forEach(prompt => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = prompt;
      button.addEventListener("click", () => { textarea.value = prompt; sendMessage(); });
      quick.appendChild(button);
    });
    if (!messages.children.length) addMessage(t.welcome, "assistant");
  }

  function openPanel() {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", copy[currentLanguage].close);
    textarea.focus();
  }

  function closePanel() {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", copy[currentLanguage].open);
    launcher.focus();
  }

  launcher.addEventListener("click", () => panel.classList.contains("is-open") ? closePanel() : openPanel());
  closeButton.addEventListener("click", closePanel);
  document.addEventListener("keydown", event => { if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel(); });
  document.getElementById("language")?.addEventListener("change", updateLanguage);

  async function sendMessage() {
    const message = textarea.value.trim();
    if (!message || busy) return;
    busy = true;
    sendButton.disabled = true;
    textarea.disabled = true;
    textarea.value = "";
    textarea.style.height = "42px";
    addMessage(message, "user");
    const typing = addMessage("…", "assistant");
    typing.classList.add("typing");
    const priorHistory = history.slice(-8);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 48_000);
    try {
      const response = await fetch("/.netlify/functions/tadow-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: priorHistory, language: currentLanguage }),
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      typing.remove();
      if (!response.ok) throw new Error(data.error || copy[currentLanguage].error);
      const answer = typeof data.answer === "string" ? data.answer : copy[currentLanguage].error;
      addMessage(answer, "assistant", Array.isArray(data.citations) ? data.citations : []);
      history.push({ role: "user", content: message }, { role: "assistant", content: answer });
      if (history.length > 10) history.splice(0, history.length - 10);
    } catch (error) {
      typing.remove();
      const messageText = error.name === "AbortError" ? "The request took too long. Please try again." : (error.message || copy[currentLanguage].error);
      addMessage(messageText, "assistant", []);
    } finally {
      clearTimeout(timeout);
      busy = false;
      sendButton.disabled = false;
      textarea.disabled = false;
      if (panel.classList.contains("is-open")) textarea.focus();
    }
  }

  form.addEventListener("submit", event => { event.preventDefault(); sendMessage(); });
  textarea.addEventListener("input", () => {
    textarea.style.height = "42px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  });
  textarea.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); }
  });

  updateLanguage();
})();
