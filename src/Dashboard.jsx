import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ChevronLeft, QrCode, MessageSquare, Trash2, BarChart3,
  Smartphone, Calendar, Eye, Crown, AlertCircle, Loader2, Plus
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { getDevices, deleteDevice, PLAN_LIMITS } from './supabaseClient';

export default function Dashboard({ onOpenChat, lang = 'en' }) {
  const { user, profile, planType, isPro } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQR, setSelectedQR] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const t = {
    dashboard: lang === 'pl' ? 'Panel' : 'Dashboard',
    myDevices: lang === 'pl' ? 'Moje urządzenia' : 'My devices',
    noDevices: lang === 'pl' ? 'Nie masz jeszcze żadnych urządzeń' : 'You have no devices yet',
    addFirst: lang === 'pl' ? 'Dodaj swoje pierwsze urządzenie w demo' : 'Add your first device in the demo',
    goToDemo: lang === 'pl' ? 'Przejdź do demo' : 'Go to demo',
    back: lang === 'pl' ? 'Wróć' : 'Back',
    scans: lang === 'pl' ? 'skanowań' : 'scans',
    viewQr: lang === 'pl' ? 'Zobacz QR' : 'View QR',
    openChat: lang === 'pl' ? 'Otwórz czat' : 'Open chat',
    delete: lang === 'pl' ? 'Usuń' : 'Delete',
    confirmDelete: lang === 'pl' ? 'Na pewno usunąć?' : 'Are you sure?',
    deviceLimit: lang === 'pl' ? 'Limit urządzeń' : 'Device limit',
    upgrade: lang === 'pl' ? 'Ulepsz plan' : 'Upgrade',
    unlimited: lang === 'pl' ? 'Nielimitowane' : 'Unlimited',
    plan: lang === 'pl' ? 'Plan' : 'Plan',
    closeQr: lang === 'pl' ? 'Zamknij' : 'Close',
    scanToOpen: lang === 'pl' ? 'Zeskanuj aby otworzyć asystenta' : 'Scan to open assistant',
    created: lang === 'pl' ? 'Utworzono' : 'Created',
    hasPdf: lang === 'pl' ? 'PDF załadowany' : 'PDF loaded',
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'pl' ? 'pl-PL' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const limit = PLAN_LIMITS[planType] || PLAN_LIMITS.free;
  const usedSlots = devices.length;
  const canAddMore = limit === Infinity || usedSlots < limit;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
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

          {/* Plan Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            isPro ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
          }`}>
            {isPro && <Crown className="w-3 h-3" />}
            {planType.toUpperCase()}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Smartphone className="w-3.5 h-3.5" />
              {t.myDevices}
            </div>
            <p className="text-2xl font-bold text-white">{usedSlots}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <BarChart3 className="w-3.5 h-3.5" />
              {lang === 'pl' ? 'Wszystkie skany' : 'Total scans'}
            </div>
            <p className="text-2xl font-bold text-white">
              {devices.reduce((sum, d) => sum + (d.scan_count || 0), 0)}
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Crown className="w-3.5 h-3.5" />
              {t.plan}
            </div>
            <p className={`text-lg font-bold ${isPro ? 'text-amber-400' : 'text-white'}`}>
              {planType.charAt(0).toUpperCase() + planType.slice(1)}
            </p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              {t.deviceLimit}
            </div>
            <p className="text-lg font-bold text-white">
              {usedSlots}/{limit === Infinity ? '∞' : limit}
            </p>
            {!canAddMore && (
              <a href="#/early-access" className="text-xs text-blue-400 hover:underline">{t.upgrade}</a>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Devices Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{t.myDevices}</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : devices.length === 0 ? (
          <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700">
            <Smartphone className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400 mb-1">{t.noDevices}</p>
            <p className="text-sm text-slate-500 mb-4">{t.addFirst}</p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t.goToDemo}
            </a>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                {/* Device Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {device.device_name} {device.device_model}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {t.created}: {formatDate(device.created_at)}
                    </p>
                  </div>

                  {/* Mini QR */}
                  <div className="w-12 h-12 bg-white p-1 rounded-lg flex-shrink-0 ml-3">
                    <QRCodeSVG
                      value={device.qr_url || `${window.location.origin}?device=${encodeURIComponent(`${device.device_name} ${device.device_model}`)}`}
                      size={40}
                      level="L"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Eye className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">{device.scan_count || 0}</span>
                    <span className="text-slate-500">{t.scans}</span>
                  </div>
                  {device.pdf_content && (
                    <span className="text-xs text-green-400 bg-green-500/20 px-2 py-0.5 rounded">
                      {t.hasPdf}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedQR(device)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    {t.viewQr}
                  </button>
                  <button
                    onClick={() => handleOpenChat(device)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {t.openChat}
                  </button>
                  <button
                    onClick={() => handleDelete(device.id)}
                    disabled={deletingId === device.id}
                    className="p-2 bg-slate-700 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedQR(null)} />
          <div className="relative bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700">
            <h3 className="text-lg font-semibold text-white text-center mb-2">
              {selectedQR.device_name} {selectedQR.device_model}
            </h3>
            <p className="text-sm text-slate-400 text-center mb-4">{t.scanToOpen}</p>

            <div className="bg-white p-4 rounded-xl mx-auto w-fit">
              <QRCodeSVG
                value={selectedQR.qr_url || `${window.location.origin}?device=${encodeURIComponent(`${selectedQR.device_name} ${selectedQR.device_model}`)}`}
                size={200}
                level="M"
                marginSize={2}
              />
            </div>

            <button
              onClick={() => setSelectedQR(null)}
              className="w-full mt-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t.closeQr}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
