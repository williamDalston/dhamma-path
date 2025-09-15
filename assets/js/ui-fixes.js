/**
 * UI Fixes and Improvements
 * Addresses critical UI/UX issues reported by user
 */

class UIFixes {
    constructor() {
        this.init();
    }

    init() {
        console.log('🔧 Initializing UI fixes...');
        
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
        
        console.log('✅ UI fixes initialized');
    }

    fixWeatherWidget() {
        // Ensure weather widget doesn't cover content
        const weatherWidget = document.getElementById('weather-widget');
        if (weatherWidget) {
            // Move weather widget to top-right corner, not covering content
            weatherWidget.style.position = 'fixed';
            weatherWidget.style.top = '80px';
            weatherWidget.style.right = '16px';
            weatherWidget.style.zIndex = '10';
            weatherWidget.style.maxWidth = '280px';
            weatherWidget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            weatherWidget.style.backdropFilter = 'blur(10px)';
            weatherWidget.style.border = '1px solid rgba(139, 195, 74, 0.2)';
            weatherWidget.style.borderRadius = '12px';
            weatherWidget.style.padding = '12px';
            weatherWidget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            
            // Add minimize button if not present
            this.addMinimizeButton(weatherWidget);
        }
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
        console.log('🫁 Starting breathing exercise...');
        
        // Find or create breathing circle
        let breathCircle = document.querySelector('.breath-circle');
        if (!breathCircle) {
            // Create breathing circle if it doesn't exist
            const breathSection = document.querySelector('.welcome-breath-section') || 
                                 document.querySelector('.breath-section');
            if (breathSection) {
                breathCircle = document.createElement('div');
                breathCircle.className = 'breath-circle';
                breathCircle.innerHTML = `
                    <div class="breath-circle-inner">
                        <div class="breath-text">Breathe</div>
                    </div>
                `;
                breathSection.appendChild(breathCircle);
            }
        }

        if (breathCircle) {
            breathCircle.classList.add('breathing');
            
            // Animate breathing
            let breathCount = 0;
            const maxBreaths = 5;
            
            const breatheIn = () => {
                breathCircle.style.transform = 'scale(1.2)';
                breathCircle.querySelector('.breath-text').textContent = 'Breathe In';
            };
            
            const breatheOut = () => {
                breathCircle.style.transform = 'scale(1)';
                breathCircle.querySelector('.breath-text').textContent = 'Breathe Out';
            };
            
            const breathingCycle = () => {
                if (breathCount < maxBreaths) {
                    breatheIn();
                    setTimeout(() => {
                        breatheOut();
                        breathCount++;
                        setTimeout(breathingCycle, 2000);
                    }, 2000);
                } else {
                    breathCircle.classList.remove('breathing');
                    breathCircle.style.transform = 'scale(1)';
                    breathCircle.querySelector('.breath-text').textContent = 'Complete';
                }
            };
            
            breathingCycle();
        }
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
        // Fix navigation popup issues
        const navLinks = document.querySelectorAll('.nav-link, .main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const pageName = href.substring(1);
                    console.log('🔗 Navigating to:', pageName);
                    
                    if (window.navigationManager) {
                        window.navigationManager.navigateToPage(pageName);
                    } else {
                        window.location.hash = href;
                    }
                }
            });
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
        // Fix scrolling issues
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.style.minHeight = '100vh';
            mainContent.style.paddingBottom = '2rem';
        }

        // Ensure proper spacing
        const style = document.createElement('style');
        style.textContent = `
            .welcome-screen, .sacred-gateway {
                min-height: 100vh;
                padding: 2rem 1rem;
            }
            
            .welcome-actions, .intention-zone {
                margin-top: 2rem;
            }
            
            .breath-circle {
                width: 120px;
                height: 120px;
                border: 3px solid var(--sage-deep);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 2rem auto;
                transition: transform 0.5s ease;
            }
            
            .breath-circle.breathing {
                animation: breathe 4s ease-in-out infinite;
            }
            
            @keyframes breathe {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            
            .breath-text {
                font-size: 1.2rem;
                font-weight: 600;
                color: var(--sage-deep);
            }
        `;
        document.head.appendChild(style);
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
