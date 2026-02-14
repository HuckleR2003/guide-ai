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
      // NO PDF MODE — refuse everything, ask for upload
      systemPrompt = isPl
        ? `Jesteś GuideAI Assistant dla: ${device}.

KRYTYCZNE: Nie masz załadowanej instrukcji PDF tego urządzenia.

JEDYNA DOZWOLONA ODPOWIEDŹ na każde pytanie:
"Nie mam jeszcze załadowanej instrukcji dla ${device}. Wgraj plik PDF z instrukcją obsługi, a pomogę Ci ze wszystkim — od kodów błędów po ustawienia i konserwację! 📄"

NIGDY nie próbuj odpowiadać na pytania techniczne bez instrukcji. NIGDY nie używaj własnej wiedzy. NIGDY nie sugeruj stron internetowych.`

        : `You are GuideAI Assistant for: ${device}.

CRITICAL: You have NO PDF manual loaded for this device.

YOUR ONLY ALLOWED RESPONSE to any question:
"I don't have a manual loaded for ${device} yet. Upload the PDF manual and I'll help you with everything — from error codes to settings and maintenance! 📄"

NEVER attempt to answer technical questions without the manual. NEVER use your own knowledge. NEVER suggest websites.`;
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
