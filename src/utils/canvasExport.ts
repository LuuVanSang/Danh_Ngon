import { Quote, BackgroundPreset } from '../types';

export interface CanvasExportOptions {
  quote: Quote;
  background: BackgroundPreset;
  aspectRatio: 'square' | 'story'; // 'square' (1:1) or 'story' (9:16)
  layoutStyle?: 'classic' | 'minimal' | 'serif-elegant' | 'bracket-editorial';
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = `${currentLine} ${word}`;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

/**
 * Vẽ quote lên HTML5 Canvas với chất lượng cao
 */
export async function renderQuoteToCanvas(options: CanvasExportOptions): Promise<HTMLCanvasElement> {
  const { quote, background, aspectRatio, layoutStyle = 'classic' } = options;

  const width = 1080;
  const height = aspectRatio === 'square' ? 1080 : 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // 1. Vẽ nền
  if (background.type === 'image' && background.src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = background.src;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = () => {
        // Fallback gradient if image fails to load
        resolve(null);
      };
    });

    if (img.complete && img.naturalWidth > 0) {
      // Scale cover
      const hRatio = width / img.naturalWidth;
      const vRatio = height / img.naturalHeight;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (width - img.naturalWidth * ratio) / 2;
      const centerShiftY = (height - img.naturalHeight * ratio) / 2;
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, centerShiftX, centerShiftY, img.naturalWidth * ratio, img.naturalHeight * ratio);
    } else {
      ctx.fillStyle = '#1c1c24';
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    // Gradient nền tùy biến theo preset
    if (background.textColor === 'dark') {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#f2ece4');
      grad.addColorStop(0.5, '#e4dbcd');
      grad.addColorStop(1, '#d5c8b5');
      ctx.fillStyle = grad;
    } else {
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#101522');
      grad.addColorStop(0.5, '#1e2638');
      grad.addColorStop(1, '#0c0f17');
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Lớp phủ tương phản (Scrim / Overlay)
  const isDarkText = background.textColor === 'dark';
  ctx.fillStyle = isDarkText
    ? `rgba(255, 255, 255, ${background.overlayOpacity})`
    : `rgba(0, 0, 0, ${background.overlayOpacity + 0.15})`;
  ctx.fillRect(0, 0, width, height);

  // 3. Chuẩn bị màu chữ & bóng
  const primaryTextColor = isDarkText ? '#1a1a1e' : '#ffffff';
  const authorTextColor = isDarkText ? '#55555c' : 'rgba(255, 255, 255, 0.78)';
  const watermarkColor = isDarkText ? '#8c8c96' : 'rgba(255, 255, 255, 0.5)';

  if (!isDarkText) {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
  }

  // 4. Tính toán cỡ chữ tự động dựa trên độ dài câu
  const quoteLength = quote.text.length;
  let baseFontSize = aspectRatio === 'square' ? 52 : 58;
  if (quoteLength > 120) baseFontSize = 42;
  else if (quoteLength > 80) baseFontSize = 48;
  else if (quoteLength < 45) baseFontSize = 64;

  const fontFace = layoutStyle === 'serif-elegant' ? 'Playfair Display' : 'Lora';
  ctx.font = `italic 500 ${baseFontSize}px ${fontFace}, Georgia, serif`;
  ctx.fillStyle = primaryTextColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const maxTextWidth = width * 0.78;
  const quoteLines = wrapText(ctx, `“${quote.text}”`, maxTextWidth);
  const lineHeight = baseFontSize * 1.5;
  const totalQuoteHeight = quoteLines.length * lineHeight;

  // Tọa độ y trung tâm
  const centerY = height * (aspectRatio === 'square' ? 0.46 : 0.48);
  const startY = centerY - totalQuoteHeight / 2 + lineHeight / 2;

  // 5. Trang trí theo layoutStyle
  if (layoutStyle === 'bracket-editorial') {
    // Dấu ngoặc biên tập thanh lịch
    ctx.font = `300 90px ${fontFace}, Georgia, serif`;
    ctx.fillStyle = isDarkText ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)';
    ctx.fillText('“', width / 2, startY - lineHeight * 0.85);
    ctx.fillStyle = primaryTextColor;
  }

  // Vẽ các dòng danh ngôn
  ctx.font = `italic 500 ${baseFontSize}px ${fontFace}, Georgia, serif`;
  quoteLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * lineHeight);
  });

  // 6. Vẽ đường kẻ phân cách nhẹ (nếu là classic hoặc elegant)
  const lineY = startY + totalQuoteHeight + 25;
  if (layoutStyle !== 'minimal') {
    ctx.beginPath();
    ctx.moveTo(width / 2 - 35, lineY);
    ctx.lineTo(width / 2 + 35, lineY);
    ctx.strokeStyle = isDarkText ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // 7. Vẽ tên tác giả
  ctx.font = `500 28px 'Plus Jakarta Sans', -apple-system, sans-serif`;
  ctx.fillStyle = authorTextColor;
  ctx.letterSpacing = '1px';
  ctx.fillText(`— ${quote.author} —`, width / 2, lineY + 45);

  // 8. Watermark nhỏ tinh tế ở cạnh dưới
  ctx.shadowColor = 'transparent';
  ctx.font = `400 20px 'Plus Jakarta Sans', -apple-system, sans-serif`;
  ctx.fillStyle = watermarkColor;
  const watermarkY = height - 50;
  ctx.fillText('DANH NGÔN MÀN HÌNH KHÓA', width / 2, watermarkY);

  return canvas;
}

/**
 * Tải ảnh trực tiếp về máy
 */
export async function downloadQuoteImage(options: CanvasExportOptions, filename?: string): Promise<void> {
  const canvas = await renderQuoteToCanvas(options);
  const link = document.createElement('a');
  link.download = filename || `danh-ngon-${options.quote.id}-${options.aspectRatio}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Chia sẻ bằng Web Share API nếu hỗ trợ, fallback sang tải ảnh
 */
export async function shareQuoteImage(options: CanvasExportOptions): Promise<boolean> {
  const canvas = await renderQuoteToCanvas(options);

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        await downloadQuoteImage(options);
        resolve(true);
        return;
      }

      const file = new File([blob], `danh-ngon-${options.quote.id}.png`, { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'Danh Ngôn Màn Hình Khóa',
            text: `"${options.quote.text}" — ${options.quote.author}`,
            files: [file],
          });
          resolve(true);
          return;
        } catch (e) {
          if ((e as Error).name !== 'AbortError') {
            console.warn('Web Share failed, downloading fallback:', e);
            await downloadQuoteImage(options);
          }
          resolve(false);
          return;
        }
      }

      // Fallback
      await downloadQuoteImage(options);
      resolve(true);
    }, 'image/png');
  });
}
