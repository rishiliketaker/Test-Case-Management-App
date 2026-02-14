from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from .models import PriorityEnum, StatusEnum

class TestCaseBase(BaseModel):
    feature_name: str = Field(..., min_length=1, max_length=255, description="Name of the feature being tested")
    title: str = Field(..., min_length=1, max_length=500, description="Test case title")
    steps: str = Field(..., min_length=1, description="Test steps to execute")
    expected_result: str = Field(..., min_length=1, description="Expected outcome")
    priority: PriorityEnum = Field(default=PriorityEnum.MEDIUM, description="Test priority level")
    status: StatusEnum = Field(default=StatusEnum.DRAFT, description="Test case status")

class TestCaseCreate(TestCaseBase):
    pass

class TestCaseUpdate(BaseModel):
    feature_name: Optional[str] = Field(None, min_length=1, max_length=255)
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    steps: Optional[str] = Field(None, min_length=1)
    expected_result: Optional[str] = Field(None, min_length=1)
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None

class TestCaseResponse(TestCaseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
