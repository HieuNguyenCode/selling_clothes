import { cartApi } from '../api/cartApi';

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
  quantity?: number;
  products: CartComboProductUpdateDto[];
}

export interface CartItemResponse {
  id: string;
  isCombo: boolean;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  products?: CartComboProductUpdateDto[];
}

export interface ShoppingCartResponse {
  shoppingCartItems: CartItemResponse[];
  totalPrice: number;
}

export const cartService = {
  fetchCart: async (): Promise<ShoppingCartResponse> => {
    const res = await cartApi.getCart();
    const data = res.data;
    
    // Đảm bảo mỗi item có flag isCombo dựa trên sự hiện diện của products
    if (data && data.shoppingCartItems) {
      data.shoppingCartItems = data.shoppingCartItems.map((item: any) => ({
        ...item,
        isCombo: item.isCombo ?? (item.products && item.products.length > 0)
      }));
    }
    
    return data;
  },

  addItem: async (item: ShoppingCartItemUpdateDto): Promise<void> => {
    const payload = {
      isCombo: String(item.isCombo) === 'true',
      name: String(item.name || ''),
      size: String(item.size || ''),
      color: String(item.color || ''),
      quantity: Number(item.quantity || 1),
      products: (item.products || []).map(p => ({
        id: String(p.id || ''),
        name: String(p.name || ''),
        image: String(p.image || ''),
        size: String(p.size || ''),
        color: String(p.color || ''),
        quantity: Number(p.quantity || 1)
      }))
    };
    return cartApi.addToCart(payload);
  },

  updateItem: async (id: string, item: ShoppingCartItemUpdateDto): Promise<void> => {
    const payload = {
      isCombo: String(item.isCombo) === 'true',
      name: String(item.name || ''),
      size: String(item.size || ''),
      color: String(item.color || ''),
      quantity: Number(item.quantity || 1),
      products: (item.products || []).map(p => ({
        id: String(p.id || ''),
        name: String(p.name || ''),
        image: String(p.image || ''),
        size: String(p.size || ''),
        color: String(p.color || ''),
        quantity: Number(p.quantity || 1)
      }))
    };
    return cartApi.updateCartItem(id, payload);
  },

  removeItem: async (id: string): Promise<void> => {
    return cartApi.removeFromCart(id);
  },

  clearAll: async (): Promise<void> => {
    return cartApi.clearCart();
  }
};
