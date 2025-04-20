document.addEventListener('DOMContentLoaded', function () {
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const bgMusic = document.getElementById('bg-music');
    const greeting = document.getElementById('greeting');
    const hour = new Date().getHours();
    greeting.textContent = hour >= 3 && hour < 12 ? "Good Morning ☀️" : 
                          (hour >= 12 && hour < 18) ? "Good Afternoon 🌤️" : "Good Evening 🌙";

    // Fix overflow for projects page
    if (window.location.pathname.includes('projects.html')) {
        document.body.classList.add('projects-page');
    }

    // Get background image if it exists on the page
    const bgImage = document.querySelector('.main-image');
    if (bgImage) {
        if (hour >= 3 && hour < 12) {
            bgImage.src = "images/bg4.jpeg";
        } else {
            bgImage.src = "images/bg3.jpeg";
        }
    }

    // Check localStorage for music state
    const musicPlaying = localStorage.getItem('musicPlaying') !== 'false'; // Default to true if not set

    // Update icon based on stored state
    musicIcon.src = musicPlaying ? "images/music.png" : "images/musicoff.png";

    // Try to play if it should be playing
    if (musicPlaying) {
        bgMusic.play().catch(error => {
            // If autoplay fails due to browser policy
            localStorage.setItem('musicPlaying', 'false');
            musicIcon.src = "images/musicoff.png";
        });
    } else {
        bgMusic.pause();
    }

    // Add event listener for music toggle button
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicIcon.src = "images/music.png";
            localStorage.setItem('musicPlaying', 'true');
        } else {
            bgMusic.pause();
            musicIcon.src = "images/musicoff.png";
            localStorage.setItem('musicPlaying', 'false');
        }
    });

    // Set current time from localStorage if available
    const savedTime = localStorage.getItem('musicCurrentTime');
    if (savedTime) {
        bgMusic.currentTime = parseFloat(savedTime);
    }

    // Save current playback time periodically
    setInterval(() => {
        if (!bgMusic.paused) {
            localStorage.setItem('musicCurrentTime', bgMusic.currentTime);
        }
    }, 1000);

    // Navigate to about.html when Explore button is clicked
    const scrollButton = document.getElementById('scroll-button');
    if (scrollButton) {
        scrollButton.addEventListener('click', () => {
            window.location.href = 'about.html';
        });
    }

    // Handle page unload - save the current state
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('musicCurrentTime', bgMusic.currentTime);
        localStorage.setItem('musicPlaying', !bgMusic.paused);
    });

    // Handle navbar visibility on scroll for projects page
    if (window.location.pathname.includes('projects.html')) {
        const navbar = document.querySelector('nav');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Always show navbar when scrolling up
            if (scrollTop < lastScrollTop) {
                navbar.style.top = '0';
            } else {
                // Only hide navbar when scrolling down significantly
                if (scrollTop > 150) {
                    navbar.style.top = '-100px';
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }
});