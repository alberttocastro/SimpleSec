import * as path from 'path';
import { app } from 'electron';
import { Sequelize } from 'sequelize';

// Database path in user data directory
const dbPath = path.join(app.getPath('userData'), 'databases');
const dbFilePath = path.join(dbPath, 'database.sqlite');

// Create Sequelize instance
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbFilePath,
  logging: console.log,
});

// Initialize the database connection
export async function initializeDatabase(): Promise<void> {
  try {
    console.log(`Initializing SQLite database at ${dbFilePath}`);
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    // Sync models with database (will be implemented in model files)
    await sequelize.sync({ alter: true });
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}

// Export the sequelize instance to be used by models
export default sequelize;
