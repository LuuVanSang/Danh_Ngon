export type QuoteTopic = 'dong-luc' | 'cuoc-song' | 'binh-yen' | 'tri-tue' | 'tinh-yeu';

export interface Quote {
  id: string;
  text: string;
  author: string;
  topic: QuoteTopic;
}

export type BackgroundCategory = 'nature' | 'minimalist' | 'rustic' | 'art';

export interface BackgroundPreset {
  id: string;
  name: string;
  category: BackgroundCategory;
  categoryName: string;
  type: 'image' | 'gradient' | 'artistic';
  src?: string;
  cssBackground: string;
  textColor: 'light' | 'dark';
  overlayOpacity: number; // 0.2 to 0.4
}

export interface UserSettings {
  frequency: 0 | 1 | 2 | 3; // 0: Tắt, 1: 1 lần, 2: 2 lần, 3: 3 lần
  timeSlots: [string, string, string]; // e.g. ["05:00", "12:00", "20:00"]
  activeTopics: QuoteTopic[];
  layoutStyle: 'classic' | 'minimal' | 'serif-elegant' | 'bracket-editorial';
  hasSeenGreeting: boolean;
  selectedAuthorGroup?: string;
}

export interface FavoriteQuote {
  quoteId: string;
  savedAt: number;
}
