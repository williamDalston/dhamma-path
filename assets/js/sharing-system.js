/**
 * Sharing and Export System
 * Comprehensive sharing, export, and social features
 */

class SharingSystem {
    constructor() {
        this.sharingOptions = {
            journal: {
                platforms: ['twitter', 'facebook', 'linkedin', 'copy', 'export'],
                formats: ['text', 'image', 'pdf']
            },
            gratitude: {
                platforms: ['twitter', 'instagram', 'facebook', 'copy', 'export'],
                formats: ['text', 'image', 'story']
            },
            achievements: {
                platforms: ['twitter', 'facebook', 'linkedin', 'copy', 'export'],
                formats: ['image', 'text']
            },
            stats: {
                platforms: ['twitter', 'linkedin', 'copy', 'export'],
                formats: ['image', 'pdf', 'text']
            }
        };
        
        this.initializeSharing();
    }
    
    initializeSharing() {
        this.setupSharingButtons();
        this.setupExportFeatures();
        this.setupSocialSharing();
        this.setupImageGeneration();
    }
    
    setupSharingButtons() {
        // Add sharing buttons to journal entries
        this.addSharingToJournal();
        
        // Add sharing buttons to gratitude entries
        this.addSharingToGratitude();
        
        // Add sharing buttons to achievements
        this.addSharingToAchievements();
    }
    
    addSharingToJournal() {
        // This would be called when journal entries are displayed
        document.addEventListener('journalEntryDisplayed', (e) => {
            const entry = e.detail;
            this.createJournalSharingButtons(entry);
        });
    }
    
    addSharingToGratitude() {
        document.addEventListener('gratitudeEntryDisplayed', (e) => {
            const entry = e.detail;
            this.createGratitudeSharingButtons(entry);
        });
    }
    
    addSharingToAchievements() {
        document.addEventListener('achievementUnlocked', (e) => {
            const achievement = e.detail;
            this.createAchievementSharingButtons(achievement);
        });
    }
    
    createJournalSharingButtons(entry) {
        const sharingContainer = document.createElement('div');
        sharingContainer.className = 'sharing-buttons flex space-x-2 mt-4';
        
        const platforms = this.sharingOptions.journal.platforms;
        
        platforms.forEach(platform => {
            const button = this.createSharingButton(platform, () => {
                this.shareJournalEntry(entry, platform);
            });
            sharingContainer.appendChild(button);
        });
        
        // Add to journal entry display
        const journalDisplay = document.querySelector('.journal-entry-display');
        if (journalDisplay) {
            journalDisplay.appendChild(sharingContainer);
        }
    }
    
    createGratitudeSharingButtons(entry) {
        const sharingContainer = document.createElement('div');
        sharingContainer.className = 'sharing-buttons flex space-x-2 mt-4';
        
        const platforms = this.sharingOptions.gratitude.platforms;
        
        platforms.forEach(platform => {
            const button = this.createSharingButton(platform, () => {
                this.shareGratitudeEntry(entry, platform);
            });
            sharingContainer.appendChild(button);
        });
        
        const gratitudeDisplay = document.querySelector('.gratitude-entry-display');
        if (gratitudeDisplay) {
            gratitudeDisplay.appendChild(sharingContainer);
        }
    }
    
    createAchievementSharingButtons(achievement) {
        const sharingContainer = document.createElement('div');
        sharingContainer.className = 'achievement-sharing flex space-x-2 mt-4';
        
        const platforms = this.sharingOptions.achievements.platforms;
        
        platforms.forEach(platform => {
            const button = this.createSharingButton(platform, () => {
                this.shareAchievement(achievement, platform);
            });
            sharingContainer.appendChild(button);
        });
        
        // Show achievement sharing modal
        this.showAchievementSharingModal(achievement, sharingContainer);
    }
    
    createSharingButton(platform, onClick) {
        const button = document.createElement('button');
        button.className = `sharing-btn sharing-btn-${platform} p-2 rounded-lg transition-all duration-200 hover:scale-105`;
        
        const icons = {
            twitter: '🐦',
            facebook: '📘',
            linkedin: '💼',
            instagram: '📷',
            copy: '📋',
            export: '📤'
        };
        
        button.innerHTML = `
            <span class="text-lg">${icons[platform] || '🔗'}</span>
            <span class="text-xs ml-1">${platform}</span>
        `;
        
        button.addEventListener('click', onClick);
        
        return button;
    }
    
