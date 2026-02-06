import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ChevronLeft, QrCode, MessageSquare, Trash2,
  Smartphone, Eye, Crown, AlertCircle, Plus, LogOut,
  Zap, Database, Sparkles, ExternalLink, Download, Copy, Check, Rocket
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { getDevices, deleteDevice, signOut, PLAN_LIMITS } from './supabaseClient';

// ═══════════════════════════════════════════════════════════════
// SKELETON COMPONENTS
// ═══════════════════════════════════════════════════════════════
const SkeletonCard = ({ darkMode }) => (
  <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`w-20 h-20 rounded-xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`w-12 h-5 rounded-full animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
    </div>
    <div className={`h-6 w-3/4 rounded-lg mb-2 animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
    <div className={`h-4 w-1/2 rounded-lg mb-4 animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
    <div className="flex gap-4 mb-4">
      <div className={`h-4 w-16 rounded animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`h-4 w-24 rounded animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
    </div>
    <div className="flex gap-2">
      <div className={`flex-1 h-10 rounded-xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`flex-1 h-10 rounded-xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`w-10 h-10 rounded-xl animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
    </div>
  </div>
);

const SkeletonStats = ({ darkMode }) => (
  <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
    <div className="flex justify-between items-center mb-3">
      <div className={`h-3 w-20 rounded animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className={`h-5 w-5 rounded animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
    </div>
    <div className={`h-8 w-16 rounded-lg animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE ILLUSTRATION
// ═══════════════════════════════════════════════════════════════
const EmptyStateIllustration = ({ darkMode }) => (
  <div className="relative w-40 h-40 mx-auto mb-8">
    {/* Floating elements */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`w-32 h-32 rounded-3xl rotate-6 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`} />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`w-32 h-32 rounded-3xl -rotate-6 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`} />
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className={`w-28 h-28 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
        <QrCode className="w-14 h-14 text-white/90" />
      </div>
    </div>
    {/* Floating sparkles */}
    <Sparkles className={`absolute -top-2 -right-2 w-6 h-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} animate-pulse`} />
    <Rocket className={`absolute -bottom-1 -left-1 w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-500'} animate-bounce`} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
// DEVICE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const DeviceCard = ({ device, darkMode, lang, t, onSelectQR, onOpenChat, onDelete, isDeleting, index }) => {
  const [copied, setCopied] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const deviceUrl = device.qr_url || `${window.location.origin}?device=${encodeURIComponent(`${device.device_name} ${device.device_model}`)}`;

  const handleCopyLink = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(deviceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`card-entrance group relative rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-blue-500/30 hover:shadow-blue-500/10' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-blue-500/10'}`}
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
          {t.live}
        </span>
      </div>

      {/* QR Code Preview with Hover Effect */}
      <div
        className="relative w-20 h-20 mb-4 cursor-pointer group/qr"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => onSelectQR(device)}
      >
        <div className={`absolute inset-0 bg-white p-2 rounded-xl shadow-lg transition-all duration-300 ${isHovering ? 'scale-110 shadow-xl' : ''}`}>
          <QRCodeSVG
            value={deviceUrl}
            size={64}
            level="M"
          />
        </div>
        {/* Copy Link Button (appears on hover) */}
        <button
          onClick={handleCopyLink}
          className={`absolute -bottom-2 -right-2 p-1.5 rounded-lg shadow-lg transition-all duration-200 ${
            isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          } ${copied
            ? 'bg-green-500 text-white'
            : darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Device Info */}
      <h3 className={`font-bold text-lg mb-1 truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
        {device.device_name}
      </h3>
      <p className={`text-sm mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
        {device.device_model}
      </p>

      {/* Quick Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Eye className={`w-4 h-4 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {device.scan_count || 0}
          </span>
        </div>
        <span className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
          {t.created} {formatDate(device.created_at)}
        </span>
      </div>

      {/* PDF Badge */}
      {device.pdf_content && (
        <div className="mb-4">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <Database className="w-3 h-3" />
            PDF loaded
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onSelectQR(device)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          <QrCode className="w-4 h-4" />
          QR
        </button>
        <button
          onClick={() => onOpenChat(device)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium transition-all hover:from-blue-500 hover:to-indigo-500"
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={() => onDelete(device.id)}
          disabled={isDeleting}
          className={`p-2.5 rounded-xl transition-all disabled:opacity-50 ${darkMode ? 'bg-slate-800 text-slate-500 hover:bg-red-500/20 hover:text-red-400' : 'bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500'}`}
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function Dashboard({ onOpenChat, lang = 'en', darkMode: propDarkMode }) {
  const {
    user,
    planType,
    isPro,
    initialized,
    displayName,
    avatarUrl,
    email
  } = useAuth();

  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const darkMode = propDarkMode !== undefined
    ? propDarkMode
    : (typeof window !== 'undefined' && localStorage.getItem('guideai-dark') === 'true');

  const t = {
    heyDear: lang === 'pl' ? 'Hej kochany' : 'Hey dear',
    welcome: lang === 'pl' ? 'Witaj ponownie' : 'Welcome back',
    myDevices: lang === 'pl' ? 'Twoje urządzenia' : 'Your devices',
    noDevices: lang === 'pl' ? 'Twoje biurko jest gotowe' : 'Your workspace is ready',
    addFirst: lang === 'pl' ? 'Załaduj pierwszą instrukcję, aby tchnąć w nią życie.' : 'Upload your first manual to bring it to life.',
    goToDemo: lang === 'pl' ? 'Stwórz pierwszego asystenta' : 'Create your first assistant',
    back: lang === 'pl' ? 'Powrót' : 'Back',
    scans: lang === 'pl' ? 'skanów' : 'scans',
    confirmDelete: lang === 'pl' ? 'Na pewno usunąć to urządzenie?' : 'Delete this device?',
    closeQr: lang === 'pl' ? 'Zamknij' : 'Close',
    scanToOpen: lang === 'pl' ? 'Zeskanuj kod QR aby otworzyć asystenta' : 'Scan QR code to open assistant',
    created: lang === 'pl' ? 'Dodano' : 'Added',
    logout: lang === 'pl' ? 'Wyloguj' : 'Sign out',
    totalScans: lang === 'pl' ? 'Łączne skany' : 'Total Scans',
    activeDevices: lang === 'pl' ? 'Aktywne urządzenia' : 'Active Devices',
    knowledgeBase: lang === 'pl' ? 'Baza wiedzy' : 'Knowledge Base',
    planUsage: lang === 'pl' ? 'Wykorzystanie planu' : 'Plan Usage',
    live: lang === 'pl' ? 'Aktywny' : 'Live',
    viewQr: lang === 'pl' ? 'Zobacz QR' : 'View QR',
    openChat: lang === 'pl' ? 'Otwórz czat' : 'Open chat',
    downloadQr: lang === 'pl' ? 'Pobierz' : 'Download',
    copyLink: lang === 'pl' ? 'Kopiuj link' : 'Copy link',
    linkCopied: lang === 'pl' ? 'Skopiowano!' : 'Copied!',
    upgradeNow: lang === 'pl' ? 'Ulepsz teraz' : 'Upgrade now',
    usageText: lang === 'pl' ? 'slotów' : 'slots',
    freeSlots: lang === 'pl' ? 'darmowych slotów' : 'free slots',
  };

  // Wait for auth to be fully initialized before loading devices
  useEffect(() => {
    if (initialized && user) {
      loadDevices();
    } else if (initialized && !user) {
      // Auth finished but no user - stop loading
      setLoading(false);
    }
  }, [initialized, user]);

  const loadDevices = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await getDevices(user.id);
      if (fetchError) throw fetchError;
      // Simulate minimum loading time for smooth skeleton experience
      await new Promise(resolve => setTimeout(resolve, 500));
      setDevices(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deviceId) => {
    if (!window.confirm(t.confirmDelete)) return;
    setDeletingId(deviceId);
    try {
      const { error: deleteError } = await deleteDevice(deviceId);
      if (deleteError) throw deleteError;
      setDevices(prev => prev.filter(d => d.id !== deviceId));
    } catch (err) {
      setError(err.message || 'Failed to delete device');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenChat = (device) => {
    if (onOpenChat) {
      onOpenChat({
        name: device.device_name,
        model: device.device_model,
        type: device.device_type,
        pdfContent: device.pdf_content,
        qrUrl: device.qr_url,
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    // Clear any cached auth data
    try {
      localStorage.removeItem('guideai-auth-token');
    } catch (e) {}
    window.location.hash = '';
    window.location.reload();
  };

  const handleBack = (e) => {
    e.preventDefault();
    window.location.hash = '';
  };

  const handleAddDevice = (e) => {
    e.preventDefault();
    window.location.hash = '';
    setTimeout(() => {
      document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCopyModalLink = async () => {
    if (!selectedQR) return;
    const url = selectedQR.qr_url || `${window.location.origin}?device=${encodeURIComponent(`${selectedQR.device_name} ${selectedQR.device_model}`)}`;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-download');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = `${selectedQR.device_name}-qr.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // Using displayName from AuthContext now
  const getUserDisplayName = () => displayName;

  const limit = PLAN_LIMITS[planType] || PLAN_LIMITS.free;
  const usedSlots = devices.length;
  const canAddMore = limit === Infinity || usedSlots < limit;
  const usagePercent = limit === Infinity ? 0 : Math.round((usedSlots / limit) * 100);
  const totalScans = devices.reduce((sum, d) => sum + (d.scan_count || 0), 0);
  const totalKnowledge = devices.reduce((sum, d) => sum + (d.pdf_content?.length || 0), 0);

  // Stats cards data
  const stats = [
    {
      label: t.totalScans,
      value: totalScans.toLocaleString(),
      icon: Zap,
      gradient: 'from-blue-500/20 to-cyan-500/10',
      iconColor: 'text-blue-400',
    },
    {
      label: t.activeDevices,
      value: usedSlots,
      icon: Smartphone,
      gradient: 'from-green-500/20 to-emerald-500/10',
      iconColor: 'text-green-400',
    },
    {
      label: t.knowledgeBase,
      value: totalKnowledge > 1000 ? `${Math.round(totalKnowledge / 1000)}k` : totalKnowledge,
      suffix: ' chars',
      icon: Database,
      gradient: 'from-purple-500/20 to-pink-500/10',
      iconColor: 'text-purple-400',
    },
  ];

  // Show nothing while auth is not initialized (App.jsx handles the loading screen)
  if (!initialized) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* CSS Animations - Premium entrance effects */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes cardPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        }
        .card-entrance {
          animation: fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .card-entrance:hover {
          animation: cardPulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left: Back button */}
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            {t.back}
          </button>

          {/* Center: Logo */}
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 grid grid-cols-4 grid-rows-4 gap-[1px] p-[2px] border rounded ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}>
              {[1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1].map((f, i) => (
                <div key={i} className={`${f ? (darkMode ? 'bg-white' : 'bg-slate-700') : ''} rounded-[1px]`} />
              ))}
            </div>
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Guide<span className="text-blue-500">AI</span>
            </span>
          </div>

          {/* Right: User greeting + sign out */}
          <div className="flex items-center gap-3">
            {/* User info */}
            <div className="hidden sm:flex items-center gap-2.5">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-700" />
              ) : (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isPro ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-right">
                <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  {t.heyDear}!
                </p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {getUserDisplayName()}
                </p>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800' : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'}`}
              title={t.logout}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section with "Hey dear!" */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {/* Avatar with cute mascot overlay */}
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className={`w-16 h-16 rounded-2xl border-2 shadow-xl object-cover ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}
                />
              ) : (
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl ${isPro ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </div>
              )}
              {/* Cute mascot badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-xs shadow-lg border-2 border-white dark:border-slate-900">
                <span role="img" aria-label="mascot">🤖</span>
              </div>
            </div>

            <div>
              {/* Hey dear! greeting */}
              <p className={`text-sm font-medium mb-0.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {t.heyDear}! ✨
              </p>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.welcome}, {getUserDisplayName()}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{email}</span>
                {isPro && (
                  <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" /> PRO
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {loading ? (
            <>
              <SkeletonStats darkMode={darkMode} />
              <SkeletonStats darkMode={darkMode} />
              <SkeletonStats darkMode={darkMode} />
            </>
          ) : (
            stats.map((stat, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl p-5 border transition-all hover:scale-[1.02] ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
                style={{
                  animation: 'fadeSlideIn 0.4s ease-out forwards',
                  animationDelay: `${i * 100}ms`,
                  opacity: 0,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-50`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {stat.label}
                    </span>
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {stat.value}
                    {stat.suffix && <span className="text-sm font-normal text-slate-500">{stat.suffix}</span>}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Usage Progress Bar */}
        {!isPro && !loading && (
          <div className={`mb-8 p-4 rounded-2xl border ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {t.planUsage}
              </span>
              <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                {usedSlots} / {limit} {t.freeSlots}
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${usagePercent >= 80 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            {usagePercent >= 100 ? (
              <div className={`mt-3 p-3 rounded-xl ${darkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={`w-4 h-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                    {lang === 'pl' ? 'Osiągnięto limit!' : 'Limit reached!'}
                  </span>
                </div>
                <p className={`text-xs mb-2 ${darkMode ? 'text-red-400/70' : 'text-red-500/80'}`}>
                  {lang === 'pl'
                    ? 'Aby dodać więcej urządzeń, ulepsz swój plan.'
                    : 'To add more devices, upgrade your plan.'}
                </p>
                <a
                  href="#/early-access"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-medium rounded-lg transition-all"
                >
                  {t.upgradeNow} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : usagePercent >= 80 && (
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                  {lang === 'pl' ? 'Zbliżasz się do limitu' : 'Approaching limit'}
                </span>
                <a
                  href="#/early-access"
                  className="text-xs font-medium text-blue-500 hover:text-blue-400 flex items-center gap-1"
                >
                  {t.upgradeNow} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 ${darkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
          </div>
        )}

        {/* Devices Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {t.myDevices}
          </h2>
          {canAddMore && !loading && devices.length > 0 && (
            <button
              onClick={handleAddDevice}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-4 h-4" />
              {lang === 'pl' ? 'Dodaj urządzenie' : 'Add device'}
            </button>
          )}
        </div>

        {/* Devices Grid */}
        {loading ? (
          /* Skeleton Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SkeletonCard darkMode={darkMode} />
            <SkeletonCard darkMode={darkMode} />
            <SkeletonCard darkMode={darkMode} />
          </div>
        ) : devices.length === 0 ? (
          /* Premium Empty State */
          <div className={`rounded-3xl p-12 text-center border-2 border-dashed ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-300'}`}>
            <EmptyStateIllustration darkMode={darkMode} />
            <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {t.noDevices}
            </h3>
            <p className={`text-lg mb-8 max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {t.addFirst}
            </p>
            <button
              onClick={handleAddDevice}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-semibold text-lg transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:scale-105"
            >
              <Sparkles className="w-6 h-6" />
              {t.goToDemo}
            </button>
          </div>
        ) : (
          /* Device Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device, index) => (
              <DeviceCard
                key={device.id}
                device={device}
                darkMode={darkMode}
                lang={lang}
                t={t}
                onSelectQR={setSelectedQR}
                onOpenChat={handleOpenChat}
                onDelete={handleDelete}
                isDeleting={deletingId === device.id}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      {/* QR Modal */}
      {selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedQR(null)} />
          <div className={`relative rounded-3xl p-8 max-w-md w-full shadow-2xl ${darkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {selectedQR.device_name}
              </h3>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedQR.device_model}
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-white p-6 rounded-2xl mx-auto w-fit shadow-xl mb-6">
              <QRCodeSVG
                id="qr-download"
                value={selectedQR.qr_url || `${window.location.origin}?device=${encodeURIComponent(`${selectedQR.device_name} ${selectedQR.device_model}`)}`}
                size={220}
                level="H"
                marginSize={2}
              />
            </div>

            <p className={`text-sm text-center mb-6 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              {t.scanToOpen}
            </p>

            {/* Actions */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setSelectedQR(null)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              >
                {t.closeQr}
              </button>
              <button
                onClick={handleDownloadQR}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium transition-all hover:from-blue-500 hover:to-indigo-500"
              >
                <Download className="w-4 h-4" />
                {t.downloadQr}
              </button>
            </div>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyModalLink}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                linkCopied
                  ? 'bg-green-500 text-white'
                  : darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {linkCopied ? t.linkCopied : t.copyLink}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
