import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { comboService, ComboList } from '../../../services/comboService';
import { Search, RotateCw, Layers, Plus, Eye, Edit, Trash2, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import Table, { Column } from '../../../components/common/Table';
import { useToast } from '../../../context/ToastContext';

const Combos = () => {
  const [combos, setCombos] = useState<ComboList[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const loadCombos = useCallback(async (search = '', page = 1, size = 10) => {
    setLoading(true);
    try {
      const result = await comboService.fetchCombos(search, page, size);
      if (result && result.data) {
        setCombos(result.data);
        setTotalCount(result.totalCount || result.data.length);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.pageNumber || 1);
      } else {
        setCombos([]);
        setTotalCount(0);
      }
    } catch (error: any) {
      showToast(error.message, "error");
      setCombos([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCombos(searchTerm, currentPage, pageSize);
  }, [currentPage, pageSize, loadCombos]);

  const handleTogglePublish = async (id: string) => {
    try {
      await comboService.changePublishStatus(id);
      showToast("Cập nhật trạng thái combo thành công!");
      loadCombos(searchTerm, currentPage, pageSize);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Xóa combo này?')) {
      try {
        await comboService.removeCombo(id);
        showToast("Đã xóa combo!");
        loadCombos(searchTerm, currentPage, pageSize);
      } catch (error: any) {
        showToast(error.message, "error");
      }
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.includes(':5267')) return path.split(':5267')[1];
    return path.startsWith('/') ? path : `/${path}`;
  };

  const columns: Column<ComboList>[] = [
    {
      title: 'Ảnh',
      key: 'image',
      width: '100px',
      render: (record) => (
        <img 
          src={getImageUrl(record.image)} 
          alt={record.name} 
          style={{ width: '55px', height: '55px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }} 
        />
      )
    },
    {
      title: 'Tên Combo',
      key: 'name',
      render: (record) => <span style={{ fontWeight: 600, fontSize: '1rem' }}>{record.name}</span>
    },
    {
      title: 'Giá Combo',
      key: 'price',
      render: (record) => (
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{record.price.toLocaleString('vi-VN')} đ</span>
      )
    },
    {
      title: 'Trạng thái',
      key: 'isPublished',
      width: '130px',
      align: 'center',
      render: (record) => (
        <button 
          onClick={() => handleTogglePublish(record.id)}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            color: record.isPublished ? '#52c41a' : '#bfbfbf',
            fontWeight: 600, fontSize: '0.8rem'
          }}
        >
          {record.isPublished ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          {record.isPublished ? "Đang chạy" : "Tạm ẩn"}
        </button>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '180px',
      align: 'right',
      render: (record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={() => navigate(`/admin/combo/${record.id}`)} className="icon-btn" style={{ color: '#52c41a', background: '#f6ffed', padding: '8px', borderRadius: '8px' }} title="Xem chi tiết"><Eye size={18} /></button>
          <button onClick={() => navigate(`/admin/combo/edit/${record.id}`)} className="icon-btn" style={{ color: '#1890ff', background: '#e6f7ff', padding: '8px', borderRadius: '8px' }} title="Sửa"><Edit size={18} /></button>
          <button onClick={() => handleDelete(record.id)} className="icon-btn" style={{ color: '#ff4d4f', background: '#fff1f0', padding: '8px', borderRadius: '8px' }} title="Xóa"><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem' }}>
            <Layers size={28} color="#1890ff" /> Quản lý Combo Khuyến mãi
          </h2>
          <p style={{ margin: '5px 0 0 40px', color: '#8c8c8c', fontSize: '0.9rem' }}>
            Tìm thấy <strong>{totalCount}</strong> gói combo
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => loadCombos(searchTerm, currentPage, pageSize)} className="btn btn-secondary" disabled={loading}>
            <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => navigate('/admin/combo/add')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
            <Plus size={18} /> Tạo Combo mới
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <form onSubmit={(e) => { e.preventDefault(); setCurrentPage(1); loadCombos(searchTerm, 1, pageSize); }} style={{ flex: 1, display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            <input 
              type="text" placeholder="Tìm tên gói combo..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px 12px 12px 45px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0 30px', borderRadius: 'var(--radius-md)' }}>Tìm kiếm</button>
        </form>

        <div style={{ width: '1px', height: '30px', background: 'var(--border)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#8c8c8c' }}>Hiển thị:</span>
          <select 
            value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            style={{ padding: '10px 15px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-primary)', cursor: 'pointer', fontWeight: 600, minWidth: '120px' }}
          >
            <option value={5}>5 combo</option>
            <option value={10}>10 combo</option>
            <option value={25}>25 combo</option>
          </select>
        </div>
      </div>

      <Table columns={columns} dataSource={combos} loading={loading} rowKey="id" />

      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px', padding: '20px 0', borderTop: '1px solid #f0f0f0' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} style={{ background: 'none', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}><ChevronLeft size={20} /></button>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Trang <span style={{ color: '#1890ff' }}>{currentPage}</span> / {totalPages}</div>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} style={{ background: 'none', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}><ChevronRight size={20} /></button>
        </div>
      )}
    </div>
  );
};

export default Combos;
