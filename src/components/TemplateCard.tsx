import React from 'react';
import { Heart, Sparkles, Flame } from 'lucide-react';
import { CardTemplate } from '../types';
import { CardThumbnail } from './CardThumbnail';

interface TemplateCardProps {
  template: CardTemplate;
  isFavorite: boolean;
  onSelect: (template: CardTemplate) => void;
  onToggleFavorite: (templateId: string, e: React.MouseEvent) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isFavorite,
  onSelect,
  onToggleFavorite,
}) => {
  return (
    <div
      id={`template-card-${template.id}`}
      onClick={() => onSelect(template)}
      className="group relative flex flex-col bg-white border border-gray-200/90 hover:border-gray-900 rounded-2xl overflow-hidden cursor-pointer transition-all duration-150 active:scale-[0.98] shadow-xs hover:shadow-md"
    >
      {/* Miniature Card Canvas Preview Container */}
      <div className="relative w-full aspect-5/3 bg-gray-100/90 overflow-hidden flex items-center justify-center border-b border-gray-100">
        {/* Full-bleed Uncropped Responsive Thumbnail */}
        <CardThumbnail sideData={template.defaultData.front} />

        {/* Hot / New Badge */}
        <div className="absolute top-2 left-2 flex gap-1 z-10 pointer-events-none">
          {template.isHot && (
            <span className="flex items-center gap-1 bg-black/85 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              <Flame size={10} className="text-amber-400 fill-amber-400" />
              HOT
            </span>
          )}
          {template.isNew && (
            <span className="flex items-center gap-1 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              <Sparkles size={10} />
              NEW
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          id={`fav-btn-${template.id}`}
          onClick={(e) => onToggleFavorite(template.id, e)}
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 ${
            isFavorite
              ? 'bg-white text-rose-500 shadow-sm ring-1 ring-rose-200'
              : 'bg-white/80 hover:bg-white text-gray-400 hover:text-gray-900 shadow-xs border border-gray-200/60'
          }`}
          title={isFavorite ? '取消收藏' : '收藏模板'}
        >
          <Heart size={13} className={isFavorite ? 'fill-rose-500 text-rose-500' : ''} />
        </button>
      </div>

      {/* Card Info Details */}
      <div className="p-3 flex flex-col justify-between flex-1 bg-white">
        <div>
          <h3 className="text-[13px] font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
            {template.name}
          </h3>
          <p className="text-[11px] text-gray-500 truncate mt-0.5">
            {template.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1 mt-2 overflow-hidden">
          {template.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md whitespace-nowrap"
            >
              #{tag}
            </span>
          ))}
          {template.tags.length > 2 && (
            <span className="text-[9px] text-gray-400 font-mono">
              +{template.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
