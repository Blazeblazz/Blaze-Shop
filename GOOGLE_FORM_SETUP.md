# Setting Up Google Forms for Order Management

Follow these steps to set up your Google Forms integration for order management:

## Step 1: Create a Google Form

1. Go to [Google Forms](https://forms.google.com) and create a new form
2. Name your form "BLAZE Orders" or any name you prefer
3. Add the following questions (all as "Short answer" type):
   - Name
   - Phone
   - City
   - Product
   - Variant
   - Quantity
   - Total (MAD)
   - Order Number

## Step 2: Link to Google Sheets

1. Click on the "Responses" tab
2. Click on the Google Sheets icon (looks like a green spreadsheet)
3. Select "Create a new spreadsheet"
4. Click "Create"

## Step 3: Get the Form Submission URL

1. Click the "Preview" button (eye icon) to open the form
2. Right-click on the form and select "View Page Source"
3. Search for `<form` in the page source
4. Find the `action` attribute which contains the form submission URL
   - It will look like: `https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse`
5. Copy this URL

## Step 4: Get the Form Field Names

1. In the same page source, search for `entry.`
2. Find the input fields with names like `entry.123456789`
3. Note down which entry number corresponds to which field:
   - Name: entry.XXXXXXXXX
   - Phone: entry.XXXXXXXXX
   - City: entry.XXXXXXXXX
   - Product: entry.XXXXXXXXX
   - Variant: entry.XXXXXXXXX
   - Quantity: entry.XXXXXXXXX
   - Total: entry.XXXXXXXXX
   - Order Number: entry.XXXXXXXXX

## Step 5: Update Your Website

1. Open the file `js/google-form-orders.js`
2. Replace the `googleFormUrl` with the URL you copied in Step 3
3. Replace the entry numbers in the `formData.append` lines with the ones you noted in Step 4
4. Save the file and upload it to your website

## Step 6: Test the Integration

1. Place a test order on your website
2. Check your Google Sheet to see if the order appears
3. If the order doesn't appear, check the browser console for any errors

## Managing Orders in Google Sheets

Your Google Sheet will automatically receive responses from the form. You can:
- Sort orders by timestamp
- Filter orders by any column
- Add additional columns for status tracking
- Use Google Sheets formulas for calculations

## Troubleshooting

If orders are not appearing in your Google Sheet:

1. Check that the form submission URL is correct in `google-form-orders.js`
2. Verify that the entry numbers match your actual form fields
3. Try submitting the form manually to ensure it's working
4. Check if your form has any required fields that aren't being filled