import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { ShoppingCart, Heart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, checkFavorite } = useFavorites();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  const categories = [
    ...new Set(products.map((p) => p.categoria).filter(Boolean)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || product.categoria === selectedCategory;
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
      const isFavorite = await checkFavorite(productId);
      if (isFavorite) {
        await removeFromFavorites(productId);
      } else {
        await addToFavorites(productId);
      }
    } catch (error) {
      // Error handled in hook
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Nuestros Productos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección curada de productos de belleza y cuidado
            personal
          </p>
        </div>

        {/* Back to Dashboard Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="mb-6 border-2 border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100 hover:border-pink-300 shadow-sm rounded-full px-5 py-2 font-semibold transition-all duration-200 flex items-center gap-2"
        >
          ← Volver al Dashboard
        </Button>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-purple-200 focus:border-purple-500"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-purple-200 rounded-md focus:border-purple-500 focus:outline-none"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === "skincare"
                      ? "Cuidado de la piel"
                      : category === "hair"
                      ? "Cuidado capilar"
                      : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-all border-purple-100 hover:border-purple-200"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={
                      product.imagen_url ||
                      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop"
                    }
                    alt={product.nombre}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white text-pink-600 hover:text-pink-700"
                    onClick={() => handleToggleFavorite(product.id)}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-purple-900 line-clamp-1">
                      {product.nombre}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700"
                    >
                      ${product.precio}
                    </Badge>
                  </div>
                  {product.categoria && (
                    <Badge
                      variant="outline"
                      className="w-fit border-purple-200 text-purple-600"
                    >
                      {product.categoria === "skincare"
                        ? "Cuidado de la piel"
                        : product.categoria === "hair"
                        ? "Cuidado capilar"
                        : product.categoria}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="line-clamp-2 text-gray-600 mb-4">
                    {product.descripcion}
                  </CardDescription>
                  <Button
                    onClick={() => handleAddToCart(product.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Agregar al Carrito
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
