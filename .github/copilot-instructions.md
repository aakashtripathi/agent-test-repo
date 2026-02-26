# GitHub Copilot Code Review Instructions

This document provides guidelines for GitHub Copilot to perform code reviews on the To-Do App project. Use these standards when reviewing pull requests, suggesting improvements, or generating new code.

## Project Overview

- **Tech Stack**: FastAPI (Python), React (JavaScript), SQLAlchemy ORM, SQLite, Docker
- **Architecture**: Full-stack monorepo with separate `/backend` and `/frontend` directories
- **Package Manager**: pip (Python), npm (Node.js)
- **Database**: SQLite with SQLAlchemy models
- **Deployment**: Docker Compose for local and production environments

---

## Backend Code Review Guidelines (Python/FastAPI)

### 1. Code Style & Conventions

#### Python Standards
- **Format**: Follow PEP 8 style guide
- **Line Length**: Maximum 100 characters
- **Imports**: Group in order: stdlib, third-party, local. Use `from` imports for clarity
- **Naming**:
  - `snake_case` for variables, functions, methods
  - `PascalCase` for classes
  - `UPPER_SNAKE_CASE` for constants
  - Private methods: prefix with `_`

#### Example:
```python
# ✓ Correct
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from datetime import datetime

API_BASE_URL = "http://localhost:3000"

class TaskService:
    def get_all_tasks(self, db: Session) -> List[Task]:
        return db.query(Task).all()
    
    def _validate_task(self, task: Task) -> bool:
        return task.title and len(task.title) > 0

# ✗ Avoid
from fastapi import *
api_base_url = "http://localhost:3000"
```

### 2. FastAPI Route Design

#### Requirements
- All routes must have **docstrings** describing purpose, parameters, and return values
- Use **type hints** on all function parameters and return values
- Use **Pydantic models** for request/response validation
- Implement **proper HTTP status codes** (200, 201, 400, 404, 500)
- Add **response_model** to route decorators for automatic validation and documentation

#### Example:
```python
from typing import List, Optional
from pydantic import BaseModel

class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool
    created_at: datetime

@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)) -> TaskResponse:
    """
    Create a new task.
    
    Args:
        task: TaskCreate schema with title and optional description
        db: Database session dependency
    
    Returns:
        TaskResponse: Created task with auto-generated id and timestamp
    
    Raises:
        HTTPException: 400 if title is empty or missing
    """
    if not task.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")
    
    db_task = Task(title=task.title, description=task.description)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task
```

### 3. Database Models (SQLAlchemy)

#### Requirements
- Define all models in `backend/models.py`
- Use **type hints** for column definitions
- Add **indexes** on frequently queried columns (foreign keys, filter fields)
- Include **default values** where appropriate
- Add **constraints** for data integrity (nullable, unique, check)
- Document model purpose with docstrings

#### Example:
```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Index

class Task(Base):
    """Represents a user task with completion status."""
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    description = Column(String, default="")
    completed = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    __table_args__ = (
        Index('idx_completed_created', 'completed', 'created_at'),
    )
```

### 4. Error Handling

