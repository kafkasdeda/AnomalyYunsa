// 📝 PatternEditor Main Component
// File: frontend/src/components/PatternEditor/index.tsx
// Purpose: Main composition component for pattern editing

import React, { useState } from 'react';
import Canvas from './Canvas';
import ToolPalette from './ToolPalette';
import { PatternSizeSelector } from './PatternSizeSelector';
import { PreviewWindow } from './PreviewWindow';
import { useCanvas } from '../../hooks/useCanvas';

interface PatternEditorProps {
  className?: string;
}

export const PatternEditor: React.FC<PatternEditorProps> = ({ className = '' }) => {
  const canvasHook = useCanvas();
  const {
    canvasState,
    pattern,
    setTool,
    setBrushSize,
    setCurrentColor,
    setBrushOpacity,
    setPatternSize,
    resetCanvas,
    getPatternAsCanvas,
  } = canvasHook;
  
  const [showPreview, setShowPreview] = useState(true);

  // Pattern size handlers
  const handleSizeChange = (size: any) => {
    setPatternSize(size);
  };

  const handleCreateNew = () => {
    resetCanvas();
  };

  // Default pattern size if none exists
  const currentSize = pattern?.metadata.size || { width: 20, height: 20, unit: 'cm' as const };

  return (
    <div className={`pattern-editor ${className}`}>
      <div className="pattern-editor-header mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Pattern Editor</h2>
        <p className="text-gray-600">Create patterns manually or import existing designs</p>
      </div>
      
      {/* Pattern Size Selector */}
      <PatternSizeSelector
        currentSize={currentSize}
        onSizeChange={handleSizeChange}
        onCreateNew={handleCreateNew}
      />
      
      <div className="pattern-editor-workspace flex gap-4">
        {/* Tool Palette */}
        <ToolPalette
          activeTool={canvasState.tool}
          onToolChange={setTool}
          brushSize={canvasState.brushSize}
          onBrushSizeChange={setBrushSize}
          brushColor={canvasState.currentColor}
          onBrushColorChange={setCurrentColor}
          brushOpacity={canvasState.brushOpacity}
          onBrushOpacityChange={setBrushOpacity}
        />
        
        {/* Canvas Area */}
        <div className="canvas-container flex-1">
          <Canvas canvasHook={canvasHook} />
        </div>
        
        {/* Preview Window */}
        {showPreview && (
          <div className="preview-container w-80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700">Pattern Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Hide Preview
              </button>
            </div>
            <PreviewWindow
              patternCanvas={getPatternAsCanvas()}
              patternSize={currentSize}
              isVisible={showPreview}
            />
          </div>
        )}
        
        {/* Preview Toggle */}
        {!showPreview && (
          <div className="preview-toggle">
            <button
              onClick={() => setShowPreview(true)}
              className="px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Show Preview
            </button>
          </div>
        )}
      </div>
      
      <div className="pattern-editor-status mt-4 text-sm text-gray-500">
🎯 SESSION09: T101e Seamless Preview | Active Tool: {canvasState.tool} | Size: {currentSize.width}×{currentSize.height}{currentSize.unit} | Preview: {showPreview ? '✅ ON' : '❌ OFF'}
      </div>
    </div>
  );
};

export default PatternEditor;
