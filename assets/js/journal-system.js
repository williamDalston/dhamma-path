/**
 * Journal System
 * Handles journal functionality including emotion selection and text input
 */

class JournalSystem {
    constructor() {
        this.currentEmotion = null;
        this.journalEntry = '';
        this.initializeJournal();
    }
    
    initializeJournal() {
        this.setupEmotionButtons();
        this.setupTextInput();
        this.setupAutoSave();
    }
    
    setupEmotionButtons() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.emotion-btn')) {
                const button = e.target.closest('.emotion-btn');
                const emotion = button.dataset.emotion;
                this.selectEmotion(emotion, button);
            }
        });
    }
    
    selectEmotion(emotion, button) {
        // Remove previous selection
        document.querySelectorAll('.emotion-btn').forEach(btn => {
            btn.classList.remove('selected', 'bg-sage-deep/20', 'border-sage-deep/40');
            btn.classList.add('border-transparent');
        });
        
        // Select new emotion
        button.classList.add('selected', 'bg-sage-deep/20', 'border-sage-deep/40');
        button.classList.remove('border-transparent');
        
        this.currentEmotion = emotion;
        
        // Dispatch emotion selected event
        document.dispatchEvent(new CustomEvent('emotionSelected', {
            detail: { 
                emotion: emotion,
                timestamp: new Date(),
                element: button
            }
        }));
        
        console.log(`🎭 Emotion selected: ${emotion}`);
    }
    
    setupTextInput() {
        const textarea = document.getElementById('journal-textarea');
        if (textarea) {
            textarea.addEventListener('input', (e) => {
                this.journalEntry = e.target.value;
                
                // Dispatch text input event for anticipation system
                document.dispatchEvent(new CustomEvent('textInput', {
                    detail: { 
                        text: e.target.value,
                        length: e.target.value.length,
                        timestamp: new Date()
                    }
                }));
            });
            
            textarea.addEventListener('blur', () => {
                this.saveJournalEntry();
            });
        }
    }
    
    setupAutoSave() {
        const textarea = document.getElementById('journal-textarea');
        if (textarea) {
            // Auto-save every 30 seconds
            setInterval(() => {
                if (this.journalEntry.trim()) {
                    this.saveJournalEntry();
                }
            }, 30000);
        }
    }
    
    saveJournalEntry() {
        const textarea = document.getElementById('journal-textarea');
        if (!textarea || !this.journalEntry.trim()) return;
        
        const entry = {
            text: this.journalEntry,
            emotion: this.currentEmotion,
            timestamp: new Date(),
            wordCount: this.journalEntry.trim().split(/\s+/).length,
            characterCount: this.journalEntry.length
        };
        
        // Save to data persistence system
        if (window.dataPersistence) {
            window.dataPersistence.addJournalEntry(entry);
        }
        
        // Dispatch journal entry saved event
        document.dispatchEvent(new CustomEvent('journalEntrySaved', {
            detail: entry
        }));
        
        console.log('📝 Journal entry saved:', entry);
    }
    
    getCurrentEntry() {
        return {
            text: this.journalEntry,
            emotion: this.currentEmotion,
            timestamp: new Date()
        };
    }
    
    clearEntry() {
        this.journalEntry = '';
        this.currentEmotion = null;
        
        const textarea = document.getElementById('journal-textarea');
        if (textarea) {
            textarea.value = '';
        }
        
        // Clear emotion selection
        document.querySelectorAll('.emotion-btn').forEach(btn => {
            btn.classList.remove('selected', 'bg-sage-deep/20', 'border-sage-deep/40');
            btn.classList.add('border-transparent');
        });
    }
}

// Initialize journal system
document.addEventListener('DOMContentLoaded', () => {
    window.journalSystem = new JournalSystem();
});
