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
    persons: {
      findAll: () => Promise<any[]>;
      findById: (id: number) => Promise<any | null>;
      create: (personData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
      update: (id: number, personData: Partial<Omit<any, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<any | null>;
      delete: (id: number) => Promise<boolean>;
    };
    reports: {
      findByPersonId: (personId: number) => Promise<any[]>;
      create: (reportData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>) => Promise<any>;
      update: (id: number, reportData: Partial<Omit<any, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<any | null>;
      delete: (id: number) => Promise<boolean>;
    };
  }
}

// Makes TS sees this as an external modules so we can extend the global scope.
export { };
