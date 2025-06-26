// 📝 Enhanced Canvas Component - Multi-Tool Support
// File: frontend/src/components/PatternEditor/Canvas.tsx
// Purpose: Drawing canvas with brush, rectangle, circle, line, eraser support

import React, { useEffect, useCallback, useState } from 'react';
import { Stage, Layer, Line, Rect, Circle as KonvaCircle } from 'react-konva';
import { useCanvas } from '../../hooks/useCanvas';
import type { VectorShape } from '../../types/pattern';

interface CanvasProps {
  width?: number;
  height?: number;
  className?: string;
  canvasHook?: ReturnType<typeof useCanvas>;
}

interface Point {
  x: number;
  y: number;
}

interface ShapeInProgress {
  type: 'rectangle' | 'circle' | 'line';
  startPoint: Point;
  endPoint: Point;
}

export const Canvas: React.FC<CanvasProps> = ({ 
  width, 
  height, 
  className = '',
  canvasHook
}) => {
  // Use either provided hook or create new one
  const fallbackHook = useCanvas();
  const {
    canvasState,
    pattern,
    stageRef,
    layerRef,
    addShape,
    createNewPattern,
    getCanvasPixelSize,
  } = canvasHook || fallbackHook;

  // Get responsive canvas size
  const canvasPixelSize = getCanvasPixelSize();
  const canvasWidth = width || canvasPixelSize.width;
  const canvasHeight = height || canvasPixelSize.height;

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [shapeInProgress, setShapeInProgress] = useState<ShapeInProgress | null>(null);

  // Initialize pattern if none exists
  useEffect(() => {
    if (!pattern) {
      createNewPattern(20, 20, 'cm'); // Default 20x20cm pattern
    }
  }, [pattern, createNewPattern]);

  // Snap to grid function
  const snapToGrid = useCallback((point: Point): Point => {
    if (!canvasState.snapToGrid) return point;
    
    const gridSize = canvasState.gridSize;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize,
    };
  }, [canvasState.snapToGrid, canvasState.gridSize]);

  // Generate grid lines
  const generateGridLines = useCallback(() => {
    if (!canvasState.gridEnabled) return [];
    
    const lines = [];
    const gridSize = canvasState.gridSize;
    
    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, canvasHeight]}
          stroke="#e0e0e0"
          strokeWidth={0.5}
          opacity={0.5}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, canvasWidth, y]}
          stroke="#e0e0e0"
          strokeWidth={0.5}
          opacity={0.5}
        />
      );
    }
    
    return lines;
  }, [canvasState.gridEnabled, canvasState.gridSize, canvasWidth, canvasHeight]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e: any) => {
    const pos = e.target.getStage().getPointerPosition();
    const snappedPos = snapToGrid(pos);
    
    setIsDrawing(true);
    
    switch (canvasState.tool) {
      case 'brush':
      case 'eraser':
        setCurrentPath([snappedPos]);
        break;
        
      case 'rectangle':
      case 'circle':
      case 'line':
        setShapeInProgress({
          type: canvasState.tool,
          startPoint: snappedPos,
          endPoint: snappedPos,
        });
        break;
    }
  }, [canvasState.tool, snapToGrid]);

  const handleMouseMove = useCallback((e: any) => {
    if (!isDrawing) return;
    
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const snappedPos = snapToGrid(pos);
    
    switch (canvasState.tool) {
      case 'brush':
      case 'eraser':
        setCurrentPath(prev => [...prev, snappedPos]);
        break;
        
      case 'rectangle':
      case 'circle':
      case 'line':
        if (shapeInProgress) {
          setShapeInProgress(prev => prev ? {
            ...prev,
            endPoint: snappedPos
          } : null);
        }
        break;
    }
  }, [isDrawing, canvasState.tool, snapToGrid, shapeInProgress]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    
    let newShape: VectorShape | null = null;
    
    switch (canvasState.tool) {
      case 'brush':
        if (currentPath.length >= 2) {
          const pathString = currentPath.reduce((acc, point, index) => {
            if (index === 0) {
              return `M${point.x},${point.y}`;
            }
            return acc + ` L${point.x},${point.y}`;
          }, '');

          newShape = {
            type: 'brush',
            id: `brush_${Date.now()}`,
            path: pathString,
            color: canvasState.currentColor,
            strokeWidth: canvasState.brushSize,
            opacity: canvasState.brushOpacity,
          };
        }
        break;
        
      case 'eraser':
        // For now, eraser works like brush but we'll implement proper erasing later
        if (currentPath.length >= 2) {
          const pathString = currentPath.reduce((acc, point, index) => {
            if (index === 0) {
              return `M${point.x},${point.y}`;
            }
            return acc + ` L${point.x},${point.y}`;
          }, '');

          newShape = {
            type: 'brush',
            id: `eraser_${Date.now()}`,
            path: pathString,
            color: '#ffffff', // White color for erasing effect
            strokeWidth: canvasState.brushSize,
            opacity: 1,
          };
        }
        break;
        
      case 'rectangle':
        if (shapeInProgress) {
          const { startPoint, endPoint } = shapeInProgress;
          const x = Math.min(startPoint.x, endPoint.x);
          const y = Math.min(startPoint.y, endPoint.y);
          const width = Math.abs(endPoint.x - startPoint.x);
          const height = Math.abs(endPoint.y - startPoint.y);
          
          if (width > 5 && height > 5) { // Minimum size check
            newShape = {
              type: 'rectangle',
              id: `rect_${Date.now()}`,
              x,
              y,
              width,
              height,
              color: canvasState.currentColor,
              strokeWidth: canvasState.brushSize,
              opacity: canvasState.brushOpacity,
            };
          }
        }
        break;
        
      case 'circle':
        if (shapeInProgress) {
          const { startPoint, endPoint } = shapeInProgress;
          const radius = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) + 
            Math.pow(endPoint.y - startPoint.y, 2)
          ) / 2;
          
          if (radius > 5) { // Minimum radius check
            newShape = {
              type: 'circle',
              id: `circle_${Date.now()}`,
              x: startPoint.x,
              y: startPoint.y,
              radius,
              color: canvasState.currentColor,
              strokeWidth: canvasState.brushSize,
              opacity: canvasState.brushOpacity,
            };
          }
        }
        break;
        
      case 'line':
        if (shapeInProgress) {
          const { startPoint, endPoint } = shapeInProgress;
          const distance = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) + 
            Math.pow(endPoint.y - startPoint.y, 2)
          );
          
          if (distance > 5) { // Minimum distance check
            newShape = {
              type: 'line',
              id: `line_${Date.now()}`,
              path: `M${startPoint.x},${startPoint.y} L${endPoint.x},${endPoint.y}`,
              color: canvasState.currentColor,
              strokeWidth: canvasState.brushSize,
              opacity: canvasState.brushOpacity,
            };
          }
        }
        break;
    }
    
    // Add shape to pattern if created
    if (newShape) {
      addShape(newShape);
    }
    
    // Reset drawing state
    setIsDrawing(false);
    setCurrentPath([]);
    setShapeInProgress(null);
  }, [isDrawing, canvasState, currentPath, shapeInProgress, addShape]);

  // Render existing shapes
  const renderShapes = useCallback(() => {
    if (!pattern) return [];
    
    const shapes: React.ReactNode[] = [];
    
    pattern.layers.forEach(layer => {
      if (layer.type === 'vector' && layer.visible) {
        (layer as any).shapes.forEach((shape: VectorShape) => {
          switch (shape.type) {
            case 'brush':
              if (shape.path) {
                const points = shape.path
                  .split(/[ML]/)
                  .slice(1)
                  .flatMap(coord => {
                    const [x, y] = coord.trim().split(',').map(Number);
                    return [x, y];
                  })
                  .filter(n => !isNaN(n));

                shapes.push(
                  <Line
                    key={shape.id}
                    points={points}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    opacity={shape.opacity}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              }
              break;
              
            case 'rectangle':
              if (shape.x !== undefined && shape.y !== undefined && 
                  shape.width !== undefined && shape.height !== undefined) {
                shapes.push(
                  <Rect
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    width={shape.width}
                    height={shape.height}
                    fill={shape.color}
                    opacity={shape.opacity}
                  />
                );
              }
              break;
              
            case 'circle':
              if (shape.x !== undefined && shape.y !== undefined && shape.radius !== undefined) {
                shapes.push(
                  <KonvaCircle
                    key={shape.id}
                    x={shape.x}
                    y={shape.y}
                    radius={shape.radius}
                    fill={shape.color}
                    opacity={shape.opacity}
                  />
                );
              }
              break;
              
            case 'line':
              if (shape.path) {
                const points = shape.path
                  .split(/[ML]/)
                  .slice(1)
                  .flatMap(coord => {
                    const [x, y] = coord.trim().split(',').map(Number);
                    return [x, y];
                  })
                  .filter(n => !isNaN(n));

                shapes.push(
                  <Line
                    key={shape.id}
                    points={points}
                    stroke={shape.color}
                    strokeWidth={shape.strokeWidth}
                    opacity={shape.opacity}
                    lineCap="round"
                  />
                );
              }
              break;
          }
        });
      }
    });
    
    return shapes;
  }, [pattern]);

  // Render current drawing
  const renderCurrentDrawing = useCallback(() => {
    const elements: React.ReactNode[] = [];
    
    // Brush/Eraser preview
    if (isDrawing && (canvasState.tool === 'brush' || canvasState.tool === 'eraser') && currentPath.length >= 2) {
      const points = currentPath.flatMap(point => [point.x, point.y]);
      
      elements.push(
        <Line
          key="current-path"
          points={points}
          stroke={canvasState.tool === 'eraser' ? '#ffffff' : canvasState.currentColor}
          strokeWidth={canvasState.brushSize}
          opacity={0.8}
          lineCap="round"
          lineJoin="round"
        />
      );
    }
    
    // Shape preview
    if (isDrawing && shapeInProgress) {
      const { type, startPoint, endPoint } = shapeInProgress;
      
      switch (type) {
        case 'rectangle':
          const x = Math.min(startPoint.x, endPoint.x);
          const y = Math.min(startPoint.y, endPoint.y);
          const width = Math.abs(endPoint.x - startPoint.x);
          const height = Math.abs(endPoint.y - startPoint.y);
          
          elements.push(
            <Rect
              key="shape-preview"
              x={x}
              y={y}
              width={width}
              height={height}
              fill={canvasState.currentColor}
              opacity={0.5}
              stroke={canvasState.currentColor}
              strokeWidth={1}
            />
          );
          break;
          
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(endPoint.x - startPoint.x, 2) + 
            Math.pow(endPoint.y - startPoint.y, 2)
          ) / 2;
          
          elements.push(
            <KonvaCircle
              key="shape-preview"
              x={startPoint.x}
              y={startPoint.y}
              radius={radius}
              fill={canvasState.currentColor}
              opacity={0.5}
              stroke={canvasState.currentColor}
              strokeWidth={1}
            />
          );
          break;
          
        case 'line':
          elements.push(
            <Line
              key="shape-preview"
              points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
              stroke={canvasState.currentColor}
              strokeWidth={canvasState.brushSize}
              opacity={0.8}
              lineCap="round"
            />
          );
          break;
      }
    }
    
    return elements;
  }, [isDrawing, canvasState, currentPath, shapeInProgress]);

  // Get cursor style based on tool
  const getCursorStyle = useCallback(() => {
    switch (canvasState.tool) {
      case 'brush': return 'crosshair';
      case 'eraser': return 'grab';
      case 'rectangle': return 'nw-resize';
      case 'circle': return 'crosshair';
      case 'line': return 'crosshair';
      default: return 'default';
    }
  }, [canvasState.tool]);

  return (
    <div className={`canvas-container ${className}`}>
      {/* Canvas Info */}
      <div className="canvas-info mb-2 text-sm text-gray-600">
        Pattern: {pattern?.metadata.size.width || 20} × {pattern?.metadata.size.height || 20} {pattern?.metadata.size.unit || 'cm'} | 
        Tool: <strong>{canvasState.tool}</strong> | 
        Size: {canvasState.brushSize}px | 
        Color: {canvasState.currentColor} | 
        Grid: {canvasState.gridEnabled ? 'ON' : 'OFF'}
      </div>
      
      {/* Main Canvas */}
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}
        style={{ 
          border: '1px solid #ddd',
          background: 'white',
          cursor: getCursorStyle()
        }}
      >
        {/* Grid Layer */}
        <Layer>
          {generateGridLines()}
        </Layer>
        
        {/* Drawing Layer */}
        <Layer ref={layerRef}>
          {/* Existing shapes */}
          {renderShapes()}
          
          {/* Current drawing preview */}
          {renderCurrentDrawing()}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;