@echo off
echo Uploading BLAZE website to GitHub...

REM Initialize Git repository
git init

REM Add all files to Git
git add .

REM Commit changes
git commit -m "Initial commit of BLAZE website"

REM Create main branch
git branch -M main

REM Add GitHub remote (replace YOUR_USERNAME with your actual GitHub username)
echo Enter your GitHub username:
set /p username=
git remote add origin https://github.com/%username%/blaze-shop.git

REM Push to GitHub
git push -u origin main

echo.
echo Project uploaded successfully!
echo.
echo Next steps:
echo 1. Go to https://github.com/%username%/blaze-shop/settings/pages
echo 2. Under "Source", select "Deploy from a branch"
echo 3. Select "main" branch and "/" (root) folder
echo 4. Click "Save"
echo 5. Under "Custom domain", enter: blazeblazz.store
echo 6. Click "Save"
echo.
echo Press any key to exit...
pause > nul