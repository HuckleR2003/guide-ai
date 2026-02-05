import { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp, Sparkles, Calendar, MapPin, Laptop, Code, Zap, Heart, ExternalLink, Linkedin, Github, Twitter } from 'lucide-react';

const StoryPage = ({ darkMode = false, lang = 'en' }) => {
  const [expandedPosts, setExpandedPosts] = useState({});

  const handleBack = () => {
    window.location.hash = '';
  };

  const togglePost = (id) => {
    setExpandedPosts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const t = {
    backHome: lang === 'pl' ? 'Powrót do strony głównej' : 'Back to Home',
    myStory: lang === 'pl' ? 'Moja Historia' : 'My Story',
    heroTitle: lang === 'pl' ? 'Budowanie Publicznie' : 'Building in Public',
    heroSubtitle: lang === 'pl'
      ? 'Od utraty pracy do budowania przyszłości - na 10-letnim laptopie'
      : 'From job loss to building the future - on a 10-year-old laptop',
    followJourney: lang === 'pl' ? 'Śledź Moją Podróż' : 'Follow My Journey',
    featured: lang === 'pl' ? 'Wyróżnione Posty' : 'Featured Posts',
    featuredDesc: lang === 'pl'
      ? 'Najlepsze momenty z mojej drogi budowania publicznie'
      : 'Best moments from my building in public journey',
    timeline: lang === 'pl' ? 'Oś Czasu' : 'Timeline',
    timelineDesc: lang === 'pl'
      ? 'Profesjonalne aktualizacje i przemyślenia o karierze'
      : 'Professional updates and career reflections',
    expand: lang === 'pl' ? 'Rozwiń treść' : 'Expand content',
    collapse: lang === 'pl' ? 'Zwiń treść' : 'Collapse content',
    originally: lang === 'pl' ? 'Oryginalnie' : 'Originally',
  };

  const featuredPosts = [
    {
      platform: 'LinkedIn',
      title: lang === 'pl' ? 'Od Utraty Pracy do Sukcesu Indie' : 'From Job Loss to Indie Success',
      excerpt: lang === 'pl'
        ? 'Straciłem pracę w grudniu. Dziś PC_Workman ma 680+ godzin kodu...'
        : 'Lost my job in December. Today PC_Workman has 680+ hours of code...',
      date: '2025-01-05',
    },
    {
      platform: 'Twitter/X',
      title: lang === 'pl' ? 'Debugowanie przy 90°C' : 'Debugging at 90°C',
      excerpt: lang === 'pl'
        ? 'Kodowanie na sprzęcie starszym niż niektóre frameworki...'
        : 'Coding on hardware older than some frameworks...',
      date: '2024-12-15',
    },
    {
      platform: 'Medium',
      title: lang === 'pl' ? 'AI Które Naprawdę Tłumaczy' : 'AI That Actually Explains',
      excerpt: lang === 'pl'
        ? 'Jak zbudowałem AI, które mówi po ludzku...'
        : 'How I built AI that speaks human...',
      date: '2024-11-20',
    },
    {
      platform: 'GitHub',
      title: lang === 'pl' ? '2D Mapa Komponentów' : '2D Component Map',
      excerpt: lang === 'pl'
        ? 'Automatyczne wykrywanie płyt głównych i wizualizacja...'
        : 'Auto motherboard detection and visualization...',
      date: '2024-11-10',
    },
    {
      platform: 'Reddit',
      title: lang === 'pl' ? 'Budowanie Publicznie: 6 Miesięcy' : 'Building in Public: 6 Months',
      excerpt: lang === 'pl'
        ? 'Co zadziałało, co nie, dlaczego transparentność bije marketing...'
        : 'What worked, what didn\'t, why transparency beats marketing...',
      date: '2024-10-25',
    },
    {
      platform: 'Dev.to',
      title: lang === 'pl' ? 'Wykrywanie Crypto Minerów z AI' : 'Crypto Miner Detection with AI',
      excerpt: lang === 'pl'
        ? 'Rozpoznawanie wzorców dla podejrzanych procesów...'
        : 'Pattern recognition for suspicious processes...',
      date: '2024-10-15',
    },
  ];

  const timelinePosts = [
    {
      id: 'post1',
      date: '2025-01-05',
      originalLang: 'English',
      title: lang === 'pl'
        ? 'Budowałem publicznie przez 5 miesięcy. Nikt nie patrzył. Potem mnie zwolniono.'
        : 'I built in public for 5 months. Nobody watched. Then I got fired.',
      preview: lang === 'pl'
        ? 'Co się dzieje, gdy tracisz wszystko trzy dni przed świętami? 680 godzin kodu na umierającym laptopie. 4 kompletne przebudowy. 12 osób obserwujących. Potem nastąpił 22 grudnia...'
        : 'What happens when you lose everything three days before Christmas? 680 hours of code on a dying laptop. 4 complete rebuilds. 12 followers. Then December 22nd happened...',
      content: lang === 'pl' ? [
        'Hej! Jeśli masz 10 minut i kawę, napisałem coś osobistego o 680 godzinach kodu, 4 kompletnych przebudowach, laptopie, który niemal się zapalił, i o tym, co się stało 3 dni przed świętami.',
        'Za dnia: pracownik magazynu zarabiający na przetrwanie. Nocą: budowanie software\'u na laptopie z 2014 roku, który osiąga 94°C tylko przy odpalonym VS Code. Nikt nie pisze postów na LinkedIn o tej wersji "budowania publicznie."',
        'Pomysł, który nie dawał mi spokoju: Frustrowały mnie narzędzia do monitorowania PC. MSI Afterburner, HWMonitor, GeForce Experience. Wszystkie mówią to samo: "Twój CPU to 87%." Świetnie. Ale DLACZEGO?',
        'Przebudowa #1: Pierwsza wersja wyglądała jak gorączkowy sen Windows 95. Wszędzie spam informacji. Działało technicznie, ale nie było dobre.',
        'Przebudowa #2: Architektura idealna. Duszy brak. Spędziłem dwa tygodnie budując automatyczną kontrolę wentylatorów. Usunąłem wszystko - zbyt ryzykowne.',
        'Przebudowa #3: Zamiast pytać "Jakie funkcje mogę dodać?" zapytałem "Co ktoś faktycznie MUSI zobaczyć?" Usunąłem 15 000 linii kodu. Produkt się POPRAWIŁ.',
        'Potem wszystko się rozpadło: 22 grudnia. Trzy dni przed świętami. Telefon zadzwonił. Agencja. "Okres próbny się nie sprawdził."',
        'Co faktycznie zrobiłem? Zacząłem przebudowę #4. Gdy nie masz już nic do ochrony, przestajesz chronić. Po prostu budujesz.',
        'Różnica między porzuconymi projektami a wysłanymi produktami to nie talent. To pojawienie się, gdy już nie jest fajnie.',
      ] : [
        'Hey! If you have 10 minutes and a coffee, I wrote something personal about 680 hours of code, 4 complete rebuilds, a laptop that almost caught fire, and what happened 3 days before Christmas.',
        'Day job: warehouse worker making ends meet. Night shift: building software on a 2014 laptop hitting 94°C just from running VS Code. Nobody writes LinkedIn posts about this version of "building in public."',
        'The idea that wouldn\'t let go: I was frustrated with PC monitoring tools. MSI Afterburner, HWMonitor, GeForce Experience. They all say the same thing: "Your CPU is 87%." Great. But WHY?',
        'Rebuild #1: First version looked like a Windows 95 fever dream. Information spam everywhere. Worked technically, but wasn\'t good.',
        'Rebuild #2: Perfect architecture. No soul. Spent two weeks building automatic fan control. Deleted everything - too risky.',
        'Rebuild #3: Instead of asking "What features can I add?" I asked "What does someone actually NEED to see?" Deleted 15,000 lines of code. Product IMPROVED.',
        'Then everything fell apart: December 22nd. Three days before Christmas. Phone rang. Agency. "Trial period didn\'t work out."',
        'What did I actually do? Started rebuild #4. When you have nothing left to protect, you stop protecting. You just build.',
        'The difference between abandoned projects and shipped products isn\'t talent. It\'s showing up when it\'s no longer fun.',
      ],
    },
    {
      id: 'post2',
      date: '2024-12-31',
      originalLang: 'English',
      title: lang === 'pl'
        ? '365 dni. Jedno pytanie: Zacząłeś czy dalej planujesz?'
        : '365 days. One question: Did you start or are you still planning?',
      preview: lang === 'pl'
        ? 'Rok się kończy. Zbudowałeś coś prawdziwego, czy tylko dodałeś kolejny rok do "planowałem..."?'
        : 'Year is ending. Did you build something real, or just add another year to "I was planning to..."?',
      content: lang === 'pl' ? [
        'Dla mnie 2025 to był rok, w którym w końcu przestałem czekać. 5-6 miesięcy temu coś kliknęło.',
        'Koniec z "zacznę, jak będę miał lepszy sprzęt". Koniec z "zbuduję to, jak będę miał więcej czasu". Po prostu: otworzyć laptopa po zmianie w magazynie. Kodować. Powtórzyć.',
        'Różnica między ludźmi, którzy wysyłają, a ludźmi, którzy planują? Zaczęli w losowy wtorek i nie przestali.',
        '2026: Rok, w którym przestajemy planować i zaczynamy wysyłać.',
      ] : [
        'For me, 2025 was the year I finally stopped waiting. 5-6 months ago something clicked.',
        'No more "I\'ll start when I have better hardware." No more "I\'ll build it when I have more time." Just: open laptop after warehouse shift. Code. Repeat.',
        'The difference between people who ship and people who plan? They started on a random Tuesday and didn\'t stop.',
        '2026: The year we stop planning and start shipping.',
      ],
    },
    {
      id: 'post3',
      date: '2024-12-22',
      originalLang: 'English',
      title: lang === 'pl'
        ? '22 grudnia. Straciłem pracę w Holandii.'
        : 'December 22nd. Lost my job in the Netherlands.',
      preview: lang === 'pl'
        ? 'Miesięczny okres próbny przez agencję. Nie wyszło. Święta z dala od rodziny i psów.'
        : 'Month trial through agency. Didn\'t work out. Christmas away from family and dogs.',
      content: lang === 'pl' ? [
        'Miesięczny okres próbny przez agencję. Nie wyszło. Zdarza się. Święta w mieszkaniu agencyjnym, z dala od rodziny, z dala od moich psów.',
        'Za dnia: Kompletacja zamówień w magazynach. Nocą: Budowanie PC_Workman i mojego portfolio HCK_Labs.',
        'Nauczyłem się, że nikt nie przyjdzie cię ratować. Twój rozwój, twoje możliwości, twoja przyszłość - to zależy od ciebie.',
        'Nauczyłem się, że ostatnią ścianą do sukcesu są ludzie. Każdy projekt, który wcześniej zbudowałem, kończyłem go, publikowałem i... cisza. I rzucałem. Dokładnie przy ostatniej ścianie.',
        'Nauczyłem się, że ograniczenia to nie przeszkody - to filtry. Oddzielają tych, którzy tego chcą, od tych, którzy tego potrzebują.',
        '2025 nauczył mnie odporności. 2026 przetestuje wykonanie.',
      ] : [
        'Month trial through agency. Didn\'t work out. It happens. Christmas in agency housing, away from family, away from my dogs.',
        'Day shift: Order picking in warehouses. Night shift: Building PC_Workman and my HCK_Labs portfolio.',
        'I learned that nobody is coming to save you. Your growth, your opportunities, your future - it\'s on you.',
        'I learned the last wall to success is people. Every project I built before, I\'d finish it, post it and... silence. And I\'d quit. Right at that last wall.',
        'I learned that constraints aren\'t obstacles - they\'re filters. They separate those who want it from those who need it.',
        '2025 taught me resilience. 2026 tests execution.',
      ],
    },
    {
      id: 'post4',
      date: '2024-12-20',
      originalLang: 'English',
      title: lang === 'pl' ? 'Sprawdzian rzeczywistości' : 'Reality Check',
      preview: lang === 'pl'
        ? 'Wszyscy widzą sukcesy. Nikt nie widzi harówki. Tak naprawdę wyglądało 4,5 miesiąca budowania.'
        : 'Everyone sees the wins. Nobody sees the grind. What 4.5 months of building actually looked like.',
      content: lang === 'pl' ? [
        'Media społecznościowe pokazują wypolerowane screenshoty. Czyste dema. Rzeczywistość? Bardziej bałaganiarsko.',
        'Co się faktycznie dzieje: 6 różnych podejść do monitorowania GPU. 5 całkowicie zawiodło. 2 tygodnie budowania automatycznej kontroli wentylatorów. Wyrzucone.',
        'Statystyki, których nie widzisz: 29 funkcji zabitych przed wysyłką. 15 000 linii kodu usuniętych. 340+ filiżanek kawy. 94°C szczyt laptopa.',
        '90% developmentu to niewidoczna praca. To nie syndrom oszusta. To rzemiosło.',
        'Różnica między porzuconymi projektami a wysłanymi produktami? Nie talent. Pojawienie się, gdy już nie jest fajnie.',
      ] : [
        'Social media shows polished screenshots. Clean demos. Reality? Messier.',
        'What actually happens: 6 different approaches to GPU monitoring. 5 completely failed. 2 weeks building automatic fan control. Thrown out.',
        'Stats you don\'t see: 29 features killed before shipping. 15,000 lines of code deleted. 340+ cups of coffee. 94°C laptop peak.',
        '90% of development is invisible work. This isn\'t imposter syndrome. This is craft.',
        'The difference between abandoned projects and shipped products? Not talent. Showing up when it\'s no longer fun.',
      ],
    },
    {
      id: 'post5',
      date: '2024-12-15',
      originalLang: 'English',
      title: lang === 'pl'
        ? 'Buduję PC_Workman na laptopie z 2014 roku osiągającym 90°C'
        : 'Building PC_Workman on a 2014 laptop hitting 90°C',
      preview: lang === 'pl'
        ? 'Większość ludzi by zmieniła maszynę. Ja używam tego jako badania rynku.'
        : 'Most people would change machines. I\'m using it as market research.',
      content: lang === 'pl' ? [
        'Buduję PC_Workman na laptopie z 2014 roku, który osiąga 90°C tylko przy nagrywaniu. Większość ludzi by zmieniła maszynę.',
        'Co zostało zbudowane: Pełna diagnostyka i monitoring zdrowia. Mapa 2D systemu ze sprawdzaniem kompatybilności. Niestandardowe krzywe wentylatorów z AI-wspomaganym tuningiem.',
        'Wychowałem się na MSI Afterburner. Zbudowałem swój pierwszy zestaw około 14 roku życia z Abit NF7-S i przyzwoitym ATI Radeon.',
        'Co powinno faktycznie zawierać nowoczesne narzędzie do monitorowania PC? Co cię frustruje? Czego brakuje?',
      ] : [
        'Building PC_Workman on a 2014 laptop hitting 90°C just from recording. Most people would change machines.',
        'What\'s been built: Full diagnostics and health monitoring. 2D system map with compatibility checking. Custom fan curves with AI-powered tuning.',
        'I grew up on MSI Afterburner. Built my first rig around 14 years old with Abit NF7-S and a decent ATI Radeon.',
        'What should a modern PC monitoring tool actually have? What frustrates you? What\'s missing?',
      ],
    },
    {
      id: 'post6',
      date: '2024-11-25',
      originalLang: 'English',
      title: lang === 'pl'
        ? 'Kilka godzin. Jeden pomysł. Wszystko się zmieniło.'
        : 'A few hours. One idea. Everything changed.',
      preview: lang === 'pl'
        ? 'A gdyby PC_Workman miał dwie różne twarze? Jedna minimalistyczna. Druga... epicka.'
        : 'What if PC_Workman had two different faces? One minimal. The other... epic.',
      content: lang === 'pl' ? [
        'Wczoraj pracowałem na starym laptopie z pękniętym ekranem. Pisałem kod. Normalny dzień.',
        'A gdyby PC_Workman miał dwie różne twarze? Jedna minimalistyczna (do pracy w tle). Druga... epicka. Pełna kontrola. Zero kompromisów.',
        'Kilka godzin później patrzę na to co wyszło i myślę: to nie jest to samo narzędzie, które pisałem rano.',
        'Nauczyłem się, że czasem najlepsze rozwiązania nie pochodzą z planowania. Pochodzą z eksperymentowania.',
      ] : [
        'Yesterday I was working on the old laptop with cracked screen. Writing code. Normal day.',
        'What if PC_Workman had two different faces? One minimal (for background work). The other... epic. Full control. No compromises.',
        'A few hours later I\'m looking at what came out and thinking: this isn\'t the same tool I was writing in the morning.',
        'I learned that sometimes the best solutions don\'t come from planning. They come from experimenting.',
      ],
    },
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/marcin-firmuga' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/hck-labs' },
    { name: 'Twitter/X', icon: Twitter, url: 'https://twitter.com/hck_labs' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            {t.backHome}
          </button>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-500" />
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{t.myStory}</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 py-20 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${darkMode ? 'bg-amber-500/10' : 'bg-amber-500/5'}`} />
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl ${darkMode ? 'bg-cyan-500/10' : 'bg-cyan-500/5'}`} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* HCK Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 bg-gradient-to-br from-amber-400 to-cyan-500">
            <span className="text-2xl font-black text-slate-900">HCK</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-cyan-500 bg-clip-text text-transparent">
              {t.heroTitle}
            </span>
          </h1>

          <p className={`text-xl md:text-2xl mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.heroSubtitle}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {[
              { value: '680+', label: lang === 'pl' ? 'Godzin kodu' : 'Hours of code' },
              { value: '94°C', label: lang === 'pl' ? 'Max temp laptopa' : 'Max laptop temp' },
              { value: '4', label: lang === 'pl' ? 'Przebudowy' : 'Rebuilds' },
              { value: '24k', label: lang === 'pl' ? 'Linii kodu' : 'Lines of code' },
            ].map((stat, i) => (
              <div key={i} className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-3">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-xl transition-all ${darkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className={`px-6 py-16 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">{t.featured}</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{t.featured}</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t.featuredDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPosts.map((post, i) => (
              <div
                key={i}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] ${darkMode ? 'bg-slate-800 border-slate-700 hover:border-amber-500/50' : 'bg-white border-slate-200 hover:border-amber-500/50'}`}
              >
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}`}>
                  {post.platform}
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">{post.title}</h3>
                <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {post.excerpt}
                </p>
                <div className={`text-xs flex items-center gap-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  <Calendar className="w-3 h-3" />
                  {post.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">{t.timeline}</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>{t.timelineDesc}</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

            <div className="space-y-6">
              {timelinePosts.map((post) => (
                <div key={post.id} className="relative pl-16">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 top-6 w-4 h-4 rounded-full border-4 ${darkMode ? 'bg-slate-950 border-amber-500' : 'bg-white border-amber-500'}`} />

                  <div className={`p-6 rounded-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-cyan-500 flex items-center justify-center">
                        <span className="text-xs font-black text-slate-900">HCK</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold bg-gradient-to-r from-amber-400 to-cyan-500 bg-clip-text text-transparent">
                          HCK_Labs
                        </div>
                        <div className={`text-xs flex items-center gap-2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{t.originally}: {post.originalLang}</span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className={`h-px mb-4 ${darkMode ? 'bg-gradient-to-r from-transparent via-amber-500/30 to-transparent' : 'bg-gradient-to-r from-transparent via-amber-500/20 to-transparent'}`} />

                    {/* Content */}
                    <h3 className="text-lg font-bold mb-3">{post.title}</h3>
                    <p className={`mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{post.preview}</p>

                    {/* Expanded content */}
                    {expandedPosts[post.id] && (
                      <div className={`mb-4 p-4 rounded-xl border-l-4 border-amber-500 ${darkMode ? 'bg-amber-500/5' : 'bg-amber-50'}`}>
                        {post.content.map((paragraph, i) => (
                          <p key={i} className={`mb-3 last:mb-0 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Expand button */}
                    <button
                      onClick={() => togglePost(post.id)}
                      className={`w-full py-2 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        darkMode
                          ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                          : 'border-amber-500/30 text-amber-600 hover:bg-amber-50'
                      }`}
                    >
                      <span>{expandedPosts[post.id] ? t.collapse : t.expand}</span>
                      {expandedPosts[post.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`px-6 py-16 ${darkMode ? 'bg-gradient-to-br from-amber-900/30 to-cyan-900/30' : 'bg-gradient-to-br from-amber-100 to-cyan-100'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br from-amber-400 to-cyan-500">
            <Heart className="w-8 h-8 text-slate-900" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            {lang === 'pl' ? 'Dziękuję za obserwowanie tej drogi!' : 'Thanks for following this journey!'}
          </h2>
          <p className={`text-lg mb-8 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {lang === 'pl'
              ? 'Jeśli budujesz coś w samotności i wydaje ci się wolne - to nie porażka. To proces.'
              : 'If you\'re building something alone and it feels slow - it\'s not failure. It\'s process.'}
          </p>
          <a
            href="#/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-cyan-500 text-slate-900 rounded-xl font-semibold text-lg hover:opacity-90 transition-all"
          >
            <span>{lang === 'pl' ? 'Porozmawiajmy' : 'Let\'s Talk'}</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default StoryPage;
