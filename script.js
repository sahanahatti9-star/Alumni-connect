// script.js
// Handles UI transitions based on the flowchart

// Helper to switch active view
function navigateTo(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });
    
    // Show the target view
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.remove('hidden');
        // Small delay ensures display block is processed before opacity transition
        setTimeout(() => {
            target.classList.add('active');
        }, 50);
    }
}

// Proceed to login from User Page selection
let currentUserType = '';

function navigateToLogin(userType) {
    currentUserType = userType;
    const loginTitle = document.getElementById('login-title');
    loginTitle.innerHTML = `Login as <span style="color: var(--primary-color)">${userType}</span>`;
    
    // Clear form inputs
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    navigateTo('view-login-page');
}

// Handle login submission
function handleLogin(event) {
    event.preventDefault(); // Prevent actual form submission
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;
    
    // Simulate loading
    submitBtn.innerText = 'Authenticating...';
    submitBtn.style.opacity = '0.7';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Reset button
        submitBtn.innerText = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
        
        // Go to dashboard
        navigateToDashboard();
    }, 800);
}

// Setup dashboard based on login (though flowchart points all lines to login, 
// and login points to all dashboards, simulating generic access for demo)
function navigateToDashboard() {
    const dashboardTitle = document.getElementById('dashboard-title');
    dashboardTitle.innerText = `${currentUserType} Dashboard`;
    
    navigateTo('view-dashboard');
}

// Access specific dashboard item (Alumni, Student Page, etc.)
function showDestination(destinationName) {
    if (destinationName === 'Alumni Portal') {
        navigateTo('view-alumni-home');
        // Initialize charts if not already done
        if (!window.alumniChartsInitialized) {
            setTimeout(() => {
                initializeAlumniCharts();
                window.alumniChartsInitialized = true;
            }, 500); // Wait for transition
        }
        return;
    }

    if (destinationName === 'Student Page') {
        navigateTo('view-student-home');
        if (!window.studentChartsInitialized) {
            setTimeout(() => {
                initializeStudentCharts();
                window.studentChartsInitialized = true;
            }, 500);
        }
        return;
    }

    if (destinationName === 'On Campus Dashboard') {
        navigateTo('view-oncampus-home');
        return;
    }

    if (destinationName === 'Faculty Page') {
        navigateTo('view-faculty-home');
        if (!window.facultyChartsInitialized) {
            setTimeout(() => {
                initializeFacultyCharts();
                window.facultyChartsInitialized = true;
            }, 500);
        }
        return;
    }

    if (destinationName === 'Admin Control Panel') {
        navigateTo('view-admin-home');
        if (!window.adminChartsInitialized) {
            setTimeout(() => {
                initializeAdminCharts();
                window.adminChartsInitialized = true;
            }, 500);
        }
        return;
    }

    const destTitle = document.getElementById('destination-title');
    destTitle.innerText = destinationName;
    
    navigateTo('view-destination');
    
    // Simulate loading the module
    const destContent = document.querySelector('.destination-content');
    const originalContent = destContent.innerHTML;
    
    setTimeout(() => {
        destContent.innerHTML = `
            <h2>${destinationName} Loaded</h2>
            <p>Welcome to the ${destinationName.toLowerCase()} interface.</p>
            <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 1rem; border: 1px dashed rgba(255,255,255,0.2); margin-top: 2rem;">
                <p>Mock Content Area</p>
                <p style="font-size: 0.8rem; color: var(--text-secondary)">This represents the final node in the flowchart branch.</p>
            </div>
        `;
    }, 1500);
    
    // Reset back exactly when navigated away
    document.querySelector('.destination-card .back-btn').onclick = () => {
        destContent.innerHTML = originalContent; // Restore loader state for next time
        navigateTo('view-dashboard');
    };
}

// ---------------- ALUMNI DASHBOARD LOGIC ---------------- //

function switchAlumniTab(tabId, btnContext) {
    // Hide all tabs
    document.querySelectorAll('.alumni-tab-content').forEach(tab => {
        tab.classList.add('hidden');
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    if (btnContext) {
        document.querySelectorAll('.alumni-sidebar .sidebar-btn').forEach(btn => btn.classList.remove('active'));
        btnContext.classList.add('active');
    }

    // Show target tab
    const target = document.getElementById(`alumni-tab-${tabId}`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.remove('hidden');
            target.classList.add('active');
        }, 10);
    }
}

