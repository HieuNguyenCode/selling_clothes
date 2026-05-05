import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {
    cartService,
    CartItemResponse,
    ShoppingCartItemUpdateDto,
    CartComboProductUpdateDto
} from '../services/cartService';
import { useUser } from './UserContext';
import { useToast } from './ToastContext';

interface AddToCartType extends ShoppingCartItemUpdateDto {
  price?: number;
  image?: string;
}

interface CartContextType {
  cart: CartItemResponse[];
  addToCart: (item: AddToCartType) => Promise<void>;
  updateCartItem: (id: string, item: {
      id: string;
      isCombo: boolean;
      name: string;
      price: number;
      image: string;
      size?: string;
      color?: string;
      quantity: number;
      products?: CartComboProductUpdateDto[]
  }) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  totalPrice: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'selling_clothes_cart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { showToast } = useToast();

  const getLocalCart = (): CartItemResponse[] => {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return localData ? JSON.parse(localData) : [];
  };

  const saveLocalCart = (newCart: CartItemResponse[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newCart));
    setCart(newCart);
  };

  const fetchCart = async () => {
    if (!user) {
      setCart(getLocalCart());
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.fetchCart();
      if (data && Array.isArray(data.shoppingCartItems)) {
        setCart(data.shoppingCartItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (item: AddToCartType) => {
    try {
      if (user) {
        await cartService.addItem(item);
        await fetchCart();
      } else {
        const localCart = getLocalCart();
        const existingItemIndex = localCart.findIndex(i => {
          if (i.isCombo !== item.isCombo || i.name !== item.name) return false;
          
          if (item.isCombo) {
            if (!i.products || !item.products || i.products.length !== item.products.length) return false;
            return i.products.every((p, idx) => 
              p.id === item.products[idx].id && 
              p.size === item.products[idx].size && 
              p.color === item.products[idx].color
            );
          } else {
            const productId = item.products[0]?.id;
            return i.size === item.size && 
                   i.color === item.color && 
                   i.products?.[0]?.id === productId;
          }
        });

        if (existingItemIndex > -1) {
          localCart[existingItemIndex].quantity += (item.quantity || 1);
        } else {
          const newItem: CartItemResponse = {
            id: Math.random().toString(36).substring(2, 15) + Date.now().toString(36),
            isCombo: item.isCombo,
            name: item.name,
            price: item.price || 0,
            image: item.image || (item.products[0]?.image) || '',
            size: item.size,
            color: item.color,
            quantity: item.quantity || 1,
            products: item.products
          };
          localCart.push(newItem);
        }
        saveLocalCart(localCart);
      }
      showToast(`Đã thêm ${item.name} vào giỏ hàng`, 'success');
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi thêm vào giỏ hàng', 'error');
      throw error;
    }
  };

  const updateCartItem = async (id: string, item: ShoppingCartItemUpdateDto) => {
    try {
      if (user) {
        await cartService.updateItem(id, item);
        await fetchCart();
      } else {
        const localCart = getLocalCart();
        const index = localCart.findIndex(i => i.id === id);
        if (index > -1) {
          localCart[index] = { 
            ...localCart[index], 
            quantity: item.quantity || localCart[index].quantity,
            size: item.size || localCart[index].size,
            color: item.color || localCart[index].color,
            products: item.products || localCart[index].products
          };
          saveLocalCart(localCart);
        }
      }
      showToast('Cập nhật giỏ hàng thành công', 'success');
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi cập nhật giỏ hàng', 'error');
      throw error;
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      if (user) {
        await cartService.removeItem(id);
        await fetchCart();
      } else {
        const localCart = getLocalCart();
        const newCart = localCart.filter(i => i.id !== id);
        saveLocalCart(newCart);
      }
      showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi xóa khỏi giỏ hàng', 'error');
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      if (user) {
        await cartService.clearAll();
        setCart([]);
      } else {
        saveLocalCart([]);
      }
      showToast('Đã làm trống giỏ hàng', 'info');
    } catch (error: any) {
      showToast(error.message || 'Lỗi khi làm trống giỏ hàng', 'error');
      throw error;
    }
  };

  const cartCount = (cart || []).reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalPrice = (cart || []).reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateCartItem,
      removeFromCart, 
      clearCart, 
      cartCount, 
      totalPrice,
      loading,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
