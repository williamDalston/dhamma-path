/**
 * Accessibility Enhancer
 * Comprehensive accessibility improvements for inclusive user experience
 */

class AccessibilityEnhancer {
    constructor() {
        this.settings = {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            screenReader: false,
            keyboardNavigation: true,
            voiceCommands: false
        };
        
        this.initializeAccessibility();
    }
    
    initializeAccessibility() {
        this.loadAccessibilitySettings();
        this.setupAccessibilityControls();
        this.enhanceKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupVoiceCommands();
        this.setupReducedMotion();
        this.setupHighContrast();
        this.setupLargeText();
    }
    
    loadAccessibilitySettings() {
        const stored = localStorage.getItem('accessibility-settings');
        if (stored) {
            this.settings = { ...this.settings, ...JSON.parse(stored) };
        }
        
        // Apply settings immediately
        if (typeof this.applyAccessibilitySettings === 'function') {
            this.applyAccessibilitySettings();
        } else {
            console.warn('applyAccessibilitySettings not available yet, retrying...');
            setTimeout(() => this.applyAccessibilitySettings(), 100);
        }
    }
    
    saveAccessibilitySettings() {
        localStorage.setItem('accessibility-settings', JSON.stringify(this.settings));
    }
    
    setupAccessibilityControls() {
        // Create accessibility panel
        this.createAccessibilityPanel();
        
        // Add keyboard shortcut (Alt + A)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.toggleAccessibilityPanel();
            }
        });
    }
    
    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.id = 'accessibility-panel';
        panel.className = 'accessibility-panel fixed top-4 right-4 z-[9999] bg-white/95 backdrop-blur-sm border border-sage-deep/20 rounded-lg p-4 shadow-lg transition-all duration-300 opacity-0 translate-y-[-10px] pointer-events-none';
        
        panel.innerHTML = `
            <div class="accessibility-header flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-forest-deep">♿ Accessibility</h3>
                <button class="close-panel text-sage-deep hover:text-forest-deep transition-colors">×</button>
            </div>
            
            <div class="accessibility-controls space-y-3">
                <div class="control-group">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="high-contrast" class="accessibility-toggle">
                        <span class="text-sm text-charcoal">High Contrast</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="large-text" class="accessibility-toggle">
                        <span class="text-sm text-charcoal">Large Text</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="reduced-motion" class="accessibility-toggle">
                        <span class="text-sm text-charcoal">Reduce Motion</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="keyboard-nav" class="accessibility-toggle">
                        <span class="text-sm text-charcoal">Enhanced Keyboard Nav</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label class="flex items-center space-x-2">
                        <input type="checkbox" id="voice-commands" class="accessibility-toggle">
                        <span class="text-sm text-charcoal">Voice Commands</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label class="text-sm text-charcoal">Font Size:</label>
                    <input type="range" id="font-size-slider" min="100" max="150" value="100" class="w-full mt-1">
                    <span id="font-size-value" class="text-xs text-sage-deep">100%</span>
                </div>
            </div>
            
            <div class="accessibility-shortcuts mt-4 pt-3 border-t border-sage-deep/20">
                <p class="text-xs text-charcoal/60 mb-2">Keyboard Shortcuts:</p>
                <div class="shortcut-list text-xs text-charcoal/60 space-y-1">
                    <div>Alt + A: Toggle this panel</div>
                    <div>Tab: Navigate elements</div>
                    <div>Enter/Space: Activate buttons</div>
                    <div>Escape: Close panels</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Setup event listeners
        this.setupPanelEventListeners(panel);
    }
    
    setupPanelEventListeners(panel) {
        // Close panel
        panel.querySelector('.close-panel').addEventListener('click', () => {
            this.toggleAccessibilityPanel();
        });
        
        // High contrast toggle
        panel.querySelector('#high-contrast').addEventListener('change', (e) => {
            this.settings.highContrast = e.target.checked;
            this.applyHighContrast();
            this.saveAccessibilitySettings();
        });
        
        // Large text toggle
        panel.querySelector('#large-text').addEventListener('change', (e) => {
            this.settings.largeText = e.target.checked;
            this.applyLargeText();
            this.saveAccessibilitySettings();
        });
        
        // Reduced motion toggle
        panel.querySelector('#reduced-motion').addEventListener('change', (e) => {
            this.settings.reducedMotion = e.target.checked;
            this.applyReducedMotion();
            this.saveAccessibilitySettings();
        });
        
        // Keyboard navigation toggle
        panel.querySelector('#keyboard-nav').addEventListener('change', (e) => {
            this.settings.keyboardNavigation = e.target.checked;
            this.enhanceKeyboardNavigation();
            this.saveAccessibilitySettings();
        });
        
        // Voice commands toggle
        panel.querySelector('#voice-commands').addEventListener('change', (e) => {
            this.settings.voiceCommands = e.target.checked;
            this.setupVoiceCommands();
            this.saveAccessibilitySettings();
        });
        
        // Font size slider
        const fontSlider = panel.querySelector('#font-size-slider');
        const fontValue = panel.querySelector('#font-size-value');
        
        fontSlider.addEventListener('input', (e) => {
            const size = e.target.value;
            fontValue.textContent = size + '%';
            this.applyFontSize(parseInt(size));
        });
        
        // Initialize toggles with current settings
        panel.querySelector('#high-contrast').checked = this.settings.highContrast;
        panel.querySelector('#large-text').checked = this.settings.largeText;
        panel.querySelector('#reduced-motion').checked = this.settings.reducedMotion;
        panel.querySelector('#keyboard-nav').checked = this.settings.keyboardNavigation;
        panel.querySelector('#voice-commands').checked = this.settings.voiceCommands;
    }
    
    toggleAccessibilityPanel() {
        const panel = document.getElementById('accessibility-panel');
        if (panel.classList.contains('opacity-0')) {
            panel.classList.remove('opacity-0', 'translate-y-[-10px]', 'pointer-events-none');
            panel.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
            panel.classList.add('opacity-0', 'translate-y-[-10px]', 'pointer-events-none');
            panel.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    }
    
    enhanceKeyboardNavigation() {
        if (!this.settings.keyboardNavigation) return;
        
        // Enhanced focus indicators
        const style = document.createElement('style');
        style.id = 'keyboard-navigation-styles';
        style.textContent = `
            *:focus-visible {
                outline: 3px solid var(--sage-deep) !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 3px rgba(122, 155, 122, 0.3) !important;
            }
            
            .keyboard-navigable {
                position: relative;
            }
            
            .keyboard-navigable::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border: 2px solid transparent;
                border-radius: inherit;
                transition: border-color 0.2s ease;
            }
            
            .keyboard-navigable:focus::before {
                border-color: var(--sage-deep);
            }
        `;
        
        // Remove existing styles if any
        const existing = document.getElementById('keyboard-navigation-styles');
        if (existing) existing.remove();
        
        document.head.appendChild(style);
        
        // Add keyboard navigation to interactive elements
        this.addKeyboardNavigationToElements();
    }
    
    addKeyboardNavigationToElements() {
        const interactiveElements = document.querySelectorAll(
            'button, a, input, textarea, select, [tabindex], [role="button"]'
        );
        
        interactiveElements.forEach(element => {
            element.classList.add('keyboard-navigable');
            
            // Add keyboard event listeners
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    if (element.tagName === 'A' || element.getAttribute('role') === 'button') {
                        e.preventDefault();
                        element.click();
                    }
                }
            });
        });
    }
    
    setupScreenReaderSupport() {
        // Add ARIA labels to elements that need them
        this.addAriaLabels();
        
        // Setup live regions for dynamic content
        this.setupLiveRegions();
        
        // Add screen reader announcements
        this.setupScreenReaderAnnouncements();
    }
    
    addAriaLabels() {
        // Add ARIA labels to buttons without text
        const iconButtons = document.querySelectorAll('button:not([aria-label]):empty, button:not([aria-label]) img');
        iconButtons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                const text = button.textContent.trim() || 'Button';
                button.setAttribute('aria-label', text);
            }
        });
        
        // Add ARIA labels to form elements
        const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
        inputs.forEach(input => {
            const label = input.closest('label') || input.previousElementSibling;
            if (label && !input.getAttribute('aria-label')) {
                input.setAttribute('aria-label', label.textContent.trim());
            }
        });
    }
    
    setupLiveRegions() {
        // Create live regions for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
        
        // Create assertive live region for urgent announcements
        const urgentRegion = document.createElement('div');
        urgentRegion.id = 'urgent-live-region';
        urgentRegion.setAttribute('aria-live', 'assertive');
        urgentRegion.setAttribute('aria-atomic', 'true');
        urgentRegion.className = 'sr-only';
        document.body.appendChild(urgentRegion);
    }
    
    setupScreenReaderAnnouncements() {
        // Announce page changes
        document.addEventListener('pageChanged', (e) => {
            this.announceToScreenReader(`Navigated to ${e.detail.page} page`);
        });
        
        // Announce flow progress
        document.addEventListener('flowProgress', (e) => {
            const { completed, total } = e.detail;
            this.announceToScreenReader(`Flow progress: ${completed} of ${total} steps completed`);
        });
        
        // Announce timer events
        document.addEventListener('timerCompleted', () => {
            this.announceToScreenReader('Meditation completed');
        });
        
        // Announce journal milestones
        document.addEventListener('wordCountMilestone', (e) => {
            this.announceToScreenReader(`${e.detail.count} words written`);
        });
    }
    
    announceToScreenReader(message, urgent = false) {
        const region = urgent ? 
            document.getElementById('urgent-live-region') : 
            document.getElementById('live-region');
        
        if (region) {
            region.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                region.textContent = '';
            }, 1000);
        }
    }
    
    setupVoiceCommands() {
        if (!this.settings.voiceCommands) return;
        
        // Check for speech recognition support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        
        this.recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
            this.processVoiceCommand(command);
        };
        
        this.recognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
        };
        
        // Start listening when enabled
        this.startVoiceListening();
    }
    
    startVoiceListening() {
        if (this.recognition && this.settings.voiceCommands) {
            try {
                this.recognition.start();
            } catch (error) {
                console.warn('Could not start speech recognition:', error);
            }
        }
    }
    
    processVoiceCommand(command) {
        const commands = {
            'start meditation': () => this.triggerAction('timer-start-btn'),
            'begin meditation': () => this.triggerAction('timer-start-btn'),
            'start timer': () => this.triggerAction('timer-start-btn'),
            'open journal': () => this.navigateToPage('journal'),
            'start writing': () => this.navigateToPage('journal'),
            'open gratitude': () => this.navigateToPage('gratitude'),
            'start workout': () => this.navigateToPage('workout'),
            'go home': () => this.navigateToPage('home'),
            'next step': () => this.triggerNextStep(),
            'complete': () => this.triggerComplete(),
            'help': () => this.showVoiceHelp(),
            'accessibility': () => this.toggleAccessibilityPanel()
        };
        
        // Find matching command
        for (const [key, action] of Object.entries(commands)) {
            if (command.includes(key)) {
                action();
                this.announceToScreenReader(`Executed: ${key}`);
                break;
            }
        }
    }
    
    triggerAction(selector) {
        const element = document.getElementById(selector) || document.querySelector(selector);
        if (element) {
            element.click();
        }
    }
    
    navigateToPage(page) {
        if (window.navigationManager) {
            window.navigationManager.navigateToPage(page);
        }
    }
    
    triggerNextStep() {
        const nextBtn = document.querySelector('[data-action="next"]') || 
                       document.querySelector('.flow-next-btn');
        if (nextBtn) {
            nextBtn.click();
        }
    }
    
    triggerComplete() {
        const completeBtn = document.querySelector('[data-action="complete"]') ||
                           document.querySelector('.complete-btn');
        if (completeBtn) {
            completeBtn.click();
        }
    }
    
    showVoiceHelp() {
        const helpMessage = `Voice commands available: start meditation, open journal, start workout, go home, next step, complete, help, accessibility`;
        this.announceToScreenReader(helpMessage);
    }
    
    setupReducedMotion() {
        if (this.settings.reducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--animation-iteration-count', '1');
            
            // Add reduced motion styles
            const style = document.createElement('style');
            style.id = 'reduced-motion-styles';
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        } else {
            // Remove reduced motion styles
            const existing = document.getElementById('reduced-motion-styles');
            if (existing) existing.remove();
        }
    }
    
    setupHighContrast() {
        if (this.settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    setupLargeText() {
        if (this.settings.largeText) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
    }
    
    applyAccessibilitySettings() {
        this.applyHighContrast();
        this.applyLargeText();
        this.applyReducedMotion();
        this.enhanceKeyboardNavigation();
        this.setupVoiceCommands();
    }
    
    applyReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--transition-duration', '0.01ms');
            document.documentElement.classList.add('reduced-motion');
        }
    }
    
    applyHighContrast() {
        if (this.settings.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }
    
    
    applyLargeText() {
        if (this.settings.largeText) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
    }
    
    applyFontSize(percentage) {
        document.documentElement.style.setProperty('--font-size-multiplier', `${percentage / 100}`);
    }
}

// Initialize accessibility enhancer
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityEnhancer = new AccessibilityEnhancer();
});
