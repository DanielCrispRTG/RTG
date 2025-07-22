import { BrowserWindow, shell, app, protocol, net } from 'electron'
import { join } from 'path'
import { registerWindowIPC } from '@/lib/window/ipcEvents'
import appIcon from '@/resources/build/icon.png?asset'
import { pathToFileURL } from 'url'

let mainWindow: BrowserWindow | null = null

export async function createAppWindow(): Promise<BrowserWindow> {
  // If window already exists, return it
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.focus()
    return mainWindow
  }

  console.log('🏗️ Creating new app window...')

  // Register protocol handler after app is ready
  await registerResourcesProtocol()

  // Create the main window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    backgroundColor: '#1c1c1c',
    icon: appIcon,
    frame: true, // Use native frame for better stability
    titleBarStyle: 'default',
    title: 'RTG Task Manager',
    maximizable: true,
    resizable: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Register IPC events for the main window
  registerWindowIPC(mainWindow)

  // Handle window events
  mainWindow.on('ready-to-show', () => {
    console.log('✅ Window ready to show')
    if (mainWindow) {
      mainWindow.show()
      if (!app.isPackaged) {
        mainWindow.webContents.openDevTools()
      }
    }
  })

  mainWindow.on('closed', () => {
    console.log('🗑️ Window closed')
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Enhanced error handling for web contents
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('❌ Failed to load:', errorCode, errorDescription, validatedURL)
  })

  mainWindow.webContents.on('crashed', (event, killed) => {
    console.error('💥 Renderer process crashed:', { killed })
  })

  // Load the app
  try {
    if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
      console.log('🔧 Loading development URL:', process.env['ELECTRON_RENDERER_URL'])
      await mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      const htmlPath = join(__dirname, '../renderer/index.html')
      console.log('📁 Loading production file:', htmlPath)
      await mainWindow.loadFile(htmlPath)
    }
  } catch (error) {
    console.error('❌ Failed to load app content:', error)
  }

  return mainWindow
}

// Protocol registration with proper error handling
async function registerResourcesProtocol(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Check if protocol is already handled
      if (protocol.isProtocolHandled('res')) {
        console.log('⚠️ Protocol "res" already registered, skipping...')
        resolve()
        return
      }

      console.log('🔧 Registering "res" protocol...')
      
      protocol.handle('res', async (request) => {
        try {
          const url = new URL(request.url)
          const fullPath = join(url.hostname, url.pathname.slice(1))
          const filePath = join(__dirname, '../../resources', fullPath)
          
          console.log('📁 Protocol request for:', filePath)
          
          return net.fetch(pathToFileURL(filePath).toString())
        } catch (error) {
          console.error('❌ Protocol handler error:', error)
          return new Response('Resource not found', { 
            status: 404,
            statusText: 'Not Found'
          })
        }
      })

      console.log('✅ Protocol "res" registered successfully')
      resolve()
      
    } catch (error) {
      console.error('❌ Failed to register protocol:', error)
      // Don't reject - continue without protocol
      resolve()
    }
  })
}

// Get the main window instance
export function getMainWindow(): BrowserWindow | null {
  return mainWindow
}

// Clean shutdown
export function cleanup(): void {
  console.log('🧹 Cleaning up resources...')
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close()
  }
  mainWindow = null
}
