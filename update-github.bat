@echo off
echo Updating GitHub repository with order system changes...

REM Set the remote URL
git remote set-url origin https://github.com/Blazeblazz/Blaze-Shop.git

REM Add all changed files
git add api/save-order.php
git add api/get-orders.php
git add js/checkout.js
git add js/orders-api.js
git add admin/js/receive-orders.js
git add admin/js/login-orders.js
git add admin/orders.html

REM Commit changes
git commit -m "Fix order system to receive orders from mobile and desktop"

REM Push to GitHub
git push -u origin main

echo.
echo Changes pushed to GitHub successfully!
echo.
pause