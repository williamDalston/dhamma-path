/**
 * Temporal Echo - The Gentle Mirror
 * Surfaces random past journal entries at session end
 * For new users, shows curated quotes about reflection
 * Makes the app a mirror, not just a logbook
 */

class TemporalEcho {
    constructor() {
        this.isInitialized = false;
        this.journalEntriesKey = 'morningFlowJournalEntries';
        this.echoHistoryKey = 'morningFlowEchoHistory';
        this.curatedQuotes = this.getCuratedQuotes();
        
        this.init();
    }

    init() {
        console.log('🪞 Initializing Temporal Echo system...');
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('✅ Temporal Echo system initialized');
    }

    getCuratedQuotes() {
        return [
            {
                text: "The morning light reveals not just the day ahead, but the wisdom of yesterday.",
                author: "MorningFlow",
                category: "reflection"
            },
            {
                text: "In stillness, we find the echoes of our own growth.",
                author: "MorningFlow",
                category: "growth"
            },
            {
                text: "Every breath is a chance to begin again, with the wisdom of experience.",
                author: "MorningFlow",
                category: "beginning"
            },
            {
                text: "The past whispers its lessons to those who listen with an open heart.",
                author: "MorningFlow",
                category: "wisdom"
            },
            {
                text: "Reflection is the bridge between who we were and who we are becoming.",
                author: "MorningFlow",
                category: "transformation"
            },
            {
                text: "In the quiet moments, we hear the voice of our own evolution.",
                author: "MorningFlow",
                category: "evolution"
            },
            {
                text: "The morning holds space for both gratitude and growth.",
                author: "MorningFlow",
                category: "gratitude"
            },
            {
                text: "Each day is a canvas, painted with the colors of yesterday's insights.",
                author: "MorningFlow",
                category: "creativity"
            }
        ];
    }

    setupEventListeners() {
        // Listen for flow completion events
        window.addEventListener('flowCompleted', () => {
            setTimeout(() => {
                this.showTemporalEcho();
            }, 2000);
        });
        
        // Listen for session end events
        window.addEventListener('sessionEnd', () => {
            setTimeout(() => {
                this.showTemporalEcho();
            }, 1000);
        });
    }

    showTemporalEcho() {
        console.log('🪞 Showing temporal echo...');
        
        const journalEntries = this.getJournalEntries();
        let echoContent;
        
        if (journalEntries.length > 0) {
            // Show past journal entry
            echoContent = this.getPastJournalEcho(journalEntries);
        } else {
            // Show curated quote for new users
            echoContent = this.getCuratedQuoteEcho();
        }
        
        this.createTemporalEchoOverlay(echoContent);
        
        // Track echo event
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('temporal_echo_shown', {
                echo_type: journalEntries.length > 0 ? 'journal_entry' : 'curated_quote',
                journal_entries_count: journalEntries.length
            });
        }
        
