// Check authentication on load
window.addEventListener('load', () => {
    checkAuth();
    loadUserData();
    initializeSidebar();
    loadPage('account-info'); // Load default page
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
        if (confirm('Are you sure you want to logout?')) {
            // Clear all session data
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            
            // Redirect to login
            window.location.href = 'index.html';
        }
    });
}

// Initialize sidebar navigation
function initializeSidebar() {
    const navItems = document.querySelectorAll('.nav-item');
    const sidebar = document.getElementById('sidebar');
    const sidebarNav = document.querySelector('.sidebar-nav');
    
    // Set initial page title
    updateSidebarTitle('Show Account Information');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Update sidebar title with current page
            const pageLabel = item.querySelector('.nav-label').textContent;
            updateSidebarTitle(pageLabel);
            
            // Load the corresponding page
            const page = item.getAttribute('data-page');
            loadPage(page);
            
            // Close dropdown on mobile
            if (window.innerWidth <= 768 && sidebarNav) {
                sidebarNav.classList.remove('active');
            }
        });
    });
    
    // Setup sidebar toggle for mobile dropdown
    setupMobileDropdown();
    
    // Setup sidebar toggle for desktop
    setupSidebarToggle();
}

// Update sidebar title (for mobile dropdown)
function updateSidebarTitle(title) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.setAttribute('data-current-page', title);
    }
}

// Setup mobile dropdown toggle
function setupMobileDropdown() {
    const sidebar = document.getElementById('sidebar');
    const sidebarNav = document.querySelector('.sidebar-nav');
    
    if (sidebar && sidebarNav) {
        // Toggle dropdown when clicking sidebar (only on mobile)
        sidebar.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !e.target.closest('.nav-item')) {
                e.stopPropagation();
                sidebarNav.classList.toggle('active');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && !sidebar.contains(e.target)) {
                sidebarNav.classList.remove('active');
            }
        });
    }
}

// Setup sidebar toggle
function setupSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('hidden');
        });
    }
}

// Load page content based on selection
function loadPage(page) {
    const mainContent = document.getElementById('mainContent');
    
    if (!mainContent) return;
    
    // Page content templates
    const pages = {
        'account-info': `
            <h2>Account Information</h2>
            <div class="search-section">
                <input type="text" id="accountNumberInput" class="search-input" placeholder="Enter account number...">
                <div class="button-group">
                    <button class="search-btn" id="searchAccountBtn">Search</button>
                    <button class="action-btn disconnect-btn" id="disconnectAccountBtn">Disconnect</button>
                </div>
            </div>
            <div class="account-info-section" id="accountInfoDisplay" style="display: none;">
                <div class="info-card" id="accountDetailsContainer">
                    <!-- Account details will be populated here dynamically -->
                </div>
            </div>
            <div class="search-results" id="accountSearchMessage">
                <p>Enter an account number to view account information</p>
            </div>
        `,
        dashboard: `
            <h2>Dashboard</h2>
            <div class="status-grid">
                <div class="status-card">
                    <span class="status-icon">⚡</span>
                    <div class="status-info">
                        <p class="status-label">System Status</p>
                        <p class="status-value status-online">ONLINE</p>
                    </div>
                </div>
                <div class="status-card">
                    <span class="status-icon">🔒</span>
                    <div class="status-info">
                        <p class="status-label">Security Level</p>
                        <p class="status-value status-online">MAXIMUM</p>
                    </div>
                </div>
                <div class="status-card">
                    <span class="status-icon">📊</span>
                    <div class="status-info">
                        <p class="status-label">Database</p>
                        <p class="status-value status-online">CONNECTED</p>
                    </div>
                </div>
                <div class="status-card">
                    <span class="status-icon">🌐</span>
                    <div class="status-info">
                        <p class="status-label">Network</p>
                        <p class="status-value status-online">STABLE</p>
                    </div>
                </div>
            </div>
        `,
        'verify-account': `
            <h2>Verify Account</h2>
            <div class="search-section">
                <input type="text" id="verifyAccountInput" class="search-input" placeholder="Enter account number to verify...">
                <button class="search-btn" id="verifyAccountBtn">Verify</button>
            </div>
            <div class="account-info-section" id="verifyAccountDisplay" style="display: none;">
                <div class="info-card" id="verifyAccountContainer">
                    <!-- Verification details will be populated here -->
                </div>
            </div>
            <div class="search-results" id="verifyAccountMessage">
                <p>Enter an account number to verify</p>
            </div>
        `,
        'search-vouchers': `
            <h2>Search Vouchers</h2>
            <div class="search-section">
                <input type="text" id="voucherSearchInput" class="search-input" placeholder="Enter Username/Voucher...">
                <div class="button-group">
                    <button class="search-btn" id="searchVoucherBtn">Search</button>
                    <button class="search-btn" id="reprocessVoucherBtn" style="background: linear-gradient(135deg, #a855f7 0%, #00d9ff 100%);">Reprocess</button>
                </div>
            </div>
            <div class="account-info-section" id="voucherResultDisplay" style="display: none;">
                <div class="info-card" id="voucherDetailsContainer">
                    <!-- Voucher details will be populated here -->
                </div>
            </div>
            <div class="search-results" id="voucherSearchMessage">
                <p>Enter a username or voucher code to search</p>
            </div>
        `,
        'search-retailer': `
            <h2>Search Retailer</h2>
            <div class="search-section">
                <input type="text" id="retailerSearchInput" class="search-input" placeholder="Enter Retailer ID, Mobile Number, or Retailer Name...">
                <button class="search-btn" id="searchRetailerBtn">Search Retailer</button>
            </div>
            <div class="account-info-section" id="retailerResultDisplay" style="display: none;">
                <div class="search-results-header" style="margin-bottom: 15px; padding: 10px; background: rgba(0, 255, 65, 0.1); border-left: 3px solid #00ff41; border-radius: 4px;">
                    <p style="margin: 0; color: #00ff41; font-weight: 600;">Search Results: <span id="retailerCount">0</span> retailer(s) found</p>
                </div>
                <div class="info-card" id="retailerDetailsContainer" style="max-height: 600px; overflow-y: auto;">
                    <!-- Retailer details will be populated here -->
                </div>
            </div>
            <div class="search-results" id="retailerSearchMessage">
                <p>Enter a retailer ID, mobile number, or name to search</p>
            </div>
        `,
        'check-refinstall': `
            <h2>Check RefInstall</h2>
            <div class="search-section">
                <input type="text" id="refInstallInput" class="search-input" placeholder="Enter reference or installation number...">
                <button class="search-btn" id="checkRefInstallBtn">Check</button>
            </div>
            <div class="account-info-section" id="refInstallResultDisplay" style="display: none;">
                <div class="info-card" id="refInstallDetailsContainer">
                    <!-- RefInstall details will be populated here -->
                </div>
            </div>
            <div class="search-results" id="refInstallMessage">
                <p>Enter a reference or installation number to check</p>
            </div>
        `,
        search: `
            <h2>Search</h2>
            <div class="search-section">
                <input type="text" class="search-input" placeholder="Enter search query...">
                <button class="search-btn">Search</button>
            </div>
            <div class="search-results">
                <p>Enter a search term to find records</p>
            </div>
        `,
        records: `
            <h2>Records Management</h2>
            <div class="records-section">
                <p>Record management interface will be displayed here</p>
                <div class="actions-grid">
                    <button class="action-btn">
                        <span class="action-icon">➕</span>
                        <span class="action-label">Add Record</span>
                    </button>
                    <button class="action-btn">
                        <span class="action-icon">📝</span>
                        <span class="action-label">Edit Record</span>
                    </button>
                    <button class="action-btn">
                        <span class="action-icon">🗑️</span>
                        <span class="action-label">Delete Record</span>
                    </button>
                </div>
            </div>
        `,
        reports: `
            <h2>Reports</h2>
            <div class="reports-section">
                <p>Generate and view reports</p>
                <div class="actions-grid">
                    <button class="action-btn">
                        <span class="action-icon">📊</span>
                        <span class="action-label">Generate Report</span>
                    </button>
                    <button class="action-btn">
                        <span class="action-icon">📤</span>
                        <span class="action-label">Export Report</span>
                    </button>
                </div>
            </div>
        `,
        settings: `
            <h2>Settings</h2>
            <div class="settings-section">
                <p>System configuration and preferences</p>
                <div class="settings-form">
                    <div class="form-group">
                        <label>System Name</label>
                        <input type="text" value="IDSS" disabled>
                    </div>
                    <div class="form-group">
                        <label>Auto-save</label>
                        <input type="checkbox" checked>
                    </div>
                    <button class="action-btn">
                        <span class="action-icon">💾</span>
                        <span class="action-label">Save Settings</span>
                    </button>
                </div>
            </div>
        `
    };
    
    // Load the page content with animation
    mainContent.style.opacity = '0';
    setTimeout(() => {
        mainContent.innerHTML = pages[page] || '<p>Page not found</p>';
        mainContent.style.opacity = '1';
        
        // If account info page, setup search functionality
        if (page === 'account-info') {
            setupAccountSearch();
        }
        
        // If verify account page, setup verification functionality
        if (page === 'verify-account') {
            setupAccountVerification();
        }
        
        // If search vouchers page, setup voucher search functionality
        if (page === 'search-vouchers') {
            setupVoucherSearch();
        }
        
        // If search retailer page, setup retailer search functionality
        if (page === 'search-retailer') {
            setupRetailerSearch();
        }
        
        // If check refinstall page, setup refinstall check functionality
        if (page === 'check-refinstall') {
            setupRefInstallCheck();
        }
    }, 150);
}

