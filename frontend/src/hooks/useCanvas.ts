// 📝 Canvas State Management Hook
// File: frontend/src/hooks/useCanvas.ts
// Purpose: Manage canvas state, tools, and pattern data

import { useState, useCallback, useRef } from 'react';
import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';
import type { CanvasState, Pattern, PatternLayer, VectorShape, ToolConfig, PatternSize } from '../types/pattern';

interface UseCanvasReturn {
  // Canvas state
  canvasState: CanvasState;
  pattern: Pattern | null;
  
  // Canvas refs
  stageRef: React.RefObject<Stage>;
  layerRef: React.RefObject<Layer>;
  
  // Tool management
  setTool: (tool: CanvasState['tool']) => void;
  setBrushSize: (size: number) => void;
  setCurrentColor: (color: string) => void;
  setBrushOpacity: (opacity: number) => void;
  toolConfig: ToolConfig;
  updateToolConfig: (tool: string, config: any) => void;
  
  // Grid management
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  
  // Canvas manipulation
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  resetView: () => void;
  
  // Pattern management
  createNewPattern: (width: number, height: number, unit: 'cm' | 'mm' | 'inch') => void;
  setPatternSize: (size: PatternSize) => void;
  getCanvasPixelSize: () => { width: number; height: number };
  resetCanvas: () => void;
  addShape: (shape: VectorShape) => void;
  removeShape: (shapeId: string, layerId: string) => void;
  updateShape: (shapeId: string, layerId: string, updates: Partial<VectorShape>) => void;
  
  // Layer management
  addLayer: (layer: PatternLayer) => void;
  removeLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<PatternLayer>) => void;
  
  // Pattern operations
  exportPattern: () => Pattern | null;
  importPattern: (pattern: Pattern) => void;
  clearPattern: () => void;
}

