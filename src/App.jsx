import React, { useState, useEffect, useRef } from 'react';
import { Upload, Send, MessageSquare, QrCode, ChevronRight, Check, Building2, Dumbbell, Wrench, Sparkles } from 'lucide-react';

const Header = () => {
  const [taglineVisible, setTaglineVisible] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineVisible(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="w-20" />
          <p className="text-xs text-slate-300 tracking-widest font-light">HCK_Labs</p>
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-7 h-7 grid grid-cols-4 grid-rows-4 gap-[2px] p-[3px] border border-slate-200 rounded">
            {[1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1].map((filled, i) => (
              <div key={i} className={`${filled ? 'bg-slate-800' : 'bg-transparent'} rounded-[1px]`} />
            ))}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Guide<span className="text-blue-500">AI</span>
          </h1>
        </div>
        
        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent mx-auto mb-3" />
        
        <p className="text-center text-sm text-slate-400 transition-opacity duration-1000 ease-in-out"
           style={{ opacity: taglineVisible ? 1 : 0.25 }}>
          Device, QR, and Chat — That's all!
        </p>
      </div>
    </header>
  );
};

const Hero = () => (
  <section className="px-6 py-16">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
        Twoje urządzenia teraz mówią
        <span className="block text-blue-500">ludzkim głosem</span>
      </h2>
      
      <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed">
        Zamień każdą instrukcję PDF w inteligentnego asystenta. 
        Twoi klienci skanują kod QR i dostają odpowiedzi w sekundę.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-all shadow-lg">
          Wypróbuj za darmo
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="flex items-center gap-2 text-slate-600 px-6 py-3 rounded-full font-medium hover:text-slate-900 transition-colors">
          <QrCode className="w-4 h-4" />
          Zobacz demo
        </button>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Bez karty kredytowej
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          1 urządzenie free
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Setup w 2 minuty
        </div>
      </div>
    </div>
  </section>
);

