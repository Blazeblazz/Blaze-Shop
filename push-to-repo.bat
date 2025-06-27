@echo off
echo Pushing changes to Blazeblazz/Blaze-Shop.git...

REM Set the remote URL
git remote set-url origin https://github.com/Blazeblazz/Blaze-Shop.git

REM Add key files
git add index-award.html
git add css/mobile-bottom-nav.css
git add css/mobile-product-grid.css
git add css/large-screen-optimization.css
git add js/mobile-bottom-nav.js

REM Commit changes
git commit -m "Add mobile and desktop optimizations"

REM Push to the repository
git push

echo Done!