export const useCanvas = (): UseCanvasReturn => {
  // Canvas state
  const [canvasState, setCanvasState] = useState<CanvasState>({
    tool: 'brush',
    brushSize: 10,
    currentColor: '#000000',
    brushOpacity: 1.0,
    gridEnabled: true,
    gridSize: 10, // 1cm = 10px default
    snapToGrid: true,
    zoom: 1,
    panX: 0,
    panY: 0,
  });

  // Pattern state
  const [pattern, setPattern] = useState<Pattern | null>(null);

  // Tool configuration
  const [toolConfig, setToolConfig] = useState<ToolConfig>({
    brush: { size: 10, opacity: 1 },
    rectangle: { strokeWidth: 2 },
    circle: { strokeWidth: 2 },
    line: { strokeWidth: 2 },
    eraser: { size: 15 },
  });

  // Canvas refs
  const stageRef = useRef<Stage>(null);
  const layerRef = useRef<Layer>(null);

  // Tool management
  const setTool = useCallback((tool: CanvasState['tool']) => {
    setCanvasState(prev => ({ ...prev, tool }));
  }, []);

  const setBrushSize = useCallback((size: number) => {
    setCanvasState(prev => ({ ...prev, brushSize: size }));
    setToolConfig(prev => ({
      ...prev,
      brush: { ...prev.brush, size },
      eraser: { ...prev.eraser, size },
    }));
  }, []);

  const setCurrentColor = useCallback((color: string) => {
    setCanvasState(prev => ({ ...prev, currentColor: color }));
  }, []);

  const setBrushOpacity = useCallback((opacity: number) => {
    setCanvasState(prev => ({ ...prev, brushOpacity: opacity }));
  }, []);

  const updateToolConfig = useCallback((tool: string, config: any) => {
    setToolConfig(prev => ({
      ...prev,
      [tool]: { ...prev[tool as keyof ToolConfig], ...config },
    }));
  }, []);

  // Grid management
  const toggleGrid = useCallback(() => {
    setCanvasState(prev => ({ ...prev, gridEnabled: !prev.gridEnabled }));
  }, []);

  const toggleSnapToGrid = useCallback(() => {
    setCanvasState(prev => ({ ...prev, snapToGrid: !prev.snapToGrid }));
  }, []);

  const setGridSize = useCallback((size: number) => {
    setCanvasState(prev => ({ ...prev, gridSize: size }));
  }, []);

  // Canvas manipulation
  const setZoom = useCallback((zoom: number) => {
    setCanvasState(prev => ({ ...prev, zoom: Math.max(0.1, Math.min(5, zoom)) }));
  }, []);

  const setPan = useCallback((x: number, y: number) => {
    setCanvasState(prev => ({ ...prev, panX: x, panY: y }));
  }, []);

  const resetView = useCallback(() => {
    setCanvasState(prev => ({ ...prev, zoom: 1, panX: 0, panY: 0 }));
  }, []);

  // Pattern management
  const createNewPattern = useCallback((width: number, height: number, unit: 'cm' | 'mm' | 'inch') => {
    const newPattern: Pattern = {
      id: `pattern_${Date.now()}`,
      metadata: {
        size: { width, height, unit },
        createdAt: new Date().toISOString(),
        method: 'manual',
      },
      layers: [
        {
          id: 'drawing_layer_1',
          type: 'vector',
          shapes: [],
          visible: true,
          opacity: 1,
        },
      ],
      seamless: {
        validated: false,
        edgeMatching: { top: false, right: false, bottom: false, left: false },
      },
    };
    setPattern(newPattern);
  }, []);

  // Shape management
  const addShape = useCallback((shape: VectorShape) => {
    if (!pattern) return;
    
    setPattern(prev => {
      if (!prev) return prev;
      
      const vectorLayer = prev.layers.find(l => l.type === 'vector') as any;
      if (!vectorLayer) return prev;
      
      return {
        ...prev,
        layers: prev.layers.map(layer =>
          layer.id === vectorLayer.id
            ? { ...layer, shapes: [...(layer as any).shapes, shape] }
            : layer
        ),
      };
    });
  }, [pattern]);

  // Export/Import
  const exportPattern = useCallback(() => {
    return pattern;
  }, [pattern]);

  const importPattern = useCallback((newPattern: Pattern) => {
    setPattern(newPattern);
  }, []);

  const clearPattern = useCallback(() => {
    setPattern(null);
  }, []);

  // Size management
  const setPatternSize = useCallback((size: PatternSize) => {
    if (pattern) {
      // Update existing pattern size
      setPattern(prev => prev ? {
        ...prev,
        metadata: { ...prev.metadata, size }
      } : null);
    } else {
      // Create new pattern with this size
      createNewPattern(size.width, size.height, size.unit);
    }
    
    // Update grid size based on unit and canvas pixel size
    const pixelSize = getCanvasPixelSizeForPatternSize(size);
    const gridPixelSize = calculateGridSize(size, pixelSize);
    setGridSize(gridPixelSize);
  }, [pattern]);

  const getCanvasPixelSize = useCallback(() => {
    if (!pattern) return { width: 600, height: 600 };
    return getCanvasPixelSizeForPatternSize(pattern.metadata.size);
  }, [pattern]);

  const resetCanvas = useCallback(() => {
    setPattern(prev => prev ? {
      ...prev,
      layers: prev.layers.map(layer => 
        layer.type === 'vector' 
          ? { ...layer, shapes: [] }
          : layer
      )
    } : null);
  }, []);

  // Helper functions for size calculations
  const getCanvasPixelSizeForPatternSize = (size: PatternSize) => {
    // Convert to cm for calculation (EXACT precision)
    let cmWidth = size.width;
    let cmHeight = size.height;
    
    if (size.unit === 'mm') {
      cmWidth = size.width / 10;
      cmHeight = size.height / 10;
    } else if (size.unit === 'inch') {
      cmWidth = size.width * 2.54;
      cmHeight = size.height * 2.54;
    }
    
    // Responsive scaling based on pattern size
    let pixelsPerCm;
    const totalCmArea = cmWidth * cmHeight;
    
    if (totalCmArea <= 100) { // Small patterns (10x10 or smaller)
      pixelsPerCm = 40; // High detail
    } else if (totalCmArea <= 400) { // Medium patterns (20x20 or smaller)
      pixelsPerCm = 30; // Medium detail
    } else if (totalCmArea <= 900) { // Large patterns (30x30 or smaller)
      pixelsPerCm = 20; // Lower detail
    } else { // Very large patterns
      pixelsPerCm = 12; // Minimal detail to fit screen
    }
    
    // EXACT pixel calculation - NO ROUNDING!
    const exactWidth = cmWidth * pixelsPerCm;
    const exactHeight = cmHeight * pixelsPerCm;
    
    console.log('🎯 CANVAS PIXEL SIZE CALCULATION:');
    console.log('Pattern size:', size);
    console.log('CM dimensions:', { width: cmWidth, height: cmHeight });
    console.log('Pixels per cm:', pixelsPerCm);
    console.log('EXACT pixel size:', { width: exactWidth, height: exactHeight });
    
    return {
      width: exactWidth,   // NO Math.round() - exact precision!
      height: exactHeight  // NO Math.round() - exact precision!
    };
  };

  const calculateGridSize = (patternSize: PatternSize, pixelSize: { width: number; height: number }) => {
    // 1cm grid in pixels
    const cmInPixels = pixelSize.width / (
      patternSize.unit === 'cm' ? patternSize.width :
      patternSize.unit === 'mm' ? patternSize.width / 10 :
      patternSize.width * 2.54 // inch
    );
    return Math.max(5, Math.round(cmInPixels)); // Minimum 5px grid
  };

  // Placeholder implementations for other methods
  const removeShape = useCallback((shapeId: string, layerId: string) => {
    // TODO: Implement in next phase
  }, []);

  const updateShape = useCallback((shapeId: string, layerId: string, updates: Partial<VectorShape>) => {
    // TODO: Implement in next phase
  }, []);

  const addLayer = useCallback((layer: PatternLayer) => {
    // TODO: Implement in next phase
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    // TODO: Implement in next phase
  }, []);

  const updateLayer = useCallback((layerId: string, updates: Partial<PatternLayer>) => {
    // TODO: Implement in next phase
  }, []);

  return {
    canvasState,
    pattern,
    stageRef,
    layerRef,
    setTool,
    setBrushSize,
    setCurrentColor,
    setBrushOpacity,
    toolConfig,
    updateToolConfig,
    toggleGrid,
    toggleSnapToGrid,
    setGridSize,
    setZoom,
    setPan,
    resetView,
    createNewPattern,
    setPatternSize,
    getCanvasPixelSize,
    resetCanvas,
    addShape,
    removeShape,
    updateShape,
    addLayer,
    removeLayer,
    updateLayer,
    exportPattern,
    importPattern,
    clearPattern,
  };
};
