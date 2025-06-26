// 📝 PatternEditor Main Component
// File: frontend/src/components/PatternEditor/index.tsx
// Purpose: Main composition component for pattern editing

import React from 'react';
import Canvas from './Canvas';
import ToolPalette from './ToolPalette';
import { PatternSizeSelector } from './PatternSizeSelector';
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
  } = canvasHook;

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
      </div>
      
      <div className="pattern-editor-status mt-4 text-sm text-gray-500">
        Phase 3: Pattern Size Selector 🔄 | Active Tool: {canvasState.tool} | Size: {currentSize.width}×{currentSize.height}{currentSize.unit}
      </div>
    </div>
  );
};

export default PatternEditor;
