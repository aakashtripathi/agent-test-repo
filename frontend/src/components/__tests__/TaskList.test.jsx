import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskList from '../TaskList'

describe('TaskList Component', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      created_at: '2024-01-01T00:00:00'
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      completed: true,
      created_at: '2024-01-02T00:00:00'
    }
  ]

  it('renders empty state when no tasks', () => {
    const mockOnUpdateTask = vi.fn()
    const mockOnDeleteTask = vi.fn()

    render(
      <TaskList
        tasks={[]}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('No tasks yet. Add one to get started!')).toBeInTheDocument()
  })

  it('renders all tasks', () => {
    const mockOnUpdateTask = vi.fn()
    const mockOnDeleteTask = vi.fn()

    render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('does not render empty state when tasks exist', () => {
    const mockOnUpdateTask = vi.fn()
    const mockOnDeleteTask = vi.fn()

    render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.queryByText('No tasks yet. Add one to get started!')).not.toBeInTheDocument()
  })

  it('renders task list as unordered list', () => {
    const mockOnUpdateTask = vi.fn()
    const mockOnDeleteTask = vi.fn()

    const { container } = render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(container.querySelector('ul')).toBeInTheDocument()
  })

  it('renders correct number of list items', () => {
    const mockOnUpdateTask = vi.fn()
    const mockOnDeleteTask = vi.fn()

    const { container } = render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    const listItems = container.querySelectorAll('li')
    expect(listItems).toHaveLength(2)
  })

  it('passes correct props to TaskItem components', () => {
    const mockOnUpdateTask = vi.fn()
    const mockOnDeleteTask = vi.fn()

    render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    // Check that both tasks are rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('updates when tasks prop changes', () => {
    const mockOnUpdateTask = vi.fn()
    const mockOnDeleteTask = vi.fn()

    const { rerender } = render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()

    // Update with only one task
    const updatedTasks = [mockTasks[0]]
    rerender(
      <TaskList
        tasks={updatedTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument()
  })

  it('renders empty list correctly', () => {
    const mockOnUpdateTask = vi.fn()
    const mockOnDeleteTask = vi.fn()

    const singleTask = [mockTasks[0]]
    const { container, rerender } = render(
      <TaskList
        tasks={singleTask}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(container.querySelector('ul')).toBeInTheDocument()

    // Update to empty list
    rerender(
      <TaskList
        tasks={[]}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('No tasks yet. Add one to get started!')).toBeInTheDocument()
    expect(container.querySelector('ul')).not.toBeInTheDocument()
  })

  it('renders tasks with correct keys', () => {
    const mockOnUpdateTask = vi.fn()
    const mockOnDeleteTask = vi.fn()

    const { container, rerender } = render(
      <TaskList
        tasks={mockTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    let items = container.querySelectorAll('li')
    expect(items).toHaveLength(2)

    // Add more tasks
    const moreTasks = [
      ...mockTasks,
      {
        id: 3,
        title: 'Task 3',
        description: 'Description 3',
        completed: false,
        created_at: '2024-01-03T00:00:00'
      }
    ]

    rerender(
      <TaskList
        tasks={moreTasks}
        onUpdateTask={mockOnUpdateTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    items = container.querySelectorAll('li')
    expect(items).toHaveLength(3)
  })
})
