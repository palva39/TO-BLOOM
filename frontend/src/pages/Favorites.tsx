import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/hooks/useFavorites';
import { useCart } from '@/hooks/useCart';
import { Heart, ShoppingCart, HeartOff } from 'lucide-react';

const Favorites = () => {
  const { favorites, removeFromFavorites, loading } = useFavorites();
  const { addToCart } = useCart();

  const handleRemoveFromFavorites = async (productId: number) => {
    try {
      await removeFromFavorites(productId);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-600">Cargando favoritos...</p>
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
            Mis Favoritos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tus productos favoritos guardados para acceso rápido
          </p>
          <div className="mt-4">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {favorites.length} {favorites.length === 1 ? 'producto favorito' : 'productos favoritos'}
            </Badge>
          </div>
        </div>

        {favorites.length === 0 ? (
          <Card className="text-center py-16 border-purple-100">
            <CardContent>
              <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-3">
                Aún no tienes favoritos
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                Explora nuestros productos y marca como favoritos los que más te gusten haciendo clic en el corazón
              </p>
              <Button 
                onClick={() => window.location.href = '/products'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Explorar Productos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="overflow-hidden hover:shadow-lg transition-all border-purple-100 hover:border-purple-200 group">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={favorite.imagen_url || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'}
                    alt={favorite.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-md"
                      onClick={() => handleRemoveFromFavorites(favorite.producto_id)}
                    >
                      <HeartOff className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">
                      <Heart className="h-3 w-3 mr-1 fill-current" />
                      Favorito
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-purple-900 line-clamp-2 flex-1">
                      {favorite.nombre}
                    </CardTitle>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-lg font-bold">
                      ${favorite.precio}
                    </Badge>
                    <div className="text-xs text-gray-500">
                      Agregado el {new Date(favorite.createdAt!).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {favorite.descripcion && (
                    <CardDescription className="line-clamp-3 text-gray-600 mb-4">
                      {favorite.descripcion}
                    </CardDescription>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleAddToCart(favorite.producto_id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Agregar al Carrito
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveFromFavorites(favorite.producto_id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <HeartOff className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {favorites.length > 0 && (
          <Card className="mt-12 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Heart className="h-8 w-8 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">
                    ¡Organiza tus favoritos!
                  </h3>
                  <p className="text-gray-700 text-sm">
                    Puedes agregar productos a favoritos desde cualquier página de producto. 
                    Tus favoritos se guardan automáticamente y puedes acceder a ellos en cualquier momento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Favorites;