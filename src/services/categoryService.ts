import { categoryApi } from '../api/categoryApi';

export interface Category {
  idtype: string;
  name: string;
}

export const categoryService = {
  fetchCategories: async (search = '', page = 1, pageSize = 10): Promise<Category[]> => {
    try {
      const response = await categoryApi.getCategories(search, page, pageSize);
      if (response.data.status === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Không thể lấy danh mục');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi kết nối API Danh mục');
    }
  },

  addCategory: async (name: string): Promise<void> => {
    try {
      const response = await categoryApi.createCategory(name);
      if (response.data.status !== 200 && response.data.status !== 201) {
        throw new Error(response.data.message || 'Lỗi khi tạo danh mục');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi kết nối API');
    }
  },

  updateCategory: async (id: string, name: string): Promise<void> => {
    try {
      const response = await categoryApi.updateCategory(id, name);
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Lỗi khi cập nhật danh mục');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi kết nối API');
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    try {
      const response = await categoryApi.deleteCategory(id);
      if (response.data.status !== 200) {
        throw new Error(response.data.message || 'Lỗi khi xóa danh mục');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi kết nối API');
    }
  }
};