function initializeAlumniCharts() {
    const commonOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { 
            y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };

    // Chart 1: Job Roles
    const ctxRoles = document.getElementById('chartRoles').getContext('2d');
    new Chart(ctxRoles, {
        type: 'bar',
        data: {
            labels: ['Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'Analyst'],
            datasets: [{
                label: 'Count',
                data: [120, 85, 45, 60, 40],
                backgroundColor: '#6366f1',
                borderRadius: 4
            }]
        },
        options: commonOptions
    });

    // Location Chart 1: Top US Cities
    const ctxCities = document.getElementById('chartTopCities').getContext('2d');
    new Chart(ctxCities, {
        type: 'bar',
        data: {
            labels: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston'],
            datasets: [{
                label: 'Count',
                data: [150, 90, 80, 50, 30],
                backgroundColor: '#ec4899',
                borderRadius: 4
            }]
        },
        options: commonOptions
    });

    // Location Chart 2: International vs Domestic
    const ctxIntl = document.getElementById('chartInternational').getContext('2d');
    new Chart(ctxIntl, {
        type: 'doughnut',
        data: {
            labels: ['Domestic (US)', 'International'],
            datasets: [{
                data: [320, 80],
                backgroundColor: ['#14b8a6', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'bottom', labels: { color: '#cbd5e1' } } }
        }
    });

    // Chart 3: Masters Pursuing
    const ctxMasters = document.getElementById('chartMasters').getContext('2d');
    new Chart(ctxMasters, {
        type: 'bar',
        data: {
            labels: ['Computer Science', 'MBA', 'Data Science', 'HCI', 'Finance'],
            datasets: [{
                label: 'Count',
                data: [65, 40, 35, 20, 15],
                backgroundColor: '#10b981',
                borderRadius: 4
            }]
        },
        options: commonOptions
    });
}

// ---------------- STUDENT DASHBOARD LOGIC ---------------- //

function switchStudentTab(tabId, btnContext) {
    document.querySelectorAll('.student-tab-content').forEach(tab => {
        tab.classList.add('hidden');
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    if (btnContext) {
        document.querySelectorAll('.student-sidebar .sidebar-btn').forEach(btn => btn.classList.remove('active'));
        btnContext.classList.add('active');
    }

    const target = document.getElementById(`student-tab-${tabId}`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.remove('hidden');
            target.classList.add('active');
        }, 10);
    }
}

function initializeStudentCharts() {
    const commonOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { 
            y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };

    // Chart 1: Course Enrolments
    const ctxCourses = document.getElementById('chartCourses').getContext('2d');
    new Chart(ctxCourses, {
        type: 'bar',
        data: {
            labels: ['Intro to CS', 'Data Structures', 'Microec', 'Psych 101', 'Calc II'],
            datasets: [{
                label: 'Enrolments',
                data: [350, 280, 220, 200, 180],
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: commonOptions
    });

    // Chart 2: Study Groups
    const ctxStudyGroups = document.getElementById('chartStudyGroups').getContext('2d');
    new Chart(ctxStudyGroups, {
        type: 'bar',
        data: {
            labels: ['Algorithms', 'Machine Learning', 'Accounting', 'Physics', 'Literature'],
            datasets: [{
                label: 'Groups',
                data: [15, 12, 8, 5, 3],
                backgroundColor: '#f59e0b',
                borderRadius: 4
            }]
        },
        options: commonOptions
    });
}

// ---------------- FACULTY DASHBOARD LOGIC ---------------- //

function switchFacultyTab(tabId, btnContext) {
    document.querySelectorAll('#view-faculty-home .student-tab-content').forEach(tab => {
        tab.classList.add('hidden');
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    if (btnContext) {
        document.querySelectorAll('#view-faculty-home .sidebar-btn').forEach(btn => btn.classList.remove('active'));
        btnContext.classList.add('active');
    }

    const target = document.getElementById(`faculty-tab-${tabId}`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.remove('hidden');
            target.classList.add('active');
        }, 10);
    }
}

function initializeFacultyCharts() {
    const commonOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { 
            y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };

    // Chart 1: Masters Pursuing On Campus (By Program)
    const ctxMasters = document.getElementById('chartFacultyMasters').getContext('2d');
    new Chart(ctxMasters, {
        type: 'bar',
        data: {
            labels: ['Computer Science', 'Business', 'Engineering', 'Sciences', 'Arts'],
            datasets: [{
                label: 'Masters Students',
                data: [420, 310, 250, 150, 90],
                backgroundColor: '#8b5cf6',
                borderRadius: 4
            }]
        },
        options: commonOptions
    });

    // Chart 2: Working Professors by Department
    const ctxProfs = document.getElementById('chartWorkingProfessors').getContext('2d');
    new Chart(ctxProfs, {
        type: 'bar',
        data: {
            labels: ['CS', 'Math', 'Physics', 'Biology', 'Chemistry'],
            datasets: [{
                label: 'Professors',
                data: [45, 30, 25, 35, 20],
                backgroundColor: '#f43f5e',
                borderRadius: 4
            }]
        },
        options: commonOptions
    });
}

// ---------------- ADMIN DASHBOARD LOGIC ---------------- //

function switchAdminTab(tabId, btnContext) {
    document.querySelectorAll('#view-admin-home .student-tab-content').forEach(tab => {
        tab.classList.add('hidden');
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    if (btnContext) {
        document.querySelectorAll('#view-admin-home .sidebar-btn').forEach(btn => btn.classList.remove('active'));
        btnContext.classList.add('active');
    }

    const target = document.getElementById(`admin-tab-${tabId}`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.remove('hidden');
            target.classList.add('active');
        }, 10);
    }
}

function initializeAdminCharts() {
    const commonOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { 
            y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.1)' } }
        }
    };

    // Chart 1: Alumni Participation
    const ctxAlumni = document.getElementById('chartAdminAlumni').getContext('2d');
    new Chart(ctxAlumni, {
        type: 'bar',
        data: {
            labels: ['Spring Music Fest', 'Tech Career Fair', 'Networking Mixer', 'Homecoming Game', 'Alumni Gala'],
            datasets: [{
                label: 'Alumni Attending',
                data: [120, 310, 450, 850, 600],
                backgroundColor: '#3b82f6',
                borderRadius: 4
            }]
        },
        options: commonOptions
    });

    // Chart 2: Student Participation
    const ctxStudents = document.getElementById('chartAdminStudents').getContext('2d');
    new Chart(ctxStudents, {
        type: 'bar',
        data: {
            labels: ['Spring Music Fest', 'Tech Career Fair', 'Robotics Workshop', 'Study Seminar', 'Basketball Finals'],
            datasets: [{
                label: 'Students Participating',
                data: [245, 512, 45, 180, 420],
                backgroundColor: '#10b981',
                borderRadius: 4
            }]
        },
        options: commonOptions
    });
}
