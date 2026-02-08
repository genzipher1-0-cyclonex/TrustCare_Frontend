@echo off
REM ==========================================
REM TrustCare Frontend - Docker Build & Push Script
REM ==========================================

SET DOCKER_USERNAME=pathum2002
SET IMAGE_NAME=trustcare-frontend
SET VERSION=1.0.0

echo.
echo ==========================================
echo TrustCare Frontend - Docker Build Script
echo ==========================================
echo.
echo Docker Hub Username: %DOCKER_USERNAME%
echo Image Name: %IMAGE_NAME%
echo Version: %VERSION%
echo.

REM Check if Docker is running
docker info > nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo [1/4] Logging into Docker Hub...
docker login
if errorlevel 1 (
    echo ERROR: Docker login failed
    pause
    exit /b 1
)

echo.
echo [2/4] Building Docker image...
docker build -t %DOCKER_USERNAME%/%IMAGE_NAME%:%VERSION% -t %DOCKER_USERNAME%/%IMAGE_NAME%:latest --build-arg VITE_API_BASE_URL=http://localhost:8080 .
if errorlevel 1 (
    echo ERROR: Docker build failed
    pause
    exit /b 1
)

echo.
echo [3/4] Pushing image to Docker Hub (version tag)...
docker push %DOCKER_USERNAME%/%IMAGE_NAME%:%VERSION%
if errorlevel 1 (
    echo ERROR: Docker push failed for version tag
    pause
    exit /b 1
)

echo.
echo [4/4] Pushing image to Docker Hub (latest tag)...
docker push %DOCKER_USERNAME%/%IMAGE_NAME%:latest
if errorlevel 1 (
    echo ERROR: Docker push failed for latest tag
    pause
    exit /b 1
)

echo.
echo ==========================================
echo SUCCESS! Image pushed to Docker Hub
echo ==========================================
echo.
echo Image URLs:
echo   - docker.io/%DOCKER_USERNAME%/%IMAGE_NAME%:%VERSION%
echo   - docker.io/%DOCKER_USERNAME%/%IMAGE_NAME%:latest
echo.
echo To pull and run:
echo   docker pull %DOCKER_USERNAME%/%IMAGE_NAME%:latest
echo   docker run -d -p 3000:80 %DOCKER_USERNAME%/%IMAGE_NAME%:latest
echo.

pause
