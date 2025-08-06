import React, { useState } from 'react';
import { Download, FileImage, FileText, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportPanelProps {
  gridRef: React.RefObject<HTMLDivElement | null>;
  imageCount: number;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  gridRef,
  imageCount,
  onSuccess,
  onError,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'pdf'>('png');
  const [resolution, setResolution] = useState(2);
  const [filename, setFilename] = useState('figure-layout');
  const [backgroundColor, setBackgroundColor] = useState<'white' | 'transparent'>('white');

  const hideUIElements = (gridElement: HTMLElement): (() => void) => {
    const hiddenElements: { element: HTMLElement; originalDisplay: string }[] = [];
    
    // 削除ボタンを非表示に
    const removeButtons = gridElement.querySelectorAll('.remove-btn');
    removeButtons.forEach(btn => {
      const element = btn as HTMLElement;
      hiddenElements.push({ element, originalDisplay: element.style.display });
      element.style.display = 'none';
    });
    
    // 空のスロット（ドロップエリア）を非表示に
    const emptySlots = gridElement.querySelectorAll('.empty-drop-slot');
    emptySlots.forEach(slot => {
      const element = slot as HTMLElement;
      hiddenElements.push({ element, originalDisplay: element.style.display });
      element.style.display = 'none';
    });
    
    // プレースホルダーを非表示に
    const placeholders = gridElement.querySelectorAll('.caption-placeholder');
    placeholders.forEach(placeholder => {
      const element = placeholder as HTMLElement;
      hiddenElements.push({ element, originalDisplay: element.style.display });
      element.style.display = 'none';
    });
    
    // 復元関数を返す
    return () => {
      hiddenElements.forEach(({ element, originalDisplay }) => {
        element.style.display = originalDisplay || '';
      });
    };
  };

  const exportAsPNG = async () => {
    if (!gridRef.current) return;
    
    setIsExporting(true);
    try {
      // グリッド要素のみを取得
      const gridElement = gridRef.current.querySelector('.flexible-image-grid') as HTMLElement;
      if (!gridElement) {
        throw new Error('Grid element not found');
      }
      
      // UIエレメントを非表示にし、復元関数を取得
      const restoreUI = hideUIElements(gridElement);
      
      // わずかな遅延を入れてDOMの更新を待つ
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(gridElement, {
        scale: resolution,
        backgroundColor: backgroundColor === 'transparent' ? null : '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        ignoreElements: (element) => {
          // 追加の安全策：UIエレメントをスキップ
          return element.classList.contains('remove-btn') ||
                 element.classList.contains('empty-drop-slot') ||
                 element.classList.contains('caption-placeholder') ||
                 false;
        }
      });
      
      // UIエレメントを復元
      restoreUI();
      
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      onSuccess('PNG画像をダウンロードしました！');
    } catch (error) {
      console.error('PNG export failed:', error);
      onError('エクスポートに失敗しました。');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    if (!gridRef.current) return;
    
    setIsExporting(true);
    try {
      // グリッド要素のみを取得
      const gridElement = gridRef.current.querySelector('.flexible-image-grid') as HTMLElement;
      if (!gridElement) {
        throw new Error('Grid element not found');
      }
      
      // UIエレメントを非表示にし、復元関数を取得
      const restoreUI = hideUIElements(gridElement);
      
      // わずかな遅延を入れてDOMの更新を待つ
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(gridElement, {
        scale: resolution,
        backgroundColor: backgroundColor === 'transparent' ? null : '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        ignoreElements: (element) => {
          // 追加の安全策：UIエレメントをスキップ
          return element.classList.contains('remove-btn') ||
                 element.classList.contains('empty-drop-slot') ||
                 element.classList.contains('caption-placeholder') ||
                 false;
        }
      });
      
      // UIエレメントを復元
      restoreUI();
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);
      onSuccess('PDF文書をダウンロードしました！');
    } catch (error) {
      console.error('PDF export failed:', error);
      onError('エクスポートに失敗しました。');
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!gridRef.current) return;
    
    setIsCopying(true);
    try {
      // グリッド要素のみを取得
      const gridElement = gridRef.current.querySelector('.flexible-image-grid') as HTMLElement;
      if (!gridElement) {
        throw new Error('Grid element not found');
      }
      
      // UIエレメントを非表示にし、復元関数を取得
      const restoreUI = hideUIElements(gridElement);
      
      // わずかな遅延を入れてDOMの更新を待つ
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(gridElement, {
        scale: resolution,
        backgroundColor: backgroundColor === 'transparent' ? null : '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false,
        ignoreElements: (element) => {
          // 追加の安全策：UIエレメントをスキップ
          return element.classList.contains('remove-btn') ||
                 element.classList.contains('empty-drop-slot') ||
                 element.classList.contains('caption-placeholder') ||
                 false;
        }
      });
      
      // UIエレメントを復元
      restoreUI();
      
      // Canvasから画像データを取得してクリップボードにコピー
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to create blob from canvas');
        }
        
        try {
          // Clipboard API を使用（モダンブラウザ）
          if (navigator.clipboard && navigator.clipboard.write) {
            await navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            onSuccess('画像がクリップボードにコピーされました！');
          } else {
            // フォールバック: 画像URLを作成してテキストとしてコピー
            const url = URL.createObjectURL(blob);
            await navigator.clipboard.writeText(url);
            onSuccess('画像URLがクリップボードにコピーされました！');
          }
        } catch (clipboardError) {
          console.warn('Clipboard copy failed:', clipboardError);
          // エラーの場合は自動ダウンロードにフォールバック
          const link = document.createElement('a');
          link.download = `${filename}_copy.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          onError('クリップボードコピーに失敗したため、ダウンロードしました。');
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      onError('クリップボードへのコピーに失敗しました。');
    } finally {
      setIsCopying(false);
    }
  };

  const handleExport = () => {
    if (imageCount === 0) {
      onError('エクスポートする画像がありません。');
      return;
    }
    
    if (exportFormat === 'png') {
      exportAsPNG();
    } else {
      exportAsPDF();
    }
  };

  return (
    <div className="export-panel">
      <h3>
        <Download size={20} />
        エクスポート
      </h3>
      
      <div className="export-controls">
        <div className="control-group">
          <label>形式:</label>
          <div className="format-buttons">
            <button
              className={exportFormat === 'png' ? 'active' : ''}
              onClick={() => setExportFormat('png')}
            >
              <FileImage size={16} />
              PNG
            </button>
            <button
              className={exportFormat === 'pdf' ? 'active' : ''}
              onClick={() => setExportFormat('pdf')}
            >
              <FileText size={16} />
              PDF
            </button>
          </div>
        </div>
        
        <div className="control-group">
          <label>解像度:</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(Number(e.target.value))}
          >
            <option value={1}>標準 (1x)</option>
            <option value={2}>高解像度 (2x)</option>
            <option value={3}>超高解像度 (3x)</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>背景:</label>
          <select
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value as 'white' | 'transparent')}
          >
            <option value="white">白色</option>
            <option value="transparent">透明</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>ファイル名:</label>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="figure-layout"
          />
        </div>
        
        <div className="action-buttons">
          <button
            className="copy-btn"
            onClick={copyToClipboard}
            disabled={isCopying || imageCount === 0}
            title="クリップボードにコピー"
          >
            <Copy size={16} />
            {isCopying ? 'コピー中...' : 'クリップボードにコピー'}
          </button>
          
          <button
            className="export-btn"
            onClick={handleExport}
            disabled={isExporting || imageCount === 0}
          >
            <Download size={16} />
            {isExporting ? 'エクスポート中...' : 'ダウンロード'}
          </button>
        </div>
      </div>
      
      {imageCount === 0 && (
        <p className="export-note">
          画像をアップロードしてからエクスポートしてください。
        </p>
      )}
    </div>
  );
};