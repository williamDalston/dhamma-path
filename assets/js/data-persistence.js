/**
 * Data Persistence System
 * Comprehensive data storage, history, and analytics
 */

class DataPersistenceSystem {
    constructor() {
        this.storage = {
            journal: [],
            gratitude: [],
            meditation: [],
            workout: [],
            settings: {},
            analytics: {},
            streaks: {},
            achievements: []
        };
        
        this.initializeStorage();
    }
    
    initializeStorage() {
        this.loadAllData();
        this.setupAutoSave();
        this.setupDataExport();
        this.setupAnalytics();
    }
    
    setupAnalytics() {
        // Analytics setup for data persistence
        console.log('📊 Data persistence analytics initialized');
    }
    
    loadAllData() {
        // Load journal entries
        const journalData = localStorage.getItem('journal-entries');
        if (journalData) {
            this.storage.journal = JSON.parse(journalData);
        }
        
        // Load gratitude entries
        const gratitudeData = localStorage.getItem('gratitude-entries');
        if (gratitudeData) {
            this.storage.gratitude = JSON.parse(gratitudeData);
        }
        
        // Load meditation sessions
        const meditationData = localStorage.getItem('meditation-sessions');
        if (meditationData) {
            this.storage.meditation = JSON.parse(meditationData);
        }
        
        // Load workout sessions
        const workoutData = localStorage.getItem('workout-sessions');
        if (workoutData) {
            this.storage.workout = JSON.parse(workoutData);
        }
        
        // Load settings
        const settingsData = localStorage.getItem('app-settings');
        if (settingsData) {
            this.storage.settings = JSON.parse(settingsData);
        }
        
        // Load analytics
        const analyticsData = localStorage.getItem('app-analytics');
        if (analyticsData) {
            this.storage.analytics = JSON.parse(analyticsData);
        }
        
        // Load streaks
        const streaksData = localStorage.getItem('streaks');
        if (streaksData) {
            this.storage.streaks = JSON.parse(streaksData);
        }
        
        // Load achievements
        const achievementsData = localStorage.getItem('achievements');
        if (achievementsData) {
            this.storage.achievements = JSON.parse(achievementsData);
        }
    }
    
    saveAllData() {
        localStorage.setItem('journal-entries', JSON.stringify(this.storage.journal));
        localStorage.setItem('gratitude-entries', JSON.stringify(this.storage.gratitude));
        localStorage.setItem('meditation-sessions', JSON.stringify(this.storage.meditation));
        localStorage.setItem('workout-sessions', JSON.stringify(this.storage.workout));
        localStorage.setItem('app-settings', JSON.stringify(this.storage.settings));
        localStorage.setItem('app-analytics', JSON.stringify(this.storage.analytics));
        localStorage.setItem('streaks', JSON.stringify(this.storage.streaks));
        localStorage.setItem('achievements', JSON.stringify(this.storage.achievements));
    }
    
    // Journal Management
    saveJournalEntry(content, emotion, metadata = {}) {
        const entry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            content: content,
            emotion: emotion,
            wordCount: content.trim().split(/\s+/).filter(word => word.length > 0).length,
            characterCount: content.length,
            metadata: {
                ...metadata,
                sessionDuration: metadata.sessionDuration || 0,
                writingSpeed: metadata.writingSpeed || 0
            }
        };
        
        this.storage.journal.unshift(entry); // Add to beginning
        this.storage.journal = this.storage.journal.slice(0, 1000); // Keep last 1000 entries
        
        this.saveAllData();
        this.updateStreaks('journal');
        this.updateAnalytics('journal', entry);
        
