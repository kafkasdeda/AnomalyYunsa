import React, { useRef, useEffect, useState } from 'react';
import { Stage } from 'konva/lib/Stage';

interface PreviewWindowProps {
  patternCanvas: HTMLCanvasElement | null;
  patternSize: {
    width: number;
    height: number;
    unit: string;
  };
  isVisible: boolean;
}

interface SeamlessValidation {
  isSeamless: boolean;
  topEdge: boolean;
  rightEdge: boolean;
  bottomEdge: boolean;
  leftEdge: boolean;
  score: number; // 0-100, higher is better
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({
  patternCanvas,
  patternSize,
  isVisible
}) => {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [validation, setValidation] = useState<SeamlessValidation>({
    isSeamless: false,
    topEdge: false,
    rightEdge: false,
    bottomEdge: false,
    leftEdge: false,
    score: 0
  });
  const [isValidating, setIsValidating] = useState(false);

  // Calculate preview canvas size (2x2 grid with max 300x300px total)
  const getPreviewSize = () => {
    if (!patternCanvas) return { width: 200, height: 200 };

    const aspectRatio = patternCanvas.width / patternCanvas.height;
    const maxSize = 150; // Each tile max 150px

    let tileWidth, tileHeight;
    
    if (aspectRatio > 1) {
      // Landscape
      tileWidth = Math.min(maxSize, patternCanvas.width);
      tileHeight = tileWidth / aspectRatio;
    } else {
      // Portrait or square
      tileHeight = Math.min(maxSize, patternCanvas.height);
      tileWidth = tileHeight * aspectRatio;
    }

    return {
      tileWidth: Math.round(tileWidth),
      tileHeight: Math.round(tileHeight),
      totalWidth: Math.round(tileWidth * 2),
      totalHeight: Math.round(tileHeight * 2)
    };
  };

  // Create 2x2 tile preview
  const createTilePreview = () => {
    if (!patternCanvas || !previewCanvasRef.current) return;

    const previewCanvas = previewCanvasRef.current;
    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;

    const { tileWidth, tileHeight, totalWidth, totalHeight } = getPreviewSize();
    
    // Set canvas size
    previewCanvas.width = totalWidth;
    previewCanvas.height = totalHeight;

    // Clear canvas
    ctx.clearRect(0, 0, totalWidth, totalHeight);

    // Draw 2x2 grid of pattern tiles
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const x = col * tileWidth;
        const y = row * tileHeight;
        
        ctx.drawImage(
          patternCanvas,
          0, 0, patternCanvas.width, patternCanvas.height,
          x, y, tileWidth, tileHeight
        );
      }
    }

