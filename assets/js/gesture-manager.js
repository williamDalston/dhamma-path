/**
 * Gesture Manager - Gesture-First Navigation System
 * Handles swipe gestures, circular gestures, and natural interactions
 */

class GestureManager {
    constructor() {
        this.isEnabled = true;
        this.gestureThreshold = 50;
        this.circularThreshold = 30;
        this.velocityThreshold = 0.3;
        this.touchStartTime = 0;
        this.touchStartPosition = { x: 0, y: 0 };
        this.touchCurrentPosition = { x: 0, y: 0 };
        this.touchEndPosition = { x: 0, y: 0 };
        this.gestureHistory = [];
        this.maxHistoryLength = 5;
        
        this.init();
    }

    init() {
        console.log('👋 Initializing Gesture Manager...');
        this.setupTouchEvents();
        this.setupMouseEvents();
        this.setupKeyboardGestures();
        this.setupGestureRecognition();
        console.log('✅ Gesture Manager initialized');
    }

    setupTouchEvents() {
        // Touch start
        document.addEventListener('touchstart', (e) => {
            if (!this.isEnabled) return;
            
            const touch = e.touches[0];
            this.touchStartTime = Date.now();
            this.touchStartPosition = { x: touch.clientX, y: touch.clientY };
            this.touchCurrentPosition = { x: touch.clientX, y: touch.clientY };
            
            // Prevent default for gesture recognition
            if (this.shouldPreventDefault(e.target)) {
                e.preventDefault();
            }
            
            this.onGestureStart(this.touchStartPosition);
        }, { passive: false });

        // Touch move
        document.addEventListener('touchmove', (e) => {
            if (!this.isEnabled) return;
            
            const touch = e.touches[0];
            this.touchCurrentPosition = { x: touch.clientX, y: touch.clientY };
            
            this.onGestureMove(this.touchCurrentPosition);
        }, { passive: false });

        // Touch end
        document.addEventListener('touchend', (e) => {
            if (!this.isEnabled) return;
            
            const touch = e.changedTouches[0];
            this.touchEndPosition = { x: touch.clientX, y: touch.clientY };
            
            const gesture = this.analyzeGesture();
            if (gesture) {
                this.executeGesture(gesture);
            }
            
            this.onGestureEnd();
        }, { passive: false });
    }

    setupMouseEvents() {
        // Mouse events for desktop gesture simulation
        let isMouseDown = false;
        let mouseStartPosition = { x: 0, y: 0 };
        
        document.addEventListener('mousedown', (e) => {
            if (!this.isEnabled) return;
            
            isMouseDown = true;
            this.touchStartTime = Date.now();
            mouseStartPosition = { x: e.clientX, y: e.clientY };
            this.touchStartPosition = { x: e.clientX, y: e.clientY };
            this.touchCurrentPosition = { x: e.clientX, y: e.clientY };
            
            this.onGestureStart(this.touchStartPosition);
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isEnabled || !isMouseDown) return;
            
            this.touchCurrentPosition = { x: e.clientX, y: e.clientY };
            this.onGestureMove(this.touchCurrentPosition);
        });

