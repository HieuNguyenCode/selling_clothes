import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: number;
  className?: string;
}

const Loading = ({ size = 24, className = "" }: LoadingProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <Loader2 
        size={size} 
        className={`animate-spin ${className}`} 
        style={{ color: '#1890ff' }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
