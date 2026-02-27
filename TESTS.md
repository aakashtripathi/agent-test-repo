# Test Suite Documentation

This document provides a comprehensive overview of all tests in the To-Do App project, including what they test, how to run them, and how they integrate with the CI/CD pipeline.

## Overview

The project includes a comprehensive test suite with **66 total tests**:
- **Backend**: 29 pytest tests (Python/FastAPI)
- **Frontend**: 37 Vitest tests (React/JavaScript)

All tests run automatically on every commit to the `tests` branch via GitHub Actions.

---

## Backend Tests (29 tests)

Located in: `backend/tests/`

### Test Structure

The backend test suite is organized into two main test files:

#### 1. `test_tasks.py` (22 tests)

Tests for all CRUD operations on tasks via the FastAPI API endpoints.

**Test Classes:**

##### `TestGetTasks` (4 tests)
- `test_get_tasks_on_empty_database`: Verify empty list returned when no tasks exist
- `test_get_multiple_tasks`: Verify multiple tasks are returned correctly
- `test_get_tasks_response_format`: Verify response structure matches TaskResponse schema
- `test_get_tasks_ordered_by_creation`: Verify tasks are ordered by created_at timestamp

**Tests HTTP GET /tasks endpoint**

##### `TestCreateTask` (4 tests)
- `test_create_task_with_valid_data`: Verify task creation with title and description
- `test_create_task_with_title_only`: Verify task creation with only title (description optional)
- `test_create_task_response_structure`: Verify response includes id and created_at timestamp
- `test_create_task_with_empty_title_fails`: Verify validation rejects empty titles

**Tests HTTP POST /tasks endpoint**

##### `TestGetTaskById` (3 tests)
- `test_get_existing_task`: Verify retrieval of single task by ID
- `test_get_nonexistent_task`: Verify 404 response for non-existent task ID
- `test_get_task_returns_all_fields`: Verify all task fields returned correctly

**Tests HTTP GET /tasks/{id} endpoint**

##### `TestUpdateTask` (6 tests)
- `test_update_task_title`: Verify title can be updated
- `test_update_task_completed_status`: Verify completion status toggle works
- `test_update_task_description`: Verify description can be updated
- `test_update_nonexistent_task`: Verify 404 response for non-existent task
- `test_update_task_multiple_fields`: Verify multiple fields can be updated together
- `test_update_task_preserves_other_fields`: Verify unmodified fields remain unchanged

**Tests HTTP PUT /tasks/{id} endpoint**

##### `TestDeleteTask` (4 tests)
- `test_delete_existing_task`: Verify task deletion returns success
- `test_delete_nonexistent_task`: Verify 404 response for non-existent task
- `test_delete_task_removes_from_list`: Verify deleted task no longer appears in list
- `test_delete_all_tasks`: Verify multiple tasks can be deleted sequentially

**Tests HTTP DELETE /tasks/{id} endpoint**

##### `TestTaskIntegration` (2 tests)
- `test_complete_task_workflow`: End-to-end workflow: create → read → update → delete
- `test_multiple_tasks_crud_operations`: Verify multiple CRUD operations work correctly in sequence

**Integration tests verifying multi-operation workflows**

#### 2. `test_models.py` (7 tests)

Tests for SQLAlchemy ORM models and database operations.

##### Database Model Tests
- `test_task_creation`: Verify Task model instantiation with required fields
- `test_task_persistence`: Verify tasks persist correctly in database
- `test_task_update`: Verify task attributes can be modified and saved
- `test_task_deletion`: Verify tasks can be deleted from database
- `test_task_table_exists`: Verify tasks table is created correctly
- `test_task_defaults`: Verify default values (completed=False, created_at=now)
- `test_task_field_types`: Verify field types match schema expectations

**Tests database persistence and ORM functionality**

### Running Backend Tests

```bash
# Run all backend tests
cd backend
python -m pytest tests/ -v

# Run specific test file
python -m pytest tests/test_tasks.py -v

# Run specific test class
python -m pytest tests/test_tasks.py::TestCreateTask -v

# Run with coverage
python -m pytest tests/ --cov=. --cov-report=html

# Run tests with output
python -m pytest tests/ -v -s
```

### Backend Test Configuration

- **Framework**: pytest 7.4.3
- **Async Support**: pytest-asyncio 0.21.1
- **Database**: SQLite (in-memory for testing)
- **HTTP Client**: httpx 0.25.2 (TestClient)
- **Configuration**: `pytest.ini`
- **Fixtures**: `backend/tests/conftest.py`

**Key Fixtures:**
- `test_db`: Creates isolated test database per test
- `client`: FastAPI TestClient for API testing
- `session`: Database session for direct ORM testing

---

## Frontend Tests (37 tests)

Located in: `frontend/src/`

### Test Structure

