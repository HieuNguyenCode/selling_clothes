import React, { useState, useEffect, useCallback } from 'react';
import { brandService, Brand } from '../../../services/brandService';
import { Building2, Plus, Edit, Trash2, RotateCw, Check } from 'lucide-react';
import Table, { Column } from '../../../components/common/Table';
import AdminHeader from '../components/AdminHeader';
import AdminToolbar from '../components/AdminToolbar';
import AdminButton from '../components/AdminButton';
import AdminFormInput from '../components/AdminFormInput';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../context/ToastContext';

const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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

  useEffect(() => {
    loadBrands(searchTerm, currentPage, pageSize);
  }, [currentPage, pageSize, loadBrands]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); 
    loadBrands(searchTerm, 1, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
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
          <AdminButton 
            variant="icon"
            onClick={() => openModal(record)}
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
        title="Quản lý Hãng"
        subtitle={`Hiển thị ${brands.length} / ${totalCount} kết quả`}
        icon={Building2}
        onRefresh={() => loadBrands(searchTerm, currentPage, pageSize)}
        refreshLoading={loading}
        actionButton={{
          label: "Thêm Hãng",
          icon: Plus,
          onClick: () => openModal()
        }}
      />

      <AdminToolbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Nhập tên hãng để tìm kiếm..."
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />

      <Table columns={columns} dataSource={brands} loading={loading} rowKey="id" />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentBrand ? 'Cập nhật Hãng' : 'Thêm Hãng mới'}
      >
        <form onSubmit={handleSubmit}>
          <AdminFormInput 
            label="Tên Hãng sản xuất"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Nhập tên hãng..."
            autoFocus
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
            <AdminButton variant="secondary" onClick={closeModal} type="button">Hủy</AdminButton>
            <AdminButton 
              type="submit" 
              icon={Check} 
              loading={modalLoading} 
              loadingIcon={RotateCw}
            >
              {currentBrand ? 'Cập nhật' : 'Xác nhận'}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Brands;
