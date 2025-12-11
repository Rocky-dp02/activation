// Check authentication on load
window.addEventListener('load', () => {
    checkAuth();
    loadUserData();
    initializeSidebar();
    loadPage('dashboard'); // Load default page
});

// Check if user is authenticated
function checkAuth() {
    const authToken = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!authToken || !userData) {
        // Redirect to login if not authenticated
        window.location.href = 'index.html';
        return;
    }
}

// Load and display user data
function loadUserData() {
    const userDataString = localStorage.getItem('userData');
    
    if (!userDataString) {
        return;
    }
    
    try {
        const userData = JSON.parse(userDataString);
        const adminLogin = userData.adminLogin;
        
        // Display user name
        const userName = adminLogin.name || 'User';
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = userName;
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Back button functionality
const backBtn = document.getElementById('backBtn');
if (backBtn) {
    backBtn.addEventListener('click', () => {
        window.location.href = 'landing.html';
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        window.location.href = 'index.html';
    });
}

// Initialize sidebar functionality
function initializeSidebar() {
    setupSidebarNavigation();
    setupSidebarToggle();
    setupNotesPersistence();
}

// Setup sidebar navigation
function setupSidebarNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Load the corresponding page
            const page = item.getAttribute('data-page');
            
            // If loading page, authenticate first
            if (page === 'loading') {
                await authenticateLoadingAPI();
            }
            
            loadPage(page);
        });
    });
}

// Generate UUID for wsc-token
function generateWscToken() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Authenticate with loading API and store token2
async function authenticateLoadingAPI() {
    try {
        console.log('🔐 Authenticating with loading API...');
        
        // Generate required headers
        const timestamp = Date.now();
        const wscToken = generateWscToken();
        
        console.log('Request headers:', {
            timestamp,
            wscToken
        });
        
        const response = await fetch('https://load.s2s.ph/api/admin-login', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.6',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Origin': 'https://load.s2s.ph',
                'Referer': 'https://load.s2s.ph/dashboard/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'X-Requested-With': 'XMLHttpRequest',
                'wsc-timestamp': timestamp.toString(),
                'wsc-token': wscToken
            },
            body: 'username=superadmin&password=s2sadmin!%40%23',
            credentials: 'include'
        });
        
        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('✅ Loading API authentication response:', data);
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }
        
        if (data.status && data.data && data.data.token) {
            // Store token2 for loading API calls
            localStorage.setItem('token2', data.data.token);
            localStorage.setItem('token2_data', JSON.stringify(data.data));
            console.log('✅ Token2 stored:', data.data.token);
            
            // Show success notification
            showNotification('Loading API authenticated successfully!', 'success');
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        console.error('❌ Loading API authentication failed:', error);
        showNotification('Failed to authenticate with Loading API', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 255, 65, 0.9)' : type === 'error' ? 'rgba(255, 0, 0, 0.9)' : 'rgba(0, 191, 255, 0.9)'};
        color: ${type === 'success' || type === 'error' ? '#000' : '#fff'};
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Setup sidebar toggle
function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');
    
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        
        // Update toggle icon
        if (sidebar.classList.contains('collapsed')) {
            toggleIcon.textContent = '→';
        } else {
            toggleIcon.textContent = '←';
        }
    });
}

// Setup notes persistence
function setupNotesPersistence() {
    const notesTextarea = document.getElementById('sidebarNotes');
    
    // Load saved notes
    const savedNotes = localStorage.getItem('admin_notes');
    if (savedNotes) {
        notesTextarea.value = savedNotes;
    }
    
    // Save notes on input with debounce
    let saveTimeout;
    notesTextarea.addEventListener('input', () => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem('admin_notes', notesTextarea.value);
        }, 500);
    });
}

// Load page content
function loadPage(page) {
    const mainContent = document.getElementById('mainContent');
    
    const pages = {
        'dashboard': `
            <div class="page-content">
                <h2 style="color: #00ff41; margin-bottom: 20px;">📊 Dashboard</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px;">
                    <div style="background: rgba(0,255,65,0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.3);">
                        <h3 style="color: #00ff41; margin: 0 0 10px 0;">Total Users</h3>
                        <p style="font-size: 32px; margin: 0; color: #fff;">0</p>
                    </div>
                    <div style="background: rgba(0,255,65,0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.3);">
                        <h3 style="color: #00ff41; margin: 0 0 10px 0;">Active Sessions</h3>
                        <p style="font-size: 32px; margin: 0; color: #fff;">0</p>
                    </div>
                    <div style="background: rgba(0,255,65,0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.3);">
                        <h3 style="color: #00ff41; margin: 0 0 10px 0;">System Status</h3>
                        <p style="font-size: 24px; margin: 0; color: #00ff41;">Online</p>
                    </div>
                </div>
            </div>
        `,
        'users': `
            <div class="page-content">
                <h2 style="color: #00ff41; margin-bottom: 20px;">👥 User Management</h2>
                <p style="color: #aaa;">Manage system users and their permissions.</p>
                <div style="margin-top: 30px;">
                    <button class="action-btn" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none; padding: 12px 24px; color: white; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        <span>+ Add New User</span>
                    </button>
                </div>
            </div>
        `,
        'settings': `
            <div class="page-content">
                <h2 style="color: #00ff41; margin-bottom: 20px;">⚙️ System Settings</h2>
                <p style="color: #aaa;">Configure system parameters and preferences.</p>
                <div style="margin-top: 30px;">
                    <div style="background: rgba(0,255,65,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.2);">
                        <h3 style="color: #00ff41; margin: 0 0 15px 0;">General Settings</h3>
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <label style="color: #aaa;">
                                <input type="checkbox" checked> Enable notifications
                            </label>
                            <label style="color: #aaa;">
                                <input type="checkbox" checked> Auto-save changes
                            </label>
                            <label style="color: #aaa;">
                                <input type="checkbox"> Maintenance mode
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `,
        'logs': `
            <div class="page-content">
                <h2 style="color: #00ff41; margin-bottom: 20px;">📋 Activity Logs</h2>
                <p style="color: #aaa;">View system activity and user actions.</p>
                <div style="margin-top: 30px; background: rgba(0,255,65,0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.2);">
                    <pre style="color: #00ff41; margin: 0; font-family: 'Courier New', monospace; font-size: 12px;">[${new Date().toISOString()}] System initialized
[${new Date().toISOString()}] User logged in
[${new Date().toISOString()}] Admin panel accessed</pre>
                </div>
            </div>
        `,
        'reports': `
            <div class="page-content">
                <h2 style="color: #00ff41; margin-bottom: 20px;">📈 Reports</h2>
                <p style="color: #aaa;">Generate and view system reports.</p>
                <div style="margin-top: 30px;">
                    <button class="action-btn" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none; padding: 12px 24px; color: white; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        <span>📊 Generate Report</span>
                    </button>
                </div>
            </div>
        `,
        'loading': getLoadingPageContent()
    };
    
    // Load the page content with animation
    mainContent.style.opacity = '0';
    setTimeout(() => {
        mainContent.innerHTML = pages[page] || '<p>Page not found</p>';
        mainContent.style.opacity = '1';
    }, 150);
}

