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
    phase_id = Column(Integer, ForeignKey("phases.id", ondelete="CASCADE"))
    topic_name = Column(String)
    completed = Column(Boolean, default=False)

    phase = relationship("Phase", back_populates="topics")

# Final Capstone Modal
class Capstone(base):
    __tablename__ = "capstones"

    id = Column(Integer, primary_key=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id", ondelete="CASCADE"))
    title = Column(String)
    description = Column(Text)
    skills_validated = Column(JSON)
    
    roadmap = relationship("Roadmap", back_populates="capstone")