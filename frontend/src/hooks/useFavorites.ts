import { useState, useEffect } from 'react';
import { Favorite } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      setFavorites(response.data.favoritos);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch favorites');
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (producto_id: number) => {
    try {
      await api.post('/favorites', { producto_id });
      fetchFavorites(); // Refresh the list
      toast.success('Added to favorites!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to add to favorites';
      toast.error(message);
      throw err;
    }
  };

  const removeFromFavorites = async (producto_id: number) => {
    try {
      await api.delete(`/favorites/${producto_id}`);
      setFavorites(prev => prev.filter(f => f.producto_id !== producto_id));
      toast.success('Removed from favorites!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to remove from favorites';
      toast.error(message);
      throw err;
    }
  };

  const checkIsFavorite = async (producto_id: number): Promise<boolean> => {
    try {
      const response = await api.get(`/favorites/check/${producto_id}`);
      return response.data.isFavorite;
    } catch (err: any) {
      return false;
    }
  };

  const isFavorite = (producto_id: number): boolean => {
    return favorites.some(f => f.producto_id === producto_id);
  };

  const toggleFavorite = async (producto_id: number) => {
    if (isFavorite(producto_id)) {
      await removeFromFavorites(producto_id);
    } else {
      await addToFavorites(producto_id);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite,
    isFavorite,
    toggleFavorite,
  };
};