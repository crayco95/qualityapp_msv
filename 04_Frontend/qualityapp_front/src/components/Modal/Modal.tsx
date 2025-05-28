import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-xs',     // 320px
    md: 'max-w-sm',     // 384px - Compacto para formularios
    lg: 'max-w-md',     // 448px
    xl: 'max-w-lg'      // 512px
  };

  return (
    <div className="modal-overlay">
      {/* Backdrop with blur */}
      <div
        className="modal-backdrop"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="modal-container">
        <div
          className={`modal-content ${sizeClasses[size]}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <h3 className="modal-title">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
