const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable hardware acceleration to avoid some background-only issues on certain Windows setups
app.disableHardwareAcceleration();

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1000,
        minHeight: 700,
        show: false, // Start hidden then show
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
        backgroundColor: '#0d0d12',
    });

    // In a packaged Electron app, __dirname is the folder containing this file (resources/app)
    const indexPath = path.join(__dirname, 'dist', 'index.html');

    win.loadFile(indexPath).then(() => {
        win.show();
    }).catch(err => {
        console.error('Failed to load index.html:', err);
        // Fallback or alert would go here, but since it's an exe, we just hope for the best
    });

    // win.webContents.openDevTools(); // Uncomment for debugging if needed
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
