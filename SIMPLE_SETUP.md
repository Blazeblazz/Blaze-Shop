# Simple Order Management Setup

Follow these steps to set up your order management system:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "BLAZE Orders"

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on **Extensions** > **Apps Script**
2. Delete any code in the editor and paste the contents of the `simple-apps-script.js` file
3. Click **Save** and name the project "BLAZE Orders"

## Step 3: Deploy as Web App

1. Click on **Deploy** > **New deployment**
2. Select **Web app** as the deployment type
3. Set the following options:
   - Description: "BLAZE Orders"
   - Execute as: "Me"
   - Who has access: "Anyone" (this allows your website to send data)
4. Click **Deploy**
5. Authorize the app when prompted
6. Copy the Web app URL that appears after deployment

## Step 4: Update Your Website

1. Open the file `js/simple-sheet.js`
2. Replace the URL in the script with your Web app URL
3. Save the file and upload it to your website

## Step 5: Test the Integration

1. Place a test order on your website
2. Check your Google Sheet to see if the order appears

## Troubleshooting

If orders are not appearing in your Google Sheet:

1. Make sure your Google Apps Script is deployed as a web app with "Anyone" access
2. Check that the Web app URL in `simple-sheet.js` is correct
3. Try opening the Web app URL directly in your browser with test parameters:
   - Example: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?name=Test&phone=123456789&products=Test%20Product`
   - This should add a test order to your sheet