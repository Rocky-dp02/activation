#!/bin/bash

# Auto-restart wrapper for the proxy server
# Keeps the server running even if it crashes

MAX_RESTARTS=10
RESTART_COUNT=0
RESTART_WINDOW=60  # Reset counter after 60 seconds of stable running

echo "🛡️  Starting proxy server with auto-restart protection..."
echo "📊 Max restarts: $MAX_RESTARTS within $RESTART_WINDOW seconds"
echo ""

while true; do
    START_TIME=$(date +%s)
    
    # Start the server
    npm start
    EXIT_CODE=$?
    
    END_TIME=$(date +%s)
    RUNTIME=$((END_TIME - START_TIME))
    
    # If server ran for more than RESTART_WINDOW, reset counter
    if [ $RUNTIME -gt $RESTART_WINDOW ]; then
        RESTART_COUNT=0
        echo "✅ Server ran stable for ${RUNTIME}s, resetting restart counter"
    fi
    
    # Check if we should restart
    if [ $EXIT_CODE -ne 0 ] && [ $EXIT_CODE -ne 130 ] && [ $EXIT_CODE -ne 143 ]; then
        RESTART_COUNT=$((RESTART_COUNT + 1))
        
        if [ $RESTART_COUNT -ge $MAX_RESTARTS ]; then
            echo "❌ Too many restarts ($RESTART_COUNT). Server may have a critical issue."
            echo "💡 Please check the logs and fix the issue before restarting."
            exit 1
        fi
        
        echo ""
        echo "⚠️  Server crashed (exit code: $EXIT_CODE) after ${RUNTIME}s"
        echo "🔄 Auto-restarting... (attempt $RESTART_COUNT/$MAX_RESTARTS)"
        echo ""
        sleep 2
    else
        # Clean shutdown (Ctrl+C or SIGTERM)
        echo ""
        echo "✅ Server stopped cleanly (exit code: $EXIT_CODE)"
        exit 0
    fi
done
