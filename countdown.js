// Countdown Timer
document.addEventListener('DOMContentLoaded', function() {
    // Set the countdown to 24 hours from now
    let countdownDate = new Date();
    countdownDate.setHours(countdownDate.getHours() + 24);
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get current date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the countdown date
        const distance = countdownDate - now;
        
        // Time calculations for hours, minutes and seconds
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the result
        const hoursElement = document.getElementById("countdown-hours");
        const minutesElement = document.getElementById("countdown-minutes");
        const secondsElement = document.getElementById("countdown-seconds");
        
        if (hoursElement && minutesElement && secondsElement) {
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
        
        // If the countdown is finished, reset it
        if (distance < 0) {
            clearInterval(countdownTimer);
            
            // Reset to 24 hours
            const newCountdownDate = new Date();
            newCountdownDate.setHours(newCountdownDate.getHours() + 24);
            countdownDate = newCountdownDate;
        }
    }, 1000);
});