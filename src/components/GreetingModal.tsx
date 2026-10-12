import React from 'react';
import { Sparkles, BellOff, Compass, ArrowRight, Heart } from 'lucide-react';

interface GreetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GreetingModal: React.FC<GreetingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-neutral-900/95 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 tracking-wider uppercase">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Chào mừng bạn đến với</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-quote-playfair font-semibold text-white tracking-tight">
              Danh Ngôn Màn Hình Khóa
            </h2>
            <p className="text-sm text-neutral-400 font-ui leading-relaxed">
              Kho tàng hơn 500 danh ngôn tinh hoa Việt Nam — từ Chủ tịch Hồ Chí Minh, Đại thi hào Nguyễn Du, thiền sư, danh nhân lịch sử đến ca dao tục ngữ muôn đời.
            </p>
          </div>

          {/* Core Highlights */}
          <div className="grid gap-3 pt-2">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-800/50 border border-neutral-750">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                <BellOff className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-neutral-200">Thông báo im lặng tuyệt đối</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Xuất hiện nhẹ nhàng trên màn hình khóa 3 lần mỗi ngày (5h sáng, 12h trưa, 20h tối). Không chuông, không rung.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-800/50 border border-neutral-750">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-neutral-200">Khoảng 20 hình nền nghệ thuật</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Mỗi lần chuyển danh ngôn, app tự chọn ngẫu nhiên một hình nền hài hòa từ thiên nhiên, tối giản, mộc mạc và hội họa.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-neutral-800/50 border border-neutral-750">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-neutral-200">Vuốt xem, lưu thích và chia sẻ</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Vuốt ngang đổi câu bất cứ lúc nào, lưu lại câu tâm đắc và xuất ảnh chất lượng cao dạng Vuông (1:1) hoặc Dọc (9:16).
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-800">
            <span className="text-xs text-neutral-500">
              Bạn có thể xem lại lời chào này trong <strong className="text-neutral-400">Menu / Giới thiệu</strong>.
            </span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <span>Bắt đầu trải nghiệm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
