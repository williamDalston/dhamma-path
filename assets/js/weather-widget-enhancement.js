/**
 * Enhanced Weather Widget - Universal Screen Compatibility
 * Provides perfect weather widget experience across all devices
 */

class WeatherWidgetEnhancement {
    constructor() {
        this.widget = null;
        this.isMinimized = false;
        this.isHidden = false;
        this.userPreferences = this.loadPreferences();
        this.init();
    }

    init() {
        console.log('🌤️ Initializing enhanced weather widget...');
        
        // Wait for weather widget to be created
        this.waitForWeatherWidget();
        
        // Setup responsive behavior
        this.setupResponsiveBehavior();
        
        // Setup user controls
        this.setupUserControls();
        
        // Setup accessibility
        this.setupAccessibility();
        
        console.log('✅ Enhanced weather widget ready');
    }

    waitForWeatherWidget() {
        const checkForWidget = () => {
            this.widget = document.getElementById('weather-widget');
            if (this.widget) {
                this.enhanceWidget();
            } else {
                setTimeout(checkForWidget, 100);
            }
        };
        checkForWidget();
    }

    enhanceWidget() {
        if (!this.widget) return;

        // Apply enhanced styling
        this.applyEnhancedStyling();
        
        // Add control buttons
        this.addControlButtons();
        
        // Setup drag functionality
        this.setupDragFunctionality();
        
        // Setup responsive positioning
        this.setupResponsivePositioning();
        
        // Setup visibility controls
        this.setupVisibilityControls();
    }

