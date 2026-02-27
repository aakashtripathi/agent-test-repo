"""
Test cases for task endpoints.
Tests cover all CRUD operations for tasks.
"""
import pytest
from fastapi.testclient import TestClient


class TestGetTasks:
    """Test suite for GET /tasks endpoint"""

    def test_get_empty_tasks(self, client):
        """Test retrieving tasks when database is empty"""
        response = client.get("/tasks")
        assert response.status_code == 200
        assert response.json() == []

    def test_get_tasks_returns_list(self, client):
        """Test that GET /tasks returns a list of tasks"""
        # Create some tasks
        client.post("/tasks", json={
            "title": "Task 1",
            "description": "Description 1",
            "completed": False
        })
        client.post("/tasks", json={
            "title": "Task 2",
            "description": "Description 2",
            "completed": False
        })

        response = client.get("/tasks")
        assert response.status_code == 200
        tasks = response.json()
        assert len(tasks) == 2
        assert tasks[0]["title"] == "Task 1"
        assert tasks[1]["title"] == "Task 2"

    def test_get_tasks_includes_required_fields(self, client):
        """Test that task response includes all required fields"""
        client.post("/tasks", json={
            "title": "Test Task",
            "description": "Test Description",
            "completed": False
        })

        response = client.get("/tasks")
        assert response.status_code == 200
        tasks = response.json()
        assert len(tasks) == 1
        task = tasks[0]
        
        # Verify required fields are present
        assert "id" in task
        assert "title" in task
        assert "description" in task
        assert "completed" in task
        assert "created_at" in task
        

