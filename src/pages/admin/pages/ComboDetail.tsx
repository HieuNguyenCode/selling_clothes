import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {comboService, ComboDetail as IComboDetail} from '../../../services/comboService';
import {ArrowLeft, Edit, Package, Tag} from 'lucide-react';
import Loading from '../../../components/common/Loading';

const ComboDetail = () => {
    const {id} = useParams();
    const [combo, setCombo] = useState<IComboDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            comboService.fetchComboById(id)
                .then(setCombo)
                .catch(err => alert(err.message))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="admin-card"><Loading size={48}/></div>;
    if (!combo) return <div className="admin-card">Không tìm thấy combo.</div>;

    const getImageUrl = (path: string | undefined) => {
        if (!path) return '';
        if (path.includes(':5267')) return path.split(':5267')[1];
        return path.startsWith('/') ? path : `/${path}`;
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <button onClick={() => navigate('/admin/combo')} className="btn btn-secondary"
                        style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <ArrowLeft size={18}/> Quay lại
                </button>
                <button onClick={() => navigate(`/admin/combo/edit/${combo.id}`)} className="btn btn-primary"
                        style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Edit size={18}/> Chỉnh sửa
                </button>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px'}}>
                {/* Combo Image */}
                <div className="admin-card">
                    <div style={{
                        width: '100%',
                        aspectRatio: '1/1',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid var(--border)'
                    }}>
                        <img src={getImageUrl(combo.image)} alt={combo.name}
                             style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                    </div>
                </div>

                {/* Combo Info & Products */}
                <div className="admin-card" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                    <div>
                        <div style={{
                            color: '#1890ff',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            <Tag size={14}/> Gói Combo Khuyến Mãi
                        </div>
                        <h1 style={{margin: 0, fontSize: '2rem'}}>{combo.name}</h1>
                        <div style={{marginTop: '12px'}}>
                            <span style={{
                                fontSize: '1.8rem',
                                fontWeight: 800,
                                color: 'var(--text-primary)'
                            }}>{combo.price.toLocaleString('vi-VN')} đ</span>
                        </div>
                    </div>

                    <div style={{borderTop: '1px solid var(--border)', paddingTop: '24px'}}>
                        <h3 style={{marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Package size={20} color="#1890ff"/> Danh sách sản phẩm trong Combo
                        </h3>

                        <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                            {combo.products && combo.products.length > 0 ? combo.products.map((item, idx) => (
                                <div key={idx} style={{
                                    padding: '12px',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    border: '1px solid var(--border)'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        border: '1px solid var(--border)',
                                        flexShrink: 0
                                    }}>
                                        <img src={getImageUrl(item.image)} alt={item.name}
                                             style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                                    </div>
                                    <div style={{flex: 1}}>
                                        <div style={{fontWeight: 600, fontSize: '1rem'}}>{item.name}</div>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            color: 'var(--text-secondary)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px',
                                            marginTop: '4px'
                                        }}>
                                            <div>ID: {item.id}</div>
                                            {item.size && item.size.length > 0 && (
                                                <div>Sizes: <span style={{color: 'var(--text-primary)', fontWeight: 600}}>{item.size.join(', ')}</span></div>
                                            )}
                                            {item.color && item.color.length > 0 && (
                                                <div>Colors: <span style={{color: 'var(--text-primary)', fontWeight: 600}}>{item.color.join(', ')}</span></div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{
                                        background: '#1890ff',
                                        color: 'white',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        flexShrink: 0
                                    }}>
                                        x {item.quantity}
                                    </div>
                                </div>
                            )) : (
                                <div style={{color: '#8c8c8c', fontStyle: 'italic'}}>Không có sản phẩm nào trong combo
                                    này.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComboDetail;
