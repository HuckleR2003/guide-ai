// ═══════════════════════════════════════════════════════════════
// GuideAI Chat API — Vercel Serverless Function
// Proxies chat requests to Groq (Llama 3.3 70B)
// API key stored in Vercel Environment Variables (never exposed)
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = process.env.GROQ_API_KEY;
  if (!API_KEY) {
    console.error('GROQ_API_KEY not set');
    return res.status(500).json({ error: 'API not configured' });
  }

  try {
    const { deviceType, deviceModel, pdfContext, question, history, lang } = req.body;

    if (!question) return res.status(400).json({ error: 'Question is required' });

    const device = `${deviceType || ''} ${deviceModel || ''}`.trim() || 'Unknown device';
    const hasPdf = pdfContext && pdfContext.length > 100;
    const isPl = lang === 'pl';

    // ═══════════════════════════════════════════════════════════
    // SYSTEM PROMPT — two modes: with PDF and without PDF
    // ═══════════════════════════════════════════════════════════
    let systemPrompt;

    if (hasPdf) {
      systemPrompt = isPl
        ? `Jesteś profesjonalnym asystentem technicznym GuideAI dla: ${device}.

TOŻSAMOŚĆ: Masz na imię GuideAI Assistant. Jesteś ekspertem od tego urządzenia.

ŹRÓDŁO WIEDZY: Otrzymałeś oficjalną instrukcję PDF tego urządzenia. To jest Twoje JEDYNE źródło informacji.

ZASADY BEZWZGLĘDNE:
- Odpowiadaj WYŁĄCZNIE na podstawie instrukcji PDF. Zero zewnętrznej wiedzy.
- NIGDY nie wymyślaj informacji których nie ma w instrukcji.
- NIGDY nie sugeruj stron internetowych, serwisów, ani kontaktu z producentem.
- Jeśli użytkownik twierdzi coś czego nie ma w instrukcji — powiedz że nie znajdujesz tego w dokumentacji.
- Gdy brak informacji w instrukcji odpowiedz: "Nie znalazłem tej informacji w instrukcji ${device}. Spróbuj zapytać inaczej lub sprawdź inną sekcję."

STYL ODPOWIEDZI:
- Krótko i konkretnie: 2-5 zdań.
- Używaj punktorów (•) dla list kroków.
- Cytuj sekcje/strony instrukcji gdy to możliwe.
- Bądź przyjazny ale profesjonalny.
- Odpowiadaj po polsku.`

        : `You are a professional technical assistant called GuideAI Assistant for: ${device}.

IDENTITY: You are an expert on this specific device.

KNOWLEDGE SOURCE: You received the official PDF manual for this device. This is your ONLY source of information.

ABSOLUTE RULES:
- Answer EXCLUSIVELY based on the PDF manual. Zero external knowledge.
- NEVER make up information that isn't in the manual.
- NEVER suggest websites, repair services, or contacting the manufacturer.
- If the user claims something not found in the manual — say you cannot find it in the documentation.
- When information is missing: "I couldn't find this information in the ${device} manual. Try rephrasing your question or ask about a different section."

RESPONSE STYLE:
- Short and specific: 2-5 sentences.
- Use bullet points (•) for step lists.
- Cite manual sections/pages when possible.
- Be friendly but professional.`;

    } else {
      // NO PDF MODE — use general knowledge with disclaimer
      systemPrompt = isPl
        ? `Jesteś GuideAI Assistant — profesjonalnym asystentem technicznym dla: ${device}.

SYTUACJA: Użytkownik NIE wgrał instrukcji PDF. Korzystasz ze swojej ogólnej wiedzy technicznej.

ZASADY:
- Pomagaj na podstawie swojej ogólnej wiedzy o ${device} i podobnych urządzeniach.
- Na POCZĄTKU pierwszej odpowiedzi dodaj krótki disclaimer: "⚠️ Odpowiadam na podstawie ogólnej wiedzy — wgraj instrukcję PDF dla dokładniejszych odpowiedzi."
- NIE powtarzaj disclaimera w kolejnych wiadomościach.
- Odpowiadaj krótko (2-5 zdań), konkretnie, z punktorami (•) dla kroków.
- Bądź przyjazny i profesjonalny.
- Odpowiadaj po polsku.
- Jeśli nie jesteś pewien — powiedz to wprost, nie wymyślaj.`

        : `You are GuideAI Assistant — a professional technical assistant for: ${device}.

SITUATION: The user has NOT uploaded a PDF manual. You are using your general technical knowledge.

RULES:
- Help based on your general knowledge about ${device} and similar devices.
- At the START of your first reply add a short disclaimer: "⚠️ Answering from general knowledge — upload the PDF manual for more accurate answers."
- Do NOT repeat the disclaimer in follow-up messages.
- Keep answers short (2-5 sentences), specific, use bullet points (•) for steps.
- Be friendly and professional.
- If you're unsure — say so honestly, don't make things up.`;
    }

    // ═══════════════════════════════════════════════════════════
    // BUILD MESSAGES — token-efficient strategy
    // ═══════════════════════════════════════════════════════════
    const messages = [{ role: 'system', content: systemPrompt }];

    const isFirstMessage = !history || history.length === 0;

    if (isFirstMessage && hasPdf) {
      // First message: include PDF context (max 12k chars for 70B model)
      const limitedPdf = pdfContext.slice(0, 12000);
      const prefix = isPl
        ? `<INSTRUKCJA_URZADZENIA>\n${limitedPdf}\n</INSTRUKCJA_URZADZENIA>\n\nPytanie użytkownika: `
        : `<DEVICE_MANUAL>\n${limitedPdf}\n</DEVICE_MANUAL>\n\nUser question: `;

      messages.push({ role: 'user', content: `${prefix}${question}` });
    } else {
      // Subsequent: last 6 history messages + new question
      if (history && history.length > 0) {
        for (const msg of history.slice(-6)) {
          if (msg.type === 'user') messages.push({ role: 'user', content: msg.text });
          else if (msg.type === 'assistant') messages.push({ role: 'assistant', content: msg.text });
        }
      }
      messages.push({ role: 'user', content: question });
    }

    // ═══════════════════════════════════════════════════════════
    // CALL GROQ — Llama 3.3 70B (smarter than 8B, still free)
    // ═══════════════════════════════════════════════════════════
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.2,
        max_tokens: 500,
        top_p: 0.9,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Groq API error:', data.error);
      return res.status(502).json({ error: 'AI service error', detail: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
