import React, { useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { MathCaption } from './MathCaption';

interface ImageItem {
  id: string;
  file: File;
  url: string;
  caption: string;
  width: number;
  height: number;
}

interface CaptionConfig {
  fontSize: number;
  color: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  fontFamily: string;
}

interface FlexibleImageGridProps {
  images: ImageItem[];
  captionConfig: CaptionConfig;
  onRemoveImage: (id: string) => void;
  onUpdateCaption: (id: string, caption: string) => void;
  onImagesAdded: (files: FileList) => void;
  onReorderImages: (fromIndex: number, toIndex: number) => void;
  gap: number;
  padding: number;
}

export const FlexibleImageGrid: React.FC<FlexibleImageGridProps> = ({
  images,
  captionConfig,
  onRemoveImage,
  onUpdateCaption,
  onImagesAdded,
  onReorderImages,
  gap,
  padding,
}) => {
  const { fontSize, color, position, fontFamily } = captionConfig;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<{ rowIndex: number; colIndex: number } | null>(null);

  // 画像を行ごとに分割する関数
  const organizeImagesIntoRows = (images: ImageItem[]) => {
    const rows: ImageItem[][] = [];
    let currentRow: ImageItem[] = [];
    
    images.forEach((image, index) => {
      currentRow.push(image);
      
      // 4枚ごとに改行（デフォルト）、または最後の画像の場合
      if (currentRow.length >= 4 || index === images.length - 1) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    });
    
    return rows;
  };

  const rows = organizeImagesIntoRows(images);

  const handleDragStart = (e: React.DragEvent, imageIndex: number) => {
    setDraggedIndex(imageIndex);
    e.dataTransfer.effectAllowed = 'move';
    // 内部ドラッグ識別用のカスタムMIMEを設定
    try {
      e.dataTransfer.setData('application/x-internal-drag-index', String(imageIndex));
    } catch {}
  };

  const handleDragOver = (e: React.DragEvent, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget({ rowIndex, colIndex });
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    // 内部ドラッグ（並べ替え）を最優先で処理
    const types = Array.from(e.dataTransfer.types || []);
    const hasInternal = types.includes('application/x-internal-drag-index');
    let sourceIndex: number | null = draggedIndex;
    if (hasInternal) {
      const data = e.dataTransfer.getData('application/x-internal-drag-index');
      const parsed = Number.parseInt(data, 10);
      if (!Number.isNaN(parsed)) sourceIndex = parsed;
    }

    if (sourceIndex !== null) {
      const targetIndex = rows.slice(0, rowIndex).reduce((acc, row) => acc + row.length, 0) + colIndex;
      if (sourceIndex !== targetIndex) {
        onReorderImages(sourceIndex, targetIndex);
      }
    } else if (e.dataTransfer.files.length > 0) {
      // 外部ファイルのドロップ時のみ追加
      onImagesAdded(e.dataTransfer.files);
    }

    setDraggedIndex(null);
    setDropTarget(null);
  };

  const handleFileDropOnEmpty = (e: React.DragEvent, rowIndex: number, colIndex: number) => {
    e.preventDefault();
    // 内部移動を優先（空スロットへの並べ替え）
    const types = Array.from(e.dataTransfer.types || []);
    const hasInternal = types.includes('application/x-internal-drag-index');
    let sourceIndex: number | null = draggedIndex;
    if (hasInternal) {
      const data = e.dataTransfer.getData('application/x-internal-drag-index');
      const parsed = Number.parseInt(data, 10);
      if (!Number.isNaN(parsed)) sourceIndex = parsed;
    }

    if (sourceIndex !== null) {
      const targetIndex = rows.slice(0, rowIndex).reduce((acc, row) => acc + row.length, 0) + colIndex;
      if (sourceIndex !== targetIndex) {
        onReorderImages(sourceIndex, targetIndex);
      }
    } else if (e.dataTransfer.files.length > 0) {
      onImagesAdded(e.dataTransfer.files);
    }

    setDraggedIndex(null);
    setDropTarget(null);
  };

  const renderImage = (image: ImageItem, globalIndex: number, rowIndex: number, colIndex: number) => {
    const isBeingDragged = draggedIndex === globalIndex;
    const isDropTarget = dropTarget?.rowIndex === rowIndex && dropTarget?.colIndex === colIndex;

    const cellStyle: React.CSSProperties = {
      position: 'relative',
      backgroundColor: isDropTarget ? '#e2e8f0' : 'transparent',
      border: isDropTarget ? '2px dashed #667eea' : 'none',
      opacity: isBeingDragged ? 0.5 : 1,
      cursor: 'grab',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'visible',
      transition: 'all 0.2s ease',
    };

    const imageContainerStyle: React.CSSProperties = {
      flex: position === 'top' || position === 'bottom' ? '1' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: 'transparent',
      minHeight: '200px',
    };

    const imageStyle: React.CSSProperties = {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      borderRadius: '0px',
    };

    const captionContainerStyle: React.CSSProperties = {
      padding: '8px',
      backgroundColor: 'transparent',
    };

    const captionStyle: React.CSSProperties = {
      fontSize: `${fontSize}px`,
      color,
      fontFamily,
      textAlign: 'center',
      margin: 0,
      padding: '4px',
      background: 'transparent',
      border: 'none',
      resize: 'none',
      width: '100%',
      minHeight: `${Math.max(fontSize * 1.5, 24)}px`,
      outline: 'none',
    };

    const renderCaption = () => (
      <div style={captionContainerStyle}>
        <MathCaption
          value={image.caption}
          onChange={(caption) => onUpdateCaption(image.id, caption)}
          placeholder="キャプションを入力... (数式は$...$で囲む)"
          style={captionStyle}
          rows={2}
          tabIndex={globalIndex + 1}
        />
      </div>
    );

    return (
      <div
        key={image.id}
        style={cellStyle}
        draggable
        onDragStart={(e) => handleDragStart(e, globalIndex)}
        onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
      >
        {position === 'top' && renderCaption()}
        
        <div style={imageContainerStyle}>
          <img
            src={image.url}
            alt={`Image ${globalIndex + 1}`}
            style={imageStyle}
            draggable={false}
          />
          
          {/* 改善された削除ボタン */}
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage(image.id);
            }}
            title="画像を削除"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'rgba(220, 53, 69, 0.9)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(220, 53, 69, 0.3)',
              zIndex: 10,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220, 53, 69, 1)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(220, 53, 69, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
        
        {position === 'bottom' && renderCaption()}
      </div>
    );
  };

  const renderEmptySlot = (rowIndex: number, colIndex: number) => {
    const isDropTarget = dropTarget?.rowIndex === rowIndex && dropTarget?.colIndex === colIndex;
    
    return (
      <div
        key={`empty-${rowIndex}-${colIndex}`}
        className="empty-drop-slot"
        style={{
          backgroundColor: isDropTarget ? '#e2e8f0' : '#f8f9fa',
          border: isDropTarget ? '2px dashed #667eea' : '2px dashed #cbd5e0',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#718096',
          fontSize: '14px',
          minHeight: '200px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onDragOver={(e) => handleDragOver(e, rowIndex, colIndex)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleFileDropOnEmpty(e, rowIndex, colIndex)}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = 'image/*';
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) onImagesAdded(files);
          };
          input.click();
        }}
      >
        <Upload size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
        <div>画像をドロップ</div>
        <div style={{ fontSize: '12px', marginTop: '4px' }}>またはクリック</div>
      </div>
    );
  };

  const containerStyle: React.CSSProperties = {
    padding: `${padding}px`,
    backgroundColor: 'transparent', // 透明背景対応
    display: 'flex',
    flexDirection: 'column',
    gap: `${gap}px`,
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${gap}px`,
    alignItems: 'stretch',
  };

  return (
    <div className="flexible-image-grid" style={containerStyle}>
      {rows.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} style={rowStyle}>
          {row.map((image, colIndex) => {
            const globalIndex = rows.slice(0, rowIndex).reduce((acc, r) => acc + r.length, 0) + colIndex;
            return renderImage(image, globalIndex, rowIndex, colIndex);
          })}
          {/* 各行の最後に空のスロットを追加 */}
          {renderEmptySlot(rowIndex, row.length)}
        </div>
      ))}
      
      {/* 新しい行のための空のスロット */}
      {images.length > 0 && (
        <div style={rowStyle}>
          {renderEmptySlot(rows.length, 0)}
        </div>
      )}
      
      {/* 最初の画像がない場合 */}
      {images.length === 0 && (
        <div style={rowStyle}>
          {renderEmptySlot(0, 0)}
        </div>
      )}
    </div>
  );
};