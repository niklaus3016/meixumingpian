import React, { useState } from 'react';
import { X, BookOpen, Printer, Sparkles, Smartphone, ChevronRight } from 'lucide-react';
import { TUTORIALS, TutorialSection } from '../data/tutorials';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialSection>(TUTORIALS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans">
      <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200">
              <BookOpen size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">使用帮助与设计教程</h2>
              <p className="text-xs text-gray-500">名片排版美学与印刷实务知识</p>
            </div>
          </div>
          <button
            id="close-tutorial-modal-btn"
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Layout */}
        <div className="flex flex-col sm:flex-row flex-1 overflow-hidden bg-white">
          {/* Side List / Navigation */}
          <div className="sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200 bg-gray-50 p-2 sm:p-3 overflow-x-auto sm:overflow-y-auto flex sm:flex-col gap-1 shrink-0">
            {TUTORIALS.map((t) => {
              const isSelected = selectedTutorial.id === t.id;
              return (
                <button
                  key={t.id}
                  id={`tutorial-nav-${t.id}`}
                  onClick={() => setSelectedTutorial(t)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-left transition-colors whitespace-nowrap sm:whitespace-normal shrink-0 sm:w-full ${
                    isSelected
                      ? 'bg-white text-gray-900 border border-gray-200 shadow-xs font-semibold'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="text-xs font-medium truncate">{t.title}</div>
                  <ChevronRight size={14} className="hidden sm:block opacity-60 shrink-0 ml-1 text-gray-400" />
                </button>
              );
            })}
          </div>

          {/* Article Detail */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white">
            <div>
              <span className="text-[11px] px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-lg font-medium border border-gray-200">
                预计阅读: {selectedTutorial.readTime}
              </span>
              <h3 className="text-lg font-bold text-gray-900 mt-2">{selectedTutorial.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{selectedTutorial.summary}</p>
            </div>

            <div className="space-y-4 pt-2 border-t border-gray-200">
              {selectedTutorial.content.map((sec, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h4 className="text-sm font-bold text-gray-900">{sec.heading}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{sec.text}</p>
                  {sec.tips && sec.tips.length > 0 && (
                    <div className="mt-2 p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1">
                      {sec.tips.map((tip, tIdx) => (
                        <div key={tIdx} className="flex items-start gap-1.5 text-[11px] text-blue-900">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 flex justify-end bg-gray-50 shrink-0">
          <button
            id="done-tutorial-btn"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-xs"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};
