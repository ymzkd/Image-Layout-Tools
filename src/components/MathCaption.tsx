import React, { useState, useEffect } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathCaptionProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style: React.CSSProperties;
  rows?: number;
  tabIndex?: number;
}

export const MathCaption: React.FC<MathCaptionProps> = ({
  value,
  onChange,
  placeholder = 'キャプションを入力...',
  style,
  rows = 2,
  tabIndex,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState('');

  useEffect(() => {
    if (!isEditing && value) {
      try {
        // インライン数式 $...$ を処理
        let processedText = value.replace(/\$([^$]+)\$/g, (match, math) => {
          try {
            return katex.renderToString(math, { displayMode: false });
          } catch (error) {
            console.warn('Math rendering error:', error);
            return match; // エラーの場合は元のテキストを返す
          }
        });

        // ブロック数式 $$...$$ を処理
        processedText = processedText.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
          try {
            return katex.renderToString(math, { displayMode: true });
          } catch (error) {
            console.warn('Math rendering error:', error);
            return match; // エラーの場合は元のテキストを返す
          }
        });

        setRenderedHtml(processedText);
      } catch (error) {
        console.warn('Caption processing error:', error);
        setRenderedHtml(value);
      }
    }
  }, [value, isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleDivKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsEditing(true);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      
      // 次のキャプション要素を探す
      const currentTabIndex = tabIndex || 0;
      const nextTabIndex = currentTabIndex + 1;
      const nextElement = document.querySelector(`[tabindex="${nextTabIndex}"]`) as HTMLElement;
      
      if (nextElement) {
        nextElement.focus();
      } else {
        // 最後の要素の場合、最初のキャプション要素に戻る
        const firstElement = document.querySelector('[tabindex="1"]') as HTMLElement;
        if (firstElement) {
          firstElement.focus();
        }
      }
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setIsEditing(false);
      
      // 次のキャプション要素を探す
      setTimeout(() => {
        const currentTabIndex = tabIndex || 0;
        const nextTabIndex = currentTabIndex + 1;
        const nextElement = document.querySelector(`[tabindex="${nextTabIndex}"]`) as HTMLElement;
        
        if (nextElement) {
          nextElement.focus();
          nextElement.click(); // キャプション要素の場合、クリックして編集モードに
        } else {
          // 最後の要素の場合、最初のキャプション要素に戻る
          const firstElement = document.querySelector('[tabindex="1"]') as HTMLElement;
          if (firstElement) {
            firstElement.focus();
            firstElement.click();
          }
        }
      }, 50);
    }
  };

  if (isEditing) {
    return (
      <textarea
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={{
          ...style,
          border: '1px solid #667eea',
          borderRadius: '4px',
          background: 'rgba(102, 126, 234, 0.05)',
        }}
        rows={rows}
        autoFocus
        tabIndex={tabIndex}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        ...style,
        minHeight: `${Math.max(parseInt(style.fontSize as string) * 1.5, 24)}px`,
        cursor: 'text',
        border: '1px solid transparent',
        borderRadius: '4px',
        padding: '4px',
      }}
      title="クリックして編集。数式は$...$または$$...$$で囲んでください。Tabで次へ移動。"
      tabIndex={tabIndex}
      onKeyDown={handleDivKeyDown}
    >
      {value ? (
        <div
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
          style={{
            lineHeight: '1.4',
            wordWrap: 'break-word',
          }}
        />
      ) : (
        <div 
          className="caption-placeholder"
          style={{ color: '#999', fontStyle: 'italic' }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};