import { useState, useEffect } from 'react';
import { Product } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch products');
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post('/products', productData);
      await fetchProducts(); // Refresh the list
      toast.success('Product created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create product';
      toast.error(message);
      throw error;
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      await fetchProducts(); // Refresh the list
      toast.success('Product updated successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update product';
      toast.error(message);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts(); // Refresh the list
      toast.success('Product deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete product';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};