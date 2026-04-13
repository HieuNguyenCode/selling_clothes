import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ProductProvider } from './context/Product.Context.tsx';
import { UserProvider, useUser } from './context/UserContext';
import { CartProvider } from './context/Cart.Context.tsx';
import { ThemeProvider } from './context/Theme.Context.tsx';
import { ToastProvider } from './context/ToastContext';
import Home from './pages/user/pages/Home';
import Dashboard from './pages/admin/pages/Dashboard';
import Products from './pages/admin/pages/Products';
import Combos from './pages/admin/pages/Combos';
import ComboDetail from './pages/admin/pages/ComboDetail';
import ComboForm from './pages/admin/pages/ComboForm';
import ProductDetail from './pages/admin/pages/ProductDetail';
import ProductForm from './pages/admin/pages/ProductForm';
import Brands from './pages/admin/pages/Brands';
import Categories from './pages/admin/pages/Categories';
import Sales from './pages/admin/pages/Sales';
import SaleForm from './pages/admin/pages/SaleForm';
import AdminLayout from './pages/admin/components/AdminLayout';
import Header from './pages/user/components/Header';
import Login from './pages/user/pages/Login';
import Register from './pages/user/pages/Register';
import Cart from './pages/user/pages/Cart';
import SaleList from './pages/user/pages/SaleList';
import SaleDetailPage from './pages/user/pages/SaleDetailPage';
import UserProductList from './pages/user/pages/UserProductList';
import UserProductDetail from './pages/user/pages/UserProductDetail';
import UserComboList from './pages/user/pages/UserComboList';
import UserComboDetail from './pages/user/pages/UserComboDetail';
import './App.css';
import React from "react";

// Component bảo vệ Route Admin
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading } = useUser();
  
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTop: '4px solid #1890ff', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <UserProvider>
          <ProductProvider>
            <CartProvider>
              <Router>
                <div className="app-container">
                  <Routes>
                    {/* --- NGƯỜI DÙNG --- */}
                    <Route path="/" element={<><Header /><main className="main-content"><Home /></main><UserFooter /></>} />
                    <Route path="/login" element={<><Header /><main className="main-content"><Login /></main><UserFooter /></>} />
                    <Route path="/register" element={<><Header /><main className="main-content"><Register /></main><UserFooter /></>} />
                    <Route path="/cart" element={<><Header /><main className="main-content"><Cart /></main><UserFooter /></>} />
                    
                    {/* Danh sách & Chi tiết */}
                    <Route path="/products" element={<><Header /><main className="main-content"><UserProductList /></main><UserFooter /></>} />
                    <Route path="/products/:id" element={<><Header /><main className="main-content"><UserProductDetail /></main><UserFooter /></>} />
                    <Route path="/combos" element={<><Header /><main className="main-content"><UserComboList /></main><UserFooter /></>} />
                    <Route path="/combos/:id" element={<><Header /><main className="main-content"><UserComboDetail /></main><UserFooter /></>} />
                    <Route path="/sale" element={<><Header /><main className="main-content"><SaleList /></main><UserFooter /></>} />
                    <Route path="/sale/:id" element={<><Header /><main className="main-content"><SaleDetailPage /></main><UserFooter /></>} />

                    {/* --- ADMIN --- */}
                    <Route path="/admin" element={<ProtectedAdminRoute><Dashboard /></ProtectedAdminRoute>} />
                    
                    {/* Quản lý Sản phẩm */}
                    <Route path="/admin/products" element={<ProtectedAdminRoute><Products /></ProtectedAdminRoute>} />
                    <Route path="/admin/products/:id" element={<ProtectedAdminRoute><ProductDetail /></ProtectedAdminRoute>} />
                    <Route path="/admin/add" element={<ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>} />
                    <Route path="/admin/edit/:id" element={<ProtectedAdminRoute><ProductForm /></ProtectedAdminRoute>} />
                    
                    {/* Quản lý Combo */}
                    <Route path="/admin/combo" element={<ProtectedAdminRoute><Combos /></ProtectedAdminRoute>} />
                    <Route path="/admin/combo/add" element={<ProtectedAdminRoute><ComboForm /></ProtectedAdminRoute>} />
                    <Route path="/admin/combo/edit/:id" element={<ProtectedAdminRoute><ComboForm /></ProtectedAdminRoute>} />
                    <Route path="/admin/combo/:id" element={<ProtectedAdminRoute><ComboDetail /></ProtectedAdminRoute>} />

                    {/* Quản lý Hãng & Danh mục */}
                    <Route path="/admin/brands" element={<ProtectedAdminRoute><Brands /></ProtectedAdminRoute>} />
                    <Route path="/admin/categories" element={<ProtectedAdminRoute><Categories /></ProtectedAdminRoute>} />
                    <Route path="/admin/sale" element={<ProtectedAdminRoute><Sales /></ProtectedAdminRoute>} />
                    <Route path="/admin/sale/add" element={<ProtectedAdminRoute><SaleForm /></ProtectedAdminRoute>} />
                    <Route path="/admin/sale/edit/:id" element={<ProtectedAdminRoute><SaleForm /></ProtectedAdminRoute>} />

                    {/* Placeholder */}
                    {['accessories', 'orders', 'search', 'cart-status'].map(path => (
                      <Route key={path} path={`/admin/${path}`} element={
                        <ProtectedAdminRoute>
                          <div className="admin-card">
                            <h3>Trang quản lý {path}</h3>
                            <p>Nội dung đang được phát triển...</p>
                          </div>
                        </ProtectedAdminRoute>
                      } />
                    ))}
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </Router>
            </CartProvider>
          </ProductProvider>
        </UserProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

const UserFooter = () => (
  <footer style={{ padding: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
    <p>© 2026 TORANO - Clothes Shop Demo</p>
    <p>Bạn là quản trị viên? <Link to="/login" style={{ color: 'var(--text-primary)' }}>Đăng nhập tại đây</Link></p>
  </footer>
);

export default App;
