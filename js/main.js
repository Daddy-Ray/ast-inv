document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const header = document.querySelector('header');
    const updateHeader = () => {
        if (window.scrollY > 20) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.05)';
            header.style.padding = '1rem 5%';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            header.style.boxShadow = 'none';
            header.style.padding = '2rem 5%';
        }
    };

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Initial check

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate. Note: Some pages may not have all elements.
    const animateElements = document.querySelectorAll('.service-card, .stat-item, .about-text, .hero-content, .contact-item');
    
    // Add base styles for animation via JS or use CSS class
    // We check if style already exists to avoid duplication if script runs multiple times (unlikely here but good practice)
    if (!document.getElementById('animation-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'animation-styles';
        styleSheet.innerText = `
            .service-card, .stat-item, .about-text, .hero-content, .contact-item {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(styleSheet);
    }

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Mobile menu toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            if (!document.getElementById('mobile-nav-style')) {
                const mobileNavStyle = document.createElement('style');
                mobileNavStyle.id = 'mobile-nav-style';
                mobileNavStyle.innerText = `
                    @media (max-width: 768px) {
                        nav.active {
                            display: block !important;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            width: 100%;
                            background: white;
                            padding: 2rem;
                            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        }
                        nav.active ul {
                            flex-direction: column;
                            gap: 1.5rem;
                        }
                    }
                `;
                document.head.appendChild(mobileNavStyle);
            }
        });
    }
});
