// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import { _Person } from '../main/database/models/Person';
import { _Report } from '../main/database/models/Report';
import SequelizeResponse from '_/types/SequelizeResponse';


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
  findAll: (): Promise<SequelizeResponse<_Person>[]> => 
    ipcRenderer.invoke('persons:findAll'),
  
  /**
   * Find person by ID
   * @param id Person ID
   * @returns Promise with the person or null if not found
   */
  findById: (id: number): Promise<SequelizeResponse<_Person> | null> => 
    ipcRenderer.invoke('persons:findById', id),
  
  /**
   * Create a new person
   * @param personData Person data
   * @returns Promise with the created person
   */
  create: (personData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>): Promise<SequelizeResponse<_Person>> => 
    ipcRenderer.invoke('persons:create', personData),
  
  /**
   * Update person data
   * @param id Person ID
   * @param personData Person data to update
   * @returns Promise with the updated person
   */
  update: (id: number, personData: Partial<Omit<any, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SequelizeResponse<_Person> | null> => 
    ipcRenderer.invoke('persons:update', id, personData),
  
  /**
   * Delete a person
   * @param id Person ID
   * @returns Promise with delete result
   */
  delete: (id: number): Promise<boolean> => 
    ipcRenderer.invoke('persons:delete', id)
};

/**
 * Report repository operations exposed to the renderer
 */
const reports = {
  /**
   * Find reports for a specific person
   * @param personId Person ID
   * @returns Promise with array of reports
   */
  findByPersonId: (personId: number): Promise<SequelizeResponse<_Report>[]> => 
    ipcRenderer.invoke('reports:findByPersonId', personId),
  
  /**
   * Create a new report
   * @param reportData Report data
   * @returns Promise with the created report
   */
  create: (reportData: Omit<any, 'id' | 'createdAt' | 'updatedAt'>): Promise<SequelizeResponse<_Report>> => 
    ipcRenderer.invoke('reports:create', reportData),
  
  /**
   * Update report data
   * @param id Report ID
   * @param reportData Report data to update
   * @returns Promise with the updated report
   */
  update: (id: number, reportData: Partial<Omit<any, 'id' | 'createdAt' | 'updatedAt'>>): Promise<SequelizeResponse<_Report> | null> => 
    ipcRenderer.invoke('reports:update', id, reportData),
  
  /**
   * Delete a report
   * @param id Report ID
   * @returns Promise with delete result
   */
  delete: (id: number): Promise<boolean> => 
    ipcRenderer.invoke('reports:delete', id)
};

export default { rendererReady, persons, reports };
