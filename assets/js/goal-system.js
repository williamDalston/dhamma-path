/**
 * Goal Setting and Tracking System
 * Comprehensive goal management with SMART goals, progress tracking, and motivation
 */

class GoalSystem {
    constructor() {
        this.goals = [];
        this.categories = {
            mindfulness: { name: 'Mindfulness', icon: '🧘', color: '#7A9B7A' },
            productivity: { name: 'Productivity', icon: '📝', color: '#1A4D3A' },
            health: { name: 'Health & Wellness', icon: '💪', color: '#D4AF37' },
            personal: { name: 'Personal Growth', icon: '🌱', color: '#8B4513' },
            creativity: { name: 'Creativity', icon: '🎨', color: '#6A5ACD' }
        };
        
        this.goalTypes = {
            streak: { name: 'Streak Goal', description: 'Maintain a continuous streak' },
            frequency: { name: 'Frequency Goal', description: 'Complete activity X times per week' },
            duration: { name: 'Duration Goal', description: 'Spend X minutes on activity' },
            milestone: { name: 'Milestone Goal', description: 'Reach a specific number' },
            habit: { name: 'Habit Formation', description: 'Build a new habit' }
        };
        
        this.initializeGoalSystem();
    }
    
    initializeGoalSystem() {
        this.loadGoals();
        this.setupGoalTemplates();
        this.setupGoalTracking();
        this.setupGoalEvents();
        this.createGoalInterface();
    }
    
    loadGoals() {
        const stored = localStorage.getItem('user-goals');
        if (stored) {
            this.goals = JSON.parse(stored).map(goal => ({
                ...goal,
                startDate: new Date(goal.startDate),
                targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
                lastUpdated: new Date(goal.lastUpdated)
            }));
        }
        
        this.updateAllGoalProgress();
    }
    
    saveGoals() {
        localStorage.setItem('user-goals', JSON.stringify(this.goals));
    }
    
    setupGoalTemplates() {
        this.goalTemplates = {
            beginner: [
                {
                    title: '7-Day Meditation Streak',
                    description: 'Meditate for at least 5 minutes every day for 7 consecutive days',
                    category: 'mindfulness',
                    type: 'streak',
                    target: 7,
                    unit: 'days',
                    activity: 'meditation',
                    icon: '🔥',
                    difficulty: 'beginner'
                },
                {
                    title: 'Morning Journal Habit',
                    description: 'Write in your journal 5 times per week',
                    category: 'productivity',
                    type: 'frequency',
                    target: 5,
                    unit: 'times per week',
                    activity: 'journal',
                    icon: '📝',
                    difficulty: 'beginner'
                },
                {
                    title: 'Gratitude Practice',
                    description: 'Practice gratitude 3 times per week',
                    category: 'mindfulness',
                    type: 'frequency',
                    target: 3,
                    unit: 'times per week',
                    activity: 'gratitude',
                    icon: '🙏',
                    difficulty: 'beginner'
                }
            ],
            intermediate: [
                {
                    title: '30-Day Meditation Challenge',
                    description: 'Meditate for 10+ minutes every day for 30 days',
                    category: 'mindfulness',
                    type: 'streak',
                    target: 30,
                    unit: 'days',
                    activity: 'meditation',
                    icon: '🏆',
                    difficulty: 'intermediate'
                },
                {
                    title: 'Deep Journaling',
                    description: 'Write 500+ words in your journal 4 times per week',
                    category: 'productivity',
                    type: 'frequency',
                    target: 4,
                    unit: 'times per week',
                    activity: 'journal',
                    icon: '📖',
                    difficulty: 'intermediate'
                },
                {
                    title: 'Fitness Routine',
                    description: 'Complete workout sessions 3 times per week',
                    category: 'health',
                    type: 'frequency',
                    target: 3,
                    unit: 'times per week',
                    activity: 'workout',
                    icon: '💪',
                    difficulty: 'intermediate'
                }
            ],
            advanced: [
                {
                    title: '100-Day Mindfulness Journey',
                    description: 'Complete all morning routine activities for 100 consecutive days',
                    category: 'mindfulness',
                    type: 'streak',
                    target: 100,
                    unit: 'days',
                    activity: 'all',
                    icon: '🌟',
                    difficulty: 'advanced'
                },
                {
                    title: 'Writing Mastery',
                    description: 'Write 1000+ words daily for 30 days',
                    category: 'productivity',
                    type: 'streak',
                    target: 30,
                    unit: 'days',
                    activity: 'journal',
                    icon: '✍️',
                    difficulty: 'advanced'
                },
                {
                    title: 'Zen Master',
                    description: 'Meditate for 30+ minutes daily for 60 days',
                    category: 'mindfulness',
                    type: 'duration',
                    target: 30,
                    unit: 'minutes daily',
                    activity: 'meditation',
                    icon: '🧘‍♂️',
                    difficulty: 'advanced'
                }
            ]
        };
    }
    
