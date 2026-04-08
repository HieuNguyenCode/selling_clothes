import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { categoryService, Category } from '../../../services/categoryService';
import { brandService, Brand } from '../../../services/brandService';
import { ArrowLeft, Save, Image as ImageIcon, Plus, X, RotateCw } from 'lucide-react';
import Loading from '../../../components/common/Loading';
import { useToast } from '../../../context/ToastContext';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [imgProcessing, setImgProcessing] = useState(false); // Trạng thái đang chuyển đổi ảnh
  const [saving, setSaving] = useState(false);

  // Metadata
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

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

  // Files & Previews
  // Quan trọng: Tất cả ảnh (cũ và mới) sẽ được quản lý dưới dạng File để khớp Backend [Required]
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  
  const [previewMain, setPreviewMain] = useState<string>('');

  // List helpers
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return path.startsWith('/') ? path : `/${path}`;
  };

  /**
   * Hàm tải ảnh từ URL và chuyển thành File
   */
  const urlToFile = async (url: string) => {
    try {
      const filename = url.split('/').pop() || `image_${Math.random().toString(36).substring(7)}.png`;
      const response = await fetch(url);
      if (!response.ok) return null;
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (err) {
      console.error("Lỗi tải ảnh:", url, err);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      setLoading(true);
      try {
        const [cats, brs] = await Promise.all([
          categoryService.fetchCategories().catch(() => []),
          brandService.fetchBrands().catch(() => [])
        ]);

        if (!isMounted) return;
        setCategories(cats);
        setBrands(brs);

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

          // LOGIC MỚI: Tải toàn bộ ảnh cũ về và biến thành File
          setImgProcessing(true);
          
          // 1. Xử lý ảnh chính
          const mainFile = await urlToFile(getImageUrl(res.image));
          if (mainFile && isMounted) {
            setImageFile(mainFile);
            setPreviewMain(URL.createObjectURL(mainFile));
          }

          // 2. Xử lý album ảnh phụ
          if (res.images && res.images.length > 0) {
            const files = await Promise.all(res.images.map(img => urlToFile(getImageUrl(img))));
            if (isMounted) {
              const validFiles = files.filter(f => f !== null) as File[];
              setImageFiles(validFiles);
            }
          }
          setImgProcessing(false);
        }
      } catch (err: any) {
        alert("Lỗi khởi tạo: " + err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initData();
    return () => { isMounted = false; };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || imgProcessing) return;

    if (!formData.typeName || !formData.companyName) return showToast("Vui lòng chọn Loại và Hãng", "error");
    if (!imageFile) return showToast("Ảnh chính là bắt buộc", "error");

    setSaving(true);
    try {
      await productService.handleSaveProduct(id || null, {
        ...formData,
        imageFile: imageFile,
        imageFiles: imageFiles
      });

      showToast(id ? 'Cập nhật sản phẩm thành công!' : 'Đã thêm sản phẩm mới!');
      navigate('/admin/products');
    } catch (error: any) {
      showToast('Lỗi khi lưu: ' + error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
      <Loading size={48} />
      <p style={{ marginTop: '10px', color: '#8c8c8c' }}>Đang tải dữ liệu sản phẩm...</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> Hủy bỏ
        </button>
        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} disabled={saving || imgProcessing}>
          {saving ? <RotateCw size={18} className="animate-spin" /> : <Save size={18} />}
          {id ? 'Lưu thay đổi' : 'Đăng sản phẩm'}
        </button>
      </div>

      {imgProcessing && (
        <div style={{ padding: '10px', background: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '8px', color: '#1890ff', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <RotateCw size={16} className="animate-spin" /> Đang đồng bộ ảnh từ hệ thống, vui lòng đợi trong giây lát...
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Left Column: Form Info */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label>Tên sản phẩm</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Giá niêm yết (đ)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }} />
            </div>
            <div className="form-group">
              <label>Loại sản phẩm</label>
              <select value={formData.typeName} onChange={e => setFormData({...formData, typeName: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                <option value="">Chọn loại...</option>
                {categories.map(c => <option key={c.idtype} value={c.name}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Hãng sản xuất</label>
            <select value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
              <option value="">Chọn hãng...</option>
              {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Mô tả chi tiết</label>
            <textarea rows={5} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <div>
              <label style={{ fontWeight: 600 }}>Kích thước</label>
              <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                <input type="text" value={newSize} onChange={e => setNewSize(e.target.value)} placeholder="VD: XL" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' }} onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); if(newSize) { setFormData({...formData, sizes: [...formData.sizes, newSize]}); setNewSize(''); } } }} />
                <button type="button" onClick={() => { if(newSize) { setFormData({...formData, sizes: [...formData.sizes, newSize]}); setNewSize(''); } }} className="btn btn-secondary" style={{ padding: '8px' }}><Plus size={16}/></button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.sizes.map(s => <span key={s} style={{ padding: '4px 12px', background: 'var(--bg-accent)', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>{s} <X size={14} cursor="pointer" onClick={() => setFormData({...formData, sizes: formData.sizes.filter(x => x !== s)})}/></span>)}
              </div>
            </div>
            <div>
              <label style={{ fontWeight: 600 }}>Màu sắc</label>
              <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                <input type="text" value={newColor} onChange={e => setNewColor(e.target.value)} placeholder="VD: Đỏ" style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' }} onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); if(newColor) { setFormData({...formData, colors: [...formData.colors, newColor]}); setNewColor(''); } } }} />
                <button type="button" onClick={() => { if(newColor) { setFormData({...formData, colors: [...formData.colors, newColor]}); setNewColor(''); } }} className="btn btn-secondary" style={{ padding: '8px' }}><Plus size={16}/></button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {formData.colors.map(c => <span key={c} style={{ padding: '4px 12px', background: 'var(--bg-accent)', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>{c} <X size={14} cursor="pointer" onClick={() => setFormData({...formData, colors: formData.colors.filter(x => x !== c)})}/></span>)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Images */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '12px' }}>Ảnh đại diện</label>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', border: '2px dashed var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
              {previewMain ? (
                <img src={previewMain} alt="Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
                  <ImageIcon size={48} strokeWidth={1} style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '0.85rem' }}>Tải ảnh lên</div>
                </div>
              )}
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files?.[0];
                if (file) { 
                  setImageFile(file); 
                  setPreviewMain(URL.createObjectURL(file)); 
                }
              }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '12px' }}>Album ảnh phụ</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ position: 'relative', aspectRatio: '1', border: '2px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                <Plus size={24} color="#8c8c8c" />
                <input type="file" multiple accept="image/*" onChange={e => {
                  const files = Array.from(e.target.files || []);
                  setImageFiles([...imageFiles, ...files]);
                }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
              </div>
              {imageFiles.map((file, idx) => (
                <div key={idx} style={{ position: 'relative', aspectRatio: '1' }}>
                  {/* Sử dụng URL.createObjectURL cho cả file cũ (đã tải về) và file mới */}
                  <img src={URL.createObjectURL(file)} alt="sub" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                  <button type="button" onClick={() => {
                    const newFiles = [...imageFiles];
                    newFiles.splice(idx, 1);
                    setImageFiles(newFiles);
                  }} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '50%', padding: '2px', cursor: 'pointer', zIndex: 10 }}><X size={12}/></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