// Setup account search functionality
function setupAccountSearch() {
    const searchBtn = document.getElementById('searchAccountBtn');
    const disconnectBtn = document.getElementById('disconnectAccountBtn');
    const accountInput = document.getElementById('accountNumberInput');
    
    if (searchBtn && accountInput) {
        // Search button click
        searchBtn.addEventListener('click', () => {
            const accountNumber = accountInput.value.trim();
            if (accountNumber) {
                searchAccount(accountNumber);
            } else {
                showSearchMessage('Please enter an account number', 'error');
            }
        });
        
        // Enter key press
        accountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const accountNumber = accountInput.value.trim();
                if (accountNumber) {
                    searchAccount(accountNumber);
                } else {
                    showSearchMessage('Please enter an account number', 'error');
                }
            }
        });
    }
    
    if (disconnectBtn && accountInput) {
        // Disconnect button click
        disconnectBtn.addEventListener('click', () => {
            const accountNumber = accountInput.value.trim();
            if (accountNumber) {
                disconnectAccount(accountNumber);
            } else {
                showSearchMessage('Please enter an account number', 'error');
            }
        });
    }
}

// Setup voucher search functionality
function setupVoucherSearch() {
    const searchBtn = document.getElementById('searchVoucherBtn');
    const reprocessBtn = document.getElementById('reprocessVoucherBtn');
    const voucherInput = document.getElementById('voucherSearchInput');
    
    if (searchBtn && voucherInput) {
        // Search button click
        searchBtn.addEventListener('click', () => {
            const searchValue = voucherInput.value.trim();
            if (searchValue) {
                searchVoucher(searchValue);
            } else {
                showVoucherMessage('Please enter a username or voucher code', 'error');
            }
        });
        
        // Enter key press
        voucherInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchValue = voucherInput.value.trim();
                if (searchValue) {
                    searchVoucher(searchValue);
                } else {
                    showVoucherMessage('Please enter a username or voucher code', 'error');
                }
            }
        });
    }
    
    if (reprocessBtn) {
        // Reprocess button click
        reprocessBtn.addEventListener('click', () => {
            reprocessVoucher();
        });
    }
}

// Search for voucher
async function searchVoucher(searchValue) {
    const voucherDisplay = document.getElementById('voucherResultDisplay');
    const voucherMessage = document.getElementById('voucherSearchMessage');
    
    // Show loading state
    showVoucherMessage('Searching...', 'loading');
    
    try {
        console.log('Searching for:', searchValue);
        
        const payload = {
            trans: "checkdetails",
            username: searchValue
        };
        
        console.log('Voucher search payload:', payload);
        
        // Make API call through proxy
        const response = await fetch('http://localhost:3000/api/search-vouchers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('Voucher search response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlResponse = await response.text();
        console.log('Voucher search response received, length:', htmlResponse.length);
        console.log('Full voucher response:', htmlResponse);
        
        // Parse all tables from the response
        const voucherTables = parseVoucherTables(htmlResponse);
        console.log('Parsed voucher tables:', voucherTables);
        
        if (voucherTables && voucherTables.length > 0) {
            // Display all tables
            const container = document.getElementById('voucherDetailsContainer');
            if (container) {
                container.innerHTML = '';
                
                voucherTables.forEach((tableData, index) => {
                    // Create section for each table
                    const section = document.createElement('div');
                    section.className = 'voucher-section';
                    section.style.marginBottom = '25px';
                    section.style.background = 'rgba(0, 255, 65, 0.05)';
                    section.style.padding = '20px';
                    section.style.borderRadius = '8px';
                    section.style.border = '1px solid rgba(0, 255, 65, 0.2)';
                    
                    // Add table title if available
                    if (tableData.title) {
                        const title = document.createElement('h3');
                        title.textContent = tableData.title;
                        title.style.color = '#00d9ff';
                        title.style.marginBottom = '15px';
                        title.style.fontSize = '18px';
                        title.style.fontWeight = '600';
                        title.style.textTransform = 'uppercase';
                        title.style.letterSpacing = '1px';
                        title.style.textShadow = '0 0 10px rgba(0, 217, 255, 0.5)';
                        section.appendChild(title);
                    }
                    
                    // Create table
                    const table = document.createElement('table');
                    table.style.width = '100%';
                    table.style.borderCollapse = 'collapse';
                    table.style.marginBottom = '0';
                    table.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.1)';
                    
                    // Add headers
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    tableData.headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        th.style.background = 'linear-gradient(135deg, #00ff41 0%, #00d9ff 100%)';
                        th.style.color = '#0a0e27';
                        th.style.padding = '8px 12px';
                        th.style.border = '1px solid #00ff41';
                        th.style.textAlign = 'center';
                        th.style.fontWeight = '600';
                        th.style.fontSize = '12px';
                        th.style.textTransform = 'uppercase';
                        th.style.letterSpacing = '0.5px';
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);
                    table.appendChild(thead);
                    
                    // Add rows
                    const tbody = document.createElement('tbody');
                    tableData.rows.forEach((rowData, rowIndex) => {
                        const tr = document.createElement('tr');
                        tr.style.transition = 'all 0.3s ease';
                        tr.style.background = rowIndex % 2 === 0 ? 'rgba(0, 255, 65, 0.03)' : 'transparent';
                        
                        // Add hover effect
                        tr.addEventListener('mouseenter', function() {
                            this.style.background = 'rgba(0, 255, 65, 0.15)';
                            this.style.transform = 'scale(1.01)';
                        });
                        tr.addEventListener('mouseleave', function() {
                            this.style.background = rowIndex % 2 === 0 ? 'rgba(0, 255, 65, 0.03)' : 'transparent';
                            this.style.transform = 'scale(1)';
                        });
                        
                        rowData.forEach((cellData, cellIndex) => {
                            const td = document.createElement('td');
                            td.textContent = cellData || 'No Value';
                            td.setAttribute('data-label', tableData.headers[cellIndex] || '');
                            td.style.padding = '10px 15px';
                            td.style.border = '1px solid rgba(0, 255, 65, 0.2)';
                            td.style.color = cellData ? '#00ff41' : '#666';
                            td.style.fontSize = '13px';
                            td.style.fontWeight = cellIndex === 0 ? '600' : '400';
                            if (cellIndex === 0) {
                                td.style.color = '#00d9ff';
                            }
                            tr.appendChild(td);
                        });
                        tbody.appendChild(tr);
                    });
                    table.appendChild(tbody);
                    
                    section.appendChild(table);
                    container.appendChild(section);
                });
            }
            
            // Show results
            if (voucherDisplay) voucherDisplay.style.display = 'block';
            if (voucherMessage) voucherMessage.style.display = 'none';
        } else {
            showVoucherMessage('No voucher information found.', 'error');
        }
        
    } catch (error) {
        console.error('Error searching voucher:', error);
        showVoucherMessage(`Error: ${error.message}. Check console for details.`, 'error');
    }
}

