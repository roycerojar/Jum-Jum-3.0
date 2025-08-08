const { app, BrowserWindow } = require('electron')

let mainWindow

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 400,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true
    },
    title: "🍛 Bakshana Tinder"
  })

  // Load your HTML file
  mainWindow.loadFile('index.html')

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// When Electron is ready
app.whenReady().then(createWindow)

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})