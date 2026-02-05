import { ChevronLeft, Shield, Lock, FileText, Scale, Globe, CreditCard, Users, AlertCircle } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// TERMS OF SERVICE
// ═══════════════════════════════════════════════════════════════
export const TermsOfService = ({ darkMode = false }) => {
  const handleBack = () => {
    window.location.hash = '';
  };

  const sections = [
    {
      icon: FileText,
      title: 'Acceptance of Terms',
      content: `By accessing or using GuideAI ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.

The Service is operated by HCK_Labs. These terms apply to all visitors, users, and others who access or use the Service.`
    },
    {
      icon: Users,
      title: 'User Responsibilities',
      content: `As a user of GuideAI, you agree to:

• Provide accurate and complete information when creating an account
• Maintain the security of your account credentials
• Not share your account with unauthorized users
• Use the Service only for lawful purposes
• Not upload malicious content, malware, or copyrighted material without authorization
• Not attempt to reverse engineer, hack, or disrupt the Service
• Comply with all applicable local, state, national, and international laws`
    },
    {
      icon: Scale,
      title: 'Data Processing',
      content: `GuideAI processes data to provide our Service:

• **PDF Processing**: Uploaded manuals are processed to extract text for AI analysis. Files are stored securely and associated with your account.
• **AI Interactions**: Conversations with the AI assistant are processed in real-time and may be stored to improve service quality.
• **Analytics**: We collect usage data (scan counts, device interactions) to provide insights and improve our Service.
• **Third-Party Services**: We use Supabase for data storage, Groq for AI processing, and Stripe for payments.

You retain ownership of all content you upload. By using the Service, you grant us a license to process this content to provide our services.`
    },
    {
      icon: CreditCard,
      title: 'Payments & Refund Policy',
      content: `**Subscription Plans:**
• Free Plan: Limited features, 1 device slot
• Pro Plan: $9/month (billed annually), 10 device slots
• Business Plan: $20/month (billed annually), unlimited devices

**Billing:**
• Subscriptions are billed in advance on a monthly or annual basis
• All fees are non-refundable except as required by law

**Refund Policy:**
• 7-day money-back guarantee for new subscriptions
• Refund requests must be submitted within 7 days of initial purchase
• Refunds are processed within 5-10 business days
• No refunds for partial subscription periods or after the 7-day period
• Contact support@guideai.app for refund requests`
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: `The Service is provided "as is" without warranties of any kind, either express or implied.

HCK_Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:
• Your use or inability to use the Service
• Any unauthorized access to or alteration of your data
• Any third-party content or conduct on the Service
• Any interruption or cessation of the Service

Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim.`
    },
    {
      icon: Shield,
      title: 'Termination',
      content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including:

• Breach of these Terms
• Fraudulent, abusive, or illegal activity
• Non-payment of fees

Upon termination:
• Your right to use the Service will immediately cease
• You may request export of your data within 30 days
• We may delete your data after 90 days of account termination`
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-500" />
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Terms of Service</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
            <Scale className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Last updated: February 2026
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <section.icon className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <div className={`prose prose-sm max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                {section.content.split('\n').map((paragraph, i) => (
                  <p key={i} className={`whitespace-pre-line ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className={`mt-12 p-6 rounded-2xl text-center ${darkMode ? 'bg-slate-800' : 'bg-blue-50'}`}>
          <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
            Questions about our Terms? Contact us at{' '}
            <a href="mailto:firmuga.marcin.s@gmail.com" className="text-blue-500 hover:underline font-medium">
              firmuga.marcin.s@gmail.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// PRIVACY POLICY
// ═══════════════════════════════════════════════════════════════
export const PrivacyPolicy = ({ darkMode = false }) => {
  const handleBack = () => {
    window.location.hash = '';
  };

  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: `We collect information to provide and improve our Service:

**Account Information:**
• Email address (required for account creation)
• Full name (optional, from Google OAuth)
• Profile picture (optional, from Google OAuth)

**Usage Data:**
• Device information (browser type, operating system)
• IP address and general location
• Pages visited and features used
• Scan counts and interaction metrics

**Content Data:**
• PDF manuals you upload
• Device configurations you create
• Chat conversations with the AI assistant`
    },
    {
      icon: Lock,
      title: 'How We Use Your Data',
      content: `Your data is used to:

• **Provide the Service**: Process your manuals, generate QR codes, and power AI conversations
• **Improve the Service**: Analyze usage patterns to enhance features and performance
• **Communicate**: Send important updates, security alerts, and (with consent) marketing emails
• **Support**: Respond to your inquiries and provide customer support
• **Billing**: Process payments and manage subscriptions
• **Legal Compliance**: Meet our legal obligations and enforce our terms`
    },
    {
      icon: Shield,
      title: 'Data Protection & Security',
      content: `We implement industry-standard security measures:

• **Encryption**: All data is encrypted in transit (TLS 1.3) and at rest (AES-256)
• **Access Control**: Strict access controls limit who can access your data
• **Infrastructure**: We use Supabase (SOC 2 Type II certified) for data storage
• **Authentication**: Secure OAuth 2.0 and email/password authentication
• **Regular Audits**: We conduct regular security assessments

We retain your data for as long as your account is active. Upon account deletion, your data is permanently removed within 90 days.`
    },
    {
      icon: Globe,
      title: 'GDPR Compliance',
      content: `If you are in the European Economic Area (EEA), you have the following rights:

• **Right to Access**: Request a copy of your personal data
• **Right to Rectification**: Correct inaccurate personal data
• **Right to Erasure**: Request deletion of your personal data ("right to be forgotten")
• **Right to Restrict Processing**: Limit how we use your data
• **Right to Data Portability**: Receive your data in a portable format
• **Right to Object**: Object to processing of your personal data
• **Right to Withdraw Consent**: Withdraw consent at any time

To exercise these rights, contact our Data Protection Officer at firmuga.marcin.s@gmail.com. We will respond within 30 days.

**Legal Basis for Processing:**
• Contract performance (providing our Service)
• Legitimate interests (improving our Service, fraud prevention)
• Consent (marketing communications)
• Legal obligations (tax, accounting requirements)`
    },
    {
      icon: Users,
      title: 'Third-Party Services',
      content: `We share data with trusted third parties to provide our Service:

• **Supabase** (Database & Authentication): Stores your account and content data
• **Groq** (AI Processing): Processes your queries (no personal data stored)
• **Stripe** (Payments): Handles payment processing (PCI DSS compliant)
• **Google** (OAuth): Provides authentication services
• **Vercel** (Hosting): Hosts our application

These providers are contractually bound to protect your data and use it only for the services they provide to us.`
    },
    {
      icon: CreditCard,
      title: 'Cookies & Tracking',
      content: `We use cookies and similar technologies:

**Essential Cookies:**
• Authentication tokens (required for login)
• Session management
• Security features

**Analytics Cookies:**
• Usage statistics (anonymized)
• Performance monitoring

**Preferences:**
• Language settings
• Theme preferences (dark/light mode)

You can manage cookie preferences in your browser settings. Note that disabling essential cookies may affect Service functionality.`
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-500" />
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Privacy Policy</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
            <Lock className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Last updated: February 2026
          </p>
          <p className={`mt-4 max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Your privacy is important to us. This policy explains how GuideAI collects, uses, and protects your personal information.
          </p>
        </div>

        {/* GDPR Badge */}
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-4 ${darkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
            <Shield className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>GDPR Compliant</p>
            <p className={`text-sm ${darkMode ? 'text-green-400/70' : 'text-green-600'}`}>
              We comply with EU General Data Protection Regulation requirements
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                  <section.icon className="w-5 h-5 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
              </div>
              <div className={`prose prose-sm max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                {section.content.split('\n').map((paragraph, i) => (
                  <p key={i} className={`whitespace-pre-line ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact DPO */}
        <div className={`mt-12 p-6 rounded-2xl text-center ${darkMode ? 'bg-slate-800' : 'bg-green-50'}`}>
          <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Data Protection Officer
          </h3>
          <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
            For privacy-related inquiries or to exercise your GDPR rights, contact us at{' '}
            <a href="mailto:firmuga.marcin.s@gmail.com" className="text-green-500 hover:underline font-medium">
              firmuga.marcin.s@gmail.com
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default { TermsOfService, PrivacyPolicy };
