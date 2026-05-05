import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, ProductList } from '../../../services/productService';
import { Package, Plus, Eye, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import Table, { Column } from '../../../components/common/Table';
import AdminHeader from '../components/AdminHeader';
import AdminToolbar from '../components/AdminToolbar';
import Pagination from '../../../components/common/Pagination';
import { useToast } from '../../../context/ToastContext';
import { getImageUrl } from '../../../utils/urlUtils';

const Products = () => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const loadProducts = useCallback(async (search = '', page = 1, size = 10) => {
    setLoading(true);
    try {
      const result = await productService.fetchProducts(search, page, size);
      if (result && result.data) {
        setProducts(result.data);
        setTotalCount(result.totalCount || 0);
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.pageNumber || 1);
      } else {
        setProducts([]);
        setTotalCount(0);
      }
    } catch (error: any) {
      showToast(error.message, "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadProducts(searchTerm, currentPage, pageSize);
  }, [currentPage, pageSize, loadProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts(searchTerm, 1, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await productService.changePublishStatus(id);
      showToast("Cập nhật trạng thái hiển thị thành công!");
      loadProducts(searchTerm, currentPage, pageSize);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Xóa sản phẩm này?')) {
      try {
        await productService.removeProduct(id);
        showToast("Đã xóa sản phẩm thành công!");
        loadProducts(searchTerm, currentPage, pageSize);
      } catch (error: any) {
        showToast(error.message, "error");
      }
    }
  };

  const columns: Column<ProductList>[] = [
    {
      title: 'Ảnh',
      key: 'image',
      width: '80px',
      render: (record) => (
        <img 
          src={getImageUrl(record.image)} 
          alt={record.name} 
          style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border)' }} 
        />
      )
    },
    {
      title: 'Tên Sản phẩm',
      key: 'name',
      render: (record) => <span style={{ fontWeight: 600 }}>{record.name}</span>
    },
    {
      title: 'Giá',
      key: 'price',
      render: (record) => (
        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{record.price.toLocaleString('vi-VN')} đ</span>
      )
    },
    {
      title: 'Hiển thị',
      key: 'isPublished',
      width: '120px',
      align: 'center',
      render: (record) => (
        <button 
          onClick={() => handleTogglePublish(record.id)}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: record.isPublished ? '#52c41a' : '#bfbfbf',
            fontWeight: 600,
            fontSize: '0.8rem'
          }}
        >
          {record.isPublished ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          {record.isPublished ? "Đang hiện" : "Đang ẩn"}
        </button>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '180px',
      align: 'right',
      render: (record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={() => navigate(`/admin/products/${record.id}`)} className="icon-btn" style={{ color: '#52c41a', background: '#f6ffed', padding: '8px', borderRadius: '8px' }} title="Xem chi tiết"><Eye size={18} /></button>
          <button onClick={() => navigate(`/admin/edit/${record.id}`)} className="icon-btn" style={{ color: '#1890ff', background: '#e6f7ff', padding: '8px', borderRadius: '8px' }} title="Sửa"><Edit size={18} /></button>
          <button onClick={() => handleDelete(record.id)} className="icon-btn" style={{ color: '#ff4d4f', background: '#fff1f0', padding: '8px', borderRadius: '8px' }} title="Xóa"><Trash2 size={18} /></button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-card">
      <AdminHeader 
        title="Quản lý Sản phẩm"
        subtitle={`Tổng số: ${totalCount} sản phẩm`}
        icon={Package}
        onRefresh={() => loadProducts(searchTerm, currentPage, pageSize)}
        refreshLoading={loading}
        actionButton={{
          label: "Thêm Mới",
          icon: Plus,
          onClick: () => navigate('/admin/add')
        }}
      />

      <AdminToolbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Tìm tên sản phẩm..."
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />

      <Table columns={columns} dataSource={products} loading={loading} rowKey="id" />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />
    </div>
  );
};

export default Products;
