// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navLinks = document.querySelectorAll('.admin-nav a');
    const adminSections = document.querySelectorAll('.admin-section');
    const sectionTitle = document.getElementById('section-title');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get section ID
            const sectionId = this.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Show selected section
            adminSections.forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`${sectionId}-section`).classList.add('active');
            
            // Update section title
            sectionTitle.textContent = this.textContent;
        });
    });
    
    // Load data
    loadDashboard();
    loadOrders();
    loadProducts();
    loadInventory();
    
    // Modal functionality
    const modal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    addProductBtn.addEventListener('click', function() {
        openModal('add');
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeModal();
        });
    });
    
    // Product form submission
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    // Dashboard
    function loadDashboard() {
        // Get data from localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
        
        // Calculate stats
        const totalOrders = orders.length;
        let totalRevenue = 0;
        let pendingOrders = 0;
        
        orders.forEach(order => {
            totalRevenue += order.total;
            if (order.status === 'pending') {
                pendingOrders++;
            }
        });
        
        // Update stats
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('total-revenue').textContent = `${totalRevenue} MAD`;
        document.getElementById('total-products').textContent = products.length;
        document.getElementById('pending-orders').textContent = pendingOrders;
        
        // Recent orders
        const recentOrdersTable = document.getElementById('recent-orders-table');
        recentOrdersTable.innerHTML = '';
        
        // Sort orders by date (newest first)
        const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        if (recentOrders.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5">Aucune commande récente</td>';
            recentOrdersTable.appendChild(row);
        } else {
            recentOrders.forEach(order => {
                const row = document.createElement('tr');
                
                const date = new Date(order.date);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                
                row.innerHTML = `
                    <td>${order.orderNumber}</td>
                    <td>${order.customer.fullname}</td>
                    <td>${formattedDate}</td>
                    <td>${order.total} MAD</td>
                    <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
                `;
                
                recentOrdersTable.appendChild(row);
            });
        }
    }
    
    // Orders
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const ordersTable = document.getElementById('orders-table');
        ordersTable.innerHTML = '';
        
        if (orders.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="7">Aucune commande</td>';
            ordersTable.appendChild(row);
        } else {
            // Sort orders by date (newest first)
            const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
            
            sortedOrders.forEach(order => {
                const row = document.createElement('tr');
                
                const date = new Date(order.date);
                const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                
                const itemsCount = order.items.reduce((total, item) => total + item.quantity, 0);
                
                row.innerHTML = `
                    <td>${order.orderNumber}</td>
                    <td>${order.customer.fullname}</td>
                    <td>${formattedDate}</td>
                    <td>${itemsCount} article(s)</td>
                    <td>${order.total} MAD</td>
                    <td><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></td>
                    <td>
                        <button class="action-btn view-order" data-order="${order.orderNumber}">Voir</button>
                        <button class="action-btn update-status" data-order="${order.orderNumber}">Statut</button>
                    </td>
                `;
                
                ordersTable.appendChild(row);
            });
            
            // Add event listeners to action buttons
            document.querySelectorAll('.view-order').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderNumber = this.getAttribute('data-order');
                    viewOrder(orderNumber);
                });
            });
            
            document.querySelectorAll('.update-status').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderNumber = this.getAttribute('data-order');
                    updateOrderStatus(orderNumber);
                });
            });
        }
    }
    
    // Products
    function loadProducts() {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        
        // If no products in localStorage, use default products
        if (products.length === 0) {
            products = getDefaultProducts();
            localStorage.setItem('products', JSON.stringify(products));
        }
        
        const productsTable = document.getElementById('products-table');
        productsTable.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><img src="${product.image}" alt="${product.name}" width="50" height="50" style="object-fit: contain; background-color: white;"></td>
                <td>${product.name}</td>
                <td>${product.price} MAD</td>
                <td>${getCategoryLabel(product.category)}</td>
                <td>${product.inStock ? 'Oui' : 'Non'}</td>
                <td>
                    <button class="action-btn edit-product" data-id="${product.id}">Modifier</button>
                    <button class="action-btn delete-product" data-id="${product.id}">Supprimer</button>
                </td>
            `;
            
            productsTable.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                openModal('edit', productId);
            });
        });
        
        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }
    
    // Inventory
    function loadInventory() {
        let products = JSON.parse(localStorage.getItem('products')) || getDefaultProducts();
        const inventoryTable = document.getElementById('inventory-table');
        inventoryTable.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            
            const stockStatus = product.inStock ? 'En stock' : 'Rupture de stock';
            const statusClass = product.inStock ? 'status-shipped' : 'status-cancelled';
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center;">
                        <img src="${product.image}" alt="${product.name}" width="40" height="40" style="object-fit: contain; background-color: white; margin-right: 10px;">
                        <span>${product.name}</span>
                    </div>
                </td>
                <td>${product.inStock ? 'Oui' : 'Non'}</td>
                <td><span class="status-badge ${statusClass}">${stockStatus}</span></td>
                <td>
                    <button class="action-btn toggle-stock" data-id="${product.id}" data-stock="${product.inStock}">
                        ${product.inStock ? 'Marquer en rupture' : 'Marquer en stock'}
                    </button>
                </td>
            `;
            
            inventoryTable.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.toggle-stock').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const currentStock = this.getAttribute('data-stock') === 'true';
                toggleProductStock(productId, !currentStock);
            });
        });
    }
    
    // Modal functions
    function openModal(mode, productId = null) {
        const modal = document.getElementById('product-modal');
        const modalTitle = document.getElementById('modal-title');
        const productForm = document.getElementById('product-form');
        
        // Reset form
        productForm.reset();
        
        if (mode === 'add') {
            modalTitle.textContent = 'Ajouter un produit';
            document.getElementById('product-id').value = '';
        } else if (mode === 'edit') {
            modalTitle.textContent = 'Modifier le produit';
            
            // Get product data
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const product = products.find(p => p.id === productId);
            
            if (product) {
                document.getElementById('product-id').value = product.id;
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-category').value = product.category;
                document.getElementById('product-description').value = product.description;
                document.getElementById('product-image').value = product.image;
                
                const inStockRadios = document.getElementsByName('in-stock');
                for (let i = 0; i < inStockRadios.length; i++) {
                    if (inStockRadios[i].value === String(product.inStock)) {
                        inStockRadios[i].checked = true;
                    }
                }
            }
        }
        
        modal.classList.add('active');
    }
    
    function closeModal() {
        const modal = document.getElementById('product-modal');
        modal.classList.remove('active');
    }
    
    // Product functions
    function saveProduct() {
        const productId = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value;
        const price = parseInt(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value;
        const image = document.getElementById('product-image').value;
        const inStock = document.querySelector('input[name="in-stock"]:checked').value === 'true';
        
        // Get existing products
        let products = JSON.parse(localStorage.getItem('products')) || [];
        
        if (productId) {
            // Update existing product
            const index = products.findIndex(p => p.id === parseInt(productId));
            
            if (index !== -1) {
                products[index] = {
                    ...products[index],
                    name,
                    price,
                    category,
                    description,
                    image,
                    inStock
                };
            }
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            
            products.push({
                id: newId,
                name,
                price,
                category,
                description,
                image,
                inStock,
                rating: 5,
                specs: [
                    "100% coton premium",
                    "Taille unique adaptable",
                    "Lavable en machine",
                    "Fabriqué au Maroc"
                ],
                images: [image]
            });
        }
        
        // Save products
        localStorage.setItem('products', JSON.stringify(products));
        
        // Close modal
        closeModal();
        
        // Reload products
        loadProducts();
        loadInventory();
        loadDashboard();
    }
    
    function deleteProduct(productId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            // Get existing products
            let products = JSON.parse(localStorage.getItem('products')) || [];
            
            // Remove product
            products = products.filter(p => p.id !== productId);
            
            // Save products
            localStorage.setItem('products', JSON.stringify(products));
            
            // Reload products
            loadProducts();
            loadInventory();
            loadDashboard();
        }
    }
    
    function toggleProductStock(productId, newStockStatus) {
        // Get existing products
        let products = JSON.parse(localStorage.getItem('products')) || [];
        
        // Update product stock
        const index = products.findIndex(p => p.id === productId);
        
        if (index !== -1) {
            products[index].inStock = newStockStatus;
            
            // Save products
            localStorage.setItem('products', JSON.stringify(products));
            
            // Reload inventory
            loadInventory();
            loadProducts();
        }
    }
    
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
    
    // Update order status functionality
    function updateOrderStatus(orderNumber) {
        // Get orders from localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);
        
        if (orderIndex !== -1) {
            const order = orders[orderIndex];
            
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
    
    function closeOrderModal() {
        const modal = document.getElementById('order-modal');
        if (modal) {
            modal.remove();
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
        
        // Get orders from localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);
        
        if (orderIndex !== -1) {
            // Update order status
            orders[orderIndex].status = newStatus;
            
            // Save orders
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Close modal
            closeStatusModal();
            
            // Reload orders
            loadOrders();
            loadDashboard();
        }
    }
    
    // Helper functions
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
    
    function getCategoryLabel(category) {
        const categoryLabels = {
            'casual': 'Casual',
            'traditionnel': 'Traditionnel',
            'sportif': 'Sportif'
        };
        
        return categoryLabels[category] || category;
    }
    
    function getDefaultProducts() {
        return [
            {
                id: 1,
                name: "Lost-in-Casablanca",
                price: 129,
                category: "casual",
                image: "../images/products/Lost-in-Casablanca.webp",
                rating: 5,
                description: "T-shirt inspiré par les rues animées de Casablanca, avec un design urbain unique.",
                inStock: true,
                variants: ["White", "Beige"],
                specs: [
                    "100% coton premium",
                    "Taille unique adaptable",
                    "Lavable en machine",
                    "Fabriqué au Maroc",
                    "Design exclusif"
                ],
                images: [
                    "../images/products/Lost-in-Casablanca.webp",
                    "../images/products/Lost-in-Casablanca-2.webp",
                    "../images/products/Lost-in-Casablanca-3.webp"
                ]
            },
            {
                id: 2,
                name: "Red Rug",
                price: 129,
                category: "traditionnel",
                image: "../images/products/Red-Rug.webp",
                rating: 5,
                description: "T-shirt avec motif inspiré des tapis traditionnels marocains, alliant tradition et modernité.",
                inStock: true,
                variants: ["White", "Black", "Beige"],
                specs: [
                    "100% coton premium",
                    "Taille unique adaptable",
                    "Lavable en machine",
                    "Fabriqué au Maroc",
                    "Motifs traditionnels"
                ],
                images: [
                    "../images/products/Red-Rug.webp",
                    "../images/products/Red-Rug-2.webp",
                    "../images/products/Red-Rug-3.webp"
                ]
            },
            {
                id: 3,
                name: "Turtle Rush",
                price: 129,
                category: "sportif",
                image: "../images/products/Turtle-Rush-White.webp",
                rating: 5,
                description: "T-shirt sportif avec design de tortue, parfait pour les activités de plein air et le sport.",
                inStock: true,
                variants: ["Black", "White", "Beige"],
                specs: [
                    "Tissu respirant",
                    "Taille unique adaptable",
                    "Séchage rapide",
                    "Fabriqué au Maroc",
                    "Design exclusif"
                ],
                images: [
                    "../images/products/Turtle-Rush-White.webp",
                    "../images/products/Turtle-Rush-White-2.webp",
                    "../images/products/Turtle-Rush-White-3.webp"
                ]
            },
            {
                id: 4,
                name: "Whispering Wildflowers",
                price: 129,
                category: "casual",
                image: "../images/products/Whispering-Wildflowers.webp",
                rating: 5,
                description: "T-shirt avec motif floral élégant, idéal pour un look décontracté et stylé.",
                inStock: true,
                variants: ["Black", "White"],
                specs: [
                    "100% coton premium",
                    "Taille unique adaptable",
                    "Lavable en machine",
                    "Fabriqué au Maroc",
                    "Motif floral exclusif"
                ],
                images: [
                    "../images/products/Whispering-Wildflowers.webp",
                    "../images/products/Whispering-Wildflowers-2.webp",
                    "../images/products/Whispering-Wildflowers-3.webp"
                ]
            },
            {
                id: 5,
                name: "Rise",
                price: 129,
                category: "traditionnel",
                image: "../images/products/Rise.webp",
                rating: 5,
                description: "T-shirt avec un design inspirant et élégant, parfait pour toutes les occasions.",
                inStock: true,
                variants: ["White"],
                specs: [
                    "100% coton premium",
                    "Taille unique adaptable",
                    "Lavable en machine",
                    "Fabriqué au Maroc",
                    "Design exclusif"
                ],
                images: [
                    "../images/products/Rise.webp",
                    "../images/products/Rise-2.webp",
                    "../images/products/Rise-3.webp"
                ]
            },
            {
                id: 6,
                name: "Rush",
                price: 129,
                category: "sportif",
                image: "../images/products/Rush.webp",
                rating: 5,
                description: "T-shirt sportif dynamique, idéal pour les activités physiques et le quotidien.",
                inStock: true,
                variants: ["White", "Black"],
                specs: [
                    "Tissu respirant",
                    "Taille unique adaptable",
                    "Séchage rapide",
                    "Fabriqué au Maroc",
                    "Design sportif"
                ],
                images: [
                    "../images/products/Rush.webp",
                    "../images/products/Rush-2.webp",
                    "../images/products/Rush-3.webp"
                ]
            }
        ];
    }
    
    // Add functions to window object
    window.closeOrderModal = closeOrderModal;
    window.closeStatusModal = closeStatusModal;
    window.saveOrderStatus = saveOrderStatus;
});