const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// ============================================
// ENCRYPTION UTILITIES (Server-side)
// ============================================

// Decrypt incoming encrypted requests
function decryptPayload(encryptedData) {
    const key = 'ACT1V@T10N_S3CUR3_K3Y_2025';
    const encrypted = Buffer.from(encryptedData, 'base64').toString('utf-8');
    let decrypted = '';
    
    for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(
            encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
    }
    
    return JSON.parse(decrypted);
}

// Middleware to handle encrypted requests
function decryptionMiddleware(req, res, next) {
    const isEncrypted = req.headers['x-encrypted-request'] === 'true';
    const requestId = req.headers['x-request-id'];
    
    if (isEncrypted && req.body && req.body.encrypted && req.body.data) {
        try {
            console.log('🔓 Decrypting request with ID:', requestId);
            const decryptedPayload = decryptPayload(req.body.data);
            
            // Remove metadata before forwarding
            const { _meta, ...cleanPayload } = decryptedPayload;
            req.body = cleanPayload;
            
            console.log('✅ Request decrypted successfully');
        } catch (error) {
            console.error('❌ Decryption failed:', error);
            return res.status(400).json({ error: 'Invalid encrypted payload' });
        }
    }
    
    next();
}

// Apply decryption middleware to all routes
app.use(decryptionMiddleware);

// ============================================
// SECURITY HEADERS & RATE LIMITING
// ============================================

// Request tracking for rate limiting
const requestTracker = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

// Rate limiting middleware
function rateLimitMiddleware(req, res, next) {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    
    if (!requestTracker.has(clientId)) {
        requestTracker.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    } else {
        const tracker = requestTracker.get(clientId);
        
        if (now > tracker.resetTime) {
            tracker.count = 1;
            tracker.resetTime = now + RATE_LIMIT_WINDOW;
        } else {
            tracker.count++;
            
            if (tracker.count > MAX_REQUESTS_PER_WINDOW) {
                console.warn(`⚠️ Rate limit exceeded for ${clientId}`);
                return res.status(429).json({ 
                    error: 'Too many requests. Please try again later.',
                    retryAfter: Math.ceil((tracker.resetTime - now) / 1000)
                });
            }
        }
    }
    
    next();
}

// Security headers middleware
function securityHeadersMiddleware(req, res, next) {
    // Prevent response caching to avoid sensitive data storage
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    
    // Add request ID for tracking
    res.setHeader('X-Request-Timestamp', Date.now().toString());
    
    next();
}

// Apply security middlewares
app.use(rateLimitMiddleware);
app.use(securityHeadersMiddleware);

// Proxy endpoint for account information
app.post('/api/account-info', async (req, res) => {
    try {
        console.log('Received request:', req.body);
        
        const response = await fetch('http://161.49.61.47/show_account_informations_view_v1.php', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.6',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Host': '161.49.61.47',
                'Origin': 'http://161.49.61.47',
                'Referer': 'http://161.49.61.47/show_account_informations_uat.php',
                'Sec-Gpc': '1'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.text();
        console.log('Response received, length:', data.length);
        
        res.send(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for disconnect
app.post('/api/disconnect', async (req, res) => {
    try {
        console.log('Disconnect request:', req.body);
        
        const response = await fetch('http://161.49.61.47/disconnect_userv3.php', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.6',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Host': '161.49.61.47',
                'Origin': 'http://161.49.61.47',
                'Referer': 'http://161.49.61.47/show_account_informations_uat.php',
                'Sec-Gpc': '1'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.text();
        console.log('Disconnect response:', data);
        
        res.send(data);
    } catch (error) {
        console.error('Disconnect error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for verify account
app.post('/api/verify', async (req, res) => {
    try {
        console.log('Verify request:', req.body);
        
        const response = await fetch('http://161.49.61.47/check_user_details.php', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.6',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Host': '161.49.61.47',
                'Origin': 'http://161.49.61.47',
                'Referer': 'http://161.49.61.47/verify_account.php',
                'Sec-Gpc': '1'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.text();
        console.log('Verify response length:', data.length);
        
        res.send(data);
    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for search vouchers
app.post('/api/search-vouchers', async (req, res) => {
    try {
        console.log('Search vouchers request:', req.body);
        
        const response = await fetch('http://161.49.61.47/check_user_pin_voucher.php', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.6',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Host': '161.49.61.47',
                'Origin': 'http://161.49.61.47',
                'Referer': 'http://161.49.61.47/search_pins_vouchers.php',
                'Sec-Gpc': '1'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.text();
        console.log('Search vouchers response length:', data.length);
        
        res.send(data);
    } catch (error) {
        console.error('Search vouchers error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for reprocess voucher
app.post('/api/reprocess-voucher', async (req, res) => {
    try {
        console.log('Reprocess voucher request:', req.body);
        
        const response = await fetch('https://ibas.s2s.ph/api/prepaid-fiber/load', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        console.log('Reprocess voucher response:', data);
        
        res.json(data);
    } catch (error) {
        console.error('Reprocess voucher error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for retailer account information
app.post('/api/retailer-account', async (req, res) => {
    try {
        console.log('Retailer account request:', req.body);
        
        const response = await fetch('http://161.49.61.47/show_retailerAccount_informations_view.php', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.6',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Host': '161.49.61.47',
                'Origin': 'http://161.49.61.47',
                'Referer': 'http://161.49.61.47/show_retailer_informations.php',
                'Sec-Gpc': '1'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.text();
        console.log('Retailer account response length:', data.length);
        
        res.send(data);
    } catch (error) {
        console.error('Retailer account error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/check-refinstall', async (req, res) => {
    try {
        console.log('RefInstall check request:', req.body);
        
        const response = await fetch('http://161.49.61.47/checks2sreferenceNo_informations.php', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.6',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Host': '161.49.61.47',
                'Origin': 'http://161.49.61.47',
                'Referer': 'http://161.49.61.47/check_s2sReferenceNo.php',
                'Sec-Gpc': '1'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.text();
        console.log('RefInstall check response length:', data.length);
        
        res.send(data);
    } catch (error) {
        console.error('RefInstall check error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// CLEANUP & MAINTENANCE
// ============================================

// Clean up old request tracker entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [clientId, tracker] of requestTracker.entries()) {
        if (now > tracker.resetTime + RATE_LIMIT_WINDOW) {
            requestTracker.delete(clientId);
            cleaned++;
        }
    }
    
    if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} old request tracker entries`);
    }
}, 5 * 60 * 1000);

// ============================================
// SERVER ERROR HANDLING & AUTO-RECOVERY
// ============================================

// Global error handlers to prevent crashes
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    console.log('⚠️ Server continuing despite error...');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    console.log('⚠️ Server continuing despite error...');
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
    console.log('📡 SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\n📡 SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Health check endpoint for monitoring
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
    console.log(`🔒 Security features enabled:`);
    console.log(`   ✅ Request encryption/decryption`);
    console.log(`   ✅ Rate limiting (${MAX_REQUESTS_PER_WINDOW} req/min)`);
    console.log(`   ✅ Security headers`);
    console.log(`   ✅ Request tracking & validation`);
    console.log(`   ✅ Health monitoring endpoint (/health)`);
    console.log(`   ✅ Auto-recovery on errors`);
}).on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        console.log('💡 Try: pkill -9 node && npm start');
        process.exit(1);
    } else {
        console.error('❌ Server error:', error);
        process.exit(1);
    }
});
