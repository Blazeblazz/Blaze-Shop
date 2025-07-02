// Script to create a JSONBin.io bin for storing orders
// Run this script once to set up your bin

// Replace with your actual API key from JSONBin.io
const API_KEY = "$2a$10$YOUR_API_KEY";

// Function to create a new bin
async function createBin() {
    try {
        const response = await fetch("https://api.jsonbin.io/v3/b", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY,
                "X-Bin-Private": "true",
                "X-Bin-Name": "BLAZE-Orders"
            },
            body: JSON.stringify({"orders":[]}) // Object with empty orders array
        });

        if (!response.ok) {
            throw new Error(`Failed to create bin: ${response.status}`);
        }

        const data = await response.json();
        console.log("Bin created successfully!");
        console.log("Your Bin ID:", data.metadata.id);
        console.log("Update your api.js file with this ID");
        
        return data.metadata.id;
    } catch (error) {
        console.error("Error creating bin:", error);
        return null;
    }
}

// Run the function
createBin();