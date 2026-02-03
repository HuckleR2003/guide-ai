import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ChevronLeft, QrCode, MessageSquare, Trash2, BarChart3,
  Smartphone, Calendar, Eye, Crown, AlertCircle, Loader2, Plus,
  User, LogOut, Settings
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { getDevices, deleteDevice, signOut, PLAN_LIMITS } from './supabaseClient';

export default function Dashboard({ onOpenChat, lang = 'en' }) {
  const { user, profile, planType, isPro, refreshProfile } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const t = {
    dashboard: lang === 'pl' ? 'Panel' : 'Dashboard',
    welcome: lang === 'pl' ? 'Witaj' : 'Welcome',
    myDevices: lang === 'pl' ? 'Moje urządzenia' : 'My devices',
    noDevices: lang === 'pl' ? 'Nie masz jeszcze urządzeń' : 'No devices yet',
    addFirst: lang === 'pl' ? 'Stwórz swojego pierwszego asystenta AI' : 'Create your first AI assistant',
    goToDemo: lang === 'pl' ? 'Stwórz asystenta' : 'Create assistant',
    back: lang === 'pl' ? 'Strona główna' : 'Home',
    scans: lang === 'pl' ? 'skanów' : 'scans',
    viewQr: lang === 'pl' ? 'QR' : 'QR',
    openChat: lang === 'pl' ? 'Czat' : 'Chat',
    delete: lang === 'pl' ? 'Usuń' : 'Delete',
    confirmDelete: lang === 'pl' ? 'Na pewno usunąć to urządzenie?' : 'Delete this device?',
    deviceLimit: lang === 'pl' ? 'Limit' : 'Limit',
    upgrade: lang === 'pl' ? 'Ulepsz' : 'Upgrade',
    unlimited: lang === 'pl' ? 'Bez limitu' : 'Unlimited',
    plan: lang === 'pl' ? 'Plan' : 'Plan',
    closeQr: lang === 'pl' ? 'Zamknij' : 'Close',
    scanToOpen: lang === 'pl' ? 'Zeskanuj aby otworzyć asystenta' : 'Scan to open assistant',
    created: lang === 'pl' ? 'Dodano' : 'Added',
    hasPdf: lang === 'pl' ? 'PDF' : 'PDF',
    totalScans: lang === 'pl' ? 'Skanów łącznie' : 'Total scans',
    logout: lang === 'pl' ? 'Wyloguj' : 'Sign out',
    downloadQr: lang === 'pl' ? 'Pobierz QR' : 'Download QR',
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-US', {
      day: 'numeric',
      month: 'short',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t.back}
          </a>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 grid grid-cols-4 grid-rows-4 gap-[1px] p-[2px] border border-slate-600 rounded">
              {[1,1,1,0,1,0,0,1,1,0,1,0,0,1,0,1].map((f, i) => (
                <div key={i} className={`${f ? 'bg-white' : ''} rounded-[1px]`} />
              ))}
            </div>
            <span className="font-semibold text-white">
              Guide<span className="text-blue-500">AI</span>
            </span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-14 h-14 rounded-full border-2 border-slate-700"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {getUserDisplayName().charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {t.welcome}, {getUserDisplayName()}!
              </h1>
              <p className="text-slate-400 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Smartphone className="w-3.5 h-3.5" />
              {t.myDevices}
            </div>
            <p className="text-2xl font-bold text-white">
              {usedSlots}
              <span className="text-sm font-normal text-slate-500">
                /{limit === Infinity ? '∞' : limit}
              </span>
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Eye className="w-3.5 h-3.5" />
              {t.totalScans}
            </div>
            <p className="text-2xl font-bold text-white">
              {devices.reduce((sum, d) => sum + (d.scan_count || 0), 0)}
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Crown className="w-3.5 h-3.5" />
              {t.plan}
            </div>
            <div className="flex items-center gap-2">
              <p className={`text-xl font-bold ${isPro ? 'text-amber-400' : 'text-white'}`}>
                {planType.charAt(0).toUpperCase() + planType.slice(1)}
              </p>
              {!isPro && (
                <a
                  href="#/early-access"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {t.upgrade}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Devices Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{t.myDevices}</h2>
          {canAddMore && (
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              {lang === 'pl' ? 'Dodaj' : 'Add'}
            </a>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : devices.length === 0 ? (
          <div className="bg-slate-800/30 rounded-2xl p-12 text-center border border-slate-700/50 border-dashed">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
              <QrCode className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-xl font-medium text-white mb-2">{t.noDevices}</p>
            <p className="text-slate-500 mb-6">{t.addFirst}</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.goToDemo}
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-slate-600 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* QR Preview */}
                  <div
                    className="w-16 h-16 bg-white p-1.5 rounded-lg flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => setSelectedQR(device)}
                  >
                    <QRCodeSVG
                      value={device.qr_url || `${window.location.origin}?device=${encodeURIComponent(`${device.device_name} ${device.device_model}`)}`}
                      size={52}
                      level="L"
                    />
                  </div>

                  {/* Device Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {device.device_name} {device.device_model}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {device.scan_count || 0} {t.scans}
                      </span>
                      <span className="text-xs text-slate-500">
                        {t.created} {formatDate(device.created_at)}
                      </span>
                      {device.pdf_content && (
                        <span className="text-xs text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded">
                          {t.hasPdf}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedQR(device)}
                      className="p-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                      title={t.viewQr}
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenChat(device)}
                      className="p-2.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      title={t.openChat}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(device.id)}
                      disabled={deletingId === device.id}
                      className="p-2.5 bg-slate-700/50 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                      title={t.delete}
                    >
                      {deletingId === device.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Limit Warning */}
        {!canAddMore && (
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-200 font-medium">
                  {lang === 'pl' ? 'Osiągnięto limit urządzeń' : 'Device limit reached'}
                </p>
                <p className="text-amber-200/70 text-sm mt-1">
                  {lang === 'pl'
                    ? 'Ulepsz do Pro aby dodać więcej urządzeń'
                    : 'Upgrade to Pro to add more devices'}
                </p>
                <a
                  href="#/early-access"
                  className="inline-block mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg text-sm transition-colors"
                >
                  {lang === 'pl' ? 'Ulepsz do Pro' : 'Upgrade to Pro'}
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* QR Modal */}
      {selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedQR(null)} />
          <div className="relative bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white text-center mb-1">
              {selectedQR.device_name}
            </h3>
            <p className="text-slate-400 text-center mb-1">{selectedQR.device_model}</p>
            <p className="text-sm text-slate-500 text-center mb-4">{t.scanToOpen}</p>

            <div className="bg-white p-4 rounded-xl mx-auto w-fit">
              <QRCodeSVG
                id="qr-code-download"
                value={selectedQR.qr_url || `${window.location.origin}?device=${encodeURIComponent(`${selectedQR.device_name} ${selectedQR.device_model}`)}`}
                size={200}
                level="M"
                marginSize={2}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedQR(null)}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {t.closeQr}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
