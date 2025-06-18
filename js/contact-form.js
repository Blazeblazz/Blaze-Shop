// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;
            
            // Create feedback element if it doesn't exist
            let feedbackElement = document.getElementById('contact-feedback');
            if (!feedbackElement) {
                feedbackElement = document.createElement('div');
                feedbackElement.id = 'contact-feedback';
                feedbackElement.style.marginTop = '20px';
                feedbackElement.style.padding = '10px';
                feedbackElement.style.borderRadius = '4px';
                contactForm.appendChild(feedbackElement);
            }
            
            // Clear previous feedback
            feedbackElement.textContent = '';
            feedbackElement.className = '';
            
            // Send form data via AJAX
            fetch('process-contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                // Show feedback message
                if (data.success) {
                    feedbackElement.textContent = data.message;
                    feedbackElement.className = 'success-message';
                    feedbackElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                    feedbackElement.style.color = '#00ff00';
                    
                    // Reset form
                    contactForm.reset();
                } else {
                    feedbackElement.textContent = data.message || 'Une erreur est survenue. Veuillez réessayer.';
                    feedbackElement.className = 'error-message';
                    feedbackElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                    feedbackElement.style.color = '#ff3c00';
                }
            })
            .catch(error => {
                // Show error message
                feedbackElement.textContent = 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer plus tard.';
                feedbackElement.className = 'error-message';
                feedbackElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                feedbackElement.style.color = '#ff3c00';
                console.error('Error:', error);
            })
            .finally(() => {
                // Restore button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
});