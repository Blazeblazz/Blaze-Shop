# Order Storage Setup

To view orders submitted by customers, follow these steps:

## 1. Create a Google Form

1. Go to [Google Forms](https://forms.google.com) and create a new form
2. Add these questions (all as "Short answer" type):
   - Customer Name
   - Phone Number
   - City
   - Order Details (make this "Paragraph" type)

## 2. Link to Google Sheets

1. Click on the "Responses" tab in your form
2. Click on the Google Sheets icon (green spreadsheet)
3. Select "Create a new spreadsheet"
4. Click "Create"

## 3. Get Form Field IDs

1. Click "Preview" (eye icon) to view your form
2. Right-click and select "View Page Source"
3. Search for "entry." to find your field IDs
4. Note the IDs for each field:
   - Customer Name: entry.XXXXXXXX
   - Phone Number: entry.XXXXXXXX
   - City: entry.XXXXXXXX
   - Order Details: entry.XXXXXXXX

## 4. Update Your Code

1. Open js/checkout-clean.js
2. Find the submitToGoogleForm function
3. Replace the form action URL with your Google Form URL
4. Replace the entry IDs with your actual field IDs

## 5. View Orders

1. Go to your Google Sheets
2. All orders will appear there automatically
3. Each row represents one order with:
   - Timestamp
   - Customer Name
   - Phone Number
   - City
   - Order Details (products, variants, quantities, prices)