// Login functionality for orders page
(function() {
    // Check if user is authenticated
    function checkAuth() {
        const auth = sessionStorage.getItem('blazeAdminAuth');
        if (!auth) {
            showLoginForm();
            return false;
        }
        
        try {
            // Decode the auth token
            const decoded = atob(auth);
            const [username, password] = decoded.split(':');
            
            // Verify credentials (in a real app, this would be server-side)
            if (username === 'admin' && password === 'Blaze2023!') {
                return true;
            } else {
                showLoginForm();
                return false;
            }
        } catch (e) {
            showLoginForm();
            return false;
        }
    }
    
    // Show login form
    function showLoginForm() {
        // Create login form
        const loginForm = document.createElement('div');
        loginForm.className = 'login-overlay';
        loginForm.innerHTML = `
            <div class="login-modal">
                <div class="login-header">
                    <h2>Connexion requise</h2>
                </div>
                <div class="login-body">
                    <div class="error-message" style="display: none;">
                        Nom d'utilisateur ou mot de passe incorrect
                    </div>
                    <div class="form-group">
                        <label for="username">Nom d'utilisateur</label>
                        <input type="text" id="username" placeholder="Entrez votre nom d'utilisateur" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Mot de passe</label>
                        <input type="password" id="password" placeholder="Entrez votre mot de passe" required>
                    </div>
                    <button type="button" id="login-button" class="btn btn-primary">Se connecter</button>
                </div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(loginForm);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .login-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            
            .login-modal {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                overflow: hidden;
            }
            
            .login-header {
                background-color: #000;
                color: white;
                padding: 15px 20px;
                border-bottom: 3px solid #ff0000;
            }
            
            .login-header h2 {
                margin: 0;
                font-size: 20px;
            }
            
            .login-body {
                padding: 20px;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
            }
            
            .form-group input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            
            .error-message {
                background-color: #ffebee;
                color: #c62828;
                padding: 10px;
                border-radius: 4px;
                margin-bottom: 15px;
                border-left: 3px solid #c62828;
            }
            
            #login-button {
                width: 100%;
                padding: 10px;
                background-color: #ff0000;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
            }
            
            #login-button:hover {
                background-color: #cc0000;
            }
        `;
        document.head.appendChild(style);
        
        // Add event listener to login button
        document.getElementById('login-button').addEventListener('click', function() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'admin' && password === 'Blaze2023!') {
                // Store authentication
                sessionStorage.setItem('blazeAdminAuth', btoa(username + ':' + password));
                
                // Remove login form
                document.body.removeChild(loginForm);
                document.head.removeChild(style);
                
                // Initialize orders page
                initOrdersPage();
            } else {
                // Show error message
                document.querySelector('.error-message').style.display = 'block';
            }
        });
        
        // Focus on username input
        setTimeout(() => {
            document.getElementById('username').focus();
        }, 100);
    }
    
    // Initialize orders page
    function initOrdersPage() {
        // Get DOM elements
        const ordersContainer = document.getElementById('orders-container');
        const orderCountBadge = document.getElementById('order-count');
        const refreshButton = document.getElementById('refresh-orders');
        const filterSelect = document.getElementById('order-filter');
        const deviceFilterSelect = document.getElementById('device-filter');
        
        // Set up event listeners
        if (refreshButton) {
            refreshButton.addEventListener('click', window.refreshOrders);
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', window.filterOrders);
        }
        
        if (deviceFilterSelect) {
            deviceFilterSelect.addEventListener('change', window.filterOrders);
        }
        
        // Initial fetch
        if (window.refreshOrders) {
            window.refreshOrders();
        }
    }
    
    // Check authentication when page loads
    document.addEventListener('DOMContentLoaded', function() {
        if (checkAuth()) {
            initOrdersPage();
        }
    });
})();