@echo off
echo Uploading BLAZE website to GitHub...

REM Check if Git is already initialized
if exist .git (
  echo Git repository already initialized
) else (
  echo Initializing Git repository
  git init
)

REM Add all files to Git
git add .

REM Commit changes
git commit -m "Update website with mobile and desktop optimizations"

REM Check if main branch exists
git branch | findstr /C:"main" > nul
if errorlevel 1 (
  echo Creating main branch
  git branch -M main
)

REM Check if remote already exists
git remote -v | findstr /C:"origin" > nul
if errorlevel 1 (
  echo Adding GitHub remote
  echo Enter your GitHub username:
  set /p username=
  git remote add origin https://github.com/%username%/blaze-shop.git
)

REM Push to GitHub
git push -u origin main

echo.
echo Project updated successfully!
echo.
echo If this is your first time:
echo 1. Go to https://github.com/YOUR_USERNAME/blaze-shop/settings/pages
echo 2. Under "Source", select "Deploy from a branch"
echo 3. Select "main" branch and "/" (root) folder
echo 4. Click "Save"
echo 5. Under "Custom domain", enter: blazeblazz.store
echo 6. Click "Save"
echo.
echo Press any key to exit...
pause > nul