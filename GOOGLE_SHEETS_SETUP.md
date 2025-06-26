# Setting Up Google Sheets for Order Management

Follow these steps to set up your Google Sheets integration for order management:

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name your spreadsheet "BLAZE Orders" or any name you prefer
3. Note the spreadsheet ID from the URL:
   - The URL will look like: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit`
   - Copy the `YOUR_SPREADSHEET_ID_HERE` part for later use

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on **Extensions** > **Apps Script**
2. Delete any code in the editor and paste the contents of the `google-apps-script.js` file
3. Replace `YOUR_SPREADSHEET_ID_HERE` with the ID you copied in Step 1
4. Click **Save** and name the project "BLAZE Order Management"

## Step 3: Deploy as Web App

1. Click on **Deploy** > **New deployment**
2. Select **Web app** as the deployment type
3. Set the following options:
   - Description: "BLAZE Order Management"
   - Execute as: "Me"
   - Who has access: "Anyone" (this allows your website to send data)
4. Click **Deploy**
5. Authorize the app when prompted
6. Copy the Web app URL that appears after deployment

## Step 4: Update Your Website

1. Open the file `js/google-sheet-orders.js`
2. Replace `YOUR_SCRIPT_ID_HERE` with the Web app URL you copied in Step 3
3. Save the file and upload it to your website

## Step 5: Test the Integration

1. Place a test order on your website
2. Check your Google Sheet to see if the order appears
3. If the order doesn't appear, check the browser console for any errors

## Managing Orders in Google Sheets

Your Google Sheet will now have the following columns:
- Order Number
- Date
- Name
- Phone
- City
- Product
- Variant
- Quantity
- Total (MAD)
- Status

You can:
- Sort orders by date
- Filter orders by status
- Update the status column manually
- Add additional columns for notes or tracking information

## Troubleshooting

If orders are not appearing in your Google Sheet:

1. Check that the Web app URL is correctly set in `google-sheet-orders.js`
2. Make sure your Google Apps Script is deployed as a web app with "Anyone" access
3. Check the browser console for any JavaScript errors
4. Verify that the Google Sheet ID in the Apps Script matches your actual spreadsheet