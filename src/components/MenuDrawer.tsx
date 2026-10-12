import React, { useState } from 'react';
import { UserSettings, Quote, QuoteTopic, FavoriteQuote } from '../types';
import {
  X,
  Clock,
  Heart,
  BookOpen,
  Info,
  HelpCircle,
  Check,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Trash2,
  ExternalLink,
  Search,
  Shuffle,
} from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  favorites: FavoriteQuote[];
  allQuotes: Quote[];
  onSelectQuote: (quoteId: string) => void;
  onRemoveFavorite: (quoteId: string) => void;
  onShowGreetingModal: () => void;
}

type MenuTab = 'kho-tang' | 'settings' | 'favorites' | 'about' | 'guide';

const TOPIC_LABELS: Record<QuoteTopic, { label: string; desc: string }> = {
  'dong-luc': { label: 'Động lực', desc: 'Khởi đầu ngày mới, bứt phá giới hạn' },
  'cuoc-song': { label: 'Cuộc sống', desc: 'Góc nhìn tích cực, trân trọng hiện tại' },
  'binh-yen': { label: 'Bình yên', desc: 'Thanh lọc tâm trí, buông bỏ muộn phiền' },
  'tri-tue': { label: 'Trí tuệ', desc: 'Chiều sâu nội tâm, triết lý sống' },
  'tinh-yeu': { label: 'Tình yêu', desc: 'Thấu hiểu, vị tha và gắn kết' },
};

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  favorites,
  allQuotes,
  onSelectQuote,
  onRemoveFavorite,
  onShowGreetingModal,
}) => {
  const [activeTab, setActiveTab] = useState<MenuTab>('kho-tang');
  const [selectedBrand, setSelectedBrand] = useState<'samsung' | 'xiaomi' | 'oppo' | 'vivo'>('samsung');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAuthorFilter, setSelectedAuthorFilter] = useState<string>('all');

  if (!isOpen) return null;

  const favoriteQuotesList = favorites
    .map((fav) => ({
      ...fav,
      quote: allQuotes.find((q) => q.id === fav.quoteId),
    }))
    .filter((f) => f.quote !== undefined);

  // Filtered quotes in Kho tàng
  const filteredKhoQuotes = allQuotes.filter((q) => {
    // Author filter
    if (selectedAuthorFilter === 'ho-chi-minh' && !q.author.includes('Hồ Chí Minh')) return false;
    if (selectedAuthorFilter === 'nguyen-du' && !q.author.includes('Nguyễn Du')) return false;
    if (selectedAuthorFilter === 'ca-dao' && !q.author.includes('Ca dao') && !q.author.includes('Tục ngữ') && !q.author.includes('Dân gian')) return false;
    if (selectedAuthorFilter === 'thien' && !q.author.includes('Thích Nhất Hạnh') && !q.author.includes('Thiền')) return false;
    if (selectedAuthorFilter === 'danh-nhan' && (q.author.includes('Hồ Chí Minh') || q.author.includes('Nguyễn Du') || q.author.includes('Ca dao') || q.author.includes('Tục ngữ') || q.author.includes('Thích Nhất Hạnh'))) return false;

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchText = q.text.toLowerCase().includes(query);
      const matchAuthor = q.author.toLowerCase().includes(query);
      return matchText || matchAuthor;
    }
    return true;
  });

  const toggleTopic = (topic: QuoteTopic) => {
    let nextTopics = [...settings.activeTopics];
    if (nextTopics.includes(topic)) {
      if (nextTopics.length > 1) {
        nextTopics = nextTopics.filter((t) => t !== topic);
      }
    } else {
      nextTopics.push(topic);
    }
    onUpdateSettings({ ...settings, activeTopics: nextTopics });
  };

  const handleTimeSlotChange = (index: number, val: string) => {
    const updated = [...settings.timeSlots] as [string, string, string];
    updated[index] = val;
    onUpdateSettings({ ...settings, timeSlots: updated });
  };

  const handleRandomPick = () => {
    if (filteredKhoQuotes.length > 0) {
      const random = filteredKhoQuotes[Math.floor(Math.random() * filteredKhoQuotes.length)];
      onSelectQuote(random.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in font-ui">
      <div className="w-full max-w-lg h-full bg-neutral-900 border-l border-neutral-800 text-neutral-100 flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-semibold text-white">Danh Ngôn Việt Nam</h2>
              <span className="text-[11px] text-amber-300">Kho tàng {allQuotes.length} danh ngôn</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Segmented buttons) */}
        <div className="grid grid-cols-5 p-1.5 bg-neutral-950 border-b border-neutral-800/80 gap-1 text-[11px] font-medium">
          <button
            onClick={() => setActiveTab('kho-tang')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'kho-tang'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kho tàng</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Cài đặt</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer relative ${
              activeTab === 'favorites'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Thích ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Giới thiệu</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hướng dẫn</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 0: KHO TÀNG 500 DANH NGÔN VIỆT NAM */}
          {activeTab === 'kho-tang' && (
            <div className="space-y-4">
              {/* Search & Random Action */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm danh ngôn hoặc tác giả..."
                    className="w-full bg-neutral-800/90 border border-neutral-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                {/* Quick Action: Pick Random */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-xs text-neutral-400">
                    Tìm thấy <strong className="text-amber-300">{filteredKhoQuotes.length}</strong> / {allQuotes.length} câu
                  </span>
                  <button
                    onClick={handleRandomPick}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-medium border border-amber-500/30 transition-all cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Ngẫu nhiên 1 câu</span>
                  </button>
                </div>
              </div>

              {/* Author Filter Chips (Segmented) */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Nguồn & Tác giả tiêu biểu
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'Tất cả (500)' },
                    { id: 'ho-chi-minh', label: 'Hồ Chí Minh' },
                    { id: 'nguyen-du', label: 'Nguyễn Du' },
                    { id: 'ca-dao', label: 'Ca dao & Tục ngữ' },
                    { id: 'thien', label: 'Thiền sư & TN Hạnh' },
                    { id: 'danh-nhan', label: 'Danh nhân Lịch sử' },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      onClick={() => setSelectedAuthorFilter(chip.id)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        selectedAuthorFilter === chip.id
                          ? 'bg-amber-500 text-neutral-950 font-semibold shadow-sm'
                          : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-750'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quotes List */}
              <div className="space-y-2.5 pt-1">
                {filteredKhoQuotes.slice(0, 100).map((q) => (
                  <div
                    key={q.id}
                    onClick={() => {
                      onSelectQuote(q.id);
                      onClose();
                    }}
                    className="group p-3.5 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-750 hover:border-amber-500/30 transition-all cursor-pointer flex flex-col gap-1.5"
                  >
                    <p className="text-xs font-quote-lora italic text-neutral-100 leading-relaxed group-hover:text-amber-200 transition-colors">
                      “{q.text}”
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-amber-300/80 pt-1 border-t border-neutral-750/50">
                      <span className="font-medium">— {q.author}</span>
                      <span className="text-[10px] text-neutral-400 flex items-center gap-1 group-hover:text-white transition-colors">
                        <span>Chạm để xem</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}

                {filteredKhoQuotes.length > 100 && (
                  <div className="text-center py-2 text-xs text-neutral-500">
                    Đang hiển thị 100 câu đầu tiên phù hợp bộ lọc...
                  </div>
                )}

                {filteredKhoQuotes.length === 0 && (
                  <div className="text-center py-10 text-neutral-400 text-xs">
                    Không tìm thấy câu nào phù hợp với từ khóa "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: CÀI ĐẶT (SETTINGS) */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Số lần mỗi ngày */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Số lần nhận thông báo mỗi ngày</span>
                  </label>
                  <span className="text-xs text-neutral-400">
                    {settings.frequency === 0 ? 'Đã tắt' : `${settings.frequency} lần / ngày`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {([0, 1, 2, 3] as const).map((count) => (
                    <button
                      key={count}
                      onClick={() => onUpdateSettings({ ...settings, frequency: count })}
                      className={`py-2.5 px-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        settings.frequency === count
                          ? 'bg-amber-500/15 border-amber-500/80 text-amber-300 font-semibold shadow-sm'
                          : 'bg-neutral-850 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      {count === 0 ? 'Tắt' : `${count} lần`}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  Thông báo im lặng (không chuông, không rung), xuất hiện trên màn hình khóa và tự thay thế câu cũ.
                </p>
              </div>

              {/* Giờ nhận thông báo */}
              {settings.frequency > 0 && (
                <div className="space-y-3 pt-2 border-t border-neutral-800">
                  <label className="text-sm font-semibold text-neutral-200">
                    Khung giờ nhận danh ngôn
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {settings.timeSlots.slice(0, settings.frequency).map((slot, index) => (
                      <div key={index} className="space-y-1">
                        <span className="text-[11px] text-neutral-400">
                          {index === 0 ? 'Mốc 1 (Sáng)' : index === 1 ? 'Mốc 2 (Trưa)' : 'Mốc 3 (Tối)'}
                        </span>
                        <input
                          type="time"
                          value={slot}
                          onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                          className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-2.5 py-2 text-xs font-medium text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 bg-neutral-800/40 p-2.5 rounded-xl border border-neutral-800">
                    <span>Mặc định tối ưu:</span>
                    <button
                      onClick={() => onUpdateSettings({ ...settings, timeSlots: ['05:00', '12:00', '20:00'] })}
                      className="text-amber-400 underline hover:text-amber-300 ml-1 cursor-pointer"
                    >
                      Khôi phục 5h, 12h, 20h
                    </button>
                  </div>
                </div>
              )}

              {/* Chủ đề quan tâm */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-neutral-200">Chủ đề yêu thích</label>
                  <span className="text-xs text-neutral-400">{settings.activeTopics.length} đã chọn</span>
                </div>
                <div className="grid gap-2">
                  {(Object.keys(TOPIC_LABELS) as QuoteTopic[]).map((topic) => {
                    const isSelected = settings.activeTopics.includes(topic);
                    const { label, desc } = TOPIC_LABELS[topic];
                    return (
                      <div
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-neutral-800/80 border-amber-500/40 text-neutral-100'
                            : 'bg-neutral-850/50 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs font-semibold">{label}</div>
                          <div className="text-[11px] text-neutral-400">{desc}</div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-amber-500 border-amber-500 text-neutral-950'
                              : 'border-neutral-600 bg-neutral-800'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hướng dẫn bật màn hình khóa Android */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Bật hiện thông báo trên Màn hình khóa Android</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-750 text-xs text-neutral-300 space-y-2 leading-relaxed">
                  <p>
                    Để câu danh ngôn xuất hiện đẹp đẽ khi nhấc máy, hãy kiểm tra quyền màn hình khóa:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-[11px]">
                    <li>Mở <strong>Cài đặt</strong> trên điện thoại &rarr; <strong>Thông báo</strong></li>
                    <li>Chọn <strong>Thông báo trên màn hình khóa</strong> &rarr; Chọn <strong>Hiện nội dung</strong></li>
                    <li>Android 13+: Cấp quyền gửi thông báo khi app hỏi lần đầu</li>
                  </ol>
                </div>
              </div>

              {/* Hướng dẫn tắt tối ưu pin các dòng máy (Mục 7 Thiết kế) */}
              <div className="space-y-3 pt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
                  <ShieldAlert className="w-4 h-4 text-emerald-400" />
                  <span>Tắt tối ưu pin (tránh bị tắt chạy ngầm)</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-750 text-xs text-neutral-300 space-y-2">
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {(['samsung', 'xiaomi', 'oppo', 'vivo'] as const).map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                          selectedBrand === brand
                            ? 'bg-amber-500 text-neutral-950 font-semibold'
                            : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                      >
                        {brand === 'samsung'
                          ? 'Samsung OneUI'
                          : brand === 'xiaomi'
                          ? 'Xiaomi HyperOS/MIUI'
                          : brand === 'oppo'
                          ? 'Oppo / Realme'
                          : 'Vivo Funtouch'}
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] text-neutral-400 pt-1 leading-relaxed">
                    {selectedBrand === 'samsung' && (
                      <p>
                        Cài đặt &rarr; Ứng dụng &rarr; Danh Ngôn &rarr; Pin &rarr; Chọn <strong>Không hạn chế (Unrestricted)</strong> để WorkManager luôn hẹn đúng 5h, 12h, 20h.
                      </p>
                    )}
                    {selectedBrand === 'xiaomi' && (
                      <p>
                        Cài đặt &rarr; Ứng dụng &rarr; Quản lý ứng dụng &rarr; Danh Ngôn &rarr; Bật <strong>Tự khởi chạy (Autostart)</strong> &amp; Tiết kiệm pin chọn <strong>Không hạn chế</strong>.
                      </p>
                    )}
                    {selectedBrand === 'oppo' && (
                      <p>
                        Cài đặt &rarr; Quản lý ứng dụng &rarr; Danh Ngôn &rarr; Mức sử dụng pin &rarr; Bật <strong>Cho phép hoạt động dưới nền</strong>.
                      </p>
                    )}
                    {selectedBrand === 'vivo' && (
                      <p>
                        Cài đặt &rarr; Pin &rarr; Quản lý tiêu thụ điện năng nền cao &rarr; Cho phép Danh Ngôn tiếp tục chạy nền.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: YÊU THÍCH (FAVORITES) */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neutral-200">
                  Danh ngôn đã lưu ({favoriteQuotesList.length})
                </span>
                <span className="text-xs text-neutral-400">Lưu trong bộ nhớ cục bộ (Room)</span>
              </div>

              {favoriteQuotesList.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-2xl bg-neutral-800/30 border border-neutral-800 space-y-2">
                  <Heart className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-sm text-neutral-400">Chưa có danh ngôn yêu thích nào</p>
                  <p className="text-xs text-neutral-500">
                    Bấm vào biểu tượng trái tim khi xem bất kỳ câu nào để lưu lại tại đây.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {favoriteQuotesList.map(({ quote, savedAt }) => {
                    if (!quote) return null;
                    return (
                      <div
                        key={quote.id}
                        className="group relative p-3.5 rounded-2xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-750 transition-all flex flex-col gap-2"
                      >
                        <div
                          onClick={() => {
                            onSelectQuote(quote.id);
                            onClose();
                          }}
                          className="cursor-pointer space-y-1"
                        >
                          <p className="text-xs font-quote-lora italic text-neutral-100 leading-relaxed">
                            “{quote.text}”
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-amber-300">
                            <span>— {quote.author}</span>
                            <span className="text-neutral-500 text-[10px]">
                              {new Date(savedAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-neutral-700/50">
                          <button
                            onClick={() => {
                              onSelectQuote(quote.id);
                              onClose();
                            }}
                            className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Mở xem toàn màn hình</span>
                          </button>

                          <button
                            onClick={() => onRemoveFavorite(quote.id)}
                            title="Xóa khỏi yêu thích"
                            className="text-neutral-500 hover:text-rose-400 p-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GIỚI THIỆU (ABOUT) */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-800/80 to-neutral-850 border border-neutral-750 space-y-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="text-sm font-semibold text-white">Triết lý thiết kế</h3>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-quote-lora italic">
                  “Đưa danh ngôn đến người dùng mà không làm phiền họ.”
                </p>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  App hoạt động hoàn toàn im lặng. Không âm báo giật mình, không pop-up quảng cáo, không thúc ép. Mỗi khi bạn cầm điện thoại lên vào sáng sớm (5h), giữa trưa (12h) hoặc buổi tối (20h), một thông điệp ý nghĩa đã đợi sẵn trên màn hình khóa.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Điểm nhấn kỹ thuật
                </h4>
                <div className="grid gap-2 text-xs text-neutral-300">
                  <div className="p-3 rounded-xl bg-neutral-850 border border-neutral-800 flex justify-between items-center">
                    <span>Màn hình & vuốt</span>
                    <strong className="text-neutral-200">Jetpack Compose HorizontalPager</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-850 border border-neutral-800 flex justify-between items-center">
                    <span>Thông báo nền</span>
                    <strong className="text-neutral-200">WorkManager + NotificationCompat</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-850 border border-neutral-800 flex justify-between items-center">
                    <span>Lưu trữ cục bộ</span>
                    <strong className="text-neutral-200">Room (Yêu thích) + DataStore (Cài đặt)</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-850 border border-neutral-800 flex justify-between items-center">
                    <span>Xuất ảnh chia sẻ</span>
                    <strong className="text-neutral-200">Canvas Bitmap (1:1 &amp; 9:16 Story)</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onShowGreetingModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-amber-400 font-medium text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Xem lại lời chào lần đầu mở app</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: HƯỚNG DẪN SỬ DỤNG (GUIDE) */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">Hướng dẫn sử dụng đơn giản</h3>
                <p className="text-xs text-neutral-400">5 bước trải nghiệm trọn vẹn ứng dụng:</p>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3.5 p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-750">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-neutral-200">Nhận thông báo trên màn hình khóa</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Thông báo đến lặng lẽ đúng các mốc giờ đã hẹn (5h, 12h, 20h). Bạn chỉ cần nhấc máy là nhìn thấy.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-750">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-neutral-200">Chạm vào để mở toàn màn hình</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Chạm vào thông báo sẽ mở ngay câu danh ngôn đó với hình nền nghệ thuật tương ứng.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-amber-300">Vuốt ngang để đổi câu &amp; hình nền</h4>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      Vuốt sang trái hoặc phải (hoặc bấm mũi tên). Mỗi câu danh ngôn mới sẽ tự động được chọn 1 trong ~20 hình nền ngẫu nhiên.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-750">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-neutral-200">Lưu yêu thích &amp; Xuất ảnh chia sẻ</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Bấm nút Trái tim để lưu vào bộ sưu tập. Bấm nút Chia sẻ để xuất ảnh tỉ lệ Vuông 1:1 hoặc Dọc 9:16 có sẵn font chữ đẹp mắt.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-750">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                    5
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-neutral-200">Tùy biến giờ nhận trong Cài đặt</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      Vào Menu &rarr; Cài đặt để đổi số lần (tắt, 1, 2, 3), điều chỉnh giờ và chọn chủ đề bạn yêu thích.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
