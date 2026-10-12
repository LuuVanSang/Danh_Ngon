import { BackgroundPreset } from '../types';

import bgNatureMountain from '../assets/images/bg_nature_misty_mountain_1791768439787.jpg';
import bgWatercolorArt from '../assets/images/bg_watercolor_abstract_1791768451772.jpg';
import bgOilTwilight from '../assets/images/bg_oil_twilight_sky_1791768469636.jpg';
import bgLinenPaper from '../assets/images/bg_linen_paper_texture_1791768482467.jpg';

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // 1. Nhóm Thiên Nhiên (Nature)
  {
    id: 'bg-nature-01',
    name: 'Sương Khói Rừng Thông',
    category: 'nature',
    categoryName: 'Thiên nhiên',
    type: 'image',
    src: bgNatureMountain,
    cssBackground: `url(${bgNatureMountain}) center/cover no-repeat`,
    textColor: 'light',
    overlayOpacity: 0.35,
  },
  {
    id: 'bg-nature-02',
    name: 'Rừng Tre Tĩnh Mịch',
    category: 'nature',
    categoryName: 'Thiên nhiên',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #132a24 0%, #1c3d34 40%, #0d1e19 100%)',
    textColor: 'light',
    overlayOpacity: 0.25,
  },
  {
    id: 'bg-nature-03',
    name: 'Biển Đêm Ngàn Sao',
    category: 'nature',
    categoryName: 'Thiên nhiên',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #0b1526 0%, #15243e 50%, #060b14 100%)',
    textColor: 'light',
    overlayOpacity: 0.25,
  },
  {
    id: 'bg-nature-04',
    name: 'Ráng Thu Mờ Ảo',
    category: 'nature',
    categoryName: 'Thiên nhiên',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #382419 0%, #523724 45%, #231610 100%)',
    textColor: 'light',
    overlayOpacity: 0.25,
  },
  {
    id: 'bg-nature-05',
    name: 'Đỉnh Núi Tuyết Rạng Đông',
    category: 'nature',
    categoryName: 'Thiên nhiên',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #1b263b 0%, #304463 45%, #59475c 75%, #8f6e72 100%)',
    textColor: 'light',
    overlayOpacity: 0.3,
  },

  // 2. Nhóm Tối Giản (Minimalist)
  {
    id: 'bg-mini-01',
    name: 'Cát Ấm Travertine',
    category: 'minimalist',
    categoryName: 'Tối giản',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #efeae1 0%, #e2dad0 50%, #d4c9bd 100%)',
    textColor: 'dark',
    overlayOpacity: 0.1,
  },
  {
    id: 'bg-mini-02',
    name: 'Đá Đen Obsidian',
    category: 'minimalist',
    categoryName: 'Tối giản',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #141416 0%, #1a1a1f 50%, #0d0d0f 100%)',
    textColor: 'light',
    overlayOpacity: 0.2,
  },
  {
    id: 'bg-mini-03',
    name: 'Xanh Chàm Indigo',
    category: 'minimalist',
    categoryName: 'Tối giản',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #192231 0%, #222e42 50%, #131924 100%)',
    textColor: 'light',
    overlayOpacity: 0.25,
  },
  {
    id: 'bg-mini-04',
    name: 'Rêu Sương Bắc Âu',
    category: 'minimalist',
    categoryName: 'Tối giản',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #2a3430 0%, #394742 50%, #1f2724 100%)',
    textColor: 'light',
    overlayOpacity: 0.25,
  },
  {
    id: 'bg-mini-05',
    name: 'Đất Nung Hoàng Hôn',
    category: 'minimalist',
    categoryName: 'Tối giản',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #3d2621 0%, #4a2f29 50%, #261613 100%)',
    textColor: 'light',
    overlayOpacity: 0.25,
  },
  {
    id: 'bg-mini-06',
    name: 'Xanh Khói Lắng Đọng',
    category: 'minimalist',
    categoryName: 'Tối giản',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #24292e 0%, #313840 50%, #1b1e22 100%)',
    textColor: 'light',
    overlayOpacity: 0.2,
  },

  // 3. Nhóm Mộc Mạc (Rustic)
  {
    id: 'bg-rustic-01',
    name: 'Giấy Washi Sợi Lanh',
    category: 'rustic',
    categoryName: 'Mộc mạc',
    type: 'image',
    src: bgLinenPaper,
    cssBackground: `url(${bgLinenPaper}) center/cover no-repeat`,
    textColor: 'dark',
    overlayOpacity: 0.15,
  },
  {
    id: 'bg-rustic-02',
    name: 'Giấy Cổ Vàng Nhạt',
    category: 'rustic',
    categoryName: 'Mộc mạc',
    type: 'gradient',
    cssBackground: 'radial-gradient(circle at 50% 30%, #f6f0e4 0%, #ebe1cf 60%, #ded0b9 100%)',
    textColor: 'dark',
    overlayOpacity: 0.1,
  },
  {
    id: 'bg-rustic-03',
    name: 'Gỗ Trầm Thủy Trúc',
    category: 'rustic',
    categoryName: 'Mộc mạc',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #292019 0%, #3d3026 50%, #1d1611 100%)',
    textColor: 'light',
    overlayOpacity: 0.3,
  },
  {
    id: 'bg-rustic-04',
    name: 'Đá Cuội Trầm Ngâm',
    category: 'rustic',
    categoryName: 'Mộc mạc',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #2c2f33 0%, #3d4248 50%, #212327 100%)',
    textColor: 'light',
    overlayOpacity: 0.25,
  },

  // 4. Nhóm Nghệ Thuật (Art)
  {
    id: 'bg-art-01',
    name: 'Thủy Mặc Vẩy Vàng',
    category: 'art',
    categoryName: 'Nghệ thuật',
    type: 'image',
    src: bgWatercolorArt,
    cssBackground: `url(${bgWatercolorArt}) center/cover no-repeat`,
    textColor: 'dark',
    overlayOpacity: 0.2,
  },
  {
    id: 'bg-art-02',
    name: 'Sơn Dầu Chiều Tà',
    category: 'art',
    categoryName: 'Nghệ thuật',
    type: 'image',
    src: bgOilTwilight,
    cssBackground: `url(${bgOilTwilight}) center/cover no-repeat`,
    textColor: 'light',
    overlayOpacity: 0.3,
  },
  {
    id: 'bg-art-03',
    name: 'Mực Loang Thủy Mặc',
    category: 'art',
    categoryName: 'Nghệ thuật',
    type: 'gradient',
    cssBackground: 'radial-gradient(ellipse at 50% 30%, #2f343b 0%, #1c2024 60%, #101214 100%)',
    textColor: 'light',
    overlayOpacity: 0.25,
  },
  {
    id: 'bg-art-04',
    name: 'Cực Quang Huyền Ảo',
    category: 'art',
    categoryName: 'Nghệ thuật',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #0e1e2d 0%, #183e3c 45%, #252847 80%, #101222 100%)',
    textColor: 'light',
    overlayOpacity: 0.3,
  },
  {
    id: 'bg-art-05',
    name: 'Ánh Trăng Huyền Diệu',
    category: 'art',
    categoryName: 'Nghệ thuật',
    type: 'gradient',
    cssBackground: 'linear-gradient(180deg, #18233c 0%, #273754 50%, #151d2e 100%)',
    textColor: 'light',
    overlayOpacity: 0.25,
  },
];

/**
 * Chọn một hình nền ngẫu nhiên từ 20 hình, ưu tiên không trùng với hình nền vừa dùng
 */
export function getRandomBackground(excludeId?: string): BackgroundPreset {
  const eligible = BACKGROUND_PRESETS.filter((bg) => bg.id !== excludeId);
  if (eligible.length === 0) return BACKGROUND_PRESETS[0];
  const index = Math.floor(Math.random() * eligible.length);
  return eligible[index];
}
