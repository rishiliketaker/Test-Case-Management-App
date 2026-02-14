from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os

from .database import engine, get_db, Base
from .models import TestCase, PriorityEnum, StatusEnum
from .schemas import TestCaseCreate, TestCaseUpdate, TestCaseResponse

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Test Case Management API",
    description="A REST API for managing test cases with CRUD operations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes

@app.post("/api/testcases", response_model=TestCaseResponse, status_code=201, tags=["Test Cases"])
def create_test_case(test_case: TestCaseCreate, db: Session = Depends(get_db)):
    """
    Create a new test case.
    
    - **feature_name**: Name of the feature being tested
    - **title**: Test case title
    - **steps**: Detailed test steps
    - **expected_result**: Expected outcome
    - **priority**: Low, Medium, or High
    - **status**: Draft, Ready, or Automated
    """
    db_test_case = TestCase(**test_case.model_dump())
    db.add(db_test_case)
    db.commit()
    db.refresh(db_test_case)
    return db_test_case

@app.get("/api/testcases", response_model=List[TestCaseResponse], tags=["Test Cases"])
def get_test_cases(
    priority: Optional[PriorityEnum] = Query(None, description="Filter by priority"),
    status: Optional[StatusEnum] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search in title and feature name"),
    db: Session = Depends(get_db)
):
    """
    Retrieve all test cases with optional filtering.
    
    - **priority**: Filter by priority level (Low, Medium, High)
    - **status**: Filter by status (Draft, Ready, Automated)
    - **search**: Search term for title and feature name
    """
    query = db.query(TestCase)
    
    if priority:
        query = query.filter(TestCase.priority == priority)
    
    if status:
        query = query.filter(TestCase.status == status)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (TestCase.title.ilike(search_term)) | 
            (TestCase.feature_name.ilike(search_term))
        )
    
    return query.order_by(TestCase.created_at.desc()).all()

@app.get("/api/testcases/{test_case_id}", response_model=TestCaseResponse, tags=["Test Cases"])
def get_test_case(test_case_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific test case by ID.
    """
    test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if not test_case:
        raise HTTPException(status_code=404, detail="Test case not found")
    return test_case

@app.put("/api/testcases/{test_case_id}", response_model=TestCaseResponse, tags=["Test Cases"])
def update_test_case(
    test_case_id: int, 
    test_case_update: TestCaseUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update an existing test case.
    
    Only provided fields will be updated.
    """
    db_test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if not db_test_case:
        raise HTTPException(status_code=404, detail="Test case not found")
    
    update_data = test_case_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_test_case, field, value)
    
    db.commit()
    db.refresh(db_test_case)
    return db_test_case

@app.delete("/api/testcases/{test_case_id}", status_code=204, tags=["Test Cases"])
def delete_test_case(test_case_id: int, db: Session = Depends(get_db)):
    """
    Delete a test case by ID.
    """
    db_test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if not db_test_case:
        raise HTTPException(status_code=404, detail="Test case not found")
    
    db.delete(db_test_case)
    db.commit()
    return None

@app.get("/api/health", tags=["Health"])
def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "message": "Test Case Management API is running"}

# Mount static files for frontend (must be last to not override API routes)
frontend_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")
if os.path.exists(frontend_path):
    # Serve static files
    app.mount("/static", StaticFiles(directory=frontend_path), name="static")
    
    # Serve index.html at root
    @app.get("/")
    async def serve_root():
        return FileResponse(os.path.join(frontend_path, "index.html"))

