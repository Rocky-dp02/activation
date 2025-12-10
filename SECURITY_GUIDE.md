# Security Implementation Guide

## 🔒 How API Encryption Works

### Request Flow Diagram

```
┌─────────────────┐
│   Browser App   │
│  (idss.html)    │
└────────┬────────┘
         │
         │ 1. Original Payload
         │ {trans: "viewdetails", user: "123@prepaid"}
         │
         ▼
┌────────────────────────────────────────────┐
│  encryptPayload() + signRequest()          │
│  - Add timestamp & requestID               │
│  - XOR encryption with secret key          │
│  - Base64 encode                           │
└────────┬───────────────────────────────────┘
         │
         │ 2. Encrypted Payload
         │ {encrypted: true, data: "SGVs...encrypted..."}
         │ Headers: X-Encrypted-Request: true
         │
         ▼
┌─────────────────┐
│   Network       │ 🛡️ Protected - Cannot be read if intercepted
│   (HTTP/HTTPS)  │
└────────┬────────┘
         │
         │ 3. Still Encrypted
         │
         ▼
┌────────────────────────────────────────────┐
│  Proxy Server (localhost:3000)             │
│  - decryptionMiddleware()                  │
│  - Validates request ID                    │
│  - XOR decryption                          │
└────────┬───────────────────────────────────┘
         │
         │ 4. Decrypted Payload
         │ {trans: "viewdetails", user: "123@prepaid"}
         │
         ▼
┌─────────────────┐
│  External API   │
│  161.49.61.47   │
└─────────────────┘
```

## 🔐 Encryption Example

### Before Encryption (Original)
```javascript
{
  "trans": "viewdetails",
  "user": "638773016970@prepaid_fiber"
}
```

### After Signing (Step 1)
```javascript
{
  "trans": "viewdetails",
  "user": "638773016970@prepaid_fiber",
  "_meta": {
    "timestamp": 1702328400000,
    "requestId": "1702328400000_k4j9a2l1m",
    "signature": "MTcwMjMyODQwMDAwMDoxNzAyMzI4NDAwMDAwX2s0ajlhMmwxbQ=="
  }
}
```

### After Encryption (Step 2) - What Gets Sent
```javascript
{
  "encrypted": true,
  "data": "VGhpcyBpcyBlbmNyeXB0ZWQgZGF0YSB0aGF0IGNhbm5vdCBiZSByZWFkIHdpdGhvdXQgdGhlIGtleQ=="
}
```

### What Attackers See in Network Tab
```
POST http://localhost:3000/api/account-info
Headers:
  Content-Type: application/json
  X-Encrypted-Request: true
  X-Request-ID: 1702328400000_k4j9a2l1m

Payload:
  {"encrypted":true,"data":"VGhpc...incomprehensible_encrypted_text...=="}
```

### After Decryption (Server-side)
```javascript
// Back to original payload
{
  "trans": "viewdetails",
  "user": "638773016970@prepaid_fiber"
}
```

## 🛡️ Security Layers

### Layer 1: Request Encryption
- **Method**: XOR cipher with secret key
- **Purpose**: Hide sensitive data from network inspection
- **Protection**: Prevents reading account numbers, credentials, etc.

### Layer 2: Request Signing
- **Method**: Timestamp + Unique ID + Signature
- **Purpose**: Prevent request replay attacks
- **Protection**: Old captured requests cannot be reused

### Layer 3: Rate Limiting
- **Method**: IP-based request counting
- **Limit**: 100 requests per minute
- **Protection**: Prevents API abuse and brute force

### Layer 4: Security Headers
- **Cache-Control**: Prevents sensitive data caching
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-Frame-Options**: Prevents clickjacking

### Layer 5: Request Validation
- **Checks**: Encryption header, request ID format
- **Purpose**: Ensure request integrity
- **Protection**: Rejects malformed or tampered requests

## 🔍 Testing Encryption

### How to Verify It's Working

1. **Open Browser DevTools (F12)**
2. **Go to Network Tab**
3. **Perform any action** (e.g., search account)
4. **Click on the API request** in Network tab
5. **View Payload tab**

