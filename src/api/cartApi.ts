import axiosInstance from '../utils/Axios.Config';

const handleResponse = (res: any) => {
  if (res.data.status === 200 || res.data.status === 201) return res.data;
  throw new Error(res.data.message || 'Lỗi hệ thống');
};

export const cartApi = {
  getCart: () => 
    axiosInstance.get('/api/v1/ShoppingCart').then(handleResponse),

  addToCart: (item: any) => 
    axiosInstance.post('/api/v1/ShoppingCart', item).then(handleResponse),

  updateCartItem: (id: string, item: any) => 
    axiosInstance.put(`/api/v1/ShoppingCart/${id}`, item).then(handleResponse),

  removeFromCart: (id: string) => 
    axiosInstance.delete(`/api/v1/ShoppingCart/${id}`).then(handleResponse),

  clearCart: () => 
    axiosInstance.delete('/api/v1/ShoppingCart').then(handleResponse)
};
