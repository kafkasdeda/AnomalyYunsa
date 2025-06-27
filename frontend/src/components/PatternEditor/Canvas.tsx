// 📝 Enhanced Canvas Component - Multi-Tool Support
// File: frontend/src/components/PatternEditor/Canvas.tsx
// Purpose: Drawing canvas with brush, rectangle, circle, line, eraser support

import React, { useEffect, useCallback, useState } from 'react';
import { Stage, Layer, Line, Rect, Circle as KonvaCircle } from 'react-konva';
import { useCanvas } from '../../hooks/useCanvas';
import type { VectorShape, PatternSize } from '../../types/pattern';
import { ContextMenu } from './import/ContextMenu';
import { ImageImporter } from './import/ImageImporter';
import { processImageFile, validateImageFile, calculateOptimalPatternSize } from './import/imageProcessor';
import { loadImageToCanvas } from './import/canvasImageLoader';

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
    setPatternSize,
  } = canvasHook || fallbackHook;

  // Get responsive canvas size
  const canvasPixelSize = getCanvasPixelSize();
  const canvasWidth = width || canvasPixelSize.width;
  const canvasHeight = height || canvasPixelSize.height;
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [shapeInProgress, setShapeInProgress] = useState<ShapeInProgress | null>(null);
  
  // Debug state
  const [showDebugGrid, setShowDebugGrid] = useState(false);
  const [showImageBounds, setShowImageBounds] = useState(false);
  
  // Image import state
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [imageImporter, setImageImporter] = useState({ open: false });
  const [resizeConfirmation, setResizeConfirmation] = useState<{
    open: boolean;
    suggestedSize?: PatternSize;
    processedImage?: any;
  }>({ open: false });

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

  // Debug grid overlay
  const renderDebugGrid = useCallback(() => {
    if (!showDebugGrid) return [];
    
    const lines = [];
    
    // Vertical grid lines (her 10px)
    for (let i = 0; i <= canvasWidth; i += 10) {
      lines.push(
        <Line
          key={`debug-v-${i}`}
          points={[i, 0, i, canvasHeight]}
          stroke={i % 50 === 0 ? "#ff0000" : "#cccccc"}
          strokeWidth={i % 50 === 0 ? 1 : 0.5}
          opacity={0.3}
        />
      );
    }
    
    // Horizontal grid lines (her 10px)
    for (let j = 0; j <= canvasHeight; j += 10) {
      lines.push(
        <Line
          key={`debug-h-${j}`}
          points={[0, j, canvasWidth, j]}
          stroke={j % 50 === 0 ? "#ff0000" : "#cccccc"}
          strokeWidth={j % 50 === 0 ? 1 : 0.5}
          opacity={0.3}
        />
      );
    }
    
    return lines;
  }, [showDebugGrid, canvasWidth, canvasHeight]);

  // Canvas border debug
  const renderCanvasBorder = useCallback(() => {
    return (
      <Rect
        x={0}
        y={0}
        width={canvasWidth}
        height={canvasHeight}
        stroke="#ff0000"
        strokeWidth={2}
        fill="transparent"
        listening={false}
        name="canvasBorder"
      />
    );
  }, [canvasWidth, canvasHeight]);

  // Image bounds debug
  const renderImageBounds = useCallback(() => {
    if (!showImageBounds || !stageRef.current) return null;
    
    const imageLayer = stageRef.current.findOne('.backgroundImage');
    if (!imageLayer) return null;
    
    const imageWidth = imageLayer.width() * imageLayer.scaleX();
    const imageHeight = imageLayer.height() * imageLayer.scaleY();
    const imageX = imageLayer.x();
    const imageY = imageLayer.y();
    
    return (
      <Rect
        x={imageX}
        y={imageY}
        width={imageWidth}
        height={imageHeight}
        stroke="#00ff00"
        strokeWidth={1}
        fill="transparent"
        listening={false}
        name="imageBounds"
        dash={[5, 5]}
      />
    );
  }, [showImageBounds]);

  // Enhanced Debug log with comprehensive analysis
  React.useEffect(() => {
    if (stageRef.current) {
      const stage = stageRef.current;
      console.log('🎯 CANVAS DEBUG - Dimensions:');
      console.log('Canvas dimensions:', { width: canvasWidth, height: canvasHeight });
      console.log('Stage size:', { width: stage.width(), height: stage.height() });
      console.log('Stage container:', stage.container()?.getBoundingClientRect());
      console.log('Pattern metadata:', pattern?.metadata.size);
      
      // Image debug (eğer background image varsa)
      const imageLayer = stage.findOne('.backgroundImage');
      if (imageLayer) {
        console.log('🖼️ IMAGE DEBUG:');
        console.log('Image dimensions:', { width: imageLayer.width(), height: imageLayer.height() });
        console.log('Image position:', { x: imageLayer.x(), y: imageLayer.y() });
        console.log('Image scale:', { scaleX: imageLayer.scaleX(), scaleY: imageLayer.scaleY() });
        console.log('Image actual size:', { 
          width: imageLayer.width() * imageLayer.scaleX(), 
          height: imageLayer.height() * imageLayer.scaleY() 
        });
      }
      
      // Force Stage size update for drawing bounds
      console.log('🌐 Updating Stage size to:', canvasWidth, 'x', canvasHeight);
      stage.size({ width: canvasWidth, height: canvasHeight });
      stage.batchDraw();
    }
  }, [canvasWidth, canvasHeight, pattern?.metadata.size]);

  // Right-click handler for context menu
  const handleContextMenu = useCallback((e: any) => {
    e.evt.preventDefault();
    const pos = e.target.getStage().getPointerPosition();
    setContextMenu({ visible: true, x: pos.x, y: pos.y });
  }, []);

  // Image import handlers
  const handleImportPattern = useCallback(() => {
    setImageImporter({ open: true });
  }, []);

  const handleImageSelect = useCallback(async (file: File) => {
    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      // First, calculate suggested pattern size
      const img = new Image();
      const suggestedSize = await new Promise<PatternSize>((resolve, reject) => {
        img.onload = () => {
          // Use direct import instead of require
          const size = calculateOptimalPatternSize(img.naturalWidth, img.naturalHeight);
          resolve(size);
          URL.revokeObjectURL(img.src); // Clean up
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src); // Clean up
          reject(new Error('Failed to load image'));
        };
        img.src = URL.createObjectURL(file);
      });

      // Check if suggested size is different from current
      const currentSize = pattern?.metadata.size;
      
      if (currentSize && 
          (suggestedSize.width !== currentSize.width || 
           suggestedSize.height !== currentSize.height)) {
        // Show confirmation dialog with file and suggested size
        setResizeConfirmation({
          open: true,
          suggestedSize,
          processedImage: { file, suggestedSize } // Store file for later processing
        });
      } else {
        // Process image for current canvas size and load
        const processedImage = await processImageFile(file, {
          targetSize: currentSize || { width: 20, height: 20, unit: 'cm' },
          maintainAspectRatio: true,
          quality: 0.8
        });
        await loadImageToCanvas(stageRef.current!, processedImage);
      }
    } catch (error) {
      console.error('Error importing image:', error);
      alert('Failed to import image. Please try again.');
    }
  }, [pattern, stageRef]);

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
      {/* Debug Controls */}
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '4px' }}>
            <input 
              type="checkbox" 
              checked={showDebugGrid}
              onChange={(e) => setShowDebugGrid(e.target.checked)}
              style={{ marginRight: '6px' }}
            />
            Debug Grid
          </label>
          <label style={{ display: 'block' }}>
            <input 
              type="checkbox" 
              checked={showImageBounds}
              onChange={(e) => setShowImageBounds(e.target.checked)}
              style={{ marginRight: '6px' }}
            />
            Image Bounds
          </label>
        </div>
        <div>Canvas: {canvasWidth}×{canvasHeight}px</div>
        <div>Pattern: {pattern?.metadata.size.width || 20}×{pattern?.metadata.size.height || 20}{pattern?.metadata.size.unit || 'cm'}</div>
        <div>Stage: {stageRef.current?.width()}×{stageRef.current?.height()}</div>
      </div>

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
        onContextMenu={handleContextMenu}
        ref={stageRef}
        style={{ 
          border: '1px solid #ddd',
          background: 'white',
          cursor: getCursorStyle()
        }}
      >
        {/* Grid Layer */}
        <Layer name="gridLayer" className="gridLayer">
          {generateGridLines()}
          
          {/* Debug Grid */}
          {renderDebugGrid()}
          
          {/* Canvas Border */}
          {renderCanvasBorder()}
          
          {/* Image Bounds */}
          {renderImageBounds()}
        </Layer>
        
        {/* Drawing Layer */}
        <Layer ref={layerRef}>
          {/* Existing shapes */}
          {renderShapes()}
          
          {/* Current drawing preview */}
          {renderCurrentDrawing()}
        </Layer>
      </Stage>
      
      {/* Context Menu */}
      <ContextMenu
        isVisible={contextMenu.visible}
        position={{ x: contextMenu.x, y: contextMenu.y }}
        onImportPattern={handleImportPattern}
        onClose={() => setContextMenu({ visible: false, x: 0, y: 0 })}
      />
      
      {/* Image Importer Modal */}
      <ImageImporter
        isOpen={imageImporter.open}
        onClose={() => setImageImporter({ open: false })}
        onImageSelect={handleImageSelect}
      />
      
      {/* Canvas Resize Confirmation Dialog */}
      {resizeConfirmation.open && resizeConfirmation.suggestedSize && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              🎨 Canvas Auto-Resize
            </h3>
            <p style={{ margin: '0 0 16px 0', lineHeight: '1.5' }}>
              This pattern would look best at <strong>{resizeConfirmation.suggestedSize.width}×{resizeConfirmation.suggestedSize.height}{resizeConfirmation.suggestedSize.unit}</strong> to maintain its original quality.
            </p>
            <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#666' }}>
              Current canvas: {pattern?.metadata.size.width}×{pattern?.metadata.size.height}{pattern?.metadata.size.unit}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  // Keep current size, load image as-is
                  if (stageRef.current && resizeConfirmation.processedImage) {
                    const { file } = resizeConfirmation.processedImage;
                    
                    // Process image for current canvas size
                    processImageFile(file, {
                      targetSize: pattern?.metadata.size || { width: 20, height: 20, unit: 'cm' },
                      maintainAspectRatio: true,
                      quality: 0.8
                    }).then(processedImage => {
                      return loadImageToCanvas(stageRef.current!, processedImage);
                    }).catch(error => {
                      console.error('Error loading image with current size:', error);
                    });
                  }
                  setResizeConfirmation({ open: false });
                }}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                Keep Current Size
              </button>
              <button
                onClick={async () => {
                  // Resize canvas to suggested size
                  if (resizeConfirmation.suggestedSize && resizeConfirmation.processedImage) {
                    console.log('🎯 Auto-resize with fresh processing:', resizeConfirmation.suggestedSize);
                    
                    try {
                      // Step 1: Resize canvas first
                      setPatternSize(resizeConfirmation.suggestedSize);
                      
                      // Step 2: Close dialog
                      setResizeConfirmation({ open: false });
                      
                      // Step 3: Wait for canvas resize, then process image for NEW size
                      setTimeout(async () => {
                        const { file, suggestedSize } = resizeConfirmation.processedImage;
                        
                        console.log('🖼️ Processing image for new canvas size:', suggestedSize);
                        
                        // Process image specifically for the new canvas size
                        const newProcessedImage = await processImageFile(file, {
                          targetSize: suggestedSize,
                          maintainAspectRatio: true,
                          quality: 0.8
                        });
                        
                        // Load the properly sized image
                        if (stageRef.current) {
                          await loadImageToCanvas(stageRef.current, newProcessedImage);
                          console.log('✅ Image loaded with correct dimensions');
                        }
                      }, 300);
                    } catch (error) {
                      console.error('❌ Error in auto-resize:', error);
                    }
                  }
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Auto-Resize Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;