#### Requirements
- Always catch specific exceptions (avoid bare `except`)
- Raise `HTTPException` with appropriate status codes
- Return meaningful error messages
- Log errors for debugging (use Python's `logging` module recommended for future)

#### Example:
```python
from fastapi import HTTPException

try:
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task
except Exception as e:
    raise HTTPException(status_code=500, detail="Internal server error")
```

### 5. Testing (Future Implementation)

When adding tests, follow these standards:
- Use `pytest` as testing framework
- Place tests in `backend/tests/` directory
- Mock database with fixtures
- Test all happy paths and error cases
- Minimum 80% code coverage for critical functions

---

## Frontend Code Review Guidelines (React/JavaScript)

### 1. Code Style & Conventions

#### JavaScript/JSX Standards
- **Format**: Use Prettier for automatic formatting
- **Linter**: Configure ESLint for code quality
- **Line Length**: Maximum 100 characters
- **Naming**:
  - `camelCase` for variables, functions
  - `PascalCase` for React components
  - `UPPER_SNAKE_CASE` for constants
  - Prefix boolean variables/functions with `is`, `has`, `can`, `should`

#### Example:
```jsx
// ✓ Correct
const isTaskCompleted = task.completed;
const TaskItem = ({ task, onUpdate }) => {
  const handleToggleComplete = () => {
    onUpdate(task.id, { completed: !task.completed });
  };
  
  return <li className="task-item">{task.title}</li>;
};

const API_BASE_URL = 'http://localhost:8000';

// ✗ Avoid
const taskCompleted = task.completed;
const taskitem = ({ task, onUpdate }) => { /* ... */ };
const api_base_url = 'http://localhost:8000';
```

### 2. React Component Structure

#### Requirements
- **Functional Components**: Use only functional components with hooks (no class components)
- **Hooks**: Use `useState`, `useEffect`, `useContext`, `useCallback` appropriately
- **Composition**: Break large components into smaller, reusable components
- **Props**: Define prop validation using PropTypes or TypeScript (recommended for future)
- **Documentation**: Add JSDoc comments for complex components

#### Example:
```jsx
/**
 * TaskItem Component
 * 
 * Displays a single task with completion checkbox and delete button.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object with id, title, completed
 * @param {Function} props.onUpdate - Callback to update task (id, updates) => void
 * @param {Function} props.onDelete - Callback to delete task (id) => void
 * @returns {React.ReactElement}
 */
function TaskItem({ task, onUpdate, onDelete }) {
  const handleToggleComplete = useCallback(
    (e) => onUpdate(task.id, { completed: e.target.checked }),
    [task.id, onUpdate]
  );

  const handleDelete = useCallback(() => onDelete(task.id), [task.id, onDelete]);

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggleComplete}
        aria-label={`Mark '${task.title}' as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <span>{task.title}</span>
      <button onClick={handleDelete} aria-label={`Delete '${task.title}'`}>
        Delete
      </button>
    </li>
  );
}
```

### 3. State Management

#### Requirements
- Keep state as **local as possible** (useState at component level)
- Use **lifting state up** only when needed by multiple siblings
- Avoid **prop drilling** (use Context API if prop drilling becomes deep)
- Avoid **unnecessary state** - compute derived values instead

#### Example:
```jsx
// ✓ Correct: State at appropriate level
function TaskList({ tasks, onRemoveTask }) {
  const [sortOrder, setSortOrder] = useState('newest');
  
  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => {
      return sortOrder === 'newest' ? b.id - a.id : a.id - b.id;
    }),
    [tasks, sortOrder]
  );

  return (
    <>
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      {sortedTasks.map(task => (
        <TaskItem key={task.id} task={task} onDelete={onRemoveTask} />
      ))}
    </>
  );
}

// ✗ Avoid: Computing in render or unnecessary state
function TaskList({ tasks }) {
  const [sortedTasks, setSortedTasks] = useState(tasks);
  
  useEffect(() => {
    setSortedTasks([...tasks].sort((a, b) => b.id - a.id));
  }, [tasks]);
}
```

### 4. API Communication

#### Requirements
- Extract API calls into **custom hooks** or **utility functions**
- Use **try-catch** for error handling
- Always **clean up** subscriptions in `useEffect` cleanup function
- Set **loading and error states** before making requests
- Never expose raw `fetch` calls in components (abstract into utility)

#### Example:
```jsx
// ✓ Correct: Custom hook for API logic
function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks
  };
}

// Component stays clean
function App() {
  const { tasks, loading, error } = useTasks();
  
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return <TaskList tasks={tasks} />;
}
```

### 5. Styling

#### Requirements
- Use **CSS Modules** or **scoped CSS** (one CSS file per component)
- Follow **BEM naming convention**: `block__element--modifier`
- Avoid **inline styles** (use CSS classes instead)
- Use **CSS custom properties** for theme colors (recommended for future)
- Keep **responsive design** with mobile-first approach

#### Example:
```css
/* TaskItem.css */
.task-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 8px;
}

.task-item.completed {
  opacity: 0.6;
}

.task-item__checkbox {
  margin-right: 12px;
  cursor: pointer;
}

.task-item__title {
  flex: 1;
  color: #333;
}

