// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthentication();
    
    // Initialize dashboard
    initializeDashboard();
    
    // Setup navigation
    setupNavigation();
    
    // Setup user dropdown
    setupUserDropdown();
    
    // Load demo data
    loadDemoData();
    
    // Setup event listeners
    setupEventListeners();
});

// Demo data for inquiries
const DEMO_INQUIRIES = [
    {
        id: 'INQ-001',
        date: '2025-01-15',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techcorp.com',
        phone: '+1-555-0123',
        company: 'TechCorp Industries',
        service: 'air-freight',
        origin: 'United States',
        destination: 'Germany',
        message: 'Need urgent air freight service for electronic components. Timeline is critical - need delivery within 48 hours.',
        status: 'new',
        priority: 'high',
        submittedAt: '2025-01-15T10:30:00Z'
    },
    {
        id: 'INQ-002',
        date: '2025-01-14',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@globalmanuf.com',
        phone: '+1-555-0124',
        company: 'Global Manufacturing Co.',
        service: 'sea-freight',
        origin: 'China',
        destination: 'United States',
        message: 'Looking for cost-effective sea freight solution for bulk machinery parts. Regular monthly shipments expected.',
        status: 'in-progress',
        priority: 'medium',
        submittedAt: '2025-01-14T14:15:00Z'
    },
    {
        id: 'INQ-003',
        date: '2025-01-14',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'mchen@ecotrading.com',
        phone: '+1-555-0125',
        company: 'EcoTrade Solutions',
        service: 'import-clearance',
        origin: 'Japan',
        destination: 'Canada',
        message: 'Need assistance with customs clearance for organic food products. First time importing, need guidance.',
        status: 'resolved',
        priority: 'low',
        submittedAt: '2025-01-14T09:45:00Z'
    },
    {
        id: 'INQ-004',
        date: '2025-01-13',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.r@fashionforward.com',
        phone: '+1-555-0126',
        company: 'Fashion Forward Inc.',
        service: 'export-shipments',
        origin: 'United States',
        destination: 'United Kingdom',
        message: 'Seasonal fashion export to UK. Need reliable partner for regular shipments during fashion seasons.',
        status: 'in-progress',
        priority: 'medium',
        submittedAt: '2025-01-13T16:20:00Z'
    },
    {
        id: 'INQ-005',
        date: '2025-01-13',
        firstName: 'David',
        lastName: 'Thompson',
        email: 'dthompson@precisionparts.com',
        phone: '+1-555-0127',
        company: 'Precision Parts Ltd.',
        service: 'air-freight',
        origin: 'Germany',
        destination: 'United States',
        message: 'Urgent replacement parts needed for manufacturing line. Downtime is costing us significantly.',
        status: 'resolved',
        priority: 'high',
        submittedAt: '2025-01-13T11:10:00Z'
    },
    {
        id: 'INQ-006',
        date: '2025-01-12',
        firstName: 'Lisa',
        lastName: 'Wang',
        email: 'lisa.wang@meddevices.com',
        phone: '+1-555-0128',
        company: 'Medical Devices Corp',
        service: 'custom-house',
        origin: 'Switzerland',
        destination: 'United States',
        message: 'Medical equipment import requiring special handling and FDA compliance. Need experienced customs agent.',
        status: 'new',
        priority: 'high',
        submittedAt: '2025-01-12T13:30:00Z'
    },
    {
        id: 'INQ-007',
        date: '2025-01-12',
        firstName: 'Robert',
        lastName: 'Anderson',
        email: 'randerson@autoparts.com',
        phone: '+1-555-0129',
        company: 'Auto Parts International',
        service: 'sea-freight',
        origin: 'South Korea',
        destination: 'Mexico',
        message: 'Bulk automotive parts shipment. Looking for competitive rates and reliable transit times.',
        status: 'in-progress',
        priority: 'medium',
        submittedAt: '2025-01-12T08:45:00Z'
    },
    {
        id: 'INQ-008',
        date: '2025-01-11',
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@textileexports.com',
        phone: '+1-555-0130',
        company: 'Textile Exports Ltd.',
        service: 'procurement',
        origin: 'India',
        destination: 'United States',
        message: 'Need help obtaining export licenses for textile products. New to international trade.',
        status: 'resolved',
        priority: 'low',
        submittedAt: '2025-01-11T15:20:00Z'
    }
];

