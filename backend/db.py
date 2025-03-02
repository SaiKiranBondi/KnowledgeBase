from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import os

# ✅ Database URL (SQLite)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/tasks.db")

# ✅ Create Engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# ✅ Create Session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Define Base Model
Base = declarative_base()


# ✅ User Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

    tasks = relationship("Task", back_populates="owner", cascade="all, delete")


# ✅ Task Model
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=False)
    priority = Column(String, default="Medium")
    reason = Column(String, nullable=True)  # ✅ New column for AI-generated reason
    completed = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="tasks")


# ✅ Ensure Tables Are Created
def init_db():
    Base.metadata.create_all(bind=engine)
