import { useState } from 'react'
import './TaskForm.css'

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAddTask(title)
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit">Add</button>
    </form>
  )
}

export default TaskForm
