// Authentication script for admin panel
(function() {
    // Check if user is authenticated
    function isAuthenticated() {
        const auth = sessionStorage.getItem('blazeAdminAuth');
        if (!auth) return false;
        
        try {
            // Decode the auth token
            const decoded = atob(auth);
            const [username, password] = decoded.split(':');
            
            // Verify credentials (in a real app, this would be server-side)
            return username === 'admin' && password === 'Blaze2023!';
        } catch (e) {
            return false;
        }
    }
    
    // If not authenticated, redirect to login page
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
    
    // Add logout functionality
    document.addEventListener('DOMContentLoaded', function() {
        const logoutLink = document.querySelector('.admin-logout a');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Clear authentication
                sessionStorage.removeItem('blazeAdminAuth');
                
                // Redirect to login page
                window.location.href = 'login.html';
            });
        }
    });
})();