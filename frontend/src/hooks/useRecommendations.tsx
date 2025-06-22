import { useState, useEffect } from 'react';
import { Recommendation } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/recommendations');
      setRecommendations(response.data);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch recommendations');
        console.error('Fetch recommendations error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const createRecommendation = async (data: { usuarioId: number; productoId: number; mensaje?: string }) => {
    try {
      const response = await api.post('/recommendations', data);
      await fetchRecommendations(); // Refresh the list
      toast.success('Recommendation sent successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create recommendation';
      toast.error(message);
      throw error;
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/recommendations/${id}/read`);
      await fetchRecommendations(); // Refresh the list
      toast.success('Recommendation marked as read');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to mark as read';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,
    loading,
    fetchRecommendations,
    createRecommendation,
    markAsRead,
  };
};