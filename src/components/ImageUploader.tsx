import React, { useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImagesAdded: (files: FileList) => void;
  onClearAll: () => void;
  imageCount: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesAdded,
  onClearAll,
  imageCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      onImagesAdded(files);
    }
  }, [onImagesAdded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="image-uploader">
      <div
        ref={dropZoneRef}
        className="drop-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        <Upload className="upload-icon" size={48} />
        <p>画像をドラッグ&ドロップまたはクリックしてアップロード</p>
        <p className="file-types">対応形式: PNG, JPG, JPEG, GIF</p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />

      {imageCount > 0 && (
        <div className="upload-controls">
          <button
            className="clear-all-btn"
            onClick={onClearAll}
            title="すべての画像を削除"
          >
            <X size={16} />
            すべて削除 ({imageCount})
          </button>
        </div>
      )}
    </div>
  );
}; 