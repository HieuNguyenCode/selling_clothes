import {categoryApi} from '../api/categoryApi';

export interface Category {
    idtype: string;
    name: string;
}

export const categoryService = {
    fetchCategories: (search = null, page = null, pageSize = null) =>
        categoryApi.getCategories(search, page, pageSize),

    addCategory: (name: string) =>
        categoryApi.createCategory(name),

    updateCategory: (id: string, name: string) =>
        categoryApi.updateCategory(id, name),

    deleteCategory: (id: string) =>
        categoryApi.deleteCategory(id)
};
