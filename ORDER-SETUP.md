# Order Storage Setup

## Quick Setup (5 minutes)

1. **Create Google Sheet:**
   - Go to [Google Sheets](https://sheets.google.com)
   - Create new spreadsheet named "BLAZE Orders"

2. **Add Google Apps Script:**
   - In your sheet: Extensions → Apps Script
   - Replace default code with the code from `js/order-storage.js` (GOOGLE_SCRIPT_CODE section)
   - Save project

3. **Deploy Web App:**
   - Click "Deploy" → "New deployment"
   - Type: Web app
   - Execute as: Me
   - Access: Anyone
   - Click "Deploy"
   - Copy the Web App URL

4. **Update JavaScript:**
   - Open `js/order-storage.js`
   - Replace `YOUR_SCRIPT_ID` with your Web App URL
   - Save and push to GitHub

## Features:
- ✅ Orders saved to Google Sheets
- ✅ Works with GitHub Pages
- ✅ Automatic fallback to localStorage
- ✅ All customer info stored (name, city, phone, items)
- ✅ Admin panel shows all orders

## Alternative (No Setup):
Orders will automatically save to browser localStorage and work locally.