// Parse voucher tables from HTML response
function parseVoucherTables(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tables = doc.querySelectorAll('table');
    
    const tablesData = [];
    
    tables.forEach((table, index) => {
        const tableData = {
            title: '',
            headers: [],
            rows: []
        };
        
        // Extract headers
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(th => {
            tableData.headers.push(th.textContent.trim());
        });
        
        // Extract rows
        const bodyRows = table.querySelectorAll('tbody tr, tr:not(thead tr)');
        bodyRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const rowData = [];
                cells.forEach(td => {
                    rowData.push(td.textContent.trim());
                });
                // Only add non-empty rows
                if (rowData.some(cell => cell !== '')) {
                    tableData.rows.push(rowData);
                }
            }
        });
        
        // Only add tables that have headers and optionally rows
        if (tableData.headers.length > 0) {
            // Set title based on content
            if (index === 0) tableData.title = 'Voucher Information';
            else if (index === 1) tableData.title = 'Account Attributes';
            else if (index === 2) tableData.title = 'User Details';
            else tableData.title = `Details ${index + 1}`;
            
            // Only add if table has data rows or we want to show empty tables
            if (tableData.rows.length > 0) {
                tablesData.push(tableData);
            }
        }
    });
    
    return tablesData;
}

// Reprocess voucher
async function reprocessVoucher() {
    // Get the voucher details from the displayed table
    const voucherDisplay = document.getElementById('voucherResultDisplay');
    
    if (!voucherDisplay || voucherDisplay.style.display === 'none') {
        alert('Please search for a voucher first before reprocessing');
        return;
    }
    
    // Extract account number and PIN from the table headers and rows
    let accountNumber = '';
    let pin = '';
    
    // Find all table cells and extract the data
    const tables = document.querySelectorAll('#voucherDetailsContainer table');
    console.log('Found tables:', tables.length);
    
    tables.forEach((table, tableIndex) => {
        // Get headers
        const headers = [];
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(th => {
            headers.push(th.textContent.trim().toLowerCase());
        });
        console.log(`Table ${tableIndex} headers:`, headers);
        
        // Get data rows
        const rows = table.querySelectorAll('tbody tr');
        console.log(`Table ${tableIndex} has ${rows.length} rows`);
        
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            console.log(`Row ${rowIndex} has ${cells.length} cells`);
            
            // Map cells to headers
            cells.forEach((cell, cellIndex) => {
                const value = cell.textContent.trim();
                const header = headers[cellIndex] || '';
                
                console.log(`Header: "${header}", Value: "${value}"`);
                
                // Check for "Used By" specifically for account number
                if (header.includes('used by') || header === 'used by') {
                    if (value && value !== 'N/A' && value !== 'No Value') {
                        accountNumber = value;
                        console.log('Found account number from "Used By":', accountNumber);
                    }
                }
                
                // Check for PIN/voucher in headers
                if (header.includes('pin') || 
                    header.includes('voucher') || 
                    header.includes('code') ||
                    header === 'pin' ||
                    header === 'pins') {
                    if (value && value !== 'N/A' && value !== 'No Value') {
                        pin = value;
                        console.log('Found PIN from header:', pin);
                    }
                }
            });
        });
    });
    
    console.log('Final values - Account Number:', accountNumber, 'PIN:', pin);
    
    // Validate we have the required data
    if (!accountNumber || !pin) {
        alert('Could not find account number or PIN in the voucher details. Please ensure voucher data is loaded. Check console for details.');
        console.error('Missing data - Account Number:', accountNumber, 'PIN:', pin);
        return;
    }
    
    // Show modal with loading state
    showModal('Processing voucher...', true);
    
    try {
        console.log('Reprocessing voucher - Account:', accountNumber, 'PIN:', pin);
        
        const payload = {
            accountNumber: accountNumber,
            pins: pin
        };
        
        console.log('Reprocess payload:', payload);
        
        // Make API call through proxy
        const response = await fetch('http://localhost:3000/api/reprocess-voucher', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('Reprocess response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Reprocess result:', result);
        
        // Update modal with response
        let message = '';
        if (result.status === 'success') {
            message = `✓ Success: ${result.message || 'Voucher processed successfully!'}`;
        } else if (result.message) {
            message = result.message;
        } else {
            message = JSON.stringify(result, null, 2);
        }
        
        updateModal(message, false);
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
            closeModal();
        }, 3000);
        
    } catch (error) {
        console.error('Error reprocessing voucher:', error);
        updateModal(`✗ Error: ${error.message}`, false);
        
        // Auto-close modal after 4 seconds on error
        setTimeout(() => {
            closeModal();
        }, 4000);
    }
}

