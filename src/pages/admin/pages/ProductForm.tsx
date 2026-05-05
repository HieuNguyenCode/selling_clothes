import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {productService} from '../../../services/productService';
import {categoryService} from '../../../services/categoryService';
import {brandService} from '../../../services/brandService';
import {ArrowLeft, Save, Image as ImageIcon, Plus, X, RotateCw} from 'lucide-react';
import Loading from '../../../components/common/Loading';
import SearchableSelect from '../../../components/common/SearchableSelect';
import { useToast } from '../../../context/ToastContext';
import { getImageUrl } from '../../../utils/urlUtils';

const ProductForm = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const {showToast} = useToast();

    const [loading, setLoading] = useState(true);
    const [imgProcessing, setImgProcessing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Metadata
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        typeName: '',
        companyName: '',
        sizes: [] as string[],
        colors: [] as string[]
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewMain, setPreviewMain] = useState<string>('');

    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');

    const urlToFile = async (url: string) => {
        try {
            const safeUrl = getImageUrl(url);
            const filename = safeUrl.split('/').pop() || 'image.png';
            const response = await fetch(safeUrl);
            if (!response.ok) return null;
            const blob = await response.blob();
            return new File([blob], filename, {type: blob.type});
        } catch (err) {
            console.error("Helper Error:", err);
            return null;
        }
    };

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            setLoading(true);
            try {
                const [catsRes, brsRes] = await Promise.all([
                    categoryService.fetchCategories(),
                    brandService.fetchBrands()
                ]);

                if (!isMounted) return;
                setCategories(catsRes.data);
                setBrands(brsRes.data);

                if (id) {
                    const res = await productService.fetchProductById(id);
                    if (!isMounted) return;

                    setFormData({
                        name: res.name || '',
                        description: res.description || '',
                        price: res.price || 0,
                        typeName: res.typeName || '',
                        companyName: res.companyName || '',
                        sizes: res.sizes || [],
                        colors: res.colors || []
                    });

                    setImgProcessing(true);
                    const mainFile = await urlToFile(getImageUrl(res.image));
                    if (mainFile && isMounted) {
                        setImageFile(mainFile);
                        setPreviewMain(URL.createObjectURL(mainFile));
                    }

                    if (res.images && res.images.length > 0) {
                        const files = await Promise.all(res.images.map((img: string) => urlToFile(getImageUrl(img))));
                        if (isMounted) setImageFiles(files.filter(f => f !== null) as File[]);
                    }
                    setImgProcessing(false);
                }
            } catch (err: any) {
                showToast("Lỗi tải dữ liệu: " + err.message, "error");
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        init();
        return () => {
            isMounted = false;
        };
    }, [id, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (saving || imgProcessing) return;

        if (!formData.typeName || !formData.companyName) return showToast("Vui lòng chọn Loại và Hãng", "error");
        if (!imageFile) return showToast("Ảnh chính là bắt buộc", "error");

        setSaving(true);
        try {
            await productService.handleSaveProduct(id || null, {
                ...formData,
                imageFile,
                imageFiles
            });

            showToast(id ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
            navigate('/admin/products');
        } catch (error: any) {
            showToast(error.message, "error");
        } finally {
            setSaving(false);
        }
    };

    // Convert categories and brands to SearchableSelect options
    const categoryOptions = categories.map(c => ({value: c.name, label: c.name}));
    const brandOptions = brands.map(b => ({value: b.name, label: b.name}));

    if (loading) return <div className="admin-card"><Loading size={48}/></div>;

    return (
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '100%'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
            }}>
                <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-secondary"
                        style={{display: 'flex', alignItems: 'center', gap: '8px'}}><ArrowLeft size={18}/> Quay lại
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving || imgProcessing}
                        style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {saving ? <RotateCw size={18} className="animate-spin"/> : <Save size={18}/>}
                    {id ? 'Lưu thay đổi' : 'Đăng sản phẩm'}
                </button>
            </div>

            {imgProcessing && <div style={{
                padding: '10px',
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: '8px',
                color: '#1890ff',
                fontSize: '0.85rem'
            }}>Đang đồng bộ ảnh...</div>}

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
                <div className="admin-card"
                     style={{display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0}}>
                    <div className="form-group">
                        <label style={{fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '8px'}}>Tên
                            sản phẩm</label>
                        <input type="text" value={formData.name}
                               onChange={e => setFormData({...formData, name: e.target.value})} required style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            boxSizing: 'border-box'
                        }}/>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '20px'
                    }}>
                        <div className="form-group" style={{marginBottom: 0}}>
                            <label style={{
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                display: 'block',
                                marginBottom: '8px',
                                color: 'var(--text-primary)',
                                lineHeight: '1.2'
                            }}>Giá
                                niêm yết (đ)</label>
                            <input type="number" value={formData.price}
                                   onChange={e => setFormData({...formData, price: Number(e.target.value)})} required
                                   style={{
                                       width: '100%',
                                       padding: '12px',
                                       height: '45px',
                                       borderRadius: 'var(--radius-sm)',
                                       border: '1px solid var(--border)',
                                       background: 'var(--bg-primary)',
                                       color: 'var(--text-primary)',
                                       boxSizing: 'border-box'
                                   }}/>
                        </div>

                        <SearchableSelect
                            label="Loại sản phẩm"
                            placeholder="Chọn loại..."
                            options={categoryOptions}
                            value={formData.typeName}
                            onChange={(val) => setFormData({...formData, typeName: val})}
                            required
                        />
                    </div>

                    <SearchableSelect
                        label="Hãng sản xuất"
                        placeholder="Chọn hãng..."
                        options={brandOptions}
                        value={formData.companyName}
                        onChange={(val) => setFormData({...formData, companyName: val})}
                        required
                    />

                    <div className="form-group">
                        <label style={{fontWeight: 600, fontSize: '0.9rem', display: 'block', marginBottom: '8px'}}>Mô
                            tả sản phẩm</label>
                        <textarea rows={5} value={formData.description}
                                  onChange={e => setFormData({...formData, description: e.target.value})} required
                                  style={{
                                      width: '100%',
                                      padding: '12px',
                                      borderRadius: '8px',
                                      border: '1px solid var(--border)',
                                      resize: 'vertical',
                                      boxSizing: 'border-box'
                                  }}/>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '24px'
                    }}>
                        <div style={{minWidth: 0}}><label style={{fontWeight: 600, fontSize: '0.9rem'}}>Kích
                            thước</label>
                            <div style={{display: 'flex', gap: '8px', margin: '8px 0'}}>
                                <input type="text"
                                       value={newSize}
                                       onChange={e => setNewSize(e.target.value)}
                                       placeholder="VD: XL"
                                       style={{
                                           flex: 1,
                                           padding: '8px',
                                           borderRadius: '8px',
                                           border: '1px solid var(--border)',
                                           boxSizing: 'border-box',
                                           minWidth: 0
                                       }}/>
                                <button type="button" onClick={() => {
                                    if (newSize) {
                                        setFormData({...formData, sizes: [...formData.sizes, newSize]});
                                        setNewSize('');
                                    }
                                }} className="btn btn-secondary" style={{padding: '8px'}}><Plus size={16}/></button>
                            </div>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>{formData.sizes.map(s => <span
                                key={s} style={{
                                padding: '4px 12px',
                                background: 'var(--bg-accent)',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>{s} <X size={14} cursor="pointer" onClick={() => setFormData({
                                ...formData,
                                sizes: formData.sizes.filter(x => x !== s)
                            })}/></span>)}</div>
                        </div>
                        <div style={{minWidth: 0}}><label style={{fontWeight: 600, fontSize: '0.9rem'}}>Màu sắc</label>
                            <div style={{display: 'flex', gap: '8px', margin: '8px 0'}}>
                                <input type="text"
                                       value={newColor}
                                       onChange={e => setNewColor(e.target.value)}
                                       placeholder="VD: Đỏ"
                                       style={{
                                           flex: 1,
                                           padding: '8px',
                                           borderRadius: '8px',
                                           border: '1px solid var(--border)',
                                           boxSizing: 'border-box',
                                           minWidth: 0
                                       }}/>
                                <button type="button" onClick={() => {
                                    if (newColor) {
                                        setFormData({...formData, colors: [...formData.colors, newColor]});
                                        setNewColor('');
                                    }
                                }} className="btn btn-secondary" style={{padding: '8px'}}><Plus size={16}/></button>
                            </div>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>{formData.colors.map(c => <span
                                key={c} style={{
                                padding: '4px 12px',
                                background: 'var(--bg-accent)',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>{c} <X size={14} cursor="pointer" onClick={() => setFormData({
                                ...formData,
                                colors: formData.colors.filter(x => x !== c)
                            })}/></span>)}</div>
                        </div>
                    </div>
                </div>

                <div className="admin-card"
                     style={{display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0}}>
                    <div><label style={{fontWeight: 600, display: 'block', marginBottom: '12px'}}>Ảnh đại diện</label>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            aspectRatio: '1',
                            border: '2px dashed var(--border)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#fafafa'
                        }}>{previewMain ? <img src={previewMain} alt="Main"
                                               style={{width: '100%', height: '100%', objectFit: 'cover'}}/> :
                            <ImageIcon size={48} color="#8c8c8c"/>}<input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setImageFile(file);
                                setPreviewMain(URL.createObjectURL(file));
                            }
                        }} style={{position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer'}}/></div>
                    </div>
                    <div><label style={{fontWeight: 600, display: 'block', marginBottom: '12px'}}>Album ảnh phụ</label>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                            gap: '10px'
                        }}>
                            <div style={{
                                position: 'relative',
                                aspectRatio: '1',
                                border: '2px dashed var(--border)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#fafafa'
                            }}><Plus size={24} color="#8c8c8c"/><input type="file" multiple accept="image/*"
                                                                       onChange={e => {
                                                                           const files = Array.from(e.target.files || []);
                                                                           setImageFiles([...imageFiles, ...files]);
                                                                       }} style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: 0,
                                cursor: 'pointer'
                            }}/></div>
                            {imageFiles.map((file, idx) => (
                                <div key={idx} style={{position: 'relative', aspectRatio: '1'}}><img
                                    src={URL.createObjectURL(file)} alt="sub"
                                    style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}}/>
                                    <button type="button" onClick={() => {
                                        const newFiles = [...imageFiles];
                                        newFiles.splice(idx, 1);
                                        setImageFiles(newFiles);
                                    }} style={{
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        background: '#ff4d4f',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        padding: '2px',
                                        cursor: 'pointer',
                                        zIndex: 10
                                    }}><X size={12}/></button>
                                </div>))}</div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
