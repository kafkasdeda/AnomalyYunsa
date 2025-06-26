import React from 'react';
import type { ToolType } from '../../types/pattern';

interface ToolPaletteProps {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  brushColor: string;
  onBrushColorChange: (color: string) => void;
  brushOpacity: number;
  onBrushOpacityChange: (opacity: number) => void;
}

const ToolPalette: React.FC<ToolPaletteProps> = ({
  activeTool,
  onToolChange,
  brushSize,
  onBrushSizeChange,
  brushColor,
  onBrushColorChange,
  brushOpacity,
  onBrushOpacityChange,
}) => {
  const tools: Array<{ id: ToolType; label: string; icon: string }> = [
    { id: 'brush', label: 'Brush', icon: '🖌️' },
    { id: 'rectangle', label: 'Rectangle', icon: '▭' },
    { id: 'circle', label: 'Circle', icon: '○' },
    { id: 'line', label: 'Line', icon: '📏' },
    { id: 'eraser', label: 'Eraser', icon: '🧽' },
  ];

  return (
    <div 
      style={{
        padding: '16px',
        background: '#f5f5f5',
        borderRadius: '8px',
        width: '250px',
        maxHeight: '600px',
        overflowY: 'auto'
      }}
    >
      {/* Tool Selection */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          margin: '0 0 12px 0',
          fontSize: '14px',
          fontWeight: 600,
          color: '#333'
        }}>Tools</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px'
        }}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 8px',
                border: `2px solid ${activeTool === tool.id ? '#007bff' : '#ddd'}`,
                borderRadius: '6px',
                background: activeTool === tool.id ? '#e3f2fd' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: activeTool === tool.id ? '0 2px 4px rgba(0, 123, 255, 0.2)' : 'none'
              }}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
            >
              <span style={{ fontSize: '24px', marginBottom: '4px' }}>{tool.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#666' }}>{tool.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brush Settings - Show for brush and eraser */}
      {(activeTool === 'brush' || activeTool === 'eraser') && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#333'
          }}>Brush Settings</h3>
          
          {/* Brush Size */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#555'
            }}>Size: {brushSize}px</label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => onBrushSizeChange(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#ddd',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Brush Color - Only for brush, not eraser */}
          {activeTool === 'brush' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#555'
              }}>Color:</label>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => onBrushColorChange(e.target.value)}
                style={{
                  width: '60px',
                  height: '40px',
                  border: '2px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            </div>
          )}

          {/* Brush Opacity */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#555'
            }}>Opacity: {Math.round(brushOpacity * 100)}%</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={brushOpacity}
              onChange={(e) => onBrushOpacityChange(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#ddd',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
      )}

      {/* Shape Settings - Show for rectangle and circle */}
      {(activeTool === 'rectangle' || activeTool === 'circle') && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#333'
          }}>Shape Settings</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#555'
            }}>Fill Color:</label>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => onBrushColorChange(e.target.value)}
              style={{
                width: '60px',
                height: '40px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: 0
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#555'
            }}>Opacity: {Math.round(brushOpacity * 100)}%</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={brushOpacity}
              onChange={(e) => onBrushOpacityChange(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#ddd',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
      )}

      {/* Line Settings */}
      {activeTool === 'line' && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: '#333'
          }}>Line Settings</h3>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#555'
            }}>Width: {brushSize}px</label>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => onBrushSizeChange(Number(e.target.value))}
              style={{
                width: '100%',
                height: '6px',
                borderRadius: '3px',
                background: '#ddd',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#555'
            }}>Color:</label>
            <input
              type="color"
              value={brushColor}
              onChange={(e) => onBrushColorChange(e.target.value)}
              style={{
                width: '60px',
                height: '40px',
                border: '2px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                padding: 0
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPalette;