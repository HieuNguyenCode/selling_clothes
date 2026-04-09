import React, { InputHTMLAttributes } from 'react';

interface AdminFormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  containerStyle?: React.CSSProperties;
}

const AdminFormInput: React.FC<AdminFormInputProps> = ({
  label,
  error,
  required = false,
  containerStyle,
  style,
  ...props
}) => {
  return (
    <div className="form-group" style={{ marginBottom: '24px', ...containerStyle }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          fontWeight: 600, 
          fontSize: '0.95rem',
          color: 'var(--text-primary)'
        }}>
          {label} {required && <span style={{ color: '#ff4d4f' }}>*</span>}
        </label>
      )}
      <input 
        {...props}
        style={{ 
          width: '100%', 
          padding: '12px 14px', 
          borderRadius: 'var(--radius-md)', 
          border: error ? '1px solid #ff4d4f' : '1px solid #d9d9d9', 
          boxSizing: 'border-box', 
          fontSize: '1rem',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          ...style
        }}
        onFocus={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = '#1890ff';
            e.currentTarget.style.boxShadow = '0 0 0 2px rgba(24,144,255,0.2)';
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = '#d9d9d9';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      />
      {error && (
        <p style={{ margin: '5px 0 0', color: '#ff4d4f', fontSize: '0.85rem' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default AdminFormInput;