        return entry;
    }
    
    getJournalEntries(limit = 50, offset = 0) {
        return this.storage.journal.slice(offset, offset + limit);
    }
    
    searchJournalEntries(query) {
        const searchTerm = query.toLowerCase();
        return this.storage.journal.filter(entry => 
            entry.content.toLowerCase().includes(searchTerm) ||
            entry.emotion.toLowerCase().includes(searchTerm)
        );
    }
    
    // Gratitude Management
    saveGratitudeEntry(items, metadata = {}) {
        const entry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            items: items,
            count: items.length,
            metadata: {
                ...metadata,
                sessionDuration: metadata.sessionDuration || 0
            }
        };
        
        this.storage.gratitude.unshift(entry);
        this.storage.gratitude = this.storage.gratitude.slice(0, 1000);
        
        this.saveAllData();
        this.updateStreaks('gratitude');
        this.updateAnalytics('gratitude', entry);
        
        return entry;
    }
    
    getGratitudeEntries(limit = 50, offset = 0) {
        return this.storage.gratitude.slice(offset, offset + limit);
    }
    
    // Meditation Management
    saveMeditationSession(duration, type, metadata = {}) {
        const session = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            duration: duration,
            type: type || 'guided',
            metadata: {
                ...metadata,
                completed: true,
                interrupted: metadata.interrupted || false
            }
        };
        
        this.storage.meditation.unshift(session);
        this.storage.meditation = this.storage.meditation.slice(0, 500);
        
        this.saveAllData();
        this.updateStreaks('meditation');
        this.updateAnalytics('meditation', session);
        
        return session;
    }
    
    getMeditationSessions(limit = 50, offset = 0) {
        return this.storage.meditation.slice(offset, offset + limit);
    }
    
    // Workout Management
    saveWorkoutSession(exercises, duration, metadata = {}) {
        const session = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            exercises: exercises,
            duration: duration,
            exerciseCount: exercises.length,
            metadata: {
                ...metadata,
                completed: true
            }
        };
        
        this.storage.workout.unshift(session);
        this.storage.workout = this.storage.workout.slice(0, 500);
        
        this.saveAllData();
        this.updateStreaks('workout');
        this.updateAnalytics('workout', session);
        
        return session;
    }
    
    getWorkoutSessions(limit = 50, offset = 0) {
        return this.storage.workout.slice(offset, offset + limit);
    }
    
    // Settings Management
    saveSetting(key, value) {
        this.storage.settings[key] = value;
        this.saveAllData();
    }
    
    getSetting(key, defaultValue = null) {
        return this.storage.settings[key] || defaultValue;
    }
    
    // Streaks Management
    updateStreaks(activity) {
        const today = new Date().toISOString().split('T')[0];
        const streakKey = `${activity}-streak`;
        
        if (!this.storage.streaks[streakKey]) {
            this.storage.streaks[streakKey] = {
                current: 0,
                longest: 0,
                lastActivity: null
            };
        }
        
        const streak = this.storage.streaks[streakKey];
        
        // Check if this is a new day
        if (streak.lastActivity !== today) {
            // Check if yesterday was also active (maintain streak)
            if (streak.lastActivity) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                
                if (streak.lastActivity === yesterdayStr) {
                    streak.current += 1;
                } else {
                    streak.current = 1; // Reset streak
                }
            } else {
                streak.current = 1; // First activity
            }
            
            streak.lastActivity = today;
            
            // Update longest streak
            if (streak.current > streak.longest) {
                streak.longest = streak.current;
                this.checkStreakAchievements(activity, streak.current);
            }
        }
        
        this.saveAllData();
        return streak;
    }
    
    getStreak(activity) {
        const streakKey = `${activity}-streak`;
        return this.storage.streaks[streakKey] || {
            current: 0,
            longest: 0,
            lastActivity: null
        };
    }
    
    // Analytics
    updateAnalytics(activity, data) {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.storage.analytics[activity]) {
            this.storage.analytics[activity] = {};
        }
        
        if (!this.storage.analytics[activity][today]) {
            this.storage.analytics[activity][today] = {
                count: 0,
                totalDuration: 0,
                totalWords: 0,
                emotions: {},
                sessions: []
            };
        }
        
        const dayData = this.storage.analytics[activity][today];
        dayData.count += 1;
        dayData.sessions.push(data.id);
        
        // Activity-specific analytics
        if (activity === 'journal') {
            dayData.totalWords += data.wordCount;
            if (data.emotion) {
                dayData.emotions[data.emotion] = (dayData.emotions[data.emotion] || 0) + 1;
            }
        } else if (activity === 'meditation') {
            dayData.totalDuration += data.duration;
        } else if (activity === 'workout') {
            dayData.totalDuration += data.duration;
        }
        
        this.saveAllData();
    }
    
    getAnalytics(activity, days = 30) {
        if (!this.storage.analytics[activity]) {
            return {};
        }
        
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        
        const analytics = {
            totalSessions: 0,
            totalDuration: 0,
            totalWords: 0,
            averagePerDay: 0,
            streak: this.getStreak(activity),
            dailyData: {},
            trends: {
                weekly: [],
                monthly: []
            }
        };
        
        // Process daily data
        Object.entries(this.storage.analytics[activity]).forEach(([date, data]) => {
            const entryDate = new Date(date);
            if (entryDate >= startDate && entryDate <= endDate) {
                analytics.totalSessions += data.count;
                analytics.totalDuration += data.totalDuration;
                analytics.totalWords += data.totalWords;
                analytics.dailyData[date] = data;
            }
        });
        
        analytics.averagePerDay = analytics.totalSessions / days;
        
        return analytics;
    }
    
    // Achievements
    checkStreakAchievements(activity, streak) {
        const achievements = [
            { streak: 3, title: `${activity} Novice`, description: `3-day ${activity} streak` },
            { streak: 7, title: `${activity} Dedicated`, description: `7-day ${activity} streak` },
            { streak: 30, title: `${activity} Master`, description: `30-day ${activity} streak` },
            { streak: 100, title: `${activity} Legend`, description: `100-day ${activity} streak` }
        ];
        
        achievements.forEach(achievement => {
            if (streak === achievement.streak) {
                this.unlockAchievement(achievement.title, achievement.description);
            }
        });
    }
    
    unlockAchievement(title, description) {
        const achievement = {
            id: Date.now().toString(),
            title: title,
            description: description,
            timestamp: new Date().toISOString(),
            unlocked: true
        };
        
        // Check if already unlocked
        const exists = this.storage.achievements.find(a => a.title === title);
        if (!exists) {
            this.storage.achievements.unshift(achievement);
            this.saveAllData();
            
            // Announce achievement
            document.dispatchEvent(new CustomEvent('achievementUnlocked', {
                detail: achievement
            }));
        }
    }
    
    getAchievements() {
        return this.storage.achievements;
    }
    
    // Data Export/Import
    setupDataExport() {
        // Listen for export requests
        document.addEventListener('exportData', (e) => {
            this.exportData(e.detail.format || 'json');
        });
        
        // Listen for import requests
        document.addEventListener('importData', (e) => {
            this.importData(e.detail.data);
        });
    }
    
    setupAnalytics() {
        // Setup analytics tracking
        console.log('📊 Analytics system initialized');
    }
    
    exportData(format = 'json') {
        const data = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            data: this.storage
        };
        
        if (format === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `morningflow-data-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } else if (format === 'csv') {
            this.exportToCSV();
        }
    }
    
    exportToCSV() {
        const csvData = [];
        
        // Journal entries
        this.storage.journal.forEach(entry => {
            csvData.push({
                Type: 'Journal',
                Date: entry.timestamp.split('T')[0],
                Content: entry.content,
                Emotion: entry.emotion,
                WordCount: entry.wordCount
            });
        });
        
        // Gratitude entries
        this.storage.gratitude.forEach(entry => {
            csvData.push({
                Type: 'Gratitude',
                Date: entry.timestamp.split('T')[0],
                Content: entry.items.join('; '),
                Emotion: '',
                WordCount: entry.count
            });
        });
        
        // Meditation sessions
        this.storage.meditation.forEach(session => {
            csvData.push({
                Type: 'Meditation',
                Date: session.timestamp.split('T')[0],
                Content: `${session.duration} seconds`,
                Emotion: session.type,
                WordCount: 0
            });
        });
        
        // Convert to CSV
        const headers = ['Type', 'Date', 'Content', 'Emotion', 'WordCount'];
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `morningflow-data-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    importData(data) {
        try {
            const imported = typeof data === 'string' ? JSON.parse(data) : data;
            
            if (imported.data) {
                this.storage = { ...this.storage, ...imported.data };
                this.saveAllData();
                
                document.dispatchEvent(new CustomEvent('dataImported', {
                    detail: { success: true }
                }));
            }
        } catch (error) {
            console.error('Import failed:', error);
            document.dispatchEvent(new CustomEvent('dataImported', {
                detail: { success: false, error: error.message }
            }));
        }
    }
    
    // Auto-save functionality
    setupAutoSave() {
        // Auto-save journal drafts
        const textarea = document.getElementById('journal-textarea');
        if (textarea) {
            textarea.addEventListener('input', () => {
                const draft = {
                    content: textarea.value,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('journal-draft', JSON.stringify(draft));
            });
        }
        
        // Auto-save gratitude drafts
        const gratitudeInputs = document.querySelectorAll('.gratitude-input');
        gratitudeInputs.forEach(input => {
            input.addEventListener('input', () => {
                const drafts = {};
                gratitudeInputs.forEach(inp => {
                    if (inp.value) {
                        drafts[inp.id] = inp.value;
                    }
                });
                localStorage.setItem('gratitude-drafts', JSON.stringify(drafts));
            });
        });
    }
    
    // Statistics and Insights
    getStatistics() {
        return {
            journal: {
                totalEntries: this.storage.journal.length,
                totalWords: this.storage.journal.reduce((sum, entry) => sum + entry.wordCount, 0),
                averageWords: this.storage.journal.length > 0 ? 
                    this.storage.journal.reduce((sum, entry) => sum + entry.wordCount, 0) / this.storage.journal.length : 0,
                streak: this.getStreak('journal'),
                emotions: this.getEmotionDistribution('journal')
            },
            meditation: {
                totalSessions: this.storage.meditation.length,
                totalDuration: this.storage.meditation.reduce((sum, session) => sum + session.duration, 0),
                averageDuration: this.storage.meditation.length > 0 ?
                    this.storage.meditation.reduce((sum, session) => sum + session.duration, 0) / this.storage.meditation.length : 0,
                streak: this.getStreak('meditation')
            },
            gratitude: {
                totalEntries: this.storage.gratitude.length,
                totalItems: this.storage.gratitude.reduce((sum, entry) => sum + entry.count, 0),
                averageItems: this.storage.gratitude.length > 0 ?
                    this.storage.gratitude.reduce((sum, entry) => sum + entry.count, 0) / this.storage.gratitude.length : 0,
                streak: this.getStreak('gratitude')
            },
            workout: {
                totalSessions: this.storage.workout.length,
                totalDuration: this.storage.workout.reduce((sum, session) => sum + session.duration, 0),
                totalExercises: this.storage.workout.reduce((sum, session) => sum + session.exerciseCount, 0),
                streak: this.getStreak('workout')
            },
            achievements: this.storage.achievements.length
        };
    }
    
    getEmotionDistribution(activity) {
        const emotions = {};
        
        if (activity === 'journal') {
            this.storage.journal.forEach(entry => {
                if (entry.emotion) {
                    emotions[entry.emotion] = (emotions[entry.emotion] || 0) + 1;
                }
            });
        }
        
        return emotions;
    }
    
    // Cleanup old data
    cleanupOldData(daysToKeep = 365) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        // Clean journal entries
        this.storage.journal = this.storage.journal.filter(entry => 
            new Date(entry.timestamp) > cutoffDate
        );
        
        // Clean other entries
        this.storage.gratitude = this.storage.gratitude.filter(entry => 
            new Date(entry.timestamp) > cutoffDate
        );
        
        this.storage.meditation = this.storage.meditation.filter(session => 
            new Date(session.timestamp) > cutoffDate
        );
        
        this.storage.workout = this.storage.workout.filter(session => 
            new Date(session.timestamp) > cutoffDate
        );
        
        this.saveAllData();
    }
}

// Initialize data persistence system
document.addEventListener('DOMContentLoaded', () => {
    window.dataPersistence = new DataPersistenceSystem();
});
