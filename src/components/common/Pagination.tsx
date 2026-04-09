import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading = false
}) => {
  if (loading || totalPages <= 1) return null;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      gap: '20px', 
      marginTop: '30px', 
      padding: '20px 0', 
      borderTop: '1px solid #f0f0f0' 
    }}>
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ 
          background: 'none', 
          border: '1px solid #d9d9d9', 
          borderRadius: '8px', 
          padding: '8px', 
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer', 
          opacity: currentPage === 1 ? 0.5 : 1 
        }}
        title="Trang trước"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
        Trang <span style={{ color: '#1890ff' }}>{currentPage}</span> / {totalPages}
      </div>

      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        style={{ 
          background: 'none', 
          border: '1px solid #d9d9d9', 
          borderRadius: '8px', 
          padding: '8px', 
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', 
          opacity: currentPage === totalPages ? 0.5 : 1 
        }}
        title="Trang sau"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
