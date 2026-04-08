import React, { useState, useEffect } from 'react';
import { brandService, Brand } from '../../../services/brandService';
import { Search, RotateCw, Building2, Plus, Edit, Trash2, X, Check } from 'lucide-react';
import Table, { Column } from '../../../components/common/Table';

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const loadBrands = async (search = '') => {
    setLoading(true);
    try {
      const data = await brandService.fetchBrands(search);
      setBrands(data);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadBrands(searchTerm);
  };

  const openModal = (brand: Brand | null = null) => {
    setCurrentBrand(brand);
    setBrandName(brand ? brand.name : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBrand(null);
    setBrandName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;

    setModalLoading(true);
    try {
      if (currentBrand) {
        await brandService.updateBrand(currentBrand.id, brandName);
      } else {
        await brandService.addBrand(brandName);
      }
      loadBrands(searchTerm);
      closeModal();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hãng này?')) {
      try {
        await brandService.deleteBrand(id);
        loadBrands(searchTerm);
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  // Định nghĩa các cột cho Table (Ẩn ID)
  const columns: Column<Brand>[] = [
    {
      title: 'STT',
      key: 'index',
      width: '80px',
      render: (_, index) => index + 1
    },
    {
      title: 'Tên Hãng',
      key: 'name',
      render: (record) => <span style={{ fontWeight: 600 }}>{record.name}</span>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '150px',
      align: 'right',
      render: (record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button 
            onClick={() => openModal(record)}
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
          <Building2 color="#1890ff" /> Quản lý Hãng
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => loadBrands(searchTerm)} 
            className="btn btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            disabled={loading}
          >
            <RotateCw size={16} className={loading ? 'animate-spin' : ''} /> Làm mới
          </button>
          <button 
            onClick={() => openModal()} 
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={16} /> Thêm Hãng
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '24px', display: 'flex', gap: '10px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hãng..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 10px 10px 40px', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border)', 
              background: 'var(--bg-primary)', 
              color: 'var(--text-primary)',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>Tìm kiếm</button>
      </form>

      {/* Sử dụng Component Table dùng chung */}
      <Table 
        columns={columns} 
        dataSource={brands} 
        loading={loading}
        rowKey="id"
      />

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 2000
        }}>
          <div style={{
            background: 'white', padding: '32px', borderRadius: 'var(--radius-md)',
            width: '100%', maxWidth: '450px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>{currentBrand ? 'Cập nhật Hãng' : 'Thêm Hãng mới'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Tên Hãng</label>
                <input 
                  type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Nhập tên hãng/thương hiệu..." autoFocus required
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid #d9d9d9', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary">Hủy</button>
                <button 
                  type="submit" className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  disabled={modalLoading}
                >
                  {modalLoading ? <RotateCw size={16} className="animate-spin" /> : <Check size={16} />}
                  {currentBrand ? 'Cập nhật' : 'Xác nhận'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
