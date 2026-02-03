import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { Upload, Send, MessageSquare, QrCode, ChevronRight, Check, Building2, Dumbbell, Wrench, Sparkles, Smartphone, X, FileText, Moon, Sun, Globe, Mail, User, LogOut, LayoutDashboard, Save, Crown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import * as pdfjsLib from 'pdfjs-dist';
import EarlyAccess from './EarlyAccess';
import Dashboard from './Dashboard';
import AuthModal from './AuthModal';
import { AuthProvider, useAuth } from './AuthContext';
import { saveDevice, canSaveMoreDevices, signOut, supabase } from './supabaseClient';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// ═══════════════════════════════════════════════════════════════
// I18N TRANSLATIONS
// ═══════════════════════════════════════════════════════════════
const TRANSLATIONS = {
  pl: {
    tagline: 'Twoje urządzenia teraz mówią',
    taglineHighlight: 'ludzkim głosem',
    subtitle: 'Zamień każdą instrukcję PDF w inteligentnego asystenta. Twoi klienci skanują kod QR i dostają odpowiedzi w sekundę.',
    tryFree: 'Wypróbuj za darmo',
    seeDemo: 'Zobacz demo',
    interactiveDemo: 'Interaktywne demo',
    uploadInstruction: 'Załaduj instrukcję',
    dragPdf: 'Przeciągnij PDF tutaj',
    orClick: 'lub kliknij aby wybrać plik',
    realPdf: 'Obsługujemy prawdziwe pliki PDF!',
    tryExample: 'Lub wypróbuj przykład demo:',
    deviceType: 'Typ urządzenia',
    deviceTypePlaceholder: 'np. Pralka, Klimatyzator, Serwer...',
    model: 'Model',
    modelPlaceholder: 'np. WW90T, R740, AC-2000...',
    generateAssistant: 'Generuj Asystenta i QR',
    deviceCard: 'Karta urządzenia',
    device: 'Urządzenie',
    pdfLoaded: 'Treść PDF załadowana',
    save: 'Zachowaj',
    saved: 'Zapisano',
    delete: 'Skasuj',
    changeDevice: 'Zmień urządzenie',
    chatWithManual: 'Czat z instrukcją',
    loadPdfFirst: 'Załaduj instrukcję PDF,\naby rozpocząć rozmowę',
    askAboutDevice: 'Zapytaj o urządzenie...',
    loadPdfFirstShort: 'Najpierw załaduj PDF...',
    trySaying: 'Spróbuj zapytać:',
    configCorrection: 'Korekta danych urządzenia',
    detectedPdf: 'Wykryto treść PDF',
    chars: 'znaków',
    noPdfWarning: 'Nie udało się wyciągnąć tekstu z PDF. Wpisz dane ręcznie.',
    qrPreview: 'Podgląd QR',
    uploadOther: 'Wgraj inny PDF',
    analyzing: 'Analizuję instrukcję PDF',
    thinkingWithPdf: 'Szukam w instrukcji...',
    thinking: 'GuideAI myśli...',
    sessionActive: 'Sesja aktywna',
    quickError: 'Co oznacza błąd E03?',
    quickReset: 'Jak zresetować urządzenie?',
    quickFilter: 'Gdzie jest filtr?',
    worksWithAny: 'Działa z każdym urządzeniem',
    fromServerToWasher: 'Od serwerowni po pralkę',
    chatWithDevice: 'Chatuj z urządzeniem!',
    forWho: 'Dla kogo?',
    forWhoSubtitle: 'Wszędzie gdzie ludzie pytają "jak to działa?"',
    simplePricing: 'Prosty cennik',
    startFree: 'Zacznij za darmo. Skaluj gdy potrzebujesz.',
    free: 'Free',
    idealStart: 'Idealne na start',
    pro: 'Pro',
    forPros: 'Dla profesjonalistów',
    popular: 'Popularne',
    startFreeCta: 'Zacznij za darmo',
    choosePro: 'Wybierz Pro',
    heyConfigured: 'Hej! Skonfigurowałem asystenta dla',
    whatToAsk: 'O co chcesz zapytać?',
    analyzedPdf: 'Przeanalizowałem też instrukcję PDF.',
    assistantConfigured: 'Asystent skonfigurowany',
    detectedFromQr: 'Wykryto urządzenie z QR',
  },
  en: {
    tagline: 'Your devices now speak',
    taglineHighlight: 'human language',
    subtitle: 'Turn any PDF manual into an intelligent assistant. Your customers scan QR and get answers in seconds.',
    tryFree: 'Try for free',
    seeDemo: 'See demo',
    interactiveDemo: 'Interactive demo',
    uploadInstruction: 'Upload manual',
    dragPdf: 'Drag PDF here',
    orClick: 'or click to select file',
    realPdf: 'We support real PDF files!',
    tryExample: 'Or try a demo example:',
    deviceType: 'Device type',
    deviceTypePlaceholder: 'e.g. Washer, AC, Server...',
    model: 'Model',
    modelPlaceholder: 'e.g. WW90T, R740, AC-2000...',
    generateAssistant: 'Generate Assistant & QR',
    deviceCard: 'Device card',
    device: 'Device',
    pdfLoaded: 'PDF content loaded',
    save: 'Save',
    saved: 'Saved',
    delete: 'Delete',
    changeDevice: 'Change device',
    chatWithManual: 'Chat with manual',
    loadPdfFirst: 'Upload a PDF manual\nto start chatting',
    askAboutDevice: 'Ask about the device...',
    loadPdfFirstShort: 'Upload PDF first...',
    trySaying: 'Try asking:',
    configCorrection: 'Device data correction',
    detectedPdf: 'PDF content detected',
    chars: 'chars',
    noPdfWarning: 'Could not extract text from PDF. Enter data manually.',
    qrPreview: 'QR Preview',
    uploadOther: 'Upload another PDF',
    analyzing: 'Analyzing PDF manual',
    thinkingWithPdf: 'Searching in manual...',
    thinking: 'GuideAI is thinking...',
    sessionActive: 'Session active',
    quickError: 'What does error E03 mean?',
    quickReset: 'How to reset the device?',
    quickFilter: 'Where is the filter?',
    worksWithAny: 'Works with any device',
    fromServerToWasher: 'From server room to washing machine',
    chatWithDevice: 'Chat with device!',
    forWho: 'For whom?',
    forWhoSubtitle: 'Everywhere people ask "how does this work?"',
    simplePricing: 'Simple pricing',
    startFree: 'Start free. Scale when you need.',
    free: 'Free',
    idealStart: 'Ideal to start',
    pro: 'Pro',
    forPros: 'For professionals',
    popular: 'Popular',
    startFreeCta: 'Start for free',
    choosePro: 'Choose Pro',
    heyConfigured: 'Hey! I configured the assistant for',
    whatToAsk: 'What do you want to ask?',
    analyzedPdf: 'I also analyzed the PDF manual.',
    assistantConfigured: 'Assistant configured',
    detectedFromQr: 'Device detected from QR',
  }
};

// ═══════════════════════════════════════════════════════════════
// THEME & LANGUAGE CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ═══════════════════════════════════════════════════════════════
// GROQ API CONFIGURATION
// ═══════════════════════════════════════════════════════════════
const GROQ_API_KEY = "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";

// ═══════════════════════════════════════════════════════════════
// PDF TEXT EXTRACTION (with 5s timeout)
// ═══════════════════════════════════════════════════════════════
const extractTextFromPDF = async (file, onProgress) => {
  // Timeout wrapper - 5 seconds max
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('TIMEOUT')), 5000);
  });

  const extractionPromise = (async () => {
    try {
      const arrayBuffer = await file.arrayBuffer();

      // Load PDF with cMapUrl for better character support
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
        cMapPacked: true,
      });

      const pdf = await loadingTask.promise;

      let fullText = '';
      const numPages = Math.min(pdf.numPages, 50); // Limit to 50 pages

      for (let i = 1; i <= numPages; i++) {
        if (onProgress) {
          onProgress(Math.round((i / numPages) * 100));
        }

        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        } catch (pageError) {
          console.warn(`Could not extract page ${i}:`, pageError);
          // Continue with other pages
        }
      }

      // Clean up and limit text length
      fullText = fullText
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .trim()
        .slice(0, 15000);

      return fullText;
    } catch (error) {
      console.error('PDF extraction error:', error);
      return ''; // Return empty string instead of throwing
    }
  })();

  try {
    return await Promise.race([extractionPromise, timeoutPromise]);
  } catch (error) {
    if (error.message === 'TIMEOUT') {
      console.warn('PDF extraction timed out after 5 seconds');
      return ''; // Return empty string on timeout - user can still proceed
    }
    return '';
  }
};

