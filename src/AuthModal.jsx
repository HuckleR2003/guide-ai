import React, { useState } from 'react';
import { X, Mail, Lock, User, AlertCircle, Check, Loader2 } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, supabase } from './supabaseClient';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function AuthModal({ isOpen, onClose, darkMode = true, lang = 'en' }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const t = {
    login: lang === 'pl' ? 'Zaloguj się' : 'Sign in',
    register: lang === 'pl' ? 'Zarejestruj się' : 'Sign up',
    forgotPassword: lang === 'pl' ? 'Zapomniałeś hasła?' : 'Forgot password?',
    resetPassword: lang === 'pl' ? 'Resetuj hasło' : 'Reset password',
    email: lang === 'pl' ? 'Email' : 'Email',
    password: lang === 'pl' ? 'Hasło' : 'Password',
    confirmPassword: lang === 'pl' ? 'Potwierdź hasło' : 'Confirm password',
    continueWithGoogle: lang === 'pl' ? 'Kontynuuj z Google' : 'Continue with Google',
    or: lang === 'pl' ? 'lub' : 'or',
    noAccount: lang === 'pl' ? 'Nie masz konta?' : "Don't have an account?",
    haveAccount: lang === 'pl' ? 'Masz już konto?' : 'Already have an account?',
    backToLogin: lang === 'pl' ? 'Wróć do logowania' : 'Back to sign in',
    checkEmail: lang === 'pl' ? 'Sprawdź swoją skrzynkę email' : 'Check your email',
    passwordMismatch: lang === 'pl' ? 'Hasła nie są identyczne' : 'Passwords do not match',
    passwordTooShort: lang === 'pl' ? 'Hasło musi mieć min. 6 znaków' : 'Password must be at least 6 characters',
    welcomeBack: lang === 'pl' ? 'Witaj ponownie' : 'Welcome back',
    createAccount: lang === 'pl' ? 'Stwórz konto' : 'Create account',
    sendResetLink: lang === 'pl' ? 'Wyślij link resetujący' : 'Send reset link',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setError(t.passwordMismatch);
        return;
      }
      if (password.length < 6) {
        setError(t.passwordTooShort);
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        onClose();
      } else if (mode === 'register') {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        setSuccess(t.checkEmail);
      } else if (mode === 'forgot') {
        if (!supabase) throw new Error('Supabase not configured');
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSuccess(t.checkEmail);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const switchMode = (newMode) => {
    resetForm();
    setMode(newMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className={`relative w-full max-w-sm rounded-2xl p-6 shadow-2xl ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className={`w-6 h-6 grid grid-cols-4 grid-rows-4 gap-[1px] p-[2px] border rounded ${darkMode ? 'border-slate-600' : 'border-slate-300'}`}>
              {[1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1].map((f, i) => (
                <div key={i} className={`${f ? (darkMode ? 'bg-white' : 'bg-slate-700') : ''} rounded-[1px]`} />
              ))}
            </div>
            <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Guide<span className="text-blue-500">AI</span>
            </span>
          </div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {mode === 'login' && t.welcomeBack}
            {mode === 'register' && t.createAccount}
            {mode === 'forgot' && t.resetPassword}
          </h2>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Google Login */}
        {mode !== 'forgot' && (
          <>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                darkMode
                  ? 'bg-white text-slate-900 hover:bg-slate-100'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              } disabled:opacity-50`}
            >
              <GoogleIcon />
              {t.continueWithGoogle}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className={`flex-1 h-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
              <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{t.or}</span>
              <div className={`flex-1 h-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
            </div>
          </>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${
              darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
            }`}>
              <Mail className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.email}
                required
                className={`flex-1 bg-transparent text-sm focus:outline-none ${
                  darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Password */}
          {mode !== 'forgot' && (
            <div>
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${
                darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
              }`}>
                <Lock className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.password}
                  required
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${
                    darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Confirm Password (Register only) */}
          {mode === 'register' && (
            <div>
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${
                darkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-200'
              }`}>
                <Lock className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPassword}
                  required
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${
                    darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Forgot Password Link */}
          {mode === 'login' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className={`text-xs hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
              >
                {t.forgotPassword}
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === 'login' && t.login}
            {mode === 'register' && t.register}
            {mode === 'forgot' && t.sendResetLink}
          </button>
        </form>

        {/* Mode Switch */}
        <div className="mt-4 text-center">
          {mode === 'login' && (
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.noAccount}{' '}
              <button onClick={() => switchMode('register')} className="text-blue-500 hover:underline font-medium">
                {t.register}
              </button>
            </p>
          )}
          {mode === 'register' && (
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.haveAccount}{' '}
              <button onClick={() => switchMode('login')} className="text-blue-500 hover:underline font-medium">
                {t.login}
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button onClick={() => switchMode('login')} className={`text-sm hover:underline ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.backToLogin}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
