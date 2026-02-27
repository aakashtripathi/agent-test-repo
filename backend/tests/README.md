# Test Infrastructure

This directory contains all test-related files for the backend.

## Structure

```
tests/
├── __init__.py          # Package initialization
├── conftest.py         # Pytest configuration and fixtures
├── test_tasks.py       # API endpoint tests
└── test_models.py      # Database model tests
```

## Running Tests

See [TESTING.md](../TESTING.md) for detailed instructions on running tests.

## Test Coverage

- **test_tasks.py**: ~30 test cases covering all CRUD endpoints
- **test_models.py**: ~8 test cases covering model operations

### Test Categories

#### Endpoint Tests (test_tasks.py)
- **GET /tasks**: Retrieving tasks
- **POST /tasks**: Creating tasks
- **GET /tasks/{id}**: Retrieving specific task
- **PUT /tasks/{id}**: Updating tasks
- **DELETE /tasks/{id}**: Deleting tasks
- **Integration**: Complete workflows

#### Model Tests (test_models.py)
- Task creation and persistence
- Default values
- Updates and deletions
- Table structure validation

## Adding New Tests

1. Create test function with `test_` prefix
2. Use descriptive names
3. Add docstring explaining what's tested
4. Use fixtures from `conftest.py` for setup/teardown
5. Keep tests focused on single behavior

Example:
```python
def test_create_task_with_long_title(client):
    """Test creating a task with a very long title"""
    long_title = "x" * 1000
    response = client.post("/tasks", json={"title": long_title})
    assert response.status_code == 200
```
