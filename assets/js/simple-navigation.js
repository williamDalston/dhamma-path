/**
 * Simple Navigation System
 * Clean, reliable page navigation without complexity
 */

class SimpleNavigation {
    constructor() {
        this.currentPage = 'home';
        this.pages = {
            home: document.getElementById('home-page'),
            timer: document.getElementById('timer-page'),
            journal: document.getElementById('journal-page'),
            workout: document.getElementById('workout-page'),
            clarity: document.getElementById('clarity-page'),
            gratitude: document.getElementById('gratitude-page'),
            wisdom: document.getElementById('wisdom-page'),
            analytics: document.getElementById('analytics-page'),
            goals: document.getElementById('goals-page')
        };
        
        this.init();
    }

    init() {
        this.setupNavigationLinks();
        this.setupMobileMenu();
        this.showPage('home');
    }

    setupNavigationLinks() {
        // Desktop navigation
        const navLinks = document.querySelectorAll('.main-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupMobileMenu() {
        const menuButton = document.getElementById('mobile-menu-button');
        const menuClose = document.getElementById('mobile-menu-close');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuButton) {
            menuButton.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        if (menuClose) {
            menuClose.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileMenu && !mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    showPage(pageName) {
        // Hide all pages
        Object.values(this.pages).forEach(page => {
            if (page) {
                page.style.display = 'none';
            }
        });

        // Show the requested page
        const targetPage = this.pages[pageName];
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = pageName;
        } else {
            console.warn(`Page '${pageName}' not found`);
        }

        // Update active navigation state
        this.updateActiveNav(pageName);
    }

    updateActiveNav(pageName) {
        const navLinks = document.querySelectorAll('.main-nav-link');
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuButton = document.getElementById('mobile-menu-button');
        
        if (mobileMenu && menuButton) {
            const isOpen = !mobileMenu.classList.contains('hidden');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    openMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuButton = document.getElementById('mobile-menu-button');
        
        if (mobileMenu && menuButton) {
            mobileMenu.classList.remove('hidden');
            menuButton.setAttribute('aria-expanded', 'true');
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuButton = document.getElementById('mobile-menu-button');
        
        if (mobileMenu && menuButton) {
            mobileMenu.classList.add('hidden');
            menuButton.setAttribute('aria-expanded', 'false');
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }
}

// Global navigation instance
window.simpleNavigation = new SimpleNavigation();
