// Global pixel tracking for the entire website
(function() {
    // Track page views
    function trackPageView() {
        const pageData = {
            url: window.location.href,
            title: document.title,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        
        sendPixelData('pageview', pageData);
    }
    
    // Track events
    function trackEvent(eventType, data = {}) {
        const eventData = {
            event: eventType,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            ...data
        };
        
        sendPixelData('event', eventData);
    }
    
    // Send data to backend
    function sendPixelData(type, data) {
        fetch('api/pixel.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, data }),
            keepalive: true
        }).catch(() => {});
    }
    
    // Track page view on load
    trackPageView();
    
    // Track clicks on products
    document.addEventListener('click', function(e) {
        if (e.target.closest('.product-item, .work-item')) {
            trackEvent('product_click', {
                product: e.target.closest('.product-item, .work-item').dataset.id
            });
        }
        
        if (e.target.closest('.btn-primary, .order-now')) {
            trackEvent('order_button_click');
        }
        
        if (e.target.closest('.featured-btn')) {
            trackEvent('featured_product_click');
        }
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            trackEvent('scroll', { depth: scrollPercent });
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', { seconds: timeSpent });
    });
    
    // Export tracking function
    window.trackPixelEvent = trackEvent;
})();