    createGoal(goalData) {
        const goal = {
            id: this.generateGoalId(),
            title: goalData.title,
            description: goalData.description,
            category: goalData.category,
            type: goalData.type,
            activity: goalData.activity,
            target: goalData.target,
            unit: goalData.unit,
            current: 0,
            startDate: new Date(),
            targetDate: goalData.targetDate ? new Date(goalData.targetDate) : this.calculateTargetDate(goalData),
            status: 'active',
            priority: goalData.priority || 'medium',
            icon: goalData.icon || this.getDefaultIcon(goalData.category),
            difficulty: goalData.difficulty || 'intermediate',
            milestones: this.generateMilestones(goalData),
            lastUpdated: new Date(),
            streak: 0,
            bestStreak: 0,
            completionRate: 0,
            motivationalMessage: this.generateMotivationalMessage(goalData)
        };
        
        this.goals.push(goal);
        this.saveGoals();
        this.updateGoalProgress(goal.id);
        
        // Trigger goal creation event
        document.dispatchEvent(new CustomEvent('goalCreated', { detail: { goal } }));
        
        return goal;
    }
    
    generateGoalId() {
        return 'goal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    calculateTargetDate(goalData) {
        const daysToAdd = {
            'streak': goalData.target,
            'frequency': goalData.target * 7, // Assume weekly frequency
            'duration': 30, // Default 30 days for duration goals
            'milestone': 60, // Default 60 days for milestone goals
            'habit': 21 // 21 days to form a habit
        };
        
        const days = daysToAdd[goalData.type] || 30;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        return targetDate;
    }
    
    generateMilestones(goalData) {
        const milestones = [];
        const target = goalData.target;
        
        // Generate milestones at 25%, 50%, 75%, and 100%
        const percentages = [0.25, 0.5, 0.75, 1.0];
        
        percentages.forEach((percentage, index) => {
            const milestoneValue = Math.floor(target * percentage);
            if (milestoneValue > 0 && milestoneValue <= target) {
                milestones.push({
                    value: milestoneValue,
                    percentage: percentage * 100,
                    achieved: false,
                    achievedDate: null,
                    reward: this.getMilestoneReward(index + 1)
                });
            }
        });
        
        return milestones;
    }
    
    getMilestoneReward(level) {
        const rewards = {
            1: { emoji: '🎯', message: 'Great start! You\'re on your way!' },
            2: { emoji: '🔥', message: 'Halfway there! Keep the momentum going!' },
            3: { emoji: '⚡', message: 'Almost there! You\'re doing amazing!' },
            4: { emoji: '🏆', message: 'Goal achieved! You\'re incredible!' }
        };
        
        return rewards[level] || { emoji: '🌟', message: 'Milestone reached!' };
    }
    
    generateMotivationalMessage(goalData) {
        const messages = {
            mindfulness: [
                'Every moment of mindfulness brings you closer to inner peace.',
                'Your commitment to mindfulness is transforming your life.',
                'Each meditation session is a gift you give to yourself.'
            ],
            productivity: [
                'Your dedication to growth is inspiring.',
                'Every word you write is progress toward your dreams.',
                'Consistency is the key to mastery.'
            ],
            health: [
                'Your body is your temple - treat it with love.',
                'Every workout is an investment in your future self.',
                'Strength comes from within, but it needs nurturing.'
            ]
        };
        
        const categoryMessages = messages[goalData.category] || messages.productivity;
        return categoryMessages[Math.floor(Math.random() * categoryMessages.length)];
    }
    
    getDefaultIcon(category) {
        return this.categories[category]?.icon || '🎯';
    }
    
