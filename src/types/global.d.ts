import { User } from '_preload/ipc-api';

declare global {
  interface Window {
    /** APIs for Electron IPC */
    ipcAPI?: typeof import('_preload/ipc-api').default
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Window {
  ipcAPI: {
    rendererReady: () => void;
    database: {
      /**
       * Execute a query that returns a single row
       */
      get: (sql: string, params?: any[]) => Promise<any>;
      
      /**
       * Execute a query that returns multiple rows
       */
      all: (sql: string, params?: any[]) => Promise<any[]>;
      
      /**
       * Execute a query that doesn't return data
       */
      run: (sql: string, params?: any[]) => Promise<{id: number, changes: number}>;
    };
    users: {
      findAll: () => Promise<User[]>;
      findById: (id: number) => Promise<User | null>;
      create: (userData: { username: string, name: string }) => Promise<User>;
      update: (id: number, userData: Partial<{ username: string, name: string }>) => Promise<User | null>;
      delete: (id: number) => Promise<boolean>;
    };
  }
}

// Makes TS sees this as an external modules so we can extend the global scope.
export { };
