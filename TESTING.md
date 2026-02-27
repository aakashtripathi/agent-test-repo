# Testing Guide

This document provides comprehensive information about running tests locally and in GitHub Actions CI/CD pipeline.

## Overview

The To-Do App project includes comprehensive test suites for both backend and frontend:

- **Backend Tests**: pytest-based API tests with database tests
- **Frontend Tests**: Vitest with React Testing Library for component tests
- **CI/CD**: GitHub Actions workflow that runs tests on every PR and push to main/tests

## Backend Testing

### Setup

```bash
cd backend
pip install -r requirements.txt
```

### Running Tests

#### Run all tests
```bash
pytest tests/ -v
```

#### Run specific test file
```bash
pytest tests/test_tasks.py -v
```

#### Run specific test class
```bash
pytest tests/test_tasks.py::TestGetTasks -v
```

#### Run specific test
```bash
pytest tests/test_tasks.py::TestGetTasks::test_get_empty_tasks -v
```

#### Run with coverage report
```bash
pytest tests/ --cov=. --cov-report=html --cov-report=term
```

This generates an HTML coverage report in `htmlcov/index.html`

### Backend Test Files

- **test_tasks.py**: API endpoint tests
  - TestGetTasks: GET /tasks endpoint tests
  - TestCreateTask: POST /tasks endpoint tests
  - TestGetTaskById: GET /tasks/{id} endpoint tests
  - TestUpdateTask: PUT /tasks/{id} endpoint tests
  - TestDeleteTask: DELETE /tasks/{id} endpoint tests
  - TestTaskIntegration: Integration tests for complete workflows

- **test_models.py**: Database model tests
  - TestTaskModel: Task model creation, persistence, and operations

### Test Database

Tests use an in-memory SQLite database (`test.db`) that is created and destroyed for each test session to ensure isolation.

## Frontend Testing

### Setup

```bash
cd frontend
npm install
```

### Running Tests

#### Run all tests
```bash
npm run test
```

#### Run tests in watch mode (re-runs on file changes)
```bash
npm run test -- --watch
```

#### Run tests with UI
```bash
npm run test:ui
```

#### Run tests with coverage
```bash
npm run test:coverage
```

### Frontend Test Files

- **App.test.jsx**: Main App component tests
  - Component rendering and initialization
  - Task fetching from API
  - Error handling
  - Loading states
  - Task CRUD operations

- **TaskForm.test.jsx**: TaskForm component tests
  - Form rendering
  - Input value handling
  - Form submission
  - Input validation
  - Multiple submissions

- **TaskItem.test.jsx**: TaskItem component tests
  - Task rendering
  - Checkbox state management
  - Delete button functionality
  - Completed task styling
  - Props updates

- **TaskList.test.jsx**: TaskList component tests
  - Empty state rendering
  - Multiple tasks rendering
  - List updates
  - Task item rendering with props

### Test Utilities

Tests use the following libraries:
- **Vitest**: Fast unit test framework
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **vi (vitest)**: Mocking and spy utilities

## GitHub Actions Workflow

The `.github/workflows/tests.yml` file defines the CI/CD pipeline.

### Workflow Configuration

The workflow runs on:
- **Push** to `main` and `tests` branches
- **Pull Requests** to `main` branch

### Jobs

#### 1. Backend Tests
- Runs on Python 3.10 and 3.11
- Installs dependencies from `backend/requirements.txt`
- Executes pytest with verbose output
- Generates coverage reports
- Uploads coverage to Codecov

#### 2. Frontend Tests
- Runs on Node.js 18
- Installs dependencies from `frontend/package.json`
- Executes Vitest
- Generates coverage reports
- Uploads coverage to Codecov

#### 3. Lint and Format
- Validates code style and dependencies
- Prepares environment for potential linting tools

#### 4. Test Summary
- Final job that summarizes all test results
- Displays results in GitHub PR check summary

### Viewing Results

