// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';


/** Notify main the renderer is ready. */
function rendererReady() {
  ipcRenderer.send('renderer-ready');
}

/**
 * Person repository operations exposed to the renderer
 */
const persons = {
  /**
   * Find all persons
   * @returns Promise with array of persons
   */
  findAll: (): Promise<any[]> => 
    ipcRenderer.invoke('persons:findAll'),
  
  /**
   * Find person by ID
   * @param id Person ID
   * @returns Promise with the person or null if not found
   */
  findById: (id: number): Promise<any | null> => 
    ipcRenderer.invoke('persons:findById', id),
  
  /**
   * Create a new person
   * @param personData Person data
   * @returns Promise with the created person
   */
  create: (personData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>): Promise<any> => 
    ipcRenderer.invoke('persons:create', personData),
  
  /**
   * Update person data
   * @param id Person ID
   * @param personData Person data to update
   * @returns Promise with the updated person
   */
  update: (id: number, personData: Partial<Omit<any, 'id' | 'createdAt' | 'updatedAt'>>): Promise<any | null> => 
    ipcRenderer.invoke('persons:update', id, personData),
  
  /**
   * Delete a person
   * @param id Person ID
   * @returns Promise with delete result
   */
  delete: (id: number): Promise<boolean> => 
    ipcRenderer.invoke('persons:delete', id)
};

export default { rendererReady, persons };
