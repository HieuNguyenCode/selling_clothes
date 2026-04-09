import axiosInstance from '../utils/Axios.Config';

export interface Sale {
    id: string;
    name: string;
}

export interface SaleProduct {
    id: string;
    name: string;
    image: string;
    price: number;
    startDate: string;
    endDate: string | null;
}

export interface SaleCombo {
    id: string;
    name: string;
    image: string;
    price: number;
    startDate: string;
    endDate: string | null;
}

export interface SaleDetail extends Sale {
    saleProducts: SaleProduct[];
    saleCombos: SaleCombo[];
}

export interface SaleRequestItem {
  name: string;
  price: number;
  startDate: string;
  endDate: string | null; // Đổi từ dateTime sang endDate và cho phép null
}
export interface SaleRequest {
    name: string;
    saleProducts: SaleRequestItem[];
    saleCombos: SaleRequestItem[];
}

export interface SaleResponse {
    data: Sale[];
    pageSize: number;
    pageNumber: number;
    totalCount: number;
    totalPages: number;
    status: number;
    message: string;
}

export const saleService = {
    fetchSales: async (search: string = '', page: number = 1, pageSize: number = 10): Promise<SaleResponse> => {
        const response = await axiosInstance.get(`/api/v1/Sale?search=${search}&page=${page}&pageSize=${pageSize}`);
        return response.data;
    },

    getSaleDetail: async (id: string): Promise<{ data: SaleDetail; status: number; message: string }> => {
        const response = await axiosInstance.get(`/api/v1/Sale/${id}`);
        return response.data;
    },

    addSale: async (data: SaleRequest) => {
        const response = await axiosInstance.post('/api/v1/Sale', data);
        return response.data;
    },

    updateSale: async (id: string, data: SaleRequest) => {
        const response = await axiosInstance.put(`/api/v1/Sale/${id}`, data);
        return response.data;
    },

    deleteSale: async (id: string) => {
        const response = await axiosInstance.delete(`/api/v1/Sale/${id}`);
        return response.data;
    }
};
