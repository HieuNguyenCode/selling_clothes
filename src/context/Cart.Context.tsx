import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { cartService, CartItemResponse, ShoppingCartItemUpdateDto } from '../services/cartService';
import { useUser } from './UserContext';

interface AddToCartType extends ShoppingCartItemUpdateDto {
  price?: number;
  image?: string;
}

interface CartContextType {
  cart: CartItemResponse[];
  addToCart: (item: AddToCartType) => Promise<void>;
  updateCartItem: (id: string, item: ShoppingCartItemUpdateDto) => Promise<void>;
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
    if (user) {
      try {
        await cartService.addItem(item);
        await fetchCart();
      } catch (error) {
        console.error('Failed to add to cart:', error);
        throw error;
      }
    } else {
      const localCart = getLocalCart();
      // Tìm xem đã có item tương tự chưa (cùng id sản phẩm/combo, size, color)
      const productId = item.products[0]?.id;
      const existingItemIndex = localCart.findIndex(i => 
        i.isCombo === item.isCombo && 
        i.name === item.name && 
        i.size === item.size && 
        i.color === item.color &&
        (item.isCombo ? true : i.products?.[0]?.id === productId)
      );

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
  };

  const updateCartItem = async (id: string, item: ShoppingCartItemUpdateDto) => {
    if (user) {
      try {
        await cartService.updateItem(id, item);
        await fetchCart();
      } catch (error) {
        console.error('Failed to update cart item:', error);
        throw error;
      }
    } else {
      const localCart = getLocalCart();
      const index = localCart.findIndex(i => i.id === id);
      if (index > -1) {
        localCart[index] = { 
          ...localCart[index], 
          quantity: item.quantity || localCart[index].quantity,
          size: item.size || localCart[index].size,
          color: item.color || localCart[index].color
        };
        saveLocalCart(localCart);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      try {
        await cartService.removeItem(id);
        await fetchCart();
      } catch (error) {
        console.error('Failed to remove from cart:', error);
        throw error;
      }
    } else {
      const localCart = getLocalCart();
      const newCart = localCart.filter(i => i.id !== id);
      saveLocalCart(newCart);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartService.clearAll();
        setCart([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        throw error;
      }
    } else {
      saveLocalCart([]);
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
