import * as path from 'path';
import { app } from 'electron';
import Datastore from 'nedb-promises';

// Database path in user data directory
const dbPath = path.join(app.getPath('userData'), 'databases');

// Database instances
const dbs: { [key: string]: Datastore<any> } = {};

/**
 * Get a database instance by name
 * @param name Database name
 * @returns Datastore instance
 */
export function getDatabase(name: string): Datastore<any> {
  if (!dbs[name]) {
    const dbFullPath = path.join(dbPath, `${name}.db`);
    console.log(`Creating/Opening database: ${dbFullPath}`);
    dbs[name] = Datastore.create({
      filename: dbFullPath,
      autoload: true,
      timestampData: true
    });
  }
  return dbs[name];
}

// Initialize the database connection
export async function initializeDatabase(): Promise<void> {
  try {
    console.log(`Initializing NeDB databases at ${dbPath}`);
    
    // Initialize user database and create necessary indexes
    const usersDb = getDatabase('users');
    
    // Create unique index for username field
    await usersDb.ensureIndex({ 
      fieldName: 'username', 
      unique: true 
    });
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}
