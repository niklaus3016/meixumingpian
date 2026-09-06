import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Sparkles, Flame, Plus, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { CardTemplate, TemplateCategory } from '../types';
import { CATEGORIES } from '../data/materials';
import { TEMPLATES } from '../data/templates';
import { TemplateCard } from './TemplateCard';

interface TemplateGridProps {
  onSelectTemplate: (template: CardTemplate) => void;
  onCreateBlank: () => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  onSelectTemplate,
  onCreateBlank,
  favoriteIds,
  onToggleFavorite,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all'); // 'all' | 'hot' | 'new' | category_id
  const [searchQuery, setSearchQuery] = useState('');
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);

  // Mouse wheel horizontal scroll handler
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (filterContainerRef.current) {
      filterContainerRef.current.scrollLeft += e.deltaY || e.deltaX;
    }
  };

  // Mouse drag-to-scroll handlers (for desktop mouse preview)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!filterContainerRef.current) return;
    setIsDragging(true);
    setHasMoved(false);
    setStartX(e.pageX - filterContainerRef.current.offsetLeft);
    setScrollLeft(filterContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !filterContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - filterContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    if (Math.abs(walk) > 4) {
      setHasMoved(true);
    }
    filterContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Filter templates based on selected pill and search keyword
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      // Filter tab match
      if (activeFilter === 'hot') {
        if (!t.isHot) return false;
      } else if (activeFilter === 'new') {
        if (!t.isNew) return false;
      } else if (activeFilter !== 'all') {
        if (t.category !== activeFilter) return false;
      }

      // Keyword Search
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const inName = t.name.toLowerCase().includes(query);
        const inDesc = t.description.toLowerCase().includes(query);
        const inTags = t.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!inName && !inDesc && !inTags) return false;
      }

      return true;
    });
  }, [activeFilter, searchQuery]);

  // Unified Filter Options
  const filterOptions = [
    { id: 'all', label: '全部' },
    { id: 'hot', label: '🔥 热门', isSpecial: true },
    { id: 'new', label: '✨ 最新', isSpecial: true },
    ...CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
      id: c.id,
      label: c.name,
      isSpecial: false,
    })),
  ];

  const handleSelectFilter = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasMoved) return; // Ignore click if user was dragging
    setActiveFilter(id);
    // Smoothly scroll active button into center view
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  return (
    <div className="flex flex-col w-full h-full pb-20 overflow-y-auto bg-[#F9FAFB]">
      {/* Top Mobile Sticky Header */}
      <div className="px-3.5 pt-3 pb-2.5 bg-white sticky top-0 z-20 border-b border-gray-200 shadow-xs">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* App Icon */}
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shadow-xs shrink-0 font-black text-sm tracking-tighter">
              美序
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <h1 className="text-base font-bold text-gray-900 tracking-tight">美序名片</h1>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-md border border-gray-200 uppercase">
                  Design
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 font-medium leading-none">
                {TEMPLATES.length}+ 高颜值设计模板 · 300DPI 印刷导出
              </p>
            </div>
          </div>

          {/* Quick Create Blank Button */}
          <button
            id="create-blank-btn"
            onClick={onCreateBlank}
            className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-full text-xs font-semibold hover:bg-gray-800 active:scale-95 transition-all shrink-0 shadow-xs"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>新建空白</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 pointer-events-none" size={15} />
          <input
            id="template-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索模板风格 / 职业 / 色系..."
            className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white transition-all font-sans"
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 text-gray-400 hover:text-gray-700 p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Unified Horizontal Filter Bar with Drag-to-Scroll & Touch Scroll & Wheel Scroll */}
        <div className="relative mt-2.5">
          <div
            ref={filterContainerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 select-none touch-pan-x cursor-grab ${
              isDragging ? 'cursor-grabbing' : ''
            }`}
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {filterOptions.map((opt) => {
              const isActive = activeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`filter-pill-${opt.id}`}
                  onClick={(e) => handleSelectFilter(opt.id, e)}
                  className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-black text-white font-semibold shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 font-medium'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subheader: Template Count */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
        <span className="text-[11px]">
          共 <strong className="text-gray-900 font-bold">{filteredTemplates.length}</strong> 款设计模板
        </span>
        <span className="text-[11px] text-gray-400">点击卡片直接编辑</span>
      </div>

      {/* 2-Column Responsive Mobile Grid */}
      <div className="px-3 pb-4">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isFavorite={favoriteIds.includes(template.id)}
                onSelect={onSelectTemplate}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3 border border-gray-200">
              <Search size={22} />
            </div>
            <h4 className="text-sm font-bold text-gray-900">未找到相关名片模板</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              换个关键词试试，或直接从空白画布开始自由设计
            </p>
            <div className="flex gap-2 mt-4">
              <button
                id="reset-search-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                重置筛选
              </button>
              <button
                id="empty-create-blank-btn"
                onClick={onCreateBlank}
                className="px-4 py-1.5 text-xs bg-black text-white font-bold rounded-xl shadow-xs hover:bg-gray-800 transition-colors"
              >
                从空白开始
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
