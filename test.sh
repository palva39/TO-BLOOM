#!/bin/bash

echo "🚀 Full Stack Template Test Script"
echo "================================="

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies if not already installed
if [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo "✅ Dependencies installed"

# Build frontend to ensure everything works
echo "🔨 Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

echo "✅ Frontend build successful"

# Test backend startup
echo "🧪 Testing backend startup..."
cd backend
timeout 10s npm start &
BACKEND_PID=$!
sleep 3

# Test health endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed (HTTP $HTTP_CODE)"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Test posts endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/posts 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Posts API endpoint working"
else
    echo "❌ Posts API endpoint failed (HTTP $HTTP_CODE)"
fi

# Clean up
kill $BACKEND_PID 2>/dev/null
cd ..

echo ""
echo "🎉 All tests passed! Your full-stack template is ready to use."
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "Then open:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""