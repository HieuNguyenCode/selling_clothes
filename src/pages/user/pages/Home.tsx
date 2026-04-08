import { useState, useEffect } from 'react';
import { productService, ProductList } from '../../../services/productService';
import ProductCard from '../components/ProductCard';
import Loading from '../../../components/common/Loading';

const Home = () => {
    const [products, setProducts] = useState<ProductList[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                // Kết quả từ service là response body { data: [...], totalCount: ... }
                const result = await productService.fetchProducts('', 1, 50);
                console.log("Home Page: API Result:", result);
                
                // Trích xuất mảng sản phẩm từ trường 'data'
                if (result && Array.isArray(result.data)) {
                    setProducts(result.data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Home Page: Error loading products:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Loading size={48} />
        </div>
    );

    return (
        <div style={{ paddingBottom: '50px' }}>
            <h1 style={{ textAlign: 'left', marginBottom: '30px', fontSize: '1.8rem', fontWeight: 700 }}>
                Bộ sưu tập thời trang
            </h1>
            
            {products.length > 0 ? (
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product as any}/>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '100px 20px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                        Hiện tại chưa có sản phẩm nào để hiển thị.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;
