import { AppDataSource } from '../database';
import { User } from '../entities/User';

/**
 * Repository service for User entity operations
 */
export class UserRepository {
  /**
   * Find all users
   * @returns Promise with array of users
   */
  static async findAll(): Promise<User[]> {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  /**
   * Find user by ID
   * @param id User ID
   * @returns Promise with user or null if not found
   */
  static async findById(id: number): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({
      where: { id },
      relations: ['notes']
    });
  }

  /**
   * Find user by username
   * @param username Username
   * @returns Promise with user or null if not found
   */
  static async findByUsername(username: string): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({
      where: { username }
    });
  }

  /**
   * Create a new user
   * @param userData User data
   * @returns Promise with the created user
   */
  static async create(userData: { username: string, name: string }): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create(userData);
    return userRepository.save(user);
  }

  /**
   * Update user data
   * @param id User ID
   * @param userData User data to update
   * @returns Promise with the updated user
   */
  static async update(id: number, userData: Partial<User>): Promise<User | null> {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.update(id, userData);
    return this.findById(id);
  }

  /**
   * Delete a user
   * @param id User ID
   * @returns Promise with delete result
   */
  static async delete(id: number): Promise<boolean> {
    const userRepository = AppDataSource.getRepository(User);
    const result = await userRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}