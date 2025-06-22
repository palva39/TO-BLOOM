import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useRoutines } from '@/hooks/useRoutines';
import { useRecommendations } from '@/hooks/useRecommendations';
import { 
  LogOut, 
  User, 
  ShoppingBag, 
  Heart, 
  Calendar, 
  Star,
  MessageSquare,
  Settings,
  ShoppingCart
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const { favorites } = useFavorites();
  const { routines } = useRoutines();
  const { recommendations } = useRecommendations();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // Error handled in auth hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-green-600">🌸 Florecer</h1>
              <span className="ml-4 text-gray-600">Tu plataforma de bienestar personal</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>{user?.username}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido de vuelta, {user?.username}! 🌟
          </h2>
          <p className="text-gray-600">
            Tu viaje hacia el bienestar personal continúa. Explora productos, gestiona tus rutinas y descubre nuevas recomendaciones.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100">Favoritos</p>
                  <p className="text-2xl font-bold">{favorites.length}</p>
                </div>
                <Heart className="h-8 w-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Carrito</p>
                  <p className="text-2xl font-bold">{getCartItemCount()}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Rutinas</p>
                  <p className="text-2xl font-bold">{routines.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Recomendaciones</p>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                </div>
                <Star className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/products">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-green-600" />
                  Explorar Productos
                </CardTitle>
                <CardDescription>
                  Descubre productos de belleza, nutrición y cuidado personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Navega por nuestro catálogo de productos naturales y orgánicos para tu bienestar.
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/cart">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
                  Mi Carrito
                </CardTitle>
                <CardDescription>
                  Gestiona tus productos seleccionados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {getCartItemCount() > 0 
                    ? `Tienes ${getCartItemCount()} productos en tu carrito.`
                    : 'Tu carrito está vacío. ¡Agrega algunos productos!'
                  }
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/routines">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Mis Rutinas
                </CardTitle>
                <CardDescription>
                  Crea y gestiona tus rutinas de cuidado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {routines.length > 0 
                    ? `Tienes ${routines.length} rutinas creadas.`
                    : 'Crea tu primera rutina de cuidado personal.'
                  }
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/favorites">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-pink-600" />
                  Mis Favoritos
                </CardTitle>
                <CardDescription>
                  Accede a tus productos favoritos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {favorites.length > 0 
                    ? `Tienes ${favorites.length} productos marcados como favoritos.`
                    : 'Marca productos como favoritos para acceso rápido.'
                  }
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/community">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-orange-600" />
                  Comunidad
                </CardTitle>
                <CardDescription>
                  Comparte experiencias y consejos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Conecta con otros usuarios y comparte tu viaje de bienestar.
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/admin">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-gray-600" />
                  Panel Admin
                </CardTitle>
                <CardDescription>
                  Gestionar recomendaciones (Admin)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Acceso al panel de administración para enviar recomendaciones.
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Recent Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Recomendaciones Recientes
              </CardTitle>
              <CardDescription>
                Productos recomendados especialmente para ti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{rec.nombre}</h4>
                      <p className="text-sm text-gray-600">Recomendado por {rec.admin_username}</p>
                      {rec.mensaje && (
                        <p className="text-sm text-gray-700 italic">"{rec.mensaje}"</p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">
                        ${rec.precio.toFixed(2)}
                      </span>
                      <div className="mt-2">
                        <Button size="sm">Ver Producto</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivational Message */}
        <Card className="bg-gradient-to-r from-green-100 to-blue-100">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Tu bienestar es nuestra prioridad! 🌟
            </h3>
            <p className="text-gray-600">
              Cada pequeño paso hacia el cuidado personal es un gran avance. Continúa explorando, aprendiendo y floreciendo.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;