        // Provide gentle haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'gentle');
        }
    }

    getJournalEntries() {
        const entries = localStorage.getItem(this.journalEntriesKey);
        return entries ? JSON.parse(entries) : [];
    }

    getPastJournalEcho(journalEntries) {
        // Get entries that haven't been shown recently
        const echoHistory = this.getEchoHistory();
        const recentEntries = echoHistory.slice(0, 5); // Last 5 shown entries
        
        // Filter out recently shown entries
        const availableEntries = journalEntries.filter(entry => 
            !recentEntries.includes(entry.id)
        );
        
        // If all entries have been shown recently, use any entry
        const entryToShow = availableEntries.length > 0 
            ? availableEntries[Math.floor(Math.random() * availableEntries.length)]
            : journalEntries[Math.floor(Math.random() * journalEntries.length)];
        
        // Record this echo in history
        this.recordEchoHistory(entryToShow.id);
        
        return {
            type: 'journal_entry',
            content: entryToShow,
            title: 'A Reflection from Your Journey',
            subtitle: this.getJournalEchoSubtitle(entryToShow)
        };
    }

    getCuratedQuoteEcho() {
        const randomQuote = this.curatedQuotes[Math.floor(Math.random() * this.curatedQuotes.length)];
        
        return {
            type: 'curated_quote',
            content: randomQuote,
            title: 'A Thought for Reflection',
            subtitle: 'Wisdom for your journey'
        };
    }

    getJournalEchoSubtitle(entry) {
        const daysAgo = Math.floor((Date.now() - entry.timestamp) / (1000 * 60 * 60 * 24));
        
        if (daysAgo === 0) {
            return 'From today';
        } else if (daysAgo === 1) {
            return 'From yesterday';
        } else if (daysAgo < 7) {
            return `From ${daysAgo} days ago`;
        } else if (daysAgo < 30) {
            const weeksAgo = Math.floor(daysAgo / 7);
            return `From ${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
        } else {
            const monthsAgo = Math.floor(daysAgo / 30);
            return `From ${monthsAgo} month${monthsAgo > 1 ? 's' : ''} ago`;
        }
    }

    createTemporalEchoOverlay(echoContent) {
        const overlay = document.createElement('div');
        overlay.id = 'temporal-echo-overlay';
        overlay.className = 'temporal-echo-overlay';
        
        let contentHTML;
        
        if (echoContent.type === 'journal_entry') {
            contentHTML = this.createJournalEntryEchoHTML(echoContent);
        } else {
            contentHTML = this.createCuratedQuoteEchoHTML(echoContent);
        }
        
        overlay.innerHTML = `
            <div class="temporal-echo-content">
                <div class="temporal-echo-header">
                    <div class="temporal-echo-icon">
                        <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#echoGradient)" stroke-width="3" opacity="0.8"/>
                            <circle cx="50" cy="50" r="25" fill="url(#echoGradient)" opacity="0.6"/>
                            <circle cx="50" cy="50" r="8" fill="url(#echoGradient)"/>
                            <defs>
                                <linearGradient id="echoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#1a4d3a;stop-opacity:1" />
                                    <stop offset="100%" style="stop-color:#7a9b7a;stop-opacity:1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    
                    <h2 class="temporal-echo-title">${echoContent.title}</h2>
                    <p class="temporal-echo-subtitle">${echoContent.subtitle}</p>
                </div>
                
                <div class="temporal-echo-body">
                    ${contentHTML}
                </div>
                
                <div class="temporal-echo-actions">
                    <button class="temporal-echo-continue-btn" id="temporalEchoContinueBtn">
                        Continue
                    </button>
                    
                    <button class="temporal-echo-reflect-btn" id="temporalEchoReflectBtn">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Reflect More
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Setup event listeners
        this.setupTemporalEchoEvents(overlay, echoContent);
        
        // Show with animation
        setTimeout(() => {
            overlay.classList.add('show');
        }, 100);
        
        // Auto-dismiss after 15 seconds if no interaction
        setTimeout(() => {
            if (overlay.parentElement) {
                this.dismissTemporalEcho(overlay);
            }
        }, 15000);
    }

    createJournalEntryEchoHTML(echoContent) {
        const entry = echoContent.content;
        const formattedDate = new Date(entry.timestamp).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        
        return `
            <div class="journal-echo-content">
                <div class="journal-echo-date">
                    ${formattedDate}
                </div>
                
                <div class="journal-echo-text">
                    "${entry.content}"
                </div>
                
                ${entry.mood ? `
                    <div class="journal-echo-mood">
                        <span class="mood-label">Mood:</span>
                        <span class="mood-value">${entry.mood}</span>
                    </div>
                ` : ''}
                
                ${entry.gratitude && entry.gratitude.length > 0 ? `
                    <div class="journal-echo-gratitude">
                        <span class="gratitude-label">Gratitude:</span>
                        <span class="gratitude-value">${entry.gratitude[0]}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    createCuratedQuoteEchoHTML(echoContent) {
        const quote = echoContent.content;
        
        return `
            <div class="quote-echo-content">
                <div class="quote-echo-text">
                    "${quote.text}"
                </div>
                
                <div class="quote-echo-author">
                    — ${quote.author}
                </div>
                
                <div class="quote-echo-category">
                    ${quote.category}
                </div>
            </div>
        `;
    }

    setupTemporalEchoEvents(overlay, echoContent) {
        const continueBtn = overlay.querySelector('#temporalEchoContinueBtn');
        const reflectBtn = overlay.querySelector('#temporalEchoReflectBtn');
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.handleContinue(overlay, echoContent);
            });
        }
        
        if (reflectBtn) {
            reflectBtn.addEventListener('click', () => {
                this.handleReflectMore(overlay, echoContent);
            });
        }
        
        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.dismissTemporalEcho(overlay);
            }
        });
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.dismissTemporalEcho(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    handleContinue(overlay, echoContent) {
        console.log('▶️ User chose to continue...');
        
        // Track choice
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('temporal_echo_continue', {
                echo_type: echoContent.type,
                choice: 'continue'
            });
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'light');
        }
        
        // Dismiss overlay
        this.dismissTemporalEcho(overlay);
    }

    handleReflectMore(overlay, echoContent) {
        console.log('🪞 User chose to reflect more...');
        
        // Track choice
        if (window.analyticsSystem) {
            window.analyticsSystem.trackEvent('temporal_echo_reflect', {
                echo_type: echoContent.type,
                choice: 'reflect_more'
            });
        }
        
        // Provide haptic feedback
        if (window.hapticStorytelling) {
            window.hapticStorytelling.provideImmediateFeedback('success', 'medium');
        }
        
        // Dismiss overlay and navigate to journal
        this.dismissTemporalEcho(overlay);
        
        // Navigate to journal page
        setTimeout(() => {
            if (window.navigationManager) {
                window.navigationManager.navigateToPage('journal');
            }
        }, 300);
    }

    dismissTemporalEcho(overlay) {
        if (overlay && overlay.parentElement) {
            overlay.classList.remove('show');
            overlay.classList.add('hide');
            
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    getEchoHistory() {
        const history = localStorage.getItem(this.echoHistoryKey);
        return history ? JSON.parse(history) : [];
    }

    recordEchoHistory(entryId) {
        const history = this.getEchoHistory();
        history.unshift(entryId);
        
        // Keep only last 20 echoes
        if (history.length > 20) {
            history.splice(20);
        }
        
        localStorage.setItem(this.echoHistoryKey, JSON.stringify(history));
    }

    // Public API
    showEcho() {
        this.showTemporalEcho();
    }

    addJournalEntry(entry) {
        const entries = this.getJournalEntries();
        const newEntry = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            content: entry.content,
            mood: entry.mood,
            gratitude: entry.gratitude,
            tags: entry.tags || []
        };
        
        entries.unshift(newEntry);
        
        // Keep only last 100 entries
        if (entries.length > 100) {
            entries.splice(100);
        }
        
        localStorage.setItem(this.journalEntriesKey, JSON.stringify(entries));
        
        console.log('📝 Journal entry added to temporal echo system');
    }

    getEchoStats() {
        const entries = this.getJournalEntries();
        const history = this.getEchoHistory();
        
        return {
            totalEntries: entries.length,
            echoesShown: history.length,
            lastEcho: history.length > 0 ? history[0] : null
        };
    }

    // Cleanup
    destroy() {
        // Remove any active overlays
        const overlay = document.querySelector('#temporal-echo-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.isInitialized = false;
    }
}

// Initialize temporal echo system
window.TemporalEcho = TemporalEcho;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.temporalEcho = new TemporalEcho();
    });
} else {
    window.temporalEcho = new TemporalEcho();
}
