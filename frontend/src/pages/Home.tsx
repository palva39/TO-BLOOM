import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, ShoppingBag, Calendar, Star, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-green-600">
                🌸 Florecer
              </h1>
              <span className="ml-2 text-gray-600">Tu Plataforma de Bienestar</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Empezar Ahora</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Tu Viaje de Bienestar 
            <span className="text-green-600"> Comienza Aquí</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre productos naturales, crea rutinas personalizadas y conecta con una comunidad 
            que comparte tu pasión por el cuidado personal y el bienestar.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="flex items-center bg-green-600 hover:bg-green-700">
                Comenzar Mi Viaje <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Ya Tengo Cuenta
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ShoppingBag className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Productos Naturales</CardTitle>
              <CardDescription>
                Explora una cuidada selección de productos para belleza, nutrición y cuidado personal.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Rutinas Personalizadas</CardTitle>
              <CardDescription>
                Crea y gestiona rutinas de cuidado adaptadas a tu estilo de vida y necesidades.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 text-pink-600 mb-4" />
              <CardTitle>Lista de Favoritos</CardTitle>
              <CardDescription>
                Guarda tus productos favoritos para acceso rápido y compras futuras.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Star className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle>Recomendaciones</CardTitle>
              <CardDescription>
                Recibe sugerencias personalizadas de expertos en bienestar y belleza.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Comunidad</CardTitle>
              <CardDescription>
                Comparte experiencias y aprende de otros en tu journey de bienestar.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-100 to-blue-100">
            <CardHeader>
              <div className="text-2xl mb-4">🌟</div>
              <CardTitle>Y Mucho Más</CardTitle>
              <CardDescription>
                Carrito de compras, panel administrativo y experiencia totalmente personalizada.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Categories Preview */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Categorías de Productos
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧴</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Cuidado de la Piel</h4>
              <p className="text-gray-600">Cremas, serums y tratamientos para todo tipo de piel</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Nutrición</h4>
              <p className="text-gray-600">Suplementos y vitaminas para tu bienestar interior</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💇‍♀️</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Cuidado del Cabello</h4>
              <p className="text-gray-600">Champús, aceites y tratamientos capilares naturales</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            ¿Listo para Transformar tu Rutina de Bienestar?
          </h3>
          <p className="text-lg mb-6 text-green-100">
            Únete a nuestra comunidad y descubre una nueva forma de cuidarte.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
              Crear Mi Cuenta Gratuita
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;