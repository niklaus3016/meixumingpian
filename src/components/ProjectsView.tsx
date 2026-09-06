import React, { useState } from 'react';
import {
  FolderOpen,
  Edit3,
  Trash2,
  Copy,
  Heart,
  Plus,
  Clock,
  Download,
  Search,
  X,
} from 'lucide-react';
import { ProjectItem } from '../types';
import { CardThumbnail } from './CardThumbnail';

interface ProjectsViewProps {
  projects: ProjectItem[];
  onEditProject: (project: ProjectItem) => void;
  onDuplicateProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCreateNew: () => void;
  onExportProject: (project: ProjectItem) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onEditProject,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavorite,
  onCreateNew,
  onExportProject,
}) => {
  const [filterFavOnly, setFilterFavOnly] = useState(false);
  const [searchKey, setSearchKey] = useState('');

  const filtered = projects.filter((p) => {
    if (filterFavOnly && !p.isFavorite) return false;
    if (searchKey.trim()) {
      return p.name.toLowerCase().includes(searchKey.trim().toLowerCase());
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full h-full pb-20 overflow-y-auto bg-[#F9FAFB]">
      {/* Top Mobile Sticky Header */}
      <div className="px-3.5 pt-3 pb-2.5 bg-white sticky top-0 z-20 border-b border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
              <FolderOpen size={15} />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">我的作品</h1>
              <p className="text-[10px] text-gray-400 font-medium">已保存与历史名片 · {projects.length} 项</p>
            </div>
          </div>

          <button
            id="new-card-project-btn"
            onClick={onCreateNew}
            className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-full text-xs font-semibold shadow-xs hover:bg-gray-800 transition-colors"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>新建名片</span>
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Search size={14} className="absolute left-3 text-gray-400" />
            <input
              id="projects-search-input"
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="搜索作品名称..."
              className="w-full pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-sans"
            />
            {searchKey && (
              <button
                onClick={() => setSearchKey('')}
                className="absolute right-2.5 text-gray-400 hover:text-gray-700"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            id="fav-filter-btn"
            onClick={() => setFilterFavOnly(!filterFavOnly)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filterFavOnly
                ? 'bg-rose-50 text-rose-500 border-rose-200 font-semibold'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:text-gray-900'
            }`}
          >
            <Heart size={12} className={filterFavOnly ? 'fill-rose-500' : ''} />
            <span>收藏</span>
          </button>
        </div>
      </div>

      {/* Projects List Content */}
      <div className="p-3">
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((proj) => {
              const dateStr = new Date(proj.updatedAt).toLocaleDateString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={proj.id}
                  id={`project-card-${proj.id}`}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  {/* Card Thumbnail Box */}
                  <div
                    onClick={() => onEditProject(proj)}
                    className="relative w-full aspect-5/3 bg-gray-100/90 overflow-hidden flex items-center justify-center cursor-pointer border-b border-gray-100"
                  >
                    <CardThumbnail sideData={proj.data.front} />

                    {/* Favorite Button */}
                    <button
                      id={`fav-proj-${proj.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(proj.id);
                      }}
                      className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 ${
                        proj.isFavorite
                          ? 'bg-white text-rose-500 shadow-xs ring-1 ring-rose-200'
                          : 'bg-white/80 text-gray-400 hover:text-gray-900 shadow-xs border border-gray-200/60'
                      }`}
                    >
                      <Heart size={13} className={proj.isFavorite ? 'fill-rose-500' : ''} />
                    </button>
                  </div>

                  {/* Card Details & Actions */}
                  <div className="p-3 flex flex-col justify-between flex-1 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-bold text-gray-900 truncate">
                          {proj.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5 font-mono">
                          <Clock size={11} />
                          <span>{dateStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Button Operations */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`edit-proj-${proj.id}`}
                          onClick={() => onEditProject(proj)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold bg-black text-white hover:bg-gray-800 rounded-lg transition-colors shadow-xs"
                        >
                          <Edit3 size={11} />
                          编辑
                        </button>
                        <button
                          id={`export-proj-${proj.id}`}
                          onClick={() => onExportProject(proj)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                          <Download size={11} />
                          导出
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          id={`duplicate-proj-${proj.id}`}
                          onClick={() => onDuplicateProject(proj)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                          title="复制并复用"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          id={`delete-proj-${proj.id}`}
                          onClick={() => {
                            if (window.confirm(`确定要删除作品「${proj.name}」吗？`)) {
                              onDeleteProject(proj.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="删除作品"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Works State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3 border border-gray-200">
              <FolderOpen size={24} />
            </div>
            <h4 className="text-sm font-bold text-gray-900">暂无保存的名片作品</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              在模板库挑选心仪模板，编辑完成后点击「保存」即可在此随时修改与导出。
            </p>
            <button
              id="empty-new-card-btn"
              onClick={onCreateNew}
              className="mt-4 px-4 py-2 bg-black text-white font-semibold rounded-xl text-xs shadow-xs hover:bg-gray-800 transition-colors"
            >
              挑选模板开始制作
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
