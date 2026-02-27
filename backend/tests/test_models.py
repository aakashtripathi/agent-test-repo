"""
Test cases for database models.
Tests verify model structure and behavior.
"""
import pytest
from datetime import datetime
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from models import Task
from database import SessionLocal, Base, engine


class TestTaskModel:
    """Test suite for Task model"""

    @pytest.fixture(autouse=True)
    def setup(self):
        """Create tables before each test"""
        Base.metadata.create_all(bind=engine)
        yield
        Base.metadata.drop_all(bind=engine)

    def test_task_creation(self):
        """Test creating a task instance"""
        task = Task(
            title="Test Task",
            description="Test Description",
            completed=False
        )
        assert task.title == "Test Task"
        assert task.description == "Test Description"
        assert task.completed is False

    def test_task_default_values(self):
        """Test that task has correct default values"""
        task = Task(title="Test")
        assert task.description is None or task.description == ""
        assert task.completed is None or task.completed is False
        # created_at is set by the database, not on object creation

    def test_task_persistence(self):
        """Test saving and retrieving task from database"""
        db = SessionLocal()
        try:
            task = Task(
                title="Persist Task",
                description="Should be saved",
                completed=True
            )
            db.add(task)
            db.commit()
            db.refresh(task)

            # Verify it was saved with an ID
            assert task.id is not None

            # Verify we can retrieve it
            retrieved = db.query(Task).filter(Task.id == task.id).first()
            assert retrieved is not None
            assert retrieved.title == "Persist Task"
            assert retrieved.completed is True
        finally:
            db.close()

    def test_task_update(self):
        """Test updating a task"""
        db = SessionLocal()
        try:
            task = Task(title="Original")
            db.add(task)
            db.commit()
            db.refresh(task)
            task_id = task.id

            # Update the task
            task.title = "Updated"
            task.completed = True
            db.commit()
            db.refresh(task)

            # Verify update
            retrieved = db.query(Task).filter(Task.id == task_id).first()
            assert retrieved.title == "Updated"
            assert retrieved.completed is True
        finally:
            db.close()

    def test_task_deletion(self):
        """Test deleting a task"""
        db = SessionLocal()
        try:
            task = Task(title="Delete Me")
            db.add(task)
            db.commit()
            db.refresh(task)
            task_id = task.id

            # Delete the task
            db.delete(task)
            db.commit()

            # Verify deletion
            retrieved = db.query(Task).filter(Task.id == task_id).first()
            assert retrieved is None
        finally:
            db.close()

    def test_task_table_exists(self):
        """Test that task table exists in database"""
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        assert "tasks" in tables

    def test_task_columns(self):
        """Test that task table has correct columns"""
        from sqlalchemy import inspect
        inspector = inspect(engine)
        columns = [col["name"] for col in inspector.get_columns("tasks")]
        
        assert "id" in columns
        assert "title" in columns
        assert "description" in columns
        assert "completed" in columns
        assert "created_at" in columns
