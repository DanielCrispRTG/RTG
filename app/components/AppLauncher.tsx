import React, { useState } from 'react'
import { AppWindow, CheckSquare, Calculator, FileText, Music, Settings } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import TaskManager from '@/app/components/apps/TaskManager'
import Calculator from '@/app/components/apps/Calculator'
import WelcomeKit from '@/app/components/welcome/WelcomeKit'

type AppType = 'welcome' | 'tasks' | 'calculator' | 'notes' | 'music' | 'settings'

const apps = [
  { id: 'welcome' as AppType, name: 'Welcome', icon: AppWindow, description: 'Framework Demo' },
  { id: 'tasks' as AppType, name: 'Task Manager', icon: CheckSquare, description: 'Organize your tasks' },
  { id: 'calculator' as AppType, name: 'Calculator', icon: Calculator, description: 'Math calculations' },
  { id: 'notes' as AppType, name: 'Notes', icon: FileText, description: 'Take notes' },
  { id: 'music' as AppType, name: 'Music Player', icon: Music, description: 'Play your music' },
  { id: 'settings' as AppType, name: 'Settings', icon: Settings, description: 'App preferences' },
]

// Placeholder components for future apps
const PlaceholderApp = ({ name }: { name: string }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm max-w-md">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This app is ready to be built! You can create it using the same framework.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Edit <code>app/components/apps/{name.replace(' ', '')}.tsx</code> to get started
      </p>
    </div>
  </div>
)

const AppLauncher = () => {
  const [currentApp, setCurrentApp] = useState<AppType>('welcome')

  const renderApp = () => {
    switch (currentApp) {
      case 'welcome':
        return <WelcomeKit />
      case 'tasks':
        return <TaskManager />
      case 'calculator':
        return <Calculator />
      case 'notes':
        return <PlaceholderApp name="Notes" />
      case 'music':
        return <PlaceholderApp name="Music Player" />
      case 'settings':
        return <PlaceholderApp name="Settings" />
      default:
        return <WelcomeKit />
    }
  }

  return (
    <div className="min-h-screen">
      {/* App Switcher - Show only if not on welcome screen */}
      {currentApp !== 'welcome' && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
          <div className="flex items-center gap-2 max-w-6xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentApp('welcome')}
              className="text-xs"
            >
              ← Apps
            </Button>
            <div className="text-sm text-gray-500 dark:text-gray-400">|</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {apps.find(app => app.id === currentApp)?.name}
            </div>
          </div>
        </div>
      )}

      {/* Current App */}
      {currentApp === 'welcome' ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 RTG App Framework
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                Your Multi-App Desktop Platform
              </p>
              <p className="text-gray-500 dark:text-gray-500">
                Built with Electron + React + TypeScript + TailwindCSS
              </p>
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {apps.slice(1).map((app) => {
                const Icon = app.icon
                return (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setCurrentApp(app.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {app.name}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {app.description}
                    </p>
                    <Button className="w-full" onClick={() => setCurrentApp(app.id)}>
                      {(app.id === 'tasks' || app.id === 'calculator') ? 'Open App' : 'Coming Soon'}
                    </Button>
                  </div>
                )
              })}
            </div>

            {/* Framework Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🛠️ Your Development Framework
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">✅ Ready to Use:</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Task Manager (fully functional)</li>
                    <li>• UI Components (Input, Button, etc.)</li>
                    <li>• Dark/Light mode support</li>
                    <li>• Cross-platform builds</li>
                    <li>• Hot reload development</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🚀 Build More Apps:</h3>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                    <li>• Calculator</li>
                    <li>• Note-taking app</li>
                    <li>• Music player</li>
                    <li>• Settings panel</li>
                    <li>• Any app you imagine!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        renderApp()
      )}
    </div>
  )
}

export default AppLauncher