let currentInquiries = [...DEMO_INQUIRIES];
let currentPage = 1;
let itemsPerPage = 10;
let currentFilters = {
    search: '',
    status: '',
    service: ''
};

// Check authentication
function checkAuthentication() {
    const sessionData = JSON.parse(localStorage.getItem('adminSession') || sessionStorage.getItem('adminSession') || 'null');
    
    if (!sessionData || !sessionData.isAuthenticated) {
        // Not authenticated, redirect to login
        window.location.href = 'login.html';
        return;
    }
    
    // Check session validity
    const loginTime = new Date(sessionData.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
        // Session expired
        localStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminSession');
        window.location.href = 'login.html';
        return;
    }
    
    // Update user info in header
    document.querySelector('.admin-user-name').textContent = sessionData.username || 'Admin User';
}

// Initialize dashboard
function initializeDashboard() {
    // Show dashboard section by default
    showSection('dashboard');
    
    // Update stats
    updateDashboardStats();
    
    // Load recent inquiries
    loadRecentInquiries();
    
    console.log('Dashboard initialized successfully');
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.admin-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Handle view all buttons
    document.querySelectorAll('.view-all-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            if (section) {
                showSection(section);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                document.querySelector(`[data-section="${section}"]`).classList.add('active');
            }
        });
    });
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load section-specific data
        switch(sectionName) {
            case 'inquiries':
                loadInquiriesTable();
                break;
            case 'analytics':
                loadAnalytics();
                break;
        }
    }
}

// Setup user dropdown
function setupUserDropdown() {
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
            userMenuBtn.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            userDropdown.classList.remove('active');
            userMenuBtn.classList.remove('active');
        });
        
        // Prevent dropdown from closing when clicking inside
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

// Handle logout
function handleLogout() {
    // Clear session data
    localStorage.removeItem('adminSession');
    sessionStorage.removeItem('adminSession');
    
    // Show logout message
    alert('You have been logged out successfully.');
    
    // Redirect to login
    window.location.href = 'login.html';
}

// Load demo data
function loadDemoData() {
    // This function can be expanded to load data from an API
    console.log('Demo data loaded:', DEMO_INQUIRIES.length, 'inquiries');
}

// Update dashboard stats
function updateDashboardStats() {
    const totalInquiries = DEMO_INQUIRIES.length;
    const pendingInquiries = DEMO_INQUIRIES.filter(inq => inq.status === 'new' || inq.status === 'in-progress').length;
    const resolvedInquiries = DEMO_INQUIRIES.filter(inq => inq.status === 'resolved').length;
    
    document.getElementById('totalInquiries').textContent = totalInquiries;
    document.getElementById('pendingInquiries').textContent = pendingInquiries;
    document.getElementById('resolvedInquiries').textContent = resolvedInquiries;
    document.getElementById('avgResponseTime').textContent = '2.4h';
}

// Load recent inquiries for dashboard
function loadRecentInquiries() {
    const recentContainer = document.getElementById('recentInquiries');
    const recentInquiries = DEMO_INQUIRIES.slice(0, 5);
    
    recentContainer.innerHTML = recentInquiries.map(inquiry => `
        <div class="recent-inquiry">
            <div class="inquiry-avatar">${inquiry.firstName.charAt(0)}${inquiry.lastName.charAt(0)}</div>
            <div class="inquiry-info">
                <div class="inquiry-name">${inquiry.firstName} ${inquiry.lastName}</div>
                <div class="inquiry-service">${getServiceName(inquiry.service)}</div>
            </div>
            <div class="inquiry-time">${formatTimeAgo(inquiry.submittedAt)}</div>
        </div>
    `).join('');
}

