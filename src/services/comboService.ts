import { comboApi } from '../api/comboApi';

export interface ComboProduct {
  id: string;
  name: string;
  image: string;
  quantity: number;
  size: string[];
  color: string[];
}

export interface ComboDetail {
  id: string;
  name: string;
  price: number;
  priceSale: number | null;
  image: string;
  products: ComboProduct[];
}

export const comboService = {
  fetchCombos: (search = '', page = 1, pageSize = 10) => 
    comboApi.getCombos(search, page, pageSize),

  fetchComboById: async (id: string): Promise<ComboDetail> => {
    const res = await comboApi.getComboById(id);
    return res.data; // Bóc tách trường .data
  },

  handleSaveCombo: async (id: string | null, data: any): Promise<void> => {
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Price', data.price.toString());
    
    // Đóng gói danh sách sản phẩm (ASP.NET Core chuẩn: ListProducts[0].Name)
    if (data.products && data.products.length > 0) {
      data.products.forEach((prod: any, index: number) => {
        formData.append(`ListProducts[${index}].Name`, prod.name);
        formData.append(`ListProducts[${index}].Quantity`, prod.quantity.toString());
      });
    }
    
    if (data.imageFile) {
      formData.append('Image', data.imageFile);
    }

    return comboApi.saveCombo(id, formData);
  },

  removeCombo: (id: string) => 
    comboApi.deleteCombo(id),

  changePublishStatus: (id: string) =>
    comboApi.togglePublish(id)
};
