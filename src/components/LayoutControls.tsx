import React from 'react';
import { Grid, Type } from 'lucide-react';

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

interface LayoutControlsProps {
  layoutConfig: LayoutConfig;
  captionConfig: CaptionConfig;
  onLayoutChange: (config: Partial<LayoutConfig>) => void;
  onCaptionChange: (config: Partial<CaptionConfig>) => void;
}

export const LayoutControls: React.FC<LayoutControlsProps> = ({
  layoutConfig,
  captionConfig,
  onLayoutChange,
  onCaptionChange,
}) => {
  return (
    <div className="layout-controls">
      <div className="control-section">
        <h3>
          <Grid size={20} />
          レイアウト設定
        </h3>
        
        <div className="control-group">
          <label>レイアウト説明:</label>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#718096', 
            margin: '0.5rem 0',
            lineHeight: '1.4'
          }}>
            画像は自動的に行ごとに配置されます。<br/>
            ドラッグ&ドロップで自由に並び替え可能です。
          </p>
        </div>
        
        <div className="control-group">
          <label>画像間の余白 (px):</label>
          <input
            type="number"
            min="0"
            max="100"
            value={layoutConfig.gap}
            onChange={(e) => onLayoutChange({ gap: parseInt(e.target.value) })}
          />
        </div>
        
        <div className="control-group">
          <label>外側の余白 (px):</label>
          <input
            type="number"
            min="0"
            max="100"
            value={layoutConfig.padding}
            onChange={(e) => onLayoutChange({ padding: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="control-section">
        <h3>
          <Type size={20} />
          キャプション設定
        </h3>
        
        <div className="control-group">
          <label>フォントサイズ (px):</label>
          <input
            type="number"
            min="8"
            max="32"
            value={captionConfig.fontSize}
            onChange={(e) => onCaptionChange({ fontSize: parseInt(e.target.value) })}
          />
        </div>
        
        <div className="control-group">
          <label>色:</label>
          <input
            type="color"
            value={captionConfig.color}
            onChange={(e) => onCaptionChange({ color: e.target.value })}
          />
        </div>
        
        <div className="control-group">
          <label>位置:</label>
          <select
            value={captionConfig.position}
            onChange={(e) => onCaptionChange({ position: e.target.value as any })}
          >
            <option value="top">上部</option>
            <option value="bottom">下部</option>
            <option value="left">左側</option>
            <option value="right">右側</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>フォント:</label>
          <select
            value={captionConfig.fontFamily}
            onChange={(e) => onCaptionChange({ fontFamily: e.target.value })}
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Verdana, sans-serif">Verdana</option>
          </select>
        </div>
      </div>
    </div>
  );
}; 