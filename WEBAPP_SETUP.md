# Professional Order Management System Setup

This guide will help you set up a professional order management system using Google Sheets and Google Apps Script.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "BLAZE Order Management"
3. Note the spreadsheet ID from the URL:
   - The URL will look like: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit`
   - Copy the `YOUR_SPREADSHEET_ID_HERE` part for later use

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click on **Extensions** > **Apps Script**
2. Delete any code in the editor and paste the contents of the `google-apps-script-webapp.js` file
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

1. Open the file `js/order-webapp.js`
2. Replace `YOUR_SCRIPT_ID_HERE` with the Web app URL you copied in Step 3
3. Save the file and upload it to your website

## Step 5: Test the Integration

1. Place a test order on your website
2. Check your Google Sheet to see if the order appears
3. If the order doesn't appear, check the browser console for any errors

## Using Your Order Management System

Your Google Sheet will now have two sheets:

### Orders Sheet
- Contains one row per order with all customer information
- Columns: Order Number, Date, Customer Name, Phone, City, Products, Total, Status, Payment, Notes
- Use this sheet for a high-level view of all orders

### Products Sheet
- Contains one row per product in each order
- Columns: Order Number, Date, Product Name, Variant, Quantity, Unit Price, Subtotal
- Use this sheet for inventory management and product analytics

### Managing Orders

1. **View Orders**: Open your Google Sheet to see all orders
2. **Filter Orders**: Use the column filters to find specific orders
3. **Update Status**: Change the status column as orders progress
   - New: Just received
   - Processing: Being prepared
   - Shipped: On the way
   - Delivered: Completed
   - Cancelled: Order cancelled
4. **Track Payments**: Update payment status as payments are received
   - Pending: Not yet paid
   - Paid: Payment received
   - Refunded: Money returned
5. **Add Notes**: Use the notes column for special instructions or customer feedback

### Creating Reports

You can create additional sheets for reports such as:
- Daily/weekly/monthly sales
- Best-selling products
- Customer locations
- Payment status summary

## Troubleshooting

If orders are not appearing in your Google Sheet:

1. Check that the Web app URL is correctly set in `order-webapp.js`
2. Make sure your Google Apps Script is deployed as a web app with "Anyone" access
3. Check the browser console for any JavaScript errors
4. Verify that the Google Sheet ID in the Apps Script matches your actual spreadsheet