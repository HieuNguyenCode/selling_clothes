import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, ProductList } from '../../../services/productService';
import { Search, RotateCw, Package, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import Table, { Column } from '../../../components/common/Table';

const Products = () => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const loadProducts = async (search = '') => {
    setLoading(true);
    try {
      const data = await productService.fetchProducts(search);
      setProducts(data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Xóa sản phẩm này?')) {
      try {
        await productService.removeProduct(id);
        loadProducts(searchTerm);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const columns: Column<ProductList>[] = [
    {
      title: 'Ảnh',
      key: 'image',
      width: '100px',
      render: (record) => (
        <img 
          src={record.image.startsWith('http') ? record.image : `${import.meta.env.VITE_API_URL}${record.image}`} 
          alt={record.name} 
          style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} 
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
        <div>
          <span style={{ fontWeight: 700, color: '#1890ff' }}>{record.price.toLocaleString('vi-VN')} đ</span>
          {record.priceSale && <div style={{ fontSize: '0.7rem', color: '#ff4d4f', textDecoration: 'line-through' }}>{record.priceSale.toLocaleString('vi-VN')} đ</div>}
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '180px',
      align: 'right',
      render: (record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button 
            onClick={() => navigate(`/admin/products/${record.id}`)}
            className="icon-btn" 
            style={{ color: '#52c41a', background: '#f6ffed', padding: '6px', borderRadius: '4px' }}
            title="Chi tiết"
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => navigate(`/admin/edit/${record.id}`)}
            className="icon-btn" 
            style={{ color: '#1890ff', background: '#e6f7ff', padding: '6px', borderRadius: '4px' }}
            title="Chỉnh sửa"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => handleDelete(record.id)}
            className="icon-btn" 
            style={{ color: '#ff4d4f', background: '#fff1f0', padding: '6px', borderRadius: '4px' }}
            title="Xóa"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Package color="#1890ff" /> Quản lý Sản phẩm
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => loadProducts(searchTerm)} className="btn btn-secondary" disabled={loading}>
            <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => navigate('/admin/add')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> Thêm Mới
          </button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); loadProducts(searchTerm); }} style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          <input 
            type="text" placeholder="Tìm tên sản phẩm..." 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" className="btn btn-primary">Tìm</button>
      </form>

      <Table columns={columns} dataSource={products} loading={loading} rowKey="id" />
    </div>
  );
};

export default Products;
