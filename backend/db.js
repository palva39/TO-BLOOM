const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Simple SQLite database initialization
const db = new Database(path.join(__dirname, 'prisma', 'dev.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    rol TEXT DEFAULT 'user',
    preferencias TEXT DEFAULT '{}',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    imagen_url TEXT,
    categoria TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS Carrito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    total REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS Carrito_Item (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carrito_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carrito_id) REFERENCES Carrito(id),
    FOREIGN KEY (producto_id) REFERENCES Product(id)
  );

  CREATE TABLE IF NOT EXISTS Rutina (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    tipo TEXT,
    pasos TEXT DEFAULT '[]',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS Favorito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES User(id),
    FOREIGN KEY (producto_id) REFERENCES Product(id),
    UNIQUE(usuario_id, producto_id)
  );

  CREATE TABLE IF NOT EXISTS Recomendacion (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    mensaje TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES User(id),
    FOREIGN KEY (usuario_id) REFERENCES User(id),
    FOREIGN KEY (producto_id) REFERENCES Product(id)
  );

  CREATE TABLE IF NOT EXISTS Post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    published INTEGER DEFAULT 0,
    authorId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES User(id)
  );
`);

// Simple ORM-like interface
const createUser = db.prepare(`
  INSERT INTO User (email, username, password) 
  VALUES (?, ?, ?)
`);

const findUserByEmail = db.prepare(`
  SELECT * FROM User WHERE email = ?
`);

const findUserById = db.prepare(`
  SELECT * FROM User WHERE id = ?
`);

const createPost = db.prepare(`
  INSERT INTO Post (title, content, published, authorId) 
  VALUES (?, ?, ?, ?)
`);

const findAllPosts = db.prepare(`
  SELECT p.*, u.username, u.email 
  FROM Post p 
  JOIN User u ON p.authorId = u.id 
  ORDER BY p.createdAt DESC
`);

const findPostById = db.prepare(`
  SELECT p.*, u.username, u.email 
  FROM Post p 
  JOIN User u ON p.authorId = u.id 
  WHERE p.id = ?
`);

const updatePost = db.prepare(`
  UPDATE Post 
  SET title = ?, content = ?, published = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deletePost = db.prepare(`
  DELETE FROM Post WHERE id = ?
`);

// Product prepared statements
const createProduct = db.prepare(`
  INSERT INTO Product (nombre, descripcion, precio, imagen_url, categoria) 
  VALUES (?, ?, ?, ?, ?)
`);

const findAllProducts = db.prepare(`
  SELECT * FROM Product ORDER BY createdAt DESC
`);

const findProductById = db.prepare(`
  SELECT * FROM Product WHERE id = ?
`);

