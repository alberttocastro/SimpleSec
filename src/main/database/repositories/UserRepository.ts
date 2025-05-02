import { UserModel } from '../entities';

/**
 * Repository service for User entity operations using Sequelize
 */
export class UserRepository {
  /**
   * Find all users
   * @returns Promise with array of users
   */
  static async findAll(): Promise<UserModel[]> {
    try {
      const users = await UserModel.findAll({
        order: [['createdAt', 'DESC']]
      });
      return users.map(user => user.toJSON());
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
  static async findById(id: string): Promise<UserModel | null> {
    try {
      const user = await UserModel.findByPk(id);
      return user ? user.toJSON() : null;
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
  static async findByUsername(username: string): Promise<UserModel | null> {
    try {
      const user = await UserModel.findOne({ where: { username } });
      return user ? user.toJSON() : null;
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
  static async create(userData: Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserModel> {
    try {
      const user = await UserModel.create(userData);
      return user.toJSON();
    } catch (error) {
      if ((error as any).name === 'SequelizeUniqueConstraintError') {
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
  static async update(id: string, userData: Partial<Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>>): Promise<UserModel | null> {
    try {
      // Check if user exists
      const user = await UserModel.findByPk(id);
      if (!user) {
        return null;
      }

      // Check username uniqueness if it's being updated
      if (userData.username && userData.username !== user.username) {
        const duplicate = await this.findByUsername(userData.username);
        if (duplicate) {
          throw new Error(`Username ${userData.username} is already taken`);
        }
      }

      // Update user
      await user.update(userData);
      return user.toJSON();
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
      const numDeleted = await UserModel.destroy({ where: { id } });
      return numDeleted > 0;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }
}