// Show voucher message
function showVoucherMessage(message, type) {
    const voucherMessage = document.getElementById('voucherSearchMessage');
    const voucherDisplay = document.getElementById('voucherResultDisplay');
    
    if (voucherMessage) {
        voucherMessage.innerHTML = `<p class="${type}">${message}</p>`;
        voucherMessage.style.display = 'block';
    }
    
    if (voucherDisplay) {
        voucherDisplay.style.display = 'none';
    }
}

// Setup account verification functionality
function setupAccountVerification() {
    const verifyBtn = document.getElementById('verifyAccountBtn');
    const accountInput = document.getElementById('verifyAccountInput');
    
    if (verifyBtn && accountInput) {
        // Verify button click
        verifyBtn.addEventListener('click', () => {
            const accountNumber = accountInput.value.trim();
            if (accountNumber) {
                verifyAccount(accountNumber);
            } else {
                showVerifyMessage('Please enter an account number', 'error');
            }
        });
        
        // Enter key press
        accountInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const accountNumber = accountInput.value.trim();
                if (accountNumber) {
                    verifyAccount(accountNumber);
                } else {
                    showVerifyMessage('Please enter an account number', 'error');
                }
            }
        });
    }
}

// Verify account
async function verifyAccount(accountNumber) {
    const verifyDisplay = document.getElementById('verifyAccountDisplay');
    const verifyMessage = document.getElementById('verifyAccountMessage');
    
    // Show loading state
    showVerifyMessage('Verifying account...', 'loading');
    
    try {
        console.log('Verifying account:', accountNumber);
        
        const payload = {
            trans: "checkdetails",
            username: accountNumber
        };
        
        console.log('Verify payload:', payload);
        
        // Make API call through proxy
        const response = await fetch('http://localhost:3000/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('Verify response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlResponse = await response.text();
        console.log('Verify response received, length:', htmlResponse.length);
        console.log('Full verify response:', htmlResponse);
        
        // Parse all tables from the response
        const verificationData = parseVerificationTables(htmlResponse);
        console.log('Parsed verification data:', verificationData);
        
        if (verificationData && verificationData.length > 0) {
            // Display all tables
            const container = document.getElementById('verifyAccountContainer');
            if (container) {
                container.innerHTML = '';
                
                verificationData.forEach((tableData, index) => {
                    // Create section for each table
                    const section = document.createElement('div');
                    section.className = 'verification-section';
                    section.style.marginBottom = '25px';
                    section.style.background = 'rgba(0, 255, 65, 0.05)';
                    section.style.padding = '20px';
                    section.style.borderRadius = '8px';
                    section.style.border = '1px solid rgba(0, 255, 65, 0.2)';
                    
                    // Add table title if available
                    if (tableData.title) {
                        const title = document.createElement('h3');
                        title.textContent = tableData.title;
                        title.style.color = '#00d9ff';
                        title.style.marginBottom = '15px';
                        title.style.fontSize = '18px';
                        title.style.fontWeight = '600';
                        title.style.textTransform = 'uppercase';
                        title.style.letterSpacing = '1px';
                        title.style.textShadow = '0 0 10px rgba(0, 217, 255, 0.5)';
                        section.appendChild(title);
                    }
                    
                    // Create table
                    const table = document.createElement('table');
                    table.style.width = '100%';
                    table.style.borderCollapse = 'collapse';
                    table.style.marginBottom = '0';
                    table.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.1)';
                    
                    // Add headers
                    const thead = document.createElement('thead');
                    const headerRow = document.createElement('tr');
                    tableData.headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        th.style.background = 'linear-gradient(135deg, #00ff41 0%, #00d9ff 100%)';
                        th.style.color = '#0a0e27';
                        th.style.padding = '8px 12px';
                        th.style.border = '1px solid #00ff41';
                        th.style.textAlign = 'center';
                        th.style.fontWeight = '600';
                        th.style.fontSize = '12px';
                        th.style.textTransform = 'uppercase';
                        th.style.letterSpacing = '0.5px';
                        headerRow.appendChild(th);
                    });
                    thead.appendChild(headerRow);
                    table.appendChild(thead);
                    
                    // Add rows
                    const tbody = document.createElement('tbody');
                    tableData.rows.forEach((rowData, rowIndex) => {
                        const tr = document.createElement('tr');
                        tr.style.transition = 'all 0.3s ease';
                        tr.style.background = rowIndex % 2 === 0 ? 'rgba(0, 255, 65, 0.03)' : 'transparent';
                        
                        // Add hover effect
                        tr.addEventListener('mouseenter', function() {
                            this.style.background = 'rgba(0, 255, 65, 0.15)';
                            this.style.transform = 'scale(1.01)';
                        });
                        tr.addEventListener('mouseleave', function() {
                            this.style.background = rowIndex % 2 === 0 ? 'rgba(0, 255, 65, 0.03)' : 'transparent';
                            this.style.transform = 'scale(1)';
                        });
                        
                        rowData.forEach((cellData, cellIndex) => {
                            const td = document.createElement('td');
                            td.textContent = cellData || 'N/A';
                            td.setAttribute('data-label', tableData.headers[cellIndex] || '');
                            td.style.padding = '10px 15px';
                            td.style.border = '1px solid rgba(0, 255, 65, 0.2)';
                            td.style.color = cellData ? '#00ff41' : '#666';
                            td.style.fontSize = '13px';
                            td.style.fontWeight = cellIndex === 0 ? '600' : '400';
                            if (cellIndex === 0) {
                                td.style.color = '#00d9ff';
                            }
                            tr.appendChild(td);
                        });
                        tbody.appendChild(tr);
                    });
                    table.appendChild(tbody);
                    
                    section.appendChild(table);
                    container.appendChild(section);
                });
            }
            
            // Show results
            if (verifyDisplay) verifyDisplay.style.display = 'block';
            if (verifyMessage) verifyMessage.style.display = 'none';
        } else {
            showVerifyMessage('No verification data found.', 'error');
        }
        
    } catch (error) {
        console.error('Error verifying account:', error);
        showVerifyMessage(`Error: ${error.message}. Check console for details.`, 'error');
    }
}

// Parse verification tables from HTML response
function parseVerificationTables(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tables = doc.querySelectorAll('table');
    
    const tablesData = [];
    
    tables.forEach((table, index) => {
        const tableData = {
            title: '',
            headers: [],
            rows: []
        };
        
        // Extract headers
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach(th => {
            tableData.headers.push(th.textContent.trim());
        });
        
        // Extract rows
        const bodyRows = table.querySelectorAll('tbody tr, tr:not(thead tr)');
        bodyRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                const rowData = [];
                cells.forEach(td => {
                    rowData.push(td.textContent.trim());
                });
                tableData.rows.push(rowData);
            }
        });
        
        // Only add tables that have data
        if (tableData.headers.length > 0 && tableData.rows.length > 0) {
            // Set title based on content
            if (index === 0) tableData.title = 'Account Status';
            else if (index === 1) tableData.title = 'Session Information';
            else if (index === 2) tableData.title = 'Authentication Details';
            else if (index === 3) tableData.title = 'Account Attributes';
            else if (index === 4) tableData.title = 'User Information';
            else if (index === 5) tableData.title = 'Package Details';
            else tableData.title = `Details ${index + 1}`;
            
            tablesData.push(tableData);
        }
    });
    
    return tablesData;
}

