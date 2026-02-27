import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

// Mock fetch globally
global.fetch = vi.fn()

describe('App Component', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('renders the app title', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('✓ My To-Do App')).toBeInTheDocument()
    })
  })

  it('fetches tasks on mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    render(<App />)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/tasks')
    })
  })

  it('displays loading state initially', () => {
    fetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<App />)

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument()
  })

  it('renders tasks after fetch succeeds', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false, created_at: '2024-01-01' },
      { id: 2, title: 'Task 2', completed: true, created_at: '2024-01-02' }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
      expect(screen.getByText('Task 2')).toBeInTheDocument()
    })
  })

  it('displays error when fetch fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch tasks/)).toBeInTheDocument()
    })
  })

  it('displays error when network request fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument()
    })
  })

  it('renders TaskForm component', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument()
    })
  })

  it('adds a new task when TaskForm submits', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: 1,
          title: 'New Task',
          completed: false,
          created_at: '2024-01-01'
        })
      })

    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'New Task')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument()
    })
  })

  it('deletes a task', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false, created_at: '2024-01-01' }
    ]

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      })

    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    await user.click(deleteButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/tasks/1',
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })
  })

  it('displays error when adding task fails', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 400
      })

    const user = userEvent.setup()
    render(<App />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument()
    })

    const input = screen.getByPlaceholderText('Add a new task...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'New Task')
    await user.click(addButton)

    await waitFor(() => {
      expect(screen.getByText(/Failed to add task/)).toBeInTheDocument()
    })
  })

  it('renders TaskList component', async () => {
    const mockTasks = [
      { id: 1, title: 'Task 1', completed: false, created_at: '2024-01-01' }
    ]

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument()
    })
  })
})
