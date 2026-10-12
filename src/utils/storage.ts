import { UserSettings, FavoriteQuote, BackgroundPreset } from '../types';
import { BACKGROUND_PRESETS, getRandomBackground } from '../data/backgrounds';

const SETTINGS_KEY = 'android_quote_settings_v3';
const FAVORITES_KEY = 'android_quote_favorites_v3';
const BG_MAP_KEY = 'android_quote_bg_map_v3';

export const DEFAULT_SETTINGS: UserSettings = {
  frequency: 3,
  timeSlots: ['05:00', '12:00', '20:00'],
  activeTopics: ['dong-luc', 'cuoc-song', 'binh-yen', 'tri-tue', 'tinh-yeu'],
  layoutStyle: 'classic',
  hasSeenGreeting: false,
  selectedAuthorGroup: 'all',
};

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function loadFavorites(): FavoriteQuote[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteQuote[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Failed to save favorites:', e);
  }
}

export function toggleFavorite(quoteId: string): boolean {
  const current = loadFavorites();
  const exists = current.some((f) => f.quoteId === quoteId);
  let updated: FavoriteQuote[];
  if (exists) {
    updated = current.filter((f) => f.quoteId !== quoteId);
  } else {
    updated = [{ quoteId, savedAt: Date.now() }, ...current];
  }
  saveFavorites(updated);
  return !exists;
}

// Background assignment memory map to guarantee background consistency per quote
function loadBgMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem(BG_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveBgMap(map: Record<string, string>): void {
  try {
    localStorage.setItem(BG_MAP_KEY, JSON.stringify(map));
  } catch (e) {
    console.error('Failed to save bg map:', e);
  }
}

let lastAssignedBgId: string | undefined;

export function getOrAssignBackground(quoteId: string): BackgroundPreset {
  const map = loadBgMap();
  const existingId = map[quoteId];
  if (existingId) {
    const found = BACKGROUND_PRESETS.find((b) => b.id === existingId);
    if (found) {
      lastAssignedBgId = found.id;
      return found;
    }
  }

  // Assign a fresh random background avoiding the last used one
  const nextBg = getRandomBackground(lastAssignedBgId);
  map[quoteId] = nextBg.id;
  lastAssignedBgId = nextBg.id;
  saveBgMap(map);
  return nextBg;
}