    applyEnhancedStyling() {
        const style = document.createElement('style');
        style.textContent = `
            /* Enhanced Weather Widget Styles */
            .weather-widget {
                position: fixed !important;
                z-index: 1000 !important;
                background: rgba(255, 255, 255, 0.98) !important;
                backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(139, 195, 74, 0.3) !important;
                border-radius: 16px !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08) !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                cursor: move !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                user-select: none !important;
            }
            
            .weather-widget:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1) !important;
            }
            
            .weather-widget.minimized {
                width: 60px !important;
                height: 60px !important;
                padding: 8px !important;
                overflow: hidden !important;
            }
            
            .weather-widget.hidden {
                opacity: 0 !important;
                transform: translateY(-20px) !important;
                pointer-events: none !important;
            }
            
            .weather-widget.compact {
                width: 200px !important;
                padding: 12px !important;
            }
            
            .weather-widget.full {
                width: 320px !important;
                padding: 16px !important;
            }
            
            /* Mobile optimizations */
            @media (max-width: 767px) {
                .weather-widget {
                    width: calc(100vw - 32px) !important;
                    max-width: 300px !important;
                    left: 16px !important;
                    right: 16px !important;
                    top: 80px !important;
                }
                
                .weather-widget.minimized {
                    width: 50px !important;
                    height: 50px !important;
                    left: auto !important;
                    right: 16px !important;
                }
            }
            
            /* Tablet optimizations */
            @media (min-width: 768px) and (max-width: 1023px) {
                .weather-widget {
                    width: 280px !important;
                    top: 80px !important;
                    right: 20px !important;
                }
                
                .weather-widget.minimized {
                    width: 60px !important;
                    height: 60px !important;
                }
            }
            
            /* Desktop optimizations */
            @media (min-width: 1024px) {
                .weather-widget {
                    width: 300px !important;
                    top: 80px !important;
                    right: 24px !important;
                }
                
                .weather-widget.minimized {
                    width: 60px !important;
                    height: 60px !important;
                }
            }
            
            /* Weather content styling */
            .weather-content {
                display: flex !important;
                flex-direction: column !important;
                height: 100% !important;
            }
            
            .weather-header {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                margin-bottom: 12px !important;
            }
            
            .weather-title {
                font-size: 14px !important;
                font-weight: 600 !important;
                color: #2d5016 !important;
                margin: 0 !important;
            }
            
            .weather-controls {
                display: flex !important;
                gap: 4px !important;
            }
            
            .weather-control-btn {
                width: 24px !important;
                height: 24px !important;
                border: none !important;
                background: rgba(139, 195, 74, 0.1) !important;
                border-radius: 6px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                font-size: 12px !important;
            }
            
            .weather-control-btn:hover {
                background: rgba(139, 195, 74, 0.2) !important;
                transform: scale(1.1) !important;
            }
            
            .weather-main {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                margin-bottom: 12px !important;
            }
            
            .weather-icon {
                font-size: 24px !important;
                line-height: 1 !important;
            }
            
            .weather-temp {
                font-size: 20px !important;
                font-weight: 700 !important;
                color: #2d5016 !important;
                margin: 0 !important;
            }
            
            .weather-details {
                font-size: 12px !important;
                color: #666 !important;
                line-height: 1.4 !important;
            }
            
            .weather-actions {
                display: flex !important;
                gap: 8px !important;
                flex-wrap: wrap !important;
            }
            
            .weather-action-btn {
                padding: 4px 8px !important;
                font-size: 11px !important;
                border: 1px solid rgba(139, 195, 74, 0.3) !important;
                background: transparent !important;
                color: #2d5016 !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }
            
            .weather-action-btn:hover {
                background: rgba(139, 195, 74, 0.1) !important;
                border-color: rgba(139, 195, 74, 0.5) !important;
            }
            
            /* Minimized state */
            .weather-widget.minimized .weather-content > *:not(.weather-main) {
                display: none !important;
            }
            
            .weather-widget.minimized .weather-main {
                justify-content: center !important;
                margin: 0 !important;
            }
            
            .weather-widget.minimized .weather-details {
                display: none !important;
            }
            
            /* High contrast mode */
            @media (prefers-contrast: high) {
                .weather-widget {
                    border-width: 2px !important;
                    background: white !important;
                }
                
                .weather-control-btn, .weather-action-btn {
                    border-width: 2px !important;
                }
            }
            
            /* Reduced motion */
            @media (prefers-reduced-motion: reduce) {
                .weather-widget, .weather-control-btn, .weather-action-btn {
                    transition: none !important;
                }
                
                .weather-widget:hover {
                    transform: none !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addControlButtons() {
        if (!this.widget) return;

        // Find or create control container
        let controlContainer = this.widget.querySelector('.weather-controls');
        if (!controlContainer) {
            const header = this.widget.querySelector('.weather-header');
            if (header) {
                controlContainer = document.createElement('div');
                controlContainer.className = 'weather-controls';
                header.appendChild(controlContainer);
            }
        }

        if (controlContainer) {
            // Clear existing controls
            controlContainer.innerHTML = '';

            // Minimize/Maximize button
            const minimizeBtn = document.createElement('button');
            minimizeBtn.className = 'weather-control-btn';
            minimizeBtn.innerHTML = this.isMinimized ? '⤢' : '⤡';
            minimizeBtn.title = this.isMinimized ? 'Expand weather' : 'Minimize weather';
            minimizeBtn.setAttribute('aria-label', this.isMinimized ? 'Expand weather widget' : 'Minimize weather widget');
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });

            // Hide/Show button
            const hideBtn = document.createElement('button');
            hideBtn.className = 'weather-control-btn';
            hideBtn.innerHTML = this.isHidden ? '👁️' : '👁️‍🗨️';
            hideBtn.title = this.isHidden ? 'Show weather' : 'Hide weather';
            hideBtn.setAttribute('aria-label', this.isHidden ? 'Show weather widget' : 'Hide weather widget');
            hideBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleVisibility();
            });

            // Settings button
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'weather-control-btn';
            settingsBtn.innerHTML = '⚙️';
            settingsBtn.title = 'Weather settings';
            settingsBtn.setAttribute('aria-label', 'Weather settings');
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showSettings();
            });

            controlContainer.appendChild(minimizeBtn);
            controlContainer.appendChild(hideBtn);
            controlContainer.appendChild(settingsBtn);
        }
    }

    setupDragFunctionality() {
        if (!this.widget) return;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const handleMouseDown = (e) => {
            if (e.target.closest('.weather-controls')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(this.widget.style.left) || 0;
            startTop = parseInt(this.widget.style.top) || 0;
            
            this.widget.style.cursor = 'grabbing';
            this.widget.style.transition = 'none';
            
            e.preventDefault();
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;
            
            // Constrain to viewport
            const maxLeft = window.innerWidth - this.widget.offsetWidth;
            const maxTop = window.innerHeight - this.widget.offsetHeight;
            
            this.widget.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            this.widget.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
            this.widget.style.right = 'auto';
        };

        const handleMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                this.widget.style.cursor = 'move';
                this.widget.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                this.snapToEdge();
                this.savePosition();
            }
        };

        this.widget.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        // Touch support
        this.widget.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            handleMouseDown(touch);
        });

        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            handleMouseMove(touch);
        });

        document.addEventListener('touchend', handleMouseUp);
    }

    setupResponsivePositioning() {
        const updatePosition = () => {
            if (!this.widget) return;

            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Load saved position or use default
            const savedPosition = this.loadPosition();
            if (savedPosition && this.isValidPosition(savedPosition, width, height)) {
                this.widget.style.left = savedPosition.left + 'px';
                this.widget.style.top = savedPosition.top + 'px';
                this.widget.style.right = 'auto';
            } else {
                this.setDefaultPosition();
            }
        };

        // Initial position
        updatePosition();

        // Update on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updatePosition, 250);
        });
    }

    setDefaultPosition() {
        if (!this.widget) return;

        const width = window.innerWidth;
        const isMobile = width < 768;
        const isTablet = width >= 768 && width < 1024;

        if (isMobile) {
            this.widget.style.left = '16px';
            this.widget.style.right = '16px';
            this.widget.style.top = '80px';
        } else if (isTablet) {
            this.widget.style.left = 'auto';
            this.widget.style.right = '20px';
            this.widget.style.top = '80px';
        } else {
            this.widget.style.left = 'auto';
            this.widget.style.right = '24px';
            this.widget.style.top = '80px';
        }
    }

    snapToEdge() {
        if (!this.widget) return;

        const rect = this.widget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const threshold = 50;

        // Snap to right edge if close
        if (rect.right > viewportWidth - threshold) {
            this.widget.style.left = 'auto';
            this.widget.style.right = '20px';
        }

        // Snap to top if close
        if (rect.top < threshold) {
            this.widget.style.top = '80px';
        }
    }

    setupVisibilityControls() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'w') {
                e.preventDefault();
                this.toggleVisibility();
            }
        });

        // Auto-hide on mobile scroll
        if (window.innerWidth < 768) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (!this.isHidden) {
                    this.widget.style.opacity = '0.3';
                    this.widget.style.transform = 'translateY(-10px)';
                    
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        this.widget.style.opacity = '1';
                        this.widget.style.transform = 'translateY(0)';
                    }, 500);
                }
            });
        }
    }

    setupAccessibility() {
        if (!this.widget) return;

        // Add ARIA attributes
        this.widget.setAttribute('role', 'complementary');
        this.widget.setAttribute('aria-label', 'Weather information');
        this.widget.setAttribute('aria-live', 'polite');

        // Add keyboard navigation
        this.widget.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleVisibility();
            }
        });

        // Make widget focusable
        this.widget.setAttribute('tabindex', '0');
    }

    toggleMinimize() {
        if (!this.widget) return;

        this.isMinimized = !this.isMinimized;
        this.widget.classList.toggle('minimized', this.isMinimized);
        
        // Update minimize button
        const minimizeBtn = this.widget.querySelector('.weather-control-btn');
        if (minimizeBtn) {
            minimizeBtn.innerHTML = this.isMinimized ? '⤢' : '⤡';
            minimizeBtn.title = this.isMinimized ? 'Expand weather' : 'Minimize weather';
        }

        this.savePreferences();
    }

    toggleVisibility() {
        if (!this.widget) return;

        this.isHidden = !this.isHidden;
        this.widget.classList.toggle('hidden', this.isHidden);
        
        // Update hide button
        const hideBtn = this.widget.querySelectorAll('.weather-control-btn')[1];
        if (hideBtn) {
            hideBtn.innerHTML = this.isHidden ? '👁️' : '👁️‍🗨️';
            hideBtn.title = this.isHidden ? 'Show weather' : 'Hide weather';
        }

        this.savePreferences();
    }

    showSettings() {
        // Create settings modal
        const modal = document.createElement('div');
        modal.className = 'weather-settings-modal';
        modal.innerHTML = `
            <div class="weather-settings-content">
                <h3>Weather Settings</h3>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" ${this.userPreferences.autoHide ? 'checked' : ''}>
                        Auto-hide on scroll (mobile)
                    </label>
                </div>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" ${this.userPreferences.compactMode ? 'checked' : ''}>
                        Compact mode
                    </label>
                </div>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" ${this.userPreferences.alwaysOnTop ? 'checked' : ''}>
                        Always on top
                    </label>
                </div>
                <div class="settings-actions">
                    <button class="settings-close">Close</button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .weather-settings-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            
            .weather-settings-content {
                background: white;
                padding: 24px;
                border-radius: 12px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 400px;
                width: 90%;
            }
            
            .settings-option {
                margin: 16px 0;
            }
            
            .settings-option label {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
            }
            
            .settings-actions {
                margin-top: 24px;
                text-align: right;
            }
            
            .settings-close {
                padding: 8px 16px;
                background: var(--sage-deep);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Close modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        modal.querySelector('.settings-close').addEventListener('click', () => {
            modal.remove();
        });
    }

    loadPreferences() {
        return JSON.parse(localStorage.getItem('weather-preferences') || '{}');
    }

    savePreferences() {
        const preferences = {
            ...this.userPreferences,
            minimized: this.isMinimized,
            hidden: this.isHidden
        };
        localStorage.setItem('weather-preferences', JSON.stringify(preferences));
    }

    loadPosition() {
        return JSON.parse(localStorage.getItem('weather-position') || 'null');
    }

    savePosition() {
        if (!this.widget) return;
        
        const rect = this.widget.getBoundingClientRect();
        const position = {
            left: rect.left,
            top: rect.top
        };
        localStorage.setItem('weather-position', JSON.stringify(position));
    }

    isValidPosition(position, width, height) {
        return position.left >= 0 && 
               position.top >= 0 && 
               position.left < width && 
               position.top < height;
    }

    setupResponsiveBehavior() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setDefaultPosition();
            }, 500);
        });

        // Handle viewport changes
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleViewportChange();
            }, 250);
        });
    }

    handleViewportChange() {
        if (!this.widget) return;

        const width = window.innerWidth;
        const isMobile = width < 768;

        // Update mobile-specific behavior
        if (isMobile) {
            this.widget.style.width = 'calc(100vw - 32px)';
            this.widget.style.maxWidth = '300px';
        } else {
            this.widget.style.width = '';
            this.widget.style.maxWidth = '';
        }

        // Update position if needed
        this.snapToEdge();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WeatherWidgetEnhancement();
    });
} else {
    new WeatherWidgetEnhancement();
}

// Make it globally available
window.WeatherWidgetEnhancement = WeatherWidgetEnhancement;
