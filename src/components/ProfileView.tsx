import React, { useState } from 'react';
import {
  Heart,
  FileText,
  Trash2,
  Edit,
} from 'lucide-react';
import { CardTemplate, DraftData } from '../types';
import { TEMPLATES } from '../data/templates';
import { TemplateCard } from './TemplateCard';

interface ProfileViewProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectTemplate: (template: CardTemplate) => void;
  draft: DraftData | null;
  onContinueDraft: (draft: DraftData) => void;
  onClearDraft: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  favoriteIds,
  onToggleFavorite,
  onSelectTemplate,
  draft,
  onContinueDraft,
  onClearDraft,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'drafts'>('favorites');

  // Favorite Templates List
  const favoriteTemplates = TEMPLATES.filter((t) => favoriteIds.includes(t.id));

  return (
    <div className="flex flex-col w-full h-full pb-20 overflow-y-auto bg-[#F9FAFB]">
      {/* Top Profile Header */}
      <div className="px-5 pt-6 pb-4 bg-white border-b border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <div className="w-5 h-5 border-2 border-white rotate-45" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>个人中心</span>
              <span className="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-600 rounded-full font-mono border border-blue-200 font-semibold">
                纯本地端
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              已收藏 {favoriteIds.length} 款模板 · 草稿箱 {draft ? '1' : '0'} 份
            </p>
          </div>
        </div>

        {/* Profile Tabs (2 Tabs: Favorites & Drafts) */}
        <div className="flex items-center gap-1.5 mt-4 bg-gray-100 p-1 rounded-xl border border-gray-200/80">
          <button
            id="tab-favs-btn"
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'favorites'
                ? 'bg-white text-gray-900 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Heart size={14} className={activeTab === 'favorites' ? 'fill-gray-900 text-gray-900' : ''} />
            <span>我的收藏 ({favoriteTemplates.length})</span>
          </button>

          <button
            id="tab-drafts-btn"
            onClick={() => setActiveTab('drafts')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'drafts'
                ? 'bg-white text-gray-900 shadow-xs font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <FileText size={14} />
            <span>草稿箱 {draft ? '(1)' : '(0)'}</span>
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="p-4 flex-1">
        {/* TAB 1: FAVORITES */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteTemplates.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {favoriteTemplates.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    isFavorite={true}
                    onSelect={onSelectTemplate}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-3 shadow-xs">
                  <Heart size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">暂无收藏的模板</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  在模板库浏览时，点击右上角的爱心图标即可快速收藏您喜欢的排版风格。
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DRAFTS */}
        {activeTab === 'drafts' && (
          <div>
            {draft ? (
              <div className="p-4 bg-white border border-gray-200 rounded-2xl space-y-3 shadow-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{draft.data.name || '未命名名片草稿'}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono">
                      上次自动保存:{' '}
                      {new Date(draft.updatedAt).toLocaleDateString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-mono font-semibold border border-blue-200">
                    自动暂存
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    id="continue-draft-btn"
                    onClick={() => onContinueDraft(draft)}
                    className="flex-1 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Edit size={14} />
                    继续编辑此草稿
                  </button>

                  <button
                    id="clear-draft-btn"
                    onClick={() => {
                      if (window.confirm('确定要放弃此草稿吗？')) {
                        onClearDraft();
                      }
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 rounded-xl text-xs transition-colors"
                    title="丢弃草稿"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 mb-3 shadow-xs">
                  <FileText size={24} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">草稿箱空空如也</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  在编辑器中设计名片时，系统会自动实时暂存当前进度，意外退出时可随时恢复。
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
