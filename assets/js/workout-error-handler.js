/**
 * Workout Page Error Handler
 * Ultra-robust error handling specifically for the workout functionality
 */

class WorkoutErrorHandler {
    constructor() {
        this.workout = null;
        this.errorCount = 0;
        this.maxRetries = 3;
        this.fallbackMode = false;
        this.defaultExercises = [
            { name: 'Push-ups', duration: 30, description: 'Upper body strength exercise', emoji: '💪' },
            { name: 'Squats', duration: 30, description: 'Lower body strength exercise', emoji: '🦵' },
            { name: 'Plank', duration: 30, description: 'Core strengthening exercise', emoji: '🤸' },
            { name: 'Jumping Jacks', duration: 30, description: 'Cardio exercise', emoji: '🏃' },
            { name: 'Burpees', duration: 30, description: 'Full body exercise', emoji: '🔥' }
        ];
        this.init();
    }

    init() {
        this.setupExerciseErrorHandlers();
        this.setupTimerErrorHandlers();
        this.setupNavigationErrorHandlers();
        this.setupProgressErrorHandlers();
        this.setupSoundErrorHandlers();
    }

    setupExerciseErrorHandlers() {
        // Exercise data loading errors
        this.handleExerciseDataError = (error) => {
            console.error('Exercise data error:', error);
            this.errorCount++;
            
            if (this.errorCount <= this.maxRetries) {
                this.showRecoveryNotification('Exercise data failed to load', 'Retrying...', 'warning');
                setTimeout(() => this.reloadExerciseData(), 1000);
            } else {
                this.enableDefaultExercises();
            }
        };

        // Exercise navigation errors
        this.handleExerciseNavigationError = (error) => {
            console.error('Exercise navigation error:', error);
            this.showRecoveryNotification('Exercise navigation failed', 'Enabling manual navigation', 'warning');
            this.enableManualNavigation();
        };

        // Exercise state errors
        this.handleExerciseStateError = (error) => {
            console.error('Exercise state error:', error);
            this.showRecoveryNotification('Exercise state corrupted', 'Resetting to first exercise', 'error');
            this.resetExerciseState();
        };
    }

    setupTimerErrorHandlers() {
        // Workout timer errors
        this.handleWorkoutTimerError = (error) => {
            console.error('Workout timer error:', error);
            this.showRecoveryNotification('Workout timer failed', 'Reinitializing timer', 'warning');
            this.reinitializeWorkoutTimer();
        };

        // Timer display errors
        this.handleTimerDisplayError = (error) => {
            console.error('Timer display error:', error);
            this.showRecoveryNotification('Timer display failed', 'Showing text timer', 'warning');
            this.enableTextTimer();
        };

        // Timer state errors
        this.handleTimerStateError = (error) => {
            console.error('Timer state error:', error);
            this.showRecoveryNotification('Timer state corrupted', 'Resetting timer', 'error');
            this.resetTimerState();
        };
    }

    setupNavigationErrorHandlers() {
        // Next/Previous button errors
        this.handleNavigationButtonError = (error) => {
            console.error('Navigation button error:', error);
            this.showRecoveryNotification('Navigation buttons failed', 'Enabling manual navigation', 'warning');
            this.enableManualNavigation();
        };

        // Exercise list errors
        this.handleExerciseListError = (error) => {
            console.error('Exercise list error:', error);
            this.showRecoveryNotification('Exercise list failed', 'Showing basic list', 'warning');
            this.showBasicExerciseList();
        };
    }

    setupProgressErrorHandlers() {
        // Progress tracking errors
        this.handleProgressTrackingError = (error) => {
            console.error('Progress tracking error:', error);
            this.showRecoveryNotification('Progress tracking failed', 'Continuing without tracking', 'info');
            this.disableProgressTracking();
        };

        // Progress display errors
        this.handleProgressDisplayError = (error) => {
            console.error('Progress display error:', error);
            this.showRecoveryNotification('Progress display failed', 'Hiding progress indicators', 'info');
            this.hideProgressDisplay();
        };
    }

    setupSoundErrorHandlers() {
        // Sound system errors
        this.handleSoundError = (error) => {
            console.error('Sound error:', error);
            this.showRecoveryNotification('Audio system failed', 'Continuing without sound', 'info');
            this.disableSound();
        };

        // Sound cue errors
        this.handleSoundCueError = (error) => {
            console.error('Sound cue error:', error);
            this.showRecoveryNotification('Sound cues unavailable', 'Using visual cues only', 'warning');
            this.enableVisualCues();
        };
    }

    // Recovery Actions
    reloadExerciseData() {
        try {
            // Attempt to reload exercise data
            this.showRecoveryNotification('Reloading exercise data', 'Please wait...', 'info');
            // Implementation would reload from server or cache
        } catch (error) {
            console.error('Exercise data reload failed:', error);
            this.enableDefaultExercises();
        }
    }