    // Journal sharing
    shareJournalEntry(entry, platform) {
        const content = this.formatJournalForSharing(entry);
        
        switch (platform) {
            case 'twitter':
                this.shareToTwitter(content, 'journal');
                break;
            case 'facebook':
                this.shareToFacebook(content, 'journal');
                break;
            case 'linkedin':
                this.shareToLinkedIn(content, 'journal');
                break;
            case 'copy':
                this.copyToClipboard(content);
                break;
            case 'export':
                this.exportJournalEntry(entry);
                break;
        }
    }
    
    formatJournalForSharing(entry) {
        const date = new Date(entry.timestamp).toLocaleDateString();
        const emotion = entry.emotion ? ` Feeling: ${entry.emotion}` : '';
        
        return `📝 Journal Entry - ${date}${emotion}\n\n"${entry.content.substring(0, 200)}${entry.content.length > 200 ? '...' : ''}"\n\n#mindfulness #journaling #morningflow`;
    }
    
    // Gratitude sharing
    shareGratitudeEntry(entry, platform) {
        const content = this.formatGratitudeForSharing(entry);
        
        switch (platform) {
            case 'twitter':
                this.shareToTwitter(content, 'gratitude');
                break;
            case 'instagram':
                this.shareToInstagram(content, 'gratitude');
                break;
            case 'facebook':
                this.shareToFacebook(content, 'gratitude');
                break;
            case 'copy':
                this.copyToClipboard(content);
                break;
            case 'export':
                this.exportGratitudeEntry(entry);
                break;
        }
    }
    
    formatGratitudeForSharing(entry) {
        const date = new Date(entry.timestamp).toLocaleDateString();
        const items = entry.items.join(', ');
        
        return `🙏 Today I'm grateful for:\n\n${items}\n\n#gratitude #mindfulness #morningflow #${date}`;
    }
    
    // Achievement sharing
    shareAchievement(achievement, platform) {
        const content = this.formatAchievementForSharing(achievement);
        
        switch (platform) {
            case 'twitter':
                this.shareToTwitter(content, 'achievement');
                break;
            case 'facebook':
                this.shareToFacebook(content, 'achievement');
                break;
            case 'linkedin':
                this.shareToLinkedIn(content, 'achievement');
                break;
            case 'copy':
                this.copyToClipboard(content);
                break;
            case 'export':
                this.exportAchievement(achievement);
                break;
        }
    }
    
    formatAchievementForSharing(achievement) {
        return `🏆 Achievement Unlocked!\n\n${achievement.title}\n${achievement.description}\n\n#achievement #mindfulness #morningflow #personalgrowth`;
    }
    
