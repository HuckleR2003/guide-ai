import React, { useState, useEffect } from 'react';
import { Check, ChevronLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function EarlyAccess() {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('pro');
  const [billing, setBilling] = useState('yearly');
  const [submitted, setSubmitted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDark = localStorage.getItem('guideai-dark');
    if (savedDark === 'true') setDarkMode(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      const planName = plan === 'pro' ? 'Pro' : 'Business';
      const billingType = billing === 'yearly' ? 'Yearly' : 'Monthly';
      window.location.href = `mailto:hcklabs.dev@gmail.com?subject=GuideAI ${planName} - ${billingType}&body=Hi! I want to subscribe to GuideAI ${planName} (${billingType}).%0A%0AEmail: ${email}`;
      setSubmitted(true);
    }
  };

  const plans = {
    pro: {
      name: 'Pro',
      desc: 'For small teams & landlords',
      monthlyPrice: 12,
      yearlyPrice: 9,
      features: [
        '10 devices',
        '1,000 queries/mo',
        'Dynamic QR codes',
        'Basic analytics',
        'Email support',
      ],
    },
    business: {
      name: 'Business',
      desc: 'For agencies & enterprises',
      monthlyPrice: 39,
      yearlyPrice: 29,
      features: [
        'Unlimited devices',
        '10,000 queries/mo',
        'White-label branding',
        'Advanced analytics',
        'API access',
        'Priority support',
        'Custom integrations',
      ],
    },
  };

  const selectedPlan = plans[plan];
  const price = billing === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
  const savings = billing === 'yearly' ? Math.round((1 - selectedPlan.yearlyPrice / selectedPlan.monthlyPrice) * 100) : 0;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Nav */}
      <nav className={`sticky top-0 z-50 px-4 py-3 border-b backdrop-blur-sm ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className={`flex items-center gap-1.5 text-sm font-medium ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
            <ChevronLeft className="w-4 h-4" />
            Back
          </a>
          <div className="flex items-center gap-1.5">
            <div className={`w-4 h-4 grid grid-cols-4 grid-rows-4 gap-[1px] p-[2px] border rounded ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
              {[1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1].map((f, i) => (
                <div key={i} className={`${f ? (darkMode ? 'bg-white' : 'bg-slate-700') : ''} rounded-[1px]`} />
              ))}
            </div>
            <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Guide<span className="text-blue-500">AI</span>
              <span className={`ml-1.5 text-xs font-normal px-1.5 py-0.5 rounded ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>Pro</span>
            </span>
          </div>
          <div className="w-12" />
        </div>
      </nav>

      <main className="px-4 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
            <Sparkles className="w-3 h-3" />
            Early access · 40% off launch pricing
          </div>
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Turn manuals into conversations
          </h1>
          <p className={`text-sm max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Your customers scan. AI answers. You sleep.
          </p>
        </div>

        {submitted ? (
          <div className={`max-w-md mx-auto p-6 rounded-xl text-center ${darkMode ? 'bg-green-900/30 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h2 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>You're in!</h2>
            <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
              Check your email for payment link and setup instructions.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-5 gap-6">
            {/* Left: Plan Selection */}
            <div className="md:col-span-3 space-y-4">
              {/* Billing Toggle */}
              <div className={`flex items-center justify-center gap-1 p-1 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}>
                <button
                  onClick={() => setBilling('monthly')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${billing === 'monthly' ? (darkMode ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white') : (darkMode ? 'text-slate-400' : 'text-slate-600')}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBilling('yearly')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${billing === 'yearly' ? (darkMode ? 'bg-slate-700 text-white' : 'bg-slate-900 text-white') : (darkMode ? 'text-slate-400' : 'text-slate-600')}`}
                >
                  Yearly
                  <span className={`text-xs px-1.5 py-0.5 rounded ${billing === 'yearly' ? 'bg-green-500 text-white' : (darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')}`}>-25%</span>
                </button>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(plans).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => setPlan(key)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      plan === key
                        ? (darkMode ? 'bg-blue-600 ring-2 ring-blue-500' : 'bg-blue-600 ring-2 ring-blue-500')
                        : (darkMode ? 'bg-slate-800 hover:bg-slate-750 border border-slate-700' : 'bg-white hover:bg-slate-50 border border-slate-200')
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`font-semibold ${plan === key ? 'text-white' : (darkMode ? 'text-white' : 'text-slate-900')}`}>{p.name}</h3>
                        <p className={`text-xs ${plan === key ? 'text-blue-200' : (darkMode ? 'text-slate-500' : 'text-slate-500')}`}>{p.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${plan === key ? 'border-white bg-white' : (darkMode ? 'border-slate-600' : 'border-slate-300')}`}>
                        {plan === key && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold ${plan === key ? 'text-white' : (darkMode ? 'text-white' : 'text-slate-900')}`}>
                        ${billing === 'yearly' ? p.yearlyPrice : p.monthlyPrice}
                      </span>
                      <span className={`text-sm ${plan === key ? 'text-blue-200' : (darkMode ? 'text-slate-500' : 'text-slate-500')}`}>/mo</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Features */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}>
                <h4 className={`text-xs font-semibold uppercase tracking-wide mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  What's included
                </h4>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {selectedPlan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Checkout */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className={`p-5 rounded-xl sticky top-20 ${darkMode ? 'bg-slate-800' : 'bg-white border border-slate-200 shadow-lg'}`}>
                <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Complete your order</h3>

                {/* Summary */}
                <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {selectedPlan.name} ({billing})
                    </span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>${price}/mo</span>
                  </div>
                  {billing === 'yearly' && (
                    <div className="flex justify-between items-center">
                      <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Annual savings</span>
                      <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        ${(selectedPlan.monthlyPrice - selectedPlan.yearlyPrice) * 12}/yr
                      </span>
                    </div>
                  )}
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label className={`block text-xs font-medium mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Work email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className={`w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? 'bg-slate-700 border border-slate-600 text-white placeholder-slate-500'
                        : 'bg-white border border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className={`text-xs text-center mt-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  7-day free trial · Cancel anytime
                </p>
              </form>
            </div>
          </div>
        )}

        {/* Trust */}
        <div className={`mt-10 pt-6 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>500+</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>devices connected</div>
            </div>
            <div className={`w-px h-8 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>4.9/5</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>user rating</div>
            </div>
            <div className={`w-px h-8 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>&lt;3s</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>avg response</div>
            </div>
            <div className={`w-px h-8 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
            <div>
              <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>99.9%</div>
              <div className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>uptime SLA</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className={`mt-8 p-5 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}>
          <h3 className={`font-semibold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Common questions</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className={`font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>How does the free trial work?</h4>
              <p className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Full access for 7 days. No credit card required. If you don't subscribe, your account pauses automatically.</p>
            </div>
            <div>
              <h4 className={`font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Can I change plans later?</h4>
              <p className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Yes. Upgrade or downgrade anytime from your dashboard. Changes apply immediately with prorated billing.</p>
            </div>
            <div>
              <h4 className={`font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>What counts as a "query"?</h4>
              <p className={darkMode ? 'text-slate-500' : 'text-slate-500'}>Each question a customer asks your AI assistant. Follow-up messages in the same session count as one query.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`px-4 py-4 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
          <span className={darkMode ? 'text-slate-500' : 'text-slate-400'}>© 2026 HCK_Labs</span>
          <div className={`flex gap-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="mailto:hcklabs.dev@gmail.com" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
