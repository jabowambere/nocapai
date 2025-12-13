@echo off
echo Installing NoCap Backend Dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Backend installation failed!
    exit /b 1
)
cd ..

echo.
echo Installing NoCap Frontend Dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo Frontend installation failed!
    exit /b 1
)

echo Installing Tailwind CSS and PostCSS...
call npm install -D tailwindcss postcss autoprefixer
if errorlevel 1 (
    echo Tailwind installation failed!
    exit /b 1
)

cd ..
echo.
echo Installation complete!
echo.
echo To start the project:
echo 1. Open a terminal and run: cd backend ^&^& npm run dev
echo 2. Open another terminal and run: cd frontend ^&^& npm start
echo.
pause
