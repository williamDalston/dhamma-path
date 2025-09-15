/**
 * Accessibility Sweep
 * Automatically fixes missing ARIA labels and improves accessibility
 */

class AccessibilitySweep {
    constructor() {
        this.fixesApplied = 0;
        // Only initialize if not already done
        if (!window.__A11Y_SWEEP_INITIALIZED__) {
            this.init();
        }
    }

    init() {
        // Single-shot + debounced a11y sweep
        if (!window.__A11Y_SWEEP__) {
            window.__A11Y_SWEEP__ = true;
            window.__A11Y_SWEEP_INITIALIZED__ = true;

            let cleanStreak = 0;
            let idleId = null;
            let sweepInstance = null;

            function runSweep() {
                if (!sweepInstance) {
                    sweepInstance = new AccessibilitySweep();
                } else {
                    sweepInstance.runManualSweep();
                }
                
                const fixes = sweepInstance.getStats().fixesApplied;
                cleanStreak = fixes === 0 ? cleanStreak + 1 : 0;
                
                if (cleanStreak >= 3) { 
                    mo.disconnect(); // done until next page load
                    console.log('♿ A11y sweep completed - observer disconnected after clean passes');
                }
            }

            const schedule = () => {
                if (idleId) cancelIdleCallback?.(idleId);
                idleId = requestIdleCallback(runSweep, { timeout: 1500 });
            };

            const mo = new MutationObserver(schedule);
            mo.observe(document.body, { 
                childList: true, 
                subtree: true, 
                attributes: true 
            });

            // Run once on load
            window.addEventListener('load', () => requestIdleCallback(runSweep), { once: true });
        }
    }

    runSweep() {
        console.log('♿ Running accessibility sweep...');
        
        this.fixButtonLabels();
        this.fixFormLabels();
        this.fixImageAltText();
        this.fixHeadingStructure();
        this.fixInteractiveElements();
        this.fixColorContrast();
        
        console.log(`♿ Accessibility sweep complete: ${this.fixesApplied} fixes applied`);
    }

    runManualSweep() {
        this.fixesApplied = 0; // Reset counter for manual runs
        this.runSweep();
    }

    getStats() {
        return { fixesApplied: this.fixesApplied };
    }

    fixButtonLabels() {
        const buttons = document.querySelectorAll('button, [role="button"]');
        
        buttons.forEach(button => {
            const hasName = button.getAttribute('aria-label') || 
                           button.getAttribute('aria-labelledby') || 
                           button.textContent.trim();
            
            if (!hasName) {
                // Try to infer label from various sources
                let label = this.inferButtonLabel(button);
                
                if (label) {
                    button.setAttribute('aria-label', label);
                    this.fixesApplied++;
                    console.log(`♿ Added aria-label to button: "${label}"`);
                }
            }
        });
    }

    inferButtonLabel(button) {
        // Check for title attribute
        if (button.title) return button.title;
        
        // Check for data-label attribute
        if (button.dataset.label) return button.dataset.label;
        
        // Check for SVG aria-label
        const svg = button.querySelector('svg');
        if (svg && svg.getAttribute('aria-label')) {
            return svg.getAttribute('aria-label');
        }
        
        // Check for icon classes and infer meaning
        const classList = button.className;
        if (classList.includes('menu') || classList.includes('hamburger')) {
            return 'Open menu';
        }
        if (classList.includes('close') || classList.includes('dismiss')) {
            return 'Close';
        }
        if (classList.includes('weather') || classList.includes('cloud')) {
            return 'Toggle weather display';
        }
        if (classList.includes('emergency') || classList.includes('performance')) {
            return 'Toggle emergency mode';
        }
        if (classList.includes('location') || classList.includes('gps')) {
            return 'Get location';
        }
        if (classList.includes('breathing') || classList.includes('breath')) {
            return 'Start breathing exercise';
        }
        if (classList.includes('play') || classList.includes('start')) {
            return 'Start';
        }
        if (classList.includes('pause') || classList.includes('stop')) {
            return 'Pause';
        }
        if (classList.includes('next') || classList.includes('forward')) {
            return 'Next';
        }
        if (classList.includes('prev') || classList.includes('back')) {
            return 'Previous';
        }
        if (classList.includes('settings') || classList.includes('config')) {
            return 'Settings';
        }
        if (classList.includes('help') || classList.includes('info')) {
            return 'Help';
        }
        
        // Check for emoji content
        const text = button.textContent.trim();
        if (text.length <= 3 && /[\u{1F300}-\u{1F9FF}]/u.test(text)) {
            const emojiMap = {
                '🌤️': 'Weather',
                '⚡': 'Performance',
                '📍': 'Location',
                '🫁': 'Breathing',
                '▶️': 'Play',
                '⏸️': 'Pause',
                '⏹️': 'Stop',
                '⏭️': 'Next',
                '⏮️': 'Previous',
                '⚙️': 'Settings',
                '❓': 'Help',
                'ℹ️': 'Info',
                '✕': 'Close',
                '✓': 'Confirm',
                '➕': 'Add',
                '➖': 'Remove'
            };
            return emojiMap[text] || `Button with ${text}`;
        }
        
        return null;
    }

