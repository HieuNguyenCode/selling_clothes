import React, { useState, useEffect, useCallback } from 'react';
import { categoryService, Category } from '../../../services/categoryService';
import { FolderTree, Plus, Edit, Trash2, RotateCw, Check } from 'lucide-react';
import Table, { Column } from '../../../components/common/Table';
import AdminHeader from '../components/AdminHeader';
import AdminToolbar from '../components/AdminToolbar';
import AdminButton from '../components/AdminButton';
import AdminFormInput from '../components/AdminFormInput';
import Pagination from '../../../components/common/Pagination';
import Modal from '../../../components/common/Modal';
import { useToast } from '../../../context/ToastContext';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  const loadCategories = useCallback(async (search = '', page = 1, size = 10) => {
    setLoading(true);
    try {
      const result = await categoryService.fetchCategories(search, page, size);
      setCategories(result.data);
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
    loadCategories(searchTerm, currentPage, pageSize);
  }, [currentPage, pageSize, loadCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadCategories(searchTerm, 1, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const openModal = (category: Category | null = null) => {
    setCurrentCategory(category);
    setCategoryName(category ? category.name : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
    setCategoryName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setModalLoading(true);
    try {
      if (currentCategory) {
        await categoryService.updateCategory(currentCategory.idtype, categoryName);
        showToast("Cập nhật danh mục thành công!");
      } else {
        await categoryService.addCategory(categoryName);
        showToast("Thêm danh mục mới thành công!");
      }
      loadCategories(searchTerm, currentPage, pageSize);
      closeModal();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoryService.deleteCategory(id);
        showToast("Đã xóa danh mục!");
        loadCategories(searchTerm, currentPage, pageSize);
      } catch (error: any) {
        showToast(error.message, "error");
      }
    }
  };

  const columns: Column<Category>[] = [
    {
      title: 'STT',
      key: 'index',
      width: '80px',
      render: (_, index) => (currentPage - 1) * pageSize + index + 1
    },
    {
      title: 'Tên Danh Mục',
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
            onClick={() => handleDelete(record.idtype)}
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
        title="Quản lý Danh mục"
        subtitle={`Hiển thị ${categories.length} / ${totalCount} danh mục`}
        icon={FolderTree}
        onRefresh={() => loadCategories(searchTerm, currentPage, pageSize)}
        refreshLoading={loading}
        actionButton={{
          label: "Thêm Danh mục",
          icon: Plus,
          onClick: () => openModal()
        }}
      />

      <AdminToolbar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Nhập tên danh mục để tìm kiếm..."
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        loading={loading}
      />

      <Table columns={columns} dataSource={categories} loading={loading} rowKey="idtype" />

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentCategory ? 'Cập nhật Danh mục' : 'Thêm Danh mục mới'}
      >
        <form onSubmit={handleSubmit}>
          <AdminFormInput 
            label="Tên Danh mục"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nhập tên danh mục..."
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
              {currentCategory ? 'Cập nhật' : 'Xác nhận'}
            </AdminButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
