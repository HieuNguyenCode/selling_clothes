import React, { useState, useEffect, useCallback } from 'react';
import { brandService, Brand } from '../../../services/brandService';
import { Search, RotateCw, Building2, Plus, Edit, Trash2, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Table, { Column } from '../../../components/common/Table';
import { useToast } from '../../../context/ToastContext';

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10); // State cho kích thước trang

  const { showToast } = useToast();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const loadBrands = useCallback(async (search = '', page = 1, size = 10) => {
    setLoading(true);
    try {
      const result = await brandService.fetchBrands(search, page, size);
      setBrands(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      setCurrentPage(result.pageNumber);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Tự động load lại khi trang hoặc kích thước trang thay đổi
  useEffect(() => {
    loadBrands(searchTerm, currentPage, pageSize);
  }, [currentPage, pageSize, loadBrands]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); 
    loadBrands(searchTerm, 1, pageSize);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1); // Reset về trang 1 khi đổi số lượng hiển thị
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
        showToast("Cập nhật Hãng thành công!");
      } else {
        await brandService.addBrand(brandName);
        showToast("Thêm Hãng mới thành công!");
      }
      loadBrands(searchTerm, currentPage, pageSize);
      closeModal();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hãng này?')) {
      try {
        await brandService.deleteBrand(id);
        showToast("Đã xóa hãng thành công");
        loadBrands(searchTerm, currentPage, pageSize);
      } catch (error: any) {
        showToast(error.message, "error");
      }
    }
  };

  const columns: Column<Brand>[] = [
    {
      title: 'STT',
      key: 'index',
      width: '80px',
      render: (_, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: 'Tên Hãng Sản Xuất',
      key: 'name',
      render: (record) => <span style={{ fontWeight: 600, fontSize: '1rem' }}>{record.name}</span>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '150px',
      align: 'right',
      render: (record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button 
            onClick={() => openModal(record)}
            className="icon-btn" 
            style={{ color: '#1890ff', background: '#e6f7ff', padding: '8px', borderRadius: '8px' }}
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={() => handleDelete(record.id)}
            className="icon-btn" 
            style={{ color: '#ff4d4f', background: '#fff1f0', padding: '8px', borderRadius: '8px' }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem' }}>
            <Building2 size={28} color="#1890ff" /> Quản lý Hãng
          </h2>
          <p style={{ margin: '5px 0 0 40px', color: '#8c8c8c', fontSize: '0.9rem' }}>
            Hiển thị <strong>{brands.length}</strong> / <strong>{totalCount}</strong> kết quả
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => loadBrands(searchTerm, currentPage, pageSize)} 
            className="btn btn-secondary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            disabled={loading}
          >
            <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => openModal()} 
            className="btn btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          >
            <Plus size={18} /> Thêm Hãng
          </button>
        </div>
      </div>

      {/* Search & PageSize Bar */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            <input 
              type="text" 
              placeholder="Nhập tên hãng để tìm kiếm..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 45px', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border)', 
                background: 'var(--bg-primary)', 
                color: 'var(--text-primary)',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '0 30px', borderRadius: 'var(--radius-md)' }}>
            Tìm kiếm
          </button>
        </form>

        <div style={{ width: '1px', height: '30px', background: 'var(--border)' }}></div>

        {/* PageSize Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
          <span style={{ color: '#8c8c8c' }}>Hiển thị:</span>
          <select 
            value={pageSize} 
            onChange={handlePageSizeChange}
            style={{ 
              padding: '10px 15px', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border)', 
              background: 'var(--bg-primary)',
              cursor: 'pointer',
              fontWeight: 600,
              minWidth: '120px'
            }}
          >
            <option value={5}>5 bản ghi</option>
            <option value={10}>10 bản ghi</option>
            <option value={25}>25 bản ghi</option>
            <option value={50}>50 bản ghi</option>
          </select>
        </div>
      </div>

      <Table columns={columns} dataSource={brands} loading={loading} rowKey="id" />

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px', padding: '20px 0', borderTop: '1px solid #f0f0f0' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            style={{ background: 'none', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
            Trang <span style={{ color: '#1890ff' }}>{currentPage}</span> / {totalPages}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            style={{ background: 'none', border: '1px solid #d9d9d9', borderRadius: '8px', padding: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '480px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{currentBrand ? 'Cập nhật Hãng' : 'Thêm Hãng mới'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c8c8c' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 600, fontSize: '0.95rem' }}>Tên Hãng sản xuất</label>
                <input 
                  type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Nhập tên hãng..." autoFocus required
                  style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #d9d9d9', boxSizing: 'border-box', fontSize: '1rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                <button type="button" onClick={closeModal} className="btn btn-secondary" style={{ padding: '10px 25px' }}>Hủy</button>
                <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 30px' }} disabled={modalLoading}>
                  {modalLoading ? <RotateCw size={18} className="animate-spin" /> : <Check size={18} />}
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