.task-item__button--delete {
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.task-item__button--delete:hover {
  background-color: #ff5252;
}

/* Responsive */
@media (max-width: 480px) {
  .task-item {
    padding: 10px;
  }
  
  .task-item__title {
    font-size: 14px;
  }
}
```

---

## Shared Guidelines (Backend & Frontend)

### 1. Git & Version Control

#### Commit Messages
Follow **conventional commits** format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
```
feat(backend): add task filter by status endpoint
fix(frontend): prevent multiple form submissions
docs: update API documentation
refactor(backend): extract database queries into repository pattern
```

#### Branch Naming
- Feature: `feature/task-filtering`
- Bug fix: `bugfix/form-validation`
- Hotfix: `hotfix/critical-crash`
- Docs: `docs/update-readme`

### 2. Security Practices

#### Backend Security
- **CORS**: Specify allowed origins instead of `*` in production
- **SQL Injection**: Always use parameterized queries (SQLAlchemy handles this)
- **Input Validation**: Validate all user input using Pydantic models
- **Authentication**: Implement JWT/OAuth for sensitive endpoints (future enhancement)
- **HTTPS**: Always use HTTPS in production

#### Frontend Security
- **XSS Prevention**: React auto-escapes JSX content (safer than innerHTML)
- **API URLs**: Never hardcode secrets; use environment variables
- **Input Sanitization**: Trim and validate user input before sending to API
- **Data Privacy**: Don't store sensitive data in localStorage without encryption

#### Both
```python
# Backend: Always validate input
from pydantic import BaseModel, Field, validator

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    
    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be only whitespace')
        return v.strip()
```

```jsx
// Frontend: Sanitize and validate input
const sanitizeInput = (input) => {
  return String(input).trim().slice(0, 255);
};

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const sanitizedTitle = sanitizeInput(title);
    
    if (!sanitizedTitle) {
      setError('Title cannot be empty');
      return;
    }
    
    onAddTask(sanitizedTitle);
  };
}
```

### 3. Performance Optimization

#### Backend
- Add **database indexes** on frequently queried columns
- Use **pagination** for endpoints returning lists
- Implement **caching** for frequently accessed data
- Use **connection pooling** for database connections
- Monitor **query execution time**

#### Frontend
- Use **React.memo** for components that don't need frequent re-renders
- Use **useCallback** to memoize event handlers
- Use **useMemo** to memoize expensive computations
- Implement **code splitting** for large applications
- Lazy load **images and heavy components**
- Use **virtualization** for long lists (future enhancement)

#### Example:
```jsx
// ✓ Correct: Memoize to prevent unnecessary re-renders
const TaskItem = React.memo(
  ({ task, onUpdate, onDelete }) => {
    const handleToggle = useCallback(
      (e) => onUpdate(task.id, { completed: e.target.checked }),
      [task.id, onUpdate]
    );

    return (
      <li className={task.completed ? 'completed' : ''}>
        <input type="checkbox" onChange={handleToggle} />
        <span>{task.title}</span>
      </li>
    );
  },
  (prevProps, nextProps) => 
    prevProps.task.id === nextProps.task.id && 
    prevProps.task.completed === nextProps.task.completed
);
```

### 4. Documentation

#### Code Comments
- Add **docstrings** to functions and classes
- Explain **why** not **what** (code shows what it does)
- Keep comments **up-to-date** with code changes
- Use **inline comments** sparingly for complex logic

#### Example:
```python
# ✓ Correct: Explain the business logic
def get_tasks(
    db: Session = Depends(get_db),
    completed: Optional[bool] = None
) -> List[TaskResponse]:
    """
    Retrieve tasks with optional filtering by completion status.
    
    Args:
        db: Database session
        completed: Filter by completion status. None returns all tasks.
    
    Returns:
        List of tasks matching the filter criteria
    """
    query = db.query(Task)
    if completed is not None:
        # Only search completed tasks if explicitly requested
        query = query.filter(Task.completed == completed)
    return query.order_by(Task.created_at.desc()).all()

# ✗ Avoid: State the obvious
def get_tasks(db):
    # Get all tasks from database
    return db.query(Task).all()
```

### 5. Testing Strategy

#### When to Write Tests
- All API endpoints should have tests
- Complex business logic should have tests
- Bug fixes should include regression tests
- Critical user flows should have integration tests

#### Test Structure (Future)
```python
# backend/tests/test_tasks.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

