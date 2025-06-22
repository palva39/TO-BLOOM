import { useState, useEffect } from 'react';
import { Favorite } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch favorites');
        console.error('Fetch favorites error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: number) => {
    try {
      await api.post('/favorites', { productId });
      await fetchFavorites(); // Refresh the list
      toast.success('Added to favorites');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to add to favorites';
      toast.error(message);
      throw error;
    }
  };

  const removeFromFavorites = async (productId: number) => {
    try {
      await api.delete(`/favorites/${productId}`);
      await fetchFavorites(); // Refresh the list
      toast.success('Removed from favorites');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to remove from favorites';
      toast.error(message);
      throw error;
    }
  };

  const checkFavorite = async (productId: number) => {
    try {
      const response = await api.get(`/favorites/check/${productId}`);
      return response.data.isFavorite;
    } catch (error: any) {
      console.error('Check favorite error:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favorites,
    loading,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    checkFavorite,
  };
};