class TestCreateTask:
    """Test suite for POST /tasks endpoint"""

    def test_create_task_success(self, client):
        """Test successful task creation"""
        response = client.post("/tasks", json={
            "title": "New Task",
            "description": "Task Description",
            "completed": False
        })
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "New Task"
        assert data["description"] == "Task Description"
        assert data["completed"] is False
        assert "id" in data
        assert "created_at" in data

    def test_create_task_with_minimal_data(self, client):
        """Test creating task with only required field"""
        response = client.post("/tasks", json={
            "title": "Simple Task"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Simple Task"
        assert data["description"] == ""
        assert data["completed"] is False

    def test_create_task_sets_default_values(self, client):
        """Test that default values are set correctly"""
        response = client.post("/tasks", json={
            "title": "Test Task"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["completed"] is False
        assert data["description"] == ""

    def test_create_task_persists_to_database(self, client):
        """Test that created task can be retrieved"""
        create_response = client.post("/tasks", json={
            "title": "Persistent Task"
        })
        task_id = create_response.json()["id"]

        get_response = client.get("/tasks")
        tasks = get_response.json()
        assert len(tasks) == 1
        assert tasks[0]["id"] == task_id
        assert tasks[0]["title"] == "Persistent Task"


class TestGetTaskById:
    """Test suite for GET /tasks/{task_id} endpoint"""

    def test_get_existing_task(self, client):
        """Test retrieving an existing task by ID"""
        create_response = client.post("/tasks", json={
            "title": "Get Me Task"
        })
        task_id = create_response.json()["id"]

        response = client.get(f"/tasks/{task_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == task_id
        assert data["title"] == "Get Me Task"

    def test_get_nonexistent_task(self, client):
        """Test retrieving a task that doesn't exist"""
        response = client.get("/tasks/9999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Task not found"

    def test_get_task_returns_all_fields(self, client):
        """Test that retrieved task contains all fields"""
        client.post("/tasks", json={
            "title": "Complete Task",
            "description": "Full Description",
            "completed": True
        })

        response = client.get("/tasks/1")
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "title" in data
        assert "description" in data
        assert "completed" in data
        assert "created_at" in data


class TestUpdateTask:
    """Test suite for PUT /tasks/{task_id} endpoint"""

    def test_update_task_title(self, client):
        """Test updating only the task title"""
        client.post("/tasks", json={"title": "Original Title"})
        
        response = client.put("/tasks/1", json={
            "title": "Updated Title"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated Title"

    def test_update_task_completed_status(self, client):
        """Test updating task completion status"""
        client.post("/tasks", json={
            "title": "Test Task",
            "completed": False
        })

        response = client.put("/tasks/1", json={
            "completed": True
        })
        assert response.status_code == 200
        data = response.json()
        assert data["completed"] is True

    def test_update_task_description(self, client):
        """Test updating task description"""
        client.post("/tasks", json={
            "title": "Task",
            "description": "Old description"
        })

        response = client.put("/tasks/1", json={
            "description": "New description"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["description"] == "New description"

    def test_update_nonexistent_task(self, client):
        """Test updating a task that doesn't exist"""
        response = client.put("/tasks/9999", json={
            "title": "Updated"
        })
        assert response.status_code == 404
        assert response.json()["detail"] == "Task not found"

    def test_update_task_multiple_fields(self, client):
        """Test updating multiple fields at once"""
        client.post("/tasks", json={
            "title": "Original",
            "description": "Original Desc",
            "completed": False
        })

        response = client.put("/tasks/1", json={
            "title": "Updated",
            "description": "Updated Desc",
            "completed": True
        })
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Updated"
        assert data["description"] == "Updated Desc"
        assert data["completed"] is True

    def test_update_task_preserves_other_fields(self, client):
        """Test that updating one field preserves others"""
        create_response = client.post("/tasks", json={
            "title": "Original Title",
            "description": "Keep This",
            "completed": False
        })
        original_id = create_response.json()["id"]

        client.put("/tasks/1", json={
            "title": "New Title"
        })

        response = client.get(f"/tasks/{original_id}")
        data = response.json()
        assert data["title"] == "New Title"
        assert data["description"] == "Keep This"


class TestDeleteTask:
    """Test suite for DELETE /tasks/{task_id} endpoint"""

    def test_delete_existing_task(self, client):
        """Test deleting an existing task"""
        client.post("/tasks", json={"title": "Delete Me"})

        response = client.delete("/tasks/1")
        assert response.status_code == 200

        # Verify task is deleted
        get_response = client.get("/tasks/1")
        assert get_response.status_code == 404

    def test_delete_nonexistent_task(self, client):
        """Test deleting a task that doesn't exist"""
        response = client.delete("/tasks/9999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Task not found"

    def test_delete_task_removes_from_list(self, client):
        """Test that deleted task is removed from task list"""
        client.post("/tasks", json={"title": "Task 1"})
        client.post("/tasks", json={"title": "Task 2"})
        client.post("/tasks", json={"title": "Task 3"})

        # Delete middle task
        client.delete("/tasks/2")

        response = client.get("/tasks")
        tasks = response.json()
        assert len(tasks) == 2
        task_ids = [t["id"] for t in tasks]
        assert 2 not in task_ids

    def test_delete_all_tasks(self, client):
        """Test deleting all tasks one by one"""
        client.post("/tasks", json={"title": "Task 1"})
        client.post("/tasks", json={"title": "Task 2"})

        client.delete("/tasks/1")
        client.delete("/tasks/2")

        response = client.get("/tasks")
        assert response.json() == []


class TestTaskIntegration:
    """Integration tests for task workflow"""

    def test_complete_task_workflow(self, client):
        """Test a complete workflow: create, read, update, delete"""
        # Create
        create_response = client.post("/tasks", json={
            "title": "Workflow Task",
            "description": "Test workflow"
        })
        assert create_response.status_code == 200
        task_id = create_response.json()["id"]

        # Read
        get_response = client.get(f"/tasks/{task_id}")
        assert get_response.status_code == 200
        assert get_response.json()["title"] == "Workflow Task"

        # Update
        update_response = client.put(f"/tasks/{task_id}", json={
            "completed": True
        })
        assert update_response.status_code == 200
        assert update_response.json()["completed"] is True

        # Delete
        delete_response = client.delete(f"/tasks/{task_id}")
        assert delete_response.status_code == 200

        # Verify deletion
        final_get = client.get(f"/tasks/{task_id}")
        assert final_get.status_code == 404

    def test_multiple_tasks_crud_operations(self, client):
        """Test CRUD operations with multiple tasks"""
        # Create multiple tasks
        for i in range(3):
            client.post("/tasks", json={
                "title": f"Task {i+1}",
                "completed": i % 2 == 0
            })

        # Verify all created
        response = client.get("/tasks")
        assert len(response.json()) == 3

        # Update one
        client.put("/tasks/2", json={"completed": True})

        # Delete one
        client.delete("/tasks/1")

        # Verify final state
        response = client.get("/tasks")
        tasks = response.json()
        assert len(tasks) == 2
        assert all(t["completed"] for t in tasks)
