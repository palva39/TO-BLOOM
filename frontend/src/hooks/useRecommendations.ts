import { useState, useEffect } from 'react';
import { Recommendation } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [allRecommendations, setAllRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/recommendations');
      setRecommendations(response.data.recomendaciones);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch recommendations');
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllRecommendations = async () => {
    try {
      const response = await api.get('/recommendations/all');
      setAllRecommendations(response.data.recomendaciones);
    } catch (err: any) {
      toast.error('Failed to load all recommendations');
    }
  };

  const createRecommendation = async (recommendationData: {
    usuario_id: number;
    producto_id: number;
    mensaje?: string;
  }) => {
    try {
      const response = await api.post('/recommendations', recommendationData);
      toast.success('Recommendation created successfully!');
      fetchAllRecommendations(); // Refresh admin list
      return response.data.recomendacion;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create recommendation';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return {
    recommendations,
    allRecommendations,
    loading,
    error,
    fetchRecommendations,
    fetchAllRecommendations,
    createRecommendation,
  };
};