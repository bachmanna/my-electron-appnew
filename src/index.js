const { app, BrowserWindow } = require('electron');
const path = require('path');

// Check for squirrel events (Windows installer events)
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Function to create the main window
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Load the index.html initially
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Once Electron is ready, load the React app
  mainWindow.webContents.once('dom-ready', () => {
    // Load the React app's entry point (change this based on your React setup)
    mainWindow.loadURL('http://localhost:3000'); // Assuming React dev server is running

    // Open the DevTools only in development
    if (process.env.NODE_ENV === 'development') {
      mainWindow.webContents.openDevTools();
    }
  });

  // Listen for window closed event
  mainWindow.on('closed', () => {
    app.quit(); // Quit the app when the window is closed
  });
};

// App ready event
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Activate event - recreate window on macOS if all windows are closed
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Add any additional main process code here as needed
