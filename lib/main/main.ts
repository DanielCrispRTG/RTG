import { app, BrowserWindow, protocol } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createAppWindow } from './app'

// Enable live reload for development (if available)
if (!app.isPackaged) {
  try {
    require('electron-reload')(__dirname, {
      electron: require('electron'),
      hardResetMethod: 'exit'
    })
  } catch (e) {
    // electron-reload not available, continue without it
    console.log('📝 Development: electron-reload not available')
  }
}

// Ensure single instance application
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  // Another instance is running, quit this one
  console.log('🔒 Another instance is already running. Quitting...')
  app.quit()
} else {
  // Register protocols BEFORE app is ready (best practice)
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'res',
      privileges: {
        secure: true,
        standard: true,
        corsEnabled: true,
        supportFetchAPI: true
      }
    }
  ])

  // Handle second instance attempts
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, focus our window instead
    console.log('🔄 Second instance detected, focusing existing window...')
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      const mainWindow = windows[0]
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
      mainWindow.show()
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  app.whenReady().then(async () => {
    console.log('🚀 App is ready, starting initialization...')
    
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.rtg.taskmanager')
    
    try {
      // Create app window
      await createAppWindow()
      console.log('✅ App window created successfully')
    } catch (error) {
      console.error('❌ Failed to create app window:', error)
    }

    // Default open or close DevTools by F12 in development
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    app.on('activate', function () {
      console.log('📱 App activated')
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createAppWindow()
      }
    })
  })

  // Quit when all windows are closed, except on macOS
  app.on('window-all-closed', () => {
    console.log('🪟 All windows closed')
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // Handle app termination
  app.on('before-quit', (event) => {
    console.log('🛑 App is about to quit...')
  })

  app.on('will-quit', (event) => {
    console.log('🔄 App will quit...')
  })

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.error('💥 Uncaught Exception:', error)
  })

  process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason)
  })
}
