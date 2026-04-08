import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {productService, ProductDetail as IProductDetail} from '../../../services/productService';
import {ArrowLeft, Edit, Building2, Layers, Maximize2, Palette} from 'lucide-react';
import Loading from '../../../components/common/Loading';

const ProductDetail = () => {
    const {id} = useParams();
    const [product, setProduct] = useState<IProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            productService.fetchProductById(id)
                .then(setProduct)
                .catch(err => alert(err.message))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="admin-card"><Loading size={48}/></div>;
    if (!product) return <div className="admin-card">Không tìm thấy sản phẩm.</div>;

    const getFullUrl = (path: string) => path.startsWith('http') ? path : `${import.meta.env.VITE_API_URL}${path}`;

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <button onClick={() => navigate('/admin/products')} className="btn btn-secondary"
                        style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <ArrowLeft size={18}/> Quay lại
                </button>
                <button onClick={() => navigate(`/admin/edit/${product.id}`)} className="btn btn-primary"
                        style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Edit size={18}/> Chỉnh sửa
                </button>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px'}}>
                {/* Images Section */}
                <div className="admin-card" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                    <img src={getFullUrl(product.image)} alt={product.name}
                         style={{width: '100%', borderRadius: '12px', border: '1px solid var(--border)'}}/>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px'}}>
                        {product.images.map((img, idx) => (
                            <img key={idx} src={getFullUrl(img)} style={{
                                width: '100%',
                                aspectRatio: '1',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid var(--border)'
                            }}/>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="admin-card" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    <div>
                        <h1 style={{margin: '0 0 8px 0', fontSize: '2rem'}}>{product.name}</h1>
                        <div style={{display: 'flex', gap: '12px', alignItems: 'baseline'}}>
                            <span style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: '#1890ff'
                            }}>{product.price.toLocaleString('vi-VN')} đ</span>
                            {product.priceSale && <span style={{
                                textDecoration: 'line-through',
                                color: '#ff4d4f'
                            }}>{product.priceSale.toLocaleString('vi-VN')} đ</span>}
                        </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Layers size={20} color="#8c8c8c"/>
                            <div>
                                <div style={{fontSize: '0.75rem', color: '#8c8c8c'}}>Loại sản phẩm</div>
                                <div style={{fontWeight: 600}}>{product.typeName}</div>
                            </div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Building2 size={20} color="#8c8c8c"/>
                            <div>
                                <div style={{fontSize: '0.75rem', color: '#8c8c8c'}}>Hãng sản xuất</div>
                                <div style={{fontWeight: 600}}>{product.companyName}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{borderTop: '1px solid var(--border)', paddingTop: '20px'}}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px',
                            fontWeight: 600
                        }}>
                            <Maximize2 size={18}/> Kích thước (Sizes)
                        </div>
                        <div style={{display: 'flex', gap: '10px'}}>
                            {product.sizes.map(s => <span key={s} style={{
                                padding: '6px 16px',
                                background: 'var(--bg-accent)',
                                borderRadius: '8px',
                                fontWeight: 600
                            }}>{s}</span>)}
                        </div>
                    </div>

                    <div style={{borderTop: '1px solid var(--border)', paddingTop: '20px'}}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '12px',
                            fontWeight: 600
                        }}>
                            <Palette size={18}/> Màu sắc (Colors)
                        </div>
                        <div style={{display: 'flex', gap: '10px'}}>
                            {product.colors.map(c => <span key={c} style={{
                                padding: '6px 16px',
                                background: 'var(--bg-accent)',
                                borderRadius: '8px',
                                fontWeight: 600
                            }}>{c}</span>)}
                        </div>
                    </div>

                    <div style={{borderTop: '1px solid var(--border)', paddingTop: '20px'}}>
                        <div style={{fontWeight: 600, marginBottom: '10px'}}>Mô tả chi tiết</div>
                        <p style={{color: 'var(--text-secondary)', lineHeight: '1.6'}}>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
