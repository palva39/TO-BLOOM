import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { ShoppingCart, Heart, Search, Filter } from 'lucide-react';
import { Product } from '@/types';

const Products = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(products.map(p => p.categoria).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = async (productId: number) => {
    try {
      await addToCart(productId, 1);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleToggleFavorite = async (productId: number) => {
    try {
      await toggleFavorite(productId);
    } catch (error) {
      // Error handled in hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Productos de Bienestar</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <Button variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Carrito
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">No se encontraron productos.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {product.imagen_url && (
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute top-2 right-2 p-2 ${
                      isFavorite(product.id) ? 'text-red-500' : 'text-gray-400'
                    }`}
                    onClick={() => handleToggleFavorite(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{product.nombre}</CardTitle>
                  <CardDescription>{product.categoria}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.descripcion}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      ${product.precio.toFixed(2)}
                    </span>
                    <Button onClick={() => handleAddToCart(product.id)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;