// Show verify message
function showVerifyMessage(message, type) {
    const verifyMessage = document.getElementById('verifyAccountMessage');
    const verifyDisplay = document.getElementById('verifyAccountDisplay');
    
    if (verifyMessage) {
        verifyMessage.innerHTML = `<p class="${type}">${message}</p>`;
        verifyMessage.style.display = 'block';
    }
    
    if (verifyDisplay) {
        verifyDisplay.style.display = 'none';
    }
}

// Disconnect account
async function disconnectAccount(accountNumber) {
    // Show confirmation
    if (!confirm(`Are you sure you want to disconnect account ${accountNumber}?`)) {
        return;
    }
    
    // Show modal with loading state
    const modal = showModal('Disconnecting account...', true);
    
    try {
        console.log('Disconnecting account:', accountNumber);
        
        const payload = {
            trans: "disconnect",
            usrname: accountNumber
        };
        
        console.log('Disconnect payload:', payload);
        
        // Make API call through proxy
        const response = await fetch('http://localhost:3000/api/disconnect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('Disconnect response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();
        console.log('Disconnect response:', responseText);
        
        // Parse the response to check if disconnection was successful
        let status = null;
        let message = '';
        
        try {
            // Find the last JSON object in the response (contains status and message)
            const jsonMatch = responseText.match(/\{[^}]*"status"[^}]*\}$/);
            if (jsonMatch) {
                const statusInfo = JSON.parse(jsonMatch[0]);
                status = statusInfo.status;
                message = statusInfo.message;
            }
        } catch (e) {
            console.error('Error parsing disconnect response:', e);
        }
        
        // Update modal with result
        if (status === false) {
            updateModal(modal, message || 'No active session found for this account.', false);
        } else {
            updateModal(modal, `Account ${accountNumber} has been disconnected successfully.`, false);
        }
        
        // Auto-close modal after 3 seconds (keep search results visible)
        setTimeout(() => {
            closeModal(modal);
        }, 3000);
        
    } catch (error) {
        console.error('Error disconnecting account:', error);
        updateModal(modal, `Error: ${error.message}. Please try again.`, false);
        
        // Auto-close on error after 3 seconds
        setTimeout(() => {
            closeModal(modal);
        }, 3000);
    }
}

// Show modal with loading spinner
function showModal(message, showSpinner = true) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            ${showSpinner ? '<div class="modal-spinner"></div>' : ''}
            <div class="modal-message">${message}</div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

// Update modal message and optionally hide spinner
function updateModal(modal, message, showSpinner = false) {
    const content = modal.querySelector('.modal-content');
    content.innerHTML = `
        ${showSpinner ? '<div class="modal-spinner"></div>' : ''}
        <div class="modal-message">${message}</div>
    `;
}