The frontend test suite is organized into individual test files for each component plus integration tests.

#### 1. `components/__tests__/TaskForm.test.jsx` (7 tests)

Tests for the TaskForm component (add task input form).

**Tests:**
- `test_renders_input_field_and_button`: Verify form elements render correctly
- `test_updates_input_value_when_user_types`: Verify input state updates on user typing
- `test_calls_onAddTask_when_form_submitted_with_valid_input`: Verify form submission callback works
- `test_clears_input_field_after_successful_submission`: Verify form resets after submission
- `test_does_not_call_onAddTask_with_empty_input`: Verify validation prevents empty submissions
- `test_does_not_call_onAddTask_with_whitespace_only_input`: Verify whitespace-only input rejected
- `test_handles_multiple_submissions`: Verify form works correctly for multiple submissions

**Component Features Tested:**
- Input field rendering and updates
- Form submission handling
- Input validation (empty/whitespace checks)
- Callback invocation with correct data
- Form state reset after submission

#### 2. `components/__tests__/TaskItem.test.jsx` (10 tests)

Tests for the TaskItem component (individual task in list).

**Tests:**
- `test_renders_task_title`: Verify task title displays
- `test_renders_checkbox_with_correct_initial_state`: Verify checkbox reflects completion status
- `test_renders_checkbox_as_checked_when_task_completed`: Verify completed tasks show checked checkbox
- `test_renders_delete_button`: Verify delete button renders
- `test_calls_onUpdate_when_checkbox_toggled`: Verify checkbox toggle triggers callback
- `test_calls_onDelete_when_delete_button_clicked`: Verify delete button triggers callback
- `test_applies_completed_class_when_task_completed`: Verify CSS styling for completed tasks
- `test_does_not_apply_completed_class_when_task_not_completed`: Verify CSS styling for active tasks
- `test_toggles_checkbox_state_correctly`: Verify checkbox state changes on user interaction
- `test_renders_correct_task_title_for_different_tasks`: Verify component works with various task data

**Component Features Tested:**
- Task title rendering
- Completion checkbox (rendering and state)
- Delete button (rendering and callback)
- CSS class application based on completion status
- Callback invocation with correct task ID and data
- Multiple task instances with different data

#### 3. `components/__tests__/TaskList.test.jsx` (9 tests)

Tests for the TaskList component (list of all tasks).

**Tests:**
- `test_renders_empty_state_when_no_tasks`: Verify "no tasks" message displays when empty
- `test_renders_all_tasks`: Verify all tasks display in the list
- `test_does_not_render_empty_state_when_tasks_exist`: Verify empty message hidden when tasks present
- `test_renders_task_list_as_unordered_list`: Verify semantic HTML structure (ul/li)
- `test_renders_correct_number_of_list_items`: Verify task count matches input data
- `test_passes_correct_props_to_TaskItem_components`: Verify child components receive correct props
- `test_updates_when_tasks_prop_changes`: Verify list re-renders when tasks prop updated
- `test_renders_empty_list_correctly`: Verify empty state renders correctly
- `test_renders_tasks_with_correct_keys`: Verify React keys are properly set (performance)

**Component Features Tested:**
- List rendering with multiple tasks
- Empty state display
- Child component composition (TaskItem rendering)
- Props passing to child components
- Dynamic updates when data changes
- React key usage for list optimization

#### 4. `__tests__/App.test.jsx` (11 tests)

Integration tests for the main App component.

**Tests:**
- `test_renders_the_app_title`: Verify app header/title renders
- `test_fetches_tasks_on_mount`: Verify API call happens on component mount
- `test_displays_loading_state_initially`: Verify loading indicator shows while fetching
- `test_renders_tasks_after_fetch_succeeds`: Verify tasks display after successful fetch
- `test_displays_error_when_fetch_fails`: Verify error message on API failure
- `test_displays_error_when_network_request_fails`: Verify error message on network error
- `test_renders_TaskForm_component`: Verify form component is mounted
- `test_adds_a_new_task_when_TaskForm_submits`: Verify create task workflow end-to-end
- `test_deletes_a_task`: Verify delete task workflow end-to-end
- `test_displays_error_when_adding_task_fails`: Verify error handling for create failures
- `test_renders_TaskList_component`: Verify list component is mounted

**App Features Tested:**
- Component composition and mounting
- API integration (fetch on mount)
- Loading states
- Error handling and display
- Create task end-to-end workflow
- Delete task end-to-end workflow
- Component integration (TaskForm + TaskList)

### Running Frontend Tests

```bash
# Run all frontend tests
cd frontend
npm run test -- --run

# Run specific test file
npm run test -- --run src/components/__tests__/TaskForm.test.jsx

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run with coverage report
npm run test:coverage

# Run specific test by name
npm run test -- --run -t "renders task title"
```

### Frontend Test Configuration

