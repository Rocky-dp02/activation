const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
