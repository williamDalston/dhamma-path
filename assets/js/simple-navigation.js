/**
 * Simple Navigation System
 * Clean, reliable navigation without complex template loading
 */

class SimpleNavigation {
    constructor() {
        this.currentPage = 'home';
        this.isMobileMenuOpen = false;
        
        this.init();
    }

    init() {
        console.log('🚀 Initializing Simple Navigation...');
        this.setupNavigationLinks();
        this.setupMobileMenu();
        this.initializePageFeatures('home');
        console.log('✅ Simple Navigation initialized');
    }

    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.main-nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu) return;

        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.isMobileMenuOpen) {
            mobileMenu.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && this.isMobileMenuOpen) {
            mobileMenu.classList.add('hidden');
            this.isMobileMenuOpen = false;
        }
    }

    navigateToPage(pageName) {
        console.log('🔄 Navigating to:', pageName);
        
        this.currentPage = pageName;
        this.closeMobileMenu();
        
        // Hide all page sections
        this.hideAllPages();
        
        // Show the requested page
        this.showPage(pageName);
        
        // Initialize page-specific functionality
        this.initializePageFeatures(pageName);
    }

    hideAllPages() {
        const pageSections = document.querySelectorAll('[data-page-section]');
        pageSections.forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('active');
        });
    }

    showPage(pageName) {
        const pageSection = document.getElementById(`${pageName}-page`);
        if (pageSection) {
            pageSection.classList.remove('hidden');
            pageSection.classList.add('active');
        } else {
            // Fallback: show home page
            const homeSection = document.getElementById('home-page');
            if (homeSection) {
                homeSection.classList.remove('hidden');
                homeSection.classList.add('active');
            }
        }
    }

    initializePageFeatures(pageName) {
        console.log(`🎯 Initializing ${pageName} page features...`);
        
        switch (pageName) {
            case 'timer':
                this.initializeTimerPage();
                break;
            case 'journal':
                this.initializeJournalPage();
                break;
            case 'workout':
                this.initializeWorkoutPage();
                break;
            case 'clarity':
                this.initializeClarityPage();
                break;
            case 'gratitude':
                this.initializeGratitudePage();
                break;
        }

        // Setup quick action cards
        this.setupQuickActionCards();
    }

    setupQuickActionCards() {
        const quickActionCards = document.querySelectorAll('.quick-action-card');
        quickActionCards.forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                if (action) {
                    this.navigateToPage(action);
                }
            });
        });
    }

    initializeTimerPage() {
        setTimeout(() => {
            if (window.SimpleTimer) {
                // Clean up any existing timer
                if (window.simpleTimer) {
                    window.simpleTimer.destroy();
                }
                window.simpleTimer = new window.SimpleTimer('timer-container');
                console.log('✅ Simple timer initialized');
            }
        }, 100);
    }

    initializeJournalPage() {
        const saveBtn = document.getElementById('journal-save-btn');
        const textarea = document.getElementById('journal-textarea');
        
        if (saveBtn && textarea) {
            saveBtn.addEventListener('click', () => {
                const content = textarea.value.trim();
                if (content) {
                    const entry = {
                        content,
                        timestamp: new Date().toISOString()
                    };
                    
                    const entries = JSON.parse(localStorage.getItem('journal-entries') || '[]');
                    entries.push(entry);
                    localStorage.setItem('journal-entries', JSON.stringify(entries));
                    
                    this.showNotification('Journal entry saved!', 'success');
                    textarea.value = '';
                }
            });
        }
    }

    initializeWorkoutPage() {
        // Basic workout functionality
        console.log('💪 Workout page initialized');
    }

    initializeClarityPage() {
        // Basic clarity functionality
        console.log('🎤 Clarity page initialized');
    }

    initializeGratitudePage() {
        const saveBtn = document.querySelector('#gratitude-page button');
        const textarea = document.querySelector('#gratitude-page textarea');
        
        if (saveBtn && textarea) {
            saveBtn.addEventListener('click', () => {
                const content = textarea.value.trim();
                if (content) {
                    const entry = {
                        content,
                        timestamp: new Date().toISOString()
                    };
                    
                    const entries = JSON.parse(localStorage.getItem('gratitude-entries') || '[]');
                    entries.push(entry);
                    localStorage.setItem('gratitude-entries', JSON.stringify(entries));
                    
                    this.showNotification('Gratitude entry saved!', 'success');
                    textarea.value = '';
                }
            });
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Export for global use
window.SimpleNavigation = SimpleNavigation;
