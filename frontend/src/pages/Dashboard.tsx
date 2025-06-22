import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useRoutines } from '@/hooks/useRoutines';
import { useRecommendations } from '@/hooks/useRecommendations';
import { LogOut, User, ShoppingCart, Heart, Sparkles, MessageSquare, Leaf } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { cart, items } = useCart();
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

  const unreadRecommendations = recommendations.filter(r => !r.leida);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-purple-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Panel Florecer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-purple-700">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.username}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-purple-200 text-purple-700 hover:bg-purple-50">
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-900 mb-2">
            ¡Bienvenida de vuelta, {user?.username}!
          </h2>
          <p className="text-lg text-gray-600">
            Continúa tu jornada de bienestar y belleza
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Mi Carrito</CardTitle>
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{items.length}</div>
              <p className="text-xs text-gray-600">
                Total: ${cart?.total?.toFixed(2) || '0.00'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Favoritos</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{favorites.length}</div>
              <p className="text-xs text-gray-600">productos guardados</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Rutinas</CardTitle>
              <Sparkles className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{routines.length}</div>
              <p className="text-xs text-gray-600">rutinas creadas</p>
            </CardContent>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Recomendaciones</CardTitle>
              <MessageSquare className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{unreadRecommendations.length}</div>
              <p className="text-xs text-gray-600">nuevas recomendaciones</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/products')}>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-900">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Explorar Productos
              </CardTitle>
              <CardDescription>
                Descubre productos nuevos y agrega a tu carrito
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/routines')}>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-900">
                <Sparkles className="h-5 w-5 mr-2" />
                Mis Rutinas
              </CardTitle>
              <CardDescription>
                Gestiona tus rutinas de cuidado personal
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/community')}>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-900">
                <MessageSquare className="h-5 w-5 mr-2" />
                Comunidad
              </CardTitle>
              <CardDescription>
                Comparte experiencias con otros usuarios
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Recommendations */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Recomendaciones Recientes</CardTitle>
              <CardDescription>Productos recomendados especialmente para ti</CardDescription>
            </CardHeader>
            <CardContent>
              {unreadRecommendations.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tienes recomendaciones nuevas</p>
              ) : (
                <div className="space-y-3">
                  {unreadRecommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <img
                        src={rec.imagen_url || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop'}
                        alt={rec.nombre}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-purple-900">{rec.nombre}</h4>
                        <p className="text-sm text-gray-600">Por {rec.admin_username}</p>
                        {rec.mensaje && (
                          <p className="text-sm text-purple-700 italic">"{rec.mensaje}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Favorites */}
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-900">Favoritos Recientes</CardTitle>
              <CardDescription>Tus productos favoritos más recientes</CardDescription>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aún no tienes productos favoritos</p>
              ) : (
                <div className="space-y-3">
                  {favorites.slice(0, 3).map((fav) => (
                    <div key={fav.id} className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                      <img
                        src={fav.imagen_url || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=100&h=100&fit=crop'}
                        alt={fav.nombre}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-purple-900">{fav.nombre}</h4>
                        <p className="text-sm text-purple-600 font-semibold">${fav.precio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;