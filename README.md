# 🧪 Test Case Manager

A modern, full-stack web application for managing test cases with CRUD operations, built to showcase SDET skills and real-world tool development.

![Test Case Manager](https://img.shields.io/badge/Python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- ✅ **Full CRUD Operations** - Create, Read, Update, and Delete test cases
- 🎨 **Modern Dark UI** - Premium design with glassmorphism and smooth animations
- 🔍 **Advanced Filtering** - Filter by priority, status, and search by keywords
- 📊 **Real-time Statistics** - Dashboard showing test case metrics
- 📝 **Swagger Documentation** - Auto-generated API documentation
- 🗄️ **SQLite Database** - Lightweight and portable data storage
- 🚀 **RESTful API** - Clean and well-documented endpoints
- 📱 **Responsive Design** - Works seamlessly on all devices

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - Lightning-fast ASGI server
- **SQLite** - Lightweight database

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS variables and animations
- **Vanilla JavaScript** - No frameworks, pure JS for API integration
- **Google Fonts (Inter)** - Modern typography

## 📋 Test Case Fields

Each test case includes:

| Field | Type | Description |
|-------|------|-------------|
| **ID** | Integer | Auto-generated unique identifier |
| **Feature Name** | String | Name of the feature being tested |
| **Title** | String | Test case title/description |
| **Steps** | Text | Detailed test execution steps |
| **Expected Result** | Text | Expected outcome of the test |
| **Priority** | Enum | Low, Medium, or High |
| **Status** | Enum | Draft, Ready, or Automated |
| **Created At** | DateTime | Timestamp of creation |
| **Updated At** | DateTime | Timestamp of last update |

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone or download the repository**
   ```bash
   cd test-case-manager
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

### Running the Application

1. **Start the server**
   ```bash
   uvicorn backend.main:app --reload
   ```

2. **Access the application**
   - **Web Interface**: Open your browser and navigate to `https://test-case-manager-ij1l.onrender.com/`
   - **API Documentation (Swagger)**: `http://localhost:8000/docs`
   - **Alternative API Docs (ReDoc)**: `https://test-case-manager-ij1l.onrender.com/`

The `--reload` flag enables auto-reload during development. Remove it for production use.

## 📚 API Endpoints

### Test Cases

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/testcases` | Create a new test case |
| `GET` | `/api/testcases` | Get all test cases (with optional filters) |
| `GET` | `/api/testcases/{id}` | Get a specific test case |
| `PUT` | `/api/testcases/{id}` | Update a test case |
| `DELETE` | `/api/testcases/{id}` | Delete a test case |

### Query Parameters for GET /api/testcases

- `priority` - Filter by priority (Low, Medium, High)
- `status` - Filter by status (Draft, Ready, Automated)
- `search` - Search in title and feature name

### Example API Usage

**Create a test case:**
```bash
curl -X POST "http://localhost:8000/api/testcases" \
  -H "Content-Type: application/json" \
  -d '{
    "feature_name": "User Authentication",
    "title": "Verify login with valid credentials",
    "steps": "1. Navigate to login page\n2. Enter valid username\n3. Enter valid password\n4. Click login button",
    "expected_result": "User should be successfully logged in and redirected to dashboard",
    "priority": "High",
    "status": "Ready"
  }'
```

**Get all test cases:**
```bash
curl "http://localhost:8000/api/testcases"
```

**Filter by priority and status:**
```bash
curl "http://localhost:8000/api/testcases?priority=High&status=Ready"
```

## 📁 Project Structure

```
test-case-manager/
├── backend/
│   ├── __init__.py          # Package initializer
│   ├── main.py              # FastAPI application and routes
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic schemas for validation
│   └── database.py          # Database configuration
├── frontend/
│   ├── index.html           # Main HTML file
│   ├── styles.css           # CSS styling
│   └── app.js               # JavaScript for API integration
├── requirements.txt         # Python dependencies
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🎯 Use Cases

This application is perfect for:

- **QA Teams** - Managing test cases for projects
- **SDET Portfolios** - Demonstrating full-stack development skills
- **Learning** - Understanding REST APIs, databases, and modern web development
- **Interview Preparation** - Showcasing practical coding abilities
- **Test Automation** - Tracking which tests are automated

## 🔧 Development

### Database

The application uses SQLite with a file-based database (`testcases.db`). The database is automatically created on first run.

To reset the database, simply delete the `testcases.db` file and restart the server.

### Adding Features

Some ideas for extending the application:

- Add user authentication and authorization
- Implement test case execution tracking
- Add file attachments for test cases
- Export test cases to CSV/Excel
- Add test case versioning
- Implement test suites/collections
- Add tags/labels for better organization
- Integrate with CI/CD pipelines

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Use a different port
uvicorn backend.main:app --reload --port 8001
```

**Module not found errors:**
```bash
# Make sure you're in the project root directory
# and virtual environment is activated
pip install -r requirements.txt
```

**Database locked error:**
- Close any other instances of the application
- Delete `testcases.db` and restart

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👨‍💻 Author

Built as a demonstration of SDET skills and modern web development practices.

---

**Happy Testing! 🧪**