const InteractiveDemo = () => {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const demoResponses = {
    'dlaczego miga czerwona dioda': 'Czerwona dioda migająca oznacza błąd E03 - zatkany filtr odpływowy. Znajdziesz go w prawym dolnym rogu urządzenia. Odkręć pokrywę i wyczyść filtr pod bieżącą wodą.',
    'jak ustawić timer': 'Aby ustawić timer: 1) Naciśnij przycisk "Timer". 2) Użyj strzałek ▲▼ aby wybrać czas (1-24h). 3) Potwierdź OK. Urządzenie wyłączy się automatycznie.',
    'jaki jest kod błędu e05': 'Błąd E05 = problem z czujnikiem temperatury. Wyłącz urządzenie na 30 sekund i włącz ponownie. Jeśli się powtarza - kontakt z serwisem.',
    'default': 'Przeanalizowałem instrukcję. Mogę pomóc z kodami błędów, ustawieniami i konserwacją. O co chcesz zapytać?'
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const simulateUpload = (fileName) => {
    setPdfName(fileName);
    setPdfUploaded(true);
    setMessages([
      { type: 'system', text: `✓ Załadowano: ${fileName}` },
      { type: 'assistant', text: 'Przeanalizowałem instrukcję. Jestem gotowy! O co chcesz zapytać?' }
    ]);
  };

  const handleSend = () => {
    if (!inputValue.trim() || !pdfUploaded) return;
    
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const lowerInput = userMessage.toLowerCase();
      let response = demoResponses.default;
      for (const [key, value] of Object.entries(demoResponses)) {
        if (key !== 'default' && lowerInput.includes(key)) {
          response = value;
          break;
        }
      }
      setMessages(prev => [...prev, { type: 'assistant', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <section className="px-6 py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Interaktywne demo
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-3">
            Wypróbuj teraz — bez rejestracji
          </h3>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-4 text-sm text-slate-400 font-medium">GuideAI Demo</span>
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            <div className="p-6">
              <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-500" />
                Załaduj instrukcję
              </h4>
              
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${pdfUploaded ? 'bg-green-50 border-green-300' : 'border-slate-200 hover:border-slate-300'}`}>
                {pdfUploaded ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="font-medium text-green-700">{pdfName}</p>
                    <button onClick={() => { setPdfUploaded(false); setMessages([]); }}
                            className="text-sm text-slate-500 hover:text-slate-700">
                      Zmień plik
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-700">Przeciągnij PDF tutaj</p>
                    <p className="text-sm text-slate-400">lub kliknij przykład poniżej</p>
                  </div>
                )}
              </div>

              {!pdfUploaded && (
                <div className="mt-4">
                  <p className="text-xs text-slate-400 mb-2">Wypróbuj przykład:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Pralka Samsung', 'Serwer Dell', 'Klimatyzator LG'].map((name) => (
                      <button key={name}
                              onClick={() => simulateUpload(`${name} - Instrukcja.pdf`)}
                              className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col" style={{ minHeight: '350px' }}>
              <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Czat z instrukcją
              </h4>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-slate-400 text-center">
                      Załaduj instrukcję PDF,<br />aby rozpocząć rozmowę
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i}
                         className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm
                           ${msg.type === 'user' ? 'ml-auto bg-blue-500 text-white' : ''}
                           ${msg.type === 'assistant' ? 'mr-auto bg-slate-100 text-slate-800' : ''}
                           ${msg.type === 'system' ? 'mx-auto bg-green-100 text-green-700 text-xs' : ''}`}>
                      {msg.text}
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="mr-auto bg-slate-100 px-4 py-2.5 rounded-2xl flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-2">
                <input type="text"
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                       placeholder={pdfUploaded ? "Zapytaj o urządzenie..." : "Najpierw załaduj PDF..."}
                       disabled={!pdfUploaded}
                       className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-50" />
                <button onClick={handleSend}
                        disabled={!pdfUploaded || !inputValue.trim()}
                        className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:bg-slate-200">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {pdfUploaded && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400 mb-3">Spróbuj zapytać:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Dlaczego miga czerwona dioda?', 'Jak ustawić timer?', 'Jaki jest kod błędu E05?'].map((q) => (
                <button key={q}
                        onClick={() => setInputValue(q)}
                        className="text-sm px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-full hover:border-blue-300 hover:text-blue-600 transition-all">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const ExampleGrid = () => {
  const examples = [
    { icon: '🖥️', title: 'Serwer Dell R740', description: 'Diagnostyka, troubleshooting', questions: ['Jak wymienić dysk?', 'Co oznacza amber?'] },
    { icon: '🧺', title: 'Pralka Samsung', description: 'Kody błędów, programy', questions: ['Dlaczego nie wiruje?', 'Jak czyścić filtr?'] },
    { icon: '❄️', title: 'Klimatyzator LG', description: 'Ustawienia, konserwacja', questions: ['Tryb eco?', 'Co oznacza E06?'] }
  ];

  return (
    <section className="px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-slate-900 mb-3">Działa z każdym urządzeniem</h3>
          <p className="text-slate-500">Od serwerowni po pralkę</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {examples.map((ex, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-slate-300 transition-all">
              <div className="text-4xl mb-4">{ex.icon}</div>
              <h4 className="font-semibold text-slate-900 mb-1">{ex.title}</h4>
              <p className="text-sm text-slate-500 mb-4">{ex.description}</p>
              <div className="space-y-2">
                {ex.questions.map((q, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm text-slate-400">
                    <MessageSquare className="w-3 h-3" />
                    <span>"{q}"</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const UseCases = () => {
  const cases = [
    { icon: Building2, title: 'Airbnb & Wynajem', description: 'Zero pytań od gości o 3 w nocy', stat: '90%', statLabel: 'mniej pytań' },
    { icon: Wrench, title: 'Serwis & Technicy', description: 'Odpowiedzi bez szukania w segregatorach', stat: '5x', statLabel: 'szybsza diagnostyka' },
    { icon: Dumbbell, title: 'Siłownie & Fitness', description: 'Członkowie uczą się sami, bezpiecznie', stat: '60%', statLabel: 'mniej szkoleń' }
  ];

  return (
    <section className="px-6 py-16 bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold mb-3">Dla kogo?</h3>
          <p className="text-slate-400">Wszędzie gdzie ludzie pytają "jak to działa?"</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:bg-slate-800 transition-colors">
              <c.icon className="w-8 h-8 text-blue-400 mb-4" />
              <h4 className="font-semibold text-lg mb-2">{c.title}</h4>
              <p className="text-sm text-slate-400 mb-4">{c.description}</p>
              <div className="pt-4 border-t border-slate-700">
                <span className="text-3xl font-bold text-blue-400">{c.stat}</span>
                <span className="text-sm text-slate-500 ml-2">{c.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => (
  <section className="px-6 py-16">
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-slate-900 mb-3">Prosty cennik</h3>
        <p className="text-slate-500">Zacznij za darmo. Skaluj gdy potrzebujesz.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-8">
          <h4 className="text-lg font-semibold text-slate-900">Free</h4>
          <p className="text-sm text-slate-500 mb-4">Idealne na start</p>
          <div className="mb-6">
            <span className="text-4xl font-bold text-slate-900">$0</span>
            <span className="text-slate-500">/msc</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['1 urządzenie', '100 zapytań/msc', 'QR generator'].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <Check className="w-4 h-4 text-green-500" />{f}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 border border-slate-300 rounded-full font-medium text-slate-700 hover:bg-slate-50">
            Zacznij za darmo
          </button>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-8 relative">
          <div className="absolute top-4 right-4 bg-blue-500 text-xs font-medium px-3 py-1 rounded-full">Popularne</div>
          <h4 className="text-lg font-semibold">Pro</h4>
          <p className="text-sm text-slate-400 mb-4">Dla profesjonalistów</p>
          <div className="mb-6">
            <span className="text-4xl font-bold">$12</span>
            <span className="text-slate-400">/msc</span>
          </div>
          <ul className="space-y-3 mb-8">
            {['Do 10 urządzeń', 'Bez limitów', 'Własny branding', 'Analytics', 'Support'].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                <Check className="w-4 h-4 text-blue-400" />{f}
              </li>
            ))}
          </ul>
          <button className="w-full py-3 bg-blue-500 rounded-full font-medium hover:bg-blue-600">
            Wybierz Pro
          </button>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="px-6 py-12 bg-slate-50 border-t border-slate-200">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 grid grid-cols-4 grid-rows-4 gap-[1px] p-[2px] border border-slate-300 rounded">
          {[1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1].map((f, i) => (
            <div key={i} className={`${f ? 'bg-slate-600' : 'bg-transparent'} rounded-[1px]`} />
          ))}
        </div>
        <span className="font-semibold text-slate-700">GuideAI</span>
      </div>
      <p className="text-sm text-slate-400">Built with 💙 by HCK_Labs © 2026</p>
    </div>
  </footer>
);

export default function GuideAILanding() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <InteractiveDemo />
      <ExampleGrid />
      <UseCases />
      <Pricing />
      <Footer />
    </div>
  );
}
