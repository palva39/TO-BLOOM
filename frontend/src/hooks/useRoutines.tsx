import { useState, useEffect } from 'react';
import { Routine } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useRoutines = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutines = async () => {
    try {
      const response = await api.get('/routines');
      setRoutines(response.data);
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error('Failed to fetch routines');
        console.error('Fetch routines error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const createRoutine = async (routineData: Omit<Routine, 'id' | 'usuario_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post('/routines', routineData);
      await fetchRoutines(); // Refresh the list
      toast.success('Routine created successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create routine';
      toast.error(message);
      throw error;
    }
  };

  const updateRoutine = async (id: number, routineData: Partial<Routine>) => {
    try {
      const response = await api.put(`/routines/${id}`, routineData);
      await fetchRoutines(); // Refresh the list
      toast.success('Routine updated successfully');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update routine';
      toast.error(message);
      throw error;
    }
  };

  const deleteRoutine = async (id: number) => {
    try {
      await api.delete(`/routines/${id}`);
      await fetchRoutines(); // Refresh the list
      toast.success('Routine deleted successfully');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete routine';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  return {
    routines,
    loading,
    fetchRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
  };
};