// Close and remove modal
function closeModal(modal) {
    if (modal && modal.parentNode) {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Search for account information
async function searchAccount(accountNumber) {
    const accountInfoDisplay = document.getElementById('accountInfoDisplay');
    const searchMessage = document.getElementById('accountSearchMessage');
    
    // Show loading state
    showSearchMessage('Searching for account...', 'loading');
    
    try {
        console.log('Searching for account:', accountNumber);
        
        const payload = {
            account_no: accountNumber,
            serial: accountNumber,
            trans: "viewdetails",
            user: `${accountNumber}@prepaid_fiber`
        };
        
        console.log('Request payload:', payload);
        
        // Make API call through proxy to avoid CORS issues
        const response = await fetch('http://localhost:3000/api/account-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlResponse = await response.text();
        console.log('Response received, length:', htmlResponse.length);
        console.log('Full response:', htmlResponse);
        
        // Parse all tables from the HTML response
        const accountTables = parseAccountTables(htmlResponse);
        console.log('Parsed account tables:', accountTables);
        console.log('Number of tables found:', accountTables.length);
        
        if (accountTables && accountTables.length > 0) {
            // Display all tables
            const container = document.getElementById('accountDetailsContainer');
            if (container) {
                container.innerHTML = '';
                
                accountTables.forEach((tableData, index) => {
                    // Create section for each table
                    const section = document.createElement('div');
                    section.className = 'account-section';
                    section.style.marginBottom = '25px';
                    section.style.background = 'rgba(0, 255, 65, 0.05)';
                    section.style.padding = '20px';
                    section.style.borderRadius = '8px';
                    section.style.border = '1px solid rgba(0, 255, 65, 0.2)';
                    
                    // Add table title if available
                    if (tableData.title) {
                        const title = document.createElement('h3');
                        title.textContent = tableData.title;
                        title.style.color = '#00d9ff';
                        title.style.marginBottom = '15px';
                        title.style.fontSize = '18px';
                        title.style.fontWeight = '600';
                        title.style.textTransform = 'uppercase';
                        title.style.letterSpacing = '1px';
                        title.style.textShadow = '0 0 10px rgba(0, 217, 255, 0.5)';
                        section.appendChild(title);
                    }
                    
                    // Create table
                    const table = document.createElement('table');
                    table.style.width = '100%';
                    table.style.borderCollapse = 'collapse';
                    table.style.marginBottom = '0';
                    table.style.boxShadow = '0 0 20px rgba(0, 255, 65, 0.1)';
                    
                    // Skip adding headers - just add rows directly
                    
                    // Add rows
                    const tbody = document.createElement('tbody');
                    tableData.rows.forEach((rowData, rowIndex) => {
                        const tr = document.createElement('tr');
                        tr.style.transition = 'all 0.3s ease';
                        tr.style.background = rowIndex % 2 === 0 ? 'rgba(0, 255, 65, 0.03)' : 'transparent';
                        
                        // Add hover effect
                        tr.addEventListener('mouseenter', function() {
                            this.style.background = 'rgba(0, 255, 65, 0.15)';
                            this.style.transform = 'scale(1.01)';
                        });
                        tr.addEventListener('mouseleave', function() {
                            this.style.background = rowIndex % 2 === 0 ? 'rgba(0, 255, 65, 0.03)' : 'transparent';
                            this.style.transform = 'scale(1)';
                        });
                        
                        rowData.forEach((cellData, cellIndex) => {
                            const td = document.createElement('td');
                            td.textContent = cellData || 'No Value';
                            td.style.padding = '10px 15px';
                            td.style.border = '1px solid rgba(0, 255, 65, 0.2)';
                            td.style.color = cellData ? '#00ff41' : '#666';
                            td.style.fontSize = '13px';
                            td.style.fontWeight = cellIndex === 0 ? '600' : '400';
                            if (cellIndex === 0) {
                                td.style.color = '#00d9ff';
                            }
                            tr.appendChild(td);
                        });
                        tbody.appendChild(tr);
                    });
                    table.appendChild(tbody);
                    
                    section.appendChild(table);
                    container.appendChild(section);
                });
            }
            
            // Show results
            if (accountInfoDisplay) accountInfoDisplay.style.display = 'block';
            if (searchMessage) searchMessage.style.display = 'none';
        } else {
            showSearchMessage('No account information found. The response may be empty or in an unexpected format.', 'error');
        }
        
    } catch (error) {
        console.error('Error searching account:', error);
        console.error('Error details:', error.message);
        showSearchMessage(`Error: ${error.message}. Check console for details.`, 'error');
    }
}

// Parse HTML response to extract account information tables
function parseAccountTables(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tables = doc.querySelectorAll('table');
    
    console.log('Total tables found:', tables.length);
    
    const tablesData = [];
    
    tables.forEach((table, index) => {
        console.log(`Processing table ${index}:`, table.outerHTML.substring(0, 200));
        
        const tableData = {
            title: '',
            headers: [],
            rows: []
        };
        
        // Extract headers - try multiple strategies
        let headerCells = table.querySelectorAll('thead th');
        console.log(`Table ${index} - thead th found:`, headerCells.length);
        
        if (headerCells.length > 0) {
            headerCells.forEach(th => {
                const headerText = th.textContent.trim();
                // Skip "Account Information" header text
                if (headerText && headerText !== 'Account Information') {
                    tableData.headers.push(headerText);
                }
            });
        } else {
            // Try finding th in any row
            headerCells = table.querySelectorAll('th');
            console.log(`Table ${index} - any th found:`, headerCells.length);
            
            if (headerCells.length > 0) {
                headerCells.forEach(th => {
                    const headerText = th.textContent.trim();
                    // Skip "Account Information" header text
                    if (headerText && headerText !== 'Account Information') {
                        tableData.headers.push(headerText);
                    }
                });
            } else {
                // Use first row td as headers if no th found
                const firstRow = table.querySelector('tr');
                if (firstRow) {
                    const cells = firstRow.querySelectorAll('td');
                    console.log(`Table ${index} - first row td found:`, cells.length);
                    cells.forEach(cell => {
                        const headerText = cell.textContent.trim();
                        // Skip "Account Information" header text
                        if (headerText && headerText !== 'Account Information') {
                            tableData.headers.push(headerText);
                        }
                    });
                }
            }
        }
        
        console.log(`Table ${index} - headers:`, tableData.headers);
        
        // Extract data rows
        const allRows = table.querySelectorAll('tr');
        console.log(`Table ${index} - total rows:`, allRows.length);
        
        allRows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td');
            
            // Skip rows that are likely headers (if we found th elements)
            if (cells.length > 0) {
                const rowData = [];
                cells.forEach(td => {
                    rowData.push(td.textContent.trim());
                });
                
                // Only add non-empty rows
                if (rowData.some(cell => cell !== '')) {
                    // If headers are "Column 1" and "Column 2", merge them and skip this row
                    if (tableData.headers.length === 2 && 
                        tableData.headers[0] === 'Column 1' && 
                        tableData.headers[1] === 'Column 2' && 
                        rowData.length === 2) {
                        // Skip - this table will be filtered out
                    } else {
                        tableData.rows.push(rowData);
                    }
                }
            }
        });
        
        console.log(`Table ${index} - rows:`, tableData.rows.length);
        
        // Add table even if just headers or just data (be more lenient)
        // But skip tables with only "Column 1" and "Column 2" headers
        const isGenericColumnTable = tableData.headers.length === 2 && 
                                     tableData.headers[0] === 'Column 1' && 
                                     tableData.headers[1] === 'Column 2';
        
        if (!isGenericColumnTable && (tableData.headers.length > 0 || tableData.rows.length > 0)) {
            // Set title based on table index
            if (index === 0) tableData.title = 'Account Information';
            else if (index === 1) tableData.title = 'Additional Details';
            else tableData.title = `Details ${index + 1}`;
            
            // If no headers but have rows, create generic headers
            if (tableData.headers.length === 0 && tableData.rows.length > 0) {
                const numCols = tableData.rows[0].length;
                for (let i = 0; i < numCols; i++) {
                    tableData.headers.push(`Column ${i + 1}`);
                }
            }
            
            tablesData.push(tableData);
        }
    });
    
    console.log('Final tables data:', tablesData);
    return tablesData;
}

// Format label for display
function formatLabel(key) {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Show search message
function showSearchMessage(message, type) {
    const searchMessage = document.getElementById('accountSearchMessage');
    const accountInfoDisplay = document.getElementById('accountInfoDisplay');
    
    if (searchMessage) {
        searchMessage.innerHTML = `<p class="${type}">${message}</p>`;
        searchMessage.style.display = 'block';
    }
    
    if (accountInfoDisplay) {
        accountInfoDisplay.style.display = 'none';
    }
}

// Populate account information from stored user data
function populateAccountInfo() {
    const userDataString = localStorage.getItem('userData');
    
    if (!userDataString) return;
    
    try {
        const userData = JSON.parse(userDataString);
        const adminLogin = userData.adminLogin;
        
        // Update account info fields
        const accountName = document.getElementById('accountName');
        const accountId = document.getElementById('accountId');
        const accountRole = document.getElementById('accountRole');
        const accountToken = document.getElementById('accountToken');
        
        if (accountName) accountName.textContent = adminLogin.name || 'N/A';
        if (accountId) accountId.textContent = adminLogin._id || 'N/A';
        if (accountRole && adminLogin.roles && adminLogin.roles.length > 0) {
            accountRole.textContent = adminLogin.roles[0].name;
        }
        if (accountToken) {
            accountToken.textContent = userData.token || 'N/A';
            accountToken.style.cursor = 'pointer';
            accountToken.title = 'Click to copy';
            accountToken.addEventListener('click', () => {
                navigator.clipboard.writeText(userData.token);
                alert('Token copied to clipboard!');
            });
        }
    } catch (error) {
        console.error('Error populating account info:', error);
    }
}

// Setup retailer search functionality
function setupRetailerSearch() {
    const searchBtn = document.getElementById('searchRetailerBtn');
    const retailerInput = document.getElementById('retailerSearchInput');
    
    if (searchBtn && retailerInput) {
        // Search button click
        searchBtn.addEventListener('click', () => {
            const searchQuery = retailerInput.value.trim();
            if (searchQuery) {
                searchRetailer(searchQuery);
            } else {
                showRetailerMessage('Please enter a retailer ID, mobile number, or name', 'error');
            }
        });
        
        // Enter key press
        retailerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchQuery = retailerInput.value.trim();
                if (searchQuery) {
                    searchRetailer(searchQuery);
                } else {
                    showRetailerMessage('Please enter a retailer ID, mobile number, or name', 'error');
                }
            }
        });
    }
}

