export interface User {
  _id?: string;
  _rev?: string;
  type: 'user';
  username: string;
  name: string;
  createdAt: string;
}

/**
 * Create a new User object
 * @param username User's username
 * @param name User's name
 * @returns User object
 */
export function createUser(username: string, name: string): User {
  return {
    type: 'user',
    username,
    name,
    createdAt: new Date().toISOString()
  };
}