import React, { useState, useEffect } from 'react';
import { Quote } from '../types';
import { BellOff, Wifi, BatteryCharging, ChevronUp, Sparkles, Send, Smartphone } from 'lucide-react';
import { sendSilentQuoteNotification, isNotificationSupported, getNotificationPermission, requestNotificationPermission } from '../utils/notification';

interface LockScreenSimulatorProps {
  currentQuote: Quote;
  onOpenQuote: (quoteId: string) => void;
  onUnlockToApp: () => void;
  onTriggerNotificationSlot: (slot: '05:00' | '12:00' | '20:00') => void;
  selectedSlotTime?: string;
}

export const LockScreenSimulator: React.FC<LockScreenSimulatorProps> = ({
  currentQuote,
  onOpenQuote,
  onUnlockToApp,
  onTriggerNotificationSlot,
  selectedSlotTime = '12:00',
}) => {
  const [currentTimeStr, setCurrentTimeStr] = useState('12:00');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [webNotifPerm, setWebNotifPerm] = useState<NotificationPermission>('default');
  const [hasSentWebNotif, setHasSentWebNotif] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTimeStr(`${h}:${m}`);

      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const month = now.getMonth() + 1;
      setCurrentDateStr(`${dayName}, ${day} tháng ${month}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isNotificationSupported()) {
      setWebNotifPerm(getNotificationPermission());
    }
  }, []);

  const handleSendRealWebNotification = async () => {
    if (webNotifPerm !== 'granted') {
      const perm = await requestNotificationPermission();
      setWebNotifPerm(perm);
      if (perm !== 'granted') return;
    }
    const sent = sendSilentQuoteNotification(currentQuote, (quoteId) => {
      onOpenQuote(quoteId);
    });
    if (sent) {
      setHasSentWebNotif(true);
      setTimeout(() => setHasSentWebNotif(false), 3000);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-6 select-none overflow-hidden text-white font-ui">
      {/* Background Overlay for Lock Screen */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />

      {/* Android Status Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs font-medium text-white/80 tracking-wide px-1 pt-1">
        <div className="flex items-center gap-1.5">
          <span>{currentTimeStr}</span>
          <span className="text-white/40">·</span>
          <BellOff className="w-3.5 h-3.5 text-white/70" />
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5" />
          <div className="text-[10px] tracking-tight font-semibold">5G</div>
          <BatteryCharging className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Center Lock Screen Clock (Material You / Android 14 large typographic clock) */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-1 text-center">
        <div className="text-7xl sm:text-8xl font-light tracking-tighter text-white drop-shadow-md">
          {currentTimeStr}
        </div>
        <div className="text-sm sm:text-base font-medium text-white/90 drop-shadow-sm">
          {currentDateStr}
        </div>
        <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs text-white/80 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Màn hình khóa Android</span>
        </div>
      </div>

      {/* Lockscreen Silent Notification Card (Specification 3 & 4) */}
      <div className="relative z-10 my-4 max-w-md mx-auto w-full">
        <div
          onClick={() => onOpenQuote(currentQuote.id)}
          className="group relative cursor-pointer overflow-hidden rounded-2xl bg-neutral-900/80 hover:bg-neutral-900/95 backdrop-blur-xl border border-white/15 p-4 shadow-xl transition-all duration-200 active:scale-[0.98]"
        >
          {/* Notification Header */}
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-white/90 tracking-tight">
                Danh Ngôn Màn Hình Khóa
              </span>
              <span className="text-[10px] text-white/50">· {selectedSlotTime}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-white/50 font-normal">
              <BellOff className="w-3 h-3 text-white/50" />
              <span>Im lặng</span>
            </div>
          </div>

          {/* BigTextStyle Notification Body */}
          <div className="pt-2.5 space-y-1.5">
            <p className="text-sm font-quote-lora italic text-neutral-100 leading-snug line-clamp-3">
              “{currentQuote.text}”
            </p>
            <div className="flex items-center justify-between text-xs text-amber-300/90 pt-0.5">
              <span className="font-medium">— {currentQuote.author}</span>
              <span className="text-[11px] text-white/50 group-hover:text-amber-200 transition-colors flex items-center gap-1">
                Chạm để mở full màn hình &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Quick Testing Bar for 3 slots (5h, 12h, 20h) */}
        <div className="mt-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] text-white/60 shrink-0">Thử mốc:</span>
            <button
              onClick={() => onTriggerNotificationSlot('05:00')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedSlotTime === '05:00'
                  ? 'bg-amber-500 text-neutral-950 font-semibold'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              5h Sáng
            </button>
            <button
              onClick={() => onTriggerNotificationSlot('12:00')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedSlotTime === '12:00'
                  ? 'bg-amber-500 text-neutral-950 font-semibold'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              12h Trưa
            </button>
            <button
              onClick={() => onTriggerNotificationSlot('20:00')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedSlotTime === '20:00'
                  ? 'bg-amber-500 text-neutral-950 font-semibold'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              20h Tối
            </button>
          </div>

          <button
            onClick={handleSendRealWebNotification}
            title="Gửi thông báo im lặng thực tế qua Notification API trình duyệt"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shrink-0 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>{hasSentWebNotif ? 'Đã gửi!' : 'Gửi thử Web Notif'}</span>
          </button>
        </div>
      </div>

      {/* Swipe up affordance */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-2">
        <button
          onClick={onUnlockToApp}
          className="flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors cursor-pointer group"
        >
          <ChevronUp className="w-5 h-5 animate-bounce" />
          <span className="text-xs font-medium tracking-wide">Vuốt lên hoặc chạm để vào app</span>
        </button>
      </div>
    </div>
  );
};
