import React from 'react';
import { X, CreditCard, ShieldCheck, Sparkles, Smartphone, Award, Cpu } from 'lucide-react';
import { TEMPLATES } from '../data/templates';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans">
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-base font-bold text-gray-900">关于《美序名片》</h2>
          <button
            id="close-about-modal-btn"
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-center bg-white">
          {/* App Brand Logo */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shadow-lg shadow-black/10 text-white font-black text-2xl mb-2">
              美序
            </div>
            <h3 className="text-lg font-bold text-gray-900">美序名片</h3>
            <span className="text-xs text-gray-500 mt-0.5">版本 V1.0 · com.meixumingpian.app</span>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 text-left text-xs space-y-2 text-gray-700">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <Cpu size={16} className="text-blue-600" />
              <span>纯前端本地离线架构</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              无需依赖后端服务器与数据库，名片排版、字体渲染、高清图片光栅化及 300DPI 印刷级 PDF 均在手机端本地即时运算生成，极速且安全。
            </p>
          </div>

          {/* Key Advantages */}
          <div className="grid grid-cols-2 gap-2 text-left text-xs">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles size={14} className="text-blue-600" />
                <span>{TEMPLATES.length}+ 精选模板</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">涵盖商务、轻奢、极简、古风等多元风格</p>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>0 数据泄露风险</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">名片联系信息与本地相册绝不上传云端</p>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 pt-2">
            © 2026 美序名片 团队 版权所有 · 让每一张名片都有美感与秩序
          </div>
        </div>

        <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-center">
          <button
            id="about-confirm-btn"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-xs"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};
