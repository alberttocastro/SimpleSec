import 'reflect-metadata';
import * as TypeORM from 'typeorm';
import * as path from 'path';
import { app } from 'electron';
import { User } from './entities/User';

// Database file path in user data directory
const dbPath = path.join(app.getPath('userData'), 'simplesec.sqlite');

// Create a data source (connection) configuration
export const AppDataSource = new TypeORM.DataSource({
  type: 'sqlite',
  database: dbPath,
  synchronize: true, // Automatically creates database schema (in development)
  logging: process.env.NODE_ENV === 'development',
  entities: [User],
  migrations: [],
  subscribers: [],
});

// Initialize the database connection
export async function initializeDatabase(): Promise<TypeORM.DataSource> {
  try {
    console.log(`Initializing database at ${dbPath}`);
    const dataSource = await AppDataSource.initialize();
    console.log('Database connection established successfully');
    return dataSource;
  } catch (error) {
    console.error('Error during database initialization:', error);
    throw error;
  }
}

// Close database connection
export async function closeDatabase(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
    throw error;
  }
}