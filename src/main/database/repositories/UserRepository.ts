import { getDatabase } from '../database';
import { User, createUser } from '../entities/User';

/**
 * Repository service for User entity operations
 */
export class UserRepository {
  private static get db() {
    return getDatabase('users');
  }

  /**
   * Find all users
   * @returns Promise with array of users
   */
  static async findAll(): Promise<User[]> {
    try {
      return await this.db.find({}).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  /**
   * Find user by ID
   * @param id User ID
   * @returns Promise with user or null if not found
   */
  static async findById(id: string): Promise<User | null> {
    try {
      const user = await this.db.findOne({ _id: id });
      return user || null;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  /**
   * Find user by username
   * @param username Username
   * @returns Promise with user or null if not found
   */
  static async findByUsername(username: string): Promise<User | null> {
    try {
      const user = await this.db.findOne({ username });
      return user || null;
    } catch (error) {
      console.error('Error in findByUsername:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param userData User data
   * @returns Promise with the created user
   */
  static async create(userData: { username: string, name: string }): Promise<User> {
    try {
      // Create new user - uniqueness handled by database index
      const user = createUser(userData.username, userData.name);
      return await this.db.insert(user);
    } catch (error) {
      if ((error as any).errorType === 'uniqueViolated') {
        throw new Error(`Username ${userData.username} is already taken`);
      }
      console.error('Error in create:', error);
      throw error;
    }
  }

  /**
   * Update user data
   * @param id User ID
   * @param userData User data to update
   * @returns Promise with the updated user
   */
  static async update(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      // Check if user exists
      const exists = await this.findById(id);
      if (!exists) {
        return null;
      }
      
      // Check username uniqueness if it's being updated
      if (userData.username && userData.username !== exists.username) {
        const duplicate = await this.findByUsername(userData.username);
        if (duplicate) {
          throw new Error(`Username ${userData.username} is already taken`);
        }
      }
      
      // Update user
      const numUpdated = await this.db.update(
        { _id: id }, 
        { $set: userData },
        { returnUpdatedDocs: true }
      );
      
      if (numUpdated === 0) {
        return null;
      }
      
      return this.findById(id);
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param id User ID
   * @returns Promise with delete result
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const numRemoved = await this.db.remove({ _id: id }, {});
      return numRemoved > 0;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}