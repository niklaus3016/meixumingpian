import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import * as LucideIcons from 'lucide-react';
import { CardBackground, CardElement, CardSideData } from '../types';

interface CardCanvasProps {
  sideData: CardSideData;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CardElement['style']>) => void;
  scale?: number; // visual zoom scale
  showBleedGuide?: boolean;
  interactive?: boolean;
  /** 导出 PNG 透明背景时置为 true：不渲染底色/底图/纹理 */
  transparentBg?: boolean;
  forwardedRef?: React.RefObject<HTMLDivElement | null>;
}

export const CardCanvas: React.FC<CardCanvasProps> = ({
  sideData,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  scale = 1,
  showBleedGuide = false,
  interactive = true,
  transparentBg = false,
  forwardedRef,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const [elementStartPos, setElementStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);

  // Set the forwardedRef if provided
  useEffect(() => {
    if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = containerRef.current;
    }
  }, [forwardedRef]);

  // Handle Drag Move for selected element
  const handlePointerDown = (e: React.PointerEvent, element: CardElement) => {
    if (!interactive || element.style.locked || element.style.hidden) return;
    e.stopPropagation();
    onSelectElement(element.id);
    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setElementStartPos({ x: element.style.x, y: element.style.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartPos || !elementStartPos || !selectedElementId) return;

    const deltaX = (e.clientX - dragStartPos.x) / scale;
    const deltaY = (e.clientY - dragStartPos.y) / scale;

    let nextX = Math.round(elementStartPos.x + deltaX);
    let nextY = Math.round(elementStartPos.y + deltaY);

    // Snap to horizontal / vertical center guides
    if (Math.abs(nextX - 450) < 6) nextX = 450;
    if (Math.abs(nextY - 270) < 6) nextY = 270;

    onUpdateElement(selectedElementId, { x: nextX, y: nextY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragStartPos(null);
    setElementStartPos(null);
    setIsResizing(false);
    setResizeStart(null);
  };

  // Resize via bottom-right handle (only for elements with explicit width & height)
  const isSizedElement = (el: CardElement) =>
    typeof el.style.width === 'number' && typeof el.style.height === 'number';

  const handleResizeStart = (e: React.PointerEvent, element: CardElement) => {
    if (!interactive || element.style.locked) return;
    e.stopPropagation();
    onSelectElement(element.id);
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: element.style.width || 100,
      h: element.style.height || 100,
    });
  };

  const handleResizeMove = (e: React.PointerEvent) => {
    if (!isResizing || !resizeStart || !selectedElementId) return;
    const dx = (e.clientX - resizeStart.x) / scale;
    const dy = (e.clientY - resizeStart.y) / scale;
    onUpdateElement(selectedElementId, {
      width: Math.max(20, Math.round(resizeStart.w + dx)),
      height: Math.max(8, Math.round(resizeStart.h + dy)),
    });
  };

  const handleContainerPointerMove = (e: React.PointerEvent) => {
    if (isResizing) {
      handleResizeMove(e);
      return;
    }
    handlePointerMove(e);
  };

  return (
    <div
      ref={containerRef}
      id="card-render-canvas"
      onPointerMove={handleContainerPointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={() => interactive && onSelectElement(null)}
      className="relative overflow-hidden shadow-2xl transition-shadow select-none"
      style={{
        width: 900,
        height: 540,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        backgroundColor: transparentBg ? 'transparent' : getBgColor(sideData.background),
        backgroundImage: transparentBg ? 'none' : getBgImage(sideData.background),
        backgroundSize: !transparentBg && sideData.background.type === 'image' ? 'cover' : undefined,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Pattern overlay if configured */}
      {sideData.background.pattern && !transparentBg && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: getPatternSvg(sideData.background.pattern),
            backgroundSize: '24px 24px',
            opacity: sideData.background.patternOpacity ?? 0.15,
          }}
        />
      )}

      {/* 3mm Bleed Guideline (dashed rectangle at 30px margin in 900x540 canvas) */}
      {showBleedGuide && (
        <div
          className="absolute inset-7.5 border border-dashed border-red-500/60 pointer-events-none z-50 flex items-start justify-end p-2"
        >
          <span className="bg-red-500/80 text-white text-[11px] px-1.5 py-0.5 rounded font-mono font-medium">
            3mm 安全裁切线
          </span>
        </div>
      )}

      {/* Render Elements Sorted by zIndex */}
      {sideData.elements
        .slice()
        .sort((a, b) => (a.style.zIndex || 0) - (b.style.zIndex || 0))
        .map((el) => {
          if (el.style.hidden) return null;
          const isSelected = selectedElementId === el.id;

          return (
            <div
              key={el.id}
              id={`card-element-${el.id}`}
              onPointerDown={(e) => handlePointerDown(e, el)}
              className={`absolute cursor-pointer transition-all ${
                isSelected && interactive
                  ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-transparent'
                  : ''
              }`}
              style={{
                left: el.style.x,
                top: el.style.y,
                width: el.style.width,
                height: el.style.height,
                transform: `rotate(${el.style.rotation || 0}deg)`,
                opacity: el.style.opacity ?? 1,
                zIndex: el.style.zIndex,
                pointerEvents: interactive ? 'auto' : 'none',
              }}
            >
              {renderElementContent(el)}

              {/* Selection border + functional resize handle (sized elements only) */}
              {isSelected && interactive && (
                <div className="absolute -inset-1 border border-blue-500 pointer-events-none rounded-xs">
                  {isSizedElement(el) && (
                    <div
                      onPointerDown={(e) => handleResizeStart(e, el)}
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-500 rounded-full pointer-events-auto cursor-nwse-resize"
                      title="拖拽缩放"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

// Helper: Render Dynamic Lucide Icon
const DynamicIcon: React.FC<{ name: string; size?: number; color?: string }> = ({
  name,
  size = 20,
  color = 'currentColor',
}) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <IconComponent size={size} color={color} />;
};

// Helper: Dynamic QR Code Element
const QrCodeElement: React.FC<{ content: string; style: CardElement['style'] }> = ({
  content,
  style,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const isDirectImage = Boolean(
    content && (content.startsWith('data:image') || content.startsWith('blob:') || content.startsWith('http') && (content.endsWith('.png') || content.endsWith('.jpg') || content.endsWith('.jpeg') || content.endsWith('.webp')))
  );

  useEffect(() => {
    if (isDirectImage) {
      setDataUrl(content);
      return;
    }
    // 以 4 倍尺寸生成二维码再由 CSS 缩小显示，保证 4K 导出时码点清晰
    const qrRenderWidth = Math.min(Math.max(style.width || 130, 100) * 4, 1024);
    QRCode.toDataURL(content || 'https://meixu.card', {
      margin: 1,
      width: qrRenderWidth,
      color: {
        dark: style.color || '#000000',
        light: style.backgroundColor || '#FFFFFF',
      },
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error('QR generate error', err));
  }, [content, style.width, style.color, style.backgroundColor, isDirectImage]);

  return (
    <div
      style={{
        width: style.width || 130,
        height: style.height || 130,
        backgroundColor: style.backgroundColor || '#FFFFFF',
        borderRadius: style.borderRadius || 6,
        padding: style.padding || 4,
        border: style.borderWidth ? `${style.borderWidth}px solid ${style.borderColor || '#000'}` : undefined,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="QR Code"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-neutral-200 animate-pulse rounded" />
      )}
    </div>
  );
};

// Helper: Render Element Content
function renderElementContent(el: CardElement) {
  const { type, content, style } = el;

  switch (type) {
    case 'text':
      return (
        <div
          style={{
            fontFamily: style.fontFamily || "'Noto Sans SC', sans-serif",
            fontSize: style.fontSize || 16,
            fontWeight: style.fontWeight || 400,
            color: style.color || '#FFFFFF',
            letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : undefined,
            lineHeight: style.lineHeight || 1.4,
            textAlign: style.textAlign || 'left',
            textShadow: style.textShadow,
            WebkitTextStroke: style.textStroke,
            background: style.backgroundGradient || style.backgroundColor,
            padding: style.padding ? `${style.padding}px` : undefined,
            borderRadius: style.borderRadius ? `${style.borderRadius}px` : undefined,
            border: style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#000'}` : undefined,
            boxShadow: style.boxShadow,
            backdropFilter: style.backdropFilter,
            whiteSpace: 'pre-line',
          }}
        >
          {content}
        </div>
      );

    case 'icon':
      return (
        <div
          style={{
            color: style.color || '#D4AF37',
            padding: style.padding,
            background: style.backgroundGradient || style.backgroundColor,
            borderRadius: style.borderRadius,
            border: style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#000'}` : undefined,
            boxShadow: style.boxShadow,
          }}
        >
          <DynamicIcon name={content} size={style.fontSize || 24} color={style.color} />
        </div>
      );

    case 'qr':
      return <QrCodeElement content={content} style={style} />;

    case 'image':
      return (
        <div
          style={{
            width: style.width || 120,
            height: style.height || 120,
            borderRadius: style.borderRadius || 0,
            overflow: 'hidden',
            border: style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#fff'}` : undefined,
            boxShadow: style.boxShadow,
            filter: style.blur ? `blur(${style.blur}px)` : undefined,
          }}
        >
          <img
            src={content}
            alt="Card Asset"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      );

    case 'shape':
      return (
        <div
          style={{
            width: style.width || 100,
            height: style.height || 4,
            background: style.backgroundGradient || style.fillColor || '#D4AF37',
            borderRadius:
              style.shapeType === 'circle'
                ? '50%'
                : style.borderRadius !== undefined
                ? style.borderRadius
                : style.shapeType === 'rounded'
                ? 16
                : 0,
            border: style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#000'}` : undefined,
            boxShadow: style.boxShadow,
            backdropFilter: style.backdropFilter,
          }}
        />
      );

    default:
      return null;
  }
}

function getBgColor(bg: CardBackground): string {
  if (bg.type === 'solid') return bg.color || '#18181B';
  if (bg.type === 'pattern') return bg.color || '#18181B';
  return '#18181B';
}

function getBgImage(bg: CardBackground): string {
  if (bg.type === 'gradient' && bg.gradient) {
    if (bg.gradient.type === 'radial') {
      const colors = bg.gradient.colors.join(', ');
      return `radial-gradient(circle at 50% 50%, ${colors})`;
    }
    const angle = bg.gradient.angle ?? 135;
    const colors = bg.gradient.colors.join(', ');
    return `linear-gradient(${angle}deg, ${colors})`;
  }
  if (bg.type === 'image' && bg.imageUrl) {
    return `url("${bg.imageUrl}")`;
  }
  return 'none';
}

function getPatternSvg(pattern: string): string {
  switch (pattern) {
    case 'grid':
    case 'cyber-grid':
      return `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0H0v30h30V0zM1 1h28v28H1V1z' fill='%2300F2FE' fill-opacity='0.12'/%3E%3C/svg%3E")`;
    case 'dots':
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%23FFFFFF' fill-opacity='0.2'/%3E%3C/svg%3E")`;
    case 'luxury-lines':
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' stroke='%23D4AF37' stroke-width='0.8' fill='none' stroke-opacity='0.25'/%3E%3C/svg%3E")`;
    case 'circuit':
      return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0v20h20v20h20v20M0 10h20v20h20v20h20' stroke='%2300F2FE' stroke-width='1' fill='none' stroke-opacity='0.25'/%3E%3Ccircle cx='10' cy='20' r='2.5' fill='%2300FF88' fill-opacity='0.4'/%3E%3Ccircle cx='30' cy='40' r='2.5' fill='%2300F2FE' fill-opacity='0.4'/%3E%3Ccircle cx='40' cy='20' r='2.5' fill='%23FF007F' fill-opacity='0.4'/%3E%3C/svg%3E")`;
    case 'mesh':
    case 'neural-mesh':
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l40 40M40 0L0 40' stroke='%2338EF7D' stroke-width='0.6' stroke-opacity='0.18' fill='none'/%3E%3Ccircle cx='20' cy='20' r='2' fill='%2338EF7D' fill-opacity='0.3'/%3E%3C/svg%3E")`;
    case 'starfield':
      return `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='25' r='1' fill='%23FFFFFF' fill-opacity='0.8'/%3E%3Ccircle cx='70' cy='15' r='1.5' fill='%2300F2FE' fill-opacity='0.9'/%3E%3Ccircle cx='110' cy='60' r='0.8' fill='%23FFFFFF' fill-opacity='0.5'/%3E%3Ccircle cx='35' cy='85' r='1.2' fill='%23C084FC' fill-opacity='0.8'/%3E%3Ccircle cx='95' cy='105' r='1' fill='%23FFFFFF' fill-opacity='0.7'/%3E%3Ccircle cx='55' cy='55' r='0.6' fill='%2338EF7D' fill-opacity='0.6'/%3E%3Cpath d='M70 10v10M65 15h10' stroke='%2300F2FE' stroke-width='0.6' stroke-opacity='0.6'/%3E%3C/svg%3E")`;
    case 'energy-core':
      return `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='100' cy='100' r='60' stroke='%238B5CF6' stroke-width='1.5' stroke-dasharray='4 6' fill='none' stroke-opacity='0.4'/%3E%3Ccircle cx='100' cy='100' r='85' stroke='%2306B6D4' stroke-width='1' stroke-dasharray='2 8' fill='none' stroke-opacity='0.3'/%3E%3Cellipse cx='100' cy='100' rx='95' ry='38' stroke='%23EC4899' stroke-width='1' fill='none' stroke-opacity='0.35' transform='rotate(-25 100 100)'/%3E%3Cellipse cx='100' cy='100' rx='95' ry='38' stroke='%233B82F6' stroke-width='1' fill='none' stroke-opacity='0.35' transform='rotate(25 100 100)'/%3E%3C/svg%3E")`;
    case 'orbital-rings':
      return `url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cellipse cx='150' cy='150' rx='140' ry='50' stroke='%236366F1' stroke-width='1.2' fill='none' stroke-opacity='0.3' transform='rotate(-15 150 150)'/%3E%3Cellipse cx='150' cy='150' rx='130' ry='42' stroke='%2306B6D4' stroke-width='1.2' fill='none' stroke-opacity='0.35' transform='rotate(15 150 150)'/%3E%3Ccircle cx='150' cy='150' r='45' stroke='%23A855F7' stroke-width='1' stroke-dasharray='4 4' fill='none' stroke-opacity='0.4'/%3E%3C/svg%3E")`;
    case 'neon-hex':
      return `url("data:image/svg+xml,%3Csvg width='48' height='84' viewBox='0 0 48 84' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24 0l24 14v28L24 56 0 42V14zM24 84l24-14V42L24 28 0 42v28z' fill='none' stroke='%2300F2FE' stroke-width='0.8' stroke-opacity='0.15'/%3E%3C/svg%3E")`;
    default:
      return 'none';
  }
}
