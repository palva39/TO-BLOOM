import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoutines } from '@/hooks/useRoutines';
import { Routine } from '@/types';
import { Plus, Edit, Trash2, Sparkles, Clock, Calendar } from 'lucide-react';

const Routines = () => {
  const { routines, createRoutine, updateRoutine, deleteRoutine, loading } = useRoutines();
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

    try {
      const pasosFiltered = formData.pasos.filter(paso => paso.trim() !== '');
      
      if (editingRoutine) {
        await updateRoutine(editingRoutine.id, {
          ...formData,
          pasos: pasosFiltered
        });
        setEditingRoutine(null);
      } else {
        await createRoutine({
          ...formData,
          pasos: pasosFiltered
        });
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
    setFormData({
      ...formData,
      pasos: [...formData.pasos, '']
    });
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      pasos: formData.pasos.filter((_, i) => i !== index)
    });
  };

  const updateStep = (index: number, value: string) => {
    const newPasos = [...formData.pasos];
    newPasos[index] = value;
    setFormData({
      ...formData,
      pasos: newPasos
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-600">Cargando rutinas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Mis Rutinas de Cuidado
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organiza tus actividades de bienestar y crea rutinas personalizadas
          </p>
        </div>

        {/* Create/Edit Form */}
        <div className="mb-8">
          {!showCreateForm ? (
            <div className="text-center">
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Rutina
              </Button>
            </div>
          ) : (
            <Card className="border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-900">
                  {editingRoutine ? 'Editar Rutina' : 'Nueva Rutina'}
                </CardTitle>
                <CardDescription>
                  {editingRoutine ? 'Modifica tu rutina existente' : 'Crea una nueva rutina de cuidado personalizada'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-purple-700">Nombre de la Rutina</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        required
                        className="border-purple-200 focus:border-purple-500"
                        placeholder="Ej: Rutina matutina de skincare"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipo" className="text-purple-700">Tipo de Rutina</Label>
                      <select
                        id="tipo"
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                        className="w-full px-3 py-2 border border-purple-200 rounded-md focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Seleccionar tipo</option>
                        <option value="skincare">Cuidado de la piel</option>
                        <option value="hair">Cuidado capilar</option>
                        <option value="body">Cuidado corporal</option>
                        <option value="wellness">Bienestar general</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-purple-700">Pasos de la Rutina</Label>
                    {formData.pasos.map((paso, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-sm text-purple-600 font-medium min-w-[2rem]">
                          {index + 1}.
                        </span>
                        <Input
                          value={paso}
                          onChange={(e) => updateStep(index, e.target.value)}
                          placeholder={`Paso ${index + 1}`}
                          className="flex-1 border-purple-200 focus:border-purple-500"
                        />
                        {formData.pasos.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addStep}
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Agregar Paso
                    </Button>
                  </div>

                  <div className="flex space-x-3">
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
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
          <Card className="text-center py-12 border-purple-100">
            <CardContent>
              <Sparkles className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aún no tienes rutinas
              </h3>
              <p className="text-gray-500 mb-6">
                Crea tu primera rutina de cuidado personalizada
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Rutina
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <Card key={routine.id} className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-purple-900 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                        {routine.nombre}
                      </CardTitle>
                      {routine.tipo && (
                        <CardDescription className="mt-1">
                          {routine.tipo === 'skincare' ? 'Cuidado de la piel' :
                           routine.tipo === 'hair' ? 'Cuidado capilar' :
                           routine.tipo === 'body' ? 'Cuidado corporal' :
                           routine.tipo === 'wellness' ? 'Bienestar general' : routine.tipo}
                        </CardDescription>
                      )}
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Creada el {new Date(routine.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit(routine)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteRoutine(routine.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Clock className="h-4 w-4 mr-1" />
                      {routine.pasos.length} pasos
                    </div>
                    <ol className="space-y-1">
                      {routine.pasos.slice(0, 3).map((paso, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-purple-600 font-medium mr-2 min-w-[1.5rem]">
                            {index + 1}.
                          </span>
                          <span className="line-clamp-1">{paso}</span>
                        </li>
                      ))}
                      {routine.pasos.length > 3 && (
                        <li className="text-sm text-gray-500 italic">
                          ... y {routine.pasos.length - 3} pasos más
                        </li>
                      )}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Routines;