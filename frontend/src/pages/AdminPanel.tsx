import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useProducts } from '@/hooks/useProducts';
import { Plus, Send, Users, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: number;
  email: string;
  username: string;
}

const AdminPanel = () => {
  const { allRecommendations, fetchAllRecommendations, createRecommendation } = useRecommendations();
  const { products } = useProducts();
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    usuario_id: '',
    producto_id: '',
    mensaje: '',
  });

  const fetchUsers = async () => {
    try {
      // Note: This would need a proper admin endpoint in a real app
      // For now, we'll simulate with an empty list
      setUsers([]);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAllRecommendations();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.usuario_id || !formData.producto_id) return;

    try {
      await createRecommendation({
        usuario_id: parseInt(formData.usuario_id),
        producto_id: parseInt(formData.producto_id),
        mensaje: formData.mensaje,
      });
      setFormData({ usuario_id: '', producto_id: '', mensaje: '' });
      setShowCreateForm(false);
    } catch (error) {
      // Error handled in hook
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{allRecommendations.length} recomendaciones</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allRecommendations.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Recommendation Section */}
        <div className="mb-8">
          {!showCreateForm ? (
            <Button onClick={() => setShowCreateForm(true)} className="mb-6">
              <Plus className="h-4 w-4 mr-2" />
              Crear Nueva Recomendación
            </Button>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Crear Nueva Recomendación</CardTitle>
                <CardDescription>
                  Envía una recomendación personalizada a un usuario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="usuario_id">Usuario ID</Label>
                      <Input
                        id="usuario_id"
                        type="number"
                        value={formData.usuario_id}
                        onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
                        placeholder="Ej: 1"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        * En una app real, esto sería un selector de usuarios
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="producto_id">Producto</Label>
                      <select
                        id="producto_id"
                        value={formData.producto_id}
                        onChange={(e) => setFormData({ ...formData, producto_id: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                        required
                      >
                        <option value="">Seleccionar producto</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.nombre} - ${product.precio}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mensaje">Mensaje Personalizado</Label>
                    <textarea
                      id="mensaje"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      placeholder="Escribe un mensaje personalizado para el usuario..."
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button type="submit">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Recomendación
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendations List */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones Enviadas</CardTitle>
            <CardDescription>
              Historial de todas las recomendaciones enviadas a usuarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allRecommendations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No se han enviado recomendaciones aún.</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primera Recomendación
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {allRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{rec.nombre}</h4>
                        <p className="text-sm text-gray-600">
                          Para Usuario ID: {rec.usuario_id} • Por: {rec.admin_username}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        ${rec.precio.toFixed(2)}
                      </span>
                    </div>
                    {rec.mensaje && (
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        "{rec.mensaje}"
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Enviada el {new Date(rec.createdAt || '').toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPanel;