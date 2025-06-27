import Konva from 'konva';
import type { ProcessedImage } from './imageProcessor';
import { getCenteredPosition } from './imageProcessor';

export interface ImageLayerConfig {
  id: string;
  name: string;
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  visible: boolean;
}

/**
 * Load processed image into Konva.js canvas as a new layer
 */
export async function loadImageToCanvas(
  stage: Konva.Stage,
  processedImage: ProcessedImage,
  layerId: string = `image_layer_${Date.now()}`
): Promise<{ layer: Konva.Layer; imageNode: Konva.Image; config: ImageLayerConfig }> {
  return new Promise((resolve, reject) => {
    const imageObj = new Image();
    
    imageObj.onload = () => {
      try {
        // Create new layer for the image
        const layer = new Konva.Layer({
          id: layerId,
          name: 'Image Layer'
        });

        // Calculate centered position
        const stageWidth = stage.width();
        const stageHeight = stage.height();
        const position = getCenteredPosition(
          stageWidth,
          stageHeight,
          processedImage.scaledWidth,
          processedImage.scaledHeight
        );

        // Create Konva Image node
        const imageNode = new Konva.Image({
          id: `${layerId}_image`,
          image: imageObj,
          x: position.x,
          y: position.y,
          width: processedImage.scaledWidth,
          height: processedImage.scaledHeight,
          opacity: 0.8, // Slightly transparent so drawing shows on top
          draggable: false // Image stays in place as background
        });

        // Add image to layer
        layer.add(imageNode);
        
        // Add layer to stage (insert at index 0 to make it background)
        stage.add(layer);
        layer.moveToBottom();
        stage.batchDraw();

        // Create configuration object
        const config: ImageLayerConfig = {
          id: layerId,
          name: 'Imported Pattern',
          dataUrl: processedImage.dataUrl,
          x: position.x,
          y: position.y,
          width: processedImage.scaledWidth,
          height: processedImage.scaledHeight,
          opacity: 0.8,
          visible: true
        };

        resolve({ layer, imageNode, config });
      } catch (error) {
        reject(error);
      }
    };

    imageObj.onerror = () => {
      reject(new Error('Failed to load processed image'));
    };

    imageObj.src = processedImage.dataUrl;
  });
}

/**
 * Update existing image layer properties
 */
export function updateImageLayer(
  layer: Konva.Layer,
  updates: Partial<ImageLayerConfig>
): void {
  const imageNode = layer.findOne('Image') as Konva.Image;
  
  if (!imageNode) {
    throw new Error('Image node not found in layer');
  }

  // Apply updates
  if (updates.x !== undefined) imageNode.x(updates.x);
  if (updates.y !== undefined) imageNode.y(updates.y);
  if (updates.width !== undefined) imageNode.width(updates.width);
  if (updates.height !== undefined) imageNode.height(updates.height);
  if (updates.opacity !== undefined) imageNode.opacity(updates.opacity);
  if (updates.visible !== undefined) imageNode.visible(updates.visible);

  // Update layer properties
  if (updates.name !== undefined) layer.name(updates.name);

  layer.batchDraw();
}

/**
 * Remove image layer from stage
 */
export function removeImageLayer(stage: Konva.Stage, layerId: string): boolean {
  const layer = stage.findOne(`#${layerId}`) as Konva.Layer;
  
  if (layer) {
    layer.destroy();
    stage.batchDraw();
    return true;
  }
  
  return false;
}

/**
 * Get all image layers from stage
 */
export function getImageLayers(stage: Konva.Stage): Konva.Layer[] {
  return stage.getLayers().filter(layer => 
    layer.id() && layer.id().startsWith('image_layer_')
  );
}

/**
 * Toggle image layer visibility
 */
export function toggleImageLayerVisibility(stage: Konva.Stage, layerId: string): boolean {
  const layer = stage.findOne(`#${layerId}`) as Konva.Layer;
  
  if (layer) {
    const currentVisibility = layer.visible();
    layer.visible(!currentVisibility);
    stage.batchDraw();
    return !currentVisibility;
  }
  
  return false;
}
