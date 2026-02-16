const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || './data/database.sqlite';

let db = null;

function getDatabase() {
  if (!db) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    db = new sqlite3.Database(DB_PATH);
  }
  return db;
}

function initDatabase() {
  return new Promise((resolve, reject) => {
    const database = getDatabase();
    
    database.serialize(() => {
      // Tabla de usuarios
      database.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'ejecutivo',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabla de conversaciones
      database.run(`
        CREATE TABLE IF NOT EXISTS conversations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          client_id INTEGER NOT NULL,
          transcript TEXT,
          analysis TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Tabla de clientes (del catálogo)
      database.run(`
        CREATE TABLE IF NOT EXISTS clients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          telefono TEXT,
          email TEXT,
          deuda REAL,
          estado TEXT DEFAULT 'pendiente',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

module.exports = {
  getDatabase,
  initDatabase
};
