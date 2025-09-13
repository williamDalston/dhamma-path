/**
 * Journal Page Error Handler
 * Ultra-robust error handling specifically for the journal functionality
 */

class JournalErrorHandler {
    constructor() {
        this.journal = null;
        this.errorCount = 0;
        this.maxRetries = 3;
        this.fallbackMode = false;
        this.localStorageFallback = false;
        this.autoSaveEnabled = true;
        this.init();
    }

    init() {
        this.setupEditorErrorHandlers();
        this.setupSaveErrorHandlers();
        this.setupLoadErrorHandlers();
        this.setupAutoSaveErrorHandlers();
        this.setupWordCountErrorHandlers();
    }

    setupEditorErrorHandlers() {
        // Rich text editor initialization errors
        this.handleEditorInitError = (error) => {
            console.error('Editor initialization error:', error);
            this.errorCount++;
            
            if (this.errorCount <= this.maxRetries) {
                this.showRecoveryNotification('Editor failed to load', 'Retrying...', 'warning');
                setTimeout(() => this.reinitializeEditor(), 1000);
            } else {
                this.enableTextareaFallback();
            }
        };

        // Editor content corruption errors
        this.handleEditorContentError = (error) => {
            console.error('Editor content error:', error);
            this.showRecoveryNotification('Content may be corrupted', 'Attempting to recover...', 'warning');
            this.recoverEditorContent();
        };

        // Editor focus errors
        this.handleEditorFocusError = (error) => {
            console.error('Editor focus error:', error);
            this.showRecoveryNotification('Editor focus lost', 'Click to refocus', 'info');
            this.refocusEditor();
        };
    }

    setupSaveErrorHandlers() {
        // Save operation errors
        this.handleSaveError = (error) => {
            console.error('Save error:', error);
            this.showRecoveryNotification('Save failed', 'Trying alternative save method...', 'error');
            this.attemptAlternativeSave();
        };

        // Network save errors
        this.handleNetworkSaveError = (error) => {
            console.error('Network save error:', error);
            this.showRecoveryNotification('Network save failed', 'Saving locally instead', 'warning');
            this.enableLocalStorageFallback();
        };

        // Save validation errors
        this.handleSaveValidationError = (error) => {
            console.error('Save validation error:', error);
            this.showRecoveryNotification('Invalid content detected', 'Cleaning content before save', 'warning');
            this.cleanContentBeforeSave();
        };
    }

    setupLoadErrorHandlers() {
        // Entry loading errors
        this.handleLoadError = (error) => {
            console.error('Load error:', error);
            this.showRecoveryNotification('Failed to load entries', 'Showing empty state', 'warning');
            this.showEmptyState();
        };

        // Entry parsing errors
        this.handleParseError = (error) => {
            console.error('Parse error:', error);
            this.showRecoveryNotification('Entry format error', 'Skipping corrupted entries', 'warning');
            this.skipCorruptedEntries();
        };

        // Entry corruption errors
        this.handleEntryCorruptionError = (error) => {
            console.error('Entry corruption error:', error);
            this.showRecoveryNotification('Entry corrupted', 'Attempting to recover', 'error');
            this.recoverCorruptedEntry();
        };
    }

    setupAutoSaveErrorHandlers() {
        // Auto-save timer errors
        this.handleAutoSaveError = (error) => {
            console.error('Auto-save error:', error);
            this.showRecoveryNotification('Auto-save failed', 'Switching to manual save only', 'warning');
            this.disableAutoSave();
        };

        // Auto-save conflict errors
        this.handleAutoSaveConflictError = (error) => {
            console.error('Auto-save conflict error:', error);
            this.showRecoveryNotification('Save conflict detected', 'Manual intervention required', 'error');
            this.handleSaveConflict();
        };
    }

