// Update order status functionality
function updateOrderStatus(orderNumber) {
    // Get orders from both localStorage and sessionStorage
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
                        <p>Commande: ${order.orderNumber}</p>
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
    const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const localOrderIndex = localOrders.findIndex(o => o.orderNumber === orderNumber);
    
    if (localOrderIndex !== -1) {
        localOrders[localOrderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(localOrders));
    }
    
    // Update in sessionStorage
    const serverOrders = JSON.parse(sessionStorage.getItem('serverOrders')) || [];
    const serverOrderIndex = serverOrders.findIndex(o => o.orderNumber === orderNumber);
    
    if (serverOrderIndex !== -1) {
        serverOrders[serverOrderIndex].status = newStatus;
        sessionStorage.setItem('serverOrders', JSON.stringify(serverOrders));
    }
    
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

// Add to window object
window.updateOrderStatus = updateOrderStatus;
window.closeStatusModal = closeStatusModal;
window.saveOrderStatus = saveOrderStatus;