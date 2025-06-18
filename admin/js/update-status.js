// Update order status functionality
function updateOrderStatus(orderNumber) {
    // Get orders from all storage methods
    const orders = getAllOrders();
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (order) {
        // Create modal content
        let modalContent = `
            <div class="modal active" id="status-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Mettre à jour le statut</h3>
                        <span class="close-modal" onclick="closeStatusModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p>Commande: ${order.orderNumber} ${order.isMobile ? '<span style="color: #ff3c00;">📱</span>' : ''}</p>
                        <p>Statut actuel: <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></p>
                        
                        <div class="form-group">
                            <label for="new-status">Nouveau statut:</label>
                            <select id="new-status">
                                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>En attente</option>
                                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>En traitement</option>
                                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Expédié</option>
                                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Livré</option>
                                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Annulé</option>
                            </select>
                        </div>
                        
                        <div class="form-actions">
                            <button class="btn btn-secondary" onclick="closeStatusModal()">Annuler</button>
                            <button class="btn btn-primary" onclick="saveOrderStatus('${order.orderNumber}')">Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>`;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalContent);
    }
}

function closeStatusModal() {
    const modal = document.getElementById('status-modal');
    if (modal) {
        modal.remove();
    }
}

function saveOrderStatus(orderNumber) {
    // Get new status
    const newStatus = document.getElementById('new-status').value;
    
    // Update in localStorage
    try {
        const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
        const localOrderIndex = localOrders.findIndex(o => o.orderNumber === orderNumber);
        
        if (localOrderIndex !== -1) {
            localOrders[localOrderIndex].status = newStatus;
            localStorage.setItem('orders', JSON.stringify(localOrders));
        }
    } catch (error) {
        console.error('Error updating localStorage:', error);
    }
    
    // Update in sessionStorage
    try {
        const sessionOrders = JSON.parse(sessionStorage.getItem('serverOrders')) || [];
        const sessionOrderIndex = sessionOrders.findIndex(o => o.orderNumber === orderNumber);
        
        if (sessionOrderIndex !== -1) {
            sessionOrders[sessionOrderIndex].status = newStatus;
            sessionStorage.setItem('serverOrders', JSON.stringify(sessionOrders));
        }
    } catch (error) {
        console.error('Error updating sessionStorage:', error);
    }
    
    // Update in cookies
    try {
        const cookieOrders = getCookieOrders();
        const cookieOrderIndex = cookieOrders.findIndex(o => o.orderNumber === orderNumber);
        
        if (cookieOrderIndex !== -1) {
            cookieOrders[cookieOrderIndex].status = newStatus;
            setCookie('blazeOrders', JSON.stringify(cookieOrders), 30);
        }
    } catch (error) {
        console.error('Error updating cookies:', error);
    }
    
    // Update in IndexedDB
    updateOrderInIndexedDB(orderNumber, newStatus);
    
    // Close modal
    closeStatusModal();
    
    // Reload page to refresh data
    location.reload();
}

// Helper function to get status label
function getStatusLabel(status) {
    const statusLabels = {
        'pending': 'En attente',
        'processing': 'En traitement',
        'shipped': 'Expédié',
        'delivered': 'Livré',
        'cancelled': 'Annulé'
    };
    
    return statusLabels[status] || status;
}

// Cookie helpers
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function getCookieOrders() {
    const cookieData = getCookie('blazeOrders');
    if (cookieData) {
        try {
            return JSON.parse(cookieData);
        } catch (e) {
            return [];
        }
    }
    return [];
}

// IndexedDB helper
function updateOrderInIndexedDB(orderNumber, newStatus) {
    if (!window.indexedDB) return;
    
    const request = indexedDB.open('BlazeDB', 1);
    
    request.onsuccess = function(event) {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains('orders')) return;
        
        const transaction = db.transaction(['orders'], 'readwrite');
        const store = transaction.objectStore('orders');
        
        // Get the order
        const getRequest = store.get(orderNumber);
        
        getRequest.onsuccess = function() {
            const order = getRequest.result;
            if (order) {
                // Update status
                order.status = newStatus;
                
                // Put back the updated order
                store.put(order);
            }
        };
    };
}

// Add to window object
window.updateOrderStatus = updateOrderStatus;
window.closeStatusModal = closeStatusModal;
window.saveOrderStatus = saveOrderStatus;