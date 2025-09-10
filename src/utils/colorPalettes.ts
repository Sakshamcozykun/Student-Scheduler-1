import { ColorPalette } from '../types';

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'warm',
    name: 'Warm Sunset',
    background: '#F8EDEB',
    surface: '#FAE1DD',
    accent: '#FEC5BB',
    muted: '#E8E8E4',
    border: '#D8E2DC',
    eventColors: [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ]
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    background: '#E8F4FD',
    surface: '#D1E7DD',
    accent: '#0DCAF0',
    muted: '#E2E3E5',
    border: '#DEE2E6',
    eventColors: [
      '#0077BE', '#00A8CC', '#40E0D0', '#20B2AA', '#4682B4',
      '#5F9EA0', '#87CEEB', '#B0E0E6', '#AFEEEE', '#E0FFFF',
      '#006994', '#0099CC', '#33CCCC', '#66B2FF', '#99CCFF'
    ]
  },
  {
    id: 'forest',
    name: 'Forest Green',
    background: '#F0F8F0',
    surface: '#E8F5E8',
    accent: '#28A745',
    muted: '#E9ECEF',
    border: '#DEE2E6',
    eventColors: [
      '#228B22', '#32CD32', '#90EE90', '#98FB98', '#00FF7F',
      '#00FA9A', '#66CDAA', '#8FBC8F', '#20B2AA', '#3CB371',
      '#2E8B57', '#006400', '#556B2F', '#6B8E23', '#9ACD32'
    ]
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    background: '#F8F0FF',
    surface: '#F0E6FF',
    accent: '#8B5CF6',
    muted: '#E5E7EB',
    border: '#D1D5DB',
    eventColors: [
      '#8B5CF6', '#A855F7', '#C084FC', '#DDD6FE', '#9333EA',
      '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95', '#BE185D',
      '#DB2777', '#EC4899', '#F472B6', '#F9A8D4', '#FBB6CE'
    ]
  },
  {
    id: 'autumn',
    name: 'Autumn Leaves',
    background: '#FFF8F0',
    surface: '#FFF0E6',
    accent: '#FF8C42',
    muted: '#F5F5F5',
    border: '#E0E0E0',
    eventColors: [
      '#D2691E', '#CD853F', '#DEB887', '#F4A460', '#DAA520',
      '#B8860B', '#FF8C00', '#FF7F50', '#FF6347', '#FF4500',
      '#DC143C', '#B22222', '#A0522D', '#8B4513', '#654321'
    ]
  },
  {
    id: 'midnight',
    name: 'Midnight Theme',
    background: '#2D3748',
    surface: '#4A5568',
    accent: '#8B5CF6',
    muted: '#718096',
    border: '#A0AEC0',
    eventColors: [
      '#9AE6B4', '#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B',
      '#EF4444', '#3B82F6', '#84CC16', '#F97316', '#6366F1',
      '#14B8A6', '#F472B6', '#22D3EE', '#A3E635', '#FBBF24'
    ]
  },
  {
    id: 'dark-gradient',
    name: 'Dark Gradient',
    background: '#1a202c',
    surface: '#2d3748',
    accent: '#805ad5',
    muted: '#4a5568',
    border: '#718096',
    eventColors: [
      '#68d391', '#805ad5', '#f093fb', '#4299e1', '#fbb6ce',
      '#63b3ed', '#9f7aea', '#f6ad55', '#fc8181', '#38b2ac',
      '#81e6d9', '#fbd38d', '#a78bfa', '#f687b3', '#90cdf4'
    ]
  },
  {
    id: 'pastel',
    name: 'Soft Pastels',
    background: '#FEFEFE',
    surface: '#F8F9FA',
    accent: '#FFB3BA',
    muted: '#F1F3F4',
    border: '#E8EAED',
    eventColors: [
      '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
      '#C9C9FF', '#FFCCCB', '#FFE4E1', '#F0FFF0', '#F0FFFF',
      '#E6E6FA', '#FFF0F5', '#F5FFFA', '#F0F8FF', '#FFFAF0'
    ]
  }
];

export const getColorPalette = (id: string): ColorPalette => {
  return COLOR_PALETTES.find(palette => palette.id === id) || COLOR_PALETTES[0];
};