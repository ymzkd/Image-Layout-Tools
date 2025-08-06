import React, { useState } from 'react';
import { X, Move, Upload } from 'lucide-react';
import { MathCaption } from './MathCaption';

interface ImageItem {
  id: string;
  file: File;
  url: string;
  caption: string;
  width: number;
  height: number;
}

interface LayoutConfig {
  rows: number;
  cols: number;
  gap: number;
  padding: number;
}

interface CaptionConfig {
  fontSize: number;
  color: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  fontFamily: string;
}

interface ImageGridProps {
  images: ImageItem[];
  layoutConfig: LayoutConfig;
  captionConfig: CaptionConfig;
  onRemoveImage: (id: string) => void;
  onUpdateCaption: (id: string, caption: string) => void;
  onImagesAdded: (files: FileList) => void;
  onReorderImages: (fromIndex: number, toIndex: number) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  layoutConfig,
  captionConfig,
  onRemoveImage,
  onUpdateCaption,
  onImagesAdded,
  onReorderImages,
}) => {
  const { rows, cols, gap, padding } = layoutConfig;
  const { fontSize, color, position, fontFamily } = captionConfig;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gap: `${gap}px`,
    padding: `${padding}px`,
    minHeight: '500px',
    backgroundColor: '#ffffff',
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    // ファイルドロップの場合
    if (e.dataTransfer.files.length > 0) {
      onImagesAdded(e.dataTransfer.files);
    }
    // 画像の並び替えの場合
    else if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderImages(draggedIndex, dropIndex);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleEmptyDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      onImagesAdded(e.dataTransfer.files);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const renderImageWithCaption = (image: ImageItem, index: number) => {
    const isBeingDragged = draggedIndex === index;
    const isDraggedOver = dragOverIndex === index;

    const cellStyle = {
      position: 'relative' as const,
      backgroundColor: isDraggedOver ? '#e2e8f0' : 'transparent',
      border: isDraggedOver ? '2px dashed #667eea' : 'none',
      borderRadius: '0px',
      opacity: isBeingDragged ? 0.5 : 1,
      cursor: 'grab',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'visible',
    };

    const imageContainerStyle = {
      flex: position === 'top' || position === 'bottom' ? '1' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      backgroundColor: 'transparent',
      padding: '0px',
    };

    const imageStyle = {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain' as const,
      borderRadius: '0px', // 角丸を削除
    };

    const captionContainerStyle = {
      padding: '8px',
      backgroundColor: 'transparent',
      borderTop: 'none',
      borderBottom: 'none',
    };

    const captionStyle = {
      fontSize: `${fontSize}px`,
      color,
      fontFamily,
      textAlign: 'center' as const,
      margin: 0,
      padding: '4px',
      background: 'transparent',
      border: 'none',
      resize: 'none' as const,
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
        />
      </div>
    );

    return (
      <div
        key={image.id}
        style={cellStyle}
        draggable
        onDragStart={(e) => handleDragStart(e, index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, index)}
      >
        {position === 'top' && renderCaption()}
        
        <div style={imageContainerStyle}>
          <img
            src={image.url}
            alt={`Image ${index + 1}`}
            style={imageStyle}
          />
          
          {/* 削除ボタン - 改善されたデザイン */}
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage(image.id);
            }}
            title="画像を削除"
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
          >
            <X size={14} />
          </button>
          
          {/* ドラッグハンドル */}
          <div
            className="drag-handle"
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px',
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10,
            }}
          >
            <Move size={12} />
          </div>
        </div>
        
        {position === 'bottom' && renderCaption()}
      </div>
    );
  };

  const renderEmptyCell = (index: number) => {
    const isDraggedOver = dragOverIndex === (images.length + index);
    
    return (
      <div
        key={`empty-${index}`}
        className="empty-cell"
        style={{
          backgroundColor: isDraggedOver ? '#e2e8f0' : '#f8f9fa',
          border: isDraggedOver ? '2px dashed #667eea' : '2px dashed #cbd5e0',
          borderRadius: '4px',
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
        onDragOver={(e) => {
          e.preventDefault();
          setDragOverIndex(images.length + index);
        }}
        onDragLeave={handleDragLeave}
        onDrop={handleEmptyDrop}
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

  return (
    <div className="image-grid-container">
      <div className="image-grid" style={gridStyle}>
        {/* 画像を表示 */}
        {images.slice(0, rows * cols).map((image, index) => 
          renderImageWithCaption(image, index)
        )}
        
        {/* 空のセルを表示 */}
        {Array.from({ length: Math.max(0, rows * cols - images.length) }).map((_, index) => 
          renderEmptyCell(index)
        )}
      </div>
    </div>
  );
};