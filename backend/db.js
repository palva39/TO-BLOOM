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