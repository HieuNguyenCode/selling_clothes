import { paymentApi, ShoppingCartUpdateDto } from '../api/paymentApi';

export const paymentService = {
  createPayment: async (data: ShoppingCartUpdateDto) => {
    try {
      const res = await paymentApi.createPayment(data);
      // Backend thường trả về Result với status 200/201
      if (res.data.status === 200 || res.data.status === 201) {
        return res.data;
      }
      throw new Error(res.data.message || 'Thanh toán thất bại');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi kết nối server');
    }
  },

  getAllOrders: async (page = 1, pageSize = 10, status?: string) => {
    try {
      const res = await paymentApi.getAllOrders(page, pageSize, status);
      // Thông thường API trả về trực tiếp data hoặc bọc trong Result
      // Dựa trên controller C#, nó trả về Result(await ...)
      // Giả sử Result trả về { status, message, data }
      const responseData: any = res.data;
      if (responseData.status === 200) {
        return responseData.data; // Trả về PagedResult<OrderAdminResponseDto>
      }
      return responseData; // Nếu không bọc Result, trả về trực tiếp
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi khi lấy danh sách đơn hàng');
    }
  },

  updateOrderStatus: async (orderId: string, orderStatus: string, paymentStatus: string) => {
    try {
      const res = await paymentApi.updateOrderStatus(orderId, { orderStatus, paymentStatus });
      if (res.data.status === 200) {
        return res.data;
      }
      throw new Error(res.data.message || 'Cập nhật trạng thái thất bại');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi khi cập nhật trạng thái');
    }
  },

  getUserOrders: async (sessionId?: string, page = 1, pageSize = 10) => {
    try {
      const res = await paymentApi.getUserOrders(sessionId, page, pageSize);
      const responseData: any = res.data;
      if (responseData.status === 200) {
        return responseData.data;
      }
      return responseData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Lỗi khi lấy danh sách đơn hàng');
    }
  }
};
