/**
 * Smart Notifications System
 * Intelligent notifications and reminders for habit formation
 */

class SmartNotificationsSystem {
    constructor() {
        this.settings = {
            enabled: true,
            reminders: {
                morning: true,
                evening: true,
                streak: true,
                motivational: true
            },
            times: {
                morning: '08:00',
                evening: '19:00'
            },
            frequency: 'daily' // daily, weekdays, custom
        };
        
        this.notificationQueue = [];
        this.isSupported = 'Notification' in window;
        
        this.initializeNotifications();
    }
    
    initializeNotifications() {
        this.loadSettings();
        this.requestPermission();
        this.setupNotificationSchedules();
        this.setupStreakReminders();
        this.setupMotivationalMessages();
    }
    
    loadSettings() {
        const stored = localStorage.getItem('notification-settings');
        if (stored) {
            this.settings = { ...this.settings, ...JSON.parse(stored) };
        }
    }
    
    saveSettings() {
        localStorage.setItem('notification-settings', JSON.stringify(this.settings));
    }
    
    async requestPermission() {
        if (!this.isSupported) {
            console.warn('Notifications not supported');
            return;
        }
        
        if (Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showWelcomeNotification();
            }
        }
    }
    
    showWelcomeNotification() {
        this.showNotification('Welcome to your sacred space 🌅', {
            body: 'Your journey to inner peace begins now.',
            icon: '/favicon.ico',
            tag: 'welcome'
        });
    }
    
    setupNotificationSchedules() {
        if (!this.settings.enabled) return;
        
        // Clear existing schedules
        this.clearSchedules();
        
        // Morning reminder
        if (this.settings.reminders.morning) {
            this.scheduleNotification(
                this.settings.times.morning,
                'Morning Flow Time! 🌅',
                'Start your day with intention and mindfulness.',
                'morning-reminder'
            );
        }
        
        // Evening reminder
        if (this.settings.reminders.evening) {
            this.scheduleNotification(
                this.settings.times.evening,
                'Evening Reflection 🌙',
                'Take a moment to reflect on your day.',
                'evening-reminder'
            );
        }
    }
    
    scheduleNotification(time, title, body, tag) {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        
        // If time has passed today, schedule for tomorrow
        if (scheduledTime <= now) {
            scheduledTime.setDate(scheduledTime.getDate() + 1);
        }
        
        const delay = scheduledTime.getTime() - now.getTime();
        
        setTimeout(() => {
            this.showNotification(title, { body, tag });
            // Schedule next occurrence
            this.scheduleNotification(time, title, body, tag);
        }, delay);
    }
    
    clearSchedules() {
        // Clear any existing notification schedules
        // In a real implementation, you'd store timeout IDs and clear them
    }
    
    setupStreakReminders() {
        // Listen for streak updates
        document.addEventListener('streakUpdated', (e) => {
            const { activity, streak } = e.detail;
            
            // Congratulate on milestone streaks
            if (streak.current % 7 === 0 && streak.current > 0) {
                this.showNotification(
                    `${streak.current}-Day Sacred Flow! 🔥`,
                    `Your dedication to ${activity} honors your soul!`,
                    { tag: `streak-${activity}-${streak.current}` }
                );
            }
            
            // Encourage when streak is at risk
            const today = new Date().toISOString().split('T')[0];
            if (streak.lastActivity !== today && streak.current > 0) {
                setTimeout(() => {
                    this.showNotification(
                        'Honor Your Sacred Flow! 💪',
                        `Your ${streak.current}-day ${activity} journey awaits your presence!`,
                        { tag: `streak-reminder-${activity}` }
                    );
                }, 2 * 60 * 60 * 1000); // 2 hours later
            }
        });
    }
    
    setupMotivationalMessages() {
        if (!this.settings.reminders.motivational) return;
        
        const messages = [
            {
                title: 'Your Future Self Thanks You 🌱',
                body: 'Every morning routine builds the person you want to become.',
                delay: 3 * 60 * 60 * 1000 // 3 hours
            },
            {
                title: 'Small Steps, Big Changes 🚀',
                body: 'Consistency beats perfection. Keep going!',
                delay: 6 * 60 * 60 * 1000 // 6 hours
            },
            {
                title: 'Mindfulness Moment 🧘',
                body: 'Take a deep breath. You are exactly where you need to be.',
                delay: 4 * 60 * 60 * 1000 // 4 hours
            }
        ];
        
        messages.forEach((message, index) => {
            setTimeout(() => {
                this.showNotification(message.title, {
                    body: message.body,
                    tag: `motivational-${index}`
                });
            }, message.delay);
        });
    }
    
    showNotification(title, options = {}) {
        if (!this.isSupported || Notification.permission !== 'granted') {
            return;
        }
        
        const notification = new Notification(title, {
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            ...options
        });
        
        // Handle notification click
        notification.onclick = () => {
            window.focus();
            notification.close();
            
            // Navigate to relevant page based on notification type
            if (options.tag) {
                this.handleNotificationClick(options.tag);
            }
        };
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            notification.close();
        }, 5000);
        
        return notification;
    }
    
    handleNotificationClick(tag) {
        if (tag.includes('morning')) {
            this.navigateToPage('home');
        } else if (tag.includes('evening')) {
            this.navigateToPage('journal');
        } else if (tag.includes('streak-reminder-meditation')) {
            this.navigateToPage('timer');
        } else if (tag.includes('streak-reminder-journal')) {
            this.navigateToPage('journal');
        } else if (tag.includes('streak-reminder-gratitude')) {
            this.navigateToPage('gratitude');
        } else if (tag.includes('streak-reminder-workout')) {
            this.navigateToPage('workout');
        }
    }
    
    navigateToPage(page) {
        if (window.navigationManager) {
            window.navigationManager.navigateToPage(page);
        }
    }
    
    // Smart notification based on user behavior
    sendSmartNotification(type, data = {}) {
        const notifications = {
            streak_milestone: {
                title: 'Streak Milestone Achieved! 🎉',
                body: `You've maintained your ${data.activity} streak for ${data.days} days!`,
                tag: `milestone-${data.activity}-${data.days}`
            },
            habit_reminder: {
                title: 'Habit Reminder 📝',
                body: `Time for your daily ${data.activity} practice.`,
                tag: `habit-${data.activity}`
            },
            achievement: {
                title: 'Achievement Unlocked! 🏆',
                body: data.description,
                tag: `achievement-${data.title}`
            },
            encouragement: {
                title: 'You\'re Doing Great! 🌟',
                body: data.message,
                tag: `encouragement-${Date.now()}`
            },
            weather_reminder: {
                title: 'Perfect Weather for Mindfulness 🌤️',
                body: 'The weather is ideal for a peaceful meditation session.',
                tag: 'weather-meditation'
            }
        };
        
        const notification = notifications[type];
        if (notification) {
            this.showNotification(notification.title, {
                body: notification.body,
                tag: notification.tag
            });
        }
    }
    
    // Weather-based smart notifications
    async sendWeatherBasedNotification() {
        try {
            // In a real app, you'd call a weather API
            const weather = await this.getWeatherData();
            
            if (weather && weather.condition) {
                let message = '';
                
                switch (weather.condition.toLowerCase()) {
                    case 'sunny':
                        message = 'Sunny day ahead! Perfect for morning gratitude.';
                        break;
                    case 'rainy':
                        message = 'Rainy day - great for indoor meditation.';
                        break;
                    case 'cloudy':
                        message = 'Cloudy skies - ideal for reflective journaling.';
                        break;
                    default:
                        message = 'Good morning! Time for your mindful routine.';
                }
                
                this.showNotification('Sacred Weather 🌤️', {
                    body: message,
                    tag: 'weather-update'
                });
            }
        } catch (error) {
            console.warn('Weather notification failed:', error);
        }
    }
    
    // Mock weather data (in real app, use actual API)
    async getWeatherData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    condition: 'sunny',
                    temperature: 22
                });
            }, 1000);
        });
    }
    
    // Time-based smart notifications
    sendTimeBasedNotification() {
        const hour = new Date().getHours();
        let notification = null;
        
        if (hour >= 6 && hour < 9) {
            notification = {
                title: 'Morning Energy Peak! ⚡',
                body: 'Your body is naturally energized. Perfect time for movement!',
                tag: 'morning-energy'
            };
        } else if (hour >= 9 && hour < 12) {
            notification = {
                title: 'Focus Time! 🎯',
                body: 'Your mind is sharp. Great time for deep reflection.',
                tag: 'focus-time'
            };
        } else if (hour >= 15 && hour < 18) {
            notification = {
                title: 'Afternoon Reset 🧘',
                body: 'Take a moment to recenter with gentle meditation.',
                tag: 'afternoon-reset'
            };
        } else if (hour >= 19 && hour < 22) {
            notification = {
                title: 'Evening Gratitude 🌙',
                body: 'Reflect on the day and practice gratitude.',
                tag: 'evening-gratitude'
            };
        }
        
        if (notification) {
            this.showNotification(notification.title, {
                body: notification.body,
                tag: notification.tag
            });
        }
    }
    
    // Habit formation notifications
    sendHabitFormationNotification(days) {
        const messages = {
            3: {
                title: '3 Days Strong! 💪',
                body: 'You\'re building momentum. Keep it up!',
                tag: 'habit-day-3'
            },
            7: {
                title: 'One Week Complete! 🎉',
                body: 'You\'ve formed a new habit. This is just the beginning!',
                tag: 'habit-day-7'
            },
            21: {
                title: '21 Days - Habit Locked In! 🔒',
                body: 'Your routine is becoming automatic. Amazing work!',
                tag: 'habit-day-21'
            },
            66: {
                title: '66 Days - Mastery Achieved! 🏆',
                body: 'Your habit is now deeply ingrained. You\'re unstoppable!',
                tag: 'habit-day-66'
            }
        };
        
        const message = messages[days];
        if (message) {
            this.showNotification(message.title, {
                body: message.body,
                tag: message.tag
            });
        }
    }
    
    // Notification settings management
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.saveSettings();
        
        if (newSettings.enabled !== undefined) {
            if (newSettings.enabled) {
                this.setupNotificationSchedules();
            } else {
                this.clearSchedules();
            }
        }
    }
    
    getSettings() {
        return this.settings;
    }
    
    // Test notification
    sendTestNotification() {
        this.showNotification('Sacred Connection Test 🔔', {
            body: 'Your spiritual notifications are flowing perfectly!',
            tag: 'test-notification'
        });
    }
    
    // Quiet hours (disable notifications during certain times)
    setQuietHours(start, end) {
        this.settings.quietHours = { start, end };
        this.saveSettings();
    }
    
    isQuietTime() {
        if (!this.settings.quietHours) return false;
        
        const now = new Date();
        const currentHour = now.getHours();
        const { start, end } = this.settings.quietHours;
        
        return currentHour >= start && currentHour <= end;
    }
    
    // Conditional notification sending
    sendNotificationIfAllowed(title, options = {}) {
        if (!this.isQuietTime() && this.settings.enabled) {
            this.showNotification(title, options);
        }
    }
}

// Initialize smart notifications system
document.addEventListener('DOMContentLoaded', () => {
    window.smartNotifications = new SmartNotificationsSystem();
    
    // Listen for various events to trigger smart notifications
    document.addEventListener('achievementUnlocked', (e) => {
        window.smartNotifications.sendSmartNotification('achievement', e.detail);
    });
    
    document.addEventListener('streakUpdated', (e) => {
        const { activity, streak } = e.detail;
        if (streak.current > 0) {
            window.smartNotifications.sendHabitFormationNotification(streak.current);
        }
    });
    
    // Send time-based notification every hour
    setInterval(() => {
        window.smartNotifications.sendTimeBasedNotification();
    }, 60 * 60 * 1000); // Every hour
});
