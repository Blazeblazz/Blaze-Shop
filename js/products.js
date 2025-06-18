// Products data
const products = [
    {
        id: 1,
        name: "Lost-in-Casablanca",
        price: 129,
        category: "casual",
        image: "images/products/Lost-in-Casablanca.webp",
        rating: 5,
        description: "T-shirt inspiré par les rues animées de Casablanca, avec un design urbain unique.",
        inStock: true,
        specs: [
            "100% coton premium",
            "Taille unique adaptable",
            "Lavable en machine",
            "Fabriqué au Maroc",
            "Design exclusif"
        ],
        images: [
            "images/products/Lost-in-Casablanca.webp",
            "images/products/Lost-in-Casablanca-2.webp",
            "images/products/Lost-in-Casablanca-3.webp"
        ]
    },
    {
        id: 2,
        name: "Red Rug",
        price: 129,
        category: "traditionnel",
        image: "images/products/Red-Rug.webp",
        rating: 5,
        description: "T-shirt avec motif inspiré des tapis traditionnels marocains, alliant tradition et modernité.",
        inStock: true,
        specs: [
            "100% coton premium",
            "Taille unique adaptable",
            "Lavable en machine",
            "Fabriqué au Maroc",
            "Motifs traditionnels"
        ],
        images: [
            "images/products/Red-Rug.webp",
            "images/products/Red-Rug-2.webp",
            "images/products/Red-Rug-3.webp"
        ]
    },
    {
        id: 3,
        name: "Turtle Rush",
        price: 129,
        category: "sportif",
        image: "images/products/Turtle-Rush-White.webp",
        rating: 5,
        description: "T-shirt sportif avec design de tortue, parfait pour les activités de plein air et le sport.",
        inStock: true,
        specs: [
            "Tissu respirant",
            "Taille unique adaptable",
            "Séchage rapide",
            "Fabriqué au Maroc",
            "Design exclusif"
        ],
        images: [
            "images/products/Turtle-Rush-White.webp",
            "images/products/Turtle-Rush-White-2.webp",
            "images/products/Turtle-Rush-White-3.webp"
        ]
    },
    {
        id: 4,
        name: "Whispering Wildflowers",
        price: 129,
        category: "casual",
        image: "images/products/Whispering-Wildflowers.webp",
        rating: 5,
        description: "T-shirt avec motif floral élégant, idéal pour un look décontracté et stylé.",
        inStock: true,
        specs: [
            "100% coton premium",
            "Taille unique adaptable",
            "Lavable en machine",
            "Fabriqué au Maroc",
            "Motif floral exclusif"
        ],
        images: [
            "images/products/Whispering-Wildflowers.webp",
            "images/products/Whispering-Wildflowers-2.webp",
            "images/products/Whispering-Wildflowers-3.webp"
        ]
    }
];

// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Product filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
    
    function filterProducts(category) {
        const productItems = document.querySelectorAll('.product-item');
        
        productItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
});