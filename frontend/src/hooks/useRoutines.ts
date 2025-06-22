import { useState, useEffect } from 'react';
import { Routine } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const useRoutines = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutines = async () => {
    try {
      setLoading(true);
      const response = await api.get('/routines');
      setRoutines(response.data.rutinas);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch routines');
      toast.error('Failed to load routines');
    } finally {
      setLoading(false);
    }
  };

  const getRoutine = async (id: number): Promise<Routine | null> => {
    try {
      const response = await api.get(`/routines/${id}`);
      return response.data.rutina;
    } catch (err: any) {
      toast.error('Failed to load routine');
      return null;
    }
  };

  const createRoutine = async (routineData: { nombre: string; tipo?: string; pasos: string[] }) => {
    try {
      const response = await api.post('/routines', routineData);
      setRoutines(prev => [response.data.rutina, ...prev]);
      toast.success('Routine created successfully!');
      return response.data.rutina;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to create routine';
      toast.error(message);
      throw err;
    }
  };

  const updateRoutine = async (id: number, routineData: { nombre?: string; tipo?: string; pasos?: string[] }) => {
    try {
      const response = await api.put(`/routines/${id}`, routineData);
      setRoutines(prev => prev.map(r => r.id === id ? response.data.rutina : r));
      toast.success('Routine updated successfully!');
      return response.data.rutina;
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update routine';
      toast.error(message);
      throw err;
    }
  };

  const deleteRoutine = async (id: number) => {
    try {
      await api.delete(`/routines/${id}`);
      setRoutines(prev => prev.filter(r => r.id !== id));
      toast.success('Routine deleted successfully!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to delete routine';
      toast.error(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchRoutines();
  }, []);

  return {
    routines,
    loading,
    error,
    fetchRoutines,
    getRoutine,
    createRoutine,
    updateRoutine,
    deleteRoutine,
  };
};