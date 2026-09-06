import React, { useState } from 'react';
import { ShieldCheck, FileText, Lock } from 'lucide-react';

export type LegalDocType = 'agreement' | 'privacy';

interface ConsentModalProps {
  /** 用户点击"同意并继续" */
  onAccept: () => void;
  /** 用户在二次确认后仍拒绝 */
  onDeclined: () => void;
  /** 打开《用户服务协议》或《隐私政策》全文 */
  onOpenDocument: (doc: LegalDocType) => void;
}

/**
 * 启动时的《用户协议与隐私政策》同意弹窗。
 * 拒绝需经二次确认，确认后由父组件展示阻断页。
 */
export const ConsentModal: React.FC<ConsentModalProps> = ({
  onAccept,
  onDeclined,
  onOpenDocument,
}) => {
  const [showDeclineConfirm, setShowDeclineConfirm] = useState(false);

  return (
    <>
      {/* 主同意弹窗（置于所有业务弹窗之上，屏幕居中） */}
      <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
        <div className="bg-white w-full max-w-sm border border-gray-200 shadow-2xl max-h-[85vh] overflow-y-auto rounded-3xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6">
            <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-5 text-center">
              用户协议与隐私政策
            </h3>
            <div className="mb-5 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Lock size={15} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  (1)《隐私政策》中关于本应用为纯离线应用、您的名片数据仅保存在本设备本地的说明。
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <FileText size={15} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  (2)《隐私政策》中关于本应用不收集、不上传、不与任何第三方共享个人信息的说明。
                </p>
              </div>
            </div>
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-2">用户协议和隐私政策说明：</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                阅读完整的
                <span
                  onClick={() => onOpenDocument('agreement')}
                  className="text-blue-600 hover:underline cursor-pointer font-medium"
                >
                  《用户服务协议》
                </span>
                和
                <span
                  onClick={() => onOpenDocument('privacy')}
                  className="text-blue-600 hover:underline cursor-pointer font-medium"
                >
                  《隐私政策》
                </span>
                了解详细内容。
              </p>
            </div>
          </div>
          <div className="flex border-t border-gray-200">
            <button
              id="consent-decline-btn"
              onClick={() => setShowDeclineConfirm(true)}
              className="flex-1 py-4 text-sm font-medium text-gray-700 bg-white border-r border-gray-200 rounded-bl-3xl hover:bg-gray-50 transition-colors"
            >
              不同意
            </button>
            <button
              id="consent-accept-btn"
              onClick={onAccept}
              className="flex-1 py-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-br-3xl transition-colors"
            >
              同意并继续
            </button>
          </div>
        </div>
      </div>

      {/* 拒绝二次确认弹窗 */}
      {showDeclineConfirm && (
        <div className="fixed inset-0 z-70 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex-1 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-3">确认拒绝</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                您确定要拒绝《用户服务协议》和《隐私政策》吗？拒绝后将无法使用美序名片。
              </p>
            </div>
            <div className="flex border-t border-gray-200">
              <button
                id="decline-cancel-btn"
                onClick={() => setShowDeclineConfirm(false)}
                className="flex-1 py-4 text-center text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors rounded-bl-3xl"
              >
                取消
              </button>
              <div className="w-px bg-gray-200"></div>
              <button
                id="decline-confirm-btn"
                onClick={onDeclined}
                className="flex-1 py-4 text-center text-sm text-blue-600 font-semibold hover:bg-gray-50 transition-colors rounded-br-3xl"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