// Search retailer function
async function searchRetailer(searchQuery) {
    const messageDiv = document.getElementById('retailerSearchMessage');
    const resultDiv = document.getElementById('retailerResultDisplay');
    const detailsContainer = document.getElementById('retailerDetailsContainer');
    
    // Show loading state
    if (messageDiv) {
        messageDiv.innerHTML = '<p class="loading">Searching for retailer...</p>';
        messageDiv.style.display = 'block';
    }
    if (resultDiv) resultDiv.style.display = 'none';
    
    try {
        // Get auth token from localStorage
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
            showRetailerMessage('Authentication error. Please login again.', 'error');
            return;
        }
        
        const userData = JSON.parse(userDataString);
        const token = userData.token;
        
        if (!token) {
            showRetailerMessage('No authentication token found. Please login again.', 'error');
            return;
        }
        
        // Make API request
        const url = `https://csp.s2s.ph/api/retailers?searchVal=${encodeURIComponent(searchQuery)}&isFiber=true`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'wsc-token': token,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display results
        if (data && data.status && data.data && data.data.retailers && data.data.retailers.length > 0) {
            displayRetailerResults(data.data.retailers);
        } else {
            showRetailerMessage('No retailers found matching your search.', 'info');
        }
        
    } catch (error) {
        console.error('Error searching retailer:', error);
        showRetailerMessage('An error occurred while searching. Please try again.', 'error');
    }
}

