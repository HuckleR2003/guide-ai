import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ChevronLeft, QrCode, MessageSquare, Trash2,
  Smartphone, Eye, Crown, AlertCircle, Loader2, Plus, LogOut,
  Zap, Database, Sparkles, ExternalLink, Download
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { getDevices, deleteDevice, signOut, PLAN_LIMITS } from './supabaseClient';

export default function Dashboard({ onOpenChat, lang = 'en', darkMode: propDarkMode }) {
  const { user, profile, planType, isPro } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const darkMode = propDarkMode !== undefined
    ? propDarkMode
    : (typeof window !== 'undefined' && localStorage.getItem('guideai-dark') === 'true');

  const t = {
    welcome: lang === 'pl' ? 'Witaj ponownie' : 'Welcome back',
    myDevices: lang === 'pl' ? 'Twoje urządzenia' : 'Your devices',
    noDevices: lang === 'pl' ? 'Twoja półka jest pusta' : 'Your shelf is empty',
    addFirst: lang === 'pl' ? 'Dodaj pierwsze urządzenie i zacznij budować bazę wiedzy' : 'Add your first device and start building your knowledge base',
    goToDemo: lang === 'pl' ? 'Dodaj pierwsze urządzenie' : 'Add your first device',
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
    upgradeNow: lang === 'pl' ? 'Ulepsz teraz' : 'Upgrade now',
    usageText: lang === 'pl' ? 'slotów' : 'slots',
    freeSlots: lang === 'pl' ? 'darmowych slotów' : 'free slots',
  };

  useEffect(() => {
    if (user) {
      loadDevices();
    }
  }, [user]);

  const loadDevices = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await getDevices(user.id);
      if (fetchError) throw fetchError;
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
    await signOut();
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getUserDisplayName = () => {
    if (profile?.full_name) return profile.full_name.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

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

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <ChevronLeft className="w-4 h-4" />
            {t.back}
          </button>

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

          <button
            onClick={handleSignOut}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-slate-500 hover:text-red-500 hover:bg-slate-100'}`}
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl border-2 border-slate-700 shadow-xl"
              />
            ) : (
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl ${isPro ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
                {getUserDisplayName().charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.welcome}, {getUserDisplayName()}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{user?.email}</span>
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
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl p-5 border transition-all hover:scale-[1.02] ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
              style={{ animationDelay: `${i * 100}ms` }}
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
          ))}
        </div>

        {/* Usage Progress Bar */}
        {!isPro && (
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
            {usagePercent >= 80 && (
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
          {canAddMore && devices.length > 0 && (
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
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          </div>
        ) : devices.length === 0 ? (
          /* Empty State */
          <div className={`rounded-3xl p-12 text-center border-2 border-dashed ${darkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-300'}`}>
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <QrCode className={`w-10 h-10 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {t.noDevices}
            </h3>
            <p className={`mb-8 max-w-md mx-auto ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              {t.addFirst}
            </p>
            <button
              onClick={handleAddDevice}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25"
            >
              <Sparkles className="w-5 h-5" />
              {t.goToDemo}
            </button>
          </div>
        ) : (
          /* Device Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device, index) => (
              <div
                key={device.id}
                className={`group relative rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-slate-900/50' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}
                style={{ animationDelay: `${index * 50}ms` }}
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

                {/* QR Code Preview */}
                <div
                  className="w-20 h-20 bg-white p-2 rounded-xl mb-4 cursor-pointer transition-transform hover:scale-110 shadow-lg"
                  onClick={() => setSelectedQR(device)}
                >
                  <QRCodeSVG
                    value={device.qr_url || `${window.location.origin}?device=${encodeURIComponent(`${device.device_name} ${device.device_model}`)}`}
                    size={64}
                    level="M"
                  />
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
                    onClick={() => setSelectedQR(device)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                  >
                    <QrCode className="w-4 h-4" />
                    QR
                  </button>
                  <button
                    onClick={() => handleOpenChat(device)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium transition-all hover:from-blue-500 hover:to-indigo-500"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => handleDelete(device.id)}
                    disabled={deletingId === device.id}
                    className={`p-2.5 rounded-xl transition-all disabled:opacity-50 ${darkMode ? 'bg-slate-800 text-slate-500 hover:bg-red-500/20 hover:text-red-400' : 'bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500'}`}
                  >
                    {deletingId === device.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
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
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedQR(null)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              >
                {t.closeQr}
              </button>
              <button
                onClick={() => {
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
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium transition-all hover:from-blue-500 hover:to-indigo-500"
              >
                <Download className="w-4 h-4" />
                {t.downloadQr}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
