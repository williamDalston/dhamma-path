/**
 * Interactive Elements Manager
 * Makes all visual elements clickable and purposeful for better user satisfaction
 */

class InteractiveElementsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupWorkoutInteractions();
        this.setupHomePageInteractions();
        this.setupTimerInteractions();
        this.setupJournalInteractions();
        this.setupInterviewInteractions();
        this.setupGeneralInteractions();
    }

    setupWorkoutInteractions() {
        // Make exercise items clickable to jump to that exercise
        const exerciseItems = document.querySelectorAll('.exercise-item');
        exerciseItems.forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.classList.add('hover:bg-forest-green/10', 'hover:border-forest-green/40', 'transition-all', 'duration-200');
            
            item.addEventListener('click', () => {
                this.jumpToExercise(index);
                this.highlightExerciseItem(item);
            });
        });

        // Make intensity buttons interactive
        const intensityBtns = document.querySelectorAll('.intensity-btn');
        intensityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectIntensity(btn);
            });
        });
    }

    setupHomePageInteractions() {
        // Make Quick Start Guide steps clickable
        const quickStartSteps = document.querySelectorAll('.group');
        quickStartSteps.forEach((step, index) => {
            step.style.cursor = 'pointer';
            step.classList.add('hover:scale-105', 'transition-transform', 'duration-200');
            
            step.addEventListener('click', () => {
                this.navigateToStep(index);
                this.highlightStep(step);
            });
        });

        // Make Smart Recommendation clickable
        const smartRecommendation = document.getElementById('smart-recommendation');
        if (smartRecommendation) {
            smartRecommendation.style.cursor = 'pointer';
            smartRecommendation.classList.add('hover:shadow-xl', 'transition-all', 'duration-300');
            
            smartRecommendation.addEventListener('click', () => {
                this.followRecommendation();
            });
        }

        // Make Social Proof clickable (show testimonials)
        const socialProof = document.querySelector('.mb-8 .flex');
        if (socialProof) {
            socialProof.style.cursor = 'pointer';
            socialProof.classList.add('hover:scale-105', 'transition-transform', 'duration-200');
            
            socialProof.addEventListener('click', () => {
                this.showTestimonials();
            });
        }
    }

    setupTimerInteractions() {
        // Make duration buttons more interactive
        const durationBtns = document.querySelectorAll('.duration-btn');
        durationBtns.forEach(btn => {
            btn.classList.add('hover:scale-105', 'transition-transform', 'duration-200');
        });

        // Make breathing guide interactive
        const breathingGuide = document.getElementById('breathing-guide');
        if (breathingGuide) {
            breathingGuide.style.cursor = 'pointer';
            breathingGuide.addEventListener('click', () => {
                this.toggleBreathingGuide();
            });
        }

        // Make meditation tips clickable for more tips
        const meditationTips = document.querySelectorAll('#meditation-tips');
        meditationTips.forEach(tip => {
            tip.style.cursor = 'pointer';
            tip.addEventListener('click', () => {
                this.showMoreTips();
            });
        });
    }

    setupJournalInteractions() {
        // Make writing prompts clickable
        const writingPrompts = document.querySelectorAll('.writing-prompt');
        writingPrompts.forEach(prompt => {
            prompt.style.cursor = 'pointer';
            prompt.classList.add('hover:bg-forest-green/10', 'transition-all', 'duration-200');
            
            prompt.addEventListener('click', () => {
                this.usePrompt(prompt);
            });
        });

        // Make mood tracker interactive
        const moodButtons = document.querySelectorAll('.mood-btn');
        moodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectMood(btn);
            });
        });

        // Make recent entries clickable
        const recentEntries = document.querySelectorAll('.recent-entry');
        recentEntries.forEach(entry => {
            entry.style.cursor = 'pointer';
            entry.classList.add('hover:bg-forest-green/5', 'transition-all', 'duration-200');
            
            entry.addEventListener('click', () => {
                this.loadEntry(entry);
            });
        });
    }

    setupInterviewInteractions() {
        // Make question categories clickable
        const questionCategories = document.querySelectorAll('.question-category');
        questionCategories.forEach(category => {
            category.style.cursor = 'pointer';
            category.classList.add('hover:bg-forest-green/10', 'transition-all', 'duration-200');
            
            category.addEventListener('click', () => {
                this.selectCategory(category);
            });
        });

        // Make practice tips clickable
        const practiceTips = document.querySelectorAll('.practice-tip');
        practiceTips.forEach(tip => {
            tip.style.cursor = 'pointer';
            tip.addEventListener('click', () => {
                this.expandTip(tip);
            });
        });

        // Make recording button more interactive
        const recordBtn = document.getElementById('record-btn');
        if (recordBtn) {
            recordBtn.addEventListener('click', () => {
                this.toggleRecording();
            });
        }
    }

    setupGeneralInteractions() {
        // Add hover effects to all cards
        const cards = document.querySelectorAll('.card-premium');
        cards.forEach(card => {
            card.classList.add('hover:shadow-xl', 'transition-all', 'duration-300');
        });

        // Make all buttons more interactive
        const buttons = document.querySelectorAll('.btn-premium');
        buttons.forEach(btn => {
            btn.classList.add('hover:scale-105', 'transition-transform', 'duration-200');
        });
    }

    // Workout-specific interactions
    jumpToExercise(exerciseIndex) {
        console.log(`🏃‍♂️ Jumping to exercise ${exerciseIndex + 1}`);
        
        // Update the current exercise display
        const exercises = [
            { name: 'Jumping Jacks', emoji: '🏃‍♂️', description: 'Start with feet together, arms at sides. Jump up spreading feet shoulder-width apart while bringing arms overhead.', formTips: ['Keep your core engaged', 'Land softly on your toes', 'Maintain steady breathing'], coachTip: 'Start at your own pace. Quality over quantity!' },
            { name: 'Wall Sit', emoji: '🧘‍♂️', description: 'Sit against a wall with your legs at a 90-degree angle. Hold this position.', formTips: ['Keep your back flat against the wall', 'Knees directly over ankles', 'Breathe normally throughout'], coachTip: 'Focus on maintaining proper form over duration.' },
            { name: 'Push-ups', emoji: '🦵', description: 'Start in plank position. Lower your chest to the ground and push back up.', formTips: ['Keep your body straight', 'Lower chest to ground', 'Push through your palms'], coachTip: 'Modify by doing knee push-ups if needed.' },
            { name: 'Abdominal Crunch', emoji: '💺', description: 'Lie on your back, knees bent. Lift your shoulders off the ground.', formTips: ['Keep your lower back on the ground', 'Lift with your abs, not your neck', 'Exhale as you lift'], coachTip: 'Focus on quality contractions over speed.' },
            { name: 'Step-up onto Chair', emoji: '🪑', description: 'Step up onto a chair with one foot, then the other. Step back down.', formTips: ['Use a stable chair', 'Step up with control', 'Alternate leading leg'], coachTip: 'Keep your knee aligned over your ankle.' },
            { name: 'Squats', emoji: '🦵', description: 'Stand with feet shoulder-width apart. Lower down as if sitting in a chair.', formTips: ['Keep your chest up', 'Knees behind your toes', 'Weight in your heels'], coachTip: 'Go as low as you can while maintaining form.' },
            { name: 'Triceps Dip on Chair', emoji: '🪑', description: 'Sit on edge of chair, hands beside hips. Lower your body and push back up.', formTips: ['Keep your elbows close to your body', 'Lower with control', 'Use your triceps to push up'], coachTip: 'Keep your legs straight for more challenge.' },
            { name: 'Plank', emoji: '🧘‍♂️', description: 'Hold a push-up position with straight arms and engaged core.', formTips: ['Keep your body straight', 'Engage your core', 'Breathe normally'], coachTip: 'Focus on maintaining perfect form throughout.' },
            { name: 'High Knees Running in Place', emoji: '🦵', description: 'Run in place while bringing your knees up high.', formTips: ['Lift knees to hip height', 'Pump your arms', 'Stay light on your feet'], coachTip: 'Maintain a steady rhythm and pace.' },
            { name: 'Lunges', emoji: '🦵', description: 'Step forward with one leg, lowering your hips until both knees are at 90 degrees.', formTips: ['Keep your front knee over your ankle', 'Lower back knee toward ground', 'Push back up with front leg'], coachTip: 'Alternate legs or complete all reps on one side first.' },
            { name: 'Push-up and Rotation', emoji: '🦵', description: 'Do a push-up, then rotate to a side plank position.', formTips: ['Complete the push-up first', 'Rotate to side plank', 'Hold the rotation briefly'], coachTip: 'This is advanced - modify as needed.' },
            { name: 'Side Plank', emoji: '🧘‍♂️', description: 'Lie on your side, prop yourself up on your forearm. Hold this position.', formTips: ['Keep your body straight', 'Engage your core', 'Don\'t let your hips sag'], coachTip: 'Start with knees bent if needed.' }
        ];

        if (exercises[exerciseIndex]) {
            const exercise = exercises[exerciseIndex];
            
            // Update the main exercise display
            const exerciseName = document.getElementById('exercise-name');
            const exerciseEmoji = document.getElementById('exercise-emoji');
            const exerciseDescription = document.getElementById('exercise-description');
            const formTipsList = document.querySelector('.bg-forest-green/5 .space-y-1');
            const coachTip = document.getElementById('workout-coach-tip');
            
            if (exerciseName) exerciseName.textContent = exercise.name;
            if (exerciseEmoji) exerciseEmoji.textContent = exercise.emoji;
            if (exerciseDescription) exerciseDescription.textContent = exercise.description;
            if (formTipsList) {
                formTipsList.innerHTML = exercise.formTips.map(tip => `<li>• ${tip}</li>`).join('');
            }
            if (coachTip) coachTip.textContent = exercise.coachTip;
            
            // Update exercise progress
            this.updateExerciseProgress(exerciseIndex);
            
            // Show success feedback
            this.showFeedback(`Jumped to ${exercise.name}! 🎯`, 'success');
            
            // Scroll to exercise display
            const exerciseDisplay = document.querySelector('.card-premium');
            if (exerciseDisplay) {
                exerciseDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
    
    updateExerciseProgress(exerciseIndex) {
        // Update progress tracking
        const progressData = JSON.parse(localStorage.getItem('exerciseProgress') || '{}');
        const today = new Date().toDateString();
        
        if (!progressData[today]) {
            progressData[today] = { exercises: [], totalTime: 0 };
        }
        
        if (!progressData[today].exercises.includes(exerciseIndex)) {
            progressData[today].exercises.push(exerciseIndex);
            localStorage.setItem('exerciseProgress', JSON.stringify(progressData));
        }
        
        // Update progress display
        this.updateProgressDisplay(progressData[today]);
    }
    
    updateProgressDisplay(progressData) {
        const progressDisplay = document.querySelector('.grid.grid-cols-3.gap-4.text-center');
        if (progressDisplay) {
            const sessionsCount = Object.keys(JSON.parse(localStorage.getItem('exerciseProgress') || '{}')).length;
            const totalExercises = progressData.exercises.length;
            const streakDays = this.calculateStreak();
            
            progressDisplay.innerHTML = `
                <div>
                    <div class="text-2xl font-bold text-forest-green">${sessionsCount}</div>
                    <div class="text-sm text-charcoal/60">Sessions</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-earth-gold">${totalExercises}</div>
                    <div class="text-sm text-charcoal/60">Exercises</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-forest-green">${streakDays}</div>
                    <div class="text-sm text-charcoal/60">Streak</div>
                </div>
            `;
        }
    }
    
    calculateStreak() {
        const progressData = JSON.parse(localStorage.getItem('exerciseProgress') || '{}');
        const dates = Object.keys(progressData).sort().reverse();
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < dates.length; i++) {
            const date = new Date(dates[i]);
            const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === i) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    highlightExerciseItem(item) {
        // Remove highlight from all items
        document.querySelectorAll('.exercise-item').forEach(i => {
            i.classList.remove('border-forest-green/40', 'bg-forest-green/10');
            i.classList.add('border-gray-200');
        });
        
        // Highlight clicked item
        item.classList.remove('border-gray-200');
        item.classList.add('border-forest-green/40', 'bg-forest-green/10');
    }

    selectIntensity(btn) {
        // Remove active class from all intensity buttons
        document.querySelectorAll('.intensity-btn').forEach(b => {
            b.classList.remove('active', 'bg-forest-green/20', 'border-forest-green');
            b.classList.add('border-forest-green/30');
        });
        
        // Add active class to clicked button
        btn.classList.add('active', 'bg-forest-green/20', 'border-forest-green');
        btn.classList.remove('border-forest-green/30');
        
        // Update intensity description
        const intensity = btn.dataset.intensity;
        const description = document.getElementById('intensity-description');
        if (description) {
            const descriptions = {
                low: 'Low intensity: 20 seconds work, 20 seconds rest',
                medium: 'Medium intensity: 30 seconds work, 10 seconds rest',
                high: 'High intensity: 40 seconds work, 5 seconds rest'
            };
            description.textContent = descriptions[intensity] || descriptions.medium;
        }
        
        this.showFeedback(`Intensity set to ${intensity}! 💪`);
    }

    // Home page interactions
    navigateToStep(stepIndex) {
        const steps = ['timer', 'journal', 'workout'];
        const stepNames = ['Meditation', 'Journaling', 'Workout'];
        
        if (steps[stepIndex]) {
            this.showFeedback(`Navigating to ${stepNames[stepIndex]}... 🚀`);
            
            // Navigate to the appropriate page
            setTimeout(() => {
                if (window.navigationManager) {
                    window.navigationManager.navigateToPage(steps[stepIndex]);
                }
            }, 500);
        }
    }

    highlightStep(step) {
        // Add a subtle animation
        step.style.transform = 'scale(1.05)';
        setTimeout(() => {
            step.style.transform = '';
        }, 200);
    }

    followRecommendation() {
        this.showFeedback('Following your personalized recommendation! ✨');
        
        // Navigate to recommended page (default to timer)
        setTimeout(() => {
            if (window.navigationManager) {
                window.navigationManager.navigateToPage('timer');
            }
        }, 500);
    }

    showTestimonials() {
        this.showFeedback('Loading testimonials... 👥');
        
        // Create a simple testimonial modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 class="text-xl font-bold mb-4">What People Are Saying</h3>
                <div class="space-y-3 text-sm">
                    <p>"MorningFlow transformed my mornings! I feel so much more energized." - Sarah</p>
                    <p>"The guided meditation is exactly what I needed to start my day right." - Mike</p>
                    <p>"Simple, effective, and beautiful. Love it!" - Jessica</p>
                </div>
                <button onclick="this.closest('.fixed').remove()" class="btn-premium btn-sm mt-4 w-full">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Timer interactions
    toggleBreathingGuide() {
        const breathingGuide = document.getElementById('breathing-guide');
        if (breathingGuide) {
            breathingGuide.style.display = breathingGuide.style.display === 'none' ? 'block' : 'none';
            this.showFeedback('Breathing guide toggled! 🌬️');
        }
    }

    showMoreTips() {
        const tips = [
            "Focus on your breath. When your mind wanders, gently return your attention to breathing.",
            "Find a comfortable position. You don't need to sit cross-legged if that's uncomfortable.",
            "Start with shorter sessions and gradually increase the duration.",
            "Don't judge your thoughts. Simply observe them and let them pass.",
            "Consistency is more important than perfection. Even 5 minutes daily makes a difference."
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const tipElement = document.getElementById('meditation-tip-text');
        if (tipElement) {
            tipElement.textContent = randomTip;
            this.showFeedback('New tip loaded! 💡');
        }
    }

    // Journal interactions
    usePrompt(prompt) {
        const promptText = prompt.textContent;
        const textarea = document.querySelector('#journal-textarea');
        if (textarea) {
            textarea.value = promptText;
            textarea.focus();
            this.showFeedback('Prompt applied! ✍️');
        }
    }

    selectMood(btn) {
        // Remove active class from all mood buttons
        document.querySelectorAll('.mood-btn').forEach(b => {
            b.classList.remove('active', 'bg-forest-green/20', 'scale-110', 'shadow-lg');
            b.classList.add('hover:bg-forest-green/10');
        });
        
        // Add active class to clicked button
        btn.classList.add('active', 'bg-forest-green/20', 'scale-110', 'shadow-lg');
        btn.classList.remove('hover:bg-forest-green/10');
        
        const mood = btn.dataset.mood;
        const moodName = btn.title || 'this mood';
        
        // Store mood in localStorage
        localStorage.setItem('currentMood', mood);
        localStorage.setItem('moodTimestamp', Date.now());
        
        // Update mood display
        this.updateMoodDisplay(mood, moodName);
        
        // Show feedback with mood-specific message
        this.showFeedback(`Feeling ${moodName.toLowerCase()} today! ${mood}`, 'success');
        
        // Add mood to journal entry if textarea exists
        this.addMoodToJournal(mood, moodName);
    }
    
    updateMoodDisplay(mood, moodName) {
        // Update any mood display elements
        const moodDisplay = document.getElementById('mood-display');
        if (moodDisplay) {
            moodDisplay.innerHTML = `
                <span class="text-2xl mr-2">${mood}</span>
                <span class="text-sm text-charcoal/70">${moodName}</span>
            `;
        }
        
        // Update mood in any statistics
        this.updateMoodStats(mood);
    }
    
    addMoodToJournal(mood, moodName) {
        const textarea = document.getElementById('journal-textarea');
        if (textarea && textarea.value.trim() === '') {
            const moodPrompts = {
                '😊': 'I\'m feeling happy and grateful today. ',
                '😌': 'I\'m feeling calm and centered. ',
                '🤔': 'I\'m feeling thoughtful and reflective. ',
                '😴': 'I\'m feeling tired but hopeful. ',
                '😤': 'I\'m feeling frustrated but I know this will pass. '
            };
            
            const prompt = moodPrompts[mood] || `I\'m feeling ${moodName.toLowerCase()} today. `;
            textarea.value = prompt;
            textarea.focus();
        }
    }
    
    updateMoodStats(mood) {
        // Update mood statistics
        const today = new Date().toDateString();
        const moodStats = JSON.parse(localStorage.getItem('moodStats') || '{}');
        
        if (!moodStats[today]) {
            moodStats[today] = [];
        }
        
        moodStats[today].push({
            mood: mood,
            timestamp: Date.now()
        });
        
        localStorage.setItem('moodStats', JSON.stringify(moodStats));
        
        // Update any mood statistics display
        this.displayMoodStats(moodStats);
    }
    
    displayMoodStats(moodStats) {
        const statsContainer = document.getElementById('mood-stats');
        if (!statsContainer) return;
        
        const recentMoods = Object.keys(moodStats)
            .sort()
            .slice(-7) // Last 7 days
            .map(date => moodStats[date])
            .flat();
        
        if (recentMoods.length > 0) {
            const moodCounts = recentMoods.reduce((acc, entry) => {
                acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                return acc;
            }, {});
            
            const topMood = Object.keys(moodCounts).reduce((a, b) => 
                moodCounts[a] > moodCounts[b] ? a : b
            );
            
            statsContainer.innerHTML = `
                <div class="text-center">
                    <p class="text-sm text-charcoal/70 mb-2">Recent mood trend</p>
                    <div class="text-2xl">${topMood}</div>
                    <p class="text-xs text-charcoal/60">Most common this week</p>
                </div>
            `;
        }
    }

    loadEntry(entry) {
        const entryText = entry.textContent;
        const textarea = document.querySelector('#journal-textarea');
        if (textarea) {
            textarea.value = entryText;
            textarea.focus();
            this.showFeedback('Entry loaded! 📖');
        }
    }

    // Interview interactions
    selectCategory(category) {
        // Remove active class from all categories
        document.querySelectorAll('.question-category').forEach(c => {
            c.classList.remove('active', 'bg-forest-green/20');
        });
        
        // Add active class to clicked category
        category.classList.add('active', 'bg-forest-green/20');
        
        const categoryName = category.textContent;
        this.showFeedback(`Selected ${categoryName} category! 🎯`);
    }

    expandTip(tip) {
        // Toggle tip expansion
        const isExpanded = tip.dataset.expanded === 'true';
        tip.dataset.expanded = !isExpanded;
        
        if (isExpanded) {
            tip.classList.remove('h-20');
            tip.classList.add('h-auto');
        } else {
            tip.classList.remove('h-auto');
            tip.classList.add('h-20');
        }
        
        this.showFeedback('Tip expanded! 💡');
    }

    toggleRecording() {
        const recordBtn = document.getElementById('record-btn');
        if (recordBtn) {
            const isRecording = recordBtn.dataset.recording === 'true';
            recordBtn.dataset.recording = !isRecording;
            
            if (isRecording) {
                recordBtn.innerHTML = '<span class="text-lg mr-2">🎤</span>Start Recording';
                recordBtn.classList.remove('bg-red-500');
                this.showFeedback('Recording stopped! 🛑');
            } else {
                recordBtn.innerHTML = '<span class="text-lg mr-2">⏹️</span>Stop Recording';
                recordBtn.classList.add('bg-red-500');
                this.showFeedback('Recording started! 🔴');
            }
        }
    }

    // Utility function for user feedback
    showFeedback(message) {
        // Create a toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-forest-green text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 2 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveElementsManager = new InteractiveElementsManager();
});

// Export for use in other modules
window.InteractiveElementsManager = InteractiveElementsManager;
