// 📝 Temporary Canvas Component (Without Konva)
// File: frontend/src/components/PatternEditor/Canvas.tsx
// Purpose: Test implementation without Konva dependency

import React from 'react';

interface CanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  width = 600, 
  height = 400, 
  className = '' 
}) => {
  return (
    <div className={`canvas-container ${className}`}>
      {/* Canvas Info */}
      <div className="canvas-info mb-2 text-sm text-gray-600">
        Pattern: 20 × 20 cm | Tool: brush | Grid: ON | Snap: ON
      </div>
      
      {/* Temporary Canvas (HTML5 Canvas) */}
      <canvas
        width={width}
        height={height}
        style={{ 
          border: '1px solid #ccc',
          background: 'white',
          backgroundImage: `
            linear-gradient(#e0e0e0 1px, transparent 1px),
            linear-gradient(90deg, #e0e0e0 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Basic Controls */}
      <div className="canvas-controls mt-2 flex gap-2 items-center">
        <label className="text-sm">
          Brush Size:
          <input
            type="range"
            min="1"
            max="50"
            defaultValue="10"
            className="ml-2"
          />
          <span className="ml-1">10px</span>
        </label>
        
        <label className="text-sm">
          Color:
          <input
            type="color"
            defaultValue="#000000"
            className="ml-2"
          />
        </label>
        
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
          Grid: ON
        </button>
        
        <button className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">
          Clear
        </button>
      </div>
      
      <div className="mt-2 text-sm text-orange-600">
        ⚠️ Temporary canvas - Konva.js loading... Install: npm install konva react-konva
      </div>
    </div>
  );
};

export default Canvas;
