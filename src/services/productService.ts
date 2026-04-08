import { productApi } from '../api/productApi';

export interface ProductList {
  id: string;
  name: string;
  price: number;
  priceSale: number | null;
  image: string;
  isPublished: boolean; // Thêm trường này
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
  fetchProducts: async (search = '', page = 1, pageSize = 50) => {
    return productApi.getProducts(search, page, pageSize);
  },

  fetchProductById: async (id: string) => {
    const res = await productApi.getProductById(id);
    return res.data;
  },

  handleSaveProduct: async (id: string | null, data: any): Promise<void> => {
    const formData = new FormData();
    formData.append('Name', data.name);
    formData.append('Description', data.description);
    formData.append('Price', data.price.toString());
    formData.append('TypeName', data.typeName);
    formData.append('CompanyName', data.companyName);
    
    if (data.sizes) data.sizes.forEach((s: string) => formData.append('Sizes', s));
    if (data.colors) data.colors.forEach((c: string) => formData.append('Colors', c));

    if (data.imageFile) formData.append('Image', data.imageFile);
    if (data.imageFiles) {
      data.imageFiles.forEach((file: File) => formData.append('Images', file));
    }

    return productApi.saveProduct(id, formData);
  },

  removeProduct: (id: string) => 
    productApi.deleteProduct(id),

  // Hàm mới để đổi trạng thái hiển thị
  changePublishStatus: (id: string) =>
    productApi.togglePublish(id)
};
