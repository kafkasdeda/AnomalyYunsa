// 📝 Simple Auto-Resize Debug Component
// Test if the issue is with complex reprocessing or basic canvas resize

import React from 'react';

export const AutoResizeDebugger: React.FC<{
  suggestedSize: any;
  onResize: (size: any) => void;
  onClose: () => void;
}> = ({ suggestedSize, onResize, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#fff',
      border: '2px solid #007bff',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1002,
      minWidth: '250px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#007bff' }}>
        🔧 Auto-Resize Debug
      </h4>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
        Suggested: <strong>{suggestedSize.width}×{suggestedSize.height}{suggestedSize.unit}</strong>
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          onClick={() => {
            console.log('🎯 Direct resize test:', suggestedSize);
            onResize(suggestedSize);
            onClose();
          }}
          style={{
            padding: '6px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Direct Resize
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
