/**
 * Navigation Module
 * Handles page navigation and mobile menu functionality
 */

class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.isMobileMenuOpen = false;
        this.init();
    }

    init() {
        console.log('🚀 Setting up navigation system...');
        this.setupNavigationLinks();
        this.setupMobileMenu();
        console.log('✅ Navigation system initialized');
    }

    setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.main-nav-link');
        console.log('📋 Found navigation links:', navLinks.length);
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                console.log('🔗 Navigation clicked:', page);
                this.navigateToPage(page);
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            console.log('🍔 Setting up mobile menu...');
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
            console.log('📱 Mobile menu opened');
        } else {
            mobileMenu.classList.add('hidden');
            console.log('📱 Mobile menu closed');
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && this.isMobileMenuOpen) {
            mobileMenu.classList.add('hidden');
            this.isMobileMenuOpen = false;
            console.log('📱 Mobile menu closed');
        }
    }

    navigateToPage(pageName) {
        console.log('🔄 Navigating to page:', pageName);
        
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('❌ Main content not found');
            return;
        }

        this.currentPage = pageName;
        
        // Close mobile menu when navigating
        this.closeMobileMenu();

        // Load page content
        const pageContent = this.getPageContent(pageName);
        mainContent.innerHTML = pageContent;
        
        console.log('✅ Page loaded:', pageName);

        // Initialize page-specific functionality
        this.initializePageFeatures(pageName);
    }

    getPageContent(pageName) {
        const pages = {
            'home': this.getHomePageContent(),
            'timer': this.getTimerPageContent(),
            'journal': this.getJournalPageContent(),
            'workout': this.getWorkoutPageContent(),
            'interview': this.getInterviewPageContent()
        };

        return pages[pageName] || pages['home'];
    }

    getHomePageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">Welcome to The Dhamma Path</h1>
                <p class="text-xl text-charcoal/70 mb-8">Transform your mornings, transform your life</p>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    <div class="bg-white/80 rounded-xl p-6 shadow-lg card-link">
                        <div class="text-4xl mb-4">🧘</div>
                        <h3 class="text-xl font-semibold mb-2">Meditate</h3>
                        <p class="text-charcoal/70">Start your day with mindfulness</p>
                    </div>
                    <div class="bg-white/80 rounded-xl p-6 shadow-lg card-link">
                        <div class="text-4xl mb-4">✍️</div>
                        <h3 class="text-xl font-semibold mb-2">Journal</h3>
                        <p class="text-charcoal/70">Reflect and grow</p>
                    </div>
                    <div class="bg-white/80 rounded-xl p-6 shadow-lg card-link">
                        <div class="text-4xl mb-4">💪</div>
                        <h3 class="text-xl font-semibold mb-2">Exercise</h3>
                        <p class="text-charcoal/70">7-minute workout</p>
                    </div>
                    <div class="bg-white/80 rounded-xl p-6 shadow-lg card-link">
                        <div class="text-4xl mb-4">🎤</div>
                        <h3 class="text-xl font-semibold mb-2">Practice</h3>
                        <p class="text-charcoal/70">Build confidence</p>
                    </div>
                </div>
            </div>
        `;
    }

    getTimerPageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">🧘 Meditation Timer</h1>
                <div class="bg-white/80 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                    <div id="timer-display" class="text-6xl font-bold text-forest-green mb-6">10:00</div>
                    <div class="mb-6">
                        <select id="timer-duration" class="w-full px-4 py-3 border-2 border-forest-green/30 rounded-xl">
                            <option value="300">5 minutes</option>
                            <option value="600" selected>10 minutes</option>
                            <option value="900">15 minutes</option>
                            <option value="1200">20 minutes</option>
                        </select>
                    </div>
                    <div class="flex gap-4">
                        <button id="timer-start-btn" class="flex-1 px-6 py-3 bg-forest-green text-white rounded-xl font-semibold">Start</button>
                        <button id="timer-pause-btn" class="flex-1 px-6 py-3 bg-earth-gold text-white rounded-xl font-semibold hidden">Pause</button>
                        <button id="timer-reset-btn" class="flex-1 px-6 py-3 bg-charcoal/70 text-white rounded-xl font-semibold">Reset</button>
                    </div>
                    <div id="timer-status" class="mt-4 text-charcoal/70">Ready to begin</div>
                </div>
            </div>
        `;
    }

    getJournalPageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">✍️ Journal</h1>
                <div class="bg-white/80 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
                    <textarea id="journal-textarea" class="w-full h-64 p-4 border-2 border-forest-green/30 rounded-xl resize-none" placeholder="What are you grateful for today? What did you learn? How are you feeling?"></textarea>
                    <button id="journal-save-btn" class="mt-4 px-6 py-3 bg-forest-green text-white rounded-xl font-semibold">Save Entry</button>
                </div>
            </div>
        `;
    }

    getWorkoutPageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">💪 7-Minute Workout</h1>
                <div class="bg-white/80 rounded-2xl p-8 shadow-xl max-w-md mx-auto">
                    <div class="text-6xl mb-6">🏃‍♂️</div>
                    <h2 class="text-2xl font-semibold mb-4">Jumping Jacks</h2>
                    <div class="text-4xl font-bold text-forest-green mb-6">30</div>
                    <div class="flex gap-4">
                        <button id="workout-start-btn" class="flex-1 px-6 py-3 bg-forest-green text-white rounded-xl font-semibold">Start</button>
                        <button id="workout-pause-btn" class="flex-1 px-6 py-3 bg-earth-gold text-white rounded-xl font-semibold">Pause</button>
                    </div>
                </div>
            </div>
        `;
    }

    getInterviewPageContent() {
        return `
            <div class="text-center py-16">
                <h1 class="text-4xl font-bold text-charcoal mb-8">🎤 Interview Practice</h1>
                <div class="bg-white/80 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
                    <h2 class="text-2xl font-semibold mb-4">Tell me about yourself</h2>
                    <p class="text-charcoal/70 mb-6">Practice your elevator pitch and build confidence</p>
                    <button id="interview-start-btn" class="px-6 py-3 bg-forest-green text-white rounded-xl font-semibold">Start Practice</button>
                </div>
            </div>
        `;
    }

    initializePageFeatures(pageName) {
        // Initialize page-specific functionality
        switch (pageName) {
            case 'timer':
                setTimeout(() => {
                    if (window.MeditationTimer) {
                        window.meditationTimer = new window.MeditationTimer();
                    }
                }, 100);
                break;
            case 'journal':
                this.initializeJournal();
                break;
            case 'workout':
                this.initializeWorkout();
                break;
            case 'interview':
                this.initializeInterview();
                break;
        }
    }

    initializeJournal() {
        const saveBtn = document.getElementById('journal-save-btn');
        const textarea = document.getElementById('journal-textarea');
        
        if (saveBtn && textarea) {
            saveBtn.addEventListener('click', () => {
                const content = textarea.value;
                if (content.trim()) {
                    localStorage.setItem('journal-entry-' + Date.now(), content);
                    alert('Journal entry saved!');
                    textarea.value = '';
                }
            });
        }
    }

    initializeWorkout() {
        // Basic workout functionality
        console.log('💪 Workout page initialized');
    }

    initializeInterview() {
        // Basic interview functionality
        console.log('🎤 Interview page initialized');
    }
}

// Export for use in other modules
window.NavigationManager = NavigationManager;
