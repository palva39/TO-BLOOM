import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoutines } from '@/hooks/useRoutines';
import { Plus, Edit, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { Routine } from '@/types';

const Routines = () => {
  const { routines, loading, createRoutine, updateRoutine, deleteRoutine } = useRoutines();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    pasos: [''],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) return;

    const routineData = {
      nombre: formData.nombre,
      tipo: formData.tipo,
      pasos: formData.pasos.filter(paso => paso.trim() !== ''),
    };

    try {
      if (editingRoutine) {
        await updateRoutine(editingRoutine.id, routineData);
        setEditingRoutine(null);
      } else {
        await createRoutine(routineData);
        setShowCreateForm(false);
      }
      setFormData({ nombre: '', tipo: '', pasos: [''] });
    } catch (error) {
      // Error handled in hooks
    }
  };

  const handleEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setFormData({
      nombre: routine.nombre,
      tipo: routine.tipo || '',
      pasos: routine.pasos.length > 0 ? routine.pasos : [''],
    });
    setShowCreateForm(true);
  };

  const handleCancelEdit = () => {
    setEditingRoutine(null);
    setShowCreateForm(false);
    setFormData({ nombre: '', tipo: '', pasos: [''] });
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      pasos: [...prev.pasos, '']
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      pasos: prev.pasos.map((paso, i) => i === index ? value : paso)
    }));
  };

  const removeStep = (index: number) => {
    if (formData.pasos.length > 1) {
      setFormData(prev => ({
        ...prev,
        pasos: prev.pasos.filter((_, i) => i !== index)
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando rutinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Mis Rutinas de Cuidado</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{routines.length} rutinas</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Routine Section */}
        <div className="mb-8">
          {!showCreateForm ? (
            <Button onClick={() => setShowCreateForm(true)} className="mb-6">
              <Plus className="h-4 w-4 mr-2" />
              Crear Nueva Rutina
            </Button>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingRoutine ? 'Editar Rutina' : 'Crear Nueva Rutina'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre de la Rutina</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: Rutina Matutina de Cuidado Facial"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <select
                        id="tipo"
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="Mañana">Mañana</option>
                        <option value="Noche">Noche</option>
                        <option value="Ejercicio">Ejercicio</option>
                        <option value="Nutrición">Nutrición</option>
                        <option value="Relajación">Relajación</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pasos de la Rutina</Label>
                    {formData.pasos.map((paso, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={paso}
                          onChange={(e) => updateStep(index, e.target.value)}
                          placeholder={`Paso ${index + 1}`}
                          className="flex-1"
                        />
                        {formData.pasos.length > 1 && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => removeStep(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addStep}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Paso
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {editingRoutine ? 'Actualizar Rutina' : 'Crear Rutina'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Routines List */}
        {routines.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">No tienes rutinas creadas aún.</p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Tu Primera Rutina
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <Card key={routine.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{routine.nombre}</CardTitle>
                      <CardDescription>
                        {routine.tipo && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {routine.tipo}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(routine)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => deleteRoutine(routine.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-700">Pasos:</h4>
                    {routine.pasos.map((paso, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{paso}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Creada el {new Date(routine.createdAt || '').toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Routines;