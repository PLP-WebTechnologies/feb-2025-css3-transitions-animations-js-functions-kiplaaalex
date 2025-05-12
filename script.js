document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const animationTarget = document.getElementById('animationTarget');
    const animationType = document.getElementById('animationType');
    const animationSpeed = document.getElementById('animationSpeed');
    const animationColor = document.getElementById('animationColor');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const savePreset = document.getElementById('savePreset');
    const statusIndicator = document.getElementById('statusIndicator');
    const particleContainer = document.getElementById('particleContainer');

    // Current animation state
    let currentAnimation = 'pulse';
    let currentSpeed = 1;
    let currentColor = '#3498db';
    let particlesActive = false;
    let particles = [];

    // Initialize
    applyAnimation();
    setupEventListeners();

    function setupEventListeners() {
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);

        // Animation controls
        animationType.addEventListener('change', (e) => {
            currentAnimation = e.target.value;
            applyAnimation();
        });

        animationSpeed.addEventListener('input', (e) => {
            currentSpeed = parseFloat(e.target.value);
            applyAnimation();
        });

        animationColor.addEventListener('input', (e) => {
            currentColor = e.target.value;
            applyAnimation();
        });

        // Preset buttons
        presetButtons.forEach(button => {
            button.addEventListener('click', applyPreset);
        });

        // Save preset
        savePreset.addEventListener('click', saveCurrentPreset);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
    }

    function applyAnimation() {
        // Reset any existing animations
        animationTarget.className = 'animation-target';
        animationTarget.style.backgroundColor = currentColor;
        animationTarget.style.setProperty('--speed', currentSpeed);

        // Stop particles if they're active and we're not in particles mode
        if (particlesActive && currentAnimation !== 'particles') {
            stopParticles();
        }

        // Apply new animation
        if (currentAnimation === 'particles') {
            startParticles();
        } else {
            animationTarget.classList.add(currentAnimation);
        }

        // Update inner shape color
        const innerShape = document.querySelector('.inner-shape');
        if (innerShape) {
            innerShape.style.backgroundColor = `${currentColor}40`; // Add alpha
        }
    }

    function startParticles() {
        particlesActive = true;
        particleContainer.innerHTML = '';
        particles = [];

        // Create particles
        for (let i = 0; i < 50; i++) {
            createParticle();
        }

        // Animation loop
        function animateParticles() {
            if (!particlesActive) return;

            particles.forEach(particle => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Apply gravity
                particle.vy += 0.05;

                // Bounce off edges
                if (particle.x < 0 || particle.x > particleContainer.clientWidth) {
                    particle.vx *= -0.8;
                }
                if (particle.y > particleContainer.clientHeight) {
                    particle.vy *= -0.8;
                    particle.y = particleContainer.clientHeight;
                }

                // Apply element position
                particle.element.style.left = `${particle.x}px`;
                particle.element.style.top = `${particle.y}px`;
                particle.element.style.opacity = particle.opacity;
                particle.element.style.width = `${particle.size}px`;
                particle.element.style.height = `${particle.size}px`;
                particle.element.style.backgroundColor = currentColor;
            });

            // Remove particles that are too small
            particles = particles.filter(p => p.size > 0.5);

            // Add new particles to replace removed ones
            while (particles.length < 50) {
                createParticle();
            }

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particleContainer.appendChild(particle);

        const particleObj = {
            element: particle,
            x: Math.random() * particleContainer.clientWidth,
            y: Math.random() * particleContainer.clientHeight,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 10 + 5,
            opacity: Math.random() * 0.5 + 0.5
        };

        particles.push(particleObj);
        return particleObj;
    }

    function stopParticles() {
        particlesActive = false;
        particleContainer.innerHTML = '';
        particles = [];
    }

    function applyPreset(e) {
        const preset = e.target.dataset.preset;
        
        switch(preset) {
            case 'default':
                currentAnimation = 'pulse';
                currentSpeed = 1;
                currentColor = '#3498db';
                break;
            case 'energetic':
                currentAnimation = 'flip';
                currentSpeed = 2;
                currentColor = '#e74c3c';
                break;
            case 'calm':
                currentAnimation = 'wave';
                currentSpeed = 0.7;
                currentColor = '#2ecc71';
                break;
            case 'custom1':
                currentAnimation = 'morph';
                currentSpeed = 1.5;
                currentColor = '#9b59b6';
                break;
        }

        // Update UI to match
        animationType.value = currentAnimation;
        animationSpeed.value = currentSpeed;
        animationColor.value = currentColor;

        applyAnimation();
        showStatus('Preset applied');
    }

    function saveCurrentPreset() {
        // In a real app, you would save to localStorage or a database
        showStatus('Preset saved (simulated)');
    }

    function showStatus(message) {
        statusIndicator.title = message;
        statusIndicator.style.backgroundColor = '#f1c40f';
        setTimeout(() => {
            statusIndicator.style.backgroundColor = '#2ecc71';
        }, 2000);
    }
});