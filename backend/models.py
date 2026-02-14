from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from datetime import datetime
import enum
from .database import Base

class PriorityEnum(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class StatusEnum(str, enum.Enum):
    DRAFT = "Draft"
    READY = "Ready"
    AUTOMATED = "Automated"

class TestCase(Base):
    __tablename__ = "testcases"

    id = Column(Integer, primary_key=True, index=True)
    feature_name = Column(String(255), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    steps = Column(Text, nullable=False)
    expected_result = Column(Text, nullable=False)
    priority = Column(Enum(PriorityEnum), nullable=False, default=PriorityEnum.MEDIUM)
    status = Column(Enum(StatusEnum), nullable=False, default=StatusEnum.DRAFT)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
