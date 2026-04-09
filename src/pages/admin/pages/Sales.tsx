import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { saleService, Sale, SaleDetail } from '../../../services/saleService';
import { Percent, Plus, Edit, Trash2, RotateCw, Eye } from 'lucide-react';
import Table, { Column } from '../../../components/common/Table';
import AdminHeader from '../components/AdminHeader';
import AdminToolbar from '../components/AdminToolbar';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import AdminButton from '../components/AdminButton';
import { useToast } from '../../../context/ToastContext';

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { showToast } = useToast();
  
  // Modal states for View Detail
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [saleDetail, setSaleDetail] = useState<SaleDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadSales = useCallback(async (search = '', page = 1, size = 10) => {
    setLoading(true);
    try {
      const result = await saleService.fetchSales(search, page, size);
      setSales(result.data);
      setTotalPages(result.totalPages);
      setTotalCount(result.totalCount);
      setCurrentPage(result.pageNumber);
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadSales(searchTerm, currentPage, pageSize);
  }, [currentPage, pageSize, loadSales]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); 
    loadSales(searchTerm, 1, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const openDetailModal = async (id: string) => {
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const result = await saleService.getSaleDetail(id);
      setSaleDetail(result.data);
    } catch (error: any) {
      showToast(error.message, "error");
      setIsDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSaleDetail(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện sale này?')) {
      try {
        await saleService.deleteSale(id);
        showToast("Đã xóa sự kiện sale thành công");
        loadSales(searchTerm, currentPage, pageSize);
      } catch (error: any) {
        showToast(error.message, "error");
      }
    }
  };

  const columns: Column<Sale>[] = [
    {
      title: 'STT',
      key: 'index',
      width: '80px',
      render: (_, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: 'Tên Sự Kiện Sale',
      key: 'name',
      render: (record) => <span style={{ fontWeight: 600, fontSize: '1rem' }}>{record.name}</span>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: '200px',
      align: 'right',
      render: (record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <AdminButton 
            variant="icon"
            onClick={() => openDetailModal(record.id)}
            icon={Eye}
            style={{ color: '#52c41a', background: '#f6ffed' }}
            title="Xem chi tiết"
          />
          <AdminButton 
            variant="icon"
            onClick={() => navigate(`/admin/sale/edit/${record.id}`)}
            icon={Edit}
            style={{ color: '#1890ff', background: '#e6f7ff' }}
            title="Sửa"
          />
          <AdminButton 
            variant="icon"
            onClick={() => handleDelete(record.id)}
            icon={Trash2}
            style={{ color: '#ff4d4f', background: '#fff1f0' }}
            title="Xóa"
          />
        </div>
      )
    }
  ];

  return (
    <div className="admin-card">
      <AdminHeader 
        title="Quản lý Sự kiện Sale"
        subtitle={`Hiển thị ${sales.length} / ${totalCount} kết quả`}
        icon={Percent}
        onRefresh={() => loadSales(searchTerm, currentPage, pageSize)}
        refreshLoading={loading}
        actionButton={{
          label: "Thêm Sự Kiện",
          icon: Plus,
          onClick: () => navigate('/admin/sale/add')
        }}
      />

      <AdminToolbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Nhập tên sự kiện để tìm kiếm..."
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />

      <Table columns={columns} dataSource={sales} loading={loading} rowKey="id" />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />

      {/* Modal View Detail */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        title={`Chi tiết: ${saleDetail?.name || ''}`}
        maxWidth="900px"
      >
        {detailLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <RotateCw size={40} className="animate-spin" color="#1890ff" />
          </div>
        ) : (
          <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
            <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '18px', background: '#1890ff', borderRadius: '2px' }}></div>
              Sản phẩm đang Sale ({saleDetail?.saleProducts.length || 0})
            </h4>
            {saleDetail && saleDetail.saleProducts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                {saleDetail.saleProducts.map(product => (
                  <div key={product.id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fafafa' }}>
                    <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                      <div style={{ color: '#ff4d4f', fontWeight: 700, fontSize: '0.85rem' }}>{product.price.toLocaleString('vi-VN')} đ</div>
                      <div style={{ fontSize: '0.75rem', color: '#8c8c8c', marginTop: '4px' }}>
                        Từ: {new Date(product.startDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#8c8c8c', textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '30px' }}>Chưa có sản phẩm nào trong sự kiện này.</p>
            )}

            <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '18px', background: '#722ed1', borderRadius: '2px' }}></div>
              Combo đang Sale ({saleDetail?.saleCombos.length || 0})
            </h4>
            {saleDetail && saleDetail.saleCombos.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {saleDetail.saleCombos.map(combo => (
                  <div key={combo.id} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px', background: '#fafafa' }}>
                    <img src={combo.image} alt={combo.name} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{combo.name}</div>
                      <div style={{ color: '#ff4d4f', fontWeight: 700, fontSize: '0.85rem' }}>{combo.price.toLocaleString('vi-VN')} đ</div>
                      <div style={{ fontSize: '0.75rem', color: '#8c8c8c', marginTop: '4px' }}>
                        Từ: {new Date(combo.startDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#8c8c8c', textAlign: 'center', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>Chưa có combo nào trong sự kiện này.</p>
            )}

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <AdminButton onClick={closeDetailModal}>Đóng</AdminButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Sales;
