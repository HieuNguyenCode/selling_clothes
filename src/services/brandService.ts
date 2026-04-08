import { brandApi } from '../api/brandApi';

export interface Brand {
  id: string;
  name: string;
}

export const brandService = {
  fetchBrands: async (search = '', page = 1, pageSize = 10): Promise<Brand[]> => {
    try {
      const response = await brandApi.getBrands(search, page, pageSize);
      if (response.data.status === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Không thể lấy danh sách hãng');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi kết nối API Hãng');
    }
  },

  addBrand: async (name: string): Promise<void> => {
    try {
      const response = await brandApi.createBrand(name);
      if (response.data.status !== 200 && response.data.status !== 201) {
        throw new Error(response.data.message || 'Lỗi khi tạo mới hãng');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi kết nối API');
    }
  },

  updateBrand: async (id: string, name: string): Promise<void> => {
    try {
      const response = await brandApi.updateBrand(id, name);
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Lỗi khi cập nhật hãng');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi kết nối API');
    }
  },

  deleteBrand: async (id: string): Promise<void> => {
    try {
      const response = await brandApi.deleteBrand(id);
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Lỗi khi xóa hãng');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi kết nối API');
    }
  }
};
