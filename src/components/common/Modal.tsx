import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '480px'
}) => {
  if (!isOpen) return null;

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.6)', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', 
      zIndex: 2000, 
      backdropFilter: 'blur(4px)',
      overflowY: 'auto',
      padding: '40px 20px'
    }}>
      <div style={{ 
        background: 'var(--bg-primary, white)', 
        padding: '40px', 
        borderRadius: 'var(--radius-lg)', 
        width: '100%', 
        maxWidth: maxWidth, 
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        margin: 'auto',
        color: 'var(--text-primary, #1a1a1a)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{title}</h3>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c8c8c' }}
            title="Đóng"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
