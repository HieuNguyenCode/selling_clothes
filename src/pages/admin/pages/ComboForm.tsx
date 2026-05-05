import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { comboService } from '../../../services/comboService';
import { productService } from '../../../services/productService';
import { ArrowLeft, Save, Image as ImageIcon, Plus, X, RotateCw, Trash2 } from 'lucide-react';
import Loading from '../../../components/common/Loading';
import SearchableSelect from '../../../components/common/SearchableSelect';
import { useToast } from '../../../context/ToastContext';
import { getImageUrl } from '../../../utils/urlUtils';

const ComboForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);

  // System Products for selection
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    products: [] as { name: string, quantity: number }[]
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewMain, setPreviewMain] = useState<string>('');

  // Helper for adding new product to list
  const [selectedProdName, setSelectedProdName] = useState('');
  const [selectedProdQty, setSelectedProdQty] = useState(1);

  const urlToFile = async (url: string) => {
    try {
      const filename = url.split('/').pop() || 'combo.png';
      const response = await fetch(url);
      if (!response.ok) return null;
      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    } catch (err) {
      console.error("Helper Error:", err);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        // Tải danh sách sản phẩm có sẵn để chọn vào combo
        const prodsRes = await productService.fetchProducts('', 1, 200);
        setAvailableProducts(prodsRes.data || []);

        if (id) {
          const res = await comboService.fetchComboById(id);
          setFormData({
            name: res.name,
            price: res.price,
            products: res.products.map(p => ({ name: p.name, quantity: p.quantity }))
          });

          const file = await urlToFile(getImageUrl(res.image));
          if (file) {
            setImageFile(file);
            setPreviewMain(URL.createObjectURL(file));
          }
        }
      } catch (err: any) {
        showToast("Lỗi: " + err.message, "error");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, showToast]);

  const addProductToCombo = () => {
    if (!selectedProdName) return;
    
    // Kiểm tra xem sản phẩm đã có trong list chưa
    const existingIdx = formData.products.findIndex(p => p.name === selectedProdName);
    if (existingIdx > -1) {
      const newList = [...formData.products];
      newList[existingIdx].quantity += selectedProdQty;
      setFormData({ ...formData, products: newList });
    } else {
      setFormData({
        ...formData,
        products: [...formData.products, { name: selectedProdName, quantity: selectedProdQty }]
      });
    }
    
    setSelectedProdName('');
    setSelectedProdQty(1);
  };

  const removeProductFromCombo = (index: number) => {
    const newList = [...formData.products];
    newList.splice(index, 1);
    setFormData({ ...formData, products: newList });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    if (!imageFile) return showToast("Vui lòng chọn ảnh cho Combo", "error");
    if (formData.products.length === 0) return showToast("Combo phải có ít nhất 1 sản phẩm", "error");

    setSaving(true);
    try {
      await comboService.handleSaveCombo(id || null, {
        ...formData,
        imageFile
      });

      showToast(id ? 'Cập nhật Combo thành công!' : 'Đã tạo Combo mới!');
      navigate('/admin/combo');
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-card"><Loading size={48} /></div>;

  const productOptions = availableProducts.map(p => ({ value: p.name, label: p.name }));

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button type="button" onClick={() => navigate('/admin/combo')} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ArrowLeft size={18} /> Quay lại</button>
        <button type="submit" className="btn btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saving ? <RotateCw size={18} className="animate-spin" /> : <Save size={18} />}
          {id ? 'Lưu thay đổi' : 'Tạo Combo'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Left: General Info & Product List */}
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="form-group">
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Tên gói Combo</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }} />
          </div>

          <div className="form-group">
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>Giá gói Combo (đ)</label>
            <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }} />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
            <h3 style={{ marginBottom: '20px' }}>Sản phẩm trong Combo</h3>
            
            {/* Tool to add products */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 100px auto', gap: '12px', alignItems: 'flex-end', marginBottom: '20px', background: 'var(--bg-secondary)', padding: '15px', borderRadius: '12px' }}>
              <SearchableSelect 
                label="Chọn sản phẩm"
                placeholder="Tìm tên sản phẩm..."
                options={productOptions}
                value={selectedProdName}
                onChange={setSelectedProdName}
              />
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontWeight: 600, fontSize: '0.8rem', display: 'block', marginBottom: '8px' }}>SL</label>
                <input type="number" value={selectedProdQty} min="1" onChange={e => setSelectedProdQty(Number(e.target.value))} style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }} />
              </div>
              <button type="button" onClick={addProductToCombo} className="btn btn-primary" style={{ height: '45px', padding: '0 20px' }}><Plus size={20} /></button>
            </div>

            {/* List of added products */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.products.map((p, idx) => (
                <div key={idx} style={{ padding: '12px 20px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ color: '#1890ff', fontWeight: 700 }}>x {p.quantity}</div>
                    <button type="button" onClick={() => removeProductFromCombo(idx)} style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', display: 'flex' }}><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
              {formData.products.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: '#8c8c8c', border: '1px dashed var(--border)', borderRadius: '10px' }}>Chưa có sản phẩm nào được chọn</div>}
            </div>
          </div>
        </div>

        {/* Right: Media */}
        <div className="admin-card">
          <label style={{ fontWeight: 600, display: 'block', marginBottom: '12px' }}>Ảnh Combo</label>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '1', border: '2px dashed var(--border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
            {previewMain ? <img src={previewMain} alt="Combo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={48} color="#8c8c8c" />}
            <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) { setImageFile(file); setPreviewMain(URL.createObjectURL(file)); } }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
          </div>
          <p style={{ marginTop: '12px', fontSize: '0.8rem', color: '#8c8c8c', textAlign: 'center' }}>Khuyên dùng ảnh vuông 1:1</p>
        </div>
      </div>
    </form>
  );
};

export default ComboForm;
