/**
 * Entry point of the Election app.
 */
import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserWindow, app, ipcMain } from 'electron';
import * as nodeEnv from '_utils/node-env';
import { initializeDatabase } from './database/database';
import { UserRepository } from './database/repositories/UserRepository';

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
  event.preventDefault();
  app.exit(0);
});

ipcMain.on('renderer-ready', () => {
  // eslint-disable-next-line no-console
  console.log('Renderer is ready.');
});

// User entity IPC handlers
ipcMain.handle('users:findAll', async () => {
  try {
    return await UserRepository.findAll();
  } catch (err) {
    console.error('Error in users:findAll:', err);
    throw err;
  }
});

ipcMain.handle('users:findById', async (_, id: string) => {
  try {
    return await UserRepository.findById(id);
  } catch (err) {
    console.error(`Error in users:findById(${id}):`, err);
    throw err;
  }
});

ipcMain.handle('users:create', async (_, userData: { username: string, name: string }) => {
  try {
    return await UserRepository.create(userData);
  } catch (err) {
    console.error('Error in users:create:', err);
    throw err;
  }
});

ipcMain.handle('users:update', async (_, id: string, userData: Partial<{ username: string, name: string }>) => {
  try {
    return await UserRepository.update(id, userData);
  } catch (err) {
    console.error(`Error in users:update(${id}):`, err);
    throw err;
  }
});

ipcMain.handle('users:delete', async (_, id: string) => {
  try {
    return await UserRepository.delete(id);
  } catch (err) {
    console.error(`Error in users:delete(${id}):`, err);
    throw err;
  }
});

// eslint-disable-next-line import/prefer-default-export
export const exportedForTests = nodeEnv.test ? { createWindow } : undefined;
