# Frontend Tests

This directory contains all component tests for the frontend built with Vitest and React Testing Library.

## Structure

```
src/
├── components/
│   └── __tests__/
│       ├── TaskForm.test.jsx   # TaskForm component tests
│       ├── TaskItem.test.jsx   # TaskItem component tests
│       └── TaskList.test.jsx   # TaskList component tests
└── __tests__/
    └── App.test.jsx             # Main App component tests
```

## Running Tests

See [TESTING.md](../../TESTING.md) for detailed instructions on running tests.

## Test Coverage

- **App.test.jsx**: ~11 test cases covering main app functionality
- **TaskForm.test.jsx**: ~8 test cases covering form behavior
- **TaskItem.test.jsx**: ~9 test cases covering individual task items
- **TaskList.test.jsx**: ~8 test cases covering task list rendering

### Test Categories

#### App Component Tests
- Rendering and UI display
- API data fetching
- Loading and error states
- CRUD operations
- Error handling

#### TaskForm Component Tests
- Form rendering
- Input handling
- Submission behavior
- Validation
- Edge cases (empty input, whitespace)

#### TaskItem Component Tests
- Task rendering
- Checkbox interaction
- Delete button functionality
- Styling based on state
- Props updates

#### TaskList Component Tests
- Empty state rendering
- Multiple tasks rendering
- List updates
- Component composition

## Mocking

### Global Mocks

Tests mock the `fetch` API globally to avoid making real API calls:

```javascript
global.fetch = vi.fn()

// Reset mocks between tests
beforeEach(() => {
  fetch.mockClear()
})
```

### Component Mocks

Tests use `vi.fn()` to create mock callback functions:

```javascript
const mockOnAddTask = vi.fn()
render(<TaskForm onAddTask={mockOnAddTask} />)
```

## Testing Patterns

### 1. User Interaction Testing

```javascript
const user = userEvent.setup()
await user.type(input, 'Task text')
await user.click(button)
```

### 2. Async Operations

```javascript
await waitFor(() => {
  expect(screen.getByText('Task')).toBeInTheDocument()
})
```

### 3. Props Updates

```javascript
const { rerender } = render(<Component task={task1} />)
rerender(<Component task={task2} />)
```

## Adding New Tests

1. Create test file in appropriate `__tests__` directory
2. Use `.test.jsx` extension
3. Import testing utilities:
   ```javascript
   import { describe, it, expect, vi, beforeEach } from 'vitest'
   import { render, screen, waitFor } from '@testing-library/react'
   import userEvent from '@testing-library/user-event'
   ```
4. Follow test structure:
   ```javascript
   describe('ComponentName', () => {
     it('should do something', () => {
       // Test code
     })
   })
   ```

## Best Practices

- Use semantic queries: `getByRole`, `getByLabelText`, `getByPlaceholderText`
- Avoid implementation details: test behavior not implementation
- Use `waitFor` for async operations
- Set up `userEvent.setup()` for user interactions
- Clear mocks between tests with `beforeEach`
- Use descriptive test names
- Group related tests in `describe` blocks

## Debugging Tests

### Run with UI
```bash
npm run test:ui
```

### Run in watch mode
```bash
npm run test -- --watch
```

### Run specific test file
```bash
npm run test -- TaskForm.test.jsx
```

### Check coverage
```bash
npm run test:coverage
```
