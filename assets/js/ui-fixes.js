/**
 * UI Fixes and Improvements
 * Addresses critical UI/UX issues reported by user
 */

class UIFixes {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔧 Initializing world-class UI fixes...');
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
        
        // Error handling
        this.setupErrorHandling();
        
        // Fix weather widget positioning and visibility
        this.fixWeatherWidget();
        
        // Fix button functionality
        this.fixButtonFunctionality();
        
        // Fix navigation issues
        this.fixNavigationIssues();
        
        // Fix color consistency
        this.fixColorConsistency();
        
        // Fix scrolling and layout issues
        this.fixLayoutIssues();
        
        // Add accessibility enhancements
        this.addAccessibilityEnhancements();
        
        // Add user preferences
        this.setupUserPreferences();
        
        console.log('✅ World-class UI fixes initialized');
    }

    setupPerformanceMonitoring() {
        // Monitor UI performance
        this.performanceMetrics = {
            startTime: performance.now(),
            interactions: 0,
            errors: 0
        };

        // Track user interactions
        document.addEventListener('click', () => {
            this.performanceMetrics.interactions++;
        });

        // Monitor memory usage
        setInterval(() => {
            if (performance.memory) {
                const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
                if (memoryUsage > 100) {
                    console.warn('⚠️ High memory usage detected:', memoryUsage.toFixed(2), 'MB');
                }
            }
        }, 10000);

        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('⚠️ Long task detected:', entry.duration.toFixed(2), 'ms');
                    }
                }
            });
            observer.observe({ entryTypes: ['longtask'] });
        }
    }

    setupErrorHandling() {
        // Enhanced error handling
        window.addEventListener('error', (e) => {
            this.performanceMetrics.errors++;
            console.error('🚨 UI Error:', e.error);
            
            // Show user-friendly error message
            this.showErrorNotification('Something went wrong. Please try again.');
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.performanceMetrics.errors++;
            console.error('🚨 Unhandled Promise Rejection:', e.reason);
            
            // Show user-friendly error message
            this.showErrorNotification('A network error occurred. Please check your connection.');
        });
    }

    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-message">${message}</span>
                <button class="error-close">×</button>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .error-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            }
            
            .error-content {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .error-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 8px;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button
        notification.querySelector('.error-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    addAccessibilityEnhancements() {
        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 2px solid var(--sage-deep);
                outline-offset: 2px;
            }
            
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border: 0;
            }
            
            @media (prefers-reduced-motion: reduce) {
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Add ARIA labels to icon buttons
        const iconButtons = document.querySelectorAll('button:not([aria-label]):not([title])');
        iconButtons.forEach(button => {
            const text = button.textContent.trim();
            if (text.length === 0 || text.length > 20) {
                button.setAttribute('aria-label', 'Button');
            }
        });

        // Add skip links
        this.addSkipLinks();
    }

    addSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--sage-deep);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    setupUserPreferences() {
        // Load user preferences
        const preferences = JSON.parse(localStorage.getItem('ui-preferences') || '{}');
        
        // Apply preferences
        if (preferences.reducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        }
        
        if (preferences.highContrast) {
            document.documentElement.classList.add('high-contrast');
        }
        
        // Save preferences
        this.saveUserPreferences = (newPrefs) => {
            const updated = { ...preferences, ...newPrefs };
            localStorage.setItem('ui-preferences', JSON.stringify(updated));
        };
    }

    fixWeatherWidget() {
        // Ensure weather widget doesn't cover content
        const weatherWidget = document.getElementById('weather-widget');
        if (weatherWidget) {
            // Enhanced positioning with responsive design
            this.applyWeatherWidgetStyles(weatherWidget);
            
            // Add minimize button if not present
            this.addMinimizeButton(weatherWidget);
            
            // Add drag functionality for better UX
            this.addDragFunctionality(weatherWidget);
            
            // Add auto-hide on scroll for mobile
            this.addAutoHideOnScroll(weatherWidget);
            
            // Add keyboard shortcuts
            this.addWeatherKeyboardShortcuts(weatherWidget);
        }
    }

    applyWeatherWidgetStyles(widget) {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isSmallMobile = window.innerWidth < 480;
        
        // Enhanced responsive positioning
        if (isSmallMobile) {
            widget.style.position = 'fixed';
            widget.style.top = '60px';
            widget.style.right = '8px';
            widget.style.left = '8px';
            widget.style.maxWidth = 'none';
            widget.style.width = 'auto';
        } else if (isMobile) {
            widget.style.position = 'fixed';
            widget.style.top = '70px';
            widget.style.right = '12px';
            widget.style.left = '12px';
            widget.style.maxWidth = '400px';
            widget.style.margin = '0 auto';
        } else if (isTablet) {
            widget.style.position = 'fixed';
            widget.style.top = '80px';
            widget.style.right = '16px';
            widget.style.maxWidth = '380px';
        } else {
            widget.style.position = 'fixed';
            widget.style.top = '80px';
            widget.style.right = '20px';
            widget.style.maxWidth = '320px';
        }
        
        // Enhanced styling with better visibility controls
        widget.style.zIndex = '1000';
        widget.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        widget.style.backdropFilter = 'blur(20px)';
        widget.style.border = '1px solid rgba(139, 195, 74, 0.3)';
        widget.style.borderRadius = '20px';
        widget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
        widget.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        widget.style.cursor = 'move';
        
        // Responsive padding
        if (isSmallMobile) {
            widget.style.padding = '12px';
        } else if (isMobile) {
            widget.style.padding = '16px';
        } else {
            widget.style.padding = '20px';
        }
        
        // Add hover effects (only on desktop)
        if (!isMobile) {
            widget.addEventListener('mouseenter', () => {
                if (!widget.classList.contains('weather-hidden')) {
                    widget.style.transform = 'translateY(-2px)';
                    widget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1)';
                }
            });
            
            widget.addEventListener('mouseleave', () => {
                widget.style.transform = 'translateY(0)';
                widget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)';
            });
        }
    }

    addDragFunctionality(widget) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        const handleMouseDown = (e) => {
            if (e.target.closest('.weather-actions')) return; // Don't drag when clicking buttons
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(widget.style.left) || 0;
            startTop = parseInt(widget.style.top) || 0;
            
            widget.style.cursor = 'grabbing';
            widget.style.transition = 'none';
            
            e.preventDefault();
        };
        
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;
            
            // Constrain to viewport
            const maxLeft = window.innerWidth - widget.offsetWidth;
            const maxTop = window.innerHeight - widget.offsetHeight;
            
            widget.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + 'px';
            widget.style.top = Math.max(0, Math.min(newTop, maxTop)) + 'px';
            widget.style.right = 'auto';
        };
        
        const handleMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                widget.style.cursor = 'move';
                widget.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Snap to edges
                this.snapToEdge(widget);
            }
        };
        
        widget.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        // Touch support for mobile
        widget.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            handleMouseDown(touch);
        });
        
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            handleMouseMove(touch);
        });
        
        document.addEventListener('touchend', handleMouseUp);
    }

    snapToEdge(widget) {
        const rect = widget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Snap to right edge if close
        if (rect.right > viewportWidth - 50) {
            widget.style.left = 'auto';
            widget.style.right = '20px';
        }
        
        // Snap to top if close
        if (rect.top < 50) {
            widget.style.top = '80px';
        }
    }

    addAutoHideOnScroll(widget) {
        if (window.innerWidth < 768) {
            let scrollTimeout;
            
            window.addEventListener('scroll', () => {
                widget.style.opacity = '0.3';
                widget.style.transform = 'translateY(-10px)';
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    widget.style.opacity = '1';
                    widget.style.transform = 'translateY(0)';
                }, 500);
            });
        }
    }

    addWeatherKeyboardShortcuts(widget) {
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'w') {
                e.preventDefault();
                this.toggleWeatherWidget(widget);
            }
        });
        
        // Add tooltip for keyboard shortcut
        widget.title = 'Drag to move • Alt+W to toggle • Click minimize to shrink';
    }

    addMinimizeButton(widget) {
        const existingMinimize = widget.querySelector('.weather-minimize-btn');
        if (!existingMinimize) {
            const actionsDiv = widget.querySelector('.weather-actions');
            if (actionsDiv) {
                const minimizeBtn = document.createElement('button');
                minimizeBtn.className = 'weather-minimize-btn text-xs text-sage-deep hover:text-forest-deep transition-colors px-2 py-1 rounded-md hover:bg-sage-pale/30';
                minimizeBtn.innerHTML = '➖ Minimize';
                minimizeBtn.addEventListener('click', () => {
                    this.toggleWeatherWidget(widget);
                });
                actionsDiv.appendChild(minimizeBtn);
            }
        }
    }

    toggleWeatherWidget(widget) {
        const isMinimized = widget.classList.contains('minimized');
        const minimizeBtn = widget.querySelector('.weather-minimize-btn');
        
        if (isMinimized) {
            // Restore full widget
            widget.classList.remove('minimized');
            widget.style.height = 'auto';
            widget.style.overflow = 'visible';
            if (minimizeBtn) {
                minimizeBtn.textContent = '➖ Minimize';
            }
        } else {
            // Minimize to just temperature
            widget.classList.add('minimized');
            widget.style.height = '60px';
            widget.style.overflow = 'hidden';
            if (minimizeBtn) {
                minimizeBtn.textContent = '➕ Expand';
            }
        }
    }

    fixButtonFunctionality() {
        // Fix start breathing button
        const startBreathingBtn = document.getElementById('startBreathing');
        if (startBreathingBtn) {
            startBreathingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🫁 Start breathing clicked');
                this.startBreathingExercise();
            });
        }

        // Fix begin morning flow button
        const beginFlowBtn = document.getElementById('beginFlow');
        if (beginFlowBtn) {
            beginFlowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🌅 Begin morning flow clicked');
                this.beginMorningFlow();
            });
        }

        // Fix sacred flow button
        const sacredFlowBtn = document.getElementById('begin-sacred-flow-btn');
        if (sacredFlowBtn) {
            sacredFlowBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('✨ Sacred flow clicked');
                this.beginSacredFlow();
            });
        }
    }

    startBreathingExercise() {
        console.log('🫁 Starting enhanced breathing exercise...');
        
        // Create or find breathing interface
        this.createBreathingInterface();
        
        // Start the guided breathing session
        this.runGuidedBreathing();
    }

    createBreathingInterface() {
        // Remove existing interface
        const existingInterface = document.getElementById('breathing-interface');
        if (existingInterface) {
            existingInterface.remove();
        }

        // Create enhanced breathing interface
        const breathingInterface = document.createElement('div');
        breathingInterface.id = 'breathing-interface';
        breathingInterface.className = 'breathing-interface';
        breathingInterface.innerHTML = `
            <div class="breathing-container">
                <div class="breathing-header">
                    <h3 class="breathing-title">Guided Breathing</h3>
                    <button class="breathing-close" id="closeBreathing">×</button>
                </div>
                
                <div class="breathing-circle-container">
                    <div class="breathing-circle" id="breathingCircle">
                        <div class="breathing-circle-inner">
                            <div class="breathing-text" id="breathingText">Ready</div>
                            <div class="breathing-count" id="breathingCount">0 / 5</div>
                        </div>
                    </div>
                </div>
                
                <div class="breathing-controls">
                    <button class="breathing-btn" id="startBreathingBtn">
                        <span class="btn-icon">▶️</span>
                        Start Breathing
                    </button>
                    <button class="breathing-btn secondary" id="pauseBreathingBtn" style="display: none;">
                        <span class="btn-icon">⏸️</span>
                        Pause
                    </button>
                    <button class="breathing-btn secondary" id="stopBreathingBtn" style="display: none;">
                        <span class="btn-icon">⏹️</span>
                        Stop
                    </button>
                </div>
                
                <div class="breathing-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>
                
                <div class="breathing-instructions">
                    <p id="breathingInstruction">Click "Start Breathing" to begin your 5-breath guided session</p>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .breathing-interface {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .breathing-container {
                background: white;
                border-radius: 24px;
                padding: 32px;
                max-width: 400px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            .breathing-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 24px;
            }
            
            .breathing-title {
                font-size: 24px;
                font-weight: 600;
                color: var(--forest-deep);
                margin: 0;
            }
            
            .breathing-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            .breathing-close:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .breathing-circle-container {
                margin: 32px 0;
                display: flex;
                justify-content: center;
            }
            
            .breathing-circle {
                width: 200px;
                height: 200px;
                border: 4px solid var(--sage-deep);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                background: linear-gradient(135deg, rgba(139, 195, 74, 0.1), rgba(76, 175, 80, 0.1));
            }
            
            .breathing-circle.breathing-in {
                transform: scale(1.3);
                border-color: var(--forest-deep);
                background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(139, 195, 74, 0.2));
            }
            
            .breathing-circle.breathing-out {
                transform: scale(0.8);
                border-color: var(--sage-deep);
                background: linear-gradient(135deg, rgba(139, 195, 74, 0.1), rgba(76, 175, 80, 0.1));
            }
            
            .breathing-circle-inner {
                text-align: center;
            }
            
            .breathing-text {
                font-size: 20px;
                font-weight: 600;
                color: var(--forest-deep);
                margin-bottom: 8px;
            }
            
            .breathing-count {
                font-size: 14px;
                color: var(--sage-deep);
                font-weight: 500;
            }
            
            .breathing-controls {
                display: flex;
                gap: 12px;
                justify-content: center;
                margin: 24px 0;
            }
            
            .breathing-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .breathing-btn:not(.secondary) {
                background: var(--sage-deep);
                color: white;
            }
            
            .breathing-btn.secondary {
                background: #f0f0f0;
                color: #666;
            }
            
            .breathing-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .breathing-progress {
                margin: 24px 0;
            }
            
            .progress-bar {
                height: 6px;
                background: #e0e0e0;
                border-radius: 3px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--sage-deep), var(--forest-deep));
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .breathing-instructions {
                margin-top: 16px;
            }
            
            .breathing-instructions p {
                color: #666;
                font-size: 14px;
                line-height: 1.5;
                margin: 0;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(breathingInterface);

        // Add event listeners
        this.setupBreathingEventListeners();
    }

    setupBreathingEventListeners() {
        const closeBtn = document.getElementById('closeBreathing');
        const startBtn = document.getElementById('startBreathingBtn');
        const pauseBtn = document.getElementById('pauseBreathingBtn');
        const stopBtn = document.getElementById('stopBreathingBtn');

        closeBtn?.addEventListener('click', () => {
            this.stopBreathingExercise();
        });

        startBtn?.addEventListener('click', () => {
            this.runGuidedBreathing();
        });

        pauseBtn?.addEventListener('click', () => {
            this.pauseBreathingExercise();
        });

        stopBtn?.addEventListener('click', () => {
            this.stopBreathingExercise();
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('breathing-interface')) {
                this.stopBreathingExercise();
            }
        });
    }

    runGuidedBreathing() {
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const count = document.getElementById('breathingCount');
        const progress = document.getElementById('progressFill');
        const instruction = document.getElementById('breathingInstruction');
        const startBtn = document.getElementById('startBreathingBtn');
        const pauseBtn = document.getElementById('pauseBreathingBtn');
        const stopBtn = document.getElementById('stopBreathingBtn');

        if (!circle) return;

        let breathCount = 0;
        const maxBreaths = 5;
        let isPaused = false;
        let breathingInterval;

        const updateUI = () => {
            count.textContent = `${breathCount} / ${maxBreaths}`;
            progress.style.width = `${(breathCount / maxBreaths) * 100}%`;
            
            if (breathCount === 0) {
                instruction.textContent = 'Get ready to begin your breathing session';
            } else if (breathCount < maxBreaths) {
                instruction.textContent = `Breath ${breathCount} of ${maxBreaths} - Focus on your breathing`;
            } else {
                instruction.textContent = 'Well done! You\'ve completed your breathing session';
            }
        };

        const breatheIn = () => {
            if (isPaused) return;
            
            circle.classList.remove('breathing-out');
            circle.classList.add('breathing-in');
            text.textContent = 'Breathe In';
            instruction.textContent = 'Slowly inhale through your nose...';
        };

        const breatheOut = () => {
            if (isPaused) return;
            
            circle.classList.remove('breathing-in');
            circle.classList.add('breathing-out');
            text.textContent = 'Breathe Out';
            instruction.textContent = 'Gently exhale through your mouth...';
        };

        const breathingCycle = () => {
            if (isPaused) return;
            
            if (breathCount < maxBreaths) {
                breatheIn();
                setTimeout(() => {
                    if (!isPaused) {
                        breatheOut();
                        setTimeout(() => {
                            if (!isPaused) {
                                breathCount++;
                                updateUI();
                                if (breathCount < maxBreaths) {
                                    breathingCycle();
                                } else {
                                    this.completeBreathingExercise();
                                }
                            }
                        }, 3000);
                    }
                }, 3000);
            }
        };

        // Update button states
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'inline-flex';

        updateUI();
        breathingCycle();
    }

    pauseBreathingExercise() {
        const pauseBtn = document.getElementById('pauseBreathingBtn');
        const resumeBtn = document.getElementById('resumeBreathingBtn');
        
        // Toggle pause state
        this.isBreathingPaused = !this.isBreathingPaused;
        
        if (this.isBreathingPaused) {
            pauseBtn.textContent = 'Resume';
            pauseBtn.querySelector('.btn-icon').textContent = '▶️';
        } else {
            pauseBtn.textContent = 'Pause';
            pauseBtn.querySelector('.btn-icon').textContent = '⏸️';
        }
    }

    completeBreathingExercise() {
        const circle = document.getElementById('breathingCircle');
        const text = document.getElementById('breathingText');
        const instruction = document.getElementById('breathingInstruction');
        const pauseBtn = document.getElementById('pauseBreathingBtn');
        const stopBtn = document.getElementById('stopBreathingBtn');

        circle.classList.remove('breathing-in', 'breathing-out');
        text.textContent = 'Complete!';
        instruction.textContent = 'Great job! You\'ve completed your breathing session.';
        
        pauseBtn.style.display = 'none';
        stopBtn.textContent = 'Close';
        stopBtn.querySelector('.btn-icon').textContent = '✓';

        // Add completion celebration
        circle.style.animation = 'pulse 1s ease-in-out 3';
    }

    stopBreathingExercise() {
        const breathingInterface = document.getElementById('breathing-interface');
        if (breathingInterface) {
            breathingInterface.remove();
        }
        this.isBreathingPaused = false;
    }

    beginMorningFlow() {
        console.log('🌅 Beginning morning flow...');
        
        // Navigate to home page
        if (window.navigationManager) {
            window.navigationManager.navigateToPage('home');
        } else {
            // Fallback navigation
            window.location.hash = '#home';
        }
    }

    beginSacredFlow() {
        console.log('✨ Beginning sacred flow...');
        
        // Enable the sacred flow button
        const sacredFlowBtn = document.getElementById('begin-sacred-flow-btn');
        if (sacredFlowBtn) {
            sacredFlowBtn.disabled = false;
            sacredFlowBtn.classList.remove('disabled:opacity-50', 'disabled:cursor-not-allowed');
        }
        
        // Navigate to timer page
        if (window.navigationManager) {
            window.navigationManager.navigateToPage('timer');
        } else {
            window.location.hash = '#timer';
        }
    }

    fixNavigationIssues() {
        // Enhanced navigation with world-class UX
        this.setupEnhancedNavigation();
        this.addNavigationAnimations();
        this.addKeyboardNavigation();
        this.addNavigationBreadcrumbs();
    }

    setupEnhancedNavigation() {
        const navLinks = document.querySelectorAll('.nav-link, .main-nav a, .begin-flow-btn');
        navLinks.forEach(link => {
            // Remove existing listeners to avoid duplicates
            link.removeEventListener('click', this.handleNavigationClick);
            
            // Add enhanced click handler
            link.addEventListener('click', this.handleNavigationClick.bind(this));
            
            // Add hover effects
            this.addNavigationHoverEffects(link);
        });

        // Fix any navigation popups
        this.fixNavigationPopups();
    }

    handleNavigationClick(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            const pageName = href.substring(1);
            console.log('🔗 Enhanced navigation to:', pageName);
            
            // Add loading state
            this.showNavigationLoading(link);
            
            // Navigate with smooth transition
            this.smoothNavigateToPage(pageName);
        }
    }

    addNavigationHoverEffects(link) {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
            link.style.transition = 'all 0.2s ease';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    }

    showNavigationLoading(link) {
        const originalText = link.textContent;
        const originalHTML = link.innerHTML;
        
        link.style.opacity = '0.7';
        link.innerHTML = '<span class="loading-spinner">⏳</span> Loading...';
        
        // Restore after navigation
        setTimeout(() => {
            link.style.opacity = '1';
            link.innerHTML = originalHTML;
        }, 1000);
    }

    smoothNavigateToPage(pageName) {
        // Add page transition effect
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.opacity = '0.8';
            mainContent.style.transform = 'translateY(10px)';
            mainContent.style.transition = 'all 0.3s ease';
        }

        // Navigate after transition
        setTimeout(() => {
            if (window.navigationManager) {
                window.navigationManager.navigateToPage(pageName);
            } else {
                window.location.hash = '#' + pageName;
            }
            
            // Restore content
            setTimeout(() => {
                if (mainContent) {
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'translateY(0)';
                }
            }, 100);
        }, 150);
    }

    addNavigationAnimations() {
        // Add smooth page transitions
        const style = document.createElement('style');
        style.textContent = `
            .page-transition {
                animation: pageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            @keyframes pageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .nav-link, .main-nav a {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .nav-link:hover, .main-nav a:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .loading-spinner {
                display: inline-block;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Alt + number keys for quick navigation
            if (e.altKey && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const navItems = document.querySelectorAll('.nav-link, .main-nav a');
                const index = parseInt(e.key) - 1;
                if (navItems[index]) {
                    navItems[index].click();
                }
            }
            
            // Escape to close any open modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    addNavigationBreadcrumbs() {
        // Add breadcrumb navigation
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb-nav';
        breadcrumb.innerHTML = `
            <div class="breadcrumb-container">
                <span class="breadcrumb-item" data-page="home">🏠 Home</span>
                <span class="breadcrumb-separator">›</span>
                <span class="breadcrumb-current" id="currentPage">Welcome</span>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .breadcrumb-nav {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1000;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                padding: 8px 16px;
                border-radius: 20px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                font-size: 14px;
                color: #666;
            }
            
            .breadcrumb-item {
                cursor: pointer;
                transition: color 0.2s ease;
            }
            
            .breadcrumb-item:hover {
                color: var(--sage-deep);
            }
            
            .breadcrumb-separator {
                margin: 0 8px;
                color: #ccc;
            }
            
            .breadcrumb-current {
                font-weight: 600;
                color: var(--forest-deep);
            }
        `;
        document.head.appendChild(style);
        
        // Insert breadcrumb
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.insertBefore(breadcrumb, mainContent.firstChild);
        }
        
        // Add click handlers
        breadcrumb.querySelector('.breadcrumb-item').addEventListener('click', () => {
            this.smoothNavigateToPage('home');
        });
    }

    fixNavigationPopups() {
        // Fix any navigation popup styling issues
        const popups = document.querySelectorAll('.nav-popup, .dropdown-menu');
        popups.forEach(popup => {
            popup.style.background = 'rgba(255, 255, 255, 0.98)';
            popup.style.backdropFilter = 'blur(20px)';
            popup.style.color = 'var(--charcoal)';
            popup.style.border = '1px solid var(--sage-deep)';
            popup.style.borderRadius = '12px';
            popup.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
        });
    }

    closeAllModals() {
        // Close any open modals or overlays
        const modals = document.querySelectorAll('.breathing-interface, .modal, .overlay');
        modals.forEach(modal => {
            if (modal.style.display !== 'none') {
                modal.style.display = 'none';
            }
        });
    }

    fixColorConsistency() {
        // Fix green color consistency
        const style = document.createElement('style');
        style.textContent = `
            .menu-button, .dark-mode-toggle {
                background-color: var(--sage-deep) !important;
                color: white !important;
            }
            
            .menu-button:hover, .dark-mode-toggle:hover {
                background-color: var(--forest-deep) !important;
            }
            
            .nav-popup {
                background: rgba(255, 255, 255, 0.95) !important;
                backdrop-filter: blur(10px) !important;
                color: var(--charcoal) !important;
                border: 1px solid var(--sage-deep) !important;
            }
        `;
        document.head.appendChild(style);
    }

    fixLayoutIssues() {
        // Enhanced mobile-first responsive design
        this.setupResponsiveLayout();
        this.addMobileOptimizations();
        this.addTouchGestures();
        this.addViewportOptimizations();
    }

    setupResponsiveLayout() {
        const style = document.createElement('style');
        style.textContent = `
            /* Mobile-first responsive design */
            .welcome-screen, .sacred-gateway {
                min-height: 100vh;
                padding: 1rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }
            
            @media (min-width: 768px) {
                .welcome-screen, .sacred-gateway {
                    padding: 2rem;
                }
            }
            
            .welcome-actions, .intention-zone {
                margin-top: 1.5rem;
            }
            
            @media (min-width: 768px) {
                .welcome-actions, .intention-zone {
                    margin-top: 2rem;
                }
            }
            
            /* Enhanced breathing circle */
            .breath-circle {
                width: 100px;
                height: 100px;
                border: 3px solid var(--sage-deep);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 1.5rem auto;
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                background: linear-gradient(135deg, rgba(139, 195, 74, 0.1), rgba(76, 175, 80, 0.1));
            }
            
            @media (min-width: 768px) {
                .breath-circle {
                    width: 120px;
                    height: 120px;
                    margin: 2rem auto;
                }
            }
            
            .breath-circle.breathing {
                animation: breathe 4s ease-in-out infinite;
            }
            
            @keyframes breathe {
                0%, 100% { 
                    transform: scale(1);
                    border-color: var(--sage-deep);
                }
                50% { 
                    transform: scale(1.2);
                    border-color: var(--forest-deep);
                }
            }
            
            .breath-text {
                font-size: 1rem;
                font-weight: 600;
                color: var(--sage-deep);
                text-align: center;
            }
            
            @media (min-width: 768px) {
                .breath-text {
                    font-size: 1.2rem;
                }
            }
            
            /* Mobile-optimized buttons */
            .btn-primary, .begin-flow-btn, .breath-start-btn {
                min-height: 48px;
                padding: 12px 24px;
                font-size: 16px;
                border-radius: 12px;
                touch-action: manipulation;
            }
            
            @media (min-width: 768px) {
                .btn-primary, .begin-flow-btn, .breath-start-btn {
                    min-height: 52px;
                    padding: 16px 32px;
                    font-size: 18px;
                    border-radius: 16px;
                }
            }
            
            /* Safe area handling for mobile */
            @supports (padding: max(0px)) {
                .welcome-screen, .sacred-gateway {
                    padding-left: max(1rem, env(safe-area-inset-left));
                    padding-right: max(1rem, env(safe-area-inset-right));
                    padding-top: max(1rem, env(safe-area-inset-top));
                    padding-bottom: max(1rem, env(safe-area-inset-bottom));
                }
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: high) {
                .breath-circle {
                    border-width: 4px;
                }
                
                .btn-primary, .begin-flow-btn {
                    border: 2px solid currentColor;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addMobileOptimizations() {
        // Prevent zoom on input focus (iOS)
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                if (window.innerWidth < 768) {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                    }
                }
            });
            
            input.addEventListener('blur', () => {
                if (window.innerWidth < 768) {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.content = 'width=device-width, initial-scale=1.0';
                    }
                }
            });
        });

        // Add mobile-specific event listeners
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // Add touch feedback
            const buttons = document.querySelectorAll('button, .btn, .nav-link');
            buttons.forEach(button => {
                button.addEventListener('touchstart', () => {
                    button.style.transform = 'scale(0.95)';
                });
                
                button.addEventListener('touchend', () => {
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 150);
                });
            });
        }
    }

    addTouchGestures() {
        // Swipe navigation
        let startX, startY, endX, endY;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right - go back
                    this.handleSwipeRight();
                } else {
                    // Swipe left - go forward
                    this.handleSwipeLeft();
                }
            }
        });
    }

    handleSwipeRight() {
        // Go to previous page or home
        const currentPage = window.location.hash.substring(1) || 'welcome';
        const pages = ['welcome', 'home', 'timer', 'meditation', 'journal'];
        const currentIndex = pages.indexOf(currentPage);
        
        if (currentIndex > 0) {
            this.smoothNavigateToPage(pages[currentIndex - 1]);
        }
    }

    handleSwipeLeft() {
        // Go to next page
        const currentPage = window.location.hash.substring(1) || 'welcome';
        const pages = ['welcome', 'home', 'timer', 'meditation', 'journal'];
        const currentIndex = pages.indexOf(currentPage);
        
        if (currentIndex < pages.length - 1) {
            this.smoothNavigateToPage(pages[currentIndex + 1]);
        }
    }

    addViewportOptimizations() {
        // Handle viewport changes
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleViewportChange();
            }, 250);
        });
        
        // Initial viewport setup
        this.handleViewportChange();
    }

    handleViewportChange() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--viewport-width', `${width}px`);
        document.documentElement.style.setProperty('--viewport-height', `${height}px`);
        
        // Adjust weather widget for new viewport
        const weatherWidget = document.getElementById('weather-widget');
        if (weatherWidget) {
            this.applyWeatherWidgetStyles(weatherWidget);
        }
        
        // Update mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && width >= 768) {
            mobileMenu.style.display = 'none';
        }
    }
}

// Initialize UI fixes when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new UIFixes();
    });
} else {
    new UIFixes();
}

// Make it globally available
window.UIFixes = UIFixes;
