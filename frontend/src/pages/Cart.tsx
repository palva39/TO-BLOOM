import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { 
    items, 
    loading, 
    updateItemQuantity, 
    removeFromCart, 
    getCartItemCount, 
    getCartTotal 
  } = useCart();

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateItemQuantity(itemId, newQuantity);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleCheckout = () => {
    // Simulate checkout process
    alert('¡Compra simulada exitosa! Gracias por usar Florecer.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando carrito...</p>
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
              <Link to="/products" className="mr-4">
                <Button variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a Productos
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Mi Carrito</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                {getCartItemCount()} {getCartItemCount() === 1 ? 'producto' : 'productos'}
              </span>
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
              <Link to="/products">
                <Button>Explorar Productos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {item.imagen_url && (
                        <img
                          src={item.imagen_url}
                          alt={item.nombre}
                          className="w-full sm:w-24 h-24 object-cover rounded-md"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.nombre}</h3>
                        <p className="text-gray-600 text-sm">{item.categoria}</p>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {item.descripcion}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xl font-bold text-green-600">
                            ${item.precio.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                              disabled={item.cantidad <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.cantidad}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min="1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveItem(item.producto_id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Productos ({getCartItemCount()})</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Finalizar Compra
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    * Esta es una simulación de compra
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;