import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cart, items, updateItemQuantity, removeFromCart, clearCart, loading } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateItemQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Simulate checkout process
    alert('¡Compra simulada exitosa! En una implementación real, aquí se integraría con una pasarela de pago.');
    clearCart();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/products')}
              className="mr-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Productos
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mi Carrito
              </h1>
              <p className="text-gray-600 mt-2">
                {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vaciar Carrito
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card className="text-center py-12 border-purple-100">
            <CardContent>
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Tu carrito está vacío</h3>
              <p className="text-gray-500 mb-6">
                Explora nuestros productos y agrega los que más te gusten
              </p>
              <Button 
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Explorar Productos
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="border-purple-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.imagen_url || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=150&h=150&fit=crop'}
                        alt={item.nombre}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-purple-900">{item.nombre}</h3>
                        {item.descripcion && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.descripcion}</p>
                        )}
                        <p className="font-bold text-purple-600 mt-2">${item.precio}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-purple-200 rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                            className="h-8 w-8 p-0 hover:bg-purple-50"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                            {item.cantidad}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                            className="h-8 w-8 p-0 hover:bg-purple-50"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-purple-100 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-purple-900">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${cart?.total?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Envío</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <div className="border-t border-purple-100 pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-purple-600">${cart?.total?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    Proceder al Pago
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Esta es una demostración. No se procesarán pagos reales.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;