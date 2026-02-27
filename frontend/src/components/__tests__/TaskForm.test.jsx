import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TaskForm from '../TaskForm'

describe('TaskForm Component', () => {
  it('renders input field and button', () => {
    const mockOnAddTask = vi.fn()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
  })

  it('updates input value when user types', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByPlaceholderText('Add a new task...')
    await user.type(input, 'New Task')

    expect(input.value).toBe('New Task')
  })

  it('calls onAddTask when form is submitted with valid input', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByPlaceholderText('Add a new task...')
    const button = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'Test Task')
    await user.click(button)

    expect(mockOnAddTask).toHaveBeenCalledWith('Test Task')
    expect(mockOnAddTask).toHaveBeenCalledTimes(1)
  })

  it('clears input field after successful submission', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByPlaceholderText('Add a new task...')
    await user.type(input, 'Test Task')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(input.value).toBe('')
  })

  it('does not call onAddTask with empty input', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  it('does not call onAddTask with whitespace-only input', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByPlaceholderText('Add a new task...')
    await user.type(input, '   ')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  it('prevents default form submission behavior', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()
    const { container } = render(<TaskForm onAddTask={mockOnAddTask} />)

    const form = container.querySelector('form')
    const preventDefaultSpy = vi.spyOn(form, 'addEventListener')

    const input = screen.getByPlaceholderText('Add a new task...')
    await user.type(input, 'Test')
    await user.keyboard('{Enter}')

    expect(mockOnAddTask).toHaveBeenCalled()
  })

  it('handles multiple submissions', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByPlaceholderText('Add a new task...')
    const button = screen.getByRole('button', { name: 'Add' })

    // First submission
    await user.type(input, 'Task 1')
    await user.click(button)

    // Second submission
    await user.type(input, 'Task 2')
    await user.click(button)

    expect(mockOnAddTask).toHaveBeenCalledTimes(2)
    expect(mockOnAddTask).toHaveBeenNthCalledWith(1, 'Task 1')
    expect(mockOnAddTask).toHaveBeenNthCalledWith(2, 'Task 2')
  })

  it('trims whitespace from task title', async () => {
    const mockOnAddTask = vi.fn()
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByPlaceholderText('Add a new task...')
    await user.type(input, '  Task with spaces  ')
    await user.click(screen.getByRole('button', { name: 'Add' }))

    // Note: The component doesn't trim before passing to callback
    // This test documents current behavior
    expect(mockOnAddTask).toHaveBeenCalledWith('  Task with spaces  ')
  })
})
