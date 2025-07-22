import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Calendar, Tag, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Select } from '@/app/components/ui/select'
import { Checkbox } from '@/app/components/ui/checkbox'
import { Badge } from '@/app/components/ui/badge'
import { Task, TaskFilters } from '@/app/types/task'

const CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Learning', 'Other']

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'all',
    priority: 'all',
    category: 'all',
    search: ''
  })

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    category: 'Work',
    dueDate: ''
  })

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Status filter
      if (filters.status === 'pending' && task.completed) return false
      if (filters.status === 'completed' && !task.completed) return false
      
      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false
      
      // Category filter
      if (filters.category !== 'all' && task.category !== filters.category) return false
      
      // Search filter
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !task.description.toLowerCase().includes(filters.search.toLowerCase())) return false
      
      return true
    })
  }, [tasks, filters])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      category: 'Work',
      dueDate: ''
    })
  }

  const addTask = () => {
    if (!formData.title.trim()) return
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      completed: false,
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setTasks(prev => [newTask, ...prev])
    resetForm()
    setShowAddForm(false)
  }

  const updateTask = () => {
    if (!editingTask || !formData.title.trim()) return
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? {
            ...task,
            title: formData.title.trim(),
            description: formData.description.trim(),
            priority: formData.priority,
            category: formData.category,
            dueDate: formData.dueDate,
            updatedAt: new Date().toISOString()
          }
        : task
    ))
    
    resetForm()
    setEditingTask(null)
  }

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    ))
  }

  const startEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate
    })
    setShowAddForm(true)
  }

  const cancelEdit = () => {
    setEditingTask(null)
    resetForm()
    setShowAddForm(false)
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const isOverdue = date < today && !date.toDateString().includes(today.toDateString())
    
    return (
      <span className={`flex items-center gap-1 text-sm ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
        <Calendar className="w-3 h-3" />
        {date.toLocaleDateString()}
        {isOverdue && <AlertCircle className="w-3 h-3" />}
      </span>
    )
  }

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    const overdue = tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length
    
    return { total, completed, pending, overdue }
  }, [tasks])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your tasks and boost your productivity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.overdue}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
            <div className="flex flex-col sm:flex-row gap-2 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search tasks..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as TaskFilters['status'] }))}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </Select>
              
              <Select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as TaskFilters['priority'] }))}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </Select>
              
              <Select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </div>
            
            <Button 
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Task title..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg"
                />
              </div>
              
              <div className="md:col-span-2">
                <textarea
                  placeholder="Task description (optional)..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <Select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </Select>
              
              <Select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
              
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingTask ? updateTask : addTask}>
                {editingTask ? 'Update Task' : 'Add Task'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                {tasks.length === 0 ? "No tasks yet!" : "No tasks match your filters"}
              </div>
              <div className="text-gray-400 dark:text-gray-500">
                {tasks.length === 0 ? "Create your first task to get started" : "Try adjusting your search or filters"}
              </div>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 ${
                task.completed 
                  ? 'border-green-500 opacity-75' 
                  : task.priority === 'high' 
                    ? 'border-red-500' 
                    : task.priority === 'medium' 
                      ? 'border-yellow-500' 
                      : 'border-blue-500'
              }`}>
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className={`font-medium text-gray-900 dark:text-white ${
                        task.completed ? 'line-through opacity-60' : ''
                      }`}>
                        {task.title}
                      </h3>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {task.category}
                        </Badge>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={`text-gray-600 dark:text-gray-400 text-sm mb-2 ${
                        task.completed ? 'line-through opacity-60' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {task.dueDate && formatDate(task.dueDate)}
                        <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(task)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteTask(task.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskManager
