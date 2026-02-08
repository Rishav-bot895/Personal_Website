// Smooth scroll for navigation with offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default for internal links (not external project links)
        if (href.startsWith('#') && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Close mobile menu if open
                closeMobileMenu();
                
                // Smooth scroll to target
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu function
function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking outside
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu();
    }
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Active navigation link based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-link');

function updateActiveLink() {
    const scrollPosition = window.pageYOffset + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements with animation classes
const animatedElements = document.querySelectorAll(
    '.timeline-item, .project-card, .skill-category, .cert-card, .contact-link-card, .contact-cta'
);

animatedElements.forEach((el, index) => {
    // Reduce staggered delay for snappier feel
    el.style.transitionDelay = `${index * 0.05}s`;
    observer.observe(el);
});

// Parallax effect for hero section (reduced effect for snappier feel)
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight * 0.7);
    }
});

// Enhanced hover effect for project cards
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Smooth reveal for timeline items
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
        }
    });
}, {
    threshold: 0.2
});

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Add glow effect to buttons and tags on hover
const glowElements = document.querySelectorAll('.resume-btn, .tech-tag, .skill-tag');
glowElements.forEach(el => {
    el.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.5)';
    });
    
    el.addEventListener('mouseleave', function() {
        if (this.classList.contains('resume-btn')) {
            this.style.boxShadow = '';
        } else {
            this.style.boxShadow = 'none';
        }
    });
});

// Performance: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedUpdateActiveLink = debounce(updateActiveLink, 50);
window.addEventListener('scroll', debouncedUpdateActiveLink);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations faster
    setTimeout(() => {
        const firstSection = document.querySelector('.section');
        if (firstSection) {
            const firstElements = firstSection.querySelectorAll('.timeline-item, .project-card');
            firstElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, index * 60);
            });
        }
    }, 300);
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Add focus styles for accessibility
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--accent)';
        this.style.outlineOffset = '4px';
    });
    
    el.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Prevent project cards from scrolling when clicked (they're just placeholders)
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Only prevent default if the href is exactly "#"
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
        }
    });
});

console.log('Portfolio initialized successfully! 🚀');