import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';
import { Sequelize } from 'sequelize';
import { SequelizeOptions } from 'sequelize-typescript';

// Database path in user data directory
const dbPath = path.join(app.getPath('userData'), 'databases');
const dbFilePath = path.join(dbPath, 'database.sqlite');

// Ensure the database directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

// Sequelize options with TypeScript models support
const sequelizeOptions: SequelizeOptions = {
  dialect: 'sqlite',
  storage: dbFilePath,
  logging: console.log
};

// Create Sequelize instance
const sequelize = new Sequelize(sequelizeOptions);

// Initialize the database connection
export async function initializeDatabase(): Promise<void> {
  try {
    console.log(`Initializing SQLite database at ${dbFilePath}`);
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    // log available models
    const models = sequelize.models;
    console.log('Available models:', Object.keys(models));
    
    // Sync models with database (will be implemented in model files)
    await sequelize.sync({ force: true });
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}

// Export the sequelize instance to be used by models
export default sequelize;
