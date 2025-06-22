import { useState, useEffect } from 'react';
import { Cart, CartItem } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCart(response.data.cart);
      setItems(response.data.items);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch cart');
        console.error('Fetch cart error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, cantidad: number = 1) => {
    try {
      await api.post('/cart/items', { productId, cantidad });
      await fetchCart(); // Refresh cart
      toast.success('Item added to cart');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add item to cart';
      toast.error(message);
      throw error;
    }
  };

  const updateItemQuantity = async (itemId: number, cantidad: number) => {
    try {
      await api.put(`/cart/items/${itemId}`, { cantidad });
      await fetchCart(); // Refresh cart
      toast.success('Cart updated');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update cart';
      toast.error(message);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      await fetchCart(); // Refresh cart
      toast.success('Item removed from cart');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to remove item';
      toast.error(message);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      await fetchCart(); // Refresh cart
      toast.success('Cart cleared');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to clear cart';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    items,
    loading,
    fetchCart,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
  };
};