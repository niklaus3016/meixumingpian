import React from 'react';
import { LayoutGrid, FolderOpen, User, Settings } from 'lucide-react';
import { MainTab } from '../types';

interface AndroidFrameProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  hideTabBar?: boolean;
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  currentTab,
  onSelectTab,
  hideTabBar = false,
  children,
}) => {
  return (
    <div className="w-full h-screen bg-[#F9FAFB] flex flex-col justify-between overflow-hidden font-sans text-[#1A1A1A] max-w-md mx-auto sm:border-x sm:border-gray-200 sm:shadow-xl relative">
      {/* Dynamic App Content Body */}
      <div className="flex-1 w-full relative overflow-hidden flex flex-col bg-[#F9FAFB]">
        {children}
      </div>

      {/* App Bottom Navigation Tab Bar */}
      {!hideTabBar && (
        <nav
          id="app-bottom-nav"
          className="w-full bg-white/95 backdrop-blur-lg border-t border-gray-200/90 px-2 py-2 flex items-center justify-around z-40 shrink-0 shadow-xs"
        >
          <button
            id="nav-templates-btn"
            onClick={() => onSelectTab('templates')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all ${
              currentTab === 'templates'
                ? 'text-black font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <LayoutGrid size={21} strokeWidth={currentTab === 'templates' ? 2.5 : 1.8} />
            <span className="text-[11px] tracking-tight">模板库</span>
          </button>

          <button
            id="nav-works-btn"
            onClick={() => onSelectTab('works')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all ${
              currentTab === 'works'
                ? 'text-black font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <FolderOpen size={21} strokeWidth={currentTab === 'works' ? 2.5 : 1.8} />
            <span className="text-[11px] tracking-tight">我的作品</span>
          </button>

          <button
            id="nav-profile-btn"
            onClick={() => onSelectTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all ${
              currentTab === 'profile'
                ? 'text-black font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <User size={21} strokeWidth={currentTab === 'profile' ? 2.5 : 1.8} />
            <span className="text-[11px] tracking-tight">个人中心</span>
          </button>

          <button
            id="nav-settings-btn"
            onClick={() => onSelectTab('settings')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all ${
              currentTab === 'settings'
                ? 'text-black font-bold'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Settings size={21} strokeWidth={currentTab === 'settings' ? 2.5 : 1.8} />
            <span className="text-[11px] tracking-tight">设置</span>
          </button>
        </nav>
      )}
    </div>
  );
};