1. Go to your Pull Request on GitHub
2. Scroll down to "Checks" section
3. Click "Details" next to the "Tests" workflow
4. View detailed logs for each job

### Coverage Reports

Coverage reports are automatically generated and uploaded to Codecov.com (if configured):
- Backend: Python code coverage (`pytest --cov`)
- Frontend: JavaScript code coverage (`vitest --coverage`)

## Best Practices

### Writing Tests

1. **Descriptive Names**: Use clear, descriptive test names
   ```python
   # Good
   def test_create_task_with_empty_title_should_create_with_empty_description():
   
   # Bad
   def test_create():
   ```

2. **One Assertion Per Test**: Keep tests focused
   ```python
   # Good
   def test_task_title_is_correct():
       response = client.post("/tasks", json={"title": "Test"})
       assert response.json()["title"] == "Test"
   
   # Bad
   def test_create_task():
       response = client.post("/tasks", json={"title": "Test"})
       assert response.status_code == 200
       assert response.json()["title"] == "Test"
       assert "id" in response.json()
   ```

3. **Use Fixtures**: Leverage pytest and vitest fixtures for setup/teardown
   ```python
   @pytest.fixture
   def sample_task(client):
       response = client.post("/tasks", json={"title": "Test"})
       return response.json()
   
   def test_get_sample_task(client, sample_task):
       response = client.get(f"/tasks/{sample_task['id']}")
       assert response.status_code == 200
   ```

4. **Test Both Happy and Sad Paths**:
   ```python
   def test_create_task_success(): # happy path
       ...
   
   def test_create_task_validation_error(): # sad path
       ...
   ```

5. **Use Meaningful Assertions**:
   ```python
   # Good
   assert response.status_code == 404, "Task not found error expected"
   
   # Bad
   assert response.status_code == 404
   ```

### Running Tests Locally Before Push

```bash
# Backend
cd backend
pytest tests/ -v

# Frontend
cd frontend
npm run test

# Both
cd backend && pytest tests/ && cd ../frontend && npm run test
```

### Debugging Tests

#### Backend
```bash
# Run with print statements visible
pytest tests/ -v -s

# Run with pdb on failure
pytest tests/ --pdb

# Run with more verbose output
pytest tests/ -vv
```

#### Frontend
```bash
# Run with UI for visual debugging
npm run test:ui

# Run specific test in watch mode
npm run test -- TaskForm.test.jsx --watch

# Run with browser DevTools
npm run test -- --inspect-brk
```

## Troubleshooting

### Backend Tests Fail

1. **SQLAlchemy Import Error**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Database Lock Error**
   - Delete `test.db` if it exists
   - Run `pytest tests/ --tb=short` for more details

3. **Fixture Not Found**
   - Verify `conftest.py` is in the `tests/` directory
   - Ensure proper imports

### Frontend Tests Fail

1. **Module Not Found**
   ```bash
   cd frontend
   npm install
   npm run test -- --no-cache
   ```

2. **Test Timeout**
   - Increase timeout in vitest.config.js:
     ```js
     test: {
       testTimeout: 10000
     }
   ```

3. **Fetch Mock Issues**
   - Ensure fetch is mocked before test runs
   - Check mock setup in test file

## Coverage Goals

Target coverage metrics:
- **Backend**: ≥ 80% for critical paths
- **Frontend**: ≥ 80% for component tests
- **Overall**: ≥ 75% across both

## Adding New Tests

When adding new features:

1. Write the test first (TDD approach)
2. Implement the feature to pass the test
3. Add edge case tests
4. Run full test suite locally
5. Commit tests with feature code
6. Create PR - GitHub Actions will run tests automatically

## Resources

- [Pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [FastAPI Testing](https://fastapi.tiangolo.com/advanced/testing-dependencies/)

## Questions or Issues?

If tests fail or you need help:
1. Check the GitHub Actions logs
2. Run tests locally to reproduce
3. Review test documentation above
4. Check if dependencies are installed correctly
