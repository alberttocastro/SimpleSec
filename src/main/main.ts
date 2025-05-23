/**
 * Entry point of the Election app.
 */
import 'reflect-metadata'; // This must be imported first for decorators to work
import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, ipcMain } from 'electron';
import sequelize, { initializeDatabase } from './database/database';
import * as nodeEnv from '_utils/node-env';
import "./database/models"; // Import models to ensure they are registered
import { Person, Report } from './database/models';

let mainWindow: Electron.BrowserWindow | undefined;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      devTools: nodeEnv.dev,
      preload: path.join(__dirname, './preload.bundle.js'),
      webSecurity: nodeEnv.prod,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html').finally(() => { /* no action */ });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = undefined;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  try {
    // Initialize the database before creating the window
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    if (nodeEnv.dev || nodeEnv.prod) createWindow();
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows.length === 0) createWindow();
  });
}).finally(() => { /* no action */ });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Close database connection when app is about to quit
app.on('will-quit', async (event) => {
  try {
    event.preventDefault();
    console.log('Closing database connection...');
    
    // Close Sequelize connection
    await sequelize.close();
    
    console.log('Database connection closed successfully');
    app.exit(0);
  } catch (error) {
    console.error('Error closing database connection:', error);
    app.exit(1);
  }
});

ipcMain.on('renderer-ready', () => {
  // eslint-disable-next-line no-console
  console.log('Renderer is ready.');
});

// Person entity IPC handlers
ipcMain.handle('persons:findAll', async () => {
  try {
    return await Person.findAll({
      order: [['name', 'ASC']]
    });
  } catch (err) {
    console.error('Error in persons:findAll:', err);
    throw err;
  }
});

ipcMain.handle('persons:findById', async (_, id: number) => {
  try {
    return await Person.findByPk(id);
  } catch (err) {
    console.error(`Error in persons:findById(${id}):`, err);
    throw err;
  }
});

ipcMain.handle('persons:create', async (_, personData: any) => {
  try {
    return await Person.create(personData);
  } catch (err) {
    console.error('Error in persons:create:', err);
    throw err;
  }
});

ipcMain.handle('persons:update', async (_, id: number, personData: any) => {
  try {
    const person = await Person.findByPk(id);
    if (!person) return null;
    
    await person.update(personData);
    return person;
  } catch (err) {
    console.error(`Error in persons:update(${id}):`, err);
    throw err;
  }
});

ipcMain.handle('persons:delete', async (_, id: number) => {
  try {
    const person = await Person.findByPk(id);
    if (!person) return false;
    
    await person.destroy();
    return true;
  } catch (err) {
    console.error(`Error in persons:delete(${id}):`, err);
    throw err;
  }
});

// Report entity IPC handlers
ipcMain.handle('reports:findByPersonId', async (_, personId: number) => {
  try {
    return await Report.findAll({
      where: { userId: personId },
      order: [['year', 'DESC'], ['month', 'DESC']]
    });
  } catch (err) {
    console.error(`Error in reports:findByPersonId(${personId}):`, err);
    throw err;
  }
});

ipcMain.handle('reports:create', async (_, reportData: any) => {
  try {
    return await Report.create(reportData);
  } catch (err) {
    console.error('Error in reports:create:', err);
    throw err;
  }
});

ipcMain.handle('reports:update', async (_, id: number, reportData: any) => {
  try {
    const report = await Report.findByPk(id);
    if (!report) return null;
    
    await report.update(reportData);
    return report;
  } catch (err) {
    console.error(`Error in reports:update(${id}):`, err);
    throw err;
  }
});

ipcMain.handle('reports:delete', async (_, id: number) => {
  try {
    const report = await Report.findByPk(id);
    if (!report) return false;
    
    await report.destroy();
    return true;
  } catch (err) {
    console.error(`Error in reports:delete(${id}):`, err);
    throw err;
  }
});

// eslint-disable-next-line import/prefer-default-export
export const exportedForTests = nodeEnv.test ? { createWindow } : undefined;
