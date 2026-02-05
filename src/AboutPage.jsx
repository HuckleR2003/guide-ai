import { ChevronLeft, Sparkles, Target, Users, Zap, Heart, Globe, Rocket, Code, Building2 } from 'lucide-react';

const AboutPage = ({ darkMode = false }) => {
  const handleBack = () => {
    window.location.hash = '';
  };

  const values = [
    {
      icon: Sparkles,
      title: 'Simplicity First',
      description: 'Technology should simplify life, not complicate it. We build tools that anyone can use.',
    },
    {
      icon: Target,
      title: 'User-Centric',
      description: 'Every feature we build starts with a real problem faced by real people.',
    },
    {
      icon: Heart,
      title: 'Accessibility',
      description: 'Knowledge should be accessible to everyone, regardless of technical expertise.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI to transform static documents into dynamic experiences.',
    },
  ];

  const timeline = [
    {
      year: '2023',
      title: 'The Problem',
      description: 'Working in logistics, Marcin noticed how often employees struggled with equipment manuals. Paper instructions were lost, outdated, or simply ignored.',
    },
    {
      year: '2024',
      title: 'The Idea',
      description: 'What if every device could have its own AI assistant? A simple QR scan could connect anyone to instant, intelligent help.',
    },
    {
      year: '2025',
      title: 'HCK_Labs Born',
      description: 'HCK_Labs was founded to turn this vision into reality. The first prototype of GuideAI was built and tested with early adopters.',
    },
    {
      year: '2026',
      title: 'GuideAI Launch',
      description: 'After months of refinement and real-world testing, GuideAI is ready to transform how the world interacts with product knowledge.',
    },
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
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>About Us</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Turning Paper Manuals into{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Digital Conversations
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            GuideAI was born from a simple observation: people don't read manuals,
            but they do ask questions. We're bridging that gap with AI.
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className={`px-6 py-16 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Photo Placeholder */}
            <div className="relative">
              <div className={`aspect-square rounded-3xl overflow-hidden ${darkMode ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                      <Code className="w-16 h-16" />
                    </div>
                    <p className="text-2xl font-bold">Marcin</p>
                    <p className="text-white/80">Founder & CEO</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl -z-10 opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl -z-10 opacity-30" />
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Meet the Founder</h2>
              <div className={`space-y-4 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <p>
                  <strong className={darkMode ? 'text-white' : 'text-slate-900'}>Marcin</strong> is a technology entrepreneur
                  with deep roots in logistics and operations. After years of watching teams struggle with
                  complex equipment manuals, he knew there had to be a better way.
                </p>
                <p>
                  "In warehouses and factories, I saw the same pattern everywhere: expensive machinery
                  sitting idle because operators couldn't quickly find the information they needed.
                  Manuals were collecting dust while support tickets piled up."
                </p>
                <p>
                  This frustration led to the creation of <strong className={darkMode ? 'text-white' : 'text-slate-900'}>HCK_Labs</strong>,
                  a technology studio focused on practical AI solutions. GuideAI is the flagship product —
                  a platform that transforms static PDFs into intelligent, conversational assistants.
                </p>
                <p>
                  "Our mission is simple: make product knowledge instantly accessible to anyone,
                  anywhere, through a simple QR scan."
                </p>
              </div>

              {/* Social/Contact */}
              <div className="mt-8 flex items-center gap-4">
                <a
                  href="mailto:firmuga.marcin.s@gmail.com"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  Get in Touch
                </a>
                <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  Based in Poland
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              From observation to innovation
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className={`absolute left-8 top-0 bottom-0 w-0.5 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex gap-6">
                  {/* Year bubble */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white z-10 ${
                    index === timeline.length - 1
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                      : darkMode ? 'bg-slate-700' : 'bg-slate-300 text-slate-700'
                  }`}>
                    {item.year.slice(2)}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 p-6 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`px-6 py-16 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
              The principles that guide everything we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl border transition-all hover:shadow-lg ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <value.icon className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HCK_Labs Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <Building2 className="w-10 h-10 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Built by HCK_Labs</h2>
          <p className={`text-lg max-w-2xl mx-auto mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            HCK_Labs is a technology studio creating practical AI solutions for everyday problems.
            We believe in building tools that work for people, not the other way around.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <Globe className="w-5 h-5 text-blue-500 inline mr-2" />
              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Poland-based</span>
            </div>
            <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <Rocket className="w-5 h-5 text-blue-500 inline mr-2" />
              <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>Founded 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`px-6 py-16 ${darkMode ? 'bg-gradient-to-br from-blue-900 to-indigo-900' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Manuals?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join hundreds of businesses already using GuideAI.
          </p>
          <a
            href="#/demo"
            onClick={(e) => {
              e.preventDefault();
              window.location.hash = '';
              setTimeout(() => {
                document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            Try GuideAI Free
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
