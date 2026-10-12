import { Quote, UserSettings } from '../types';

export const NOTIFICATION_TAG = 'lockscreen_daily_quote';

/**
 * Check if the browser supports notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

/**
 * Request notification permission (equivalent to POST_NOTIFICATIONS in Android 13+)
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied';
  try {
    const res = await Notification.requestPermission();
    return res;
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return 'denied';
  }
}

/**
 * Send a silent notification emulating Android NotificationCompat with IMPORTANCE_LOW
 */
export function sendSilentQuoteNotification(quote: Quote, onClick?: (quoteId: string) => void): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const title = 'Danh Ngôn Màn Hình Khóa';
    const body = `"${quote.text}"\n— ${quote.author}`;

    const notification = new Notification(title, {
      body,
      tag: NOTIFICATION_TAG, // Cố định tag để thay thế thông báo cũ
      silent: true, // Im lặng: không chuông, không rung
      icon: '/favicon.ico',
      data: { quoteId: quote.id },
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (onClick) {
        onClick(quote.id);
      }
    };

    return true;
  } catch (e) {
    console.error('Failed to trigger web notification:', e);
    return false;
  }
}

/**
 * Tính toán mốc thời gian thông báo kế tiếp dựa trên cấu hình người dùng
 */
export function calculateNextScheduledSlot(settings: UserSettings): { time: string; remainingMinutes: number } {
  if (settings.frequency === 0) {
    return { time: 'Đã tắt', remainingMinutes: -1 };
  }

  // Lấy các mốc giờ tùy theo tần suất
  const activeSlots = settings.timeSlots.slice(0, settings.frequency);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const slotMinutes = activeSlots
    .map((slot) => {
      const [h, m] = slot.split(':').map(Number);
      return { str: slot, totalMins: h * 60 + m };
    })
    .sort((a, b) => a.totalMins - b.totalMins);

  // Tìm mốc tiếp theo trong ngày hôm nay
  const nextToday = slotMinutes.find((s) => s.totalMins > currentMinutes);
  if (nextToday) {
    return {
      time: nextToday.str,
      remainingMinutes: nextToday.totalMins - currentMinutes,
    };
  }

  // Nếu qua hết các mốc hôm nay, mốc kế tiếp là mốc đầu tiên của ngày mai
  const firstTomorrow = slotMinutes[0];
  const minutesUntilTomorrowSlot = 24 * 60 - currentMinutes + firstTomorrow.totalMins;
  return {
    time: `${firstTomorrow.str} (sáng mai)`,
    remainingMinutes: minutesUntilTomorrowSlot,
  };
}
