import React, { useState, useEffect, useRef } from 'react';
import { Quote, BackgroundPreset } from '../types';
import { X, Download, Share2, Check, Loader2, Sparkles, Smartphone, Square } from 'lucide-react';
import { renderQuoteToCanvas, downloadQuoteImage, shareQuoteImage } from '../utils/canvasExport';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  background: BackgroundPreset;
  layoutStyle: 'classic' | 'minimal' | 'serif-elegant' | 'bracket-editorial';
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  quote,
  background,
  layoutStyle,
}) => {
  const [aspectRatio, setAspectRatio] = useState<'square' | 'story'>('story');
  const [isRendering, setIsRendering] = useState(true);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [actionDone, setActionDone] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Render preview canvas whenever options change
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;
    setIsRendering(true);

    const generatePreview = async () => {
      try {
        const canvas = await renderQuoteToCanvas({
          quote,
          background,
          aspectRatio,
          layoutStyle,
        });
        if (!isCancelled) {
          setPreviewDataUrl(canvas.toDataURL('image/png'));
          setIsRendering(false);
        }
      } catch (e) {
        console.error('Failed to generate preview canvas:', e);
        if (!isCancelled) setIsRendering(false);
      }
    };

    generatePreview();
    return () => {
      isCancelled = true;
    };
  }, [isOpen, quote, background, aspectRatio, layoutStyle]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setActionDone('downloading');
    await downloadQuoteImage({ quote, background, aspectRatio, layoutStyle });
    setActionDone('downloaded');
    setTimeout(() => setActionDone(null), 2500);
  };

  const handleShare = async () => {
    setActionDone('sharing');
    await shareQuoteImage({ quote, background, aspectRatio, layoutStyle });
    setActionDone('shared');
    setTimeout(() => setActionDone(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-ui">
      <div
        ref={containerRef}
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white">Xuất ảnh danh ngôn</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ratio Selector */}
        <div className="px-6 py-3 bg-neutral-900/60 border-b border-neutral-800/80 flex items-center justify-center gap-2">
          <button
            onClick={() => setAspectRatio('story')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              aspectRatio === 'story'
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md shadow-amber-500/20'
                : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-750'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Dọc 9:16 (Story / Màn hình khóa)</span>
          </button>

          <button
            onClick={() => setAspectRatio('square')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              aspectRatio === 'square'
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md shadow-amber-500/20'
                : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-750'
            }`}
          >
            <Square className="w-4 h-4" />
            <span>Vuông 1:1 (Bảng tin / Feed)</span>
          </button>
        </div>

        {/* Canvas Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-neutral-950/60 min-h-[320px]">
          {isRendering ? (
            <div className="flex flex-col items-center gap-3 text-neutral-400">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <span className="text-xs">Đang vẽ hình ảnh độ phân giải cao...</span>
            </div>
          ) : previewDataUrl ? (
            <div className="relative group max-w-full flex justify-center items-center">
              <img
                src={previewDataUrl}
                alt={`Danh ngôn ${quote.author}`}
                className={`rounded-2xl shadow-2xl object-contain border border-neutral-800 transition-all ${
                  aspectRatio === 'story'
                    ? 'max-h-[50vh] aspect-[9/16]'
                    : 'max-h-[46vh] aspect-square'
                }`}
              />
            </div>
          ) : (
            <div className="text-sm text-neutral-400">Không thể tải ảnh xem trước</div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-400 text-center sm:text-left">
            <span>Hình nền: <strong className="text-neutral-200">{background.name}</strong></span>
            <span className="mx-2">·</span>
            <span>Kèm watermark nhỏ bảo vệ bản quyền</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownload}
              disabled={isRendering}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {actionDone === 'downloaded' ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Đã tải về!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Tải ảnh PNG</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              disabled={isRendering}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50"
            >
              {actionDone === 'shared' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã gửi!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Chia sẻ ngay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
