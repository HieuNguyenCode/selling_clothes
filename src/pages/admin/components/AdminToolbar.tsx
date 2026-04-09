import React from 'react';
import { Search } from 'lucide-react';

interface AdminToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  searchPlaceholder?: string;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  loading?: boolean;
}

const AdminToolbar: React.FC<AdminToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Tìm kiếm...",
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 25, 50],
  loading = false
}) => {
  return (
    <div style={{ marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <form onSubmit={onSearchSubmit} style={{ flex: 1, display: 'flex', gap: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 45px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)', 
              background: 'var(--bg-primary)', 
              color: 'var(--text-primary)',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0 30px', borderRadius: 'var(--radius-md)' }}>
          Tìm kiếm
        </button>
      </form>

      <div style={{ width: '1px', height: '30px', background: 'var(--border)' }}></div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
        <span style={{ color: '#8c8c8c' }}>Hiển thị:</span>
        <select 
          value={pageSize} 
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          style={{ 
            padding: '10px 15px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border)', 
            background: 'var(--bg-primary)',
            cursor: 'pointer',
            fontWeight: 600,
            minWidth: '120px'
          }}
        >
          {pageSizeOptions.map(option => (
            <option key={option} value={option}>{option} bản ghi</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AdminToolbar;
