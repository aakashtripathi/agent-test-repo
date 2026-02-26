import TaskItem from './TaskItem'
import './TaskList.css'

function TaskList({ tasks, onUpdateTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return <div className="empty-state">No tasks yet. Add one to get started!</div>
  }

  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      ))}
    </ul>
  )
}

export default TaskList