    // Social media sharing methods
    shareToTwitter(content, type) {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}&url=${encodeURIComponent(window.location.origin)}`;
        this.openSharingWindow(url, 'Twitter');
    }
    
    shareToFacebook(content, type) {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(content)}`;
        this.openSharingWindow(url, 'Facebook');
    }
    
    shareToLinkedIn(content, type) {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&title=${encodeURIComponent('MorningFlow')}&summary=${encodeURIComponent(content)}`;
        this.openSharingWindow(url, 'LinkedIn');
    }
    
    shareToInstagram(content, type) {
        // Instagram doesn't support direct sharing, so we'll generate an image
        this.generateInstagramImage(content, type);
    }
    
    openSharingWindow(url, platform) {
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        window.open(
            url,
            `${platform}Share`,
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
        );
    }
    
    // Copy to clipboard
    async copyToClipboard(content) {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(content);
                this.showCopySuccess();
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = content;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showCopySuccess();
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showCopyError();
        }
    }
    
    showCopySuccess() {
        this.showNotification('✅ Copied to clipboard!', 'success');
    }
    
    showCopyError() {
        this.showNotification('❌ Failed to copy to clipboard', 'error');
    }
    
    // Export functionality
    exportJournalEntry(entry) {
        const data = {
            type: 'journal',
            entry: entry,
            exportDate: new Date().toISOString(),
            app: 'MorningFlow'
        };
        
        this.downloadJSON(data, `journal-entry-${entry.id}.json`);
    }
    
    exportGratitudeEntry(entry) {
        const data = {
            type: 'gratitude',
            entry: entry,
            exportDate: new Date().toISOString(),
            app: 'MorningFlow'
        };
        
        this.downloadJSON(data, `gratitude-entry-${entry.id}.json`);
    }
    
    exportAchievement(achievement) {
        const data = {
            type: 'achievement',
            achievement: achievement,
            exportDate: new Date().toISOString(),
            app: 'MorningFlow'
        };
        
        this.downloadJSON(data, `achievement-${achievement.id}.json`);
    }
    
    downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // Image generation for sharing
    generateInstagramImage(content, type) {
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
        gradient.addColorStop(0, '#7A9B7A');
        gradient.addColorStop(1, '#1A4D3A');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1080);
        
        // Add content
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        
        const lines = this.wrapText(ctx, content, 900);
        const lineHeight = 60;
        const startY = (1080 - (lines.length * lineHeight)) / 2;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, 540, startY + (index * lineHeight));
        });
        
        // Add app branding
        ctx.font = '24px Arial';
        ctx.fillText('Made with MorningFlow', 540, 1000);
        
        // Convert to image and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `morningflow-${type}-${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
            
            this.showNotification('📷 Image generated! Save and share on Instagram.', 'success');
        });
    }
    
    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        return lines;
    }
    
    // Statistics sharing
    shareStatistics() {
        if (!window.dataPersistence) return;
        
        const stats = window.dataPersistence.getStatistics();
        const content = this.formatStatisticsForSharing(stats);
        
        this.showStatisticsSharingModal(content, stats);
    }
    
    formatStatisticsForSharing(stats) {
        return `📊 My MorningFlow Statistics:\n\n` +
               `📝 Journal: ${stats.journal.totalEntries} entries, ${stats.journal.totalWords} words\n` +
               `🧘 Meditation: ${stats.meditation.totalSessions} sessions\n` +
               `🙏 Gratitude: ${stats.gratitude.totalEntries} entries\n` +
               `💪 Workouts: ${stats.workout.totalSessions} sessions\n` +
               `🏆 Achievements: ${stats.achievements} unlocked\n\n` +
               `#mindfulness #morningroutine #personaldevelopment #morningflow`;
    }
    
    showStatisticsSharingModal(content, stats) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h3 class="text-xl font-bold mb-4">Share Your Progress</h3>
                <div class="bg-gray-100 p-4 rounded-lg mb-4">
                    <pre class="text-sm whitespace-pre-wrap">${content}</pre>
                </div>
                <div class="flex space-x-2">
                    <button class="share-twitter-btn px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        🐦 Twitter
                    </button>
                    <button class="share-facebook-btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        📘 Facebook
                    </button>
                    <button class="copy-stats-btn px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        📋 Copy
                    </button>
                    <button class="close-stats-modal px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        modal.querySelector('.share-twitter-btn').addEventListener('click', () => {
            this.shareToTwitter(content, 'statistics');
            modal.remove();
        });
        
        modal.querySelector('.share-facebook-btn').addEventListener('click', () => {
            this.shareToFacebook(content, 'statistics');
            modal.remove();
        });
        
        modal.querySelector('.copy-stats-btn').addEventListener('click', () => {
            this.copyToClipboard(content);
            modal.remove();
        });
        
        modal.querySelector('.close-stats-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    showAchievementSharingModal(achievement, sharingContainer) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-auto">
                <h3 class="text-xl font-bold mb-2">🏆 Achievement Unlocked!</h3>
                <h4 class="text-lg font-semibold text-green-600 mb-2">${achievement.title}</h4>
                <p class="text-gray-700 mb-4">${achievement.description}</p>
                <div class="text-sm text-gray-500 mb-4">Share your achievement:</div>
                <div class="sharing-buttons flex space-x-2 mb-4">
                    ${sharingContainer.innerHTML}
                </div>
                <button class="close-achievement-modal w-full px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                    Continue
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-achievement-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Notification helper
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0', 'translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Setup export features
    setupExportFeatures() {
        // Add export button to main navigation
        this.addExportButtonToNavigation();
        
        // Listen for export requests
        document.addEventListener('exportAllData', () => {
            this.exportAllData();
        });
    }
    
    addExportButtonToNavigation() {
        // This would add an export button to the main navigation
        // For now, we'll just listen for the event
    }
    
    exportAllData() {
        if (!window.dataPersistence) return;
        
        const allData = window.dataPersistence.storage;
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            data: allData,
            statistics: window.dataPersistence.getStatistics()
        };
        
        this.downloadJSON(exportData, `morningflow-complete-export-${new Date().toISOString().split('T')[0]}.json`);
        this.showNotification('📤 Complete data export downloaded!', 'success');
    }
}

// Initialize sharing system
document.addEventListener('DOMContentLoaded', () => {
    window.sharingSystem = new SharingSystem();
});
