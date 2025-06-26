// 📝 Pattern Type Definitions
// File: frontend/src/types/pattern.ts
// Purpose: Unified pattern format for manual drawing and image import
// Tool types
export type ToolType = 'brush' | 'rectangle' | 'circle' | 'line' | 'eraser' | 'select';

export interface CanvasState {
  tool: ToolType;
  brushSize: number;
  currentColor: string;
  brushOpacity: number;
  gridEnabled: boolean;
  gridSize: number;
  snapToGrid: boolean;
  zoom: number;
  panX: number;
  panY: number;
}


export interface PatternSize {
  width: number;
  height: number;
  unit: 'cm' | 'mm' | 'inch';
  label?: string; // Optional display label
}

export interface PatternMetadata {
  size: PatternSize;
  createdAt: string;
  method: 'manual' | 'import';
  name?: string;
  description?: string;
}

export interface Transform {
  scale: number;
  rotate: number;
  x?: number;
  y?: number;
}

export interface ImageLayer {
  id: string;
  type: 'image';
  src: string; // base64 or url
  transform: Transform;
  opacity: number;
  visible: boolean;
}

export interface VectorShape {
  type: 'brush' | 'rectangle' | 'circle' | 'line';
  id: string;
  // Brush path
  path?: string; // SVG path format
  // Shape properties
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  // Style
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface VectorLayer {
  id: string;
  type: 'vector';
  shapes: VectorShape[];
  visible: boolean;
  opacity: number;
}

export type PatternLayer = ImageLayer | VectorLayer;

export interface SeamlessValidation {
  validated: boolean;
  edgeMatching: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  lastValidated?: string;
}

export interface Pattern {
  id: string;
  metadata: PatternMetadata;
  layers: PatternLayer[];
  seamless: SeamlessValidation;
}



// Tool configuration
export interface ToolConfig {
  brush: { size: number; opacity: number };
  rectangle: { strokeWidth: number; fill?: string };
  circle: { strokeWidth: number; fill?: string };
  line: { strokeWidth: number };
  eraser: { size: number };
}