// Load inquiries table
function loadInquiriesTable() {
    const tableBody = document.getElementById('inquiriesTableBody');
    const filteredInquiries = filterInquiries();
    const paginatedInquiries = paginateInquiries(filteredInquiries);
    
    tableBody.innerHTML = paginatedInquiries.map(inquiry => `
        <tr>
            <td>${inquiry.id}</td>
            <td>${formatDate(inquiry.date)}</td>
            <td>${inquiry.firstName} ${inquiry.lastName}</td>
            <td>${inquiry.email}</td>
            <td>${getServiceName(inquiry.service)}</td>
            <td><span class="status-badge status-${inquiry.status}">${inquiry.status.replace('-', ' ')}</span></td>
            <td><span class="priority-badge priority-${inquiry.priority}">${inquiry.priority}</span></td>
            <td>
                <button class="action-btn view" onclick="viewInquiry('${inquiry.id}')" title="View Details">👁️</button>
                <button class="action-btn edit" onclick="editInquiry('${inquiry.id}')" title="Edit Status">✏️</button>
                <button class="action-btn delete" onclick="deleteInquiry('${inquiry.id}')" title="Delete">🗑️</button>
            </td>
        </tr>
    `).join('');
    
    updatePagination(filteredInquiries.length);
}

// Filter inquiries
function filterInquiries() {
    return DEMO_INQUIRIES.filter(inquiry => {
        const matchesSearch = !currentFilters.search || 
            inquiry.firstName.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            inquiry.lastName.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            inquiry.email.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            inquiry.company.toLowerCase().includes(currentFilters.search.toLowerCase());
            
        const matchesStatus = !currentFilters.status || inquiry.status === currentFilters.status;
        const matchesService = !currentFilters.service || inquiry.service === currentFilters.service;
        
        return matchesSearch && matchesStatus && matchesService;
    });
}

// Paginate inquiries
function paginateInquiries(inquiries) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return inquiries.slice(startIndex, endIndex);
}

// Update pagination
function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInquiries');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentFilters.search = this.value;
            currentPage = 1;
            loadInquiriesTable();
        });
    }
    
    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const serviceFilter = document.getElementById('serviceFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            currentFilters.status = this.value;
            currentPage = 1;
            loadInquiriesTable();
        });
    }
    
    if (serviceFilter) {
        serviceFilter.addEventListener('change', function() {
            currentFilters.service = this.value;
            currentPage = 1;
            loadInquiriesTable();
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshInquiries');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Reset filters
            currentFilters = { search: '', status: '', service: '' };
            currentPage = 1;
            
            // Reset form elements
            if (searchInput) searchInput.value = '';
            if (statusFilter) statusFilter.value = '';
            if (serviceFilter) serviceFilter.value = '';
            
            // Reload table
            loadInquiriesTable();
            
            // Show feedback
            this.innerHTML = '✅ Refreshed';
            setTimeout(() => {
                this.innerHTML = '🔄 Refresh';
            }, 1000);
        });
    }
    
    // Pagination
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadInquiriesTable();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filterInquiries().length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                loadInquiriesTable();
            }
        });
    }
    
    // Modal functionality
    setupModalEventListeners();
}

