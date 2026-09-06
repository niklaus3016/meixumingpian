import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Download,
  Save,
  RotateCcw,
  Sparkles,
  Type,
  Image as ImageIcon,
  QrCode,
  Shield,
  Upload,
  ZoomIn,
  ZoomOut,
  Sliders,
  Check,
  Globe,
  Building2,
  Phone,
  MapPin,
  Mail,
  User,
  Briefcase,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  CardData,
  CardElement,
  CardElementStyle,
  CardSideData,
} from '../types';
import { CardCanvas } from './CardCanvas';
import { compressImageFile } from '../utils/image';

import cosmicLightyearBg from '../assets/images/cosmic_lightyear_bg_1787932830156.jpg';
import cosmicGalaxyHorizonBg from '../assets/images/cosmic_galaxy_horizon_1787932851734.jpg';
import hyperionSpatialBg from '../assets/images/hyperion_spatial_bg_1787934410532.jpg';

interface EditorViewProps {
  initialData: CardData;
  templateId?: string;
  onBack: () => void;
  onSaveToProjects: (data: CardData) => boolean;
  onOpenExport: (data: CardData) => void;
  onAutoSaveDraft?: (data: CardData) => void;
}

type TabType = 'text' | 'bg' | 'qr';

export const EditorView: React.FC<EditorViewProps> = ({
  initialData,
  templateId,
  onBack,
  onSaveToProjects,
  onOpenExport,
  onAutoSaveDraft,
}) => {
  // Master Card State
  const [cardData, setCardData] = useState<CardData>(() => JSON.parse(JSON.stringify(initialData)));
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [scale, setScale] = useState<number>(0.38);
  const [showBleedGuide, setShowBleedGuide] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [expandedStyleId, setExpandedStyleId] = useState<string | null>(null);

  // Undo / Redo History (Max 20 steps; rapid changes within 300ms are coalesced)
  const historyRef = useRef<CardData[]>([JSON.parse(JSON.stringify(initialData))]);
  const historyIndexRef = useRef<number>(0);
  const lastPushTimeRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const canvasRef = useRef<HTMLDivElement | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement | null>(null);
  const qrFileInputRef = useRef<HTMLInputElement | null>(null);

  // Responsive scale adjustment based on container width
  useEffect(() => {
    const updateScale = () => {
      const screenW = window.innerWidth;
      if (screenW < 420) {
        setScale(Math.min(0.38, (screenW - 40) / 900));
      } else if (screenW < 640) {
        setScale(0.42);
      } else if (screenW < 1024) {
        setScale(0.55);
      } else {
        setScale(0.68);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Apply Card Change helper (updates cardData and pushes to undo history safely)
  const applyCardChange = (updater: (prev: CardData) => CardData) => {
    setCardData((prev) => {
      const nextData = updater(prev);

      // Schedule history & auto-save cleanly outside current render pass
      setTimeout(() => {
        const now = Date.now();
        // Coalesce rapid successive changes (e.g. drag frames) into one history step
        const coalesce = now - lastPushTimeRef.current < 300;
        lastPushTimeRef.current = now;

        const currentHist = historyRef.current.slice(0, historyIndexRef.current + 1);
        if (coalesce && currentHist.length > 0) {
          currentHist[currentHist.length - 1] = JSON.parse(JSON.stringify(nextData));
        } else {
          currentHist.push(JSON.parse(JSON.stringify(nextData)));
          if (currentHist.length > 20) currentHist.shift();
        }
        historyRef.current = currentHist;
        historyIndexRef.current = currentHist.length - 1;
        setCanUndo(historyIndexRef.current > 0);
        setCanRedo(historyIndexRef.current < historyRef.current.length - 1);

        if (onAutoSaveDraft) {
          onAutoSaveDraft(nextData);
        }
      }, 0);

      return nextData;
    });
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const targetState = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]));
      setCardData(targetState);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      if (onAutoSaveDraft) {
        onAutoSaveDraft(targetState);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const targetState = JSON.parse(JSON.stringify(historyRef.current[historyIndexRef.current]));
      setCardData(targetState);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
      if (onAutoSaveDraft) {
        onAutoSaveDraft(targetState);
      }
    }
  };

  // Active side elements & background
  const currentSide = cardData.activeSide;
  const currentSideData: CardSideData = cardData[currentSide];
  const selectedElement = currentSideData.elements.find((e) => e.id === selectedElementId);

  // Switch Side: Front / Back
  const handleSwitchSide = (side: 'front' | 'back') => {
    setSelectedElementId(null);
    setCardData((prev) => ({ ...prev, activeSide: side }));
  };

  // Update specific element style or content
  const handleUpdateElement = (id: string, updates: Partial<CardElementStyle>, newContent?: string) => {
    applyCardChange((prev) => {
      const nextElements = prev[prev.activeSide].elements.map((el) => {
        if (el.id === id) {
          return {
            ...el,
            content: newContent !== undefined ? newContent : el.content,
            style: { ...el.style, ...updates },
          };
        }
        return el;
      });

      return {
        ...prev,
        [prev.activeSide]: {
          ...prev[prev.activeSide],
          elements: nextElements,
        },
      };
    });
  };

  // Add a new Element
  const handleAddElement = (newElement: Omit<CardElement, 'id'>) => {
    const id = `elem-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const fullElement: CardElement = { ...newElement, id };

    applyCardChange((prev) => {
      const nextElements = [...prev[prev.activeSide].elements, fullElement];
      return {
        ...prev,
        [prev.activeSide]: {
          ...prev[prev.activeSide],
          elements: nextElements,
        },
      };
    });

    setSelectedElementId(id);
  };

  // Delete a text element
  const handleDeleteElement = (id: string) => {
    if (!window.confirm('确定要删除该文字元素吗？')) return;
    applyCardChange((prev) => {
      const nextElements = prev[prev.activeSide].elements.filter((el) => el.id !== id);
      return {
        ...prev,
        [prev.activeSide]: {
          ...prev[prev.activeSide],
          elements: nextElements,
        },
      };
    });
    setSelectedElementId(null);
    showToast('🗑️ 已删除文字元素');
  };

  // Reset Template to Initial State
  const handleResetTemplate = () => {
    if (window.confirm('确定要恢复模板初始排版吗？未保存的自定义修改将被重置。')) {
      const fresh = JSON.parse(JSON.stringify(initialData));
      applyCardChange(() => fresh);
      showToast('🔄 已恢复初始模板排版');
    }
  };

  // Reset QR Code to default
  const handleResetQrCode = () => {
    applyCardChange((prev) => {
      const side = prev.activeSide;
      const initialQrEl = initialData[side]?.elements.find((el) => el.type === 'qr' || el.id.includes('qr'));
      const defaultContent = initialQrEl?.content || 'https://meixu.card';

      const nextElements = prev[side].elements.map((el) => {
        if (el.type === 'qr' || el.id.includes('qr')) {
          return { ...el, content: defaultContent };
        }
        return el;
      });

      return {
        ...prev,
        [side]: {
          ...prev[side],
          elements: nextElements,
        },
      };
    });
    showToast('🔄 已重置为默认二维码');
  };

  // Handle Custom Background Upload (compressed to keep localStorage small)
  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const dataUrl = await compressImageFile(file, 1600, 0.85, 'image/jpeg');
      applyCardChange((prev) => ({
        ...prev,
        [prev.activeSide]: {
          ...prev[prev.activeSide],
          background: {
            type: 'image',
            imageUrl: dataUrl,
            pattern: 'starfield',
            patternOpacity: 0.25,
          },
        },
      }));
      showToast('🖼️ 底图已成功替换');
    } catch (err) {
      console.error('Background upload failed', err);
      showToast('⚠️ 底图处理失败，请更换图片重试');
    }
  };

  // Handle Custom QR Code Image Upload (PNG lossless, capped at 800px)
  const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      const dataUrl = await compressImageFile(file, 800, 1, 'image/png');
      applyCardChange((prev) => {
        const side = prev.activeSide;
        let found = false;
        const nextElements = prev[side].elements.map((el) => {
          if (el.type === 'qr' || el.id.includes('qr')) {
            found = true;
            return {
              ...el,
              content: dataUrl,
            };
          }
          return el;
        });

        if (!found) {
          nextElements.push({
            id: `qr-${Date.now()}`,
            type: 'qr',
            content: dataUrl,
            style: {
              x: 680,
              y: 200,
              width: 130,
              height: 130,
              backgroundColor: '#FFFFFF',
              borderRadius: 6,
              zIndex: nextElements.length + 1,
            },
          });
        }

        return {
          ...prev,
          [side]: {
            ...prev[side],
            elements: nextElements,
          },
        };
      });
      showToast('📱 二维码图片已成功替换');
    } catch (err) {
      console.error('QR upload failed', err);
      showToast('⚠️ 二维码处理失败，请更换图片重试');
    }
  };

  // Show Toast Notification
  const showToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2200);
  };

  // Helper to identify and get human friendly label & icon for each text element
  const getFieldMeta = (el: CardElement) => {
    if (el.textType === 'name' || el.id.includes('name') || el.content === '裴若曦' || (el.style.fontSize || 0) >= 32) {
      return { label: '姓名', icon: User, badge: '核心' };
    }
    if (el.textType === 'company' || el.id.includes('brand') || el.content.includes('光年科技') || el.content.includes('HYPERION')) {
      return { label: '公司 / 品牌名', icon: Building2, badge: '品牌' };
    }
    if (el.id.includes('en') || /^[A-Z\s·]+$/.test(el.content.trim())) {
      return { label: '英文名 / 拼音', icon: Globe, badge: '英文' };
    }
    if (el.textType === 'title' || el.id.includes('title') || el.content.includes('设计') || el.content.includes('合伙') || el.content.includes('创始') || el.content.includes('总监')) {
      return { label: '职务 / 头衔', icon: Briefcase, badge: '职级' };
    }
    if (el.id.includes('vision') || el.content.includes('愿景') || el.content.includes('使命')) {
      return { label: '品牌愿景 / Slogan', icon: Sparkles, badge: '愿景' };
    }
    if (el.textType === 'phone' || el.id.includes('phone') || el.content.includes('COMM:') || el.content.includes('138') || el.content.includes('+86')) {
      return { label: '联系电话 (COMM)', icon: Phone, badge: '联系' };
    }
    if (el.textType === 'address' || el.id.includes('addr') || el.id.includes('base') || el.content.includes('BASE:') || el.content.includes('中心') || el.content.includes('路') || el.content.includes('区')) {
      return { label: '地址 / 驻地 (BASE)', icon: MapPin, badge: '地址' };
    }
    if (el.textType === 'email' || el.id.includes('email') || el.content.includes('@')) {
      return { label: '电子邮箱 (EMAIL)', icon: Mail, badge: '邮箱' };
    }
    if (el.id.includes('url') || el.content.includes('WWW.') || el.content.includes('HTTP')) {
      return { label: '官网网址 (PORTAL)', icon: Globe, badge: '网址' };
    }
    if (el.id.includes('qr-label') || el.id.includes('qr-sub') || el.content.includes('扫码') || el.content.includes('SCAN')) {
      return { label: '扫码提示文案', icon: QrCode, badge: '扫码' };
    }
    return { label: '文本内容', icon: Type, badge: '文本' };
  };

  // Filter text elements for active side
  const textElements = currentSideData.elements.filter((el) => el.type === 'text');
  const qrElement = currentSideData.elements.find((el) => el.type === 'qr' || el.id.includes('qr'));
  const qrLabelElements = currentSideData.elements.filter(
    (el) => el.type === 'text' && (el.id.includes('qr-label') || el.id.includes('qr-sub') || el.content.includes('扫码') || el.content.includes('SCAN'))
  );

  return (
    <div className="relative flex flex-col w-full h-full bg-[#F4F6F9] text-gray-900 overflow-hidden select-none font-sans">
      {/* Hidden File Inputs */}
      <input
        ref={bgFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleBgUpload}
      />
      <input
        ref={qrFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleQrUpload}
      />

      {/* Top Application Header */}
      <header className="flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-gray-200 z-30 shrink-0 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            id="editor-back-btn"
            onClick={onBack}
            className="p-1.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="返回模板库"
          >
            <ArrowLeft size={19} />
          </button>

          {/* Undo / Redo */}
          <div className="flex items-center bg-gray-100 rounded-xl p-0.5 border border-gray-200/70">
            <button
              id="editor-undo-btn"
              disabled={!canUndo}
              onClick={handleUndo}
              className={`p-1.5 rounded-lg transition-colors ${
                canUndo ? 'text-gray-800 hover:bg-white shadow-xs' : 'text-gray-400 cursor-not-allowed'
              }`}
              title="撤销"
            >
              <Undo2 size={15} />
            </button>
            <button
              id="editor-redo-btn"
              disabled={!canRedo}
              onClick={handleRedo}
              className={`p-1.5 rounded-lg transition-colors ${
                canRedo ? 'text-gray-800 hover:bg-white shadow-xs' : 'text-gray-400 cursor-not-allowed'
              }`}
              title="重做"
            >
              <Redo2 size={15} />
            </button>
          </div>
        </div>

        {/* Front / Back Switcher */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-xl border border-gray-200">
          <button
            id="switch-front-side-btn"
            onClick={() => handleSwitchSide('front')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              currentSide === 'front'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            正面 (主面)
          </button>
          <button
            id="switch-back-side-btn"
            onClick={() => handleSwitchSide('back')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              currentSide === 'back'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            反面 (背面)
          </button>
        </div>

        {/* Actions: Reset, Save, Export */}
        <div className="flex items-center gap-1.5">
          <button
            id="reset-template-btn"
            onClick={handleResetTemplate}
            className="p-1.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            title="恢复模板初始排版"
          >
            <RotateCcw size={16} />
          </button>

          <button
            id="save-to-projects-btn"
            onClick={() => {
              const ok = onSaveToProjects(cardData);
              showToast(ok ? '💾 已保存到我的作品' : '⚠️ 保存失败：本地存储空间不足');
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl border border-gray-200 transition-colors"
          >
            <Save size={14} />
            <span className="hidden sm:inline">保存</span>
          </button>

          <button
            id="open-export-modal-btn"
            onClick={() => onOpenExport(cardData)}
            className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold bg-black text-white rounded-xl shadow-xs hover:bg-gray-800 transition-all active:scale-95"
          >
            <Download size={14} />
            <span>导出印刷</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Preview Canvas Area */}
      <div className="relative flex-1 bg-[#EEF1F5] flex flex-col items-center justify-center p-3 overflow-hidden">
        {/* Top Floating Helper Controls */}
        <div className="absolute top-2.5 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-gray-200 shadow-sm text-xs">
            <span className="text-gray-500 font-medium flex items-center gap-1 text-[11px]">
              <Shield size={12} className="text-emerald-600" />
              模板固定排版保护中
            </span>
          </div>

          <div className="flex items-center gap-1 pointer-events-auto bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-gray-200 shadow-sm text-xs">
            <button
              id="toggle-bleed-guide-btn"
              onClick={() => setShowBleedGuide(!showBleedGuide)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg transition-colors text-[11px] font-medium ${
                showBleedGuide ? 'text-red-600 font-semibold bg-red-50' : 'text-gray-500 hover:text-gray-900'
              }`}
              title="显示/隐藏 3mm 印刷出血线"
            >
              3mm 裁切出血线
            </button>
          </div>
        </div>

        {/* The Visual Card Canvas */}
        <div className="relative flex items-center justify-center p-2">
          <CardCanvas
            sideData={currentSideData}
            selectedElementId={selectedElementId}
            onSelectElement={(id) => {
              setSelectedElementId(id);
              if (id) {
                const el = currentSideData.elements.find((e) => e.id === id);
                if (el?.type === 'text') setActiveTab('text');
                else if (el?.type === 'qr') setActiveTab('qr');
              }
            }}
            onUpdateElement={(id, updates) => handleUpdateElement(id, updates)}
            scale={scale}
            showBleedGuide={showBleedGuide}
            interactive={true}
            forwardedRef={canvasRef}
          />
        </div>

        {/* Zoom Scale Controller */}
        <div className="absolute bottom-2.5 right-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl border border-gray-200 shadow-sm text-xs text-gray-600 z-10">
          <button
            id="zoom-out-btn"
            onClick={() => setScale((s) => Math.max(0.25, s - 0.05))}
            className="p-1 hover:text-black transition-colors"
          >
            <ZoomOut size={13} />
          </button>
          <span className="font-mono text-[11px] w-9 text-center font-semibold text-gray-900">{Math.round(scale * 100)}%</span>
          <button
            id="zoom-in-btn"
            onClick={() => setScale((s) => Math.min(1.2, s + 0.05))}
            className="p-1 hover:text-black transition-colors"
          >
            <ZoomIn size={13} />
          </button>
        </div>

        {/* Floating Toast Message */}
        {saveToast && (
          <div className="absolute bottom-12 bg-gray-900 text-white text-xs px-4 py-2 rounded-full shadow-2xl backdrop-blur-md z-50 flex items-center gap-2 font-medium">
            <span>{saveToast}</span>
          </div>
        )}
      </div>

      {/* Simplified Dedicated Editing Panel (Fixed Layout + Replace Content) */}
      <div className="bg-white border-t border-gray-200 z-20 shrink-0 shadow-lg">
        {/* Main Content Area */}
        <div className="h-48 sm:h-52 px-4 py-3 overflow-y-auto">
          {/* TAB 1: ✍️ 自由替换文字 (Direct Structured Field Editing) */}
          {activeTab === 'text' && (
            <div className="space-y-2.5 max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  {currentSide === 'front' ? '正面' : '背面'} 文字内容列表（点击即可自由修改，排版位置自动锁定）：
                </span>
                <button
                  id="add-extra-text-btn"
                  onClick={() => {
                    handleAddElement({
                      type: 'text',
                      content: '自定义文本',
                      style: {
                        x: 100,
                        y: 200,
                        fontSize: 16,
                        color: '#FFFFFF',
                        zIndex: currentSideData.elements.length + 1,
                      },
                    });
                  }}
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Plus size={12} />
                  添加文字字段
                </button>
              </div>

              {textElements.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400">
                  当前面暂无可编辑文字，点击上方「添加文字字段」即可新增。
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {textElements.map((el) => {
                    const meta = getFieldMeta(el);
                    const IconComp = meta.icon;
                    const isSelected = selectedElementId === el.id;
                    const isExpanded = expandedStyleId === el.id;

                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`p-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <IconComp size={13} className={isSelected ? 'text-blue-600' : 'text-gray-500'} />
                            <span className="text-[11px] font-semibold text-gray-700">{meta.label}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteElement(el.id);
                              }}
                              className="text-[10px] text-gray-400 hover:text-rose-600 flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-rose-50"
                              title="删除该文字元素"
                            >
                              <Trash2 size={10} />
                              <span>删除</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedStyleId(isExpanded ? null : el.id);
                              }}
                              className="text-[10px] text-gray-500 hover:text-blue-600 flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-white"
                              title="调节字号或颜色"
                            >
                              <Sliders size={10} />
                              <span>样式</span>
                            </button>
                          </div>
                        </div>

                        {/* Input Field */}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={el.content}
                            onChange={(e) => handleUpdateElement(el.id, {}, e.target.value)}
                            placeholder={`请输入${meta.label}...`}
                            className="flex-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-500 shadow-xs"
                          />
                        </div>

                        {/* Expandable Mini Typography Bar */}
                        {isExpanded && (
                          <div className="mt-2 pt-2 border-t border-gray-200/80 flex items-center justify-between gap-2 text-[11px] bg-white p-2 rounded-lg">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-gray-400">字号:</span>
                              <input
                                type="range"
                                min="10"
                                max="60"
                                value={el.style.fontSize || 16}
                                onChange={(e) => handleUpdateElement(el.id, { fontSize: Number(e.target.value) })}
                                className="flex-1 accent-black h-1"
                              />
                              <span className="font-mono text-gray-600 w-6">{el.style.fontSize || 16}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={el.style.color || '#FFFFFF'}
                                onChange={(e) => handleUpdateElement(el.id, { color: e.target.value })}
                                className="w-6 h-6 p-0 border border-gray-300 rounded cursor-pointer"
                                title="字体颜色"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 🖼️ 自由替换底图 (Background Image, Presets & Textures) */}
          {activeTab === 'bg' && (
            <div className="space-y-3 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">更换名片底图与星空质感：</span>
                <button
                  id="upload-custom-bg-btn"
                  onClick={() => bgFileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-gray-800 transition-colors"
                >
                  <Upload size={13} />
                  上传自定义底图
                </button>
              </div>

              {/* Curated High-Res Wallpaper Presets */}
              <div>
                <div className="text-[11px] text-gray-500 mb-1.5 font-medium">精选高清太空与科技底图</div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      applyCardChange((prev) => ({
                        ...prev,
                        [prev.activeSide]: {
                          ...prev[prev.activeSide],
                          background: {
                            type: 'image',
                            imageUrl: hyperionSpatialBg,
                            pattern: 'starfield',
                            patternOpacity: 0.3,
                          },
                        },
                      }));
                      showToast('🌌 已应用全息深空星云底图');
                    }}
                    className="flex flex-col items-center p-1.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-xs transition-all bg-gray-900 text-left overflow-hidden"
                  >
                    <div className="w-full h-10 rounded-lg overflow-hidden relative">
                      <img src={hyperionSpatialBg} alt="全息深空" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-white font-medium mt-1">全息空间星云</span>
                  </button>

                  <button
                    onClick={() => {
                      applyCardChange((prev) => ({
                        ...prev,
                        [prev.activeSide]: {
                          ...prev[prev.activeSide],
                          background: {
                            type: 'image',
                            imageUrl: cosmicLightyearBg,
                            pattern: 'starfield',
                            patternOpacity: 0.3,
                          },
                        },
                      }));
                      showToast('🚀 已应用光年深空底图');
                    }}
                    className="flex flex-col items-center p-1.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-xs transition-all bg-gray-900 text-left overflow-hidden"
                  >
                    <div className="w-full h-10 rounded-lg overflow-hidden relative">
                      <img src={cosmicLightyearBg} alt="光年深空" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-white font-medium mt-1">光年深空星际</span>
                  </button>

                  <button
                    onClick={() => {
                      applyCardChange((prev) => ({
                        ...prev,
                        [prev.activeSide]: {
                          ...prev[prev.activeSide],
                          background: {
                            type: 'image',
                            imageUrl: cosmicGalaxyHorizonBg,
                            pattern: 'starfield',
                            patternOpacity: 0.3,
                          },
                        },
                      }));
                      showToast('🪐 已应用银河地平线底图');
                    }}
                    className="flex flex-col items-center p-1.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-xs transition-all bg-gray-900 text-left overflow-hidden"
                  >
                    <div className="w-full h-10 rounded-lg overflow-hidden relative">
                      <img src={cosmicGalaxyHorizonBg} alt="银河地平线" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] text-white font-medium mt-1">银河地平线</span>
                  </button>

                  <button
                    onClick={() => {
                      applyCardChange((prev) => ({
                        ...prev,
                        [prev.activeSide]: {
                          ...prev[prev.activeSide],
                          background: {
                            type: 'gradient',
                            gradient: {
                              type: 'linear',
                              angle: 135,
                              colors: ['#120826', '#1E0B38', '#070C1A'],
                            },
                            pattern: 'starfield',
                            patternOpacity: 0.5,
                          },
                        },
                      }));
                      showToast('✨ 已应用暗曜紫粉微晶');
                    }}
                    className="flex flex-col items-center p-1.5 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-xs transition-all bg-[#120826] text-left"
                  >
                    <div className="w-full h-10 rounded-lg bg-linear-to-br from-[#120826] via-[#1E0B38] to-[#070C1A] border border-purple-500/30" />
                    <span className="text-[11px] text-white font-medium mt-1">暗曜紫粉渐变</span>
                  </button>
                </div>
              </div>

              {/* Luxury Solid & Gradient Swatches */}
              <div>
                <div className="text-[11px] text-gray-500 mb-1 font-medium">经典商务色调与极简纯色</div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { name: '极夜黑', color: '#0A0A0C' },
                    { name: '深空蓝', color: '#0A192F' },
                    { name: '暗曜紫', color: '#160824' },
                    { name: '黑金岩', color: '#18181B' },
                    { name: '翡翠绿', color: '#064E3B' },
                    { name: '纯净白', color: '#FFFFFF' },
                    { name: '素雅灰', color: '#F3F4F6' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      onClick={() => {
                        applyCardChange((prev) => ({
                          ...prev,
                          [prev.activeSide]: {
                            ...prev[prev.activeSide],
                            background: { type: 'solid', color: c.color },
                          },
                        }));
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-gray-200 hover:scale-105 transition-transform flex items-center gap-1.5 bg-white shrink-0 shadow-xs"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: c.color }} />
                      <span className="text-[11px] text-gray-700 font-medium">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 📱 自由替换二维码 (Pure QR Code Image Upload Only) */}
          {activeTab === 'qr' && (
            <div className="space-y-3.5 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-900">名片二维码图片替换</h4>
                  <p className="text-[11px] text-gray-500">支持上传微信个人码、企业微信、公众号或任意二维码图片，原样居中贴合排版</p>
                </div>
              </div>

              {/* Direct Image Upload Box */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/90 flex flex-col sm:flex-row items-center gap-4">
                {/* Current QR Code Preview */}
                <div className="relative shrink-0 w-24 h-24 bg-white rounded-xl border border-gray-200 p-1.5 shadow-xs flex items-center justify-center overflow-hidden">
                  {qrElement?.content?.startsWith('data:image') || qrElement?.content?.startsWith('blob:') ? (
                    <img
                      src={qrElement.content}
                      alt="当前二维码"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <QrCode size={36} className="text-gray-700" />
                      <span className="text-[9px] text-gray-500 mt-1 font-medium">默认示例码</span>
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 py-0.5 rounded font-mono">
                    预览
                  </span>
                </div>

                {/* Upload Actions & Instructions */}
                <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <button
                      id="upload-custom-qr-btn"
                      onClick={() => qrFileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-black text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-gray-800 transition-all active:scale-95"
                    >
                      <Upload size={14} />
                      <span>上传二维码图片进行替换</span>
                    </button>

                    <button
                      id="reset-qr-btn"
                      onClick={handleResetQrCode}
                      className="flex items-center gap-1 px-3 py-2 bg-white text-gray-700 hover:text-gray-900 text-xs font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-xs"
                      title="恢复默认示例二维码"
                    >
                      <RefreshCw size={13} />
                      <span>恢复默认</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    💡 提示：支持 PNG、JPG、WEBP 格式。系统将自动保持正方形比例，清晰渲染到名片对应预留位。
                  </p>
                </div>
              </div>

              {/* QR Slogan / Label inputs */}
              {qrLabelElements.length > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-700 block">
                    二维码下方说明文案（可自由修改）：
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {qrLabelElements.map((labelEl) => (
                      <div key={labelEl.id} className="p-2 bg-gray-50 rounded-xl border border-gray-200">
                        <input
                          type="text"
                          value={labelEl.content}
                          onChange={(e) => handleUpdateElement(labelEl.id, {}, e.target.value)}
                          placeholder="如：扫码体验全息演示 / 微信扫一扫"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-blue-500 shadow-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Drawer Primary Navigation Bar (3 Simple Core Tabs) */}
        <div className="grid grid-cols-3 border-t border-gray-200 bg-white px-3 py-1.5 max-w-lg mx-auto">
          <button
            id="tab-text-btn"
            onClick={() => setActiveTab('text')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl text-xs transition-all ${
              activeTab === 'text' ? 'text-black font-bold bg-gray-100 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Type size={18} />
            <span className="mt-1">替换文字</span>
          </button>

          <button
            id="tab-bg-btn"
            onClick={() => setActiveTab('bg')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl text-xs transition-all ${
              activeTab === 'bg' ? 'text-black font-bold bg-gray-100 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ImageIcon size={18} />
            <span className="mt-1">替换底图</span>
          </button>

          <button
            id="tab-qr-btn"
            onClick={() => setActiveTab('qr')}
            className={`flex flex-col items-center justify-center py-2 rounded-xl text-xs transition-all ${
              activeTab === 'qr' ? 'text-black font-bold bg-gray-100 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <QrCode size={18} />
            <span className="mt-1">替换二维码</span>
          </button>
        </div>
      </div>
    </div>
  );
};