    // Trigger edge validation after drawing
    validateSeamlessEdges();
  };

  // Validate seamless edges
  const validateSeamlessEdges = () => {
    if (!previewCanvasRef.current) return;

    setIsValidating(true);
    
    // Use requestAnimationFrame to avoid blocking UI
    requestAnimationFrame(() => {
      const canvas = previewCanvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const { tileWidth, tileHeight } = getPreviewSize();

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Helper function to get pixel at position
      const getPixel = (x: number, y: number) => {
        const index = (y * canvas.width + x) * 4;
        return {
          r: data[index],
          g: data[index + 1], 
          b: data[index + 2],
          a: data[index + 3]
        };
      };

      // Helper function to calculate color difference
      const colorDiff = (p1: any, p2: any) => {
        return Math.sqrt(
          Math.pow(p1.r - p2.r, 2) +
          Math.pow(p1.g - p2.g, 2) +
          Math.pow(p1.b - p2.b, 2)
        );
      };

      let totalDifference = 0;
      let sampleCount = 0;
      let edgeResults = {
        topEdge: true,
        rightEdge: true,
        bottomEdge: true,
        leftEdge: true
      };

      const threshold = 30; // Color difference threshold for "seamless"
      const sampleStep = Math.max(1, Math.floor(Math.min(tileWidth, tileHeight) / 20)); // Sample every N pixels

      // Check vertical seam (center)
      const centerX = tileWidth;
      for (let y = 0; y < canvas.height; y += sampleStep) {
        if (centerX > 0 && centerX < canvas.width - 1) {
          const leftPixel = getPixel(centerX - 1, y);
          const rightPixel = getPixel(centerX, y);
          const diff = colorDiff(leftPixel, rightPixel);
          
          totalDifference += diff;
          sampleCount++;
          
          if (diff > threshold) {
            if (y < tileHeight) edgeResults.topEdge = false;
            else edgeResults.bottomEdge = false;
          }
        }
      }

      // Check horizontal seam (center)
      const centerY = tileHeight;
      for (let x = 0; x < canvas.width; x += sampleStep) {
        if (centerY > 0 && centerY < canvas.height - 1) {
          const topPixel = getPixel(x, centerY - 1);
          const bottomPixel = getPixel(x, centerY);
          const diff = colorDiff(topPixel, bottomPixel);
          
          totalDifference += diff;
          sampleCount++;
          
          if (diff > threshold) {
            if (x < tileWidth) edgeResults.leftEdge = false;
            else edgeResults.rightEdge = false;
          }
        }
      }

      // Calculate overall score
      const avgDifference = sampleCount > 0 ? totalDifference / sampleCount : 0;
      const score = Math.max(0, Math.round(100 - (avgDifference / threshold) * 100));
      const isSeamless = score > 70; // Consider seamless if score > 70%

      setValidation({
        isSeamless,
        ...edgeResults,
        score
      });
      
      setIsValidating(false);
    });
  };

  // Update preview when pattern changes
  useEffect(() => {
    if (patternCanvas && isVisible) {
      createTilePreview();
    }
  }, [patternCanvas, isVisible, patternSize]);

  if (!isVisible) return null;

  const { totalWidth, totalHeight, tileWidth, tileHeight } = getPreviewSize();

  return (
    <div className="preview-window bg-white border rounded-lg p-4 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">
          Seamless Preview (2×2)
        </h3>
        <div className="flex items-center space-x-2">
          {isValidating ? (
            <div className="text-xs text-blue-600">Validating...</div>
          ) : (
            <div className={`text-xs font-medium ${
              validation.isSeamless ? 'text-green-600' : 'text-red-600'
            }`}>
              {validation.isSeamless ? '✅ Seamless' : '❌ Has gaps'}
            </div>
          )}
          <div className="text-xs text-gray-500">
            Score: {validation.score}%
          </div>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="relative">
        <canvas
          ref={previewCanvasRef}
          className="border border-gray-300 bg-white"
          style={{
            width: `${totalWidth}px`,
            height: `${totalHeight}px`,
            imageRendering: 'pixelated' // Crisp pixel display
          }}
        />
        
        {/* Grid overlay to show tile boundaries */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.3) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.3) 1px, transparent 1px)
            `,
            backgroundSize: `${tileWidth}px ${tileHeight}px`
          }}
        />
      </div>

      {/* Edge validation details */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center ${validation.topEdge ? 'text-green-600' : 'text-red-600'}`}>
          {validation.topEdge ? '✅' : '❌'} Top edge
        </div>
        <div className={`flex items-center ${validation.rightEdge ? 'text-green-600' : 'text-red-600'}`}>
          {validation.rightEdge ? '✅' : '❌'} Right edge
        </div>
        <div className={`flex items-center ${validation.bottomEdge ? 'text-green-600' : 'text-red-600'}`}>
          {validation.bottomEdge ? '✅' : '❌'} Bottom edge
        </div>
        <div className={`flex items-center ${validation.leftEdge ? 'text-green-600' : 'text-red-600'}`}>
          {validation.leftEdge ? '✅' : '❌'} Left edge
        </div>
      </div>

      {/* Pattern info */}
      <div className="mt-2 text-xs text-gray-500">
        Pattern: {patternSize.width}×{patternSize.height}{patternSize.unit}
      </div>
    </div>
  );
};