// Setup modal event listeners
function setupModalEventListeners() {
    const modal = document.getElementById('inquiryModal');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modalCancel) {
        modalCancel.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// View inquiry details
function viewInquiry(inquiryId) {
    const inquiry = DEMO_INQUIRIES.find(inq => inq.id === inquiryId);
    if (!inquiry) return;
    
    const modal = document.getElementById('inquiryModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    modalTitle.textContent = `Inquiry Details - ${inquiry.id}`;
    
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <h4 style="color: var(--admin-primary); margin-bottom: 1rem;">Contact Information</h4>
                <p><strong>Name:</strong> ${inquiry.firstName} ${inquiry.lastName}</p>
                <p><strong>Email:</strong> ${inquiry.email}</p>
                <p><strong>Phone:</strong> ${inquiry.phone || 'Not provided'}</p>
                <p><strong>Company:</strong> ${inquiry.company || 'Not provided'}</p>
                <p><strong>Submitted:</strong> ${formatDateTime(inquiry.submittedAt)}</p>
            </div>
            <div>
                <h4 style="color: var(--admin-primary); margin-bottom: 1rem;">Service Details</h4>
                <p><strong>Service:</strong> ${getServiceName(inquiry.service)}</p>
                <p><strong>Origin:</strong> ${inquiry.origin || 'Not specified'}</p>
                <p><strong>Destination:</strong> ${inquiry.destination || 'Not specified'}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${inquiry.status}">${inquiry.status.replace('-', ' ')}</span></p>
                <p><strong>Priority:</strong> <span class="priority-badge priority-${inquiry.priority}">${inquiry.priority}</span></p>
            </div>
        </div>
        <div style="margin-top: 2rem;">
            <h4 style="color: var(--admin-primary); margin-bottom: 1rem;">Message</h4>
            <div style="background: var(--admin-bg); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--admin-primary);">
                ${inquiry.message}
            </div>
        </div>
        <div style="margin-top: 2rem;">
            <h4 style="color: var(--admin-primary); margin-bottom: 1rem;">Update Status</h4>
            <select id="statusUpdate" style="width: 100%; padding: 0.75rem; border: 1px solid var(--admin-border); border-radius: 6px;">
                <option value="new" ${inquiry.status === 'new' ? 'selected' : ''}>New</option>
                <option value="in-progress" ${inquiry.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                <option value="resolved" ${inquiry.status === 'resolved' ? 'selected' : ''}>Resolved</option>
            </select>
        </div>
    `;
    
    // Setup save button
    const modalSave = document.getElementById('modalSave');
    modalSave.onclick = function() {
        const newStatus = document.getElementById('statusUpdate').value;
        updateInquiryStatus(inquiryId, newStatus);
        closeModal();
    };
    
    modal.classList.add('active');
}

// Edit inquiry (simplified - just status update)
function editInquiry(inquiryId) {
    viewInquiry(inquiryId);
}

// Delete inquiry
function deleteInquiry(inquiryId) {
    if (confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
        const index = DEMO_INQUIRIES.findIndex(inq => inq.id === inquiryId);
        if (index > -1) {
            DEMO_INQUIRIES.splice(index, 1);
            loadInquiriesTable();
            updateDashboardStats();
            loadRecentInquiries();
            
            // Show success message
            showNotification('Inquiry deleted successfully', 'success');
        }
    }
}

// Update inquiry status
function updateInquiryStatus(inquiryId, newStatus) {
    const inquiry = DEMO_INQUIRIES.find(inq => inq.id === inquiryId);
    if (inquiry) {
        inquiry.status = newStatus;
        loadInquiriesTable();
        updateDashboardStats();
        loadRecentInquiries();
        
        showNotification('Status updated successfully', 'success');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('inquiryModal');
    modal.classList.remove('active');
}

// Load analytics
function loadAnalytics() {
    // This would typically load real analytics data
    console.log('Analytics loaded');
}

// Utility functions
function getServiceName(serviceCode) {
    const serviceNames = {
        'air-freight': 'Air Freight',
        'sea-freight': 'Sea Freight',
        'import-clearance': 'Import Clearance',
        'custom-house': 'Custom House',
        'export-shipments': 'Export Shipments',
        'procurement': 'License Procurement',
        'drawback': 'Drawback Claims',
        'liaison': 'DGFT Liaison',
        'other': 'Other'
    };
    return serviceNames[serviceCode] || serviceCode;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString();
}

function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(dateString);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--admin-success)' : 'var(--admin-primary)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: var(--admin-shadow-lg);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);