import React, { useState, useEffect, useMemo } from 'react';
import quotesData from './data/quotes.json';
import { Quote, UserSettings, FavoriteQuote } from './types';
import {
  loadSettings,
  saveSettings,
  loadFavorites,
  toggleFavorite,
  getOrAssignBackground,
} from './utils/storage';
import { QuotePager } from './components/QuotePager';
import { LockScreenSimulator } from './components/LockScreenSimulator';
import { GreetingModal } from './components/GreetingModal';
import { MenuDrawer } from './components/MenuDrawer';
import { ShareModal } from './components/ShareModal';
import { AndroidCodeModal } from './components/AndroidCodeModal';
import {
  Smartphone,
  Maximize2,
  Lock,
  Compass,
  Code2,
  Heart,
  Menu as MenuIcon,
  BellOff,
} from 'lucide-react';
import { calculateNextScheduledSlot } from './utils/notification';

export default function App() {
  const allQuotes: Quote[] = quotesData.quotes as Quote[];

  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [favorites, setFavorites] = useState<FavoriteQuote[]>(() => loadFavorites());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'app' | 'lockscreen'>('app');
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(true);

  // Modals
  const [isGreetingOpen, setIsGreetingOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isAndroidCodeOpen, setIsAndroidCodeOpen] = useState<boolean>(false);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('12:00');

  // Lần đầu mở app: Hiện lời chào nếu chưa xem
  useEffect(() => {
    if (!settings.hasSeenGreeting) {
      setIsGreetingOpen(true);
    }
  }, [settings.hasSeenGreeting]);

  const handleCloseGreeting = () => {
    setIsGreetingOpen(false);
    if (!settings.hasSeenGreeting) {
      const updated = { ...settings, hasSeenGreeting: true };
      setSettings(updated);
      saveSettings(updated);
    }
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Lọc quotes theo activeTopics và nhóm tác giả
  const filteredQuotes = useMemo(() => {
    let list = allQuotes.filter((q) => settings.activeTopics.includes(q.topic));
    if (settings.selectedAuthorGroup === 'ho-chi-minh') {
      list = list.filter((q) => q.author.includes('Hồ Chí Minh'));
    } else if (settings.selectedAuthorGroup === 'nguyen-du') {
      list = list.filter((q) => q.author.includes('Nguyễn Du'));
    } else if (settings.selectedAuthorGroup === 'ca-dao') {
      list = list.filter((q) => q.author.includes('Ca dao') || q.author.includes('Tục ngữ') || q.author.includes('Dân gian'));
    }
    return list.length > 0 ? list : allQuotes;
  }, [allQuotes, settings.activeTopics, settings.selectedAuthorGroup]);

  // Đảm bảo currentIndex hợp lệ khi danh sách lọc thay đổi
  const safeIndex = currentIndex >= filteredQuotes.length ? 0 : currentIndex;
  const currentQuote = filteredQuotes[safeIndex] || allQuotes[0];

  // Gán hình nền ổn định cho câu quote hiện tại
  const currentBackground = useMemo(() => {
    return getOrAssignBackground(currentQuote.id);
  }, [currentQuote.id]);

  const isCurrentFavorite = useMemo(() => {
    return favorites.some((f) => f.quoteId === currentQuote.id);
  }, [favorites, currentQuote.id]);

  const handleToggleFavorite = () => {
    toggleFavorite(currentQuote.id);
    setFavorites(loadFavorites());
  };

  const handleRandomJump = () => {
    if (filteredQuotes.length > 1) {
      let nextIdx = Math.floor(Math.random() * filteredQuotes.length);
      if (nextIdx === safeIndex) {
        nextIdx = (nextIdx + 1) % filteredQuotes.length;
      }
      setCurrentIndex(nextIdx);
    }
  };

  const handleRemoveFavorite = (quoteId: string) => {
    const updated = favorites.filter((f) => f.quoteId !== quoteId);
    setFavorites(updated);
    try {
      localStorage.setItem('android_quote_favorites_v3', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectQuoteFromFavorite = (quoteId: string) => {
    const idx = filteredQuotes.findIndex((q) => q.id === quoteId);
    if (idx !== -1) {
      setCurrentIndex(idx);
    } else {
      // Nếu câu đó nằm ở chủ đề đang bị ẩn, tìm trong allQuotes
      const allIdx = allQuotes.findIndex((q) => q.id === quoteId);
      if (allIdx !== -1) {
        setCurrentIndex(allIdx);
      }
    }
    setViewMode('app');
  };

  // Next slot indicator
  const nextSlotInfo = useMemo(() => {
    return calculateNextScheduledSlot(settings);
  }, [settings]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-ui flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* GLOBAL TOP NAV (Top Bar Contract: Zone 1, 2, 3) */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single Wordmark Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-sm">
            <BellOff className="w-4 h-4" />
          </div>
          <span className="text-base sm:text-lg font-semibold tracking-tight text-white whitespace-nowrap shrink-0">
            Danh Ngôn Màn Hình Khóa
          </span>
          <span className="hidden md:inline-flex items-center gap-2 text-xs text-neutral-400">
            <span className="text-amber-300 font-medium">Kho tàng 500 danh ngôn Việt Nam</span>
            <span aria-hidden="true">·</span>
            <span>Hồ Chí Minh, Nguyễn Du, Ca dao tục ngữ</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links / View Switchers */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button
            onClick={() => setViewMode('app')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'app' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Màn hình danh ngôn
          </button>
          <button
            onClick={() => setViewMode('lockscreen')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === 'lockscreen' ? 'text-amber-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Màn hình khóa Android
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cài đặt thông báo ({nextSlotInfo.time})
          </button>
          <button
            onClick={() => setIsAndroidCodeOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer text-emerald-400"
          >
            Mã nguồn Android
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Phone Frame Toggle + Menu Trigger) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setPhoneFrameMode(!phoneFrameMode)}
            title={phoneFrameMode ? 'Xem toàn màn hình' : 'Xem khung điện thoại Android'}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
          >
            {phoneFrameMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Toàn màn hình</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Khung Android</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsMenuOpen(true)}
            className="px-4 py-2 text-xs font-medium text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 shadow-sm"
          >
            <MenuIcon className="w-4 h-4" />
            <span className="hidden xs:inline">Menu & Cài đặt</span>
          </button>
        </div>
      </header>

      {/* SUB-HEADER / BANNER SUMMARY */}
      <div className="bg-neutral-900/40 border-b border-neutral-850 px-4 sm:px-8 py-2 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-neutral-300">
            Mốc kế tiếp: <strong className="text-amber-400 font-semibold">{nextSlotInfo.time}</strong>
          </span>
          <span aria-hidden="true">·</span>
          <span>{settings.frequency === 0 ? 'Đã tắt thông báo' : `${settings.frequency} lần / ngày (5h, 12h, 20h)`}</span>
          <span aria-hidden="true">·</span>
          <span>{settings.activeTopics.length} chủ đề đang kích hoạt</span>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode segmented switcher */}
          <div className="flex items-center p-1 bg-neutral-850 rounded-xl border border-neutral-800">
            <button
              onClick={() => setViewMode('app')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                viewMode === 'app'
                  ? 'bg-neutral-750 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Trong App
            </button>
            <button
              onClick={() => setViewMode('lockscreen')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'lockscreen'
                  ? 'bg-neutral-750 text-amber-400 shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Màn hình khóa</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT CANVAS */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-6 lg:p-8 overflow-hidden">
        {phoneFrameMode ? (
          /* ANDROID SMARTPHONE SHELL SIMULATION (Pixel / Galaxy Flagship Frame) */
          <div className="relative w-full max-w-[420px] h-[820px] max-h-[calc(100vh-140px)] rounded-[48px] p-3 bg-neutral-900 border-[6px] border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden">
            {/* Phone Speaker & Camera Punch Hole */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-neutral-950 border border-neutral-800" />
            </div>

            {/* Screen Inner Frame */}
            <div className="relative w-full h-full rounded-[38px] overflow-hidden flex flex-col bg-neutral-950">
              {viewMode === 'app' ? (
                <QuotePager
                  quotes={filteredQuotes}
                  currentIndex={safeIndex}
                  onIndexChange={setCurrentIndex}
                  onRandomQuote={handleRandomJump}
                  currentBackground={currentBackground}
                  isFavorite={isCurrentFavorite}
                  onToggleFavorite={handleToggleFavorite}
                  onOpenShareModal={() => setIsShareOpen(true)}
                  onOpenMenu={() => setIsMenuOpen(true)}
                  onOpenLockScreen={() => setViewMode('lockscreen')}
                  onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
                  settings={settings}
                  onUpdateLayout={(style) => handleUpdateSettings({ ...settings, layoutStyle: style })}
                />
              ) : (
                <LockScreenSimulator
                  currentQuote={currentQuote}
                  onOpenQuote={() => setViewMode('app')}
                  onUnlockToApp={() => setViewMode('app')}
                  onTriggerNotificationSlot={(slot) => {
                    setSelectedSlotTime(slot);
                    handleRandomJump();
                  }}
                  selectedSlotTime={selectedSlotTime}
                />
              )}
            </div>

            {/* Android Navigation Home Pill */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-30 pointer-events-none" />
          </div>
        ) : (
          /* FULL VIEWPORT MODE */
          <div className="w-full h-full min-h-[calc(100vh-160px)] rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col bg-neutral-950">
            {viewMode === 'app' ? (
              <QuotePager
                quotes={filteredQuotes}
                currentIndex={safeIndex}
                onIndexChange={setCurrentIndex}
                onRandomQuote={handleRandomJump}
                currentBackground={currentBackground}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
                onOpenShareModal={() => setIsShareOpen(true)}
                onOpenMenu={() => setIsMenuOpen(true)}
                onOpenLockScreen={() => setViewMode('lockscreen')}
                onOpenAndroidCode={() => setIsAndroidCodeOpen(true)}
                settings={settings}
                onUpdateLayout={(style) => handleUpdateSettings({ ...settings, layoutStyle: style })}
              />
            ) : (
              <LockScreenSimulator
                currentQuote={currentQuote}
                onOpenQuote={() => setViewMode('app')}
                onUnlockToApp={() => setViewMode('app')}
                onTriggerNotificationSlot={(slot) => {
                  setSelectedSlotTime(slot);
                  handleRandomJump();
                }}
                selectedSlotTime={selectedSlotTime}
              />
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
      <GreetingModal isOpen={isGreetingOpen} onClose={handleCloseGreeting} />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        favorites={favorites}
        allQuotes={allQuotes}
        onSelectQuote={handleSelectQuoteFromFavorite}
        onRemoveFavorite={handleRemoveFavorite}
        onShowGreetingModal={() => setIsGreetingOpen(true)}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        quote={currentQuote}
        background={currentBackground}
        layoutStyle={settings.layoutStyle}
      />

      <AndroidCodeModal
        isOpen={isAndroidCodeOpen}
        onClose={() => setIsAndroidCodeOpen(false)}
      />
    </div>
  );
}