    fixFormLabels() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const id = input.id;
            const label = document.querySelector(`label[for="${id}"]`);
            
            if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                // Create a label if none exists
                const wrapper = input.closest('.form-group, .input-group, .field');
                if (wrapper) {
                    const placeholder = input.placeholder || input.name || input.type;
                    if (placeholder) {
                        input.setAttribute('aria-label', placeholder);
                        this.fixesApplied++;
                        console.log(`♿ Added aria-label to input: "${placeholder}"`);
                    }
                }
            }
        });
    }

    fixImageAltText() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            if (!img.alt && !img.getAttribute('aria-label')) {
                // Try to infer alt text from src or class
                let altText = this.inferImageAltText(img);
                
                if (altText) {
                    img.alt = altText;
                    this.fixesApplied++;
                    console.log(`♿ Added alt text to image: "${altText}"`);
                }
            }
        });
    }

    inferImageAltText(img) {
        const src = img.src;
        const className = img.className;
        
        // Check for common patterns
        if (src.includes('logo') || className.includes('logo')) {
            return 'Logo';
        }
        if (src.includes('icon') || className.includes('icon')) {
            return 'Icon';
        }
        if (src.includes('avatar') || className.includes('avatar')) {
            return 'User avatar';
        }
        if (src.includes('weather') || className.includes('weather')) {
            return 'Weather icon';
        }
        if (src.includes('meditation') || className.includes('meditation')) {
            return 'Meditation illustration';
        }
        if (src.includes('workout') || className.includes('workout')) {
            return 'Workout illustration';
        }
        if (src.includes('journal') || className.includes('journal')) {
            return 'Journal illustration';
        }
        
        return 'Decorative image';
    }

    fixHeadingStructure() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.charAt(1));
            
            if (level > lastLevel + 1) {
                console.warn(`♿ Heading structure issue: ${heading.tagName} follows h${lastLevel}`);
            }
            
            lastLevel = level;
        });
    }

    fixInteractiveElements() {
        // Ensure all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('button, [role="button"], a, input, select, textarea');
        
        interactiveElements.forEach(element => {
            if (!element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '0') {
                // Only add tabindex if it's not naturally focusable
                if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
                    element.setAttribute('tabindex', '0');
                    this.fixesApplied++;
                }
            }
        });
    }

    fixColorContrast() {
        // This is a basic check - in production you'd use a proper contrast checker
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            // Basic check for very low contrast
            if (color === backgroundColor) {
                console.warn(`♿ Potential contrast issue: ${element.tagName} has same color and background`);
            }
        });
    }

    observeNewContent() {
        // Watch for dynamically added content
        const observer = new MutationObserver(mutations => {
            let shouldSweep = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if new interactive elements were added
                            if (node.matches && (node.matches('button, [role="button"]') || 
                                node.querySelector('button, [role="button"]'))) {
                                shouldSweep = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldSweep) {
                // Debounce the sweep
                clearTimeout(this.sweepTimeout);
                this.sweepTimeout = setTimeout(() => this.runSweep(), 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Public API
    getStats() {
        return {
            fixesApplied: this.fixesApplied,
            timestamp: Date.now()
        };
    }

    runManualSweep() {
        this.fixesApplied = 0;
        this.runSweep();
        return this.getStats();
    }
}

// Initialize accessibility sweep
window.AccessibilitySweep = AccessibilitySweep;

// Single-shot + debounced a11y sweep
if (!window.__A11Y_SWEEP__) {
    window.__A11Y_SWEEP__ = true;

    let cleanStreak = 0;
    let idleId = null;
    let sweepInstance = null;

    function runSweep() {
        if (!sweepInstance) {
            sweepInstance = new AccessibilitySweep();
        } else {
            sweepInstance.runManualSweep();
        }
        
        const fixes = sweepInstance.getStats().fixesApplied;
        cleanStreak = fixes === 0 ? cleanStreak + 1 : 0;
        
        if (cleanStreak >= 3) { 
            mo.disconnect(); // done until next page load
            console.log('♿ A11y sweep completed - observer disconnected after clean passes');
        }
    }

    const schedule = () => {
        if (idleId) cancelIdleCallback?.(idleId);
        idleId = requestIdleCallback(runSweep, { timeout: 1500 });
    };

    const mo = new MutationObserver(schedule);
    mo.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true 
    });

    // Run once on load
    window.addEventListener('load', () => requestIdleCallback(runSweep), { once: true });
}