const updateProduct = db.prepare(`
  UPDATE Product 
  SET nombre = ?, descripcion = ?, precio = ?, imagen_url = ?, categoria = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deleteProduct = db.prepare(`
  DELETE FROM Product WHERE id = ?
`);

// Cart prepared statements
const createCarrito = db.prepare(`
  INSERT INTO Carrito (usuario_id, total) 
  VALUES (?, ?)
`);

const findCarritoByUserId = db.prepare(`
  SELECT * FROM Carrito WHERE usuario_id = ?
`);

const updateCarritoTotal = db.prepare(`
  UPDATE Carrito SET total = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
`);

const createCarritoItem = db.prepare(`
  INSERT INTO Carrito_Item (carrito_id, producto_id, cantidad) 
  VALUES (?, ?, ?)
`);

const findCarritoItems = db.prepare(`
  SELECT ci.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.categoria
  FROM Carrito_Item ci 
  JOIN Product p ON ci.producto_id = p.id 
  WHERE ci.carrito_id = ?
`);

const updateCarritoItemCantidad = db.prepare(`
  UPDATE Carrito_Item SET cantidad = ? WHERE id = ?
`);

const deleteCarritoItem = db.prepare(`
  DELETE FROM Carrito_Item WHERE id = ?
`);

const deleteCarritoItemByProducto = db.prepare(`
  DELETE FROM Carrito_Item WHERE carrito_id = ? AND producto_id = ?
`);

// Rutina prepared statements
const createRutina = db.prepare(`
  INSERT INTO Rutina (usuario_id, nombre, tipo, pasos) 
  VALUES (?, ?, ?, ?)
`);

const findRutinasByUserId = db.prepare(`
  SELECT * FROM Rutina WHERE usuario_id = ? ORDER BY createdAt DESC
`);

const findRutinaById = db.prepare(`
  SELECT * FROM Rutina WHERE id = ?
`);

const updateRutina = db.prepare(`
  UPDATE Rutina 
  SET nombre = ?, tipo = ?, pasos = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deleteRutina = db.prepare(`
  DELETE FROM Rutina WHERE id = ?
`);

// Favorito prepared statements
const createFavorito = db.prepare(`
  INSERT INTO Favorito (usuario_id, producto_id) 
  VALUES (?, ?)
`);

const findFavoritosByUserId = db.prepare(`
  SELECT f.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.categoria
  FROM Favorito f 
  JOIN Product p ON f.producto_id = p.id 
  WHERE f.usuario_id = ? 
  ORDER BY f.createdAt DESC
`);

const deleteFavorito = db.prepare(`
  DELETE FROM Favorito WHERE usuario_id = ? AND producto_id = ?
`);

const findFavorito = db.prepare(`
  SELECT * FROM Favorito WHERE usuario_id = ? AND producto_id = ?
`);

// Recomendacion prepared statements
const createRecomendacion = db.prepare(`
  INSERT INTO Recomendacion (admin_id, usuario_id, producto_id, mensaje) 
  VALUES (?, ?, ?, ?)
`);

const findRecomendacionesByUserId = db.prepare(`
  SELECT r.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.categoria, u.username as admin_username
  FROM Recomendacion r 
  JOIN Product p ON r.producto_id = p.id 
  JOIN User u ON r.admin_id = u.id 
  WHERE r.usuario_id = ? 
  ORDER BY r.createdAt DESC
`);

const findAllRecomendaciones = db.prepare(`
  SELECT r.*, p.nombre, p.descripcion, p.precio, p.imagen_url, p.categoria, 
         u1.username as admin_username, u2.username as usuario_username
  FROM Recomendacion r 
  JOIN Product p ON r.producto_id = p.id 
  JOIN User u1 ON r.admin_id = u1.id 
  JOIN User u2 ON r.usuario_id = u2.id 
  ORDER BY r.createdAt DESC
`);

module.exports = {
  user: {
    create: (data) => {
      const result = createUser.run(data.email, data.username, data.password);
      return { id: result.lastInsertRowid, ...data };
    },
    findUnique: ({ where }) => {
      if (where.email) return findUserByEmail.get(where.email);
      if (where.id) return findUserById.get(where.id);
      return null;
    },
    findFirst: ({ where }) => {
      if (where.OR) {
        for (const condition of where.OR) {
          if (condition.email) {
            const user = findUserByEmail.get(condition.email);
            if (user) return user;
          }
          if (condition.username) {
            const user = db.prepare('SELECT * FROM User WHERE username = ?').get(condition.username);
            if (user) return user;
          }
        }
      }
      return null;
    }
  },
  product: {
    create: ({ data }) => {
      const result = createProduct.run(data.nombre, data.descripcion, data.precio, data.imagen_url, data.categoria);
      return { id: result.lastInsertRowid, ...data };
    },
    findMany: () => {
      return findAllProducts.all();
    },
    findUnique: ({ where }) => {
      return findProductById.get(where.id);
    },
    update: ({ where, data }) => {
      updateProduct.run(data.nombre, data.descripcion, data.precio, data.imagen_url, data.categoria, where.id);
      return findProductById.get(where.id);
    },
    delete: ({ where }) => {
      deleteProduct.run(where.id);
      return {};
    }
  },
  carrito: {
    findOrCreate: (userId) => {
      let carrito = findCarritoByUserId.get(userId);
      if (!carrito) {
        const result = createCarrito.run(userId, 0);
        carrito = { id: result.lastInsertRowid, usuario_id: userId, total: 0 };
      }
      return carrito;
    },
    getItems: (carritoId) => {
      return findCarritoItems.all(carritoId);
    },
    addItem: (carritoId, productoId, cantidad = 1) => {
      const result = createCarritoItem.run(carritoId, productoId, cantidad);
      return { id: result.lastInsertRowid, carrito_id: carritoId, producto_id: productoId, cantidad };
    },
    updateItem: (itemId, cantidad) => {
      updateCarritoItemCantidad.run(cantidad, itemId);
    },
    removeItem: (carritoId, productoId) => {
      deleteCarritoItemByProducto.run(carritoId, productoId);
    },
    updateTotal: (carritoId, total) => {
      updateCarritoTotal.run(total, carritoId);
    }
  },
  rutina: {
    create: ({ data }) => {
      const result = createRutina.run(data.usuario_id, data.nombre, data.tipo, JSON.stringify(data.pasos || []));
      const rutina = findRutinaById.get(result.lastInsertRowid);
      return { ...rutina, pasos: JSON.parse(rutina.pasos) };
    },
    findMany: ({ where }) => {
      const rutinas = findRutinasByUserId.all(where.usuario_id);
      return rutinas.map(r => ({ ...r, pasos: JSON.parse(r.pasos) }));
    },
    findUnique: ({ where }) => {
      const rutina = findRutinaById.get(where.id);
      if (!rutina) return null;
      return { ...rutina, pasos: JSON.parse(rutina.pasos) };
    },
    update: ({ where, data }) => {
      updateRutina.run(data.nombre, data.tipo, JSON.stringify(data.pasos || []), where.id);
      const rutina = findRutinaById.get(where.id);
      return { ...rutina, pasos: JSON.parse(rutina.pasos) };
    },
    delete: ({ where }) => {
      deleteRutina.run(where.id);
      return {};
    }
  },
  favorito: {
    create: ({ data }) => {
      const result = createFavorito.run(data.usuario_id, data.producto_id);
      return { id: result.lastInsertRowid, ...data };
    },
    findMany: ({ where }) => {
      return findFavoritosByUserId.all(where.usuario_id);
    },
    delete: ({ where }) => {
      deleteFavorito.run(where.usuario_id, where.producto_id);
      return {};
    },
    exists: (usuarioId, productoId) => {
      return findFavorito.get(usuarioId, productoId) ? true : false;
    }
  },
  recomendacion: {
    create: ({ data }) => {
      const result = createRecomendacion.run(data.admin_id, data.usuario_id, data.producto_id, data.mensaje);
      return { id: result.lastInsertRowid, ...data };
    },
    findMany: ({ where }) => {
      if (where.usuario_id) {
        return findRecomendacionesByUserId.all(where.usuario_id);
      }
      return findAllRecomendaciones.all();
    }
  },
  post: {
    create: ({ data, include }) => {
      const result = createPost.run(data.title, data.content, data.published ? 1 : 0, data.authorId);
      const post = findPostById.get(result.lastInsertRowid);
      return {
        id: result.lastInsertRowid,
        title: data.title,
        content: data.content,
        published: Boolean(data.published),
        authorId: data.authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: post.authorId,
          username: post.username,
          email: post.email
        }
      };
    },
    findMany: ({ include, orderBy }) => {
      const posts = findAllPosts.all();
      return posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        published: Boolean(post.published),
        authorId: post.authorId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.authorId,
          username: post.username,
          email: post.email
        }
      }));
    },
    findUnique: ({ where, include }) => {
      const post = findPostById.get(where.id);
      if (!post) return null;
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        published: Boolean(post.published),
        authorId: post.authorId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.authorId,
          username: post.username,
          email: post.email
        }
      };
    },
    update: ({ where, data, include }) => {
      const current = findPostById.get(where.id);
      if (!current) return null;
      
      const title = data.title ?? current.title;
      const content = data.content !== undefined ? data.content : current.content;
      const published = data.published !== undefined ? (data.published ? 1 : 0) : current.published;
      
      updatePost.run(title, content, published, where.id);
      
      return {
        id: current.id,
        title,
        content,
        published: Boolean(published),
        authorId: current.authorId,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
        author: {
          id: current.authorId,
          username: current.username,
          email: current.email
        }
      };
    },
    delete: ({ where }) => {
      deletePost.run(where.id);
      return {};
    }
  },
  $disconnect: () => {
    db.close();
  }
};