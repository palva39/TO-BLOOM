const Database = require("better-sqlite3");
const bcrypt = require("bcryptjs");
const path = require("path");

// Simple SQLite database initialization
const db = new Database(path.join(__dirname, "prisma", "dev.db"));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    description TEXT,
    rol TEXT DEFAULT 'user',
    preferencias TEXT DEFAULT '{}',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
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

  CREATE TABLE IF NOT EXISTS Cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    total REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS CartItem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carrito_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carrito_id) REFERENCES Cart(id),
    FOREIGN KEY (producto_id) REFERENCES Product(id)
  );

  CREATE TABLE IF NOT EXISTS Routine (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    tipo TEXT,
    pasos TEXT DEFAULT '[]',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES User(id)
  );

  CREATE TABLE IF NOT EXISTS Favorite (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES User(id),
    FOREIGN KEY (producto_id) REFERENCES Product(id),
    UNIQUE(usuario_id, producto_id)
  );

  CREATE TABLE IF NOT EXISTS Recommendation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    mensaje TEXT,
    leida INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES User(id),
    FOREIGN KEY (usuario_id) REFERENCES User(id),
    FOREIGN KEY (producto_id) REFERENCES Product(id)
  );
`);

// Simple ORM-like interface
const createUser = db.prepare(`
  INSERT INTO User (email, username, password, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?)
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

// Product queries
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

// Cart queries
const findCartByUserId = db.prepare(`
  SELECT * FROM Cart WHERE usuario_id = ?
`);

const createCart = db.prepare(`
  INSERT INTO Cart (usuario_id, total) VALUES (?, ?)
`);

const updateCartTotal = db.prepare(`
  UPDATE Cart SET total = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
`);

const findCartItems = db.prepare(`
  SELECT ci.*, p.nombre, p.descripcion, p.precio, p.imagen_url 
  FROM CartItem ci 
  JOIN Product p ON ci.producto_id = p.id 
  WHERE ci.carrito_id = ?
`);

const addCartItem = db.prepare(`
  INSERT INTO CartItem (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)
`);

const findCartItemByProduct = db.prepare(`
  SELECT * FROM CartItem WHERE carrito_id = ? AND producto_id = ?
`);

const updateCartItem = db.prepare(`
  UPDATE CartItem SET cantidad = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?
`);

const deleteCartItem = db.prepare(`
  DELETE FROM CartItem WHERE id = ?
`);

const clearCart = db.prepare(`
  DELETE FROM CartItem WHERE carrito_id = ?
`);

// Routine queries
const createRoutine = db.prepare(`
  INSERT INTO Routine (usuario_id, nombre, tipo, pasos) VALUES (?, ?, ?, ?)
`);

const findRoutinesByUserId = db.prepare(`
  SELECT * FROM Routine WHERE usuario_id = ? ORDER BY createdAt DESC
`);

const findRoutineById = db.prepare(`
  SELECT * FROM Routine WHERE id = ?
`);

const updateRoutine = db.prepare(`
  UPDATE Routine 
  SET nombre = ?, tipo = ?, pasos = ?, updatedAt = CURRENT_TIMESTAMP 
  WHERE id = ?
`);

const deleteRoutine = db.prepare(`
  DELETE FROM Routine WHERE id = ?
`);

// Favorite queries
const addFavorite = db.prepare(`
  INSERT OR IGNORE INTO Favorite (usuario_id, producto_id) VALUES (?, ?)
`);

const removeFavorite = db.prepare(`
  DELETE FROM Favorite WHERE usuario_id = ? AND producto_id = ?
`);

const findFavoritesByUserId = db.prepare(`
  SELECT f.*, p.nombre, p.descripcion, p.precio, p.imagen_url 
  FROM Favorite f 
  JOIN Product p ON f.producto_id = p.id 
  WHERE f.usuario_id = ? 
  ORDER BY f.createdAt DESC
`);

const checkFavorite = db.prepare(`
  SELECT * FROM Favorite WHERE usuario_id = ? AND producto_id = ?
`);

// Recommendation queries
const createRecommendation = db.prepare(`
  INSERT INTO Recommendation (admin_id, usuario_id, producto_id, mensaje) VALUES (?, ?, ?, ?)
`);

const findRecommendationsByUserId = db.prepare(`
  SELECT r.*, p.nombre, p.descripcion, p.precio, p.imagen_url, u.username as admin_username
  FROM Recommendation r 
  JOIN Product p ON r.producto_id = p.id 
  JOIN User u ON r.admin_id = u.id 
  WHERE r.usuario_id = ? 
  ORDER BY r.createdAt DESC
`);

const markRecommendationAsRead = db.prepare(`
  UPDATE Recommendation SET leida = 1 WHERE id = ?
`);

