// Check authentication on load
window.addEventListener('load', () => {
    checkAuth();
    loadUserData();
    updateTimestamp();
    createMatrixRain();
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
        document.getElementById('userName').textContent = userName;
        document.getElementById('userNameDisplay').textContent = userName;
        
        // Display primary role
        if (adminLogin.roles && adminLogin.roles.length > 0) {
            const primaryRole = adminLogin.roles[0];
            document.getElementById('userRole').textContent = primaryRole.name;
        }
        
        // Display token (masked)
        const token = userData.token;
        if (token) {
            const tokenDisplay = document.getElementById('tokenDisplay');
            tokenDisplay.textContent = token;
            tokenDisplay.title = 'Click to copy';
            tokenDisplay.addEventListener('click', () => {
                navigator.clipboard.writeText(token);
                showNotification('Token copied to clipboard!');
            });
        }
        
        // Load roles
        loadRoles(adminLogin.roles);
        
        // Load permissions from all roles
        loadPermissions(adminLogin.roles);
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load and display roles
function loadRoles(roles) {
    const rolesGrid = document.getElementById('rolesGrid');
    rolesGrid.innerHTML = '';
    
    if (!roles || roles.length === 0) {
        rolesGrid.innerHTML = '<p style="color: rgba(0, 255, 65, 0.7);">No roles assigned</p>';
        return;
    }
    
    roles.forEach(role => {
        const roleCard = document.createElement('div');
        roleCard.className = 'role-card';
        roleCard.innerHTML = `
            <h4>${role.name}</h4>
            <p>Code: ${role.code}</p>
            ${role.dashboardName ? `<p>Dashboard: ${role.dashboardName}</p>` : ''}
            ${role.domain ? `<p>Domain: ${role.domain}</p>` : ''}
            ${role.link ? `<p>Link: ${role.link}</p>` : ''}
            <span class="role-code">${role.permissions ? role.permissions.length : 0} Permissions</span>
        `;
        rolesGrid.appendChild(roleCard);
    });
}

// Load and display permissions
function loadPermissions(roles) {
    const permissionsGrid = document.getElementById('permissionsGrid');
    permissionsGrid.innerHTML = '';
    
    if (!roles || roles.length === 0) {
        permissionsGrid.innerHTML = '<p style="color: rgba(0, 255, 65, 0.7);">No permissions found</p>';
        return;
    }
    
    // Collect all unique permissions from all roles
    const allPermissions = [];
    const permissionCodes = new Set();
    
    roles.forEach(role => {
        if (role.permissions) {
            role.permissions.forEach(permission => {
                if (!permissionCodes.has(permission.code)) {
                    permissionCodes.add(permission.code);
                    allPermissions.push(permission);
                }
            });
        }
    });
    
    // Sort by ordering or name
    allPermissions.sort((a, b) => {
        if (a.ordering && b.ordering) {
            return a.ordering - b.ordering;
        }
        return (a.name || '').localeCompare(b.name || '');
    });
    
    // Display only first 20 permissions for better UX
    const displayPermissions = allPermissions.slice(0, 20);
    
    displayPermissions.forEach(permission => {
        const permissionCard = document.createElement('div');
        permissionCard.className = 'permission-card';
        permissionCard.innerHTML = `
            <h4>${permission.name}</h4>
            <p>Code: ${permission.code}</p>
            ${permission.link ? `<p>Link: ${permission.link}</p>` : ''}
            <span class="permission-level">${permission.level || 'N/A'}</span>
        `;
        permissionsGrid.appendChild(permissionCard);
    });
    
    // Show count if there are more
    if (allPermissions.length > 20) {
        const moreCard = document.createElement('div');
        moreCard.className = 'permission-card';
        moreCard.style.border = '1px dashed rgba(0, 255, 65, 0.5)';
        moreCard.innerHTML = `
            <h4>+ ${allPermissions.length - 20} More</h4>
            <p>Total permissions: ${allPermissions.length}</p>
        `;
        permissionsGrid.appendChild(moreCard);
    }
}

// Update timestamp
function updateTimestamp() {
    const timestampElement = document.getElementById('timestamp');
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    timestampElement.textContent = formatted;
    
    // Update every second
    setInterval(() => {
        const now = new Date();
        const formatted = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        timestampElement.textContent = formatted;
    }, 1000);
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        // Clear all session data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Redirect to login
        window.location.href = 'index.html';
    }
});

// IDSS option click handler
const idssOption = document.getElementById('idssOption');
if (idssOption) {
    idssOption.addEventListener('click', () => {
        window.location.href = 'idss.html';
    });
}

// DB2 option click handler
const db2Option = document.getElementById('db2Option');
if (db2Option) {
    db2Option.addEventListener('click', () => {
        window.location.href = 'db2.html';
    });
}

// Admin option click handler
const adminOption = document.getElementById('adminOption');
if (adminOption) {
    adminOption.addEventListener('click', () => {
        window.location.href = 'admin.html';
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 255, 65, 0.9);
        color: #0a0e27;
        padding: 15px 25px;
        border-radius: 4px;
        font-family: 'Fira Code', monospace;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Matrix rain effect
function createMatrixRain() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const matrixBg = document.querySelector('.matrix-bg');
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    
    matrixBg.appendChild(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const letters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console info
console.log('%c IBAS DASHBOARD LOADED ', 'background: #00ff41; color: #0a0e27; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('%c User authenticated successfully ', 'background: #00d9ff; color: #0a0e27; font-size: 12px; padding: 5px;');
