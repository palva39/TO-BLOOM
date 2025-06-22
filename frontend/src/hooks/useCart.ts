import { useState, useEffect } from 'react';
import { Cart, CartItem } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setCart(response.data.carrito);
      setItems(response.data.items);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch cart');
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (producto_id: number, cantidad: number = 1) => {
    try {
      const response = await api.post('/cart/items', { producto_id, cantidad });
      setCart(response.data.carrito);
      setItems(response.data.items);
      toast.success('Product added to cart!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to add to cart';
      toast.error(message);
      throw err;
    }
  };

  const updateItemQuantity = async (itemId: number, cantidad: number) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { cantidad });
      setCart(response.data.carrito);
      setItems(response.data.items);
      toast.success('Cart updated!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update cart';
      toast.error(message);
      throw err;
    }
  };

  const removeFromCart = async (producto_id: number) => {
    try {
      const response = await api.delete(`/cart/items/${producto_id}`);
      setCart(response.data.carrito);
      setItems(response.data.items);
      toast.success('Product removed from cart!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to remove from cart';
      toast.error(message);
      throw err;
    }
  };

  const getCartItemCount = () => {
    return items.reduce((total, item) => total + item.cantidad, 0);
  };

  const getCartTotal = () => {
    return cart?.total || 0;
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    items,
    loading,
    error,
    fetchCart,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    getCartItemCount,
    getCartTotal,
  };
};