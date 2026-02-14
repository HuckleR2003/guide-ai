// ═══════════════════════════════════════════════════════════════
// GuideAI Chat API — Vercel Serverless Function
// Proxies chat requests to Claude Haiku 3.5
// API key is stored in Vercel Environment Variables (never exposed)
// ═══════════════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set in environment');
    return res.status(500).json({ error: 'API not configured' });
  }

  try {
    const { deviceType, deviceModel, pdfContext, question, history, lang } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    // ═══════════════════════════════════════════════════════════
    // BUILD SYSTEM PROMPT — strict grounding to PDF only
    // ═══════════════════════════════════════════════════════════
    const device = `${deviceType || ''} ${deviceModel || ''}`.trim() || 'Unknown device';

    const systemPrompt = lang === 'pl'
      ? `Jesteś asystentem technicznym GuideAI dla urządzenia: ${device}.

## ZASADY (BEZWZGLĘDNE):
1. Odpowiadaj WYŁĄCZNIE na podstawie dostarczonej instrukcji PDF. Nie używaj zewnętrznej wiedzy.
2. Jeśli użytkownik twierdzi coś fałszywego o urządzeniu — SPRAWDŹ w instrukcji. Nie potwierdzaj nieprawdy.
3. Gdy nie znajdziesz odpowiedzi: "Nie mogę znaleźć informacji na ten temat w oficjalnej instrukcji ${device}."
4. Odpowiadaj krótko (2-4 zdania), w punktach gdy pomocne. Cytuj sekcje/strony gdy to możliwe.
5. Odmawiaj odpowiedzi na pytania niezwiązane z urządzeniem.`

      : `You are a technical assistant for GuideAI, supporting device: ${device}.

## RULES (MANDATORY):
1. Answer EXCLUSIVELY based on the provided PDF manual. Do NOT use external knowledge.
2. If user claims something false about the device — CHECK the manual. Never confirm false claims.
3. When you cannot find an answer: "I cannot find information about this topic in the official ${device} manual."
4. Keep answers concise (2-4 sentences), use bullet points when helpful. Cite sections/pages when possible.
5. Refuse to answer questions unrelated to the device.`;

    // ═══════════════════════════════════════════════════════════
    // BUILD MESSAGES — token-efficient strategy
    // First message: system + PDF context + question
    // Subsequent: system + last 4 history messages + question
    // ═══════════════════════════════════════════════════════════
    const messages = [];

    const isFirstMessage = !history || history.length === 0;

    if (isFirstMessage && pdfContext && pdfContext.length > 100) {
      // First message: include PDF context (max 10k chars ~2500 tokens)
      const limitedPdf = pdfContext.slice(0, 10000);
      const groundingPrefix = lang === 'pl'
        ? '[OFICJALNA INSTRUKCJA URZĄDZENIA - JEDYNE źródło prawdy]\n\n'
        : '[OFFICIAL DEVICE MANUAL - ONLY source of truth]\n\n';

      messages.push({
        role: 'user',
        content: `${groundingPrefix}${limitedPdf}\n\n---\n\n${question}`
      });
    } else {
      // Subsequent messages: last 4 history + new question
      if (history && history.length > 0) {
        const recent = history.slice(-4);
        for (const msg of recent) {
          if (msg.type === 'user') {
            messages.push({ role: 'user', content: msg.text });
          } else if (msg.type === 'assistant') {
            messages.push({ role: 'assistant', content: msg.text });
          }
        }
      }
      messages.push({ role: 'user', content: question });
    }

    // ═══════════════════════════════════════════════════════════
    // CALL CLAUDE HAIKU 3.5
    // ═══════════════════════════════════════════════════════════
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Claude API error:', data.error);
      return res.status(502).json({ error: 'AI service error', detail: data.error.message });
    }

    const reply = data.content?.[0]?.text || '';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