module.exports = {
  user: {
    create: (data) => {
      const now = new Date().toISOString();
      const result = createUser.run(
        data.email,
        data.username,
        data.password,
        now,
        now
      );
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
            const user = db
              .prepare("SELECT * FROM User WHERE username = ?")
              .get(condition.username);
            if (user) return user;
          }
        }
      }
      return null;
    },
    update: ({ where, data }) => {
      // Patch: allow updating avatar_url, bio, description, preferencias
      const current = findUserById.get(where.id);
      if (!current) return null;
      const avatar_url = data.avatar_url ?? current.avatar_url;
      const bio = data.bio ?? current.bio;
      const description = data.description ?? current.description;
      const preferencias = data.preferencias ?? current.preferencias;
      db.prepare(
        `UPDATE User SET avatar_url = ?, bio = ?, description = ?, preferencias = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`
      ).run(avatar_url, bio, description, preferencias, where.id);
      return { ...current, avatar_url, bio, description, preferencias };
    },
  },
  product: {
    create: ({ data }) => {
      const result = createProduct.run(
        data.nombre,
        data.descripcion,
        data.precio,
        data.imagen_url || null,
        data.categoria || null
      );
      return { id: result.lastInsertRowid, ...data };
    },
    findMany: ({ where }) => {
      return findAllProducts.all();
    },
    findUnique: ({ where }) => {
      return findProductById.get(where.id);
    },
    update: ({ where, data }) => {
      const current = findProductById.get(where.id);
      if (!current) return null;

      const nombre = data.nombre ?? current.nombre;
      const descripcion = data.descripcion ?? current.descripcion;
      const precio = data.precio ?? current.precio;
      const imagen_url = data.imagen_url ?? current.imagen_url;
      const categoria = data.categoria ?? current.categoria;

      updateProduct.run(
        nombre,
        descripcion,
        precio,
        imagen_url,
        categoria,
        where.id
      );
      return { ...current, ...data };
    },
    delete: ({ where }) => {
      deleteProduct.run(where.id);
      return {};
    },
  },
  cart: {
    findOrCreate: ({ userId }) => {
      let cart = findCartByUserId.get(userId);
      if (!cart) {
        const result = createCart.run(userId, 0);
        cart = { id: result.lastInsertRowid, usuario_id: userId, total: 0 };
      }
      return cart;
    },
    findItems: ({ cartId }) => {
      return findCartItems.all(cartId);
    },
    addItem: ({ cartId, productId, cantidad = 1 }) => {
      const existing = findCartItemByProduct.get(cartId, productId);
      if (existing) {
        updateCartItem.run(existing.cantidad + cantidad, existing.id);
        return { itemId: existing.id, cantidad: existing.cantidad + cantidad };
      } else {
        const result = addCartItem.run(cartId, productId, cantidad);
        return { itemId: result.lastInsertRowid, cantidad };
      }
    },
    updateItem: ({ itemId, cantidad }) => {
      updateCartItem.run(cantidad, itemId);
      return {};
    },
    removeItem: ({ itemId }) => {
      deleteCartItem.run(itemId);
      return {};
    },
    updateTotal: ({ cartId, total }) => {
      updateCartTotal.run(total, cartId);
      return {};
    },
    clear: ({ cartId }) => {
      clearCart.run(cartId);
      return {};
    },
  },
  routine: {
    create: ({ data }) => {
      const result = createRoutine.run(
        data.usuario_id,
        data.nombre,
        data.tipo || null,
        JSON.stringify(data.pasos || [])
      );
      return { id: result.lastInsertRowid, ...data };
    },
    findMany: ({ where }) => {
      const routines = findRoutinesByUserId.all(where.usuario_id);
      return routines.map((routine) => ({
        ...routine,
        pasos: JSON.parse(routine.pasos || "[]"),
      }));
    },
    findUnique: ({ where }) => {
      const routine = findRoutineById.get(where.id);
      if (!routine) return null;
      return {
        ...routine,
        pasos: JSON.parse(routine.pasos || "[]"),
      };
    },
    update: ({ where, data }) => {
      const current = findRoutineById.get(where.id);
      if (!current) return null;

      const nombre = data.nombre ?? current.nombre;
      const tipo = data.tipo ?? current.tipo;
      const pasos = data.pasos ? JSON.stringify(data.pasos) : current.pasos;

      updateRoutine.run(nombre, tipo, pasos, where.id);
      return { ...current, ...data };
    },
    delete: ({ where }) => {
      deleteRoutine.run(where.id);
      return {};
    },
  },
  favorite: {
    add: ({ userId, productId }) => {
      addFavorite.run(userId, productId);
      return { userId, productId };
    },
    remove: ({ userId, productId }) => {
      removeFavorite.run(userId, productId);
      return {};
    },
    findMany: ({ where }) => {
      return findFavoritesByUserId.all(where.usuario_id);
    },
    check: ({ userId, productId }) => {
      return checkFavorite.get(userId, productId);
    },
  },
  recommendation: {
    create: ({ data }) => {
      const result = createRecommendation.run(
        data.admin_id,
        data.usuario_id,
        data.producto_id,
        data.mensaje || null
      );
      return { id: result.lastInsertRowid, ...data };
    },
    findMany: ({ where }) => {
      return findRecommendationsByUserId.all(where.usuario_id);
    },
    markAsRead: ({ id }) => {
      markRecommendationAsRead.run(id);
      return {};
    },
  },
  post: {
    create: ({ data, include }) => {
      const result = createPost.run(
        data.title,
        data.content,
        data.published ? 1 : 0,
        data.authorId
      );
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
          email: post.email,
        },
      };
    },
    findMany: ({ include, orderBy }) => {
      const posts = findAllPosts.all();
      return posts.map((post) => ({
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
          email: post.email,
        },
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
          email: post.email,
        },
      };
    },
    update: ({ where, data, include }) => {
      const current = findPostById.get(where.id);
      if (!current) return null;

      const title = data.title ?? current.title;
      const content =
        data.content !== undefined ? data.content : current.content;
      const published =
        data.published !== undefined
          ? data.published
            ? 1
            : 0
          : current.published;

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
          email: current.email,
        },
      };
    },
    delete: ({ where }) => {
      deletePost.run(where.id);
      return {};
    },
  },
  $disconnect: () => {
    db.close();
  },
};
