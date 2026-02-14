// ═══════════════════════════════════════════════════════════════
// GuideAI Chat API — Vercel Serverless Function
// Proxies chat requests to Groq (Llama 3.1)
// API key is stored in Vercel Environment Variables (never exposed)
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

    // Build messages array
    const messages = [{ role: 'system', content: systemPrompt }];

    const isFirstMessage = !history || history.length === 0;

    if (isFirstMessage && pdfContext && pdfContext.length > 100) {
      const limitedPdf = pdfContext.slice(0, 10000);
      const prefix = lang === 'pl'
        ? '[OFICJALNA INSTRUKCJA URZĄDZENIA - JEDYNE źródło prawdy]\n\n'
        : '[OFFICIAL DEVICE MANUAL - ONLY source of truth]\n\n';

      messages.push({
        role: 'user',
        content: `${prefix}${limitedPdf}\n\n---\n\n${question}`
      });
    } else {
      if (history && history.length > 0) {
        for (const msg of history.slice(-4)) {
          if (msg.type === 'user') messages.push({ role: 'user', content: msg.text });
          else if (msg.type === 'assistant') messages.push({ role: 'assistant', content: msg.text });
        }
      }
      messages.push({ role: 'user', content: question });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.3,
        max_tokens: 400,
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
