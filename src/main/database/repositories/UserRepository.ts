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
      const result = await this.db.find({
        selector: { type: 'user' },
        sort: [{ createdAt: 'desc' }]
      });
      
      return result.docs as User[];
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
  static async findById(id: number | string): Promise<User | null> {
    try {
      const docId = typeof id === 'number' ? id.toString() : id;
      const user = await this.db.get(docId) as User;
      return user;
    } catch (error) {
      if ((error as any).status === 404) {
        return null;
      }
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
      const result = await this.db.find({
        selector: { 
          type: 'user',
          username: username 
        }
      });

      if (result.docs.length === 0) {
        return null;
      }
      
      return result.docs[0] as User;
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
      // Check if username is already taken
      const existing = await this.findByUsername(userData.username);
      if (existing) {
        throw new Error(`Username ${userData.username} is already taken`);
      }
      
      // Create new user
      const user = createUser(userData.username, userData.name);
      const response = await this.db.post(user);
      
      // Return the user with the generated id
      return {
        ...user,
        _id: response.id,
        _rev: response.rev
      };
    } catch (error) {
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
  static async update(id: number | string, userData: Partial<User>): Promise<User | null> {
    try {
      const docId = typeof id === 'number' ? id.toString() : id;
      
      // Get the current user
      const currentUser = await this.findById(docId);
      if (!currentUser) {
        return null;
      }
      
      // Check username uniqueness if it's being updated
      if (userData.username && userData.username !== currentUser.username) {
        const existing = await this.findByUsername(userData.username);
        if (existing) {
          throw new Error(`Username ${userData.username} is already taken`);
        }
      }
      
      // Update the user
      const updatedUser = {
        ...currentUser,
        ...userData
      };
      
      const response = await this.db.put(updatedUser);
      
      // Return the updated user
      return {
        ...updatedUser,
        _rev: response.rev
      };
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
  static async delete(id: number | string): Promise<boolean> {
    try {
      const docId = typeof id === 'number' ? id.toString() : id;
      
      // Get the current document to get its revision
      const doc = await this.db.get(docId);
      await this.db.remove(doc);
      
      return true;
    } catch (error) {
      if ((error as any).status === 404) {
        return false;
      }
      console.error('Error in delete:', error);
      throw error;
    }
  }
}