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
    return cartApi.addToCart(item);
  },

  updateItem: async (id: string, item: ShoppingCartItemUpdateDto): Promise<void> => {
    return cartApi.updateCartItem(id, item);
  },

  removeItem: async (id: string): Promise<void> => {
    return cartApi.removeFromCart(id);
  },

  clearAll: async (): Promise<void> => {
    return cartApi.clearCart();
  }
};
