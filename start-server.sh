#!/bin/bash

# Activation Proxy Server Startup Script
# This script ensures the server starts cleanly and stays running

echo "🚀 Starting Activation Proxy Server..."

# Kill any existing node processes on port 3000
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
pkill -9 -f "proxy-server.js" 2>/dev/null || true

# Wait a moment for cleanup
sleep 1

# Start the server
echo "▶️  Launching proxy server..."
npm start

# If server exits, show helpful message
echo ""
echo "❌ Server stopped unexpectedly"
echo "💡 To restart: npm start"
echo "💡 Or run: ./start-server.sh"
