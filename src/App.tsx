import React, { useState, useEffect } from 'react';
import { ScreenId, Borewell, WaterRequest, WaterStatus, Language } from './types';
import {
  loadBorewells,
  updateBorewellStatus,
  loadRequests,
  addRequest,
  saveRequests,
  resetToDefaults,
} from './utils/storage';
import { TRANSLATIONS } from './utils/i18n';
import { Header } from './components/Header';
import { VillageStatusScreen } from './components/VillageStatusScreen';
import { ReportStatusScreen } from './components/ReportStatusScreen';
import { WaterRequestScreen } from './components/WaterRequestScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { RequestsListModal } from './components/RequestsListModal';
import { Smartphone, Monitor, Check } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeScreen, setActiveScreen] = useState<ScreenId>('STATUS');
  const [borewells, setBorewells] = useState<Borewell[]>([]);
  const [requests, setRequests] = useState<WaterRequest[]>([]);
  const [preselectedBorewellId, setPreselectedBorewellId] = useState<string>('');
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');

  const t = TRANSLATIONS[lang];

  // Initialize data on mount
  useEffect(() => {
    setBorewells(loadBorewells());
    setRequests(loadRequests());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Flow handlers
  const handleRequestWater = (borewellId: string) => {
    setPreselectedBorewellId(borewellId);
    setActiveScreen('REQUEST');
  };

  const handleGoToReport = (borewellId?: string) => {
    if (borewellId) {
      setPreselectedBorewellId(borewellId);
    }
    setActiveScreen('REPORT');
  };

  const handleUpdateStatus = (borewellId: string, status: WaterStatus, notes?: string) => {
    const updated = updateBorewellStatus(borewellId, status, notes);
    setBorewells(updated);
    showToast(t.toastStatusUpdated);
  };

  const handleCreateRequest = (
    data: Omit<WaterRequest, 'id' | 'timestamp' | 'status'>
  ): WaterRequest => {
    const newReq = addRequest(data);
    setRequests(loadRequests());
    showToast(`${t.toastRequestSent} ${data.ownerName}!`);
    return newReq;
  };

  const handleUpdateRequestStatus = (
    requestId: string,
    status: 'PENDING' | 'ACCEPTED' | 'COMPLETED'
  ) => {
    const updated = requests.map((r) => (r.id === requestId ? { ...r, status } : r));
    setRequests(updated);
    saveRequests(updated);
    showToast(
      lang === 'ta'
        ? `கோரிக்கை நிலை: ${status === 'ACCEPTED' ? t.markAccepted : status === 'COMPLETED' ? t.completed : 'நிலுவையில்'}`
        : `Request marked as ${status}`
    );
  };

  const handleResetDemo = () => {
    const defaults = resetToDefaults();
    setBorewells(defaults.borewells);
    setRequests(defaults.requests);
    setActiveScreen('STATUS');
    showToast(t.toastResetDemo);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col items-center">
      {/* Optional Desktop / Projector Presentation bar */}
      <aside className="w-full bg-slate-900 text-slate-300 py-1.5 px-4 text-xs hidden md:flex items-center justify-between z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sky-400">{t.presentationDemo}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{t.presentationSub}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            <span>{t.view}</span>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                viewMode === 'mobile' ? 'bg-sky-600 text-white font-bold' : 'hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>{t.mobileFrame}</span>
            </button>
            <button
              onClick={() => setViewMode('responsive')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                viewMode === 'responsive' ? 'bg-sky-600 text-white font-bold' : 'hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>{t.fullScreen}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container - Mobile Sized / Responsive */}
      <div
        className={`w-full ${
          viewMode === 'mobile'
            ? 'max-w-md my-0 md:my-6 md:rounded-3xl md:shadow-2xl md:border md:border-slate-300 overflow-hidden'
            : 'max-w-xl'
        } bg-slate-50 min-h-screen md:min-h-[820px] flex flex-col relative`}
      >
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top duration-200">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Small Header with [தமிழ்] [English] switcher */}
        <Header
          lang={lang}
          onLanguageChange={(newLang) => setLang(newLang)}
          onResetDemo={handleResetDemo}
          requestCount={requests.filter((r) => r.status === 'PENDING').length}
          onOpenRequests={() => setIsRequestsModalOpen(true)}
        />

        {/* Screen 1, 2, or 3 */}
        <main className="flex-1 overflow-y-auto">
          {activeScreen === 'STATUS' && (
            <VillageStatusScreen
              borewells={borewells}
              lang={lang}
              onRequestWater={handleRequestWater}
              onGoToReport={handleGoToReport}
            />
          )}

          {activeScreen === 'REPORT' && (
            <ReportStatusScreen
              borewells={borewells}
              lang={lang}
              initialBorewellId={preselectedBorewellId}
              onUpdateStatus={handleUpdateStatus}
              onGoToVillageStatus={() => setActiveScreen('STATUS')}
            />
          )}

          {activeScreen === 'REQUEST' && (
            <WaterRequestScreen
              borewells={borewells}
              lang={lang}
              preselectedBorewellId={preselectedBorewellId}
              onSubmitRequest={handleCreateRequest}
              onGoToVillageStatus={() => setActiveScreen('STATUS')}
            />
          )}
        </main>

        {/* Bottom Navigation for the 3 main screens */}
        <BottomNavigation
          activeScreen={activeScreen}
          lang={lang}
          onChangeScreen={(scr) => {
            setActiveScreen(scr);
            // clear preselected if navigating freely
            if (scr !== 'REQUEST') {
              setPreselectedBorewellId('');
            }
          }}
        />

        {/* Requests Inspector Modal */}
        <RequestsListModal
          isOpen={isRequestsModalOpen}
          lang={lang}
          onClose={() => setIsRequestsModalOpen(false)}
          requests={requests}
          onUpdateRequestStatus={handleUpdateRequestStatus}
        />
      </div>
    </div>
  );
}
