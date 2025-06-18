// View order functionality
function viewOrder(orderNumber) {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (order) {
        // Create modal content
        let modalContent = `
            <div class="modal active" id="order-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Commande ${order.orderNumber}</h3>
                        <span class="close-modal" onclick="closeOrderModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="order-details">
                            <h4>Détails de la commande</h4>
                            <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                            <p><strong>Statut:</strong> <span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></p>
                            <p><strong>Total:</strong> ${order.total} MAD</p>
                            <p><strong>Mode de paiement:</strong> Paiement à la livraison</p>
                        </div>
                        <div class="customer-details">
                            <h4>Informations client</h4>
                            <p><strong>Nom:</strong> ${order.customer.fullname}</p>
                            <p><strong>Téléphone:</strong> ${order.customer.phone}</p>
                            <p><strong>Ville:</strong> ${order.customer.city}</p>
                            <p><strong>Adresse:</strong> ${order.customer.address}</p>
                            ${order.customer.email ? `<p><strong>Email:</strong> ${order.customer.email}</p>` : ''}
                        </div>
                        <div class="order-items">
                            <h4>Articles</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Produit</th>
                                        <th>Prix</th>
                                        <th>Quantité</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>`;
        
        // Add order items
        order.items.forEach(item => {
            modalContent += `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center;">
                            <img src="../${item.image}" alt="${item.name}" width="40" height="40" style="object-fit: contain; background-color: white; margin-right: 10px;">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>${item.price} MAD</td>
                    <td>${item.quantity}</td>
                    <td>${item.price * item.quantity} MAD</td>
                </tr>`;
        });
        
        modalContent += `
                                </tbody>
                            </table>
                        </div>
                        <div class="form-actions" style="margin-top: 20px;">
                            <button class="btn btn-primary" onclick="closeOrderModal()">Fermer</button>
                        </div>
                    </div>
                </div>
            </div>`;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalContent);
    }
}

function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) {
        modal.remove();
    }
}

// Add to window object
window.viewOrder = viewOrder;
window.closeOrderModal = closeOrderModal;