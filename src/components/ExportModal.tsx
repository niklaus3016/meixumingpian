import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Share2,
  FileCheck,
  Printer,
  Sparkles,
  Shield,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CardData, ExportFormat, ExportResolution, ExportSettings } from '../types';
import { exportCardImage, exportCardPDF, ExportResult } from '../utils/exporter';
import { CardCanvas } from './CardCanvas';
import { CardThumbnail } from './CardThumbnail';

interface ExportModalProps {
  cardData: CardData;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ cardData, isOpen, onClose }) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [resolution, setResolution] = useState<ExportResolution>('2k');
  const [exportSide, setExportSide] = useState<'front' | 'back' | 'both'>('front');
  const [includeBleed, setIncludeBleed] = useState<boolean>(true);
  const [includeCropMarks, setIncludeCropMarks] = useState<boolean>(true);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>(cardData.name || '美序名片设计');

  const [previewSide, setPreviewSide] = useState<'front' | 'back'>('front');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);

  // Hidden Render Canvas Refs for High-Res Extraction
  const frontCanvasRef = useRef<HTMLDivElement | null>(null);
  const backCanvasRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setExportProgress(10);
    setExportResult(null);

    const settings: ExportSettings = {
      format,
      resolution,
      exportSide,
      includeBleed,
      includeCropMarks,
      transparentBg,
      fileName,
      quality: 0.98,
    };

    try {
      let result: ExportResult;

      if (format === 'pdf') {
        result = await exportCardPDF(
          frontCanvasRef.current,
          backCanvasRef.current,
          settings,
          (progress) => setExportProgress(progress)
        );
      } else {
        // Image export (PNG / JPG) - supports front, back, and both sides
        result = await exportCardImage(
          frontCanvasRef.current,
          backCanvasRef.current,
          settings,
          (progress) => setExportProgress(progress)
        );
      }

      setExportResult(result);
      if (result.success) {
        // Fire confetti on success!
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
      setExportResult({
        success: false,
        fileName,
        format,
        resolution,
        error: String(err),
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Web Share API support
  const handleShare = async () => {
    if (navigator.share && exportResult?.fileUrl) {
      try {
        await navigator.share({
          title: fileName,
          text: '这是我用《美序名片》制作的高清名片，请查收！',
          url: window.location.href,
        });
      } catch (e) {
        console.log('Share dismissed', e);
      }
    } else {
      alert('已触发本地文件下载，可在手机相册或下载文件夹中查看。');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans">
      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-lg bg-white border border-gray-200 rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-900 flex items-center justify-center border border-gray-200/80">
              <Download size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">导出名片文件</h2>
              <p className="text-xs text-gray-500">本地离线高清运算生成，无水印</p>
            </div>
          </div>
          <button
            id="close-export-modal-btn"
            onClick={onClose}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-white">
          {/* Card Preview Previewer */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full mb-2 text-xs">
              <span className="text-gray-500 font-medium">名片效果预览：</span>
              <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg border border-gray-200/70">
                <button
                  id="preview-front-btn"
                  onClick={() => setPreviewSide('front')}
                  className={`px-2.5 py-0.5 text-[11px] rounded-md font-semibold transition-colors ${
                    previewSide === 'front' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  正面
                </button>
                <button
                  id="preview-back-btn"
                  onClick={() => setPreviewSide('back')}
                  className={`px-2.5 py-0.5 text-[11px] rounded-md font-semibold transition-colors ${
                    previewSide === 'back' ? 'bg-black text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  反面
                </button>
              </div>
            </div>

            {/* Miniature preview frame */}
            <div className="w-full aspect-5/3 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex items-center justify-center shadow-inner">
              <CardThumbnail sideData={cardData[previewSide]} />
            </div>
          </div>

          {/* Export Format Selector */}
          <div>
            <label className="text-xs font-semibold text-gray-800 mb-2 block">导出格式</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="format-png-btn"
                onClick={() => setFormat('png')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs ${
                  format === 'png'
                    ? 'bg-blue-50/70 border-blue-600 text-blue-600 font-bold shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="font-bold text-sm">PNG 图片</span>
                <span className="text-[10px] text-gray-500 mt-0.5 font-normal">无损透明/高清</span>
              </button>

              <button
                id="format-jpg-btn"
                onClick={() => setFormat('jpg')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs ${
                  format === 'jpg'
                    ? 'bg-blue-50/70 border-blue-600 text-blue-600 font-bold shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="font-bold text-sm">JPG 图片</span>
                <span className="text-[10px] text-gray-500 mt-0.5 font-normal">高品质商务分享</span>
              </button>

              <button
                id="format-pdf-btn"
                onClick={() => setFormat('pdf')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all text-xs ${
                  format === 'pdf'
                    ? 'bg-blue-50/70 border-blue-600 text-blue-600 font-bold shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-sm">
                  <Printer size={14} />
                  <span>印刷 PDF</span>
                </div>
                <span className="text-[10px] text-gray-500 mt-0.5 font-normal">300DPI含出血线</span>
              </button>
            </div>
          </div>

          {/* Format Specific Options */}
          {format === 'pdf' ? (
            <div className="bg-blue-50/40 p-3.5 rounded-xl border border-blue-100 space-y-2.5 text-xs text-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-medium text-gray-800">
                  <Shield size={14} className="text-blue-600" />
                  <span>包含 3mm 印刷出血边 (96×60mm)</span>
                </div>
                <input
                  id="include-bleed-checkbox"
                  type="checkbox"
                  checked={includeBleed}
                  onChange={(e) => setIncludeBleed(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-medium text-gray-800">
                  <span>包含专业十字裁切对位线 (Crop Marks)</span>
                </div>
                <input
                  id="include-crop-marks-checkbox"
                  type="checkbox"
                  checked={includeCropMarks}
                  onChange={(e) => setIncludeCropMarks(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="text-[11px] text-gray-500 pt-1.5 border-t border-blue-100 font-normal">
                💡 符合线下印刷厂商业印刷标准，正反双面将整合为一个多页矢量 PDF 文件。
              </div>
            </div>
          ) : (
            /* Resolution Presets for PNG/JPG */
            <div>
              <label className="text-xs font-semibold text-gray-800 mb-2 block">分辨率清晰度</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['720p', '1080p', '2k', '4k'] as ExportResolution[]).map((res) => (
                  <button
                    key={res}
                    id={`res-${res}-btn`}
                    onClick={() => setResolution(res)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                      resolution === res
                        ? 'bg-black text-white border-black shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {res.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Export Side Options */}
          <div>
            <label className="text-xs font-semibold text-gray-800 mb-2 block">导出面选择</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                id="side-front-btn"
                onClick={() => setExportSide('front')}
                className={`py-2 px-3 rounded-xl border transition-all ${
                  exportSide === 'front'
                    ? 'bg-black text-white font-bold border-black shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                仅正面
              </button>
              <button
                id="side-back-btn"
                onClick={() => setExportSide('back')}
                className={`py-2 px-3 rounded-xl border transition-all ${
                  exportSide === 'back'
                    ? 'bg-black text-white font-bold border-black shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                仅反面
              </button>
              <button
                id="side-both-btn"
                onClick={() => setExportSide('both')}
                className={`py-2 px-3 rounded-xl border transition-all ${
                  exportSide === 'both'
                    ? 'bg-black text-white font-bold border-black shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                正反双面
              </button>
            </div>
          </div>

          {/* File Name */}
          <div>
            <label className="text-xs font-semibold text-gray-800 mb-1.5 block">自定义文件名</label>
            <input
              id="export-filename-input"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="输入文件名..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-sans"
            />
          </div>

          {/* Progress Bar (While exporting) */}
          {isExporting && (
            <div className="space-y-1.5 py-2">
              <div className="flex justify-between text-xs text-gray-600 font-medium">
                <span>正在纯前端极速渲染与编码...</span>
                <span className="font-mono text-blue-600 font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Export Success Result Card */}
          {exportResult && exportResult.success && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-900">导出成功！已保存到手机本地</div>
                  <div className="text-[11px] text-emerald-700 truncate max-w-50">
                    {exportResult.fileName} ({exportResult.resolution})
                  </div>
                </div>
              </div>
              <button
                id="share-file-btn"
                onClick={handleShare}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-xl shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <Share2 size={13} />
                <span>分享</span>
              </button>
            </div>
          )}

          {/* Export Error Card */}
          {exportResult && !exportResult.success && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span>导出失败: {exportResult.error || '未知错误，请重试'}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-3 bg-gray-50 shrink-0">
          <button
            id="cancel-export-btn"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors shadow-xs"
          >
            关闭
          </button>

          <button
            id="start-export-btn"
            disabled={isExporting}
            onClick={handleStartExport}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-all ${
              isExporting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800 text-white active:scale-98'
            }`}
          >
            <Download size={16} />
            <span>{isExporting ? '正在生成...' : '立即生成并下载'}</span>
          </button>
        </div>
      </div>

      {/* Hidden Standalone Offscreen Canvases for 1:1 Rendering Capture */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none opacity-0">
        <div ref={frontCanvasRef} style={{ width: 900, height: 540 }}>
          <CardCanvas
            sideData={cardData.front}
            selectedElementId={null}
            onSelectElement={() => {}}
            onUpdateElement={() => {}}
            interactive={false}
            scale={1}
            transparentBg={transparentBg && format === 'png'}
          />
        </div>
        <div ref={backCanvasRef} style={{ width: 900, height: 540 }}>
          <CardCanvas
            sideData={cardData.back}
            selectedElementId={null}
            onSelectElement={() => {}}
            onUpdateElement={() => {}}
            interactive={false}
            scale={1}
            transparentBg={transparentBg && format === 'png'}
          />
        </div>
      </div>
    </div>
  );
};
