import React from 'react';
import type { PatternSize } from '../../types/pattern';

interface PatternSizeSelectorProps {
  currentSize: PatternSize;
  onSizeChange: (size: PatternSize) => void;
  onCreateNew: () => void;
}

const PRESET_SIZES: PatternSize[] = [
  { width: 10, height: 10, unit: 'cm', label: 'Small (10×10cm)' },
  { width: 20, height: 20, unit: 'cm', label: 'Medium (20×20cm)' },
  { width: 30, height: 15, unit: 'cm', label: 'Rectangular (30×15cm)' },
  { width: 50, height: 50, unit: 'cm', label: 'Large (50×50cm)' },
];

const UNITS = ['cm', 'mm', 'inch'] as const;

export const PatternSizeSelector: React.FC<PatternSizeSelectorProps> = ({
  currentSize,
  onSizeChange,
  onCreateNew,
}) => {
  const [showCustom, setShowCustom] = React.useState(false);
  const [customWidth, setCustomWidth] = React.useState(currentSize.width);
  const [customHeight, setCustomHeight] = React.useState(currentSize.height);
  const [customUnit, setCustomUnit] = React.useState(currentSize.unit);

  const handlePresetSelect = (size: PatternSize) => {
    setShowCustom(false);
    onSizeChange(size);
  };

  const handleCustomApply = () => {
    const newSize: PatternSize = {
      width: customWidth,
      height: customHeight,
      unit: customUnit,
      label: `Custom (${customWidth}×${customHeight}${customUnit})`,
    };
    onSizeChange(newSize);
    setShowCustom(false);
  };

  const isCurrentSize = (size: PatternSize) => {
    return (
      currentSize.width === size.width &&
      currentSize.height === size.height &&
      currentSize.unit === size.unit
    );
  };

  return (
    <div style={{
      padding: '12px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '16px',
      border: '1px solid #e9ecef'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{
          margin: '0',
          fontSize: '16px',
          fontWeight: '600',
          color: '#343a40'
        }}>
          Pattern Size
        </h3>
        <button
          onClick={onCreateNew}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Create New Pattern
        </button>
      </div>

      {/* Current Size Display */}
      <div style={{
        marginBottom: '12px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        Current: <strong>{currentSize.width}×{currentSize.height}{currentSize.unit}</strong>
        {currentSize.label && (
          <span style={{ marginLeft: '8px', fontStyle: 'italic' }}>
            ({currentSize.label})
          </span>
        )}
      </div>

      {/* Preset Size Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '12px'
      }}>
        {PRESET_SIZES.map((size, index) => (
          <button
            key={index}
            onClick={() => handlePresetSelect(size)}
            style={{
              padding: '8px 12px',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              backgroundColor: isCurrentSize(size) ? '#007bff' : 'white',
              color: isCurrentSize(size) ? 'white' : '#495057',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: isCurrentSize(size) ? '600' : '400',
              transition: 'all 0.2s ease'
            }}
          >
            {size.label}
          </button>
        ))}
        
        {/* Custom Size Button */}
        <button
          onClick={() => setShowCustom(!showCustom)}
          style={{
            padding: '8px 12px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            backgroundColor: showCustom ? '#6c757d' : 'white',
            color: showCustom ? 'white' : '#495057',
            fontSize: '12px',
            cursor: 'pointer',
            fontWeight: showCustom ? '600' : '400'
          }}
        >
          Custom...
        </button>
      </div>

      {/* Custom Size Panel */}
      {showCustom && (
        <div style={{
          padding: '12px',
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          marginTop: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#6c757d' }}>Width:</label>
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                min="1"
                max="200"
                style={{
                  width: '60px',
                  padding: '4px 6px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#6c757d' }}>Height:</label>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                min="1"
                max="200"
                style={{
                  width: '60px',
                  padding: '4px 6px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label style={{ fontSize: '12px', color: '#6c757d' }}>Unit:</label>
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value as 'cm' | 'mm' | 'inch')}
                style={{
                  padding: '4px 6px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCustomApply}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Apply Custom Size
            </button>
            <button
              onClick={() => setShowCustom(false)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