- **Framework**: Vitest 1.1.0
- **Testing Library**: @testing-library/react 14.1.2
- **User Interactions**: @testing-library/user-event 14.5.1
- **Jest-DOM Matchers**: @testing-library/jest-dom (custom matchers)
- **DOM Environment**: jsdom 23.0.1
- **Configuration**: `frontend/vitest.config.js`
- **Setup File**: `frontend/src/test/setup.ts` (imports jest-dom matchers)

**Key Testing Patterns:**
- `render()`: Render React components in test environment
- `screen.getByText()`, `screen.getByRole()`: Query DOM elements
- `userEvent.setup()`: Simulate user interactions (typing, clicking)
- `waitFor()`: Wait for async updates (fetch, state changes)
- `vi.fn()`: Mock functions for callbacks
- `toBeInTheDocument()`: Jest-DOM custom matcher

---

## Test Coverage

### Backend Coverage

The backend tests focus on:
- **API Contract**: All endpoints respond correctly to valid/invalid inputs
- **Data Validation**: Pydantic models enforce constraints
- **Database Persistence**: ORM correctly saves/retrieves data
- **Error Handling**: Proper HTTP status codes for errors (400, 404, 500)
- **Workflow Integration**: Multi-step operations work correctly

**Target Coverage**: >80% of critical functions

### Frontend Coverage

The frontend tests focus on:
- **Component Rendering**: Components display correctly with given props
- **User Interactions**: Click handlers and form inputs work as expected
- **State Management**: Component state updates correctly
- **API Integration**: Components correctly call API endpoints
- **Error States**: Error messages display and clear appropriately
- **Accessibility**: Semantic HTML and proper ARIA labels

**Testing Approach**: Unit tests per component + integration tests for App

---

## CI/CD Pipeline Integration

### GitHub Actions Workflow

Tests run automatically on every push to the `tests` branch via `.github/workflows/tests.yml`

**Workflow Jobs:**

1. **backend-tests** (Matrix: Python 3.10, 3.11)
   - Checkout code
   - Set up Python environment
   - Install dependencies
   - Run pytest with coverage
   - Upload coverage to Codecov

2. **frontend-tests** (Node.js 18)
   - Checkout code
   - Set up Node.js
   - Install npm dependencies
   - Run Vitest
   - Generate coverage report
   - Upload coverage to Codecov

3. **lint-and-format**
   - Python: Check black formatting, isort imports
   - Frontend: Validate build success
   - Dependency validation

4. **credential-scan**
   - Scan for hardcoded secrets and credentials
   - Check for AWS keys, private keys, API keys
   - Scan for passwords and sensitive data
   - Verify no credentials in code or config files

5. **test-summary**
   - Display overall test results
   - Summary of all job statuses

### Running Tests Locally

Before pushing, run tests locally to catch issues early:

```bash
# Backend tests
cd backend
python -m pytest tests/ -v

# Frontend tests
cd frontend
npm run test -- --run

# Credential scan
detect-secrets scan --all-files

# All tests and security checks (from root)
cd backend && python -m pytest tests/ -v && cd ../frontend && npm run test -- --run && cd .. && detect-secrets scan --all-files
```

---

## Test Data and Mocks

### Backend Test Fixtures

**conftest.py** provides:
- **test_db**: Fresh SQLite database per test
- **client**: FastAPI TestClient for making requests
- Mock database connection for isolation

Sample test data:
```python
{
  "id": 1,
  "title": "Test Task",
  "description": "Test Description",
  "completed": False,
  "created_at": "2024-01-01T00:00:00"
}
```

### Frontend Test Mocks

**Mocked APIs:**
- `fetch()`: Global mock to prevent real API calls
- `userEvent`: Simulates real user interactions
- Props: Mock callback functions with `vi.fn()`

Sample mock task:
```javascript
{
  id: 1,
  title: 'Test Task',
  completed: false,
  created_at: '2024-01-01'
}
```

---

## Security Tests

### Credential Scan

**Purpose**: Prevent accidental commit of secrets and sensitive credentials to version control.

**What It Detects:**
- AWS access keys and secret keys
- Private cryptographic keys (RSA, EC, OpenSSH)
- Database connection strings with passwords
- API keys and tokens
- OAuth tokens and refresh tokens
- SQL passwords and connection strings
- PEM and PKCS8 private keys
- GitHub personal access tokens
- Slack/Discord tokens
- Generic passwords and secrets

**Implementation**: Uses `detect-secrets` library with entropy-based detection

**Running Credential Scan Locally:**

```bash
# Install detect-secrets
pip install detect-secrets

# Run scan on entire repository
detect-secrets scan --all-files

# Run scan on specific directory
detect-secrets scan backend/

# View results in JSON format
detect-secrets scan --all-files | python3 -m json.tool

# Audit baseline to whitelist non-secrets
detect-secrets audit .secrets.baseline
```

