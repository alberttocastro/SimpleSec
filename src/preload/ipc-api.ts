// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';

/** Notify main the renderer is ready. */
function rendererReady() {
  ipcRenderer.send('renderer-ready');
}

/**
 * User data types
 */
export interface User {
  _id?: string;
  _rev?: string;
  type: 'user';
  username: string;
  name: string;
  createdAt: string;
}

/**
 * User repository operations exposed to the renderer
 */
const users = {
  /**
   * Find all users
   * @returns Promise with array of users
   */
  findAll: (): Promise<User[]> => 
    ipcRenderer.invoke('users:findAll'),
  
  /**
   * Find user by ID
   * @param id User ID
   * @returns Promise with the user or null if not found
   */
  findById: (id: string): Promise<User | null> => 
    ipcRenderer.invoke('users:findById', id),
  
  /**
   * Create a new user
   * @param userData User data
   * @returns Promise with the created user
   */
  create: (userData: { username: string, name: string }): Promise<User> => 
    ipcRenderer.invoke('users:create', userData),
  
  /**
   * Update user data
   * @param id User ID
   * @param userData User data to update
   * @returns Promise with the updated user
   */
  update: (id: string, userData: Partial<{ username: string, name: string }>): Promise<User | null> => 
    ipcRenderer.invoke('users:update', id, userData),
  
  /**
   * Delete a user
   * @param id User ID
   * @returns Promise with delete result
   */
  delete: (id: string): Promise<boolean> => 
    ipcRenderer.invoke('users:delete', id)
};

export default { rendererReady, users };
