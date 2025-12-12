const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // For simple local storage access in this demo
      webSecurity: false // Allow loading local resources easily in dev
    },
    titleBarStyle: 'hiddenInset' // MacOS style header
  });

  // In production, this would load the built React file (e.g., dist/index.html)
  // For development, assuming the React app is served on localhost:1234 (Parcel) or similar
  // OR load the static file directly if built:
  // win.loadFile('dist/index.html');
  
  // For this generic setup, we'll assume a build exists or allow loading from URL
  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../dist/index.html')}`;
  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});