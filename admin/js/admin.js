// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check for mobile order in URL
    checkForMobileOrder();
    
    // Add manual sync button
    addSyncButton();
    
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
    
    // Add sync button to header and mobile quick actions
    function addSyncButton() {
        // Add to header
        const adminHeader = document.querySelector('.admin-header');
        const syncButton = document.createElement('button');
        syncButton.className = 'btn sync-btn';
        syncButton.innerHTML = 'Sync Mobile Orders';
        syncButton.addEventListener('click', function() {
            syncMobileOrders();
        });
        
        // Insert before the admin user div
        const adminUser = document.querySelector('.admin-user');
        adminHeader.insertBefore(syncButton, adminUser);
        
        // Add mobile quick actions bar
        const mobileActions = document.createElement('div');
        mobileActions.className = 'mobile-quick-actions';
        
        // Sync button for mobile
        const mobileSyncBtn = document.createElement('button');
        mobileSyncBtn.className = 'btn';
        mobileSyncBtn.innerHTML = 'Sync Orders';
        mobileSyncBtn.addEventListener('click', function() {
            syncMobileOrders();
        });
        
        // Dashboard button for mobile
        const dashboardBtn = document.createElement('button');
        dashboardBtn.className = 'btn';
        dashboardBtn.innerHTML = 'Dashboard';
        dashboardBtn.addEventListener('click', function() {
            showSection('dashboard');
        });
        
        // Orders button for mobile
        const ordersBtn = document.createElement('button');
        ordersBtn.className = 'btn';
        ordersBtn.innerHTML = 'Orders';
        ordersBtn.addEventListener('click', function() {
            showSection('orders');
        });
        
        // Add buttons to mobile actions
        mobileActions.appendChild(dashboardBtn);
        mobileActions.appendChild(ordersBtn);
        mobileActions.appendChild(mobileSyncBtn);
        
        // Add to body
        document.body.appendChild(mobileActions);
    }
    
    // Helper to show a specific section
    function showSection(sectionId) {
        // Update active nav link
        document.querySelectorAll('.admin-nav a').forEach(link => {
            if (link.getAttribute('data-section') === sectionId) {
                link.parentElement.classList.add('active');
            } else {
                link.parentElement.classList.remove('active');
            }
        });
        
        // Show selected section
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${sectionId}-section`).classList.add('active');
        
        // Update section title
        document.getElementById('section-title').textContent = 
            sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
    }
    
    // Sync mobile orders
    function syncMobileOrders() {
        // Create a form to open the sync page
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = window.location.href;
        form.target = '_self';
        
        // Add sync parameter
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'syncMobile';
        input.value = 'true';
        form.appendChild(input);
        
        // Add to document and submit
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }
    
    // Check for mobile order in URL and save it
    function checkForMobileOrder() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const mobileOrder = urlParams.get('mobileOrder');
            const syncMobile = urlParams.get('syncMobile');
            
            if (mobileOrder) {
                const order = JSON.parse(decodeURIComponent(mobileOrder));
                
                // Get existing orders
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                
                // Add new order if not already present
                if (!orders.some(o => o.orderNumber === order.orderNumber)) {
                    orders.push(order);
                    
                    // Save back to localStorage
                    localStorage.setItem('orders', JSON.stringify(orders));
                    
                    // Show notification
                    showNotification('Nouvelle commande mobile reçue!');
                }
                
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } else if (syncMobile) {
                // Try to get orders from sessionStorage
                try {
                    const sessionOrders = JSON.parse(sessionStorage.getItem('orders')) || [];
                    const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
                    
                    let newOrdersCount = 0;
                    
                    // Add session orders to local if not already present
                    sessionOrders.forEach(order => {
                        if (!localOrders.some(o => o.orderNumber === order.orderNumber)) {
                            localOrders.push(order);
                            newOrdersCount++;
                        }
                    });
                    
                    if (newOrdersCount > 0) {
                        // Save back to localStorage
                        localStorage.setItem('orders', JSON.stringify(localOrders));
                        
                        // Show notification
                        showNotification(`${newOrdersCount} nouvelle(s) commande(s) synchronisée(s)!`);
                        
                        // Reload page to show new orders
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        showNotification('Aucune nouvelle commande trouvée');
                    }
                } catch (error) {
                    console.error('Error syncing mobile orders:', error);
                    showNotification('Erreur lors de la synchronisation');
                }
                
                // Clean URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (error) {
            console.error('Error processing mobile order:', error);
        }
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'admin-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
    
    // Dashboard
    function loadDashboard() {
        // Get data from localStorage
        const orders = getOrders();
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
        const orders = getOrders();
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
                
                // Add mobile indicator if order is from mobile
                const mobileIndicator = order.isMobile ? 
                    '<span style="color: #ff3c00; margin-left: 5px;">📱</span>' : '';
                
                row.innerHTML = `
                    <td>${order.orderNumber}${mobileIndicator}</td>
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
    
    // Get all orders from all storage methods
    function getOrders() {
        // Try to get from OrdersAPI first
        if (window.OrdersAPI) {
            return OrdersAPI.getOrders();
        }
        
        // Fallback to direct localStorage
        try {
            // Get from localStorage
            const localOrders = JSON.parse(localStorage.getItem('orders')) || [];
            
            // Get from sessionStorage as backup
            const sessionOrders = JSON.parse(sessionStorage.getItem('orders')) || [];
            
            // Merge orders, avoiding duplicates
            const allOrders = [...localOrders];
            
            sessionOrders.forEach(order => {
                if (!allOrders.some(o => o.orderNumber === order.orderNumber)) {
                    allOrders.push(order);
                }
            });
            
            return allOrders;
        } catch (error) {
            console.error('Error getting orders:', error);
            return [];
        }
    }
    
    function getDefaultProducts() {
        return [
            {
                id: 1,
                name: "Lost-in-Casablanca",
                price: 129,
                category: "casual",
                image: "../images/Products/Lost-in-Casablanca.webp",
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
                    "../images/Products/Lost-in-Casablanca.webp"
                ]
            },
            {
                id: 2,
                name: "Red Rug",
                price: 129,
                category: "traditionnel",
                image: "../images/Products/Red-Rug.webp",
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
                    "../images/Products/Red-Rug.webp"
                ]
            },
            {
                id: 3,
                name: "Turtle Rush",
                price: 129,
                category: "sportif",
                image: "../images/Products/Turtle-Rush-White.webp",
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
                    "../images/Products/Turtle-Rush-White.webp"
                ]
            },
            {
                id: 4,
                name: "Whispering Wildflowers",
                price: 129,
                category: "casual",
                image: "../images/Products/Whispering-Wildflowers.webp",
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
                    "../images/Products/Whispering-Wildflowers.webp"
                ]
            },
            {
                id: 5,
                name: "Rise",
                price: 129,
                category: "traditionnel",
                image: "../images/Products/RISE.webp",
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
                    "../images/Products/RISE.webp"
                ]
            },
            {
                id: 6,
                name: "Rush",
                price: 129,
                category: "sportif",
                image: "../images/Products/Rush.webp",
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
                    "../images/Products/Rush.webp"
                ]
            }
        ];
    }
});