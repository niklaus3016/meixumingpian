import { jsPDF } from 'jspdf';
import { toPng, toJpeg, getFontEmbedCSS } from 'html-to-image';
import { ExportSettings } from '../types';

export interface ExportResult {
  success: boolean;
  fileUrl?: string;
  fileUrls?: { front?: string; back?: string };
  fileName: string;
  format: string;
  resolution: string;
  sizeBytes?: number;
  error?: string;
}

const RESOLUTION_SCALES: Record<string, number> = {
  '720p': 1.42, // ~ 1280 x 768
  '1080p': 2.13, // ~ 1920 x 1152
  '2k': 2.84, // ~ 2560 x 1536
  '4k': 4.26, // ~ 3840 x 2304
};

/**
 * 计算页面中网页字体（Google Fonts）的嵌入 CSS，保证导出图与预览字体一致。
 * 离线或字体源不可达时返回空字符串，调用方降级为 skipFonts。
 */
async function tryGetFontEmbedCSS(el: HTMLElement | null): Promise<string> {
  if (!el) return '';
  try {
    return (await getFontEmbedCSS(el)) || '';
  } catch (e) {
    console.warn('字体嵌入失败，导出将使用系统字体回退', e);
    return '';
  }
}

export async function exportCardImage(
  frontElement: HTMLElement | null,
  backElement: HTMLElement | null,
  settings: ExportSettings,
  onProgress?: (percent: number) => void
): Promise<ExportResult> {
  try {
    if (onProgress) onProgress(10);

    const scale = RESOLUTION_SCALES[settings.resolution] || 2;
    const pixelRatio = scale;
    const fontEmbedCSS = await tryGetFontEmbedCSS(frontElement || backElement);

    const options = {
      pixelRatio,
      cacheBust: true,
      skipFonts: !fontEmbedCSS,
      fontEmbedCSS,
      backgroundColor: settings.transparentBg && settings.format === 'png' ? undefined : '#FFFFFF',
      quality: settings.quality || 0.95,
      style: {
        transform: 'none',
      },
    };

    const triggerDownload = (dataUrl: string, filename: string) => {
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const renderElement = async (el: HTMLElement) => {
      if (settings.format === 'png') {
        return await toPng(el, options);
      } else {
        return await toJpeg(el, options);
      }
    };

    const baseName = settings.fileName || '美序名片';
    const ext = settings.format;
    const resUpper = settings.resolution.toUpperCase();

    if (settings.exportSide === 'both') {
      if (!frontElement || !backElement) {
        throw new Error('名片正反面画布未就绪');
      }

      if (onProgress) onProgress(30);
      const frontDataUrl = await renderElement(frontElement);
      const frontFileName = `${baseName}_正面_${resUpper}.${ext}`;
      triggerDownload(frontDataUrl, frontFileName);

      if (onProgress) onProgress(60);
      // Short timeout to guarantee both downloads trigger cleanly in mobile and desktop browsers
      await new Promise((resolve) => setTimeout(resolve, 350));

      const backDataUrl = await renderElement(backElement);
      const backFileName = `${baseName}_反面_${resUpper}.${ext}`;
      triggerDownload(backDataUrl, backFileName);

      if (onProgress) onProgress(100);

      return {
        success: true,
        fileUrl: frontDataUrl,
        fileUrls: { front: frontDataUrl, back: backDataUrl },
        fileName: `${baseName}_正反双面_${resUpper}.${ext} (已生成2张)`,
        format: settings.format.toUpperCase(),
        resolution: resUpper,
      };
    } else {
      const targetElement = settings.exportSide === 'back' ? backElement : frontElement;
      if (!targetElement) {
        throw new Error('名片画布未就绪');
      }

      if (onProgress) onProgress(50);
      const dataUrl = await renderElement(targetElement);

      const sideLabel = settings.exportSide === 'back' ? '_反面' : '_正面';
      const finalFileName = `${baseName}${sideLabel}_${resUpper}.${ext}`;

      if (onProgress) onProgress(80);
      triggerDownload(dataUrl, finalFileName);

      if (onProgress) onProgress(100);

      return {
        success: true,
        fileUrl: dataUrl,
        fileName: finalFileName,
        format: settings.format.toUpperCase(),
        resolution: resUpper,
      };
    }
  } catch (error) {
    console.error('Export image failed:', error);
    return {
      success: false,
      fileName: settings.fileName,
      format: settings.format,
      resolution: settings.resolution,
      error: String(error),
    };
  }
}

export async function exportCardPDF(
  frontElement: HTMLElement | null,
  backElement: HTMLElement | null,
  settings: ExportSettings,
  onProgress?: (percent: number) => void
): Promise<ExportResult> {
  try {
    if (onProgress) onProgress(15);

    // Standard card size 90mm x 54mm, with bleed it's 96mm x 60mm (3mm bleed on each side)
    const hasBleed = settings.includeBleed !== false;
    const widthMm = hasBleed ? 96 : 90;
    const heightMm = hasBleed ? 60 : 54;

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [widthMm, heightMm],
      compress: true,
    });

    const renderScale = 4; // 300+ DPI Equivalent rendering
    const fontEmbedCSS = await tryGetFontEmbedCSS(frontElement || backElement);
    const pdfRenderOptions = {
      pixelRatio: renderScale,
      quality: 0.98,
      skipFonts: !fontEmbedCSS,
      fontEmbedCSS,
      cacheBust: true,
    };

    // Render Front side
    if (settings.exportSide === 'front' || settings.exportSide === 'both') {
      if (frontElement) {
        if (onProgress) onProgress(35);
        const frontImg = await toJpeg(frontElement, pdfRenderOptions);

        // Add front image
        const xOffset = hasBleed ? 3 : 0;
        const yOffset = hasBleed ? 3 : 0;
        pdf.addImage(frontImg, 'JPEG', xOffset, yOffset, 90, 54, undefined, 'FAST');

        // Draw crop marks if bleed enabled
        if (hasBleed && settings.includeCropMarks !== false) {
          drawCropMarks(pdf, 96, 60, 3);
        }
      }
    }

    // Render Back side
    if (settings.exportSide === 'back' || settings.exportSide === 'both') {
      if (backElement) {
        if (onProgress) onProgress(70);
        if (settings.exportSide === 'both') {
          pdf.addPage([widthMm, heightMm], 'landscape');
        }
        const backImg = await toJpeg(backElement, pdfRenderOptions);

        const xOffset = hasBleed ? 3 : 0;
        const yOffset = hasBleed ? 3 : 0;
        pdf.addImage(backImg, 'JPEG', xOffset, yOffset, 90, 54, undefined, 'FAST');

        if (hasBleed && settings.includeCropMarks !== false) {
          drawCropMarks(pdf, 96, 60, 3);
        }
      }
    }

    if (onProgress) onProgress(90);

    const finalFileName = `${settings.fileName || '美序名片_印刷标准'}_300DPI.pdf`;
    pdf.save(finalFileName);

    if (onProgress) onProgress(100);

    return {
      success: true,
      fileName: finalFileName,
      format: 'PDF (300DPI 印刷级)',
      resolution: hasBleed ? '96×60mm (含3mm出血)' : '90×54mm (标准尺寸)',
    };
  } catch (error) {
    console.error('Export PDF failed:', error);
    return {
      success: false,
      fileName: settings.fileName,
      format: 'PDF',
      resolution: '300DPI',
      error: String(error),
    };
  }
}

// Draw standard professional crop crosshair marks on PDF
function drawCropMarks(pdf: jsPDF, totalW: number, totalH: number, bleed: number) {
  pdf.setDrawColor(80, 80, 80);
  pdf.setLineWidth(0.15);

  // Top-left
  pdf.line(bleed, 0, bleed, bleed - 0.5); // vertical top
  pdf.line(0, bleed, bleed - 0.5, bleed); // horizontal left

  // Top-right
  pdf.line(totalW - bleed, 0, totalW - bleed, bleed - 0.5);
  pdf.line(totalW, bleed, totalW - bleed + 0.5, bleed);

  // Bottom-left
  pdf.line(bleed, totalH, bleed, totalH - bleed + 0.5);
  pdf.line(0, totalH - bleed, bleed - 0.5, totalH - bleed);

  // Bottom-right
  pdf.line(totalW - bleed, totalH, totalW - bleed, totalH - bleed + 0.5);
  pdf.line(totalW, totalH - bleed, totalW - bleed + 0.5, totalH - bleed);
}
