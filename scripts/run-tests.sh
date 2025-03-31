#!/bin/bash

# Run this script to execute all frontend and backend tests

echo "🧪 Starting backend tests..."
cd server
npm run test

echo "📊 Generating backend test coverage..."
npm run test:cov

echo "🧪 Starting frontend tests..."
cd ..
npm run test

echo "📊 Generating frontend test coverage..."
npm run test:coverage

echo "✅ All tests completed!" 