const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 840,
    minWidth: 800,
    minHeight: 600,
    title: 'TimeToPages - LDS Scripture Time & Page Reference',
    backgroundColor: '#080A10',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Remove default menu bar for clean modern window
  Menu.setApplicationMenu(null);

  // In production load dist/index.html, in dev load localhost
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
