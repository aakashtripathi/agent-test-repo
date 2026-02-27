import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskItem from '../TaskItem'

describe('TaskItem Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: '2024-01-01T00:00:00'
  }

  it('renders task title', () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders checkbox with correct initial state', () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  it('renders checkbox as checked when task is completed', () => {
    const completedTask = { ...mockTask, completed: true }
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TaskItem
        task={completedTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('renders delete button', () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()

    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('calls onUpdate when checkbox is toggled', async () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTask.id, { completed: true })
  })

  it('calls onDelete when delete button is clicked', async () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    const user = userEvent.setup()

    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id)
  })

  it('applies completed class when task is completed', () => {
    const completedTask = { ...mockTask, completed: true }
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()

    const { container } = render(
      <TaskItem
        task={completedTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const listItem = container.querySelector('li')
    expect(listItem).toHaveClass('completed')
  })

  it('does not apply completed class when task is not completed', () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()

    const { container } = render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    const listItem = container.querySelector('li')
    expect(listItem).not.toHaveClass('completed')
  })

  it('toggles checkbox state correctly', async () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()
    const user = userEvent.setup()

    const { rerender } = render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    let checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(mockOnUpdate).toHaveBeenCalledWith(mockTask.id, { completed: true })

    // Simulate task update
    const updatedTask = { ...mockTask, completed: true }
    rerender(
      <TaskItem
        task={updatedTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('renders correct task title for different tasks', () => {
    const mockOnUpdate = vi.fn()
    const mockOnDelete = vi.fn()

    const { rerender } = render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Test Task')).toBeInTheDocument()

    const differentTask = { ...mockTask, id: 2, title: 'Different Task' }
    rerender(
      <TaskItem
        task={differentTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.queryByText('Test Task')).not.toBeInTheDocument()
    expect(screen.getByText('Different Task')).toBeInTheDocument()
  })
})