// Display retailer results
function displayRetailerResults(data) {
    const messageDiv = document.getElementById('retailerSearchMessage');
    const resultDiv = document.getElementById('retailerResultDisplay');
    const detailsContainer = document.getElementById('retailerDetailsContainer');
    const retailerCount = document.getElementById('retailerCount');
    
    if (messageDiv) messageDiv.style.display = 'none';
    if (resultDiv) resultDiv.style.display = 'block';
    
    if (detailsContainer) {
        // Check if data is an array or single object
        const retailers = Array.isArray(data) ? data : [data];
        
        if (retailers.length === 0) {
            detailsContainer.innerHTML = '<p class="info">No retailers found.</p>';
            return;
        }
        
        // Update count
        if (retailerCount) {
            retailerCount.textContent = retailers.length;
        }
        
        // Define field order and labels
        const fieldOrder = [
            { key: 'retailerId', label: 'Retailer ID' },
            { key: 'retailerfullname', label: 'Full Name' },
            { key: 'retailerMobileNumber', label: 'Mobile Number' },
            { key: 'Email', label: 'Email' },
            { key: 'Sex', label: 'Gender' },
            { key: 'dealerID', label: 'Dealer ID' }
        ];
        
        // Create cards
        let html = '<div class="retailer-cards-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr)); gap: 20px;">';
        
        retailers.forEach((retailer, index) => {
            html += `
                <div class="retailer-card" style="
                    background: linear-gradient(135deg, rgba(0, 255, 65, 0.05) 0%, rgba(0, 217, 255, 0.05) 100%);
                    border: 1px solid rgba(0, 255, 65, 0.3);
                    border-radius: 12px;
                    padding: 20px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
                    cursor: pointer;
                " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 12px rgba(0, 255, 65, 0.4)'; this.style.borderColor='#00ff41';" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 6px rgba(0, 0, 0, 0.3)'; this.style.borderColor='rgba(0, 255, 65, 0.3)';"
                   onclick="selectRetailer('${retailer.retailerId}', '${retailer.retailerfullname}', '${retailer.retailerMobileNumber}')">
                    <div style="
                        background: linear-gradient(135deg, #00ff41 0%, #00d9ff 100%);
                        color: #0a0e27;
                        padding: 12px 16px;
                        border-radius: 8px;
                        margin-bottom: 16px;
                        font-weight: 800;
                        text-align: center;
                        box-shadow: 0 2px 8px rgba(0, 255, 65, 0.4);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    ">
                        ${retailer.retailerfullname || 'Unknown Retailer'}
                    </div>
            `;
            
            fieldOrder.forEach(field => {
                // Skip full name since it's in the header
                if (field.key === 'retailerfullname') return;
                
                const value = retailer[field.key];
                let displayValue = value !== null && value !== undefined && value !== '' ? value : 'N/A';
                
                // Format specific fields
                let valueStyle = 'color: #ffffff;';
                if (field.key === 'retailerMobileNumber' && displayValue !== 'N/A') {
                    valueStyle = 'color: #00d9ff; font-family: monospace; font-weight: 600;';
                } else if (field.key === 'Email' && displayValue !== 'N/A') {
                    valueStyle = 'color: #a855f7; font-size: 13px;';
                } else if (field.key === 'retailerId' || field.key === 'dealerID') {
                    valueStyle = 'color: #00ff41; font-weight: 700; font-family: monospace;';
                } else if (field.key === 'Sex') {
                    valueStyle = `color: ${displayValue === 'MALE' ? '#00d9ff' : '#ff69b4'}; font-weight: 600;`;
                }
                
                html += `
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px 0;
                        border-bottom: 1px solid rgba(0, 255, 65, 0.1);
                    ">
                        <span style="
                            color: rgba(0, 255, 65, 0.7);
                            font-size: 12px;
                            text-transform: uppercase;
                            font-weight: 600;
                            letter-spacing: 0.5px;
                        ">${field.label}:</span>
                        <span style="${valueStyle} font-size: 13px; text-align: right; max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${displayValue}</span>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        
        detailsContainer.innerHTML = html;
    }
}

// Show retailer search message
function showRetailerMessage(message, type) {
    const messageDiv = document.getElementById('retailerSearchMessage');
    const resultDiv = document.getElementById('retailerResultDisplay');
    
    if (messageDiv) {
        messageDiv.innerHTML = `<p class="${type}">${message}</p>`;
        messageDiv.style.display = 'block';
    }
    
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
}

// Handle retailer card selection
async function selectRetailer(retailerId, fullName, mobileNumber) {
    // Create and show modal
    const modal = document.createElement('div');
    modal.id = 'retailerDetailsModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #0a0e27 0%, #1a1e37 100%);
        border: 2px solid #00ff41;
        border-radius: 12px;
        padding: 30px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 255, 65, 0.5);
        position: relative;
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #00ff41; margin: 0; font-size: 24px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; padding-right: 10px;">Retailer Account Details</h2>
            <button onclick="closeRetailerModal()" style="
                background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                flex-shrink: 0;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">Close</button>
        </div>
        <div style="
            background: rgba(0, 255, 65, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #00ff41;
            overflow: hidden;
        ">
            <p style="margin: 5px 0; color: #00d9ff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><strong>Name:</strong> ${fullName}</p>
            <p style="margin: 5px 0; color: #00d9ff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><strong>Mobile:</strong> ${mobileNumber}</p>
            <p style="margin: 5px 0; color: #00d9ff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><strong>Retailer ID:</strong> ${retailerId}</p>
        </div>
        <div id="retailerAccountData" style="color: #fff;">
            <p style="text-align: center; color: #00ff41;">Loading account details...</p>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Fetch retailer account details
    try {
        const response = await fetch('http://localhost:3000/api/retailer-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            body: JSON.stringify({
                trans: 'viewdetails',
                user: retailerId
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const htmlText = await response.text();
        
        // Parse HTML to extract data
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const table = doc.querySelector('table');
        
        if (!table) {
            throw new Error('No data found in response');
        }
        
        // Extract data from table rows
        const rows = table.querySelectorAll('tbody tr');
        const accountData = {};
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 2) {
                const key = cells[0].textContent.trim().replace(' :', '').trim();
                const value = cells[1].textContent.trim();
                accountData[key] = value;
            }
        });
        
        displayRetailerAccountData(accountData);
        
    } catch (error) {
        console.error('Error fetching retailer details:', error);
        document.getElementById('retailerAccountData').innerHTML = `
            <p style="color: #ef4444; text-align: center;">
                Error loading account details: ${error.message}
            </p>
        `;
    }
}

// Close retailer details modal
function closeRetailerModal() {
    const modal = document.getElementById('retailerDetailsModal');
    if (modal) {
        modal.remove();
    }
}

// Display retailer account data in modal
function displayRetailerAccountData(data) {
    const container = document.getElementById('retailerAccountData');
    
    if (!container) return;
    
    if (!data || Object.keys(data).length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #a855f7;">No account details found.</p>';
        return;
    }
    
    // Define display order and formatting
    const fieldGroups = [
        {
            title: 'Retailer Information',
            fields: [
                'Retailer Id',
                'Retailer Name',
                'Birthdate',
                'Retailer Email',
                'Retailer Mobile Number',
                'Retailer Current Balance'
            ]
        },
        {
            title: 'Dealer Information',
            fields: [
                'Dealer ID',
                'Dealer Name'
            ]
        },
        {
            title: 'Distributor Information',
            fields: [
                'Distributor Id',
                'Distributor Company',
                'Distributor loadWallet',
                'Distributor installWallet'
            ]
        }
    ];
    
    let html = '';
    
    fieldGroups.forEach((group, groupIndex) => {
        html += `
            <div style="margin-bottom: 25px;">
                <h3 style="
                    color: #00ff41;
                    font-size: 16px;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 2px solid rgba(0, 255, 65, 0.3);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                ">${group.title}</h3>
                <div style="
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(0, 255, 65, 0.2);
                    border-radius: 8px;
                    padding: 15px;
                ">
        `;
        
        group.fields.forEach((fieldName, index) => {
            const value = data[fieldName] || 'N/A';
            let valueStyle = 'color: #ffffff;';
            
            // Special formatting for specific fields
            if (fieldName.includes('Balance') || fieldName.includes('Wallet')) {
                valueStyle = 'color: #00d9ff; font-weight: 700; font-size: 15px;';
            } else if (fieldName.includes('Id') || fieldName === 'Dealer ID') {
                valueStyle = 'color: #00ff41; font-family: monospace; font-weight: 600;';
            } else if (fieldName.includes('Email')) {
                valueStyle = 'color: #a855f7; font-size: 13px;';
            } else if (fieldName.includes('Mobile')) {
                valueStyle = 'color: #00d9ff; font-family: monospace;';
            }
            
            const borderStyle = index < group.fields.length - 1 ? 'border-bottom: 1px solid rgba(0, 255, 65, 0.1);' : '';
            
            html += `
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    ${borderStyle}
                ">
                    <span style="
                        color: rgba(0, 255, 65, 0.7);
                        font-size: 13px;
                        font-weight: 600;
                        min-width: 200px;
                        flex-shrink: 0;
                    ">${fieldName}:</span>
                    <span style="${valueStyle} text-align: right; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-left: 10px;">${value}</span>
                </div>
            `;
        });
        
        html += '</div></div>';
    });
    
    container.innerHTML = html;
}

// Setup RefInstall check functionality
function setupRefInstallCheck() {
    const checkBtn = document.getElementById('checkRefInstallBtn');
    const refInstallInput = document.getElementById('refInstallInput');
    
    if (checkBtn && refInstallInput) {
        // Check button click
        checkBtn.addEventListener('click', () => {
            const searchQuery = refInstallInput.value.trim();
            if (searchQuery) {
                checkRefInstall(searchQuery);
            } else {
                showRefInstallMessage('Please enter a reference or installation number', 'error');
            }
        });
        
        // Enter key press
        refInstallInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchQuery = refInstallInput.value.trim();
                if (searchQuery) {
                    checkRefInstall(searchQuery);
                } else {
                    showRefInstallMessage('Please enter a reference or installation number', 'error');
                }
            }
        });
    }
}

// Check RefInstall function
async function checkRefInstall(searchQuery) {
    const messageDiv = document.getElementById('refInstallMessage');
    const resultDiv = document.getElementById('refInstallResultDisplay');
    const detailsContainer = document.getElementById('refInstallDetailsContainer');
    
    // Show loading state
    if (messageDiv) {
        messageDiv.innerHTML = '<p class="loading">Checking RefInstall...</p>';
        messageDiv.style.display = 'block';
    }
    if (resultDiv) resultDiv.style.display = 'none';
    
    try {
        const response = await fetch('http://localhost:3000/api/check-refinstall', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                trans: 'viewdetails',
                user: searchQuery
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const htmlData = await response.text();
        console.log('RefInstall check response:', htmlData);
        
        // Parse the HTML response
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlData, 'text/html');
        const table = doc.querySelector('table#service1') || doc.querySelector('table');
        
        if (!table) {
            showRefInstallMessage('No data found for this reference number', 'error');
            return;
        }
        
        // Extract data from table
        const rows = table.querySelectorAll('tbody tr');
        const refData = {};
        
        console.log('Found rows:', rows.length);
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 2) {
                const key = cells[0].textContent.trim().replace(/:\s*$/, '');
                const value = cells[1].textContent.trim();
                console.log('Extracted:', key, '=', value);
                if (key) {
                    refData[key] = value;
                }
            }
        });
        
        console.log('RefData object:', refData);
        
        // Display the data
        displayRefInstallData(refData);
        
        if (messageDiv) messageDiv.style.display = 'none';
        if (resultDiv) resultDiv.style.display = 'block';
        
    } catch (error) {
        console.error('Error checking RefInstall:', error);
        showRefInstallMessage('An error occurred while checking. Please try again.', 'error');
    }
}

// Display RefInstall data
function displayRefInstallData(data) {
    const container = document.getElementById('refInstallDetailsContainer');
    if (!container) return;
    
    // Display all fields from the response
    let html = '';
    
    html += '<div style="margin-bottom: 20px;">';
    html += '<h3 style="color: #00ff41; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #00ff41;">RefInstall Information</h3>';
    html += '<div style="display: grid; gap: 10px;">';
    
    // Display all fields in the order they appear
    Object.entries(data).forEach(([key, value]) => {
        html += `
            <div style="display: flex; padding: 10px; background: rgba(0, 255, 65, 0.05); border-radius: 4px; border-left: 3px solid #00ff41;">
                <span style="flex-shrink: 0; min-width: 250px; color: rgba(0, 255, 65, 0.8); font-weight: 600;">${key}:</span>
                <span style="color: #00ff41; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-left: 10px;">${value || '-'}</span>
            </div>
        `;
    });
    
    html += '</div></div>';
    
    container.innerHTML = html;
}

// Show RefInstall message
function showRefInstallMessage(message, type) {
    const messageDiv = document.getElementById('refInstallMessage');
    const resultDiv = document.getElementById('refInstallResultDisplay');
    
    if (messageDiv) {
        messageDiv.innerHTML = `<p class="${type}">${message}</p>`;
        messageDiv.style.display = 'block';
    }
    
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
}


console.log('%c IDSS PAGE LOADED ', 'background: #00ff41; color: #0a0e27; font-size: 16px; font-weight: bold; padding: 10px;');
