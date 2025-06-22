import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/types';
import { Plus, Edit, Trash2, LogOut, User } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { posts, loading, createPost, updatePost, deletePost } = usePosts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    published: false,
  });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // Error handled in auth hook
    }
  };

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
      setFormData({ title: '', content: '', published: false });
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
    setFormData({ title: '', content: '', published: false });
  };

  const userPosts = posts.filter(post => post.authorId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>{user?.username}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Post Section */}
        <div className="mb-8">
          {!showCreateForm ? (
            <Button onClick={() => setShowCreateForm(true)} className="mb-6">
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          ) : (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <textarea
                      id="content"
                      className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">
                      {editingPost ? 'Update Post' : 'Create Post'}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Posts Section */}
        <div className="grid gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Your Posts</h2>
            <span className="text-sm text-gray-500">{userPosts.length} posts</span>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : userPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't created any posts yet.</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription>
                          {post.published ? 'Published' : 'Draft'} • Created on{' '}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
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
                    </div>
                  </CardHeader>
                  {post.content && (
                    <CardContent>
                      <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* All Posts Section */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">All Posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <CardDescription>
                        By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {post.content && (
                  <CardContent>
                    <p className="text-gray-600 whitespace-pre-wrap">{post.content}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;