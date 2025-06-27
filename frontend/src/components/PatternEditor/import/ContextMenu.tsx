import React from 'react';

interface ContextMenuProps {
  isVisible: boolean;
  position: { x: number; y: number };
  onImportPattern: () => void;
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isVisible,
  position,
  onImportPattern,
  onClose,
}) => {
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (isVisible) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        minWidth: '150px',
        overflow: 'hidden'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#333',
          borderBottom: '1px solid #eee',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
        onClick={() => {
          onImportPattern();
          onClose();
        }}
      >
        📁 Import Pattern
      </div>
      
      <div
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#666',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
        onClick={onClose}
      >
        ❌ Cancel
      </div>
    </div>
  );
};
