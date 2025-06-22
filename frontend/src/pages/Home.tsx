import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, MessageSquare, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Full Stack Template
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Modern Full Stack Template
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A complete starter template with React 18, Express.js, Prisma, and JWT authentication.
            Get your project up and running in minutes, not hours.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="flex items-center">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>User Authentication</CardTitle>
              <CardDescription>
                Complete JWT-based authentication with registration, login, and protected routes.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>CRUD Operations</CardTitle>
              <CardDescription>
                Full create, read, update, and delete functionality for posts with user ownership.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Modern Stack</CardTitle>
              <CardDescription>
                Built with React 18, Vite, Tailwind CSS, Express.js, Prisma, and SQLite.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tech Stack */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Tech Stack
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Frontend</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• React 18 with TypeScript</li>
                <li>• Vite for fast development</li>
                <li>• Tailwind CSS for styling</li>
                <li>• ShadCN UI components</li>
                <li>• Lucide React icons</li>
                <li>• Sonner for toast notifications</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Backend</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Express.js REST API</li>
                <li>• Prisma ORM</li>
                <li>• SQLite database</li>
                <li>• JWT authentication</li>
                <li>• Cookie-based sessions</li>
                <li>• CORS enabled</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;