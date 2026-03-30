from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, ForeignKey, Integer, String, Float, DateTime, Text, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

base = declarative_base()

class User(base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    provider = Column(String, default="local")
    provider_user_id = Column(String, unique=True, nullable=True)

class user_data(base):
    __tablename__ = "user_data"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer , ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    goal = Column(String)
    target_role = Column(String)
    current_level = Column(String)
    prog_score = Column(Integer)
    db_score = Column(Integer)
    dsa_score = Column(Integer)
    sd_score = Column(Integer)
    experience = Column(String)
    weekly_hours = Column(String)
    deadline = Column(String)
    learning_style = Column(String)


# Roadmap Modal
class Roadmap(base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    roadmap_title = Column(String)
    total_duration_weeks = Column(Integer)
    progress_percentage = Column(Float, default=0)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    phases = relationship("Phase", back_populates="roadmap", cascade="all, delete-orphan")
    capstone = relationship("Capstone", back_populates="roadmap", cascade="all, delete-orphan", uselist=False)

# Phase Modal
class Phase(base):
    __tablename__ = "phases"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"))
    phase_name = Column(String)
    focus_area = Column(String)
    duration_weeks = Column(Integer)
    expected_outcome = Column(Text)
    status = Column(String)
    order_index = Column(Integer)

    roadmap = relationship("Roadmap", back_populates="phases")
    topics = relationship("Topic", back_populates="phase", cascade="all, delete-orphan")

# Topic Modal
class Topic(base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    phase_id = Column(Integer, ForeignKey("phases.id", ondelete="CASCADE"))
    topic_name = Column(String)
    days_completed = Column(Integer, default=0)
    days_to_complete = Column(Integer)
    completed = Column(Boolean, default=False)
    last_completed_at = Column(DateTime)

    phase = relationship("Phase", back_populates="topics")

# Final Capstone Modal
class Capstone(base):
    __tablename__ = "capstones"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"))
    title = Column(String)
    description = Column(Text)
    skills_validated = Column(JSON)
    days_completed = Column(Integer, default=0)
    days_to_complete = Column(Integer)
    
    roadmap = relationship("Roadmap", back_populates="capstone")

# Daily Task Modal
class DailyTask(base):
    __tablename__ = "daily_tasks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"))

    day_number = Column(Integer)
    title = Column(String)
    description = Column(Text)
    duration = Column(Integer)  # in minutes
    category = Column(String)  # Learning, Practice, Review
    icon = Column(String)  # Emoji or short text
    priority = Column(String)  # low, medium, high

    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# tasks data for tracking progress and analytics
# class TaskData(base):
#     __tablename__ = "task_data"

#     id = Column(Integer, primary_key=True)
#     user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
#     Phase_id = Column(Integer, ForeignKey("phases.id", ondelete="CASCADE"))
#     topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"))
#     topic_name = Column(String)
#     days_completed = Column(Integer, default=0)
#     days_to_complete = Column(Integer)
#     completed = Column(Boolean, default=False)
#     last_completed_at = Column(DateTime)

class Current(base):
    __tablename__ = "current_data"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id",ondelete="CASCADE"))
    current_phase_id = Column(Integer,ForeignKey("phases.id",ondelete="CASCADE"))
    current_topic_id = Column(Integer,ForeignKey("topics.id",ondelete="CASCADE"))
    capstone_active = Column(Boolean, default=False)
    total_days = Column(Integer)
    days_count = Column(Integer)

    current_topic = Column(String)
    current_phase = Column(String)
    
    # roadmap_completed = Column(Boolean, default=False)