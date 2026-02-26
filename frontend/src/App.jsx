import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = 'http://localhost:8000'

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/tasks`)
      if (!response.ok) throw new Error('Failed to fetch tasks')
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (title) => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: '',
          completed: false
        })
      })
      if (!response.ok) throw new Error('Failed to add task')
      const newTask = await response.json()
      setTasks([...tasks, newTask])
    } catch (err) {
      setError(err.message)
      console.error('Error adding task:', err)
    }
  }

  const updateTask = async (id, updates) => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('Failed to update task')
      const updatedTask = await response.json()
      setTasks(tasks.map(task => task.id === id ? updatedTask : task))
    } catch (err) {
      setError(err.message)
      console.error('Error updating task:', err)
    }
  }

  const deleteTask = async (id) => {
    try {
      setError(null)
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete task')
      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting task:', err)
    }
  }

  return (
    <div className="container">
      <h1>✓ My To-Do App</h1>
      {error && <div className="error">{error}</div>}
      <TaskForm onAddTask={addTask} />
      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <TaskList 
          tasks={tasks} 
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />
      )}
    </div>
  )
}

export default App
