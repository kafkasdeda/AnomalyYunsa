import type { PatternSize } from '../../../types/pattern';

export interface ProcessedImage {
  dataUrl: string;
  originalWidth: number;
  originalHeight: number;
  scaledWidth: number;
  scaledHeight: number;
  scaleRatio: number;
  suggestedPatternSize?: PatternSize; // New: Auto-calculated optimal size
}

export interface ImageProcessorOptions {
  targetSize: PatternSize;
  maintainAspectRatio?: boolean;
  quality?: number; // 0.1 to 1.0
  autoResize?: boolean; // New: Enable auto-resize to image dimensions
}

/**
 * Calculate optimal pattern size based on image dimensions
 */
export function calculateOptimalPatternSize(
  imageWidth: number,
  imageHeight: number,
  preferredPixelsPerCm: number = 30
): PatternSize {
  // Calculate EXACT dimensions in cm based on pixel density (NO ROUNDING!)
  const widthCm = imageWidth / preferredPixelsPerCm;
  const heightCm = imageHeight / preferredPixelsPerCm;
  
  // Ensure minimum size (at least 5cm) while preserving aspect ratio
  const aspectRatio = widthCm / heightCm;
  let finalWidthCm = Math.max(5, widthCm);
  let finalHeightCm = Math.max(5, heightCm);
  
  // If we had to increase dimensions, preserve aspect ratio
  if (widthCm < 5 || heightCm < 5) {
    if (aspectRatio > 1) {
      // Width is larger
      finalWidthCm = Math.max(5, finalWidthCm);
      finalHeightCm = finalWidthCm / aspectRatio;
    } else {
      // Height is larger or equal
      finalHeightCm = Math.max(5, finalHeightCm);
      finalWidthCm = finalHeightCm * aspectRatio;
    }
  }
  
  // Ensure maximum reasonable size (max 100cm) while preserving aspect ratio
  let maxWidthCm = Math.min(100, finalWidthCm);
  let maxHeightCm = Math.min(100, finalHeightCm);
  
  if (finalWidthCm > 100 || finalHeightCm > 100) {
    if (aspectRatio > 1) {
      // Width is larger
      maxWidthCm = 100;
      maxHeightCm = maxWidthCm / aspectRatio;
    } else {
      // Height is larger or equal
      maxHeightCm = 100;
      maxWidthCm = maxHeightCm * aspectRatio;
    }
  }

  // Round to 1 decimal place for clean display, but preserve precision
  const displayWidthCm = Math.round(maxWidthCm * 10) / 10;
  const displayHeightCm = Math.round(maxHeightCm * 10) / 10;

  console.log('🎯 EXACT ASPECT RATIO CALCULATION:');
  console.log('Original image:', { width: imageWidth, height: imageHeight });
  console.log('Aspect ratio:', aspectRatio);
  console.log('Exact cm dimensions:', { width: widthCm, height: heightCm });
  console.log('Final dimensions:', { width: maxWidthCm, height: maxHeightCm });
  console.log('Display dimensions:', { width: displayWidthCm, height: displayHeightCm });

  return {
    width: maxWidthCm,  // Keep exact precision internally
    height: maxHeightCm, // Keep exact precision internally
    unit: 'cm',
    label: `Auto (${displayWidthCm}×${displayHeightCm}cm)`
  };
}

/**
 * Calculate optimal scaling to fit image within target canvas dimensions
 */
function calculateScaling(
  imageWidth: number,
  imageHeight: number,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean = true
): { width: number; height: number; scaleRatio: number } {
  if (!maintainAspectRatio) {
    return {
      width: targetWidth,
      height: targetHeight,
      scaleRatio: Math.min(targetWidth / imageWidth, targetHeight / imageHeight)
    };
  }

  const scaleX = targetWidth / imageWidth;
  const scaleY = targetHeight / imageHeight;
  const scaleRatio = Math.min(scaleX, scaleY);

  return {
    width: imageWidth * scaleRatio,
    height: imageHeight * scaleRatio,
    scaleRatio
  };
}

/**
 * Convert pattern size to pixel dimensions with EXACT precision
 */
function patternSizeToPixels(size: PatternSize): { width: number; height: number } {
  // Base conversion: 1cm = 30px (default scaling)
  let pixelsPerUnit = 30;
  
  // Adjust pixels per unit based on pattern size for optimal canvas usage
  const area = size.width * size.height;
  if (area <= 100) { // Small patterns (≤10x10cm)
    pixelsPerUnit = 40;
  } else if (area >= 2500) { // Large patterns (≥50x50cm)
    pixelsPerUnit = 12;
  }

  // Unit conversion to cm
  let widthCm = size.width;
  let heightCm = size.height;
  
  if (size.unit === 'mm') {
    widthCm = size.width / 10;
    heightCm = size.height / 10;
  } else if (size.unit === 'inch') {
    widthCm = size.width * 2.54;
    heightCm = size.height * 2.54;
  }

  const pixelWidth = widthCm * pixelsPerUnit;
  const pixelHeight = heightCm * pixelsPerUnit;
  
  console.log('📐 EXACT PIXEL CONVERSION:');
  console.log('Pattern size:', { width: size.width, height: size.height, unit: size.unit });
  console.log('Pixels per unit:', pixelsPerUnit);
  console.log('CM dimensions:', { width: widthCm, height: heightCm });
  console.log('EXACT pixel dimensions:', { width: pixelWidth, height: pixelHeight });

  return {
    width: pixelWidth,   // NO ROUNDING - exact precision!
    height: pixelHeight  // NO ROUNDING - exact precision!
  };
}