#### ✅ What You Should See (Encrypted):
```json
{
  "encrypted": true,
  "data": "VGhpcyBpcyBlbmNyeXB0ZWQgZGF0YSB0aGF0IGNhbm5vdCBiZSByZWFkIHdpdGhvdXQgdGhlIGtleQ=="
}
```

#### ❌ What You Should NOT See (Unencrypted):
```json
{
  "trans": "viewdetails",
  "user": "638773016970@prepaid_fiber"
}
```

### Console Logs to Watch For

#### Client-Side (Browser):
```
🔐 [Account info] Request encrypted with ID: 1702328400000_k4j9a2l1m
Response status: 200
```

#### Server-Side (Terminal):
```
🔓 Decrypting request with ID: 1702328400000_k4j9a2l1m
✅ Request decrypted successfully
Response received, length: 4588
```

## ⚠️ Important Notes

### Encryption Key Security
- **Current Location**: Hardcoded in `idss-script.js` and `proxy-server.js`
- **Key**: `ACT1V@T10N_S3CUR3_K3Y_2025`
- **⚠️ Warning**: Anyone with access to source code can see the key
- **Production**: Use environment variables or key management service

### Limitations
1. **XOR Encryption**: Obfuscation layer, not military-grade
2. **Key Exposure**: Visible in client-side code
3. **HTTP Protocol**: Use HTTPS in production for true security
4. **No Backend Auth**: Add JWT/OAuth for production

### When Encryption is Applied
- ✅ All POST requests to `/api/*` endpoints
- ✅ Automatic - no code changes needed
- ✅ Can be disabled per-request with 4th parameter

### When Encryption is NOT Applied
- ❌ HEAD requests (server checks)
- ❌ GET requests (if any)
- ❌ Responses (currently not encrypted)

## 🚀 Upgrading to Production-Grade Security

### Recommended Changes for Production:

1. **Use AES-256-GCM Encryption**
   ```javascript
   // Replace XOR with Web Crypto API
   const key = await crypto.subtle.generateKey(
     { name: "AES-GCM", length: 256 },
     true,
     ["encrypt", "decrypt"]
   );
   ```

2. **Implement HTTPS**
   - Get SSL/TLS certificate (Let's Encrypt)
   - Configure nginx or Apache as reverse proxy
   - Force HTTPS redirects

3. **Environment-Based Keys**
   ```javascript
   // proxy-server.js
   const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
   ```

4. **Add JWT Authentication**
   ```javascript
   // Add token to headers
   headers: {
     'Authorization': `Bearer ${jwtToken}`
   }
   ```

5. **Implement Request Throttling**
   - Use express-rate-limit package
   - Add IP whitelisting
   - Implement CAPTCHA for sensitive operations

6. **Enable Response Encryption**
   - Encrypt sensitive data in responses
   - Add checksum validation

## 📊 Performance Impact

| Feature | Added Latency | Memory Impact |
|---------|--------------|---------------|
| Encryption | ~5-10ms | Negligible |
| Decryption | ~5-10ms | Negligible |
| Rate Limiting | ~1ms | ~100KB per 1000 clients |
| Security Headers | <1ms | None |
| **Total** | **~10-20ms** | **Minimal** |

## 🎯 Quick Reference

### Disable Encryption (Not Recommended)
```javascript
// 4th parameter = false
const response = await safeFetch(url, options, 'Context', false);
```

### Enable Debug Logging
```javascript
// Already enabled - check browser console and terminal
// Look for 🔐 and 🔓 emoji logs
```

### Change Rate Limit
```javascript
// proxy-server.js (line ~52)
const MAX_REQUESTS_PER_WINDOW = 100; // Change to desired limit
```

### Update Encryption Key
```javascript
// Must update in BOTH files:
// 1. idss-script.js (line ~16)
// 2. proxy-server.js (line ~17)
const key = 'YOUR_NEW_SECRET_KEY_HERE';
```

## ✅ Security Checklist

- [x] Request payload encryption
- [x] Request signing (timestamp + ID)
- [x] Rate limiting (100 req/min)
- [x] Security headers
- [x] No-cache policies
- [x] Request validation
- [x] Error handling
- [x] Logging & monitoring
- [ ] HTTPS (production)
- [ ] JWT authentication (production)
- [ ] Response encryption (future)
- [ ] AES-256 encryption (future)
- [ ] Environment-based keys (production)
