import { useState, useEffect } from 'react';
import { Post, CreatePostData, UpdatePostData } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error: any) {
      toast.error('Failed to fetch posts');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (data: CreatePostData) => {
    try {
      const response = await api.post('/posts', data);
      setPosts(prev => [response.data, ...prev]);
      toast.success('Post created successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to create post';
      toast.error(message);
      throw error;
    }
  };

  const updatePost = async (id: number, data: UpdatePostData) => {
    try {
      const response = await api.put(`/posts/${id}`, data);
      setPosts(prev => prev.map(post => post.id === id ? response.data : post));
      toast.success('Post updated successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to update post';
      toast.error(message);
      throw error;
    }
  };

  const deletePost = async (id: number) => {
    try {
      await api.delete(`/posts/${id}`);
      setPosts(prev => prev.filter(post => post.id !== id));
      toast.success('Post deleted successfully!');
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to delete post';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
};