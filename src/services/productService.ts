import { productApi } from '../api/productApi';

export interface ProductList {
  id: string;
  name: string;
  price: number;
  priceSale: number | null;
  image: string;
}

export interface ProductDetail extends ProductList {
  images: string[];
  sizes: string[];
  colors: string[];
  typeName: string;
  companyName: string;
  description: string;
}

export const productService = {
  fetchProducts: async (search = ''): Promise<ProductList[]> => {
    try {
      const response = await productApi.getProducts(search);
      return response.data.status === 200 ? response.data.data : [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi lấy danh sách sản phẩm');
    }
  },

  fetchProductById: async (id: string): Promise<ProductDetail> => {
    try {
      const response = await productApi.getProductById(id);
      if (response.data.status === 200) return response.data.data;
      throw new Error(response.data.message);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi lấy chi tiết sản phẩm');
    }
  },

  handleSaveProduct: async (id: string | null, data: any): Promise<void> => {
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Description', data.description);
    formData.append('Price', data.price.toString());
    formData.append('TypeName', data.typeName);
    formData.append('CompanyName', data.companyName);
    
    // Append Lists (ASP.NET Core nhận diện list qua nhiều key cùng tên)
    data.sizes.forEach((s: string) => formData.append('Sizes', s));
    data.colors.forEach((c: string) => formData.append('Colors', c));

    // Append Files
    if (data.imageFile) formData.append('Image', data.imageFile);
    if (data.imageFiles) {
      data.imageFiles.forEach((file: File) => formData.append('Images', file));
    }

    try {
      const response = id 
        ? await productApi.updateProduct(id, formData)
        : await productApi.createProduct(formData);
      
      if (response.data.status !== 200 && response.data.status !== 201) {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi lưu sản phẩm');
    }
  },

  removeProduct: async (id: string): Promise<void> => {
    try {
      const response = await productApi.deleteProduct(id);
      if (response.data.status !== 200) throw new Error(response.data.message);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Lỗi xóa sản phẩm');
    }
  }
};
