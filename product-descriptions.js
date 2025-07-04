// Product descriptions
document.addEventListener('DOMContentLoaded', function() {
    // Get product name from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');
    
    // Update page title and breadcrumb
    if (productName) {
        document.title = productName + " - BLAZE Streetwear";
        
        // Update breadcrumb
        const breadcrumbItem = document.querySelector('.breadcrumb li:last-child');
        if (breadcrumbItem) {
            breadcrumbItem.textContent = productName;
        }
        
        // Update product title
        const productTitle = document.querySelector('.product-info-detail h1');
        if (productTitle) {
            productTitle.textContent = productName;
        }
        
        // Update product description
        updateProductDescription(productName);
    }
    
    function updateProductDescription(productName) {
        const descriptions = {
            'RISE': {
                text: "Le t-shirt RISE incarne l'esprit du renouveau urbain. Fabriqué en coton 100% biologique de qualité supérieure, cette pièce présente un design saisissant qui symbolise l'aube de nouvelles possibilités. L'esthétique minimaliste est complétée par un confort exceptionnel, ce qui en fait un vêtement parfait pour tous les jours.",
                details: [
                    "100% coton biologique premium",
                    "Design sérigraphié",
                    "Col renforcé",
                    "Coupe régulière",
                    "Fabriqué au Maroc"
                ]
            },
            'SEGRETO': {
                text: "SEGRETO révèle la beauté cachée de l'architecture marocaine. Ce t-shirt premium présente des motifs complexes inspirés des portes anciennes et des passages secrets. Fabriqué à partir d'un tissu doux et respirant, il offre à la fois style et confort pour l'explorateur urbain.",
                details: [
                    "100% coton biologique premium",
                    "Sérigraphie de haute qualité",
                    "Coutures renforcées",
                    "Coupe régulière",
                    "Fabriqué au Maroc"
                ]
            },
            'WILDFLOWERS': {
                text: "WILDFLOWERS célèbre la beauté résiliente trouvée dans des espaces urbains inattendus. Ce t-shirt présente des éléments botaniques délicats contrastés avec des formes géométriques audacieuses. Le tissu premium assure un confort tout au long de la journée tout en faisant une déclaration de style distinctive.",
                details: [
                    "100% coton biologique premium",
                    "Encres écologiques à base d'eau",
                    "Col et épaules renforcés",
                    "Coupe régulière",
                    "Fabriqué au Maroc"
                ]
            },
            'RUSH': {
                text: "RUSH capture l'énergie dynamique de la vie urbaine. Ce t-shirt premium présente un design inspiré par le mouvement constant et le rythme des environnements urbains. Le tissu et la construction de haute qualité assurent la durabilité tout en maintenant un confort exceptionnel.",
                details: [
                    "100% coton biologique premium",
                    "Sérigraphie durable",
                    "Coutures renforcées",
                    "Coupe régulière",
                    "Fabriqué au Maroc"
                ]
            },
            'LOST IN CASABLANCA': {
                text: "LOST IN CASABLANCA raconte l'histoire d'une errance à travers la ville la plus emblématique du Maroc. Ce t-shirt premium présente un design qui mélange des motifs traditionnels avec un style de rue contemporain. La qualité supérieure du tissu assure le confort tout au long de vos propres aventures urbaines.",
                details: [
                    "100% coton biologique premium",
                    "Impression haute définition",
                    "Ourlets à double couture",
                    "Coupe régulière",
                    "Fabriqué au Maroc"
                ]
            },
            'TRUST THE PROCESS': {
                text: "TRUST THE PROCESS est plus qu'un t-shirt—c'est une philosophie. Cette pièce premium présente un design minimaliste qui parle de patience et de persévérance. Fabriqué à partir de matériaux de haute qualité, il offre à la fois confort et un message significatif pour votre parcours quotidien.",
                details: [
                    "100% coton biologique premium",
                    "Technologie d'impression durable",
                    "Col renforcé",
                    "Coupe régulière",
                    "Fabriqué au Maroc"
                ]
            }
        };
        
        // Default description if product not found
        const defaultDescription = {
            text: "T-shirt de qualité premium de la collection exclusive BLAZE. Fabriqué en coton 100% biologique et présentant un design unique qui capture l'essence de la culture urbaine marocaine.",
            details: [
                "100% coton biologique premium",
                "Impression de haute qualité",
                "Coutures renforcées",
                "Coupe régulière",
                "Fabriqué au Maroc"
            ]
        };
        
        // Get description for the product or use default
        const description = descriptions[productName] || defaultDescription;
        
        // Update description text
        const descriptionElement = document.querySelector('.product-description p');
        if (descriptionElement) {
            descriptionElement.textContent = description.text;
        }
        
        // Update product details
        const detailsList = document.querySelector('.accordion-content ul');
        if (detailsList) {
            detailsList.innerHTML = '';
            description.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                detailsList.appendChild(li);
            });
        }
    }
});