import {brandApi} from '../api/brandApi';

export interface Brand {
    id: string;
    name: string;
}

export const brandService = {
    fetchBrands: (search = null, page = null, pageSize = null) =>
        brandApi.getBrands(search, page, pageSize),

    addBrand: (name: string) =>
        brandApi.createBrand(name),

    updateBrand: (id: string, name: string) =>
        brandApi.updateBrand(id, name),

    deleteBrand: (id: string) =>
        brandApi.deleteBrand(id)
};
