import React from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface AgreementModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * 协议全文查看弹窗：《用户服务协议》/《隐私政策》共用。
 * 层级高于启动同意弹窗（z-[60]），供其内链接跳转查看。
 */
export const AgreementModal: React.FC<AgreementModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-80 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[85vh] overflow-hidden shadow-2xl border border-gray-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
          </div>
          <button
            id="close-agreement-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-90 transition-transform hover:bg-gray-200 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>
        {/* Scrollable full text */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
};
