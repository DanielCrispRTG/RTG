export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TaskFilters {
  status: 'all' | 'pending' | 'completed'
  priority: 'all' | 'low' | 'medium' | 'high'
  category: string
  search: string
}
