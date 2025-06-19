// Mobile-specific admin functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Add mobile class to body
        document.body.classList.add('mobile-admin');
        
        // Optimize tables for mobile
        optimizeTables();
        
        // Add pull-to-refresh functionality
        setupPullToRefresh();
    }
    
    // Optimize tables for mobile view
    function optimizeTables() {
        // Add data-label attributes to table cells based on their column headers
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            const headerCells = table.querySelectorAll('thead th');
            const headerTexts = Array.from(headerCells).map(th => th.textContent.trim());
            
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (headerTexts[index]) {
                        cell.setAttribute('data-label', headerTexts[index]);
                    }
                });
            });
        });
    }
    
    // Setup pull-to-refresh functionality
    function setupPullToRefresh() {
        let touchStartY = 0;
        let touchEndY = 0;
        const minSwipeDistance = 100;
        const refreshIndicator = document.createElement('div');
        refreshIndicator.className = 'refresh-indicator';
        refreshIndicator.innerHTML = 'Pull down to refresh';
        document.body.appendChild(refreshIndicator);
        
        document.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            refreshIndicator.classList.remove('active');
        }, false);
        
        document.addEventListener('touchmove', function(e) {
            touchEndY = e.touches[0].clientY;
            const distance = touchEndY - touchStartY;
            
            // Only show indicator if we're at the top of the page and pulling down
            if (window.scrollY === 0 && distance > 0) {
                refreshIndicator.style.transform = `translateY(${Math.min(distance/2, 50)}px)`;
                
                if (distance > minSwipeDistance) {
                    refreshIndicator.innerHTML = 'Release to refresh';
                    refreshIndicator.classList.add('ready');
                } else {
                    refreshIndicator.innerHTML = 'Pull down to refresh';
                    refreshIndicator.classList.remove('ready');
                }
                
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchend', function(e) {
            const distance = touchEndY - touchStartY;
            
            if (window.scrollY === 0 && distance > minSwipeDistance) {
                refreshIndicator.innerHTML = 'Refreshing...';
                refreshIndicator.classList.add('active');
                
                // Reload the page
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                refreshIndicator.style.transform = 'translateY(0)';
            }
        }, false);
    }
});