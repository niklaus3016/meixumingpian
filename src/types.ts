export type ElementType = 'text' | 'image' | 'icon' | 'qr' | 'shape';

export type TemplateCategory =
  | 'all'
  | 'tech'
  | 'business'
  | 'minimal'
  | 'social'
  | 'creative'
  | 'oriental'
  | 'student'
  | 'freelance'
  | 'luxury'
  | 'monochrome';

export type MainTab = 'templates' | 'works' | 'profile' | 'settings';

export interface CategoryInfo {
  id: TemplateCategory;
  name: string;
  iconName: string;
}

export type TextType =
  | 'name'
  | 'title'
  | 'company'
  | 'phone'
  | 'wechat'
  | 'email'
  | 'address'
  | 'slogan'
  | 'custom';

export interface CardElementStyle {
  // Positioning & Dimension in 900x540 canvas coordinates
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  opacity?: number;
  zIndex: number;
  locked?: boolean;
  hidden?: boolean;

  // Typography
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textAlign?: 'left' | 'center' | 'right';
  textShadow?: string;
  textStroke?: string;
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;

  // Graphics & Shape & Image
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  shapeType?: 'rectangle' | 'circle' | 'line' | 'rounded' | 'badge';
  fillColor?: string;
  backgroundGradient?: string;
  boxShadow?: string;
  backdropFilter?: string;
  blur?: number;
}

export interface CardElement {
  id: string;
  type: ElementType;
  textType?: TextType;
  content: string; // text string, image data URL, icon identifier, QR payload
  style: CardElementStyle;
}

export interface CardBackground {
  type: 'solid' | 'gradient' | 'pattern' | 'image';
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    angle?: number;
    colors: string[];
    stops?: number[];
  };
  pattern?:
    | 'grid'
    | 'dots'
    | 'marble'
    | 'luxury-lines'
    | 'mesh'
    | 'stripes'
    | 'circuit'
    | 'neural-mesh'
    | 'cyber-grid'
    | 'starfield'
    | 'energy-core'
    | 'orbital-rings'
    | 'neon-hex';
  patternOpacity?: number;
  imageUrl?: string;
  opacity?: number;
}

export interface CardSideData {
  background: CardBackground;
  elements: CardElement[];
}

export interface CardData {
  id?: string;
  name: string;
  widthMm: number; // default 90mm
  heightMm: number; // default 54mm
  activeSide: 'front' | 'back';
  front: CardSideData;
  back: CardSideData;
  themeId?: string;
}

export interface DraftData {
  data: CardData;
  templateId?: string;
  updatedAt: number;
}

export interface CardTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  tags: string[];
  isHot?: boolean;
  isNew?: boolean;
  description: string;
  defaultData: CardData;
  author?: string;
}

export interface ProjectItem {
  id: string;
  templateId?: string;
  name: string;
  updatedAt: number;
  createdAt: number;
  data: CardData;
  isFavorite?: boolean;
  exportCount?: number;
}

export type ExportFormat = 'png' | 'jpg' | 'pdf';
export type ExportResolution = '720p' | '1080p' | '2k' | '4k';

export interface ExportSettings {
  format: ExportFormat;
  resolution: ExportResolution;
  transparentBg?: boolean; // For PNG
  includeBleed?: boolean; // 3mm bleed margin for print
  includeCropMarks?: boolean; // Crosshair corner marks
  exportSide: 'front' | 'back' | 'both';
  fileName: string;
  quality: number; // 0.8 - 1.0 for JPG
}