// Generate loading page content with token info
function getLoadingPageContent() {
    const token2 = localStorage.getItem('token2');
    const token2Data = localStorage.getItem('token2_data');
    let tokenInfo = '';
    
    if (token2 && token2Data) {
        try {
            const data = JSON.parse(token2Data);
            tokenInfo = `
                <div style="background: rgba(0,255,65,0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.3); margin-bottom: 30px;">
                    <h3 style="color: #00ff41; margin: 0 0 15px 0;">🔐 Authentication Status</h3>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <div style="display: flex; justify-content: space-between; color: #aaa;">
                            <span>Status:</span>
                            <span style="color: #00ff41; font-weight: bold;">✅ Authenticated</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; color: #aaa;">
                            <span>User:</span>
                            <span style="color: #fff;">${data.adminLogin?.name || 'N/A'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; color: #aaa;">
                            <span>Token2:</span>
                            <span style="color: #fff; font-family: monospace; font-size: 11px;">${token2.substring(0, 20)}...</span>
                        </div>
                    </div>
                </div>
            `;
        } catch (e) {
            console.error('Error parsing token2 data:', e);
        }
    } else {
        tokenInfo = `
            <div style="background: rgba(255,0,0,0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,0,0,0.3); margin-bottom: 30px;">
                <h3 style="color: #ff5555; margin: 0 0 15px 0;">⚠️ Not Authenticated</h3>
                <p style="color: #aaa; margin: 0;">Click "Loading" menu again to authenticate with the API.</p>
            </div>
        `;
    }
    
    return `
            <div class="page-content">
                <h2 style="color: #00ff41; margin-bottom: 20px;">⏳ Loading API</h2>
                <p style="color: #aaa;">Test loading animations and API authentication.</p>
                
                ${tokenInfo}
                
                <div style="margin-top: 30px; display: flex; flex-direction: column; gap: 30px;">
                    <!-- Spinner Loading -->
                    <div style="background: rgba(0,255,65,0.05); padding: 30px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.2); text-align: center;">
                        <h3 style="color: #00ff41; margin: 0 0 20px 0;">Spinner Loader</h3>
                        <div class="spinner" style="width: 50px; height: 50px; border: 4px solid rgba(0,255,65,0.2); border-top-color: #00ff41; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                    </div>
                    
                    <!-- Dots Loading -->
                    <div style="background: rgba(0,255,65,0.05); padding: 30px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.2); text-align: center;">
                        <h3 style="color: #00ff41; margin: 0 0 20px 0;">Dots Loader</h3>
                        <div style="display: flex; justify-content: center; gap: 10px;">
                            <div style="width: 15px; height: 15px; background: #00ff41; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; animation-delay: -0.32s;"></div>
                            <div style="width: 15px; height: 15px; background: #00ff41; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; animation-delay: -0.16s;"></div>
                            <div style="width: 15px; height: 15px; background: #00ff41; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both;"></div>
                        </div>
                    </div>
                    
                    <!-- Progress Bar -->
                    <div style="background: rgba(0,255,65,0.05); padding: 30px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.2);">
                        <h3 style="color: #00ff41; margin: 0 0 20px 0;">Progress Bar</h3>
                        <div style="width: 100%; height: 10px; background: rgba(0,255,65,0.2); border-radius: 5px; overflow: hidden;">
                            <div style="height: 100%; background: linear-gradient(90deg, #00ff41, #00cc33); animation: progress 2s ease-in-out infinite; border-radius: 5px;"></div>
                        </div>
                    </div>
                    
                    <!-- Pulse Loading -->
                    <div style="background: rgba(0,255,65,0.05); padding: 30px; border-radius: 8px; border: 1px solid rgba(0,255,65,0.2); text-align: center;">
                        <h3 style="color: #00ff41; margin: 0 0 20px 0;">Pulse Loader</h3>
                        <div style="width: 60px; height: 60px; background: #00ff41; border-radius: 50%; animation: pulse 2s infinite; margin: 0 auto;"></div>
                    </div>
                </div>
                
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1); }
                    }
                    @keyframes progress {
                        0% { width: 0%; }
                        50% { width: 100%; }
                        100% { width: 0%; }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.2); opacity: 0.5; }
                    }
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOut {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                </style>
            </div>
        `;
}
