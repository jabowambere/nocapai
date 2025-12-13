#!/bin/bash

echo "Installing NoCap Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Backend installation failed!"
    exit 1
fi
cd ..

echo ""
echo "Installing NoCap Frontend Dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Frontend installation failed!"
    exit 1
fi

echo "Installing Tailwind CSS and PostCSS..."
npm install -D tailwindcss postcss autoprefixer
if [ $? -ne 0 ]; then
    echo "Tailwind installation failed!"
    exit 1
fi

cd ..
echo ""
echo "Installation complete!"
echo ""
echo "To start the project:"
echo "1. Open a terminal and run: cd backend && npm run dev"
echo "2. Open another terminal and run: cd frontend && npm start"