@pytest.fixture
def sample_task():
    response = client.post("/tasks", json={"title": "Test Task"})
    return response.json()

def test_create_task():
    response = client.post("/tasks", json={"title": "New Task"})
    assert response.status_code == 201
    assert response.json()["title"] == "New Task"

def test_get_tasks_empty():
    response = client.get("/tasks")
    assert response.status_code == 200
    assert response.json() == []

def test_update_task(sample_task):
    task_id = sample_task["id"]
    response = client.put(f"/tasks/{task_id}", json={"completed": True})
    assert response.status_code == 200
    assert response.json()["completed"] is True
```

---

## Docker & Deployment Standards

### 1. Dockerfile Best Practices
- Use **specific version tags** (not `latest`)
- Leverage **layer caching** (put frequently changing lines last)
- Use **multi-stage builds** for smaller images
- Include **health checks** where applicable
- Document exposed ports and volumes in comments

### 2. Docker Compose
- Keep services **organized and readable**
- Use **named volumes** for persistent data
- Set **environment variables** with `.env` file
- Configure **depends_on** for startup order
- Include **health checks** for critical services

### 3. Environment Variables
- Never commit `.env` files with secrets
- Use `.env.example` template with placeholder values
- Document all required variables in README
- Use **environment variables** for API URLs, database connections, API keys

---

## Common Anti-Patterns to Avoid

### Backend
```python
# ✗ Avoid: Wildcard imports
from fastapi import *

# ✗ Avoid: Bare except clauses
try:
    db.commit()
except:
    pass

# ✗ Avoid: Hardcoded credentials
DATABASE_URL = "postgresql://user:password@localhost/db"

# ✗ Avoid: SQL in strings (though SQLAlchemy prevents this)
result = db.execute("SELECT * FROM tasks WHERE id = " + str(task_id))

# ✓ Correct: Use dependency injection
@app.post("/tasks")
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    pass
```

### Frontend
```jsx
// ✗ Avoid: Large monolithic components
function App() {
  // 500+ lines of JSX and logic
}

// ✗ Avoid: API calls without error handling
useEffect(() => {
  fetch('/api/tasks').then(r => r.json()).then(setTasks);
}, []);

// ✗ Avoid: Props drilling
<TaskList tasks={tasks} onUpdate={onUpdate} onDelete={onDelete} onRefresh={onRefresh} ... />

// ✗ Avoid: Inline styles for everything
<div style={{ color: 'red', padding: '10px' }}>Task</div>

// ✗ Avoid: No loading/error states
const { tasks } = useTasks(); // What if it fails?

// ✓ Correct: Separate concerns and handle states
function useApiCall(url, initialData = null) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(url);
      setData(await response.json());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);
  
  return { data, loading, error, execute };
}
```

---

## Code Review Checklist

When reviewing PRs, verify:

- [ ] **Code Quality**: Follows style guide and conventions
- [ ] **Type Safety**: Uses type hints (Python) or TypeScript (JavaScript)
- [ ] **Error Handling**: Appropriate try-catch and error responses
- [ ] **Security**: No hardcoded secrets, input validation, SQL injection prevention
- [ ] **Performance**: No N+1 queries, memoization where needed
- [ ] **Testing**: Changes include tests or marked for future testing
- [ ] **Documentation**: Comments and docstrings explain complex logic
- [ ] **Git Hygiene**: Sensible commits, clear messages
- [ ] **Dependencies**: Versions pinned, no unnecessary packages
- [ ] **Database**: Migrations added if schema changes
- [ ] **API Compatibility**: No breaking changes without documentation

---

## Rapid Response Templates

### For Code Issues
```
✓ Looks good! This follows our conventions for [backend/frontend].
Approved.
```

### For Improvements
```
Consider extracting this logic into a [custom hook/service] to improve 
testability and reusability. Current approach works but [explain benefit].
```

### For Security Issues
```
⚠️ Security concern: [specific issue]. 
Recommendation: [suggested fix]
Reference: [security best practice link]
```

---

## Related Documentation

- [API Documentation](../README.md#api-endpoints)
- [Project README](../README.md)
- [Backend Setup](../backend/README.md) (create if needed)
- [Frontend Setup](../frontend/README.md) (create if needed)

---

**Last Updated**: February 26, 2026
**Maintainers**: Development Team
