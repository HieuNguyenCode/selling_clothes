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
                const data = await productService.fetchProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    if (loading) return <Loading size={48} />;

    return (
        <div>
            <h1 style={{textAlign: 'left', marginBottom: '2rem'}}>Bộ sưu tập thời trang</h1>
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product as any}/>
                ))}
            </div>
            {products.length === 0 && (
                <p style={{textAlign: 'center', marginTop: '3rem'}}>Không có sản phẩm nào để hiển thị.</p>
            )}
        </div>
    );
};

export default Home;
