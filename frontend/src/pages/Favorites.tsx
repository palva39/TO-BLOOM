import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';

const Favorites = () => {
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleRemoveFromFavorites = async (productId: number) => {
    try {
      await removeFromFavorites(productId);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando favoritos...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{favorites.length} productos</span>
              <Link to="/products">
                <Button variant="outline">Explorar Productos</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No tienes productos favoritos aún.</p>
              <Link to="/products">
                <Button>Explorar Productos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {favorite.imagen_url && (
                    <img
                      src={favorite.imagen_url}
                      alt={favorite.nombre}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 p-2 text-red-500"
                    onClick={() => handleRemoveFromFavorites(favorite.producto_id)}
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{favorite.nombre}</CardTitle>
                  <CardDescription>{favorite.categoria}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {favorite.descripcion}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ${favorite.precio.toFixed(2)}
                    </span>
                    <Button onClick={() => handleAddToCart(favorite.producto_id)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Agregado el {new Date(favorite.createdAt || '').toLocaleDateString()}
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

export default Favorites;