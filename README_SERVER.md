# BLAZE E-commerce Server Setup

This document explains how to set up the server-side component for your BLAZE e-commerce website to receive orders when deployed.

## Quick Setup with JSONBin.io

We're using JSONBin.io as a simple backend service to store orders. Follow these steps to set it up:

1. **Create a JSONBin.io account**
   - Go to [JSONBin.io](https://jsonbin.io/) and sign up for a free account

2. **Create a new bin**
   - After logging in, click "Create Bin"
   - In the JSON content area, type exactly this (including the quotes):
     ```
     {"orders":[]}
     ```
   - Make sure you copy it exactly as shown above
   - Set "Private" to "true"
   - Click "Create" to create your bin

3. **Get your API key and Bin ID**
   - Go to your account dashboard by clicking on your username in the top right corner
   - Select "API Keys" from the dropdown menu
   - You'll see your Master Key (starts with $2a$10$) - this is your API key
   - For the Bin ID, go to your newly created bin and copy the ID from the URL (it looks like: 6123456789abcdef1234567)

4. **Update the api.js file**
   - Open the `api.js` file in your project
   - Replace `YOUR_API_KEY` with your actual JSONBin.io API key
   - Replace `YOUR_BIN_ID` with your actual Bin ID

## Testing

1. After setting up, place a test order on your website
2. Check your JSONBin.io bin to verify the order was saved
3. Log in to your admin panel to confirm the order appears there

## Production Considerations

For a production environment, consider these improvements:

1. **Use a more robust backend**
   - Consider using Firebase, AWS, or a dedicated e-commerce backend

2. **Add authentication**
   - Implement proper authentication for your admin panel

3. **Set up order notifications**
   - Add email or SMS notifications when new orders are received

4. **Implement HTTPS**
   - Ensure your website uses HTTPS for secure data transmission

## Alternative Method: Using the HTML Tool

If you're having trouble creating a bin through the JSONBin.io web interface, you can use the included HTML tool:

1. Open the `create-bin.html` file in your browser
2. Enter your JSONBin.io API key
3. Click "Create Bin"
4. Copy the Bin ID that appears
5. Update your `api.js` file with this ID

This tool automatically creates a bin with the correct initial content (an empty array).

## Troubleshooting

If orders aren't appearing in your admin panel:

1. Check browser console for errors
2. Verify your API key and Bin ID are correct
3. Ensure your JSONBin.io account is active
4. Check that the bin permissions are set correctly