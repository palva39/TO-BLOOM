export interface User {
  id: number;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  rol?: string;
  preferencias?: any;
  createdAt?: string;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  categoria?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: number;
  carrito_id: number;
  producto_id: number;
  cantidad: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  categoria?: string;
}

export interface Cart {
  id: number;
  usuario_id: number;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Routine {
  id: number;
  usuario_id: number;
  nombre: string;
  tipo?: string;
  pasos: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Favorite {
  id: number;
  usuario_id: number;
  producto_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  categoria?: string;
  createdAt?: string;
}

export interface Recommendation {
  id: number;
  admin_id: number;
  usuario_id: number;
  producto_id: number;
  mensaje?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen_url?: string;
  categoria?: string;
  admin_username: string;
  createdAt?: string;
}

export interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  authorId: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface CreatePostData {
  title: string;
  content?: string;
  published?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}