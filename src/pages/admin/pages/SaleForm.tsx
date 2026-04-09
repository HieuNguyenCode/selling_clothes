import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saleService, SaleRequestItem } from '../../../services/saleService';
import { productService, ProductList } from '../../../services/productService';
import { comboService } from '../../../services/comboService';
import { Percent, Check, RotateCw, ArrowLeft, Plus, Trash2, Package, Layers } from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import AdminButton from '../components/AdminButton';
import AdminFormInput from '../components/AdminFormInput';
import SearchableSelect from '../../../components/common/SearchableSelect';
import { useToast } from '../../../context/ToastContext';

interface SaleItemWithId extends SaleRequestItem {
  id: string; // ID để tracking local
}

const SaleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Data for Select
  const [productList, setProductList] = useState<ProductList[]>([]);
  const [comboList, setComboList] = useState<any[]>([]);

  // Form State
  const [name, setName] = useState('');
  const [saleProducts, setSaleProducts] = useState<SaleItemWithId[]>([]);
  const [saleCombos, setSaleCombos] = useState<SaleItemWithId[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, combosRes] = await Promise.all([
          productService.fetchProducts('', 1, 1000),
          comboService.fetchCombos('', 1, 1000)
        ]);
        setProductList(productsRes.data || []);
        setComboList(combosRes.data || []);

        if (id) {
          const res = await saleService.getSaleDetail(id);
          const data = res.data;
          setName(data.name);
          setSaleProducts(data.saleProducts.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            startDate: p.startDate ? p.startDate.split('T')[0] : '',
            endDate: p.endDate ? p.endDate.split('T')[0] : ''
          })));
          setSaleCombos(data.saleCombos.map(c => ({
            id: c.id,
            name: c.name,
            price: c.price,
            startDate: c.startDate ? c.startDate.split('T')[0] : '',
            endDate: c.endDate ? c.endDate.split('T')[0] : ''
          })));
        }
      } catch (error: any) {
        showToast(error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, showToast]);

  const addProductItem = () => {
    setSaleProducts([...saleProducts, { id: '', name: '', price: 0, startDate: '', endDate: '' }]);
  };

  const addComboItem = () => {
    setSaleCombos([...saleCombos, { id: '', name: '', price: 0, startDate: '', endDate: '' }]);
  };

  const removeItem = (type: 'product' | 'combo', index: number) => {
    if (type === 'product') {
      setSaleProducts(saleProducts.filter((_, i) => i !== index));
    } else {
      setSaleCombos(saleCombos.filter((_, i) => i !== index));
    }
  };

  const updateItem = (type: 'product' | 'combo', index: number, field: keyof SaleItemWithId, value: any) => {
    const list = type === 'product' ? [...saleProducts] : [...saleCombos];
    
    if (field === 'id') {
      const selectedSource = type === 'product' ? productList : comboList;
      const item = selectedSource.find(s => s.id === value);
      if (item) {
        list[index].name = item.name;
        list[index].price = item.priceSale || item.price;
      }
    }
    
    list[index] = { ...list[index], [field]: value };
    
    if (type === 'product') setSaleProducts(list);
    else setSaleCombos(list);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showToast("Vui lòng nhập tên sự kiện", "error");

    setSaveLoading(true);
    try {
      const cleanProducts = saleProducts
        .filter(p => p.name && p.startDate)
        .map(({ id, ...rest }) => ({
          ...rest,
          endDate: rest.endDate || null // Gửi null nếu trống
        }));
        
      const cleanCombos = saleCombos
        .filter(c => c.name && c.startDate)
        .map(({ id, ...rest }) => ({
          ...rest,
          endDate: rest.endDate || null // Gửi null nếu trống
        }));

      const requestBody = {
        name,
        saleProducts: cleanProducts,
        saleCombos: cleanCombos
      };

      if (id) {
        await saleService.updateSale(id, requestBody);
        showToast("Cập nhật sự kiện sale thành công!");
      } else {
        await saleService.addSale(requestBody);
        showToast("Thêm sự kiện sale mới thành công!");
      }
      navigate('/admin/sale');
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <RotateCw size={40} className="animate-spin" color="#1890ff" />
      </div>
    );
  }

  return (
    <div className="admin-card">
      <AdminHeader 
        title={id ? "Chỉnh sửa Sự kiện" : "Thêm Sự kiện Sale"}
        icon={Percent}
        onRefresh={() => {}}
        actionButton={{
          label: "Quay lại",
          icon: ArrowLeft,
          onClick: () => navigate('/admin/sale')
        }}
      />

      <form onSubmit={handleSubmit} style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #f0f0f0', marginBottom: '30px' }}>
          <AdminFormInput 
            label="Tên Sự kiện khuyến mãi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Sale mùa hè 2026..."
            required
            style={{ fontSize: '1.1rem', fontWeight: 600 }}
          />
        </div>

        {/* SALE PRODUCTS */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              <Package size={22} color="#1890ff" /> Sản phẩm tham gia Sale
            </h3>
            <AdminButton type="button" variant="ghost" icon={Plus} onClick={addProductItem}>Thêm sản phẩm</AdminButton>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {saleProducts.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 50px', gap: '15px', padding: '20px', background: '#fafafa', borderRadius: '10px', border: '1px solid #f0f0f0', alignItems: 'flex-end' }}>
                <SearchableSelect 
                  label="Chọn sản phẩm"
                  options={productList.map(p => ({ value: p.id, label: p.name }))}
                  value={item.id}
                  onChange={(val) => updateItem('product', index, 'id', val)}
                  placeholder="Tìm sản phẩm..."
                />
                <AdminFormInput 
                  label="Giá Sale (VNĐ)"
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem('product', index, 'price', Number(e.target.value))}
                  containerStyle={{ marginBottom: 0 }}
                />
                <AdminFormInput 
                  label="Ngày bắt đầu"
                  type="date"
                  value={item.startDate}
                  onChange={(e) => updateItem('product', index, 'startDate', e.target.value)}
                  containerStyle={{ marginBottom: 0 }}
                  required
                />
                <AdminFormInput 
                  label="Ngày kết thúc (Có thể để trống)"
                  type="date"
                  value={item.endDate || ''}
                  onChange={(e) => updateItem('product', index, 'endDate', e.target.value)}
                  containerStyle={{ marginBottom: 0 }}
                />
                <AdminButton 
                  variant="icon" 
                  type="button" 
                  onClick={() => removeItem('product', index)}
                  icon={Trash2}
                  style={{ color: '#ff4d4f', background: '#fff1f0', height: '45px' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SALE COMBOS */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem' }}>
              <Layers size={22} color="#722ed1" /> Combo tham gia Sale
            </h3>
            <AdminButton type="button" variant="ghost" icon={Plus} onClick={addComboItem} style={{ color: '#722ed1', borderColor: '#722ed1' }}>Thêm Combo</AdminButton>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {saleCombos.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1.5fr 50px', gap: '15px', padding: '20px', background: '#fafafa', borderRadius: '10px', border: '1px solid #f0f0f0', alignItems: 'flex-end' }}>
                <SearchableSelect 
                  label="Chọn Combo"
                  options={comboList.map(c => ({ value: c.id, label: c.name }))}
                  value={item.id}
                  onChange={(val) => updateItem('combo', index, 'id', val)}
                  placeholder="Tìm combo..."
                />
                <AdminFormInput 
                  label="Giá Sale (VNĐ)"
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem('combo', index, 'price', Number(e.target.value))}
                  containerStyle={{ marginBottom: 0 }}
                />
                <AdminFormInput 
                  label="Ngày bắt đầu"
                  type="date"
                  value={item.startDate}
                  onChange={(e) => updateItem('combo', index, 'startDate', e.target.value)}
                  containerStyle={{ marginBottom: 0 }}
                  required
                />
                <AdminFormInput 
                  label="Ngày kết thúc (Có thể để trống)"
                  type="date"
                  value={item.endDate || ''}
                  onChange={(e) => updateItem('combo', index, 'endDate', e.target.value)}
                  containerStyle={{ marginBottom: 0 }}
                />
                <AdminButton 
                  variant="icon" 
                  type="button" 
                  onClick={() => removeItem('combo', index)}
                  icon={Trash2}
                  style={{ color: '#ff4d4f', background: '#fff1f0', height: '45px' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px', marginTop: '50px', padding: '30px 0', borderTop: '1px solid #f0f0f0' }}>
          <AdminButton type="button" variant="secondary" onClick={() => navigate('/admin/sale')} style={{ padding: '12px 40px' }}>Hủy bỏ</AdminButton>
          <AdminButton 
            type="submit" 
            icon={Check} 
            loading={saveLoading} 
            loadingIcon={RotateCw}
            style={{ padding: '12px 60px' }}
          >
            {id ? 'Lưu thay đổi' : 'Tạo sự kiện Sale'}
          </AdminButton>
        </div>
      </form>
    </div>
  );
};

export default SaleForm;