    updateGoalProgress(goalId) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal) return;
        
        const progress = this.calculateGoalProgress(goal);
        goal.current = progress.current;
        goal.completionRate = progress.percentage;
        goal.lastUpdated = new Date();
        
        // Check for milestone achievements
        this.checkMilestones(goal);
        
        // Update goal status
        if (goal.completionRate >= 100) {
            goal.status = 'completed';
            this.handleGoalCompletion(goal);
        } else if (this.isGoalOverdue(goal)) {
            goal.status = 'overdue';
        }
        
        this.saveGoals();
    }
    
    updateAllGoalProgress() {
        this.goals.forEach(goal => {
            if (goal.status === 'active') {
                this.updateGoalProgress(goal.id);
            }
        });
    }
    
    calculateGoalProgress(goal) {
        if (!window.dataPersistence) {
            return { current: 0, percentage: 0 };
        }
        
        let current = 0;
        let percentage = 0;
        
        switch (goal.type) {
            case 'streak':
                current = window.dataPersistence.getStreak(goal.activity).current;
                percentage = Math.min((current / goal.target) * 100, 100);
                break;
                
            case 'frequency':
                const weeklyData = this.getWeeklyActivityData(goal.activity);
                current = weeklyData.completed;
                percentage = Math.min((current / goal.target) * 100, 100);
                break;
                
            case 'duration':
                const durationData = this.getDurationData(goal.activity);
                current = durationData.totalMinutes;
                percentage = Math.min((current / (goal.target * this.getDaysSinceStart(goal))) * 100, 100);
                break;
                
            case 'milestone':
                const milestoneData = window.dataPersistence.getAnalytics(goal.activity, 365);
                current = milestoneData.totalSessions;
                percentage = Math.min((current / goal.target) * 100, 100);
                break;
        }
        
        return { current: Math.floor(current), percentage: Math.floor(percentage) };
    }
    
    getWeeklyActivityData(activity) {
        // Get activity data for current week
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        
        // This would integrate with actual data persistence
        return { completed: 3, total: 7 }; // Mock data
    }
    
    getDurationData(activity) {
        // Get total duration for activity
        if (!window.dataPersistence) return { totalMinutes: 0 };
        
        const data = window.dataPersistence.getAnalytics(activity, 365);
        return { totalMinutes: data.totalDuration || 0 };
    }
    
    getDaysSinceStart(goal) {
        const now = new Date();
        const diffTime = Math.abs(now - goal.startDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    
    checkMilestones(goal) {
        goal.milestones.forEach(milestone => {
            if (!milestone.achieved && goal.current >= milestone.value) {
                milestone.achieved = true;
                milestone.achievedDate = new Date();
                this.celebrateMilestone(goal, milestone);
            }
        });
    }
    
    celebrateMilestone(goal, milestone) {
        // Create celebration notification
        const celebration = {
            type: 'milestone',
            title: `${milestone.reward.emoji} Milestone Achieved!`,
            message: `${goal.title} - ${milestone.reward.message}`,
            goal: goal.title,
            milestone: milestone.value,
            timestamp: new Date()
        };
        
        // Show celebration UI
        this.showMilestoneCelebration(celebration);
        
        // Trigger milestone event
        document.dispatchEvent(new CustomEvent('milestoneAchieved', { detail: { goal, milestone, celebration } }));
    }
    
    showMilestoneCelebration(celebration) {
        const celebrationDiv = document.createElement('div');
        celebrationDiv.className = 'milestone-celebration fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-gold-rich to-forest-deep text-white p-6 rounded-xl shadow-2xl border-4 border-gold-rich/50 max-w-md text-center';
        
        celebrationDiv.innerHTML = `
            <div class="celebration-content">
                <div class="text-4xl mb-2">${celebration.title.split(' ')[0]}</div>
                <h3 class="text-xl font-bold mb-2">${celebration.title}</h3>
                <p class="text-gold-pale mb-4">${celebration.message}</p>
                <div class="celebration-details text-sm text-gold-pale/80">
                    <div>Goal: ${celebration.goal}</div>
                    <div>Milestone: ${celebration.milestone}</div>
                </div>
                <button class="celebration-close mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200">
                    Amazing! 🎉
                </button>
            </div>
        `;
        
        document.body.appendChild(celebrationDiv);
        
        // Add animation
        celebrationDiv.style.animation = 'scaleIn 0.5s ease-out';
        
        // Auto-remove after 5 seconds or on click
        setTimeout(() => {
            if (celebrationDiv.parentNode) {
                celebrationDiv.remove();
            }
        }, 5000);
        
        celebrationDiv.querySelector('.celebration-close').addEventListener('click', () => {
            celebrationDiv.remove();
        });
    }
    
    handleGoalCompletion(goal) {
        // Create completion celebration
        const completion = {
            type: 'completion',
            title: '🏆 Goal Completed!',
            message: `Congratulations! You've successfully completed "${goal.title}"`,
            goal: goal.title,
            completionDate: new Date(),
            duration: this.getDaysSinceStart(goal)
        };
        
        // Show completion celebration
        this.showGoalCompletion(completion);
        
        // Trigger completion event
        document.dispatchEvent(new CustomEvent('goalCompleted', { detail: { goal, completion } }));
        
        // Suggest next goal
        setTimeout(() => {
            this.suggestNextGoal(goal);
        }, 3000);
    }
    
    showGoalCompletion(completion) {
        const completionDiv = document.createElement('div');
        completionDiv.className = 'goal-completion fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-forest-deep to-sage-deep text-white p-8 rounded-xl shadow-2xl border-4 border-gold-rich/50 max-w-lg text-center';
        
        completionDiv.innerHTML = `
            <div class="completion-content">
                <div class="text-6xl mb-4">🏆</div>
                <h2 class="text-2xl font-bold mb-4">Goal Completed!</h2>
                <p class="text-lg mb-4">${completion.message}</p>
                <div class="completion-stats bg-white/10 rounded-lg p-4 mb-4">
                    <div class="text-sm text-gold-pale/80">
                        Duration: ${completion.duration} days
                    </div>
                </div>
                <button class="completion-close bg-gold-rich hover:bg-gold-rich/80 text-forest-deep px-6 py-3 rounded-lg font-semibold transition-all duration-200">
                    Incredible! 🌟
                </button>
            </div>
        `;
        
        document.body.appendChild(completionDiv);
        
        // Add confetti animation
        this.createConfettiAnimation(completionDiv);
        
        // Auto-remove after 8 seconds or on click
        setTimeout(() => {
            if (completionDiv.parentNode) {
                completionDiv.remove();
            }
        }, 8000);
        
        completionDiv.querySelector('.completion-close').addEventListener('click', () => {
            completionDiv.remove();
        });
    }
    
    createConfettiAnimation(container) {
        // Simple confetti effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.cssText = `
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: ${['#D4AF37', '#7A9B7A', '#1A4D3A'][Math.floor(Math.random() * 3)]};
                    left: ${Math.random() * 100}%;
                    top: -10px;
                    animation: confettiFall 3s linear forwards;
                    pointer-events: none;
                `;
                
                container.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, 3000);
            }, i * 50);
        }
    }
    
    suggestNextGoal(completedGoal) {
        const suggestions = this.getGoalSuggestions(completedGoal);
        if (suggestions.length === 0) return;
        
        const suggestion = suggestions[0]; // Take the first suggestion
        
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'goal-suggestion fixed bottom-4 right-4 z-40 bg-white border border-sage-deep/20 rounded-lg p-4 shadow-lg max-w-sm';
        
        suggestionDiv.innerHTML = `
            <div class="suggestion-content">
                <div class="flex items-center mb-2">
                    <span class="text-lg mr-2">💡</span>
                    <h4 class="font-semibold text-forest-deep">Ready for your next challenge?</h4>
                </div>
                <p class="text-sm text-charcoal/70 mb-3">${suggestion.title}</p>
                <div class="flex space-x-2">
                    <button class="accept-suggestion bg-sage-deep hover:bg-sage-deep/80 text-white px-3 py-1 rounded text-sm transition-colors">
                        Yes, let's go!
                    </button>
                    <button class="dismiss-suggestion text-sage-deep hover:text-forest-deep px-3 py-1 text-sm transition-colors">
                        Maybe later
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(suggestionDiv);
        
        suggestionDiv.querySelector('.accept-suggestion').addEventListener('click', () => {
            this.createGoal(suggestion);
            suggestionDiv.remove();
        });
        
        suggestionDiv.querySelector('.dismiss-suggestion').addEventListener('click', () => {
            suggestionDiv.remove();
        });
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (suggestionDiv.parentNode) {
                suggestionDiv.remove();
            }
        }, 10000);
    }
    
    getGoalSuggestions(completedGoal) {
        // Suggest goals based on completed goal
        const suggestions = [];
        
        if (completedGoal.type === 'streak' && completedGoal.target < 30) {
            // Suggest longer streak
            suggestions.push({
                title: `${completedGoal.target * 2}-Day ${completedGoal.activity} Streak`,
                description: `Take your ${completedGoal.activity} practice to the next level`,
                category: completedGoal.category,
                type: 'streak',
                target: completedGoal.target * 2,
                activity: completedGoal.activity,
                difficulty: 'intermediate'
            });
        }
        
        if (completedGoal.activity === 'meditation') {
            // Suggest journaling
            suggestions.push({
                title: 'Journaling Companion',
                description: 'Add journaling to complement your meditation practice',
                category: 'productivity',
                type: 'frequency',
                target: 3,
                activity: 'journal',
                difficulty: 'beginner'
            });
        }
        
        return suggestions;
    }
    
    isGoalOverdue(goal) {
        if (!goal.targetDate) return false;
        return new Date() > goal.targetDate && goal.status === 'active';
    }
    
    createGoalInterface() {
        // Add goal button to navigation
        this.addGoalButtonToNavigation();
    }
    
    addGoalButtonToNavigation() {
        // This would add a goals button to the main navigation
        document.addEventListener('DOMContentLoaded', () => {
            const nav = document.querySelector('.navigation');
            if (nav) {
                const goalButton = document.createElement('button');
                goalButton.className = 'nav-item goal-nav-btn';
                goalButton.innerHTML = `
                    <span class="nav-icon">🎯</span>
                    <span class="nav-label">Goals</span>
                `;
                
                goalButton.addEventListener('click', () => {
                    this.showGoalsPage();
                });
                
                nav.appendChild(goalButton);
            }
        });
    }
    
    showGoalsPage() {
        // Create goals page
        const goalsPage = document.createElement('div');
        goalsPage.className = 'goals-page min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6';
        
        goalsPage.innerHTML = `
            <div class="goals-container max-w-6xl mx-auto">
                <div class="goals-header text-center mb-8">
                    <h1 class="text-3xl font-bold text-forest-deep mb-2">Your Goals</h1>
                    <p class="text-charcoal/70">Track your progress and achieve your dreams</p>
                    <button class="create-goal-btn bg-sage-deep hover:bg-sage-deep/80 text-white px-6 py-3 rounded-lg mt-4 transition-colors">
                        Create New Goal
                    </button>
                </div>
                
                <div class="goals-content">
                    ${this.renderActiveGoals()}
                    ${this.renderGoalTemplates()}
                    ${this.renderCompletedGoals()}
                </div>
            </div>
        `;
        
        // Replace main content
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = '';
            mainContent.appendChild(goalsPage);
        }
        
        // Add event listeners
        goalsPage.querySelector('.create-goal-btn').addEventListener('click', () => {
            this.showCreateGoalModal();
        });
    }
    
    renderActiveGoals() {
        const activeGoals = this.goals.filter(g => g.status === 'active');
        
        if (activeGoals.length === 0) {
            return `
                <div class="no-goals text-center py-12">
                    <div class="text-6xl mb-4">🎯</div>
                    <h3 class="text-xl font-semibold text-forest-deep mb-2">No Active Goals</h3>
                    <p class="text-charcoal/70 mb-4">Create your first goal to start your journey</p>
                    <button class="create-first-goal bg-sage-deep hover:bg-sage-deep/80 text-white px-4 py-2 rounded-lg transition-colors">
                        Create Your First Goal
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="active-goals mb-8">
                <h2 class="text-2xl font-bold text-forest-deep mb-4">Active Goals</h2>
                <div class="goals-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${activeGoals.map(goal => this.renderGoalCard(goal)).join('')}
                </div>
            </div>
        `;
    }
    
    renderGoalCard(goal) {
        const progress = Math.min(goal.completionRate, 100);
        const daysLeft = goal.targetDate ? Math.max(0, Math.ceil((goal.targetDate - new Date()) / (1000 * 60 * 60 * 24))) : null;
        
        return `
            <div class="goal-card bg-white rounded-xl p-6 shadow-lg border border-sage-deep/10 hover:shadow-xl transition-shadow">
                <div class="goal-header flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <span class="text-2xl mr-3">${goal.icon}</span>
                        <div>
                            <h3 class="font-semibold text-forest-deep">${goal.title}</h3>
                            <p class="text-xs text-charcoal/60 capitalize">${goal.category} • ${goal.difficulty}</p>
                        </div>
                    </div>
                    <div class="goal-status">
                        <span class="status-badge px-2 py-1 rounded-full text-xs font-medium ${goal.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                            ${goal.status}
                        </span>
                    </div>
                </div>
                
                <div class="goal-description text-sm text-charcoal/70 mb-4">
                    ${goal.description}
                </div>
                
                <div class="goal-progress mb-4">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm font-medium text-forest-deep">Progress</span>
                        <span class="text-sm text-sage-deep font-semibold">${progress}%</span>
                    </div>
                    <div class="w-full bg-sage-deep/20 rounded-full h-2">
                        <div class="bg-sage-deep h-2 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
                    </div>
                    <div class="flex justify-between items-center mt-2 text-xs text-charcoal/60">
                        <span>${goal.current} / ${goal.target} ${goal.unit}</span>
                        ${daysLeft !== null ? `<span>${daysLeft} days left</span>` : ''}
                    </div>
                </div>
                
                <div class="goal-milestones mb-4">
                    <div class="text-xs text-charcoal/60 mb-2">Milestones</div>
                    <div class="milestones-progress flex space-x-1">
                        ${goal.milestones.map(milestone => `
                            <div class="milestone-dot w-3 h-3 rounded-full ${milestone.achieved ? 'bg-gold-rich' : 'bg-sage-deep/30'}"></div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="goal-actions flex space-x-2">
                    <button class="goal-edit text-xs text-sage-deep hover:text-forest-deep transition-colors">
                        Edit
                    </button>
                    <button class="goal-pause text-xs text-sage-deep hover:text-forest-deep transition-colors">
                        Pause
                    </button>
                    <button class="goal-delete text-xs text-red-500 hover:text-red-700 transition-colors">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }
    
    renderGoalTemplates() {
        return `
            <div class="goal-templates mb-8">
                <h2 class="text-2xl font-bold text-forest-deep mb-4">Goal Templates</h2>
                <div class="templates-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${Object.entries(this.goalTemplates).map(([level, templates]) => `
                        <div class="template-category bg-white rounded-xl p-6 shadow-lg border border-sage-deep/10">
                            <h3 class="text-lg font-semibold text-forest-deep mb-4 capitalize">${level} Goals</h3>
                            <div class="templates-list space-y-3">
                                ${templates.map(template => `
                                    <div class="template-item p-3 bg-sage-pale/30 rounded-lg hover:bg-sage-pale/50 transition-colors cursor-pointer" data-template='${JSON.stringify(template)}'>
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <div class="text-sm font-medium text-forest-deep">${template.title}</div>
                                                <div class="text-xs text-charcoal/60">${template.description}</div>
                                            </div>
                                            <span class="text-lg">${template.icon}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderCompletedGoals() {
        const completedGoals = this.goals.filter(g => g.status === 'completed');
        
        if (completedGoals.length === 0) return '';
        
        return `
            <div class="completed-goals">
                <h2 class="text-2xl font-bold text-forest-deep mb-4">Completed Goals</h2>
                <div class="completed-list space-y-3">
                    ${completedGoals.map(goal => `
                        <div class="completed-goal flex items-center justify-between p-4 bg-gradient-to-r from-gold-pale/30 to-sage-pale/30 rounded-lg border-l-4 border-gold-rich">
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">🏆</span>
                                <div>
                                    <div class="font-medium text-forest-deep">${goal.title}</div>
                                    <div class="text-xs text-charcoal/60">Completed ${this.formatDate(goal.lastUpdated)}</div>
                                </div>
                            </div>
                            <div class="text-lg font-bold text-gold-rich">100%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    showCreateGoalModal() {
        // Create goal creation modal
        const modal = document.createElement('div');
        modal.className = 'create-goal-modal fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        
        modal.innerHTML = `
            <div class="modal-content bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div class="modal-header flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-forest-deep">Create New Goal</h2>
                    <button class="close-modal text-sage-deep hover:text-forest-deep text-xl">×</button>
                </div>
                
                <form class="goal-form space-y-4">
                    <div class="form-group">
                        <label class="block text-sm font-medium text-charcoal mb-2">Goal Title</label>
                        <input type="text" id="goal-title" class="w-full p-3 border border-sage-deep/20 rounded-lg focus:border-sage-deep focus:outline-none" placeholder="Enter your goal title">
                    </div>
                    
                    <div class="form-group">
                        <label class="block text-sm font-medium text-charcoal mb-2">Description</label>
                        <textarea id="goal-description" class="w-full p-3 border border-sage-deep/20 rounded-lg focus:border-sage-deep focus:outline-none" rows="3" placeholder="Describe your goal"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="block text-sm font-medium text-charcoal mb-2">Category</label>
                        <select id="goal-category" class="w-full p-3 border border-sage-deep/20 rounded-lg focus:border-sage-deep focus:outline-none">
                            ${Object.entries(this.categories).map(([key, category]) => `
                                <option value="${key}">${category.icon} ${category.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="block text-sm font-medium text-charcoal mb-2">Goal Type</label>
                        <select id="goal-type" class="w-full p-3 border border-sage-deep/20 rounded-lg focus:border-sage-deep focus:outline-none">
                            ${Object.entries(this.goalTypes).map(([key, type]) => `
                                <option value="${key}">${type.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="block text-sm font-medium text-charcoal mb-2">Activity</label>
                        <select id="goal-activity" class="w-full p-3 border border-sage-deep/20 rounded-lg focus:border-sage-deep focus:outline-none">
                            <option value="journal">📝 Journal</option>
                            <option value="meditation">🧘 Meditation</option>
                            <option value="gratitude">🙏 Gratitude</option>
                            <option value="workout">💪 Workout</option>
                            <option value="all">🌟 All Activities</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="block text-sm font-medium text-charcoal mb-2">Target</label>
                        <input type="number" id="goal-target" class="w-full p-3 border border-sage-deep/20 rounded-lg focus:border-sage-deep focus:outline-none" placeholder="Enter target number">
                    </div>
                    
                    <div class="form-group">
                        <label class="block text-sm font-medium text-charcoal mb-2">Unit</label>
                        <input type="text" id="goal-unit" class="w-full p-3 border border-sage-deep/20 rounded-lg focus:border-sage-deep focus:outline-none" placeholder="e.g., days, times per week">
                    </div>
                    
                    <div class="form-actions flex space-x-3">
                        <button type="button" class="cancel-goal flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="create-goal flex-1 bg-sage-deep hover:bg-sage-deep/80 text-white px-4 py-2 rounded-lg transition-colors">
                            Create Goal
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.cancel-goal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.goal-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateGoal(modal);
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    handleCreateGoal(modal) {
        const formData = {
            title: modal.querySelector('#goal-title').value,
            description: modal.querySelector('#goal-description').value,
            category: modal.querySelector('#goal-category').value,
            type: modal.querySelector('#goal-type').value,
            activity: modal.querySelector('#goal-activity').value,
            target: parseInt(modal.querySelector('#goal-target').value),
            unit: modal.querySelector('#goal-unit').value,
            priority: 'medium',
            difficulty: 'intermediate'
        };
        
        if (!formData.title || !formData.target) {
            alert('Please fill in all required fields');
            return;
        }
        
        this.createGoal(formData);
        modal.remove();
        
        // Refresh goals page
        this.showGoalsPage();
    }
    
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }
    
    setupGoalTracking() {
        // Track goal progress based on user activities
        document.addEventListener('activityCompleted', (e) => {
            const activity = e.detail.activity;
            this.updateGoalsForActivity(activity);
        });
    }
    
    updateGoalsForActivity(activity) {
        const relevantGoals = this.goals.filter(goal => 
            goal.status === 'active' && 
            (goal.activity === activity || goal.activity === 'all')
        );
        
        relevantGoals.forEach(goal => {
            this.updateGoalProgress(goal.id);
        });
    }
    
    setupGoalEvents() {
        // Listen for data updates
        document.addEventListener('dataUpdated', () => {
            this.updateAllGoalProgress();
        });
        
        // Listen for page changes
        document.addEventListener('pageChanged', (e) => {
            if (e.detail.page === 'goals') {
                this.showGoalsPage();
            }
        });
    }
}

// Initialize goal system
document.addEventListener('DOMContentLoaded', () => {
    window.goalSystem = new GoalSystem();
});
