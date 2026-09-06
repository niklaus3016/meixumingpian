import React, { useState, useEffect } from 'react';
import {
  HardDrive,
  HelpCircle,
  Shield,
  Info,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Trash2,
  Lock,
  Cpu,
} from 'lucide-react';
import { getStorageSize, clearAllData } from '../utils/storage';

interface SettingsViewProps {
  onOpenTutorials: () => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onOpenTutorials,
  onOpenAbout,
  onOpenPrivacy,
}) => {
  const [storageSize, setStorageSize] = useState<string>('0 KB');
  const [clearing, setClearing] = useState<boolean>(false);

  useEffect(() => {
    setStorageSize(getStorageSize());
  }, []);

  const handleClearCache = () => {
    if (
      window.confirm(
        '⚠️ 警告：清理缓存将永久删除所有未导出的本地名片草稿与作品，是否继续？'
      )
    ) {
      setClearing(true);
      clearAllData();
      setStorageSize(getStorageSize());
      setTimeout(() => {
        setClearing(false);
        window.location.reload();
      }, 300);
    }
  };

  return (
    <div className="flex flex-col w-full h-full pb-20 overflow-y-auto bg-[#F9FAFB]">
      {/* Top Header */}
      <div className="px-5 pt-6 pb-4 bg-white border-b border-gray-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <div className="w-5 h-5 border-2 border-white rotate-45" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              应用设置
            </h1>
          </div>
        </div>
      </div>

      {/* Main Settings List */}
      <div className="p-4 space-y-4 flex-1">
        {/* Section 1: Storage Management */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase px-1">
            存储与数据管理
          </span>
          <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                  <HardDrive size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">本地存储空间</h4>
                </div>
              </div>
              <button
                id="clear-cache-btn"
                onClick={handleClearCache}
                disabled={clearing}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>{clearing ? '清理中...' : '清理缓存'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Guide & Legal */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase px-1">
            指南与说明
          </span>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 shadow-xs">
            <button
              id="open-tutorials-btn"
              onClick={onOpenTutorials}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HelpCircle size={17} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-900 block">名片排版美学与印刷指南</span>
                  <span className="text-[10px] text-gray-400">90×54mm 标准规格 · 300DPI 印刷出血与材质搭配</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button
              id="open-privacy-btn"
              onClick={onOpenPrivacy}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Shield size={17} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-900 block">隐私保护政策与数据安全</span>
                  <span className="text-[10px] text-gray-400">零服务器上传 · 离线私密沙盒保障</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            <button
              id="open-about-btn"
              onClick={onOpenAbout}
              className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center">
                  <Info size={17} />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-900 block">关于《美序名片》</span>
                  <span className="text-[10px] text-gray-400">版本 V1.0 · 专业级商务名片设计系统</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Section 3: Engine Specs */}
        <div className="p-3 bg-gray-100/70 border border-gray-200/80 rounded-2xl text-[11px] text-gray-500 space-y-1">
          <div className="flex items-center justify-between font-mono">
            <span className="text-gray-600">渲染核心引擎</span>
            <span className="font-semibold text-gray-800">Vector Canvas 300DPI</span>
          </div>
          <div className="flex items-center justify-between font-mono">
            <span className="text-gray-600">国际印刷规格</span>
            <span className="font-semibold text-gray-800">90 × 54 mm (含 3mm 出血)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
