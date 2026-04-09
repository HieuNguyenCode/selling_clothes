import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { comboService, ComboList } from '../../../services/comboService';
import { Layers, Plus, Eye, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import Table, { Column } from '../../../components/common/Table';
import AdminHeader from '../components/AdminHeader';
import AdminToolbar from '../components/AdminToolbar';
import Pagination from '../../../components/common/Pagination';
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadCombos(searchTerm, 1, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

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
      <AdminHeader 
        title="Quản lý Combo Khuyến mãi"
        subtitle={`Tìm thấy ${totalCount} gói combo`}
        icon={Layers}
        onRefresh={() => loadCombos(searchTerm, currentPage, pageSize)}
        refreshLoading={loading}
        actionButton={{
          label: "Tạo Combo mới",
          icon: Plus,
          onClick: () => navigate('/admin/combo/add')
        }}
      />

      <AdminToolbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Tìm tên gói combo..."
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[5, 10, 25]}
        loading={loading}
      />

      <Table columns={columns} dataSource={combos} loading={loading} rowKey="id" />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />
    </div>
  );
};

export default Combos;
