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
  id: number;
  username: string;
  name: string;
  createdAt: Date;
  notes?: Note[];
}

/**
 * Note data types
 */
export interface Note {
  id: number;
  userId: number;
  title: string;
  content?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
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
  findById: (id: number): Promise<User | null> => 
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
  update: (id: number, userData: Partial<{ username: string, name: string }>): Promise<User | null> => 
    ipcRenderer.invoke('users:update', id, userData),
  
  /**
   * Delete a user
   * @param id User ID
   * @returns Promise with delete result
   */
  delete: (id: number): Promise<boolean> => 
    ipcRenderer.invoke('users:delete', id)
};

/**
 * Note repository operations exposed to the renderer
 */
const notes = {
  /**
   * Find all notes
   * @returns Promise with array of notes
   */
  findAll: (): Promise<Note[]> => 
    ipcRenderer.invoke('notes:findAll'),
  
  /**
   * Find notes by user ID
   * @param userId User ID
   * @returns Promise with array of notes
   */
  findByUserId: (userId: number): Promise<Note[]> => 
    ipcRenderer.invoke('notes:findByUserId', userId),
  
  /**
   * Find note by ID
   * @param id Note ID
   * @returns Promise with the note or null if not found
   */
  findById: (id: number): Promise<Note | null> => 
    ipcRenderer.invoke('notes:findById', id),
  
  /**
   * Create a new note
   * @param noteData Note data
   * @returns Promise with the created note
   */
  create: (noteData: { userId: number, title: string, content?: string }): Promise<Note> => 
    ipcRenderer.invoke('notes:create', noteData),
  
  /**
   * Update note data
   * @param id Note ID
   * @param noteData Note data to update
   * @returns Promise with the updated note
   */
  update: (id: number, noteData: Partial<{ title: string, content?: string }>): Promise<Note | null> => 
    ipcRenderer.invoke('notes:update', id, noteData),
  
  /**
   * Delete a note
   * @param id Note ID
   * @returns Promise with delete result
   */
  delete: (id: number): Promise<boolean> => 
    ipcRenderer.invoke('notes:delete', id)
};

export default { rendererReady, users, notes };
