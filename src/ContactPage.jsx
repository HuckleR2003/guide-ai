import { useState } from 'react';
import { ChevronLeft, Mail, Send, MapPin, Clock, MessageSquare, Sparkles, Check, Loader2 } from 'lucide-react';

const ContactPage = ({ darkMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleBack = () => {
    window.location.hash = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Simulate sending (in production, connect to email service or Supabase function)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Open mailto link as fallback
    const mailtoLink = `mailto:firmuga.marcin.s@gmail.com?subject=${encodeURIComponent(`[GuideAI ${formData.subject}] From ${formData.name}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;

    setSending(false);
    setSent(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setSent(false);
      setFormData({ name: '', email: '', subject: 'general', message: '' });
    }, 3000);
  };

  const subjects = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'support', label: 'Technical Support' },
    { value: 'sales', label: 'Sales & Pricing' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'feedback', label: 'Feedback' },
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'firmuga.marcin.s@gmail.com',
      href: 'mailto:firmuga.marcin.s@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Poland, EU',
      href: null,
    },
    {
      icon: Clock,
      title: 'Response Time',
      value: 'Usually within 24 hours',
      href: null,
    },
  ];

  const faqs = [
    {
      q: 'How quickly will I get a response?',
      a: 'We typically respond within 24 hours on business days.',
    },
    {
      q: 'Do you offer phone support?',
      a: 'Currently, we provide support via email. Business plan customers get priority support.',
    },
    {
      q: 'Can I request a demo?',
      a: 'Yes! Use the contact form and select "Sales & Pricing" to schedule a personalized demo.',
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
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <span className={`font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Contact</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            We'd Love to{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              Hear From You
            </span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Have a question, feedback, or want to learn more about GuideAI?
            Drop us a message and we'll get back to you soon.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>

                {sent ? (
                  <div className={`p-8 rounded-2xl text-center ${darkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      Message Sent!
                    </h3>
                    <p className={darkMode ? 'text-green-400/70' : 'text-green-600'}>
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border transition-all ${
                            darkMode
                              ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                              : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                          } outline-none`}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-4 py-3 rounded-xl border transition-all ${
                            darkMode
                              ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                              : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                          } outline-none`}
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all ${
                          darkMode
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                            : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                        } outline-none`}
                      >
                        {subjects.map((subj) => (
                          <option key={subj.value} value={subj.value}>
                            {subj.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Message
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-all resize-none ${
                          darkMode
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500'
                            : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
                        } outline-none`}
                        placeholder="Tell us how we can help..."
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Info */}
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <info.icon className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                          {info.title}
                        </p>
                        {info.href ? (
                          <a
                            href={info.href}
                            className="font-medium text-blue-500 hover:underline"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                <h3 className="text-lg font-semibold mb-4">Quick Answers</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <p className="font-medium mb-1">{faq.q}</p>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              <div className={`p-6 rounded-2xl border-2 border-dashed ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="text-center">
                  <Clock className={`w-8 h-8 mx-auto mb-3 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    Support available
                  </p>
                  <p className="font-semibold">Monday - Friday</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    9:00 AM - 6:00 PM CET
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