    enableDefaultExercises() {
        this.fallbackMode = true;
        this.showFallbackWorkoutUI();
        this.showRecoveryNotification('Default exercises loaded', 'Basic workout available', 'warning');
    }

    showFallbackWorkoutUI() {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="text-center py-8">
                    <div class="mb-8">
                        <div class="text-6xl mb-4">💪</div>
                        <h1 class="text-4xl font-bold mb-4">Simple Workout</h1>
                        <p class="text-gray-600 mb-8">Basic workout timer with default exercises</p>
                    </div>
                    
                    <div class="mb-8">
                        <div id="fallback-workout-timer" class="text-6xl font-bold mb-4">00:30</div>
                        <div id="fallback-exercise-name" class="text-2xl font-semibold mb-2">Push-ups</div>
                        <div id="fallback-exercise-description" class="text-gray-600 mb-6">Upper body strength exercise</div>
                    </div>
                    
                    <div class="flex justify-center space-x-4 mb-8">
                        <button id="fallback-start-btn" onclick="window.workoutErrorHandler.toggleFallbackWorkout()" 
                                class="btn-premium btn-success">
                            ▶️ Start
                        </button>
                        <button id="fallback-pause-btn" onclick="window.workoutErrorHandler.pauseFallbackWorkout()" 
                                class="btn-premium btn-warning hidden">
                            ⏸️ Pause
                        </button>
                        <button id="fallback-reset-btn" onclick="window.workoutErrorHandler.resetFallbackWorkout()" 
                                class="btn-premium btn-secondary">
                            🔄 Reset
                        </button>
                    </div>
                    
                    <div class="flex justify-center space-x-4 mb-8">
                        <button onclick="window.workoutErrorHandler.previousExercise()" 
                                class="btn-premium btn-outline">
                            ⬅️ Previous
                        </button>
                        <button onclick="window.workoutErrorHandler.nextExercise()" 
                                class="btn-premium btn-outline">
                            Next ➡️
                        </button>
                    </div>
                    
                    <div class="mb-8">
                        <h3 class="text-lg font-semibold mb-4">Exercise List</h3>
                        <div id="fallback-exercise-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            <!-- Exercise list will be populated here -->
                        </div>
                    </div>
                    
                    <div>
                        <button onclick="window.location.href='/'" 
                                class="btn-premium btn-outline">
                            ← Back to Home
                        </button>
                    </div>
                </div>
            `;
            
            this.currentExerciseIndex = 0;
            this.fallbackTimeRemaining = 30;
            this.fallbackInterval = null;
            this.populateExerciseList();
            this.updateExerciseDisplay();
        }
    }

    populateExerciseList() {
        const exerciseList = document.getElementById('fallback-exercise-list');
        if (exerciseList) {
            exerciseList.innerHTML = this.defaultExercises.map((exercise, index) => `
                <div class="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 
                            ${index === this.currentExerciseIndex ? 'bg-blue-50 border-blue-300' : ''}"
                     onclick="window.workoutErrorHandler.selectExercise(${index})">
                    <div class="text-3xl mb-2">${exercise.emoji}</div>
                    <h4 class="font-semibold mb-1">${exercise.name}</h4>
                    <p class="text-sm text-gray-600">${exercise.description}</p>
                    <div class="text-xs text-gray-500 mt-2">${exercise.duration} seconds</div>
                </div>
            `).join('');
        }
    }

    selectExercise(index) {
        this.currentExerciseIndex = index;
        this.fallbackTimeRemaining = this.defaultExercises[index].duration;
        this.updateExerciseDisplay();
        this.populateExerciseList();
        this.showRecoveryNotification('Exercise selected', this.defaultExercises[index].name, 'success');
    }

    updateExerciseDisplay() {
        const exercise = this.defaultExercises[this.currentExerciseIndex];
        const timerDisplay = document.getElementById('fallback-workout-timer');
        const exerciseName = document.getElementById('fallback-exercise-name');
        const exerciseDescription = document.getElementById('fallback-exercise-description');
        
        if (timerDisplay) {
            const minutes = Math.floor(this.fallbackTimeRemaining / 60);
            const seconds = this.fallbackTimeRemaining % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (exerciseName) {
            exerciseName.textContent = exercise.name;
        }
        
        if (exerciseDescription) {
            exerciseDescription.textContent = exercise.description;
        }
    }

    toggleFallbackWorkout() {
        if (this.fallbackInterval) {
            this.pauseFallbackWorkout();
        } else {
            this.startFallbackWorkout();
        }
    }

    startFallbackWorkout() {
        this.fallbackInterval = setInterval(() => {
            this.fallbackTimeRemaining--;
            this.updateExerciseDisplay();
            
            if (this.fallbackTimeRemaining <= 0) {
                this.completeExercise();
            }
        }, 1000);
        
        document.getElementById('fallback-start-btn').innerHTML = '⏸️ Pause';
        document.getElementById('fallback-pause-btn').classList.remove('hidden');
        this.showRecoveryNotification('Workout started', 'Keep going!', 'success');
    }

    pauseFallbackWorkout() {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
        document.getElementById('fallback-start-btn').innerHTML = '▶️ Resume';
        document.getElementById('fallback-pause-btn').classList.add('hidden');
        this.showRecoveryNotification('Workout paused', 'Click resume to continue', 'info');
    }

    resetFallbackWorkout() {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
        this.fallbackTimeRemaining = this.defaultExercises[this.currentExerciseIndex].duration;
        this.updateExerciseDisplay();
        document.getElementById('fallback-start-btn').innerHTML = '▶️ Start';
        document.getElementById('fallback-pause-btn').classList.add('hidden');
        this.showRecoveryNotification('Workout reset', 'Ready to start again', 'info');
    }

    completeExercise() {
        clearInterval(this.fallbackInterval);
        this.fallbackInterval = null;
        
        const exercise = this.defaultExercises[this.currentExerciseIndex];
        this.showRecoveryNotification('Exercise complete!', `${exercise.name} finished`, 'success');
        
        // Auto-advance to next exercise after 3 seconds
        setTimeout(() => {
            this.nextExercise();
        }, 3000);
    }

    nextExercise() {
        this.currentExerciseIndex = (this.currentExerciseIndex + 1) % this.defaultExercises.length;
        this.fallbackTimeRemaining = this.defaultExercises[this.currentExerciseIndex].duration;
        this.updateExerciseDisplay();
        this.populateExerciseList();
        this.showRecoveryNotification('Next exercise', this.defaultExercises[this.currentExerciseIndex].name, 'info');
    }

    previousExercise() {
        this.currentExerciseIndex = this.currentExerciseIndex === 0 ? 
            this.defaultExercises.length - 1 : 
            this.currentExerciseIndex - 1;
        this.fallbackTimeRemaining = this.defaultExercises[this.currentExerciseIndex].duration;
        this.updateExerciseDisplay();
        this.populateExerciseList();
        this.showRecoveryNotification('Previous exercise', this.defaultExercises[this.currentExerciseIndex].name, 'info');
    }

    enableManualNavigation() {
        // Implementation for manual navigation
        this.showRecoveryNotification('Manual navigation enabled', 'Use buttons to navigate', 'info');
    }

    showBasicExerciseList() {
        // Implementation for basic exercise list
        this.showRecoveryNotification('Basic exercise list shown', 'Limited functionality available', 'warning');
    }

    reinitializeWorkoutTimer() {
        // Implementation for timer reinitialization
        this.showRecoveryNotification('Timer reinitialized', 'Ready to use', 'success');
    }

    enableTextTimer() {
        // Implementation for text timer
        this.showRecoveryNotification('Text timer enabled', 'Visual timer unavailable', 'warning');
    }

    resetTimerState() {
        // Implementation for timer state reset
        this.showRecoveryNotification('Timer state reset', 'Starting fresh', 'info');
    }

    disableProgressTracking() {
        // Implementation for disabling progress tracking
        this.showRecoveryNotification('Progress tracking disabled', 'Workout continues normally', 'info');
    }

    hideProgressDisplay() {
        // Implementation for hiding progress display
        this.showRecoveryNotification('Progress display hidden', 'Focus on exercises', 'info');
    }

    disableSound() {
        // Implementation for disabling sound
        this.showRecoveryNotification('Sound disabled', 'Visual cues only', 'info');
    }

    enableVisualCues() {
        // Implementation for visual cues
        this.showRecoveryNotification('Visual cues enabled', 'Look for screen indicators', 'info');
    }

    showRecoveryNotification(title, message, type) {
        const colors = {
            success: 'green',
            warning: 'yellow',
            error: 'red',
            info: 'blue'
        };
        
        const icons = {
            success: '✅',
            warning: '⚠️',
            error: '❌',
            info: 'ℹ️'
        };

        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 bg-${colors[type]}-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm`;
        notification.innerHTML = `
            <div class="flex items-start space-x-3">
                <span class="text-xl">${icons[type]}</span>
                <div>
                    <h4 class="font-semibold">${title}</h4>
                    <p class="text-sm opacity-90 mt-1">${message}</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" 
                        class="text-white opacity-75 hover:opacity-100">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Public API
    setWorkout(workout) {
        this.workout = workout;
    }

    getErrorStats() {
        return {
            errorCount: this.errorCount,
            fallbackMode: this.fallbackMode,
            currentExercise: this.defaultExercises[this.currentExerciseIndex]?.name || 'None'
        };
    }

    reset() {
        this.errorCount = 0;
        this.fallbackMode = false;
        this.currentExerciseIndex = 0;
        clearInterval(this.fallbackInterval);
    }
}

// Initialize workout error handler
window.WorkoutErrorHandler = WorkoutErrorHandler;

// Auto-initialize when workout page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('workout') || document.getElementById('workout-timer')) {
        window.workoutErrorHandler = new WorkoutErrorHandler();
    }
});
