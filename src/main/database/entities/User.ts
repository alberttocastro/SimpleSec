export interface User {
  _id?: string;
  username: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create a new User object
 * @param username User's username
 * @param name User's name
 * @returns User object
 */
export function createUser(username: string, name: string): User {
  return {
    username,
    name
  };
}