// ═══════════════════════════════════════════════════════════════
// GROQ AI FUNCTION (with Token Optimization)
// ═══════════════════════════════════════════════════════════════
const askGroq = async (userQuestion, pdfContext, deviceType, deviceModel, chatHistory, isFirstMessage, demoResponses) => {
  // Fallback na lokalne odpowiedzi jeśli brak klucza API
  if (!GROQ_API_KEY) {
    const lowerInput = userQuestion.toLowerCase();
    for (const [key, value] of Object.entries(demoResponses)) {
      if (key !== 'default' && lowerInput.includes(key)) {
        return value;
      }
    }
    return demoResponses.default;
  }

  try {
    // TOKEN OPTIMIZATION: Limit PDF context to 10k chars (~2500 tokens)
    const limitedPdfContext = pdfContext ? pdfContext.slice(0, 10000) : '';

    // Build system prompt - PDF context ONLY on first message
    let systemPrompt = `Jesteś profesjonalnym technikiem serwisu GuideAI.
Urządzenie: ${deviceType} model: ${deviceModel}.
Odpowiadaj konkretnie, w punktach, po polsku. Max 3-4 zdania.`;

    // Build messages array
    const messages = [{ role: 'system', content: systemPrompt }];

    // FIRST MESSAGE: Include PDF context
    if (isFirstMessage && limitedPdfContext.length > 100) {
      messages.push({
        role: 'user',
        content: `[KONTEKST INSTRUKCJI - zapamiętaj na całą rozmowę]\n${limitedPdfContext}\n\n[PYTANIE]\n${userQuestion}`
      });
    } else {
      // SUBSEQUENT MESSAGES: Only chat history + new question (NO PDF re-send)
      // Add last 4 messages from history for context (token efficient)
      const recentHistory = chatHistory.slice(-4);
      recentHistory.forEach(msg => {
        if (msg.type === 'user') {
          messages.push({ role: 'user', content: msg.text });
        } else if (msg.type === 'assistant') {
          messages.push({ role: 'assistant', content: msg.text });
        }
      });
      messages.push({ role: 'user', content: userQuestion });
    }

    console.log(`Groq API call (first: ${isFirstMessage}, messages: ${messages.length})`);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.3,
        max_tokens: 400, // Reduced for cost
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Groq API error:', data.error);
      return demoResponses.default;
    }

    return data.choices?.[0]?.message?.content || demoResponses.default;
  } catch (error) {
    console.error('Groq API error:', error);
    return demoResponses.default;
  }
};

// ═══════════════════════════════════════════════════════════════
// FORMATTED MESSAGE COMPONENT (renders numbered lists + model codes)
// ═══════════════════════════════════════════════════════════════
const FormattedMessage = ({ text }) => {
  // Helper to highlight model/error codes in text
  const highlightCodes = (str, keyPrefix) => {
    // Match error codes (E18, CH05) and model numbers (B300, AA12SP, 5650, Dell 5650, etc.)
    const codePattern = /\b([A-Z]{1,3}\d{2,4}[A-Z0-9]*|\d{4,5}|[A-Z][a-z]+\s+[A-Z0-9]{2,10})\b/g;
    const parts = str.split(codePattern);

    return parts.map((part, idx) => {
      if (codePattern.test(part) || /^[A-Z]{1,3}\d{2,4}[A-Z0-9]*$/.test(part) || /^\d{4,5}$/.test(part)) {
        return <span key={`${keyPrefix}-code-${idx}`} className="bg-blue-500 text-white px-1.5 py-0.5 rounded text-xs font-medium mx-0.5">{part}</span>;
      }
      return part;
    });
  };

  // Split text by numbered patterns like "1.", "2)", "1:" etc.
  const listParts = text.split(/(\d+[.\):\-]\s)/g);
  const hasNumberedList = /\d+[.\):\-]\s/.test(text);

  if (!hasNumberedList) {
    return <span>{highlightCodes(text, 'main')}</span>;
  }

  const elements = [];
  let currentText = '';

  for (let i = 0; i < listParts.length; i++) {
    const part = listParts[i];

    if (/^\d+[.\):\-]\s$/.test(part)) {
      if (currentText.trim()) {
        elements.push(
          <span key={`text-${i}`} className="block mb-1">{highlightCodes(currentText.trim(), `t${i}`)}</span>
        );
        currentText = '';
      }

      const num = part.match(/\d+/)[0];
      const content = listParts[i + 1] || '';
      i++;

      elements.push(
        <div key={`item-${num}-${i}`} className="flex gap-2 my-1.5">
          <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white text-xs font-bold rounded flex items-center justify-center">
            {num}
          </span>
          <span className="flex-1">{highlightCodes(content.trim(), `c${i}`)}</span>
        </div>
      );
    } else if (part) {
      currentText += part;
    }
  }

  if (currentText.trim()) {
    elements.push(
      <span key="final" className="block mt-1">{highlightCodes(currentText.trim(), 'final')}</span>
    );
  }

  return <div className="space-y-0.5">{elements}</div>;
};

// ═══════════════════════════════════════════════════════════════
// DEVICE CONFIGURATIONS (for demo)
// ═══════════════════════════════════════════════════════════════
const DEVICES = [
  { id: 'dell-5650', name: 'Serwer Dell', model: '5650', fullName: 'Serwer Dell 5650', category: 'IT', categoryEn: 'IT', color: '#3b82f6' },
  { id: 'beko-b300', name: 'Pralka Beko', model: 'B300', fullName: 'Pralka Beko B300', category: 'AGD', categoryEn: 'Home', color: '#10b981' },
  { id: 'lg-aa12sp', name: 'Klimatyzator LG', model: 'AA12SP', fullName: 'Klimatyzator LG AA12SP', category: 'HVAC', categoryEn: 'HVAC', color: '#8b5cf6' }
];

// Demo responses for when no API key is set
const DEMO_RESPONSES = {
  'dlaczego miga czerwona dioda': 'Czerwona dioda migająca oznacza błąd E03 - zatkany filtr odpływowy. Znajdziesz go w prawym dolnym rogu urządzenia. Odkręć pokrywę i wyczyść filtr pod bieżącą wodą.',
  'jak ustawić timer': 'Aby ustawić timer: 1) Naciśnij przycisk "Timer". 2) Użyj strzałek ▲▼ aby wybrać czas (1-24h). 3) Potwierdź OK. Urządzenie wyłączy się automatycznie.',
  'jaki jest kod błędu e05': 'Błąd E05 = problem z czujnikiem temperatury. Wyłącz urządzenie na 30 sekund i włącz ponownie. Jeśli się powtarza - kontakt z serwisem.',
  'default': 'Na podstawie instrukcji mogę pomóc z kodami błędów, ustawieniami i konserwacją. Zadaj mi konkretne pytanie!'
};

