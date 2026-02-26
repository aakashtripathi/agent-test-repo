import './TaskItem.css'

function TaskItem({ task, onUpdate, onDelete }) {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => onUpdate(task.id, { completed: e.target.checked })}
          className="task-checkbox"
        />
        <span className="task-title">{task.title}</span>
      </div>
      <button
        onClick={() => onDelete(task.id)}
        className="delete-button"
      >
        Delete
      </button>
    </li>
  )
}

export default TaskItem