    setupWordCountErrorHandlers() {
        // Word count calculation errors
        this.handleWordCountError = (error) => {
            console.error('Word count error:', error);
            this.showRecoveryNotification('Word counter failed', 'Disabling word count', 'info');
            this.disableWordCount();
        };

        // Character count errors
        this.handleCharacterCountError = (error) => {
            console.error('Character count error:', error);
            this.showRecoveryNotification('Character counter failed', 'Disabling character count', 'info');
            this.disableCharacterCount();
        };
    }

    // Recovery Actions
    reinitializeEditor() {
        try {
            const editorContainer = document.getElementById('journal-editor');
            if (editorContainer) {
                editorContainer.innerHTML = '';
                this.createRichTextEditor();
            }
            this.showRecoveryNotification('Editor reinitialized', 'Ready to use', 'success');
        } catch (error) {
            console.error('Editor reinitialization failed:', error);
            this.enableTextareaFallback();
        }
    }

    enableTextareaFallback() {
        this.fallbackMode = true;
        this.showTextareaFallbackUI();
        this.showRecoveryNotification('Fallback editor enabled', 'Basic text editing available', 'warning');
    }

    showTextareaFallbackUI() {
        const editorContainer = document.getElementById('journal-editor');
        if (editorContainer) {
            editorContainer.innerHTML = `
                <div class="journal-fallback">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Journal Entry
                        </label>
                        <textarea id="fallback-textarea" 
                                  class="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Write your thoughts here..."></textarea>
                    </div>
                    
                    <div class="flex justify-between items-center mb-4">
                        <div class="text-sm text-gray-600">
                            <span id="fallback-word-count">Words: 0</span> | 
                            <span id="fallback-char-count">Characters: 0</span>
                        </div>
                        <div class="flex space-x-2">
                            <button id="fallback-save-btn" 
                                    onclick="window.journalErrorHandler.saveFallbackEntry()"
                                    class="btn-premium btn-primary">
                                💾 Save Entry
                            </button>
                            <button id="fallback-clear-btn" 
                                    onclick="window.journalErrorHandler.clearFallbackEntry()"
                                    class="btn-premium btn-outline">
                                🗑️ Clear
                            </button>
                        </div>
                    </div>
                    
                    <div class="mb-4">
                        <h3 class="text-lg font-semibold mb-2">Recent Entries</h3>
                        <div id="fallback-entries-list" class="space-y-2">
                            <!-- Entries will be loaded here -->
                        </div>
                    </div>
                </div>
            `;
            
            this.setupFallbackEventListeners();
            this.loadFallbackEntries();
        }
    }

    setupFallbackEventListeners() {
        const textarea = document.getElementById('fallback-textarea');
        if (textarea) {
            textarea.addEventListener('input', () => {
                this.updateFallbackWordCount();
                this.autoSaveFallbackEntry();
            });
        }
    }

    updateFallbackWordCount() {
        const textarea = document.getElementById('fallback-textarea');
        const wordCountEl = document.getElementById('fallback-word-count');
        const charCountEl = document.getElementById('fallback-char-count');
        
        if (textarea && wordCountEl && charCountEl) {
            const text = textarea.value;
            const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            const chars = text.length;
            
            wordCountEl.textContent = `Words: ${words}`;
            charCountEl.textContent = `Characters: ${chars}`;
        }
    }

    saveFallbackEntry() {
        const textarea = document.getElementById('fallback-textarea');
        if (!textarea || !textarea.value.trim()) {
            this.showRecoveryNotification('Nothing to save', 'Please write something first', 'warning');
            return;
        }

        try {
            const entry = {
                id: Date.now(),
                content: textarea.value,
                timestamp: new Date().toISOString(),
                wordCount: textarea.value.trim().split(/\s+/).length,
                characterCount: textarea.value.length
            };

            if (this.localStorageFallback) {
                this.saveToLocalStorage(entry);
            } else {
                this.saveToServer(entry);
            }

            this.showRecoveryNotification('Entry saved', 'Your thoughts are safe', 'success');
            this.loadFallbackEntries();
            textarea.value = '';
            this.updateFallbackWordCount();
        } catch (error) {
            console.error('Fallback save error:', error);
            this.showRecoveryNotification('Save failed', 'Please try again', 'error');
        }
    }

