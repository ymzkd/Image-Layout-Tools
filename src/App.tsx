import React, { useRef } from 'react';
import { FlexibleImageGrid } from './components/FlexibleImageGrid';
import { LayoutControls } from './components/LayoutControls';
import { ExportPanel } from './components/ExportPanel';
import { Toast } from './components/Toast';
import { useImageManager } from './hooks/useImageManager';
import { useLayout } from './hooks/useLayout';
import { useToast } from './hooks/useToast';
import './App.css';

function App() {
  const {
    images,
    addImages,
    removeImage,
    updateCaption,
    reorderImages,
    clearImages,
  } = useImageManager();

  const {
    layoutConfig,
    captionConfig,
    updateLayoutConfig,
    updateCaptionConfig,
  } = useLayout();

  const { toasts, showSuccess, showError, removeToast } = useToast();

  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div className="app">
      <header className="app-header">
        <h1>論文用画像レイアウトツール</h1>
        <p>画像をアップロードして、キャプション付きのグリッドレイアウトを作成</p>
      </header>

      <main className="app-main">
        <div className="sidebar">
          <LayoutControls
            layoutConfig={layoutConfig}
            captionConfig={captionConfig}
            onLayoutChange={updateLayoutConfig}
            onCaptionChange={updateCaptionConfig}
          />
          
          <ExportPanel
            gridRef={gridRef}
            imageCount={images.length}
            onSuccess={showSuccess}
            onError={showError}
          />
          
          {images.length > 0 && (
            <div className="clear-all-container">
              <button
                className="clear-all-btn"
                onClick={clearImages}
                title="すべての画像を削除"
              >
                すべて削除 ({images.length})
              </button>
            </div>
          )}
        </div>

        <div className="main-content">
          <div className="grid-container" ref={gridRef}>
            <FlexibleImageGrid
              images={images}
              captionConfig={captionConfig}
              onRemoveImage={removeImage}
              onUpdateCaption={updateCaption}
              onImagesAdded={addImages}
              onReorderImages={reorderImages}
              gap={layoutConfig.gap}
              padding={layoutConfig.padding}
            />
          </div>
        </div>
      </main>
      
      {/* トースト通知 */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default App;
