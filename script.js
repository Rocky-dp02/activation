// API Configuration
const API_URL = "https://ibas-prod-api.s2s.ph/api/admin-login";
const WSC_TOKEN = "1e3dc807-8dd5-49e1-9aa1-630b2135f196";

// Test credentials
const TEST_EMAIL = "test@1.com";
const TEST_PASSWORD = "Ragnarok123123!";

// Store token globally
let authToken = null;

// DOM Elements - will be initialized on load
let emailInput, passwordInput, loginBtn, messageDiv, terminalWindow, rememberMeCheckbox;

// Load saved credentials on page load
window.addEventListener('load', () => {
    console.log('Page loaded, initializing...');
    
    // Initialize DOM elements
    emailInput = document.getElementById('email');
    passwordInput = document.getElementById('password');
    loginBtn = document.getElementById('loginBtn');
    messageDiv = document.getElementById('message');
    terminalWindow = document.querySelector('.terminal-window');
    rememberMeCheckbox = document.getElementById('rememberMe');
    
    console.log('DOM elements:', {
        emailInput: !!emailInput,
        passwordInput: !!passwordInput,
        loginBtn: !!loginBtn,
        messageDiv: !!messageDiv,
        terminalWindow: !!terminalWindow,
        rememberMeCheckbox: !!rememberMeCheckbox
    });
    
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberMe && savedEmail && savedPassword) {
        emailInput.value = savedEmail;
        passwordInput.value = savedPassword;
        rememberMeCheckbox.checked = true;
    }
    
    // Setup event listeners
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form event listener attached');
    } else {
        console.error('Login form not found!');
    }
    
    // Handle Enter key press
    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                passwordInput.focus();
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                loginForm.dispatchEvent(new Event('submit'));
            }
        });
    }
    
    // Input focus effects
    [emailInput, passwordInput].forEach(input => {
        if (input) {
            input.addEventListener('focus', () => {
                hideMessage();
            });
        }
    });
});

// Typing effect disabled to show test credentials in placeholders

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

createMatrixRain();

// Show message function
function showMessage(message, type) {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    
    if (type === 'error') {
        terminalWindow.classList.add('glitch');
        setTimeout(() => {
            terminalWindow.classList.remove('glitch');
        }, 300);
    }
}

// Hide message function
function hideMessage() {
    messageDiv.style.display = 'none';
    messageDiv.className = 'message';
}

// API Login function
async function performApiLogin(username, password) {
    console.log('Attempting login with:', username);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Wsc-Token': WSC_TOKEN,
                'Origin': 'https://login.s2s.ph',
                'Referer': 'https://login.s2s.ph/',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('API Login Error:', error);
        return {
            status: false,
            message: 'Network error occurred'
        };
    }
}

// Login function
async function handleLogin(e) {
    console.log('handleLogin called');
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Clear previous messages
    hideMessage();
    
    // Validation
    if (!email || !password) {
        showMessage('⚠ ERROR: All fields are required', 'error');
        return;
    }
    
    // Loading state
    loginBtn.classList.add('loading');
    
    // Perform API login
    const loginResponse = await performApiLogin(email, password);
    
    if (loginResponse.status === true && loginResponse.data && loginResponse.data.token) {
        // Store the token
        authToken = loginResponse.data.token;
        localStorage.setItem('authToken', authToken);
        
        // Store user data
        localStorage.setItem('userData', JSON.stringify(loginResponse.data));
        
        // Save credentials if remember me is checked
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('savedPassword', password);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
            localStorage.removeItem('rememberMe');
        }
        
        showMessage(`✓ ${loginResponse.message.toUpperCase()} - Redirecting...`, 'success');
        
        console.log('Authentication Token:', authToken);
        console.log('User Data:', loginResponse.data);
        
        // Redirect to landing page after successful login
        setTimeout(() => {
            console.log('Login successful! Redirecting to dashboard...');
            window.location.href = 'landing.html';
        }, 1500);
    } else {
        showMessage(`✗ ACCESS DENIED - ${loginResponse.message || 'Invalid credentials'}`, 'error');
        loginBtn.classList.remove('loading');
        
        // Clear password field on error
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Helper function to get stored token
function getAuthToken() {
    return authToken || localStorage.getItem('authToken');
}

// Console easter egg
console.log('%c SECURE ACCESS TERMINAL ', 'background: #00ff41; color: #0a0e27; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Unauthorized access is prohibited! ', 'background: #ff3b30; color: #fff; font-size: 14px; padding: 5px;');
console.log('%c Test Credentials:', 'color: #00ff41; font-size: 12px; font-weight: bold;');
console.log('%c Email: test@1.com', 'color: #00d9ff; font-size: 11px;');
console.log('%c Password: Ragnarok123123!', 'color: #00d9ff; font-size: 11px;');
console.log('%c API Endpoint:', 'color: #00ff41; font-size: 12px; font-weight: bold;');
console.log('%c ' + API_URL, 'color: #a855f7; font-size: 11px;');
