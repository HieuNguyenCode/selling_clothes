import React from 'react';
import { RotateCw, LucideIcon } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  onRefresh: () => void;
  refreshLoading?: boolean;
  actionButton?: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  };
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconColor = "#1890ff",
  onRefresh,
  refreshLoading = false,
  actionButton
}) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      <div>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem' }}>
          <Icon size={28} color={iconColor} /> {title}
        </h2>
        {subtitle && (
          <p style={{ margin: '5px 0 0 40px', color: '#8c8c8c', fontSize: '0.9rem' }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          onClick={onRefresh} 
          className="btn btn-secondary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          disabled={refreshLoading}
          title="Tải lại"
        >
          <RotateCw size={18} className={refreshLoading ? 'animate-spin' : ''} />
        </button>
        {actionButton && (
          <button 
            onClick={actionButton.onClick} 
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <actionButton.icon size={18} /> {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminHeader;