**Configuration:**
- Baseline file: `.secrets.baseline` (tracks known non-secrets)
- Entropy threshold: Tuned to minimize false positives
- Exclude patterns: `.git/`, `node_modules/`, etc.

**Whitelisting Non-Secrets:**
If a detection is a false positive (e.g., test data), audit and approve:
```bash
detect-secrets audit .secrets.baseline
```

**Best Practices:**
- ✅ Use environment variables for all secrets
- ✅ Store credentials in `.env` files (added to `.gitignore`)
- ✅ Use `.env.example` template with placeholder values
- ✅ Never commit passwords, API keys, or tokens
- ✅ Use GitHub Secrets for CI/CD credentials
- ❌ Never add credentials to code or configuration files

**Example - What NOT to Do:**
```python
# ❌ WRONG - Hardcoded credentials
DB_PASSWORD = "my_secret_password_123"
AWS_KEY = "AKIA2JDLK3JLDKJ3LDJK"

# ✅ RIGHT - Use environment variables
DB_PASSWORD = os.getenv("DB_PASSWORD")
AWS_KEY = os.getenv("AWS_KEY")
```

---


### Backend (pytest)
```python
def test_something(client, test_db):
    # Arrange: Setup test data
    response = client.post("/tasks", json={"title": "Test"})
    
    # Act: Perform operation
    result = client.get("/tasks")
    
    # Assert: Verify results
    assert result.status_code == 200
```

### Frontend (Vitest + Testing Library)
```javascript
it('does something', async () => {
  // Arrange: Render component
  render(<TaskForm onAddTask={vi.fn()} />)
  
  // Act: Simulate user interaction
  const user = userEvent.setup()
  await user.type(screen.getByPlaceholderText('...'), 'Test')
  
  // Assert: Verify outcome
  expect(screen.getByText('Test')).toBeInTheDocument()
})
```

---

## Troubleshooting Tests

### Backend Issues

**ModuleNotFoundError**: Ensure virtual environment is activated
```bash
source .venv/bin/activate  # or use configure_python_environment
```

**Async test failures**: Check pytest-asyncio is installed
```bash
pip install pytest-asyncio
```

**Database errors**: Tests use in-memory SQLite, should auto-cleanup

### Frontend Issues

**"document is not defined"**: Ensure vitest.config.js has `environment: 'jsdom'`

**"toBeInTheDocument is not a function"**: Verify `frontend/src/test/setup.ts` is imported in vitest config

**Timeout errors**: Increase timeout or check for unresolved promises
```javascript
it('test', async () => { ... }, { timeout: 10000 })
```

**Module not found**: Run `npm install` to ensure dependencies installed

### Credential Scan Issues

**"Secret detected" but it's a false positive**: Audit and approve in baseline
```bash
detect-secrets audit .secrets.baseline
# Select 'y' to approve as non-secret or 'n' to flag
```

**detect-secrets not installed**: Install the package
```bash
pip install detect-secrets
```

**"unrecognized arguments: --update-baseline"**: This flag doesn't exist in all versions
- Use `detect-secrets scan --all-files` without the `--update-baseline` flag
- Baseline is managed separately using the audit command

**Baseline file missing (.secrets.baseline)**: Scan will still work, just won't compare
```bash
detect-secrets scan --all-files
# Results are shown in JSON format
```

**Accidental credential pushed**: 
1. Revoke the credential immediately
2. Remove from git history:
```bash
git filter-branch --tree-filter 'detect-secrets prune' -f -- --all
```
3. Force push (dangerous - only if not public):
```bash
git push origin --force-with-lease
```
4. Rotate the secret in the service
5. Add to `.gitignore` or use environment variables going forward

---


### Adding New Tests

When adding features, add corresponding tests:

1. **Backend**: Add test in `backend/tests/test_*.py`
2. **Frontend**: Add test in corresponding `__tests__/Component.test.jsx`
3. Follow existing patterns and naming conventions
4. Run locally before pushing: `npm run test -- --run` + `pytest`

### Test Maintenance

- Update tests when API contracts change
- Keep mock data in sync with schema changes
- Review failed tests in CI immediately
- Aim for >80% coverage on critical paths

---

## References

- [Backend Testing Guide](./backend/tests/README.md)
- [Frontend Testing Guide](./frontend/README.md#testing)
- [Pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [GitHub Actions Workflow](../.github/workflows/tests.yml)
- [detect-secrets Documentation](https://github.com/Yelp/detect-secrets)
- [OWASP: Forgotten Credentials](https://owasp.org/www-community/Source_Code_Disassembly/Sensitive_Data_Exposure)

---

**Last Updated**: February 27, 2026  
**Test Suite Status**: All 66 tests passing ✅ | Credential scanning enabled | Coverage Reports: Available in GitHub Actions artifacts
