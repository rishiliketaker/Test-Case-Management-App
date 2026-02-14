// API Configuration
const API_BASE_URL = '/api';

// State
let currentTestCaseId = null;
let allTestCases = [];

// DOM Elements
const testCasesGrid = document.getElementById('testCasesGrid');
const emptyState = document.getElementById('emptyState');
const modal = document.getElementById('testCaseModal');
const modalTitle = document.getElementById('modalTitle');
const testCaseForm = document.getElementById('testCaseForm');
const submitBtn = document.getElementById('submitBtn');
const createBtn = document.getElementById('createBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const priorityFilter = document.getElementById('priorityFilter');
const statusFilter = document.getElementById('statusFilter');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTestCases();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    createBtn.addEventListener('click', () => openModal());
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    testCaseForm.addEventListener('submit', handleSubmit);
    searchInput.addEventListener('input', debounce(loadTestCases, 300));
    priorityFilter.addEventListener('change', loadTestCases);
    statusFilter.addEventListener('change', loadTestCases);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// API Functions
async function loadTestCases() {
    try {
        const params = new URLSearchParams();

        const search = searchInput.value.trim();
        const priority = priorityFilter.value;
        const status = statusFilter.value;

        if (search) params.append('search', search);
        if (priority) params.append('priority', priority);
        if (status) params.append('status', status);

        const url = `${API_BASE_URL}/testcases${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Failed to fetch test cases');

        allTestCases = await response.json();
        renderTestCases(allTestCases);
        updateStats(allTestCases);
    } catch (error) {
        console.error('Error loading test cases:', error);
        showError('Failed to load test cases. Please try again.');
    }
}

async function createTestCase(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/testcases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to create test case');

        return await response.json();
    } catch (error) {
        console.error('Error creating test case:', error);
        throw error;
    }
}

async function updateTestCase(id, data) {
    try {
        const response = await fetch(`${API_BASE_URL}/testcases/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to update test case');

        return await response.json();
    } catch (error) {
        console.error('Error updating test case:', error);
        throw error;
    }
}

async function deleteTestCase(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/testcases/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete test case');

        return true;
    } catch (error) {
        console.error('Error deleting test case:', error);
        throw error;
    }
}

// UI Functions
function renderTestCases(testCases) {
    if (testCases.length === 0) {
        testCasesGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    testCasesGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    testCasesGrid.innerHTML = testCases.map(tc => createTestCaseCard(tc)).join('');
}

function createTestCaseCard(testCase) {
    const createdDate = new Date(testCase.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return `
        <div class="test-case-card">
            <div class="card-header">
                <span class="card-id">TC-${testCase.id}</span>
                <div class="card-badges">
                    <span class="badge badge-priority-${testCase.priority.toLowerCase()}">${testCase.priority}</span>
                    <span class="badge badge-status-${testCase.status.toLowerCase()}">${testCase.status}</span>
                </div>
            </div>
            
            <div class="card-feature">${escapeHtml(testCase.feature_name)}</div>
            <h3 class="card-title">${escapeHtml(testCase.title)}</h3>
            
            <div class="card-section">
                <div class="card-section-title">Test Steps</div>
                <div class="card-section-content">${escapeHtml(testCase.steps)}</div>
            </div>
            
            <div class="card-section">
                <div class="card-section-title">Expected Result</div>
                <div class="card-section-content">${escapeHtml(testCase.expected_result)}</div>
            </div>
            
            <div class="card-actions">
                <button class="btn-icon" onclick="editTestCase(${testCase.id})">Edit</button>
                <button class="btn-icon btn-delete" onclick="confirmDelete(${testCase.id})">Delete</button>
            </div>
        </div>
    `;
}

function updateStats(testCases) {
    const total = testCases.length;
    const draft = testCases.filter(tc => tc.status === 'Draft').length;
    const ready = testCases.filter(tc => tc.status === 'Ready').length;
    const automated = testCases.filter(tc => tc.status === 'Automated').length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('draftCount').textContent = draft;
    document.getElementById('readyCount').textContent = ready;
    document.getElementById('automatedCount').textContent = automated;
}

function openModal(testCase = null) {
    currentTestCaseId = testCase?.id || null;

    if (testCase) {
        modalTitle.textContent = 'Edit Test Case';
        submitBtn.textContent = 'Update Test Case';
        populateForm(testCase);
    } else {
        modalTitle.textContent = 'Create Test Case';
        submitBtn.textContent = 'Create Test Case';
        testCaseForm.reset();
    }

    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    testCaseForm.reset();
    currentTestCaseId = null;
}

function populateForm(testCase) {
    document.getElementById('featureName').value = testCase.feature_name;
    document.getElementById('title').value = testCase.title;
    document.getElementById('steps').value = testCase.steps;
    document.getElementById('expectedResult').value = testCase.expected_result;
    document.getElementById('priority').value = testCase.priority;
    document.getElementById('status').value = testCase.status;
}

async function handleSubmit(e) {
    e.preventDefault();

    const formData = {
        feature_name: document.getElementById('featureName').value.trim(),
        title: document.getElementById('title').value.trim(),
        steps: document.getElementById('steps').value.trim(),
        expected_result: document.getElementById('expectedResult').value.trim(),
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value,
    };

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = currentTestCaseId ? 'Updating...' : 'Creating...';

        if (currentTestCaseId) {
            await updateTestCase(currentTestCaseId, formData);
            showSuccess('Test case updated successfully!');
        } else {
            await createTestCase(formData);
            showSuccess('Test case created successfully!');
        }

        closeModal();
        await loadTestCases();
    } catch (error) {
        showError('Failed to save test case. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = currentTestCaseId ? 'Update Test Case' : 'Create Test Case';
    }
}

async function editTestCase(id) {
    const testCase = allTestCases.find(tc => tc.id === id);
    if (testCase) {
        openModal(testCase);
    }
}

async function confirmDelete(id) {
    if (confirm('Are you sure you want to delete this test case? This action cannot be undone.')) {
        try {
            await deleteTestCase(id);
            showSuccess('Test case deleted successfully!');
            await loadTestCases();
        } catch (error) {
            showError('Failed to delete test case. Please try again.');
        }
    }
}

function clearFilters() {
    searchInput.value = '';
    priorityFilter.value = '';
    statusFilter.value = '';
    loadTestCases();
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showSuccess(message) {
    // Simple console log for now - could be enhanced with toast notifications
    console.log('✓ ' + message);
}

function showError(message) {
    // Simple console log for now - could be enhanced with toast notifications
    console.error('✗ ' + message);
    alert(message);
}
