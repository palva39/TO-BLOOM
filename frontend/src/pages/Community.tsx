import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/types";
import { Plus, Edit, Trash2, MessageSquare, Users, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const { user } = useAuth();
  const { posts, loading, createPost, updatePost, deletePost } = usePosts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    published: true,
  });
  const navigate = useNavigate();

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
      setFormData({ title: "", content: "", published: true });
    } catch (error) {
      // Error handled in hooks
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content || "",
      published: post.published,
    });
    setShowCreateForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setShowCreateForm(false);
    setFormData({ title: "", content: "", published: true });
  };

  const userPosts = posts.filter((post) => post.authorId === user?.id);
  const otherPosts = posts.filter(
    (post) => post.authorId !== user?.id && post.published
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-purple-600">Cargando comunidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Comunidad Florecer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comparte tus experiencias, consejos y conecta con otros miembros de
            nuestra comunidad de bienestar
          </p>
          <div className="flex justify-center items-center space-x-6 mt-6">
            <div className="flex items-center text-purple-600">
              <Users className="h-5 w-5 mr-2" />
              <span className="font-medium">{posts.length} publicaciones</span>
            </div>
            <div className="flex items-center text-purple-600">
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="font-medium">Comunidad activa</span>
            </div>
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="mb-6 border-2 border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100 hover:border-pink-300 shadow-sm rounded-full px-5 py-2 font-semibold transition-all duration-200 flex items-center gap-2"
        >
          ← Volver al Dashboard
        </Button>

        {/* Create Post Section */}
        <div className="mb-8">
          {!showCreateForm ? (
            <Card className="border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-purple-900">
                      ¿Qué quieres compartir hoy?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Comparte tus experiencias, consejos o haz preguntas
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Publicación
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-900">
                  {editingPost ? "Editar Publicación" : "Nueva Publicación"}
                </CardTitle>
                <CardDescription>
                  Comparte tu experiencia con la comunidad Florecer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-purple-700">
                      Título
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                      className="border-purple-200 focus:border-purple-500"
                      placeholder="¿Cuál es el tema de tu publicación?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-purple-700">
                      Contenido
                    </Label>
                    <textarea
                      id="content"
                      className="w-full min-h-[120px] rounded-md border border-purple-200 bg-background px-3 py-2 text-sm focus:border-purple-500 focus:outline-none resize-none"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Comparte tu experiencia, consejos, o haz una pregunta..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          published: e.target.checked,
                        })
                      }
                      className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
                    />
                    <Label
                      htmlFor="published"
                      className="text-sm text-purple-700"
                    >
                      Publicar inmediatamente
                    </Label>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {editingPost ? "Actualizar" : "Publicar"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* My Posts Section */}
        {userPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-purple-900 mb-4 flex items-center">
              <MessageSquare className="h-6 w-6 mr-2" />
              Mis Publicaciones ({userPosts.length})
            </h2>
            <div className="space-y-4">
              {userPosts.map((post) => (
                <Card
                  key={post.id}
                  className="border-purple-100 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-purple-900">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-4">
                          <span>
                            {post.published ? "Publicado" : "Borrador"}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(post)}
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deletePost(post.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {post.content && (
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Community Posts Section */}
        <div>
          <h2 className="text-2xl font-semibold text-purple-900 mb-4 flex items-center">
            <Users className="h-6 w-6 mr-2" />
            Publicaciones de la Comunidad
          </h2>
          {otherPosts.length === 0 ? (
            <Card className="text-center py-12 border-purple-100">
              <CardContent>
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Sé el primero en compartir
                </h3>
                <p className="text-gray-500 mb-6">
                  Aún no hay publicaciones de otros miembros. ¡Sé el primero en
                  compartir tu experiencia!
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Crear Primera Publicación
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {otherPosts.map((post) => (
                <Card
                  key={post.id}
                  className="border-purple-100 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-full">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-purple-900">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <span>Por {post.author.username}</span>
                          <span>•</span>
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  {post.content && (
                    <CardContent>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {post.content}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
