/**
 * Enhanced Mobile Gestures System
 * Advanced gesture recognition for mobile touch interactions
 */

class MobileGestures {
    constructor() {
        this.isEnabled = true;
        this.touchStartTime = 0;
        this.touchStartPos = { x: 0, y: 0 };
        this.touchCurrentPos = { x: 0, y: 0 };
        this.touchVelocity = { x: 0, y: 0 };
        this.gestureThresholds = {
            swipe: {
                minDistance: 50,
                maxTime: 300,
                velocity: 0.3
            },
            longPress: {
                minTime: 500,
                maxDistance: 10
            },
            pinch: {
                minScale: 0.5,
                maxScale: 3.0
            },
            rotation: {
                minAngle: 15
            }
        };
        
        this.activeGestures = new Map();
        this.gestureCallbacks = new Map();
        
        this.init();
    }

    init() {
        console.log('📱 Initializing Enhanced Mobile Gestures...');
        this.setupTouchListeners();
        this.setupGestureCallbacks();
        this.setupMobileOptimizations();
        console.log('✅ Enhanced Mobile Gestures initialized');
    }

    setupTouchListeners() {
        // Add touch event listeners to document
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        document.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });
        
        // Add mouse event listeners for desktop testing
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    setupGestureCallbacks() {
        // Setup default gesture callbacks
        this.gestureCallbacks.set('swipe-left', this.handleSwipeLeft.bind(this));
        this.gestureCallbacks.set('swipe-right', this.handleSwipeRight.bind(this));
        this.gestureCallbacks.set('swipe-up', this.handleSwipeUp.bind(this));
        this.gestureCallbacks.set('swipe-down', this.handleSwipeDown.bind(this));
        this.gestureCallbacks.set('long-press', this.handleLongPress.bind(this));
        this.gestureCallbacks.set('pinch-in', this.handlePinchIn.bind(this));
        this.gestureCallbacks.set('pinch-out', this.handlePinchOut.bind(this));
        this.gestureCallbacks.set('rotation', this.handleRotation.bind(this));
        this.gestureCallbacks.set('tap', this.handleTap.bind(this));
        this.gestureCallbacks.set('double-tap', this.handleDoubleTap.bind(this));
    }

    setupMobileOptimizations() {
        // Prevent default touch behaviors that interfere with gestures
        document.addEventListener('touchstart', (e) => {
            // Allow touch events on specific elements
            if (this.shouldAllowTouch(e.target)) {
                return;
            }
            
            // Prevent default for gesture areas
            if (this.isGestureArea(e.target)) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            if (this.isGestureArea(e.target)) {
                e.preventDefault();
            }
        });
        
        // Prevent text selection during gestures
        document.addEventListener('selectstart', (e) => {
            if (this.isGestureArea(e.target)) {
                e.preventDefault();
            }
        });
    }

    // Touch Event Handlers
    handleTouchStart(e) {
        if (!this.isEnabled) return;
        
        const touch = e.touches[0];
        this.touchStartTime = Date.now();
        this.touchStartPos = { x: touch.clientX, y: touch.clientY };
        this.touchCurrentPos = { x: touch.clientX, y: touch.clientY };
        
        // Initialize gesture tracking
        this.activeGestures.set('touch', {
            startTime: this.touchStartTime,
            startPos: this.touchStartPos,
            currentPos: this.touchCurrentPos,
            touches: e.touches.length
        });
        
        // Start long press detection
        this.startLongPressDetection();
        
        // Prevent default for gesture areas
        if (this.isGestureArea(e.target)) {
            e.preventDefault();
        }
    }

    handleTouchMove(e) {
        if (!this.isEnabled) return;
        
        const touch = e.touches[0];
        this.touchCurrentPos = { x: touch.clientX, y: touch.clientY };
        
        // Update gesture tracking
        const gesture = this.activeGestures.get('touch');
        if (gesture) {
            gesture.currentPos = this.touchCurrentPos;
            gesture.touches = e.touches.length;
            
            // Calculate velocity
            const deltaTime = Date.now() - gesture.startTime;
            const deltaX = this.touchCurrentPos.x - this.touchStartPos.x;
            const deltaY = this.touchCurrentPos.y - this.touchStartPos.y;
            
            this.touchVelocity = {
                x: deltaX / deltaTime,
                y: deltaY / deltaTime
            };
            
            gesture.velocity = this.touchVelocity;
        }
        
        // Prevent default for gesture areas
        if (this.isGestureArea(e.target)) {
            e.preventDefault();
        }
    }

    handleTouchEnd(e) {
        if (!this.isEnabled) return;
        
        const gesture = this.activeGestures.get('touch');
        if (!gesture) return;
        
        const touchDuration = Date.now() - gesture.startTime;
        const deltaX = this.touchCurrentPos.x - this.touchStartPos.x;
        const deltaY = this.touchCurrentPos.y - this.touchStartPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Determine gesture type
        const gestureType = this.determineGestureType(gesture, touchDuration, distance);
        
        if (gestureType) {
            this.executeGesture(gestureType, gesture);
        }
        
        // Clean up
        this.activeGestures.delete('touch');
        this.stopLongPressDetection();
        
        // Prevent default for gesture areas
        if (this.isGestureArea(e.target)) {
            e.preventDefault();
        }
    }

    handleTouchCancel(e) {
        if (!this.isEnabled) return;
        
        // Clean up on touch cancel
        this.activeGestures.delete('touch');
        this.stopLongPressDetection();
        
        // Prevent default for gesture areas
        if (this.isGestureArea(e.target)) {
            e.preventDefault();
        }
    }

    // Mouse Event Handlers (for desktop testing)
    handleMouseDown(e) {
        if (!this.isEnabled) return;
        
        this.touchStartTime = Date.now();
        this.touchStartPos = { x: e.clientX, y: e.clientY };
        this.touchCurrentPos = { x: e.clientX, y: e.clientY };
        
        // Initialize gesture tracking
        this.activeGestures.set('mouse', {
            startTime: this.touchStartTime,
            startPos: this.touchStartPos,
            currentPos: this.touchCurrentPos,
            touches: 1
        });
        
        // Start long press detection
        this.startLongPressDetection();
    }

    handleMouseMove(e) {
        if (!this.isEnabled) return;
        
        this.touchCurrentPos = { x: e.clientX, y: e.clientY };
        
        // Update gesture tracking
        const gesture = this.activeGestures.get('mouse');
        if (gesture) {
            gesture.currentPos = this.touchCurrentPos;
            
            // Calculate velocity
            const deltaTime = Date.now() - gesture.startTime;
            const deltaX = this.touchCurrentPos.x - this.touchStartPos.x;
            const deltaY = this.touchCurrentPos.y - this.touchStartPos.y;
            
            this.touchVelocity = {
                x: deltaX / deltaTime,
                y: deltaY / deltaTime
            };
            
            gesture.velocity = this.touchVelocity;
        }
    }

    handleMouseUp(e) {
        if (!this.isEnabled) return;
        
        const gesture = this.activeGestures.get('mouse');
        if (!gesture) return;
        
        const touchDuration = Date.now() - gesture.startTime;
        const deltaX = this.touchCurrentPos.x - this.touchStartPos.x;
        const deltaY = this.touchCurrentPos.y - this.touchStartPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Determine gesture type
        const gestureType = this.determineGestureType(gesture, touchDuration, distance);
        
        if (gestureType) {
            this.executeGesture(gestureType, gesture);
        }
        
        // Clean up
        this.activeGestures.delete('mouse');
        this.stopLongPressDetection();
    }

    // Gesture Detection
    determineGestureType(gesture, duration, distance) {
        const thresholds = this.gestureThresholds;
        
        // Long press
        if (duration >= thresholds.longPress.minTime && distance <= thresholds.longPress.maxDistance) {
            return 'long-press';
        }
        
        // Swipe gestures
        if (duration <= thresholds.swipe.maxTime && distance >= thresholds.swipe.minDistance) {
            const deltaX = gesture.currentPos.x - gesture.startPos.x;
            const deltaY = gesture.currentPos.y - gesture.startPos.y;
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            // Determine swipe direction
            if (absDeltaX > absDeltaY) {
                // Horizontal swipe
                if (deltaX > 0) {
                    return 'swipe-right';
                } else {
                    return 'swipe-left';
                }
            } else {
                // Vertical swipe
                if (deltaY > 0) {
                    return 'swipe-down';
                } else {
                    return 'swipe-up';
                }
            }
        }
        
        // Tap gestures
        if (duration <= 200 && distance <= 10) {
            return 'tap';
        }
        
        return null;
    }

    // Gesture Execution
    executeGesture(gestureType, gesture) {
        const callback = this.gestureCallbacks.get(gestureType);
        if (callback) {
            callback(gesture);
        }
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('mobileGesture', {
            detail: {
                type: gestureType,
                gesture: gesture,
                target: gesture.target || document.activeElement
            }
        }));
    }

    // Gesture Callbacks
    handleSwipeLeft(gesture) {
        console.log('📱 Swipe Left detected');
        
        // Navigate to previous page or close modal
        if (window.navigationManager) {
            window.navigationManager.navigateToPrevious();
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
    }

    handleSwipeRight(gesture) {
        console.log('📱 Swipe Right detected');
        
        // Navigate to next page or open menu
        if (window.navigationManager) {
            window.navigationManager.navigateToNext();
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
    }

    handleSwipeUp(gesture) {
        console.log('📱 Swipe Up detected');
        
        // Scroll up or show more content
        window.scrollBy(0, -100);
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
    }

    handleSwipeDown(gesture) {
        console.log('📱 Swipe Down detected');
        
        // Scroll down or show less content
        window.scrollBy(0, 100);
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
    }

    handleLongPress(gesture) {
        console.log('📱 Long Press detected');
        
        // Show context menu or additional options
        this.showContextMenu(gesture.startPos);
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'medium');
        }
    }

    handlePinchIn(gesture) {
        console.log('📱 Pinch In detected');
        
        // Zoom out or minimize content
        this.zoomOut();
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
    }

    handlePinchOut(gesture) {
        console.log('📱 Pinch Out detected');
        
        // Zoom in or expand content
        this.zoomIn();
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
    }

    handleRotation(gesture) {
        console.log('📱 Rotation detected');
        
        // Rotate content or adjust settings
        this.rotateContent(gesture.angle);
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
    }

    handleTap(gesture) {
        console.log('📱 Tap detected');
        
        // Handle tap gesture
        this.handleTapGesture(gesture);
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
    }

    handleDoubleTap(gesture) {
        console.log('📱 Double Tap detected');
        
        // Handle double tap gesture
        this.handleDoubleTapGesture(gesture);
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'medium');
        }
    }

    // Long Press Detection
    startLongPressDetection() {
        this.longPressTimer = setTimeout(() => {
            const gesture = this.activeGestures.get('touch') || this.activeGestures.get('mouse');
            if (gesture) {
                const deltaX = this.touchCurrentPos.x - this.touchStartPos.x;
                const deltaY = this.touchCurrentPos.y - this.touchStartPos.y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance <= this.gestureThresholds.longPress.maxDistance) {
                    this.executeGesture('long-press', gesture);
                }
            }
        }, this.gestureThresholds.longPress.minTime);
    }

    stopLongPressDetection() {
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
    }

    // Utility Methods
    isGestureArea(element) {
        // Check if element is in a gesture area
        return element.closest('.gesture-area, .swipeable, .touch-interactive');
    }

    shouldAllowTouch(element) {
        // Check if element should allow default touch behavior
        return element.closest('input, textarea, select, button, a');
    }

    showContextMenu(position) {
        // Show context menu at position
        const contextMenu = document.createElement('div');
        contextMenu.className = 'mobile-context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            left: ${position.x}px;
            top: ${position.y}px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 8px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        contextMenu.innerHTML = `
            <button class="context-menu-item">Copy</button>
            <button class="context-menu-item">Share</button>
            <button class="context-menu-item">Settings</button>
        `;
        
        document.body.appendChild(contextMenu);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (contextMenu.parentNode) {
                contextMenu.parentNode.removeChild(contextMenu);
            }
        }, 3000);
    }

    zoomIn() {
        // Zoom in content
        document.body.style.transform = 'scale(1.1)';
        document.body.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            document.body.style.transform = 'scale(1)';
        }, 300);
    }

    zoomOut() {
        // Zoom out content
        document.body.style.transform = 'scale(0.9)';
        document.body.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            document.body.style.transform = 'scale(1)';
        }, 300);
    }

    rotateContent(angle) {
        // Rotate content
        document.body.style.transform = `rotate(${angle}deg)`;
        document.body.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            document.body.style.transform = 'rotate(0deg)';
        }, 300);
    }

    handleTapGesture(gesture) {
        // Handle tap gesture
        const element = document.elementFromPoint(gesture.startPos.x, gesture.startPos.y);
        if (element && element.click) {
            element.click();
        }
    }

    handleDoubleTapGesture(gesture) {
        // Handle double tap gesture
        const element = document.elementFromPoint(gesture.startPos.x, gesture.startPos.y);
        if (element && element.doubleClick) {
            element.doubleClick();
        }
    }

    // Public API
    registerGestureCallback(gestureType, callback) {
        this.gestureCallbacks.set(gestureType, callback);
    }

    unregisterGestureCallback(gestureType) {
        this.gestureCallbacks.delete(gestureType);
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
    }

    setGestureThreshold(gestureType, threshold) {
        if (this.gestureThresholds[gestureType]) {
            this.gestureThresholds[gestureType] = { ...this.gestureThresholds[gestureType], ...threshold };
        }
    }

    getActiveGestures() {
        return Array.from(this.activeGestures.keys());
    }

    // Cleanup
    destroy() {
        document.removeEventListener('touchstart', this.handleTouchStart);
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        document.removeEventListener('touchcancel', this.handleTouchCancel);
        document.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        
        this.stopLongPressDetection();
        this.activeGestures.clear();
        this.gestureCallbacks.clear();
    }
}

// Initialize mobile gestures
window.MobileGestures = MobileGestures;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileGestures = new MobileGestures();
    });
} else {
    window.mobileGestures = new MobileGestures();
}
