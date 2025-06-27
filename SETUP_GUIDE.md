# BLAZE Order System Setup Guide

## Google Form Setup

1. **Create a Google Form**:
   - Go to [Google Forms](https://forms.google.com) and create a new form
   - Name your form "BLAZE Orders"

2. **Add the following questions**:
   - Question 1: "Customer Name" (Short answer)
   - Question 2: "Phone Number" (Short answer)
   - Question 3: "City" (Short answer)
   - Question 4: "Order Details" (Paragraph)

3. **Link to Google Sheets**:
   - Click on the "Responses" tab
   - Click on the Google Sheets icon
   - Select "Create a new spreadsheet"
   - Click "Create"

4. **Verify Form Field IDs**:
   - The form is already configured with these field IDs:
     - Customer Name: entry.1166974658
     - Phone Number: entry.1718486731
     - City: entry.1373276665
     - Order Details: entry.1373276665
   - If your form has different IDs, update them in the checkout-new.js file

## Testing the System

1. **Place a test order**:
   - Go to your website
   - Add a product to cart
   - Complete the checkout process
   - Check your Google Sheet to see if the order appears

2. **Troubleshooting**:
   - If orders don't appear, check the browser console for errors
   - Verify that the form IDs in checkout-new.js match your actual Google Form

## Managing Orders

Your Google Sheet will automatically receive all orders with:
- Customer name
- Phone number
- City
- Complete order details (products, variants, quantities, prices)

You can:
- Sort orders by timestamp
- Filter by any column
- Add additional columns for order status tracking
- Share the sheet with your team members