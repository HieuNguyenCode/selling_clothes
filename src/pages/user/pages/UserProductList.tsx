import React, { useState, useEffect, useRef } from 'react';
import { productService, ProductList } from '../../../services/productService';
import { Search, Filter, SlidersHorizontal, Check } from 'lucide-react';
import Loading from '../../../components/common/Loading';
import ProductCard from '../components/ProductCard';
import Pagination from '../../../components/common/Pagination';

const UserProductList = () => {
  const [products, setProducts] = useState<ProductList[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('UpdateAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [sortValue, setSortValue] = useState('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const pageSize = 12;

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá: Thấp đến Cao' },
    { value: 'price-desc', label: 'Giá: Cao đến Thấp' },
    { value: 'name-asc', label: 'Tên: A-Z' },
    { value: 'name-desc', label: 'Tên: Z-A' },
  ];

  const loadProducts = async (
    search = searchTerm, 
    page = currentPage, 
    sort = sortBy, 
    asc = sortAsc
  ) => {
    setLoading(true);
    try {
      // Đảm bảo dùng pageSize đúng của component
      const res = await productService.fetchProducts(search, page, pageSize, sort, asc);
      setProducts(res.data || []);
      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Gọi không đối số để sử dụng giá trị mặc định từ state (UpdateAt, false)
    loadProducts();
  }, [currentPage, sortBy, sortAsc]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProducts(searchTerm, 1, sortBy, sortAsc);
  };

  const applySort = (value: string) => {
    setSortValue(value);
    setCurrentPage(1);
    setIsSortOpen(false);
    
    if (value === 'newest') {
      setSortBy('UpdateAt');
      setSortAsc(false);
    } else if (value === 'price-asc') {
      setSortBy('Price');
      setSortAsc(true);
    } else if (value === 'price-desc') {
      setSortBy('Price');
      setSortAsc(false);
    } else if (value === 'name-asc') {
      setSortBy('Name');
      setSortAsc(true);
    } else if (value === 'name-desc') {
      setSortBy('Name');
      setSortAsc(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 10px 0' }}>TẤT CẢ SẢN PHẨM</h1>
          <p style={{ color: '#8c8c8c', margin: 0 }}>Khám phá bộ sưu tập thời trang nam mới nhất từ TORANO</p>
        </div>
        
        <form onSubmit={handleSearch} style={{ 
          display: 'flex', 
          alignItems: 'center',
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '100px',
          padding: '4px 4px 4px 18px',
          width: '100%', 
          maxWidth: '450px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'border-color 0.3s'
        }}>
          <Search size={18} style={{ color: '#8c8c8c', flexShrink: 0 }} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1,
              padding: '10px 12px',
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              background: 'transparent'
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              padding: '10px 25px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            TÌM KIẾM
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Sidebar Filters - Placeholder */}
        <aside style={{ width: '250px', flexShrink: 0, display: 'none', '@media (min-width: 1024px)': { display: 'block' } } as any}>
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', fontSize: '1.1rem' }}>
              <Filter size={18} /> BỘ LỌC
            </h4>
            <div style={{ height: '1px', background: '#f0f0f0', marginBottom: '20px' }}></div>
            {/* Thêm các bộ lọc ở đây */}
            <p style={{ color: '#8c8c8c', fontSize: '0.9rem' }}>Đang cập nhật bộ lọc...</p>
          </div>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '0.95rem', color: '#8c8c8c', fontWeight: 500 }}>
              Hiển thị <strong style={{ color: '#000' }}>{products.length}</strong> sản phẩm
            </span>
            <div 
              ref={sortRef}
              style={{ 
                position: 'relative',
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                background: '#f5f5f5', 
                padding: '8px 20px', 
                borderRadius: '100px',
                border: '1px solid #efefef',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s'
              }}
              onClick={() => setIsSortOpen(!isSortOpen)}
            >
              <label style={{ fontSize: '0.85rem', color: '#666', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}>Sắp xếp:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#000' }}>
                  {sortOptions.find(o => o.value === sortValue)?.label}
                </span>
                <SlidersHorizontal size={14} style={{ color: '#000', transform: isSortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
              </div>

              {isSortOpen && (
                <div style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 10px)', 
                  right: 0, 
                  background: 'white', 
                  borderRadius: '16px', 
                  boxShadow: '0 15px 35px rgba(0,0,0,0.15)', 
                  padding: '8px',
                  minWidth: '220px',
                  zIndex: 100,
                  border: '1px solid #f0f0f0',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  {sortOptions.map(option => (
                    <div 
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        applySort(option.value);
                      }}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px', 
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: sortValue === option.value ? 700 : 500,
                        color: sortValue === option.value ? '#000' : '#444',
                        background: sortValue === option.value ? '#f5f5f5' : 'transparent',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        if (sortValue !== option.value) e.currentTarget.style.background = '#fafafa';
                      }}
                      onMouseLeave={(e) => {
                        if (sortValue !== option.value) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      {option.label}
                      {sortValue === option.value && <Check size={14} style={{ color: '#000' }} />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <Loading />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' }}>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div style={{ textAlign: 'center', padding: '100px 0', color: '#8c8c8c' }}>
                  Không tìm thấy sản phẩm nào phù hợp.
                </div>
              )}

              <div style={{ marginTop: '50px' }}>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={setCurrentPage} 
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProductList;
