import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Heart, Sparkles, Users, Leaf } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-purple-600 mr-2" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Florecer
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Comenzar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Tu bienestar, 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {' '}floreciendo{' '}
            </span>
            cada día
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubre productos de belleza y cuidado personal personalizados para ti. 
            Crea rutinas, conecta con la comunidad y recibe recomendaciones expertas.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center">
                Comienza a Florecer <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-full w-fit mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-purple-900">Productos Personalizados</CardTitle>
              <CardDescription>
                Descubre productos de belleza, cuidado de la piel y cabello seleccionados especialmente para tus necesidades.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-full w-fit mb-4">
                <Sparkles className="h-8 w-8 text-pink-600" />
              </div>
              <CardTitle className="text-purple-900">Rutinas de Cuidado</CardTitle>
              <CardDescription>
                Crea y gestiona rutinas personalizadas de cuidado personal que se adapten a tu estilo de vida.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-full w-fit mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-purple-900">Comunidad Florecer</CardTitle>
              <CardDescription>
                Comparte experiencias, consejos y conecta con otros usuarios en tu jornada de bienestar.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-purple-100">
          <h3 className="text-3xl font-bold text-center text-purple-900 mb-8">
            ¿Por qué elegir Florecer?
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-purple-900 mb-4">Para Ti</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Productos curados según tus preferencias
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Rutinas personalizadas de cuidado
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Lista de favoritos y carrito inteligente
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Recomendaciones expertas personalizadas
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-purple-900 mb-4">Experiencia</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                  Interfaz intuitiva y hermosa
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                  Compra segura y gestión de perfil
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                  Comunidad activa y de apoyo
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-pink-400 rounded-full mr-3"></div>
                  Contenido educativo y tips de bienestar
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;