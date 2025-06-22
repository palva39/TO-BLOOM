import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/types';
import { Plus, Edit, Trash2, MessageSquare, ArrowLeft, Heart } from 'lucide-react';

const Community = () => {
  const { user } = useAuth();
  const { posts, loading, createPost, updatePost, deletePost } = usePosts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: true, // Default to published for community posts
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    try {
      if (editingPost) {
        await updatePost(editingPost.id, formData);
        setEditingPost(null);
      } else {
        await createPost(formData);
        setShowCreateForm(false);
      }
      setFormData({ title: '', content: '', published: true });
    } catch (error) {
      // Error handled in hooks
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content || '',
      published: post.published,
    });
    setShowCreateForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setShowCreateForm(false);
    setFormData({ title: '', content: '', published: true });
  };

  const userPosts = posts.filter(post => post.authorId === user?.id);
  const publishedPosts = posts.filter(post => post.published);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando comunidad...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Comunidad Florecer</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{publishedPosts.length} publicaciones</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <Card className="mb-8 bg-gradient-to-r from-green-100 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Bienvenido a la Comunidad</h2>
            </div>
            <p className="text-gray-600">
              Comparte tus experiencias, consejos y progreso en tu viaje de bienestar. 
              Conecta con otros usuarios y encuentra inspiración para tu cuidado personal.
            </p>
          </CardContent>
        </Card>

        {/* Create Post Section */}
        <div className="mb-8">
          {!showCreateForm ? (
            <Button onClick={() => setShowCreateForm(true)} className="mb-6">
              <Plus className="h-4 w-4 mr-2" />
              Compartir Experiencia
            </Button>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingPost ? 'Editar Publicación' : 'Compartir tu Experiencia'}</CardTitle>
                <CardDescription>
                  Comparte consejos, experiencias o preguntas sobre bienestar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ej: Mi rutina matutina de cuidado facial"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Contenido</Label>
                    <textarea
                      id="content"
                      className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Comparte tu experiencia, consejos o preguntas sobre bienestar..."
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {editingPost ? 'Actualizar' : 'Publicar'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Community Posts */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Últimas Publicaciones</h2>
            
            {publishedPosts.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Aún no hay publicaciones en la comunidad.</p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ser el Primero en Compartir
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {publishedPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                          <div className="flex items-center text-sm text-gray-500">
                            <span>Por {post.author.username}</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {post.authorId === user?.id && (
                          <div className="flex space-x-2 ml-4">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => deletePost(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    {post.content && (
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {post.content}
                        </p>
                        <div className="flex items-center mt-4 pt-4 border-t">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4 mr-2" />
                            Me gusta
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Comentar
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* User's Posts */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Mis Publicaciones</CardTitle>
              </CardHeader>
              <CardContent>
                {userPosts.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No has publicado nada aún.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {userPosts.slice(0, 5).map((post) => (
                      <div key={post.id} className="text-sm">
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {userPosts.length > 5 && (
                      <p className="text-xs text-gray-400">
                        y {userPosts.length - 5} más...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Normas de la Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Sé respetuoso y amable</li>
                  <li>• Comparte experiencias auténticas</li>
                  <li>• Evita contenido promocional</li>
                  <li>• Busca y ofrece apoyo mutuo</li>
                  <li>• Celebra los logros de otros</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;