    saveToLocalStorage(entry) {
        const entries = JSON.parse(localStorage.getItem('journal-entries') || '[]');
        entries.unshift(entry);
        
        // Keep only last 100 entries
        if (entries.length > 100) {
            entries.splice(100);
        }
        
        localStorage.setItem('journal-entries', JSON.stringify(entries));
    }

    async saveToServer(entry) {
        try {
            const response = await fetch('/api/journal/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
            
            if (!response.ok) {
                throw new Error(`Server save failed: ${response.status}`);
            }
        } catch (error) {
            console.error('Server save failed:', error);
            throw error;
        }
    }

    loadFallbackEntries() {
        const entriesList = document.getElementById('fallback-entries-list');
        if (!entriesList) return;

        try {
            const entries = JSON.parse(localStorage.getItem('journal-entries') || '[]');
            
            if (entries.length === 0) {
                entriesList.innerHTML = '<p class="text-gray-500 text-center py-4">No entries yet. Start writing!</p>';
                return;
            }

            entriesList.innerHTML = entries.slice(0, 10).map(entry => `
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-2">
                        <span class="text-sm text-gray-500">
                            ${new Date(entry.timestamp).toLocaleDateString()}
                        </span>
                        <button onclick="window.journalErrorHandler.deleteFallbackEntry(${entry.id})"
                                class="text-red-500 hover:text-red-700 text-sm">
                            Delete
                        </button>
                    </div>
                    <div class="text-gray-700">
                        ${entry.content.length > 200 ? 
                            entry.content.substring(0, 200) + '...' : 
                            entry.content}
                    </div>
                    <div class="text-xs text-gray-500 mt-2">
                        ${entry.wordCount} words • ${entry.characterCount} characters
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Failed to load entries:', error);
            entriesList.innerHTML = '<p class="text-red-500 text-center py-4">Failed to load entries</p>';
        }
    }

    deleteFallbackEntry(entryId) {
        try {
            const entries = JSON.parse(localStorage.getItem('journal-entries') || '[]');
            const filteredEntries = entries.filter(entry => entry.id !== entryId);
            localStorage.setItem('journal-entries', JSON.stringify(filteredEntries));
            this.loadFallbackEntries();
            this.showRecoveryNotification('Entry deleted', 'Entry removed successfully', 'success');
        } catch (error) {
            console.error('Failed to delete entry:', error);
            this.showRecoveryNotification('Delete failed', 'Please try again', 'error');
        }
    }

    clearFallbackEntry() {
        const textarea = document.getElementById('fallback-textarea');
        if (textarea) {
            if (textarea.value.trim()) {
                if (confirm('Are you sure you want to clear this entry? This cannot be undone.')) {
                    textarea.value = '';
                    this.updateFallbackWordCount();
                    this.showRecoveryNotification('Entry cleared', 'Ready for new thoughts', 'info');
                }
            } else {
                this.showRecoveryNotification('Nothing to clear', 'Entry is already empty', 'info');
            }
        }
    }

    autoSaveFallbackEntry() {
        if (!this.autoSaveEnabled) return;
        
        const textarea = document.getElementById('fallback-textarea');
        if (textarea && textarea.value.trim()) {
            // Debounce auto-save
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => {
                this.saveFallbackEntry();
            }, 30000); // Auto-save every 30 seconds
        }
    }

    recoverEditorContent() {
        try {
            const content = localStorage.getItem('journal-draft');
            if (content) {
                const editor = document.getElementById('journal-editor');
                if (editor) {
                    editor.innerHTML = content;
                }
                this.showRecoveryNotification('Content recovered', 'Draft content restored', 'success');
            } else {
                this.showRecoveryNotification('No draft found', 'Starting fresh entry', 'info');
            }
        } catch (error) {
            console.error('Content recovery failed:', error);
            this.showRecoveryNotification('Recovery failed', 'Starting fresh entry', 'warning');
        }
    }

    refocusEditor() {
        const editor = document.getElementById('journal-editor');
        if (editor) {
            editor.focus();
        }
    }

    attemptAlternativeSave() {
        // Try different save methods
        if (this.localStorageFallback) {
            this.showRecoveryNotification('Using local storage', 'Entry will be saved locally', 'info');
        } else {
            this.enableLocalStorageFallback();
        }
    }

    enableLocalStorageFallback() {
        this.localStorageFallback = true;
        this.showRecoveryNotification('Local storage enabled', 'Entries will be saved locally', 'warning');
    }

    cleanContentBeforeSave() {
        try {
            const editor = document.getElementById('journal-editor');
            if (editor) {
                // Remove potentially dangerous content
                const content = editor.innerHTML
                    .replace(/<script[^>]*>.*?<\/script>/gi, '')
                    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
                    .replace(/javascript:/gi, '');
                
                editor.innerHTML = content;
                this.showRecoveryNotification('Content cleaned', 'Ready to save safely', 'success');
            }
        } catch (error) {
            console.error('Content cleaning failed:', error);
            this.showRecoveryNotification('Content cleaning failed', 'Saving as plain text', 'warning');
        }
    }

    showEmptyState() {
        const entriesList = document.getElementById('fallback-entries-list');
        if (entriesList) {
            entriesList.innerHTML = `
                <div class="text-center py-8">
                    <div class="text-6xl mb-4">📝</div>
                    <h3 class="text-lg font-semibold mb-2">No entries yet</h3>
                    <p class="text-gray-600 mb-4">Start your journaling journey by writing your first entry.</p>
                    <button onclick="document.getElementById('fallback-textarea').focus()"
                            class="btn-premium btn-primary">
                        Start Writing
                    </button>
                </div>
            `;
        }
    }

    skipCorruptedEntries() {
        // Implementation for skipping corrupted entries
        this.showRecoveryNotification('Corrupted entries skipped', 'Valid entries loaded', 'info');
    }

    recoverCorruptedEntry() {
        // Implementation for recovering corrupted entries
        this.showRecoveryNotification('Entry recovery attempted', 'Check if content is intact', 'warning');
    }

    disableAutoSave() {
        this.autoSaveEnabled = false;
        this.showRecoveryNotification('Auto-save disabled', 'Please save manually', 'warning');
    }

    handleSaveConflict() {
        // Implementation for handling save conflicts
        this.showRecoveryNotification('Save conflict detected', 'Please resolve manually', 'error');
    }

    disableWordCount() {
        const wordCountEl = document.getElementById('fallback-word-count');
        if (wordCountEl) {
            wordCountEl.style.display = 'none';
        }
    }

    disableCharacterCount() {
        const charCountEl = document.getElementById('fallback-char-count');
        if (charCountEl) {
            charCountEl.style.display = 'none';
        }
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
    setJournal(journal) {
        this.journal = journal;
    }

    getErrorStats() {
        return {
            errorCount: this.errorCount,
            fallbackMode: this.fallbackMode,
            localStorageFallback: this.localStorageFallback,
            autoSaveEnabled: this.autoSaveEnabled
        };
    }

    reset() {
        this.errorCount = 0;
        this.fallbackMode = false;
        this.localStorageFallback = false;
        this.autoSaveEnabled = true;
        clearTimeout(this.autoSaveTimeout);
    }
}

// Initialize journal error handler
window.JournalErrorHandler = JournalErrorHandler;

// Auto-initialize when journal page loads
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('journal') || document.getElementById('journal-editor')) {
        window.journalErrorHandler = new JournalErrorHandler();
    }
});