/**
 * Debug image load and scaling calculations
 */
export function debugImageProcessing(
  imageElement: HTMLImageElement, 
  targetSize: PatternSize,
  targetPixels: { width: number; height: number },
  scaling: { width: number; height: number; scaleRatio: number }
) {
  console.log('🖼️ IMAGE PROCESSING DEBUG:');
  console.log('Original image:', { 
    width: imageElement.naturalWidth, 
    height: imageElement.naturalHeight 
  });
  console.log('Target pattern size:', targetSize);
  console.log('Target canvas pixels:', targetPixels);
  console.log('Scaling calculation:', {
    scaleRatio: scaling.scaleRatio,
    scaledWidth: scaling.width,
    scaledHeight: scaling.height
  });
  console.log('Canvas vs scaled size match:', {
    widthMatch: targetPixels.width === scaling.width,
    heightMatch: targetPixels.height === scaling.height,
    widthDiff: targetPixels.width - scaling.width,
    heightDiff: targetPixels.height - scaling.height
  });
}

/**
 * Process image file and scale it to fit pattern dimensions
 */
export async function processImageFile(
  file: File,
  options: ImageProcessorOptions
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Calculate suggested pattern size for auto-resize
        const suggestedPatternSize = calculateOptimalPatternSize(
          img.naturalWidth,
          img.naturalHeight
        );

        // Use auto-resize dimensions if enabled, otherwise use target size
        const effectiveTargetSize = options.autoResize ? suggestedPatternSize : options.targetSize;
        const targetPixels = patternSizeToPixels(effectiveTargetSize);
        
        const scaling = calculateScaling(
          img.naturalWidth,
          img.naturalHeight,
          targetPixels.width,
          targetPixels.height,
          options.maintainAspectRatio ?? true
        );

        // DEBUG: Log all calculations
        debugImageProcessing(img, effectiveTargetSize, targetPixels, scaling);
        
        // Additional debug for exact matching
        console.log('🔍 PADDING CHECK:');
        console.log('Target canvas pixels (exact):', targetPixels);
        console.log('Scaled image size:', { width: scaling.width, height: scaling.height });
        console.log('Perfect match achieved:', {
          widthMatch: Math.abs(targetPixels.width - scaling.width) < 0.01,
          heightMatch: Math.abs(targetPixels.height - scaling.height) < 0.01
        });

        // Set canvas dimensions to scaled size
        canvas.width = scaling.width;
        canvas.height = scaling.height;

        // Draw scaled image
        ctx.drawImage(img, 0, 0, scaling.width, scaling.height);

        // Convert to data URL with quality setting
        const quality = options.quality ?? 0.8;
        const dataUrl = canvas.toDataURL('image/png', quality);

        console.log('📋 PROCESSED IMAGE RESULT:');
        console.log('Canvas dimensions set to:', { width: canvas.width, height: canvas.height });
        console.log('Data URL length:', dataUrl.length);

        resolve({
          dataUrl,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
          scaledWidth: scaling.width,
          scaledHeight: scaling.height,
          scaleRatio: scaling.scaleRatio,
          suggestedPatternSize // Include suggested size in result
        });

        // Clean up
        URL.revokeObjectURL(img.src);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Load image from file
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Validate image file before processing
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image (PNG, JPG, SVG)' };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' };
  }

  // Check for supported formats
  const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
  if (!supportedTypes.includes(file.type)) {
    return { isValid: false, error: 'Unsupported image format. Use PNG, JPG, or SVG' };
  }

  return { isValid: true };
}

/**
 * Get optimal canvas position for centered image placement
 */
export function getCenteredPosition(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number
): { x: number; y: number } {
  const position = {
    x: (canvasWidth - imageWidth) / 2,
    y: (canvasHeight - imageHeight) / 2
  };
  
  console.log('📍 IMAGE POSITIONING DEBUG:');
  console.log('Canvas size:', { width: canvasWidth, height: canvasHeight });
  console.log('Image size:', { width: imageWidth, height: imageHeight });
  console.log('Calculated position:', position);
  console.log('Final image bounds:', {
    left: position.x,
    top: position.y,
    right: position.x + imageWidth,
    bottom: position.y + imageHeight
  });
  
  return position;
}
