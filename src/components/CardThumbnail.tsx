import React, { useRef, useState, useEffect } from 'react';
import { CardSideData } from '../types';
import { CardCanvas } from './CardCanvas';

interface CardThumbnailProps {
  sideData: CardSideData;
  className?: string;
  shadow?: boolean;
}

export const CardThumbnail: React.FC<CardThumbnailProps> = ({
  sideData,
  className = '',
  shadow = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.2);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        // Business card canvas is 900x540 (ratio 5:3)
        setScale(width / 900);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-5/3 overflow-hidden flex items-center justify-center select-none ${className}`}
    >
      <div
        className={`pointer-events-none origin-top-left ${shadow ? 'shadow-md' : ''}`}
        style={{
          width: 900,
          height: 540,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <CardCanvas
          sideData={sideData}
          selectedElementId={null}
          onSelectElement={() => {}}
          onUpdateElement={() => {}}
          interactive={false}
          scale={1}
        />
      </div>
    </div>
  );
};
