import axiosInstance from '../utils/Axios.Config';

export interface CartComboProductUpdateDto {
  id: string;
  name: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface ShoppingCartItemUpdateDto {
  isCombo: boolean;
  name: string;
  size?: string;
  color?: string;
  quantity: number;
  products: CartComboProductUpdateDto[];
}

export interface ShoppingCartUpdateDto {
  customerName: string;
  phoneNumber: string;
  shippingAddress: string;
  paymentMethod: string;
  session?: string;
  shoppingCart: ShoppingCartItemUpdateDto[];
}

export interface OrderDetailComboItemDto {
  productName: string;
  sizeName?: string;
  colorName?: string;
  quantity: number;
}

export interface OrderDetailAdminDto {
  itemName: string;
  itemType: string; // "Product" hoặc "Combo"
  sizeName?: string;
  colorName?: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  comboItems?: OrderDetailComboItemDto[] | null;
}

export interface OrderAdminResponseDto {
  idorder: string;
  iduser?: string;
  customerName: string;
  phoneNumber: string;
  shippingAddress: string;
  totalPrice: number;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  createAt: string;
  items: OrderDetailAdminDto[];
}

export interface PagedResult<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

export interface OrderStatusUpdateDto {
  orderStatus?: string;
  paymentStatus?: string;
}

export interface TopSellingItem {
  id: string;
  name: string;
  type: string;
  totalSold: number;
  revenue: number;
  image: string;
}

export interface DashboardStats {
  totalRevenue: number;
  newOrdersCount: number;
  totalCustomers: number;
  revenueGrowth: number;
  topSellingItems: TopSellingItem[];
  recentOrders: OrderAdminResponseDto[];
}

export const paymentApi = {
  createPayment: (data: ShoppingCartUpdateDto) =>
    axiosInstance.post('/api/v1/Payment', data),

  getAllOrders: (page = 1, pageSize = 10, status?: string) =>
    axiosInstance.get<PagedResult<OrderAdminResponseDto>>('/api/v1/Payment/Admin/Orders', {
      params: { page, pageSize, status }
    }),

  getDashboard: () =>
    axiosInstance.get<DashboardStats>('/api/v1/Payment/admin/dashboard'),

  getUserOrders: (sessionId?: string, page = 1, pageSize = 10) =>
    axiosInstance.get<PagedResult<OrderAdminResponseDto>>('/api/v1/Payment/user/orders', {
      params: { sessionId, page, pageSize }
    }),

  updateOrderStatus: (orderId: string, data: OrderStatusUpdateDto) =>
    axiosInstance.patch(`/api/v1/Payment/admin/orders/${orderId}/status`, data),
};
