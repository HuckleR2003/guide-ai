import { ChevronLeft, Sparkles, Target, Users, Zap, Heart, Globe, Rocket, Code, Building2, Package, Moon, Coffee, Clock, Laptop, Star, ArrowRight } from 'lucide-react';

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

  // Founder's story milestones with icons
  const storyMilestones = [
    {
      icon: Package,
      title: 'Day Shift',
      description: 'Order picker in Dutch warehouses. 15-20km walking daily between shelves.',
      accent: 'from-amber-500 to-orange-500',
    },
    {
      icon: Moon,
      title: 'Night Shift',
      description: 'Coding on a 2014 laptop hitting 94°C. Building what would become GuideAI.',
      accent: 'from-indigo-500 to-purple-500',
    },
    {
      icon: Coffee,
      title: '340+ Coffees',
      description: '680+ hours of code. 4 complete rebuilds. Zero shortcuts.',
      accent: 'from-amber-600 to-amber-700',
    },
    {
      icon: Rocket,
      title: 'The Launch',
      description: 'From warehouse floor to product launch. Same determination, different tools.',
      accent: 'from-blue-500 to-cyan-500',
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FOUNDER'S AUTHENTIC STORY SECTION */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className={`px-6 py-20 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">The Real Story</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built by someone who{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                actually uses it
              </span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              No Silicon Valley story here. Just a warehouse worker who got tired of watching people struggle with manuals.
            </p>
          </div>

          {/* Two column layout */}
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Left: Visual/Photo */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* Main card with gradient */}
                <div className={`aspect-[4/5] rounded-3xl overflow-hidden ${darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 to-slate-200'}`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    {/* Logo/Avatar */}
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-xl">
                      <span className="text-3xl font-black text-white">HCK</span>
                    </div>

                    <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Marcin</h3>
                    <p className={`text-sm mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Founder & Builder</p>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800/50' : 'bg-white/80'}`}>
                        <div className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">680+</div>
                        <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Hours of code</div>
                      </div>
                      <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800/50' : 'bg-white/80'}`}>
                        <div className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">94°C</div>
                        <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Laptop peak</div>
                      </div>
                    </div>

                    {/* Location badge */}
                    <div className={`mt-6 flex items-center gap-2 px-3 py-1.5 rounded-full ${darkMode ? 'bg-slate-800/50' : 'bg-white/80'}`}>
                      <Globe className="w-3.5 h-3.5 text-blue-500" />
                      <span className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Poland → Netherlands → Building</span>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl -z-10 opacity-40 blur-sm" />
                <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl -z-10 opacity-30 blur-sm" />
              </div>
            </div>

            {/* Right: Story content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Quote */}
              <div className={`relative p-6 rounded-2xl ${darkMode ? 'bg-slate-800/50' : 'bg-white'} border-l-4 border-amber-500`}>
                <div className="absolute -top-3 -left-2 text-5xl text-amber-500/30 font-serif">"</div>
                <p className={`text-lg italic ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  I spent years watching people flip through 200-page manuals while expensive machines sat idle.
                  The solution wasn't a better manual—it was letting people just <em>ask</em>.
                </p>
              </div>

              {/* Story milestones */}
              <div className="grid sm:grid-cols-2 gap-4">
                {storyMilestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-2xl transition-all hover:scale-[1.02] ${darkMode ? 'bg-slate-800/30 hover:bg-slate-800/50' : 'bg-white hover:shadow-lg'}`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${milestone.accent} flex items-center justify-center mb-3`}>
                      <milestone.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{milestone.title}</h4>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{milestone.description}</p>
                  </div>
                ))}
              </div>

              {/* The honest truth */}
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-100'}`}>
                <h4 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  <Star className="w-4 h-4" />
                  The honest truth
                </h4>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-blue-300/80' : 'text-blue-600'}`}>
                  I'm not a Stanford dropout. I didn't raise millions. I built GuideAI because I was frustrated—
                  frustrated watching coworkers waste hours on problems that a simple "ask the manual" could solve.
                  This is a tool built by someone who's actually stood on a warehouse floor at 3 AM wondering
                  why the forklift won't start.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#/story"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium text-sm hover:opacity-90 transition-all"
                >
                  Read the full journey
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="mailto:firmuga.marcin.s@gmail.com"
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                >
                  Get in touch
                </a>
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