        document.addEventListener('mouseup', (e) => {
            if (!this.isEnabled || !isMouseDown) return;
            
            isMouseDown = false;
            this.touchEndPosition = { x: e.clientX, y: e.clientY };
            
            const gesture = this.analyzeGesture();
            if (gesture) {
                this.executeGesture(gesture);
            }
            
            this.onGestureEnd();
        });
    }

    setupKeyboardGestures() {
        // Keyboard shortcuts for gesture simulation
        document.addEventListener('keydown', (e) => {
            if (!this.isEnabled) return;
            
            // Swipe left (previous page)
            if (e.key === 'ArrowLeft' && e.altKey) {
                e.preventDefault();
                this.executeGesture({ type: 'swipe', direction: 'left', confidence: 1.0 });
            }
            
            // Swipe right (next page)
            if (e.key === 'ArrowRight' && e.altKey) {
                e.preventDefault();
                this.executeGesture({ type: 'swipe', direction: 'right', confidence: 1.0 });
            }
            
            // Swipe up (home)
            if (e.key === 'ArrowUp' && e.altKey) {
                e.preventDefault();
                this.executeGesture({ type: 'swipe', direction: 'up', confidence: 1.0 });
            }
            
            // Swipe down (settings/menu)
            if (e.key === 'ArrowDown' && e.altKey) {
                e.preventDefault();
                this.executeGesture({ type: 'swipe', direction: 'down', confidence: 1.0 });
            }
            
            // Circular gesture (timer duration)
            if (e.key === 'c' && e.altKey) {
                e.preventDefault();
                this.executeGesture({ type: 'circular', direction: 'clockwise', confidence: 1.0 });
            }
        });
    }

    setupGestureRecognition() {
        // Gesture recognition patterns
        this.gesturePatterns = {
            swipe: {
                minDistance: this.gestureThreshold,
                maxTime: 500,
                velocityThreshold: this.velocityThreshold
            },
            circular: {
                minRadius: 50,
                maxRadius: 200,
                minAngle: 90,
                maxTime: 1000
            },
            longPress: {
                minTime: 800,
                maxMovement: 10
            },
            pinch: {
                minScale: 0.8,
                maxScale: 1.2
            }
        };
    }

    shouldPreventDefault(target) {
        // Prevent default for specific elements that should handle gestures
        const gestureElements = [
            '.gesture-container',
            '.swipeable',
            '.circular-gesture',
            '.long-press-target'
        ];
        
        return gestureElements.some(selector => 
            target.closest(selector) || target.matches(selector)
        );
    }

    analyzeGesture() {
        const deltaX = this.touchEndPosition.x - this.touchStartPosition.x;
        const deltaY = this.touchEndPosition.y - this.touchStartPosition.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const duration = Date.now() - this.touchStartTime;
        const velocity = distance / duration;
        
        // Swipe gesture detection
        if (distance > this.gesturePatterns.swipe.minDistance && 
            duration < this.gesturePatterns.swipe.maxTime &&
            velocity > this.gesturePatterns.swipe.velocityThreshold) {
            
            let direction;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                direction = deltaX > 0 ? 'right' : 'left';
            } else {
                direction = deltaY > 0 ? 'down' : 'up';
            }
            
            return {
                type: 'swipe',
                direction: direction,
                distance: distance,
                velocity: velocity,
                confidence: Math.min(1.0, velocity / 2.0)
            };
        }
        
        // Long press detection
        if (duration > this.gesturePatterns.longPress.minTime && 
            distance < this.gesturePatterns.longPress.maxMovement) {
            
            return {
                type: 'longPress',
                duration: duration,
                confidence: Math.min(1.0, duration / 1500)
            };
        }
        
        // Circular gesture detection (simplified)
        if (this.isCircularGesture()) {
            return {
                type: 'circular',
                direction: this.getCircularDirection(),
                confidence: 0.8
            };
        }
        
        return null;
    }

    isCircularGesture() {
        // Simplified circular gesture detection
        // In a real implementation, this would track the path more precisely
        const deltaX = this.touchEndPosition.x - this.touchStartPosition.x;
        const deltaY = this.touchEndPosition.y - this.touchStartPosition.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        return distance > this.gesturePatterns.circular.minRadius && 
               distance < this.gesturePatterns.circular.maxRadius;
    }

    getCircularDirection() {
        // Determine clockwise or counterclockwise
        // This is a simplified implementation
        return Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
    }

    executeGesture(gesture) {
        console.log('👋 Executing gesture:', gesture);
        
        // Add to gesture history
        this.gestureHistory.push({
            ...gesture,
            timestamp: Date.now()
        });
        
        // Limit history length
        if (this.gestureHistory.length > this.maxHistoryLength) {
            this.gestureHistory.shift();
        }
        
        // Execute gesture based on type
        switch (gesture.type) {
            case 'swipe':
                this.executeSwipeGesture(gesture);
                break;
            case 'circular':
                this.executeCircularGesture(gesture);
                break;
            case 'longPress':
                this.executeLongPressGesture(gesture);
                break;
        }
        
        // Dispatch gesture event
        window.dispatchEvent(new CustomEvent('gestureExecuted', {
            detail: gesture
        }));
        
        // Haptic feedback
        this.provideHapticFeedback(gesture);
    }

    executeSwipeGesture(gesture) {
        const currentPage = this.getCurrentPage();
        let targetPage = null;
        
        switch (gesture.direction) {
            case 'left':
                targetPage = this.getNextPage(currentPage);
                break;
            case 'right':
                targetPage = this.getPreviousPage(currentPage);
                break;
            case 'up':
                targetPage = 'home';
                break;
            case 'down':
                this.showSettings();
                return;
        }
        
        if (targetPage && targetPage !== currentPage) {
            this.navigateToPage(targetPage, gesture);
        }
    }

    executeCircularGesture(gesture) {
        // Circular gesture for timer duration adjustment
        if (this.getCurrentPage() === 'timer') {
            this.adjustTimerDuration(gesture.direction);
        } else {
            // General circular gesture
            this.rotateContent(gesture.direction);
        }
    }

    executeLongPressGesture(gesture) {
        // Long press for context menu or special actions
        const target = document.elementFromPoint(
            this.touchStartPosition.x, 
            this.touchStartPosition.y
        );
        
        if (target) {
            this.showContextMenu(target, this.touchStartPosition);
        }
    }

    getCurrentPage() {
        // Get current page from navigation manager
        if (window.navigationManager) {
            return window.navigationManager.currentPage || 'home';
        }
        return 'home';
    }

    getNextPage(currentPage) {
        const pageOrder = ['home', 'timer', 'journal', 'workout', 'clarity'];
        const currentIndex = pageOrder.indexOf(currentPage);
        const nextIndex = (currentIndex + 1) % pageOrder.length;
        return pageOrder[nextIndex];
    }

    getPreviousPage(currentPage) {
        const pageOrder = ['home', 'timer', 'journal', 'workout', 'clarity'];
        const currentIndex = pageOrder.indexOf(currentPage);
        const prevIndex = currentIndex === 0 ? pageOrder.length - 1 : currentIndex - 1;
        return pageOrder[prevIndex];
    }

    navigateToPage(page, gesture) {
        if (window.navigationManager) {
            // Add gesture context to navigation
            window.navigationManager.gestureContext = gesture;
            window.navigationManager.navigateToPage(page);
        }
    }

    adjustTimerDuration(direction) {
        if (window.meditationTimer) {
            const currentDuration = window.meditationTimer.getDuration();
            const adjustment = direction === 'clockwise' ? 1 : -1;
            const newDuration = Math.max(1, Math.min(60, currentDuration + adjustment));
            window.meditationTimer.setDuration(newDuration);
        }
    }

    rotateContent(direction) {
        // General content rotation
        const content = document.querySelector('.main-content');
        if (content) {
            const rotation = direction === 'clockwise' ? 5 : -5;
            content.style.transform = `rotate(${rotation}deg)`;
            setTimeout(() => {
                content.style.transform = 'rotate(0deg)';
            }, 200);
        }
    }

    showSettings() {
        // Show settings or menu
        console.log('⚙️ Showing settings via gesture');
        // Implementation would show settings modal
    }

    showContextMenu(target, position) {
        // Show context menu at position
        console.log('📋 Showing context menu at:', position);
        // Implementation would show context menu
    }

    provideHapticFeedback(gesture) {
        if ('vibrate' in navigator) {
            let pattern;
            
            switch (gesture.type) {
                case 'swipe':
                    pattern = [50]; // Short vibration
                    break;
                case 'circular':
                    pattern = [100, 50, 100]; // Pattern vibration
                    break;
                case 'longPress':
                    pattern = [200]; // Long vibration
                    break;
                default:
                    pattern = [30]; // Default short vibration
            }
            
            navigator.vibrate(pattern);
        }
    }

    onGestureStart(position) {
        // Gesture start feedback
        this.showGestureIndicator(position);
    }

    onGestureMove(position) {
        // Update gesture indicator
        this.updateGestureIndicator(position);
    }

    onGestureEnd() {
        // Hide gesture indicator
        this.hideGestureIndicator();
    }

    showGestureIndicator(position) {
        // Show visual feedback for gesture start
        const indicator = document.createElement('div');
        indicator.className = 'gesture-indicator';
        indicator.style.cssText = `
            position: fixed;
            left: ${position.x - 10}px;
            top: ${position.y - 10}px;
            width: 20px;
            height: 20px;
            background: rgba(26, 77, 58, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: gesture-pulse 0.3s ease-out;
        `;
        
        document.body.appendChild(indicator);
        this.gestureIndicator = indicator;
    }

    updateGestureIndicator(position) {
        if (this.gestureIndicator) {
            this.gestureIndicator.style.left = `${position.x - 10}px`;
            this.gestureIndicator.style.top = `${position.y - 10}px`;
        }
    }

    hideGestureIndicator() {
        if (this.gestureIndicator) {
            this.gestureIndicator.remove();
            this.gestureIndicator = null;
        }
    }

    // Public API
    enable() {
        this.isEnabled = true;
    }

    disable() {
        this.isEnabled = false;
    }

    setThreshold(threshold) {
        this.gestureThreshold = threshold;
    }

    getGestureHistory() {
        return [...this.gestureHistory];
    }

    clearGestureHistory() {
        this.gestureHistory = [];
    }
}

// Initialize gesture manager
window.GestureManager = GestureManager;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.gestureManager = new GestureManager();
    });
} else {
    window.gestureManager = new GestureManager();
}
