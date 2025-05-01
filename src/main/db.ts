import sqlite3 from 'sqlite3';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';

// Configure SQLite with verbose mode for better error reporting
const sqlite = sqlite3.verbose();

// Set up database path in the user data directory
const dbPath = path.join(app.getPath('userData'), 'simplesec.db');

// Database connection instance
let db: sqlite3.Database;

/**
 * Initialize the database connection and create tables if they don't exist
 */
export function initDatabase(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    console.log(`Initializing database at ${dbPath}`);
    
    // Ensure the directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Create or open the database
    db = new sqlite.Database(dbPath, (err) => {
      if (err) {
        console.error('Database opening error: ', err);
        reject(err);
        return;
      }
      
      console.log('Connected to the SQLite database');
      
      // Enable foreign keys
      db.run('PRAGMA foreign_keys = ON');
      
      // Create tables (add your schema here)
      createTables()
        .then(() => {
          console.log('Database initialized successfully');
          resolve();
        })
        .catch((tableErr) => {
          console.error('Error creating tables:', tableErr);
          reject(tableErr);
        });
    });
  });
}

/**
 * Create database tables if they don't exist
 */
function createTables(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    // Execute table creation queries
    db.serialize(() => {
      // Example table: Create a 'users' table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Example table: Create a 'notes' table with foreign key to users
        db.run(`CREATE TABLE IF NOT EXISTS notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )`, (notesErr) => {
          if (notesErr) {
            reject(notesErr);
            return;
          }
          resolve();
        });
      });
    });
  });
}

/**
 * Close the database connection
 */
export function closeDatabase(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
          reject(err);
          return;
        }
        console.log('Database connection closed');
        resolve();
      });
    } else {
      resolve();
    }
  });
}

/**
 * Run a query that doesn't return data
 */
export function run(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(this: any, err) {
      if (err) {
        console.error('Error running SQL: ' + sql);
        console.error(err);
        reject(err);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Run a query that returns a single row
 */
export function get(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('Error running SQL: ' + sql);
        console.error(err);
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

/**
 * Run a query that returns all rows
 */
export function all(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Error running SQL: ' + sql);
        console.error(err);
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}