// HEADER
const Header = () => {
  const { darkMode } = useApp();
  return (
    <header className="w-full px-6 pt-3 pb-2">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="w-20" />
          <p className={`text-xs tracking-widest font-light ${darkMode ? 'text-slate-500' : 'text-slate-300'}`}>HCK_Labs</p>
        </div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className={`w-7 h-7 grid grid-cols-4 grid-rows-4 gap-[2px] p-[3px] border rounded ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
            {[1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1].map((filled, i) => (
              <div key={i} className={`${filled ? (darkMode ? 'bg-white' : 'bg-slate-800') : 'bg-transparent'} rounded-[1px]`} />
            ))}
          </div>
          <h1 className={`text-2xl font-semibold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Guide<span className="text-blue-500">AI</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

// HERO
const Hero = () => {
  const { darkMode, t } = useApp();
  return (
    <section className="px-6 py-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-4xl md:text-5xl font-bold leading-tight mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          {t('tagline')}
          <span className="block text-blue-500">{t('taglineHighlight')}</span>
        </h2>
        <p className={`text-lg max-w-2xl mx-auto mb-6 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {t('subtitle')}
        </p>
        <div className="flex justify-center mb-6">
          <p className={`text-sm font-bold tracking-wide ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Device, QR, and <span className="bg-yellow-400 text-slate-900 px-2 py-0.5 rounded">Chat!</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className={`group flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
            {t('tryFree')}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
            <QrCode className="w-4 h-4" />
            {t('seeDemo')}
          </button>
        </div>
      </div>
    </section>
  );
};

// INTERACTIVE DEMO
const InteractiveDemo = React.forwardRef(({
  pdfUploaded, pdfName, pdfContext,
  setPdfUploaded, setPdfName, setPdfContext,
  fromUrl, setFromUrl, onOpenAuth
}, ref) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const [isTypingEffect, setIsTypingEffect] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedUrl, setSavedUrl] = useState('');
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  // Device configuration form
  const [deviceType, setDeviceType] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [pdfFileLoaded, setPdfFileLoaded] = useState(false);
  // Token optimization: track if first message sent
  const [isFirstMessageSent, setIsFirstMessageSent] = useState(false);
  // QR pulse animation
  const [qrPulse, setQrPulse] = useState(false);
  // Database save state
  const [savedToDb, setSavedToDb] = useState(false);
  const [savingToDb, setSavingToDb] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { darkMode, lang, t } = useApp();
  const { user, isAuthenticated, planType } = useAuth();

  // Scroll only within chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages, currentTypingText]);

  // QR pulse animation when device changes
  useEffect(() => {
    if (deviceType || deviceModel) {
      setQrPulse(true);
      const timer = setTimeout(() => setQrPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [deviceType, deviceModel]);

  // Initialize messages when device is loaded from URL
  useEffect(() => {
    if (fromUrl && pdfUploaded && pdfName && messages.length === 0 && !isAnalyzing) {
      const deviceDisplayName = pdfName.replace('.pdf', '').replace(' - Instrukcja', '');
      // For URL-loaded devices, set configured immediately
      setIsConfigured(true);
      setPdfFileLoaded(true);

      // Find device in DEVICES array or parse from name
      const device = DEVICES.find(d => d.fullName === deviceDisplayName);
      if (device) {
        setDeviceType(device.name);
        setDeviceModel(device.model);
      } else {
        const parts = deviceDisplayName.split(' ');
        if (parts.length >= 2) {
          setDeviceType(parts[0]);
          setDeviceModel(parts.slice(1).join(' '));
        }
      }

      // Mark as saved since it came from QR URL
      setIsSaved(true);
      setSavedUrl(window.location.href);

      setMessages([
        { type: 'system', text: `✓ ${t('detectedFromQr')}` },
        { type: 'assistant', text: `${t('heyConfigured')} ${deviceDisplayName}. ${t('whatToAsk')}` }
      ]);
    }
  }, [pdfUploaded, pdfName, fromUrl, messages.length, isAnalyzing, t]);

  const typewriterEffect = useCallback((text, onComplete) => {
    const words = text.split(' ');
    let currentIndex = 0;
    setIsTypingEffect(true);
    setCurrentTypingText('');

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setCurrentTypingText(prev => prev + (currentIndex > 0 ? ' ' : '') + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsTypingEffect(false);
        setCurrentTypingText('');
        onComplete(text);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // Handle real PDF file upload
  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Proszę wybrać plik PDF');
      return;
    }

    setIsAnalyzing(true);
    setAnalyzeProgress('Wczytuję PDF...');
    setUploadProgress(0);
    setMessages([]);

    try {
      // Extract initial device name from filename
      const fileName = file.name.replace('.pdf', '').replace(/[-_]/g, ' ');

      setAnalyzeProgress('Analizuję tekst instrukcji...');

      // Extract text from PDF with progress callback
      const extractedText = await extractTextFromPDF(file, (progress) => {
        setUploadProgress(progress);
      });

      setAnalyzeProgress('Przygotowuję formularz...');
      setUploadProgress(100);

      // Try to auto-detect device type and model from PDF content or filename
      let detectedType = '';
      let detectedModel = '';

      // ═══ DEVICE TYPE DETECTION PATTERNS ═══
      const devicePatterns = [
        // AGD / Home Appliances
        { keywords: ['pralka', 'washer', 'washing machine', 'waschmaschine'], type: 'Pralka' },
        { keywords: ['zmywarka', 'dishwasher', 'geschirrspüler'], type: 'Zmywarka' },
        { keywords: ['lodówka', 'fridge', 'refrigerator', 'kühlschrank', 'chłodziarka'], type: 'Lodówka' },
        { keywords: ['piekarnik', 'oven', 'backofen', 'kuchenka'], type: 'Piekarnik' },
        { keywords: ['mikrofala', 'microwave', 'mikrowelle', 'kuchenka mikrofalowa'], type: 'Mikrofala' },
        { keywords: ['suszarka', 'dryer', 'tumble dryer', 'trockner'], type: 'Suszarka' },
        { keywords: ['odkurzacz', 'vacuum', 'staubsauger'], type: 'Odkurzacz' },
        // HVAC
        { keywords: ['klimatyzator', 'klimatyzacja', 'air conditioner', 'ac unit', 'klimaanlage', 'split'], type: 'Klimatyzator' },
        { keywords: ['pompa ciepła', 'heat pump', 'wärmepumpe'], type: 'Pompa ciepła' },
        { keywords: ['wentylator', 'fan', 'ventilator'], type: 'Wentylator' },
        { keywords: ['grzejnik', 'heater', 'radiator', 'ogrzewacz'], type: 'Grzejnik' },
        // IT / Electronics
        { keywords: ['serwer', 'server', 'poweredge', 'proliant', 'rack'], type: 'Serwer' },
        { keywords: ['płyta główna', 'motherboard', 'mainboard', 'płyta bazowa'], type: 'Płyta główna' },
        { keywords: ['router', 'access point', 'modem', 'gateway'], type: 'Router' },
        { keywords: ['switch', 'przełącznik sieciowy'], type: 'Switch' },
        { keywords: ['drukarka', 'printer', 'drucker', 'mfp', 'urządzenie wielofunkcyjne'], type: 'Drukarka' },
        { keywords: ['monitor', 'display', 'bildschirm', 'ekran'], type: 'Monitor' },
        { keywords: ['laptop', 'notebook', 'ultrabook'], type: 'Laptop' },
        { keywords: ['komputer', 'computer', 'desktop', 'pc'], type: 'Komputer' },
        { keywords: ['projektor', 'projector', 'beamer', 'rzutnik'], type: 'Projektor' },
        { keywords: ['ups', 'zasilacz awaryjny', 'uninterruptible'], type: 'UPS' },
        // Consumer Electronics
        { keywords: ['telewizor', 'tv', 'television', 'fernseher', 'smart tv'], type: 'Telewizor' },
        { keywords: ['soundbar', 'głośnik', 'speaker', 'kino domowe', 'home theater'], type: 'Głośnik' },
        { keywords: ['kamera', 'camera', 'webcam', 'aparat'], type: 'Kamera' },
        { keywords: ['smartwatch', 'zegarek', 'watch'], type: 'Smartwatch' },
        { keywords: ['telefon', 'phone', 'smartphone', 'handy'], type: 'Telefon' },
        // Tools & Machines
        { keywords: ['spawarka', 'welder', 'schweißgerät'], type: 'Spawarka' },
        { keywords: ['kompresor', 'compressor'], type: 'Kompresor' },
        { keywords: ['wiertarka', 'drill', 'bohrmaschine'], type: 'Wiertarka' },
        { keywords: ['szlifierka', 'grinder', 'schleifer'], type: 'Szlifierka' },
        { keywords: ['agregat', 'generator', 'prądotwórczy'], type: 'Agregat' },
        // Medical/Fitness
        { keywords: ['bieżnia', 'treadmill', 'laufband'], type: 'Bieżnia' },
        { keywords: ['rower stacjonarny', 'exercise bike', 'heimtrainer'], type: 'Rower stacjonarny' },
      ];

      // ═══ BRAND DETECTION (helps with device identification) ═══
      const brandPatterns = [
        { brand: 'Dell', keywords: ['dell', 'poweredge', 'optiplex', 'inspiron', 'latitude'] },
        { brand: 'HP', keywords: ['hp', 'hewlett', 'proliant', 'pavilion', 'elitebook'] },
        { brand: 'Lenovo', keywords: ['lenovo', 'thinkpad', 'ideapad', 'thinkcentre'] },
        { brand: 'Beko', keywords: ['beko'] },
        { brand: 'Samsung', keywords: ['samsung', 'galaxy'] },
        { brand: 'LG', keywords: ['lg', "life's good"] },
        { brand: 'Bosch', keywords: ['bosch'] },
        { brand: 'Siemens', keywords: ['siemens'] },
        { brand: 'Whirlpool', keywords: ['whirlpool'] },
        { brand: 'Electrolux', keywords: ['electrolux', 'aeg'] },
        { brand: 'ASUS', keywords: ['asus', 'republic of gamers', 'rog'] },
        { brand: 'MSI', keywords: ['msi', 'micro-star'] },
        { brand: 'Gigabyte', keywords: ['gigabyte', 'aorus'] },
        { brand: 'Intel', keywords: ['intel'] },
        { brand: 'AMD', keywords: ['amd', 'ryzen', 'radeon'] },
        { brand: 'Cisco', keywords: ['cisco', 'linksys'] },
        { brand: 'TP-Link', keywords: ['tp-link', 'tplink'] },
        { brand: 'Sony', keywords: ['sony', 'bravia', 'playstation'] },
        { brand: 'Philips', keywords: ['philips'] },
        { brand: 'Panasonic', keywords: ['panasonic'] },
        { brand: 'Canon', keywords: ['canon', 'pixma', 'imageclass'] },
        { brand: 'Epson', keywords: ['epson'] },
      ];

      // Combine filename and PDF content for analysis
      const fileNameLower = fileName.toLowerCase();
      const pdfContentLower = (extractedText || '').toLowerCase().slice(0, 3000); // First 3000 chars
      const combinedText = `${fileNameLower} ${pdfContentLower}`;

      // ═══ DETECT DEVICE TYPE ═══
      for (const pattern of devicePatterns) {
        if (pattern.keywords.some(kw => combinedText.includes(kw))) {
          detectedType = pattern.type;
          break;
        }
      }

      // ═══ DETECT BRAND (for better context) ═══
      let detectedBrand = '';
      for (const bp of brandPatterns) {
        if (bp.keywords.some(kw => combinedText.includes(kw))) {
          detectedBrand = bp.brand;
          break;
        }
      }

      // ═══ DETECT MODEL NUMBER ═══
      // Try filename first (more reliable)
      const modelPatterns = [
        // Standard patterns: WW90T, LG-123, AC-2000, B300, AA12SP, R740, etc.
        /([A-Z]{1,4}[-\s]?\d{2,5}[A-Z0-9]{0,5})/i,
        // Dell PowerEdge patterns: R740, T640, etc.
        /(?:poweredge|optiplex|latitude)\s*([A-Z]?\d{3,4}[A-Z]?)/i,
        // Model with prefix: Model WW90T, Nr. 12345
        /(?:model|typ|nr|no\.?)[:\s]*([A-Z0-9][-A-Z0-9]{2,15})/i,
      ];

      for (const pattern of modelPatterns) {
        const match = fileName.match(pattern);
        if (match && match[1] && match[1].length >= 3) {
          detectedModel = match[1].toUpperCase().replace(/\s+/g, '');
          break;
        }
      }

      // Try PDF content if no model found from filename
      if (!detectedModel && extractedText && extractedText.length > 100) {
        const firstPart = extractedText.slice(0, 2000);

        // Look for explicit model declarations
        const contentPatterns = [
          /(?:model|typ|nr|numer|number)[:\s]*([A-Z0-9][-A-Z0-9]{2,15})/i,
          /(?:seria|series)[:\s]*([A-Z0-9][-A-Z0-9]{2,10})/i,
        ];

        for (const pattern of contentPatterns) {
          const match = firstPart.match(pattern);
          if (match && match[1] && match[1].length >= 3) {
            detectedModel = match[1].toUpperCase().replace(/\s+/g, '');
            break;
          }
        }
      }

      // ═══ COMBINE BRAND + TYPE if no explicit type found ═══
      if (!detectedType && detectedBrand) {
        // If we have a brand but no type, check common associations
        const brandDeviceMap = {
          'Dell': 'Serwer', 'HP': 'Komputer', 'Lenovo': 'Laptop',
          'Beko': 'AGD', 'Samsung': 'Urządzenie', 'LG': 'Urządzenie',
          'ASUS': 'Płyta główna', 'MSI': 'Płyta główna', 'Gigabyte': 'Płyta główna',
          'Cisco': 'Router', 'TP-Link': 'Router',
          'Canon': 'Drukarka', 'Epson': 'Drukarka',
        };
        detectedType = brandDeviceMap[detectedBrand] || '';
      }

      // Add brand to type if both detected (e.g., "Pralka Beko" -> keep as "Pralka")
      // But store brand for model if model is missing
      if (detectedBrand && !detectedModel) {
        // Sometimes brand is all we have for identification
        detectedModel = detectedBrand;
      }

      // Small delay for UX
      await new Promise(resolve => setTimeout(resolve, 300));

      // Set detected values (user can edit them)
      setDeviceType(detectedType);
      setDeviceModel(detectedModel);
      setPdfContext(extractedText);
      setPdfFileLoaded(true);
      setIsAnalyzing(false);
      setAnalyzeProgress('');
      setUploadProgress(0);

    } catch (error) {
      console.error('Upload error:', error);
      setIsAnalyzing(false);
      setAnalyzeProgress('');
      setUploadProgress(0);
      // Don't show alert - just let user fill in manually
      setPdfFileLoaded(true);
      setDeviceType('');
      setDeviceModel('');
    }
  };

  // Generate assistant after configuration
  const handleGenerateAssistant = () => {
    if (!deviceType.trim() || !deviceModel.trim()) return;

    const fullName = `${deviceType.trim()} ${deviceModel.trim()}`;
    setPdfName(fullName);
    setPdfUploaded(true);
    setIsConfigured(true);

    setMessages([
      { type: 'system', text: `✓ ${t('assistantConfigured')}` },
      { type: 'assistant', text: `${t('heyConfigured')} ${fullName}. ${pdfContext ? t('analyzedPdf') : ''} ${t('whatToAsk')}` }
    ]);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Simulate upload for demo devices (no real PDF)
  const simulateUpload = (fullName) => {
    // Find device config from DEVICES array
    const device = DEVICES.find(d => d.fullName === fullName);
    const type = device ? device.name : fullName.split(' ')[0];
    const model = device ? device.model : fullName.split(' ').slice(1).join(' ');

    setPdfName(fullName);
    setPdfContext(''); // No real context for demo
    setPdfUploaded(true);
    setIsConfigured(true);
    setPdfFileLoaded(true);
    setDeviceType(type);
    setDeviceModel(model);
    setIsSaved(false);
    setSavedUrl('');
    setIsFirstMessageSent(false); // Reset for token optimization
    setMessages([
      { type: 'system', text: `✓ ${t('assistantConfigured')}` },
      { type: 'assistant', text: `${t('heyConfigured')} ${fullName}. ${t('whatToAsk')}` }
    ]);
  };

  const handleSend = async (customMessage) => {
    const messageToSend = customMessage || inputValue.trim();
    if (!messageToSend || !pdfUploaded || isThinking || isTypingEffect) return;

    const userMessage = messageToSend;
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    if (!customMessage) setInputValue('');
    setIsThinking(true);

    try {
      // TOKEN OPTIMIZATION: Pass chat history and first message flag
      const isFirst = !isFirstMessageSent;

      const response = await askGroq(
        userMessage,
        pdfContext,
        deviceType,
        deviceModel,
        messages, // Pass chat history
        isFirst,  // Is this the first message?
        DEMO_RESPONSES
      );

      // Mark first message as sent (PDF context won't be re-sent)
      if (!isFirstMessageSent) {
        setIsFirstMessageSent(true);
      }

      setIsThinking(false);

      if (response) {
        typewriterEffect(response, (fullText) => {
          setMessages(prev => [...prev, { type: 'assistant', text: fullText }]);
        });
      }
    } catch (error) {
      console.error('Error in handleSend:', error);
      setIsThinking(false);
      setMessages(prev => [...prev, {
        type: 'assistant',
        text: lang === 'pl' ? 'Przepraszam, wystąpił błąd. Spróbuj ponownie.' : 'Sorry, an error occurred. Please try again.'
      }]);
    }
  };

  // Quick action handler
  const handleQuickAction = (question) => {
    handleSend(question);
  };

  const resetDemo = () => {
    setPdfUploaded(false);
    setPdfName('');
    setPdfContext('');
    setMessages([]);
    setCurrentTypingText('');
    setIsTypingEffect(false);
    setIsSaved(false);
    setSavedUrl('');
    setShowSavedMessage(false);
    setDeviceType('');
    setDeviceModel('');
    setIsConfigured(false);
    setPdfFileLoaded(false);
    setUploadProgress(0);
    setIsFirstMessageSent(false); // Reset for token optimization
    setFromUrl(false); // Reset QR entry flag so Save/Delete buttons show for new devices
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleSave = () => {
    const deviceFullName = `${deviceType} ${deviceModel}`.trim() || pdfName;
    const deviceParam = encodeURIComponent(deviceFullName);
    const newUrl = `${window.location.origin}${window.location.pathname}?device=${deviceParam}`;
    setSavedUrl(newUrl);
    setIsSaved(true);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleDelete = () => {
    setIsSaved(false);
    setSavedUrl('');
  };

  // Save device to Supabase database
  const handleSaveToDatabase = async () => {
    if (!isAuthenticated) {
      onOpenAuth?.();
      return;
    }

    setSavingToDb(true);
    try {
      // Check if user can save more devices based on plan
      const canSave = await canSaveMoreDevices(user.id, planType);
      if (!canSave) {
        alert(lang === 'pl'
          ? 'Osiągnąłeś limit urządzeń. Ulepsz plan, aby dodać więcej.'
          : 'You reached the device limit. Upgrade your plan to add more.');
        setSavingToDb(false);
        return;
      }

      const qrUrl = getQrValue();
      const { error } = await saveDevice(user.id, {
        name: deviceType,
        model: deviceModel,
        type: deviceType,
        pdfContent: pdfContext || null,
        qrUrl,
      });

      if (error) throw error;

      setSavedToDb(true);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    } catch (err) {
      console.error('Failed to save device:', err);
      alert(lang === 'pl' ? 'Nie udało się zapisać urządzenia.' : 'Failed to save device.');
    } finally {
      setSavingToDb(false);
    }
  };

  const getQrValue = () => {
    if (isSaved && savedUrl) return savedUrl;
    // Use deviceType + deviceModel for QR
    const deviceFullName = `${deviceType} ${deviceModel}`.trim();
    if (deviceFullName) {
      return `${window.location.origin}${window.location.pathname}?device=${encodeURIComponent(deviceFullName)}`;
    }
    if (pdfName) {
      return `${window.location.origin}${window.location.pathname}?device=${encodeURIComponent(pdfName)}`;
    }
    return typeof window !== 'undefined' ? window.location.href : 'https://guideai.app';
  };

  return (
    <section ref={ref} id="demo-section" className={`px-6 py-8 scroll-mt-4 ${darkMode ? 'bg-slate-800/50' : 'bg-gradient-to-b from-white to-slate-50'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-semibold shadow-sm ${darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
            <Sparkles className="w-5 h-5" />
            {t('interactiveDemo')}
          </div>
        </div>

        <div className={`rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-slate-800 border border-slate-700 shadow-slate-900/50' : 'bg-white border border-slate-200 shadow-slate-200/50'}`}>
          <div className={`flex items-center gap-2 px-4 py-3 border-b ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className={`ml-4 text-sm font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>GuideAI Demo</span>
            {GROQ_API_KEY && (
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                AI Connected
              </span>
            )}
            {pdfContext && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                PDF Loaded
              </span>
            )}
          </div>

          <div className={`grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x ${darkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
            <div className="p-6">
              {isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center py-12">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 border-4 rounded-full ${darkMode ? 'border-slate-700' : 'border-blue-100'}`} />
                    <div className="absolute inset-0 w-20 h-20 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
                    <FileText className="absolute inset-0 m-auto w-8 h-8 text-blue-500" />
                  </div>
                  <p className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('analyzing')}</p>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{analyzeProgress}</p>
                  <div className={`w-full max-w-[200px] h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{uploadProgress}%</p>
                </div>
              ) : pdfFileLoaded && !isConfigured ? (
                <div className="h-full flex flex-col">
                  <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <FileText className="w-4 h-4 text-blue-500" />
                    {t('configCorrection')}
                  </h4>
                  <div className={`flex-1 flex flex-col rounded-xl p-5 border ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'}`}>
                    {pdfContext ? (
                      <p className="text-xs text-green-500 mb-4 flex items-center gap-1">
                        <Check className="w-3 h-3" /> {t('detectedPdf')} ({pdfContext.length} {t('chars')})
                      </p>
                    ) : (
                      <p className="text-xs text-amber-500 mb-4">⚠ {t('noPdfWarning')}</p>
                    )}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t('deviceType')}</label>
                        <input type="text" value={deviceType} onChange={(e) => setDeviceType(e.target.value)} placeholder={t('deviceTypePlaceholder')}
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${darkMode ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900'}`} />
                      </div>
                      <div>
                        <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t('model')}</label>
                        <input type="text" value={deviceModel} onChange={(e) => setDeviceModel(e.target.value)} placeholder={t('modelPlaceholder')}
                          className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${darkMode ? 'bg-slate-800 border-slate-600 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900'}`} />
                      </div>
                    </div>
                    {(deviceType || deviceModel) && (
                      <div className={`flex items-center gap-3 p-3 rounded-lg border mb-4 ${darkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-200'}`}>
                        <div className="p-2 rounded-lg bg-white border border-slate-200">
                          <QRCodeSVG value={`${window.location.origin}${window.location.pathname}?device=${encodeURIComponent(`${deviceType} ${deviceModel}`.trim())}`} size={48} level="L" marginSize={1} bgColor="#ffffff" fgColor="#0f172a" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{t('qrPreview')}</p>
                          <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deviceType} {deviceModel}</p>
                        </div>
                      </div>
                    )}
                    <button onClick={handleGenerateAssistant} disabled={!deviceType.trim() || !deviceModel.trim()}
                      className={`w-full py-3 font-medium rounded-xl transition-all flex items-center justify-center gap-2 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500' : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg disabled:bg-slate-300'} disabled:cursor-not-allowed`}>
                      <Sparkles className="w-4 h-4" />
                      {t('generateAssistant')}
                    </button>
                  </div>
                  <button onClick={resetDemo} className={`mt-4 text-sm transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}>← {t('uploadOther')}</button>
                </div>
              ) : pdfUploaded ? (
                <div className="h-full flex flex-col">
                  <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Smartphone className="w-4 h-4 text-blue-500" />
                    {t('deviceCard')}
                  </h4>
                  <div className={`flex-1 flex flex-col items-center justify-center rounded-xl p-6 border ${darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'}`}>
                    <div className="mb-4 text-center">
                      <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{t('device')}</p>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{deviceType} {deviceModel}</p>
                      {pdfContext && <p className="text-xs text-green-500 mt-1">✓ {t('pdfLoaded')}</p>}
                    </div>
                    <div className={`bg-white p-4 rounded-xl shadow-lg border-2 mb-3 transition-all ${isSaved ? 'border-green-400' : 'border-slate-200'} ${qrPulse ? 'animate-pulse ring-4 ring-blue-400 ring-opacity-50' : ''}`}>
                      <QRCodeSVG value={getQrValue()} size={140} level="M" marginSize={2} bgColor="#ffffff" fgColor="#0f172a" />
                    </div>
                    <p className={`text-xs text-center max-w-[200px] mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {fromUrl
                        ? (lang === 'pl' ? 'Asystent gotowy do pracy' : 'Assistant ready to help')
                        : isSaved
                          ? (lang === 'pl' ? 'Kod QR przypisany' : 'QR assigned')
                          : (lang === 'pl' ? 'Zeskanuj aby otworzyć' : 'Scan to open')}
                    </p>
                    {/* Hide Save/Delete when accessed via QR */}
                    {!fromUrl && (
                      <>
                        <div className="flex gap-2 w-full max-w-[220px]">
                          <button onClick={handleSave} disabled={isSaved}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${isSaved ? 'border-green-400 bg-green-50 text-green-600 cursor-default' : 'border-green-500 text-green-600 hover:bg-green-50 hover:scale-105'}`}>
                            <Check className="w-4 h-4" />
                            {isSaved ? t('saved') : t('save')}
                          </button>
                          <button onClick={handleDelete}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${isSaved ? 'border-slate-300 text-slate-400 hover:border-slate-400' : 'border-red-400 text-red-500 hover:bg-red-50 hover:scale-105'}`}>
                            <X className="w-4 h-4" />
                            {t('delete')}
                          </button>
                        </div>

                        {/* Save to Dashboard Button */}
                        <button
                          onClick={handleSaveToDatabase}
                          disabled={savingToDb || savedToDb}
                          className={`mt-3 w-full max-w-[220px] flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                            savedToDb
                              ? 'bg-green-500 text-white cursor-default'
                              : isAuthenticated
                                ? 'bg-blue-600 text-white hover:bg-blue-500'
                                : `border-2 border-dashed ${darkMode ? 'border-slate-600 text-slate-400 hover:border-blue-500 hover:text-blue-400' : 'border-slate-300 text-slate-500 hover:border-blue-500 hover:text-blue-600'}`
                          }`}
                        >
                          {savingToDb ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              {lang === 'pl' ? 'Zapisuję...' : 'Saving...'}
                            </>
                          ) : savedToDb ? (
                            <>
                              <Check className="w-4 h-4" />
                              {lang === 'pl' ? 'Zapisano w panelu' : 'Saved to Dashboard'}
                            </>
                          ) : isAuthenticated ? (
                            <>
                              <Save className="w-4 h-4" />
                              {lang === 'pl' ? 'Zapisz w panelu' : 'Save to Dashboard'}
                            </>
                          ) : (
                            <>
                              <User className="w-4 h-4" />
                              {lang === 'pl' ? 'Zaloguj się, aby zapisać' : 'Sign in to save'}
                            </>
                          )}
                        </button>

                        {showSavedMessage && <div className="mt-3 text-xs text-green-600 bg-green-100 px-3 py-1.5 rounded-full animate-pulse">✓ {lang === 'pl' ? 'Zapisano!' : 'Saved!'}</div>}
                      </>
                    )}
                  </div>
                  {/* Always show change device button */}
                  <button onClick={resetDemo} className={`mt-4 text-sm transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                    ← {t('changeDevice')}
                  </button>
                </div>
              ) : (
                // ═══ UPLOAD PANEL ═══
                <>
                  <h4 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Upload className="w-4 h-4 text-blue-500" />
                    {t('uploadInstruction')}
                  </h4>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {/* Drop zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className={`border-2 border-dashed rounded-xl rounded-b-none p-8 text-center transition-all cursor-pointer group ${darkMode ? 'border-slate-600 hover:border-blue-400 hover:bg-blue-900/20' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'}`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors ${darkMode ? 'bg-slate-700 group-hover:bg-blue-900' : 'bg-slate-100'}`}>
                        <Upload className={`w-7 h-7 group-hover:text-blue-500 transition-colors ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} />
                      </div>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-slate-700'}`}>{t('dragPdf')}</p>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{t('orClick')}</p>
                      <p className="text-xs text-blue-500 font-medium">{t('realPdf')}</p>
                    </div>
                  </div>

                  {/* Start without manual button */}
                  <button
                    onClick={() => {
                      setPdfFileLoaded(true);
                      setPdfContext('');
                      setDeviceType('');
                      setDeviceModel('');
                    }}
                    className={`w-full py-1.5 text-xs font-medium rounded-b-xl border-2 border-t-0 transition-all ${darkMode ? 'border-slate-600 text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50'}`}
                  >
                    {lang === 'pl' ? 'Rozpocznij bez instrukcji. Znajdźmy ją.' : 'Start without manual. Let\'s find it.'}
                  </button>

                  <div className="mt-5">
                    <p className={`text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{t('tryExample')}</p>
                    <div className="flex flex-wrap gap-2">
                      {DEVICES.map((device) => (
                        <button
                          key={device.id}
                          onClick={() => simulateUpload(device.fullName)}
                          className={`flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg hover:scale-105 transition-all shadow-sm ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                        >
                          <div
                            className="w-5 h-5 rounded border border-slate-600 flex items-center justify-center"
                            style={{ backgroundColor: device.color + '25' }}
                          >
                            <QRCodeSVG value={device.id} size={12} bgColor="transparent" fgColor={device.color} />
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-xs ${darkMode ? 'bg-slate-600' : 'bg-slate-700'}`}>{lang === 'pl' ? device.category : device.categoryEn}</span>
                          {device.fullName}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Panel - Chat */}
            <div className="p-6 flex flex-col" style={{ minHeight: '400px' }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-sm font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  {t('chatWithManual')}
                </h4>
                {/* Reset button - hidden when fromUrl to protect dedicated assistant */}
                {pdfUploaded && !fromUrl && (
                  <button
                    onClick={resetDemo}
                    className={`p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                    title={lang === 'pl' ? 'Resetuj' : 'Reset'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Knowledge Base Indicator */}
              {pdfContext && pdfUploaded && (
                <div className={`mb-3 px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${darkMode ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>
                    {lang === 'pl' ? 'Baza wiedzy aktywna: ' : 'Knowledge base active: '}
                    <span className="font-medium">{pdfName}</span>
                    <span className={`ml-1 ${darkMode ? 'text-blue-500' : 'text-blue-400'}`}>
                      ({pdfContext.length.toLocaleString()} {lang === 'pl' ? 'znaków' : 'chars'})
                    </span>
                  </span>
                </div>
              )}

              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 max-h-[300px]">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className={`text-sm text-center whitespace-pre-line ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                      {isAnalyzing ? t('analyzing') : t('loadPdfFirst')}
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                          ${msg.type === 'user' ? `ml-auto ${darkMode ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'}` : ''}
                          ${msg.type === 'assistant' ? `mr-auto ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-800'}` : ''}
                          ${msg.type === 'system' ? `mx-auto text-xs font-medium ${darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'}` : ''}`}
                      >
                        {msg.type === 'assistant' ? <FormattedMessage text={msg.text} /> : msg.text}
                      </div>
                    ))}

                    {isThinking && (
                      <div className={`mr-auto px-4 py-3 rounded-2xl ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                          </div>
                          <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {pdfContext ? t('thinkingWithPdf') : t('thinking')}
                          </span>
                        </div>
                      </div>
                    )}

                    {isTypingEffect && currentTypingText && (
                      <div className={`mr-auto px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${darkMode ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
                        <FormattedMessage text={currentTypingText} />
                        <span className="inline-block w-0.5 h-4 bg-blue-500 ml-1 animate-pulse" />
                      </div>
                    )}
                  </>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={pdfUploaded ? t('askAboutDevice') : t('loadPdfFirstShort')}
                  disabled={!pdfUploaded || isThinking || isTypingEffect || isAnalyzing}
                  className={`flex-1 px-4 py-2.5 border rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 disabled:bg-slate-800 disabled:text-slate-500' : 'border-slate-200 disabled:bg-slate-50 disabled:text-slate-400'}`}
                />
                <button
                  onClick={handleSend}
                  disabled={!pdfUploaded || !inputValue.trim() || isThinking || isTypingEffect || isAnalyzing}
                  className={`w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition-all ${darkMode ? 'disabled:bg-slate-700' : 'disabled:bg-slate-200'} disabled:scale-100`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {pdfUploaded && !isThinking && !isTypingEffect && !isAnalyzing && (
          <div className="mt-6">
            {/* Session indicator */}
            <div className="flex justify-center mb-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {t('sessionActive')}: <span className="font-bold">{deviceType} {deviceModel}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <p className={`text-sm mb-3 text-center ${darkMode ? 'text-slate-400' : 'text-slate-400'}`}>{t('trySaying')}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[t('quickError'), t('quickReset'), t('quickFilter')].map((q) => (
                <button
                  key={q}
                  onClick={() => handleQuickAction(q)}
                  className={`text-sm px-4 py-2.5 rounded-full font-medium transition-all hover:scale-105 ${
                    darkMode
                      ? 'bg-slate-800 text-blue-400 border border-slate-700 hover:bg-slate-700 hover:border-blue-500'
                      : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-200 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

InteractiveDemo.displayName = 'InteractiveDemo';

// ═══════════════════════════════════════════════════════════════
// EXAMPLE GRID COMPONENT
// ═══════════════════════════════════════════════════════════════
const ExampleGrid = ({ onSelectDevice, demoRef }) => {
  const { darkMode, lang, t } = useApp();

  const examples = lang === 'pl' ? [
    { id: 'dell-5650', category: 'IT', title: 'Serwer Dell 5650', fileName: 'Serwer Dell 5650', description: 'Diagnostyka, troubleshooting', questions: ['Dlaczego wentylatory pracują na maksymalnych obrotach?', 'Jak zaktualizować oprogramowanie układowe?'], color: '#3b82f6' },
    { id: 'beko-b300', category: 'AGD', title: 'Pralka Beko B300', fileName: 'Pralka Beko B300', description: 'Kody błędów, programy', questions: ['Jak odblokować blokadę rodzicielską?', 'Co oznacza błąd E18 - pralka nie odpompowuje wody?'], color: '#10b981' },
    { id: 'lg-aa12sp', category: 'HVAC', title: 'Klimatyzator LG AA12SP', fileName: 'Klimatyzator LG AA12SP', description: 'Ustawienia, konserwacja', questions: ['Dlaczego jest dziwny zapach mimo czyszczenia filtrów?', 'Co oznacza błąd CH05 i dlaczego dioda miga 5 razy?'], color: '#8b5cf6' }
  ] : [
    { id: 'dell-5650', category: 'IT', title: 'Dell Server 5650', fileName: 'Serwer Dell 5650', description: 'Diagnostics, troubleshooting', questions: ['Why are fans running at max speed?', 'How to update firmware?'], color: '#3b82f6' },
    { id: 'beko-b300', category: 'Home', title: 'Beko Washer B300', fileName: 'Pralka Beko B300', description: 'Error codes, programs', questions: ['How to unlock parental lock?', 'What does error E18 mean - washer not draining?'], color: '#10b981' },
    { id: 'lg-aa12sp', category: 'HVAC', title: 'LG AC AA12SP', fileName: 'Klimatyzator LG AA12SP', description: 'Settings, maintenance', questions: ['Why strange smell despite cleaning filters?', 'What does error CH05 mean and why LED blinks 5 times?'], color: '#8b5cf6' }
  ];

  const handleChatClick = (device) => {
    onSelectDevice(device.fileName);
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section className={`px-6 py-16 ${darkMode ? 'bg-slate-900' : ''}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h3 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('worksWithAny')}</h3>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('fromServerToWasher')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((ex) => (
            <div key={ex.id} className={`group rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col ${darkMode ? 'bg-slate-800 border border-slate-700 hover:border-slate-600' : 'bg-white border border-slate-200 hover:border-slate-300'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center p-1.5" style={{ borderColor: ex.color, backgroundColor: ex.color + '10' }}>
                  <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : 'https://guideai.app'}?device=${encodeURIComponent(ex.fileName)}`} size={32} bgColor="transparent" fgColor={ex.color} level="L" />
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: ex.color + '15', color: ex.color }}>{ex.category}</span>
              </div>
              <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{ex.title}</h4>
              <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{ex.description}</p>
              <div className="space-y-2 mb-6">
                {ex.questions.map((q, j) => (
                  <div key={j} className={`flex items-center gap-2 text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    <MessageSquare className="w-3 h-3 flex-shrink-0" />
                    <span>"{q}"</span>
                  </div>
                ))}
              </div>
              <button onClick={() => handleChatClick(ex)} className={`mt-auto flex items-center justify-center gap-2 w-full py-3 font-medium rounded-xl hover:shadow-lg group-hover:scale-[1.02] transition-all duration-300 ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-900 text-white hover:bg-blue-600'}`}>
                <MessageSquare className="w-5 h-5" />
                {t('chatWithDevice')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// USE CASES COMPONENT
// ═══════════════════════════════════════════════════════════════
const UseCases = ({ onSelectDevice, demoRef }) => {
  const { darkMode, lang, t } = useApp();

  const cases = lang === 'pl' ? [
    { icon: Building2, title: 'Airbnb & Wynajem', description: 'Zero pytań od gości o 3 w nocy', stat: '90%', statLabel: 'mniej pytań', device: 'Klimatyzator LG AA12SP' },
    { icon: Wrench, title: 'Serwis & Technicy', description: 'Odpowiedzi bez szukania w segregatorach', stat: '5x', statLabel: 'szybsza diagnostyka', device: 'Serwer Dell 5650' },
    { icon: Dumbbell, title: 'Siłownie & Fitness', description: 'Członkowie uczą się sami, bezpiecznie', stat: '60%', statLabel: 'mniej szkoleń', device: 'Pralka Beko B300' }
  ] : [
    { icon: Building2, title: 'Airbnb & Rental', description: 'Zero guest questions at 3 AM', stat: '90%', statLabel: 'fewer questions', device: 'Klimatyzator LG AA12SP' },
    { icon: Wrench, title: 'Service & Technicians', description: 'Answers without digging through binders', stat: '5x', statLabel: 'faster diagnostics', device: 'Serwer Dell 5650' },
    { icon: Dumbbell, title: 'Gyms & Fitness', description: 'Members learn safely on their own', stat: '60%', statLabel: 'less training', device: 'Pralka Beko B300' }
  ];

  const handleChatClick = (deviceFileName) => {
    onSelectDevice(deviceFileName);
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <section className={`px-6 py-16 ${darkMode ? 'bg-slate-800' : 'bg-slate-900'} text-white`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold mb-3">{t('forWho')}</h3>
          <p className="text-slate-400">{t('forWhoSubtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <div key={i} className={`group rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 flex flex-col ${darkMode ? 'bg-slate-700/50 border border-slate-600 hover:bg-slate-700' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'}`}>
              <c.icon className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="font-semibold text-lg mb-2">{c.title}</h4>
              <p className="text-sm text-slate-400 mb-4">{c.description}</p>
              <div className={`pt-4 border-t mb-4 ${darkMode ? 'border-slate-600' : 'border-slate-700'}`}>
                <span className="text-3xl font-bold text-blue-400">{c.stat}</span>
                <span className="text-sm text-slate-500 ml-2">{c.statLabel}</span>
              </div>
              <button onClick={() => handleChatClick(c.device)} className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 hover:shadow-lg transition-all">
                <MessageSquare className="w-4 h-4" />
                {lang === 'pl' ? 'Chatuj!' : 'Chat!'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// PRICING COMPONENT
// ═══════════════════════════════════════════════════════════════
const Pricing = ({ onEarlyAccess }) => {
  const { darkMode, lang, t } = useApp();

  const proFeatures = lang === 'pl'
    ? ['10 urządzeń', 'Dynamiczne kody QR', 'Wsparcie email', '1,000 zapytań/msc', 'Podstawowa analityka']
    : ['10 devices', 'Dynamic QR codes', 'Email support', '1,000 queries/mo', 'Basic analytics'];

  const businessFeatures = lang === 'pl'
    ? ['Wszystko z Pro', 'Nielimitowane urządzenia', 'Pełny branding', 'Zaawansowana analityka', 'Priorytetowe wsparcie 24/7']
    : ['Everything in Pro', 'Unlimited devices', 'Full Branding', 'Custom Analytics', 'Priority 24/7 Support'];

  return (
    <section className={`px-6 py-12 ${darkMode ? 'bg-slate-900' : ''}`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t('simplePricing')}</h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t('startFree')}</p>
        </div>

        {/* Pro & Business Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {/* Pro Card */}
          <div className={`rounded-xl p-6 relative transition-all hover:shadow-lg ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Pro</h4>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {lang === 'pl' ? 'Dla małych zespołów' : 'For small teams & landlords'}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>$9</span>
                  <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>/mo</span>
                </div>
                <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {lang === 'pl' ? 'rozliczane rocznie' : 'billed annually'}
                </span>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {proFeatures.map((f, i) => (
                <li key={i} className={`flex items-center gap-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={onEarlyAccess}
              className={`w-full py-2.5 rounded-lg font-medium text-sm transition-all ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
            >
              {lang === 'pl' ? 'Wybierz Pro' : 'Choose Pro'}
            </button>
          </div>

          {/* Business Card */}
          <div className={`rounded-xl p-6 relative transition-all hover:shadow-lg border-2 ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-blue-500/50' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-400'}`}>
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-medium px-3 py-0.5 rounded-full">
              {lang === 'pl' ? 'Popularne' : 'Popular'}
            </div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Business</h4>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {lang === 'pl' ? 'Dla agencji i firm' : 'For agencies & enterprises'}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>$20</span>
                  <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>
                </div>
                <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {lang === 'pl' ? 'rozliczane rocznie' : 'billed annually'}
                </span>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {businessFeatures.map((f, i) => (
                <li key={i} className={`flex items-center gap-2 text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  <Check className="w-4 h-4 text-blue-500 flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <button
              onClick={onEarlyAccess}
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-500 transition-all"
            >
              {lang === 'pl' ? 'Wybierz Business' : 'Choose Business'}
            </button>
          </div>
        </div>

        {/* Free Tier - Full Width Glassmorphism Button */}
        <div className={`rounded-xl p-4 backdrop-blur-sm border transition-all hover:shadow-md ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:border-slate-600' : 'bg-white/60 border-slate-200 hover:border-slate-300'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {lang === 'pl' ? 'Zacznij za darmo' : 'Get started for free'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {lang === 'pl'
                    ? '1 stały link QR • Wsparcie AI • Dostęp do społeczności'
                    : '1 Permanent QR Link • AI Support • Community Access'}
                </p>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-600 hover:bg-slate-100'}`}>
              {lang === 'pl' ? 'Kontynuuj za darmo →' : 'Continue free →'}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {lang === 'pl' ? '7 dni za darmo' : '7-day free trial'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {lang === 'pl' ? 'Bez karty kredytowej' : 'No credit card'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <Check className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {lang === 'pl' ? 'Anuluj kiedy chcesz' : 'Cancel anytime'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {lang === 'pl' ? 'Bez zobowiązań' : 'No commitment'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {lang === 'pl' ? '99.9% uptime' : '99.9% uptime'}
                </p>
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {lang === 'pl' ? 'Gwarancja SLA' : 'SLA guarantee'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// EARLY ACCESS MODAL
// ═══════════════════════════════════════════════════════════════
const EarlyAccessModal = ({ isOpen, onClose }) => {
  const { darkMode, lang } = useApp();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      window.location.href = `mailto:hcklabs.dev@gmail.com?subject=GuideAI Early Access&body=Hi! I'd like early access to GuideAI Pro.%0A%0AMy email: ${email}`;
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl transform transition-all ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'pl' ? 'Jesteś na liście!' : "You're on the list!"}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {lang === 'pl' ? 'Powiadomimy Cię na starcie.' : "We'll notify you at launch."}
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-5">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                <Sparkles className="w-3 h-3" />
                {lang === 'pl' ? '40% zniżki na zawsze' : '40% lifetime discount'}
              </div>
              <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'pl' ? 'Dołącz do Early Access' : 'Join the Early Access'}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {lang === 'pl'
                  ? 'Startujemy wkrótce. Zabezpiecz swoją zniżkę teraz.'
                  : 'We are launching soon. Secure your discount now.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'pl' ? 'twoj@email.com' : 'you@company.com'}
                required
                className={`w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode
                    ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-500'
                    : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {lang === 'pl' ? 'Powiadom mnie na starcie' : 'Notify me on launch'}
              </button>
            </form>

            <div className={`mt-4 pt-4 border-t border-dashed flex justify-center ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <a
                href="#/early-access"
                onClick={onClose}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  darkMode
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'pl' ? 'Zobacz pełny cennik' : 'See full pricing'}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// HOW IT WORKS COMPONENT
// ═══════════════════════════════════════════════════════════════
const HowItWorks = () => {
  const { darkMode, lang } = useApp();

  const steps = lang === 'pl' ? [
    { num: '1', title: 'Wgraj instrukcję PDF', desc: 'Przeciągnij i upuść instrukcję obsługi lub dokumentację techniczną.' },
    { num: '2', title: 'AI analizuje treść', desc: 'Nasza AI przetwarza dokument i uczy się odpowiadać na pytania.' },
    { num: '3', title: 'Udostępnij kod QR', desc: 'Klienci skanują QR i natychmiast uzyskują odpowiedzi od AI.' },
  ] : [
    { num: '1', title: 'Upload your PDF manual', desc: 'Drag and drop your product manual or technical documentation.' },
    { num: '2', title: 'AI analyzes content', desc: 'Our AI processes the document and learns to answer questions.' },
    { num: '3', title: 'Share your QR code', desc: 'Customers scan QR and instantly get AI-powered answers.' },
  ];

  return (
    <section className={`px-6 py-16 ${darkMode ? 'bg-slate-800/30' : 'bg-gradient-to-b from-white to-slate-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'pl' ? 'Jak to działa?' : 'How it works'}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {lang === 'pl' ? 'Trzy proste kroki do AI-asystenta' : 'Three simple steps to your AI assistant'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={`hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 ${darkMode ? 'bg-gradient-to-r from-blue-500/50 to-transparent' : 'bg-gradient-to-r from-blue-300 to-transparent'}`} />
              )}

              <div className={`relative p-6 rounded-2xl transition-all hover:scale-[1.02] ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'}`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-4 ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  {step.num}
                </div>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{step.title}</h4>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// FAQ COMPONENT (with accordion)
// ═══════════════════════════════════════════════════════════════
const FAQ = () => {
  const { darkMode, lang } = useApp();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = lang === 'pl' ? [
    { q: 'Jak działa darmowy okres próbny?', a: 'Pełny dostęp przez 7 dni. Bez karty kredytowej. Jeśli nie subskrybujesz, konto automatycznie się pauzuje.' },
    { q: 'Co liczy się jako "zapytanie"?', a: 'Każde pytanie, które klient zadaje Twojemu asystentowi AI. Wiadomości w tej samej sesji liczą się jako jedno zapytanie.' },
    { q: 'Czy mogę zmienić plan później?', a: 'Tak. Możesz zmienić plan w dowolnym momencie z panelu. Zmiany obowiązują natychmiast z proporcjonalnym rozliczeniem.' },
    { q: 'Jakie formaty plików obsługujecie?', a: 'Obecnie obsługujemy pliki PDF. Wkrótce dodamy wsparcie dla DOCX, TXT i stron internetowych.' },
    { q: 'Czy moje dane są bezpieczne?', a: 'Tak. Używamy szyfrowania end-to-end. Twoje dokumenty są przetwarzane bezpiecznie i nie są udostępniane osobom trzecim.' },
    { q: 'Czy mogę używać własnego brandingu?', a: 'Tak, w planie Business możesz dostosować wygląd asystenta, w tym logo, kolory i domenę.' },
  ] : [
    { q: 'How does the free trial work?', a: 'Full access for 7 days. No credit card required. If you don\'t subscribe, your account pauses automatically.' },
    { q: 'What counts as a "query"?', a: 'Each question a customer asks your AI assistant. Follow-up messages in the same session count as one query.' },
    { q: 'Can I change plans later?', a: 'Yes. Upgrade or downgrade anytime from your dashboard. Changes apply immediately with prorated billing.' },
    { q: 'What file formats do you support?', a: 'Currently we support PDF files. We\'re adding support for DOCX, TXT, and web pages soon.' },
    { q: 'Is my data secure?', a: 'Yes. We use end-to-end encryption. Your documents are processed securely and never shared with third parties.' },
    { q: 'Can I use my own branding?', a: 'Yes, on the Business plan you can customize the assistant appearance including logo, colors, and domain.' },
  ];

  return (
    <section className={`px-6 py-16 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'pl' ? 'Często zadawane pytania' : 'Frequently asked questions'}
          </h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {lang === 'pl' ? 'Wszystko co musisz wiedzieć' : 'Everything you need to know'}
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-xl overflow-hidden transition-all ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className={`w-full p-4 flex items-center justify-between text-left transition-colors ${darkMode ? 'hover:bg-slate-750' : 'hover:bg-slate-50'}`}
              >
                <h4 className={`font-medium pr-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{faq.q}</h4>
                <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-90' : ''} ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${openIndex === i ? 'max-h-40' : 'max-h-0'}`}>
                <p className={`px-4 pb-4 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════
// FOOTER COMPONENT
// ═══════════════════════════════════════════════════════════════
const Footer = () => {
  const { darkMode, lang } = useApp();

  const links = {
    product: lang === 'pl'
      ? [{ label: 'Funkcje', href: '#demo' }, { label: 'Cennik', href: '#/early-access' }, { label: 'Demo', href: '#demo' }]
      : [{ label: 'Features', href: '#demo' }, { label: 'Pricing', href: '#/early-access' }, { label: 'Demo', href: '#demo' }],
    company: lang === 'pl'
      ? [{ label: 'O nas', href: '#' }, { label: 'Kontakt', href: 'mailto:hcklabs.dev@gmail.com' }, { label: 'Blog', href: '#' }]
      : [{ label: 'About', href: '#' }, { label: 'Contact', href: 'mailto:hcklabs.dev@gmail.com' }, { label: 'Blog', href: '#' }],
    legal: lang === 'pl'
      ? [{ label: 'Regulamin', href: '#' }, { label: 'Prywatność', href: '#' }]
      : [{ label: 'Terms', href: '#' }, { label: 'Privacy', href: '#' }],
  };

  return (
    <footer className={`px-6 py-12 border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
      <div className="max-w-5xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-6 h-6 grid grid-cols-4 grid-rows-4 gap-[1px] p-[2px] border rounded ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                {[1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1].map((f, i) => (
                  <div key={i} className={`${f ? (darkMode ? 'bg-white' : 'bg-slate-600') : 'bg-transparent'} rounded-[1px]`} />
                ))}
              </div>
              <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Guide<span className="text-blue-500">AI</span>
              </span>
            </div>
            <p className={`text-sm mb-4 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              {lang === 'pl'
                ? 'Zamień instrukcje w inteligentne rozmowy.'
                : 'Turn manuals into intelligent conversations.'}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'pl' ? 'Produkt' : 'Product'}
            </h4>
            <ul className="space-y-2">
              {links.product.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className={`text-sm transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'pl' ? 'Firma' : 'Company'}
            </h4>
            <ul className="space-y-2">
              {links.company.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className={`text-sm transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {lang === 'pl' ? 'Prawne' : 'Legal'}
            </h4>
            <ul className="space-y-2">
              {links.legal.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className={`text-sm transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            © 2026 HCK_Labs. {lang === 'pl' ? 'Wszelkie prawa zastrzeżone.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:hcklabs.dev@gmail.com" className={`text-sm transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              hcklabs.dev@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ═══════════════════════════════════════════════════════════════
// USER MENU COMPONENT
// ═══════════════════════════════════════════════════════════════
const UserMenu = ({ onOpenAuth }) => {
  const { user, isAuthenticated, isPro, loading } = useAuth();
  const { darkMode, lang } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    window.location.hash = '';
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <button
        onClick={onOpenAuth}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
          darkMode
            ? 'bg-blue-600 text-white hover:bg-blue-500'
            : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
        }`}
      >
        <User className="w-4 h-4" />
        {lang === 'pl' ? 'Zaloguj' : 'Sign in'}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
          darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100 shadow-md'
        }`}
      >
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          isPro ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
        }`}>
          {user?.email?.charAt(0).toUpperCase()}
        </div>
        {isPro && <Crown className="w-3 h-3 text-amber-400" />}
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden ${
            darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className={`px-3 py-2 border-b ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <p className={`text-xs truncate ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {user?.email}
              </p>
            </div>
            <a
              href="#/dashboard"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                darkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {lang === 'pl' ? 'Panel' : 'Dashboard'}
            </a>
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm w-full transition-colors ${
                darkMode ? 'text-red-400 hover:bg-slate-700' : 'text-red-600 hover:bg-slate-50'
              }`}
            >
              <LogOut className="w-4 h-4" />
              {lang === 'pl' ? 'Wyloguj' : 'Sign out'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN APP INNER COMPONENT (with auth access)
// ═══════════════════════════════════════════════════════════════
function GuideAIInner() {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [pdfContext, setPdfContext] = useState('');
  const [fromUrl, setFromUrl] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('en');
  const [showEarlyAccessModal, setShowEarlyAccessModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const demoRef = useRef(null);

  const { user, isAuthenticated, isPro, planType } = useAuth();

  // Translation helper
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;

  // Hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/early-access' || hash === '#/pro') {
        setCurrentPage('early-access');
      } else if (hash === '#/dashboard') {
        setCurrentPage('dashboard');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // URL Detection & Language Detection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const deviceParam = params.get('device');

      if (deviceParam) {
        const decodedDevice = decodeURIComponent(deviceParam);
        setPdfName(decodedDevice);
        setPdfUploaded(true);
        setFromUrl(true);

        setTimeout(() => {
          demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
      }

      const savedDark = localStorage.getItem('guideai-dark');
      const savedLang = localStorage.getItem('guideai-lang');
      if (savedDark === 'true') setDarkMode(true);

      if (savedLang) {
        setLang(savedLang);
      } else if (navigator.language?.startsWith('pl')) {
        setLang('pl');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      localStorage.setItem('guideai-dark', String(!prev));
      return !prev;
    });
  };

  const toggleLang = () => {
    setLang(prev => {
      const newLang = prev === 'pl' ? 'en' : 'pl';
      localStorage.setItem('guideai-lang', newLang);
      return newLang;
    });
  };

  const handleSelectDevice = (fileName) => {
    setPdfName(fileName);
    setPdfContext('');
    setPdfUploaded(true);
    setFromUrl(false);
  };

  // Handle opening chat from dashboard
  const handleOpenChatFromDashboard = (device) => {
    setPdfName(`${device.name} ${device.model}`);
    setPdfContext(device.pdfContent || '');
    setPdfUploaded(true);
    setFromUrl(false);
    window.location.hash = '';
    setTimeout(() => {
      demoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const contextValue = { darkMode, lang, t, toggleDarkMode, toggleLang };

  // Show Early Access page
  if (currentPage === 'early-access') {
    return <EarlyAccess />;
  }

  // Show Dashboard (only for authenticated users)
  if (currentPage === 'dashboard') {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      window.location.hash = '';
      return null;
    }
    return <Dashboard onOpenChat={handleOpenChatFromDashboard} lang={lang} />;
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
        {/* Theme, Language & User Toggles */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={toggleLang}
            className={`p-2 rounded-full transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-900 shadow-md'}`}
            title={lang === 'pl' ? 'Switch to English' : 'Zmień na Polski'}
          >
            <Globe className="w-4 h-4" />
            <span className="ml-1 text-xs font-bold">{lang.toUpperCase()}</span>
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-white hover:bg-slate-100 text-slate-900 shadow-md'}`}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <UserMenu onOpenAuth={() => setShowAuthModal(true)} />
        </div>

        <Header />
        <Hero />
        <InteractiveDemo
          ref={demoRef}
          pdfUploaded={pdfUploaded}
          pdfName={pdfName}
          pdfContext={pdfContext}
          setPdfUploaded={setPdfUploaded}
          setPdfName={setPdfName}
          setPdfContext={setPdfContext}
          fromUrl={fromUrl}
          setFromUrl={setFromUrl}
          onOpenAuth={() => setShowAuthModal(true)}
        />
        <ExampleGrid onSelectDevice={handleSelectDevice} demoRef={demoRef} />
        <UseCases onSelectDevice={handleSelectDevice} demoRef={demoRef} />
        <HowItWorks />
        <Pricing onEarlyAccess={() => setShowEarlyAccessModal(true)} />
        <FAQ />
        <EarlyAccessModal isOpen={showEarlyAccessModal} onClose={() => setShowEarlyAccessModal(false)} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} darkMode={darkMode} lang={lang} />
        <Footer />
      </div>
    </AppContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP COMPONENT (with AuthProvider wrapper)
// ═══════════════════════════════════════════════════════════════
export default function GuideAILanding() {
  return (
    <AuthProvider>
      <GuideAIInner />
    </AuthProvider>
  );
}
