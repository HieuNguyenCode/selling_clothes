import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

type AdminButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon';

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AdminButtonVariant;
  icon?: LucideIcon;
  loading?: boolean;
  loadingIcon?: LucideIcon;
  children?: ReactNode;
}

const AdminButton: React.FC<AdminButtonProps> = ({
  variant = 'primary',
  icon: Icon,
  loading = false,
  loadingIcon: LoadingIcon,
  children,
  style,
  className = '',
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 20px',
      borderRadius: 'var(--radius-md)',
      fontWeight: 600,
      cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      border: 'none',
      fontSize: '0.95rem',
      opacity: props.disabled || loading ? 0.6 : 1,
      ...style
    };

    switch (variant) {
      case 'primary':
        return { ...base, backgroundColor: '#1890ff', color: 'white' };
      case 'secondary':
        return { ...base, backgroundColor: '#f0f2f5', color: 'var(--text-primary)', border: '1px solid #d9d9d9' };
      case 'danger':
        return { ...base, backgroundColor: '#ff4d4f', color: 'white' };
      case 'ghost':
        return { ...base, backgroundColor: 'transparent', color: '#1890ff', border: '1px solid #1890ff' };
      case 'icon':
        return { 
          ...base, 
          padding: '8px', 
          backgroundColor: 'transparent', 
          borderRadius: '8px' 
        };
      default:
        return base;
    }
  };

  return (
    <button 
      {...props} 
      style={getStyles()}
      className={`btn-${variant} ${className}`}
    >
      {loading && LoadingIcon ? (
        <LoadingIcon size={18} className="animate-spin" />
      ) : (
        Icon && <Icon size={18} />
      )}
      {children}
    </button>
  );
};

export default AdminButton;
