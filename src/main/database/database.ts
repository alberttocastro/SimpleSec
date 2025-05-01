import * as path from 'path';
import { app } from 'electron';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';

// Register PouchDB plugins
PouchDB.plugin(PouchFind);

// Database path in user data directory
const dbPath = path.join(app.getPath('userData'), 'simplesec');

// Database instances
const dbs: { [key: string]: PouchDB.Database } = {};

/**
 * Get a database instance by name
 * @param name Database name
 * @returns PouchDB instance
 */
export function getDatabase(name: string): PouchDB.Database {
  if (!dbs[name]) {
    const dbFullPath = path.join(dbPath, name);
    console.log(`Creating/Opening database: ${dbFullPath}`);
    dbs[name] = new PouchDB(dbFullPath);
  }
  return dbs[name];
}

// Initialize the database connection
export async function initializeDatabase(): Promise<void> {
  try {
    console.log(`Initializing PouchDB databases at ${dbPath}`);
    
    // Initialize user database and create necessary indexes
    const usersDb = getDatabase('users');
    
    try {
      await usersDb.createIndex({
        index: { fields: ['username'] }
      });
      console.log('User database indexes created successfully');
    } catch (err) {
      // Index might already exist, that's fine
      console.log('User database indexes check completed');
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}

// Close database connections
export async function closeDatabase(): Promise<void> {
  try {
    const closePromises = Object.keys(dbs).map(async (name) => {
      await dbs[name].close();
      delete dbs[name];
    });
    
    await Promise.all(closePromises);
    console.log('All database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
    throw error;
  }
}