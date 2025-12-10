# Proxy Server Management Guide

## 🚀 Quick Start

### Start Server (Normal)
```bash
npm start
```

### Start Server (Auto-Restart on Crash)
```bash
npm run auto
# or
./start-server-auto.sh
```

### Stop Server
```bash
npm run stop
```

### Restart Server
```bash
npm run restart
```

### Check Server Status
```bash
npm run status
```

## 🛡️ Auto-Recovery Features

### Client-Side Protection
✅ **Health Monitoring** - Checks server every 10 seconds
✅ **Visual Warning** - Red banner appears when server is down
✅ **Auto-Reconnect** - Button to reload and reconnect
✅ **Smart Error Messages** - Tells users exactly what to do

### Server-Side Protection
✅ **Error Recovery** - Continues running despite uncaught errors
✅ **Graceful Shutdown** - Handles SIGTERM/SIGINT properly
✅ **Health Endpoint** - `/health` for monitoring tools
✅ **Port Conflict Detection** - Clear message if port is in use
✅ **Memory Monitoring** - Tracks memory usage

### Auto-Restart Script
✅ **Crash Recovery** - Automatically restarts on unexpected exits
✅ **Restart Limiting** - Max 10 restarts within 60 seconds
✅ **Stable Runtime Detection** - Resets counter after 60s uptime
✅ **Clean Exit Handling** - Doesn't restart on Ctrl+C

## 📊 Server Status Indicators

### When Server is Running
```
🚀 Proxy server running on http://localhost:3000
🔒 Security features enabled:
   ✅ Request encryption/decryption
   ✅ Rate limiting (100 req/min)
   ✅ Security headers
   ✅ Request tracking & validation
   ✅ Health monitoring endpoint (/health)
   ✅ Auto-recovery on errors
```

### When Server is Down (Client-Side)
```
⚠️ Proxy Server Disconnected - API calls will fail.
[Reconnect Button]  Run: npm start
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill all node processes and restart
npm run restart

# Or manually
pkill -9 node
npm start
```

### Server Keeps Crashing
```bash
# Check logs for errors
# If too many crashes, auto-restart will stop after 10 attempts
# Fix the underlying issue before restarting
```

### Health Check Failing
```bash
# Check if server is running
npm run status

# Check health endpoint manually
curl http://localhost:3000/health
```

## 🏥 Health Monitoring

### Client-Side Health Check
- Runs every 10 seconds automatically
- Shows red warning banner if server is down
- Provides reconnect button and instructions

### Server Health Endpoint
```bash
# Check server health
curl http://localhost:3000/health

# Response:
{
  "status": "healthy",
  "timestamp": "2025-12-11T...",
  "uptime": 123.45,
  "memory": {
    "rss": 12345678,
    "heapTotal": 1234567,
    "heapUsed": 123456,
    "external": 12345
  }
}
```

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm start` | Start server normally |
| `npm run auto` | Start with auto-restart on crash |
| `npm run stop` | Stop all node processes |
| `npm run restart` | Force stop and restart |
| `npm run status` | Check if server is running |
| `./start-server.sh` | Clean start with process cleanup |
| `./start-server-auto.sh` | Start with crash recovery |

## ⚠️ Common Issues & Solutions

### Issue: "Proxy server is not running"
**Solution:**
```bash
npm start
# or
npm run restart
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
npm run restart
```

### Issue: Server crashes repeatedly
**Solution:**
1. Check console for error messages
2. Fix the underlying issue
3. Use `npm run auto` for automatic recovery during development

### Issue: Can't kill server
**Solution:**
```bash
# Force kill all node processes
pkill -9 node

# Or find and kill specific process
lsof -ti:3000 | xargs kill -9
```

## 🔄 Best Practices

### Development
- Use `npm run auto` to avoid manual restarts during development
- Monitor console for error messages
- Check client-side health warnings

### Production
- Use process manager (PM2 or systemd)
- Enable logging to file
- Set up external health monitoring
- Use HTTPS instead of HTTP

### Daily Use
1. Start server before opening the app: `npm start`
2. Leave server running while using the application
3. Stop server when done: `Ctrl+C` or `npm run stop`

## 🚨 Emergency Commands

```bash
# Nuclear option - kill everything and restart
pkill -9 node && sleep 2 && npm start

# Check what's using port 3000
lsof -i:3000

# Monitor server logs
npm start | tee server.log
```

## 📈 Monitoring Tips

1. **Watch for warnings** - Look for ⚠️ emoji in logs
2. **Check health regularly** - `curl localhost:3000/health`
3. **Monitor memory** - Health endpoint shows memory usage
4. **Track restarts** - Auto-restart script counts attempts
5. **Review client warnings** - Red banner indicates issues
