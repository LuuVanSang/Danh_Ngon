import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Quote, BackgroundPreset, UserSettings } from '../types';
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Menu,
  Lock,
  Sparkles,
  Type,
  Code2,
  Shuffle,
} from 'lucide-react';

interface QuotePagerProps {
  quotes: Quote[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
  onRandomQuote?: () => void;
  currentBackground: BackgroundPreset;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenShareModal: () => void;
  onOpenMenu: () => void;
  onOpenLockScreen: () => void;
  onOpenAndroidCode: () => void;
  settings: UserSettings;
  onUpdateLayout: (layout: UserSettings['layoutStyle']) => void;
}

const LAYOUT_NAMES: Record<UserSettings['layoutStyle'], string> = {
  classic: 'Cổ điển cân đối',
  minimal: 'Tối giản thuần khiết',
  'serif-elegant': 'Sang trọng quý phái',
  'bracket-editorial': 'Dấu ngoặc biên tập',
};

export const QuotePager: React.FC<QuotePagerProps> = ({
  quotes,
  currentIndex,
  onIndexChange,
  onRandomQuote,
  currentBackground,
  isFavorite,
  onToggleFavorite,
  onOpenShareModal,
  onOpenMenu,
  onOpenLockScreen,
  onOpenAndroidCode,
  settings,
  onUpdateLayout,
}) => {
  const currentQuote = quotes[currentIndex] || quotes[0];
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  // Navigate next / prev
  const handlePrev = useCallback(() => {
    if (quotes.length <= 1) return;
    const prevIndex = (currentIndex - 1 + quotes.length) % quotes.length;
    onIndexChange(prevIndex);
  }, [currentIndex, quotes.length, onIndexChange]);

  const handleNext = useCallback(() => {
    if (quotes.length <= 1) return;
    const nextIndex = (currentIndex + 1) % quotes.length;
    onIndexChange(nextIndex);
  }, [currentIndex, quotes.length, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch Swipe (HorizontalPager simulation)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwiping(true);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Chỉ nhận diện vuốt ngang nếu góc lệch ngang lớn hơn dọc
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    setIsSwiping(false);
  };

  const handleHeartClick = () => {
    setHeartAnim(true);
    onToggleFavorite();
    setTimeout(() => setHeartAnim(false), 600);
  };

  const cycleLayout = () => {
    const styles: UserSettings['layoutStyle'][] = [
      'classic',
      'minimal',
      'serif-elegant',
      'bracket-editorial',
    ];
    const nextIdx = (styles.indexOf(settings.layoutStyle) + 1) % styles.length;
    onUpdateLayout(styles[nextIdx]);
  };

  // Typography auto-scaling based on text length (>= 22sp as specified)
  const textLength = currentQuote?.text?.length || 50;
  const getResponsiveTextClasses = () => {
    if (textLength > 120) return 'text-xl sm:text-2xl leading-relaxed';
    if (textLength > 75) return 'text-2xl sm:text-3xl leading-relaxed';
    if (textLength < 40) return 'text-3xl sm:text-4xl leading-normal';
    return 'text-2xl sm:text-3xl leading-relaxed';
  };

  const isLightText = currentBackground.textColor === 'light';
  const overlayClass = isLightText ? 'bg-black' : 'bg-white';

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        background: currentBackground.src
          ? `url(${currentBackground.src}) center center / cover no-repeat`
          : currentBackground.cssBackground,
      }}
      className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden transition-all duration-700 select-none font-ui"
    >
      {/* Dynamic Overlay / Scrim to ensure WCAG legibility (20-40% as in spec) */}
      <div
        style={{ opacity: currentBackground.overlayOpacity }}
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${overlayClass}`}
      />

      {/* Additional subtle gradient scrim for top & bottom controls */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isLightText
            ? 'bg-gradient-to-b from-black/50 via-transparent to-black/65'
            : 'bg-gradient-to-b from-white/30 via-transparent to-white/40'
        }`}
      />

      {/* TOP BAR CONTRACT: 3 Zones (Spec & Guidelines) */}
      <header className="relative z-20 flex items-center justify-between gap-4 p-4 sm:p-6">
        {/* Zone 1: Brand title / Quote Counter */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMenu}
            aria-label="Mở Menu"
            className={`min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              isLightText
                ? 'bg-black/35 hover:bg-black/50 text-white/90 border border-white/15'
                : 'bg-white/50 hover:bg-white/70 text-neutral-900 border border-black/10'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div
            className={`text-xs font-medium tracking-tight px-3 py-1.5 rounded-xl backdrop-blur-md hidden sm:flex items-center gap-1.5 ${
              isLightText ? 'bg-black/30 text-white/80' : 'bg-white/40 text-neutral-800'
            }`}
          >
            <span>Câu {currentIndex + 1} / {quotes.length}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{currentBackground.categoryName}</span>
          </div>
        </div>

        {/* Zone 2: Fast Action Nav Links / Switchers */}
        <div className="flex items-center gap-2">
          {/* Lock screen simulator toggle */}
          <button
            onClick={onOpenLockScreen}
            title="Xem giao diện màn hình khóa Android"
            className={`min-h-[44px] px-3.5 rounded-2xl flex items-center gap-1.5 text-xs font-medium backdrop-blur-md transition-all cursor-pointer ${
              isLightText
                ? 'bg-black/35 hover:bg-black/50 text-white border border-white/15'
                : 'bg-white/50 hover:bg-white/70 text-neutral-900 border border-black/10'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="hidden xs:inline">Màn hình khóa</span>
          </button>

          {/* Android Kotlin Code View */}
          <button
            onClick={onOpenAndroidCode}
            title="Xem mã nguồn Android Jetpack Compose"
            className={`min-h-[44px] px-3.5 rounded-2xl flex items-center gap-1.5 text-xs font-medium backdrop-blur-md transition-all cursor-pointer ${
              isLightText
                ? 'bg-black/35 hover:bg-black/50 text-emerald-300 border border-white/15'
                : 'bg-white/50 hover:bg-white/70 text-emerald-800 border border-black/10'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Code Android</span>
          </button>
        </div>

        {/* Zone 3: Layout Style Quick Switcher & Random Jump */}
        <div className="flex items-center gap-2">
          {onRandomQuote && (
            <button
              onClick={onRandomQuote}
              title="Khám phá ngẫu nhiên 1 câu trong kho 500 danh ngôn"
              className={`min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                isLightText
                  ? 'bg-black/35 hover:bg-black/50 text-amber-300 border border-white/15'
                  : 'bg-white/50 hover:bg-white/70 text-amber-700 border border-black/10'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={cycleLayout}
            title={`Đổi kiểu bố cục: Hiện tại: ${LAYOUT_NAMES[settings.layoutStyle]}`}
            className={`min-h-[44px] min-w-[44px] rounded-2xl flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              isLightText
                ? 'bg-black/35 hover:bg-black/50 text-white/90 border border-white/15'
                : 'bg-white/50 hover:bg-white/70 text-neutral-900 border border-black/10'
            }`}
          >
            <Type className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </header>

      {/* CENTER QUOTE CANVAS (Horizontal Pager Content) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 sm:px-14 md:px-20 text-center max-w-4xl mx-auto my-auto">
        {/* Style Variant: Bracket Editorial */}
        {settings.layoutStyle === 'bracket-editorial' && (
          <div
            className={`text-6xl sm:text-7xl font-quote-playfair select-none leading-none mb-2 ${
              isLightText ? 'text-amber-400/40' : 'text-neutral-500/40'
            }`}
          >
            “
          </div>
        )}

        {/* Main Quote Text */}
        <blockquote
          className={`font-quote-lora italic font-normal tracking-normal max-w-2xl transition-all duration-300 ${getResponsiveTextClasses()} ${
            isLightText ? 'text-white drop-shadow-md' : 'text-neutral-900'
          } ${settings.layoutStyle === 'serif-elegant' ? 'font-quote-playfair font-normal' : ''}`}
        >
          {settings.layoutStyle === 'bracket-editorial'
            ? currentQuote.text
            : `“${currentQuote.text}”`}
        </blockquote>

        {/* Decorative Divider */}
        {settings.layoutStyle !== 'minimal' && (
          <div
            className={`w-12 h-0.5 my-6 rounded-full mx-auto transition-opacity ${
              isLightText ? 'bg-white/40' : 'bg-neutral-800/30'
            }`}
          />
        )}

        {/* Author */}
        <cite
          className={`not-italic text-sm sm:text-base font-ui tracking-wider transition-all ${
            isLightText ? 'text-white/85 font-medium drop-shadow-sm' : 'text-neutral-800 font-semibold'
          } ${settings.layoutStyle === 'minimal' ? 'mt-4' : ''}`}
        >
          — {currentQuote.author} —
        </cite>

        {/* Swipe Hint indicator on desktop */}
        <div
          className={`mt-8 text-[11px] tracking-wide uppercase font-medium transition-opacity ${
            isLightText ? 'text-white/45' : 'text-neutral-700/50'
          }`}
        >
          Vuốt ngang hoặc bấm mũi tên để xem câu kế tiếp
        </div>
      </main>

      {/* ARROW BUTTONS (LEFT / RIGHT) */}
      <div className="absolute inset-y-0 left-2 sm:left-4 z-20 flex items-center pointer-events-none">
        <button
          onClick={handlePrev}
          aria-label="Xem câu trước"
          className={`pointer-events-auto min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer opacity-70 hover:opacity-100 hover:scale-105 active:scale-95 ${
            isLightText
              ? 'bg-black/35 text-white/90 border border-white/15'
              : 'bg-white/50 text-neutral-900 border border-black/10'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-2 sm:right-4 z-20 flex items-center pointer-events-none">
        <button
          onClick={handleNext}
          aria-label="Xem câu tiếp theo"
          className={`pointer-events-auto min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer opacity-70 hover:opacity-100 hover:scale-105 active:scale-95 ${
            isLightText
              ? 'bg-black/35 text-white/90 border border-white/15'
              : 'bg-white/50 text-neutral-900 border border-black/10'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* BOTTOM THUMB ZONE (Specification 1 & 4) */}
      <footer className="relative z-20 p-4 sm:p-6 pb-6 sm:pb-8 flex items-center justify-between gap-4 max-w-xl mx-auto w-full">
        {/* Nút Thích (Favorite) */}
        <button
          onClick={handleHeartClick}
          aria-label={isFavorite ? 'Bỏ thích' : 'Yêu thích danh ngôn'}
          className={`min-h-[48px] px-5 rounded-2xl flex items-center gap-2.5 backdrop-blur-md transition-all cursor-pointer active:scale-95 shadow-lg ${
            isFavorite
              ? 'bg-rose-500/90 text-white shadow-rose-500/20'
              : isLightText
              ? 'bg-black/40 hover:bg-black/55 text-white border border-white/15'
              : 'bg-white/60 hover:bg-white/80 text-neutral-900 border border-black/10'
          }`}
        >
          <Heart
            className={`w-5 h-5 transition-transform duration-300 ${
              isFavorite ? 'fill-white text-white' : ''
            } ${heartAnim ? 'scale-125 text-rose-300' : ''}`}
          />
          <span className="text-xs font-semibold">
            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
          </span>
        </button>

        {/* Chỉ số danh ngôn và tên hình nền */}
        <div
          className={`text-center text-[11px] font-medium backdrop-blur-md px-3 py-1.5 rounded-full ${
            isLightText ? 'text-white/70 bg-black/25' : 'text-neutral-800 bg-white/40'
          }`}
        >
          <span>{currentBackground.name}</span>
        </div>

        {/* Nút Chia Sẻ (Share) */}
        <button
          onClick={onOpenShareModal}
          aria-label="Chia sẻ danh ngôn này"
          className={`min-h-[48px] px-5 rounded-2xl flex items-center gap-2.5 backdrop-blur-md transition-all cursor-pointer active:scale-95 shadow-lg ${
            isLightText
              ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold shadow-amber-500/20'
              : 'bg-neutral-900 hover:bg-neutral-800 text-white font-semibold'
          }`}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-xs">Chia sẻ</span>
        </button>
      </footer>
    </div>
  );
};
