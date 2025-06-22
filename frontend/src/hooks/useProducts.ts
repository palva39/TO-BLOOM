import { useState, useEffect } from 'react';
import { Product } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.products);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id: number): Promise<Product | null> => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.product;
    } catch (err: any) {
      toast.error('Failed to load product');
      return null;
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post('/products', productData);
      setProducts(prev => [response.data.product, ...prev]);
      toast.success('Product created successfully!');
      return response.data.product;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create product';
      toast.error(message);
      throw err;
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      setProducts(prev => prev.map(p => p.id === id ? response.data.product : p));
      toast.success('Product updated successfully!');
      return response.data.product;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update product';
      toast.error(message);
      throw err;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete product';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};