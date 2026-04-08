import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Chọn một tùy chọn...",
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Lọc options dựa trên từ khóa tìm kiếm
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lấy label của giá trị đang chọn
  const selectedLabel = options.find(opt => opt.value === value)?.label || '';

  // Đóng dropdown khi nhấn ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="form-group" ref={containerRef} style={{ position: 'relative', width: '100%', boxSizing: 'border-box', marginBottom: 0 }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.2' }}>
          {label} {required && <span style={{ color: '#ff4d4f' }}>*</span>}
        </label>
      )}
      
      {/* Ô chọn chính */}
      <div 
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(''); }}
        style={{
          width: '100%',
          padding: '12px 15px',
          height: '45px', /* Cố định chiều cao để khớp với input */
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)',
          background: 'var(--bg-primary)',
          color: value ? 'var(--text-primary)' : '#8c8c8c',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.95rem',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '10px' }}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown size={18} style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>

      {/* Menu sổ xuống */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          marginTop: '5px',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Ô nhập tìm kiếm bên trong dropdown */}
          <div style={{ padding: '10px', borderBottom: '1px solid var(--border)', position: 'relative', background: 'var(--bg-secondary)', boxSizing: 'border-box' }}>
            <Search size={16} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            <input 
              type="text"
              autoFocus
              placeholder="Gõ để tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '8px 10px 8px 35px',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Danh sách kết quả */}
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div 
                  key={opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '10px 15px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    background: value === opt.value ? 'var(--bg-accent)' : 'transparent',
                    color: value === opt.value ? '#1890ff' : 'var(--text-primary)',
                    transition: 'background 0.2s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = value === opt.value ? 'var(--bg-accent)' : 'transparent'}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#8c8c8c', fontSize: '0.85rem' }}>
                Không tìm thấy kết quả nào
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SearchableSelect;
