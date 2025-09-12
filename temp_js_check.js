    // --- SIMPLIFIED WORKING JAVASCRIPT --- //
    
    // Test if JavaScript is running at all
    // JavaScript initialized
    
    // Simple button test function
    function testButtonClick() {
        // Button clicked
        // Remove alert for production
    }
    
    // Check for overlays or blocking elements
    function checkForBlockingElements() {
        // Checking for blocking elements
        const timerButtons = document.querySelectorAll('button[id*="timer"]');
        
        timerButtons.forEach((btn, index) => {
            const rect = btn.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(btn);
            // Button debug info (commented out for production)
            // console.log(`Button ${index}:`, { element, rect, pointerEvents, zIndex, position, display, visibility, opacity });
            
            // Check if there's an element covering this button
            const elementAtCenter = document.elementFromPoint(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2
            );
            // console.log(`Element at button ${index} center:`, elementAtCenter);
        });
    }
    
    // Add missing functions that buttons are calling
    function testWorkoutSound() {
        // Testing workout sound
        // Remove alert for production
        
        // Create audio context for sound
        let audioContext = null;
        
        function initAudio() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }
        
        function playBell() {
            initAudio();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Create a simple bell sound using Web Audio API
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
        
        playBell();
    }
    
    function playRecording(url) {
        // Playing recording
        // Remove alert for production
        
        // Create audio element and play
        const audio = new Audio(url);
        audio.play().catch(e => {
            console.error('Error playing audio:', e);
            // Removed alert for production
        });
    }
    
    // Enhanced Toast Notification System
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        const colors = {
            success: 'from-green-500 to-green-600',
            error: 'from-red-500 to-red-600',
            warning: 'from-yellow-500 to-yellow-600',
            info: 'from-blue-500 to-blue-600'
        };
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.className = `fixed top-4 right-4 z-50 bg-gradient-to-r ${colors[type]} text-white px-6 py-4 rounded-lg shadow-xl transform translate-x-full transition-transform duration-300 ease-out`;
        toast.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-xl">${icons[type]}</span>
                <span class="font-medium">${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }
    
    // Enhanced Haptic Feedback
    function triggerHapticFeedback(type = 'light') {
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30],
                success: [10, 10, 10],
                error: [50, 100, 50]
            };
            navigator.vibrate(patterns[type] || patterns.light);
        }
    }
    
    // Make test functions globally accessible
    window.testButtonClick = testButtonClick;
    window.checkForBlockingElements = checkForBlockingElements;
    window.testWorkoutSound = testWorkoutSound;
    window.playRecording = playRecording;
    window.showToast = showToast;
    window.triggerHapticFeedback = triggerHapticFeedback;
    
    // Global variables
    let mainContent;
    let currentPage = 'home';
    
    // Performance optimization utilities
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };
    
    // Lazy loading for non-critical functions
    const lazyLoad = (fn) => {
        return (...args) => {
            if (typeof fn === 'function') {
                return fn(...args);
            }
            return Promise.resolve();
        };
    };

    // Simple database
    const db = {
        articles: {
            "what-is-theravada": {
                title: "What Is Theravāda Buddhism? A Simple Guide",
                category: "Introduction",
                categoryId: "introduction",
                readTime: "8",
                content: "<p>This is a simple guide to Theravāda Buddhism.</p>",
                author: "admin",
                tags: ["buddhism", "theravada", "introduction"]
            }
        },
        authors: {
            admin: {
                name: "The Dhamma Path Team",
                bio: "Dedicated to sharing authentic Buddhist teachings",
                avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMyZDUwMTYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNWwtNS01IDEuNDEtMS40MUwxMCAxNC4xN2w3LjU5LTcuNTlMMTkgOGwtOSA5eiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo="
            }
        },
        glossary: {
            "dhamma": "The teachings of the Buddha",
            "sangha": "The community of Buddhist practitioners",
            "buddha": "One who is awakened or enlightened"
        }
    };

    // Simple navigation function
    function navigateToPage(pageName, id = null) {
        // Navigating to page
        
        if (!mainContent) {
            mainContent = document.getElementById('main-content');
            if (!mainContent) {
                console.error('Main content not found');
                return;
            }
        }
        
        // Show enhanced loading indicator
        mainContent.innerHTML = `
            <div class="flex items-center justify-center min-h-[400px]">
                <div class="text-center">
                    <div class="relative mb-6">
                        <div class="animate-spin rounded-full h-16 w-16 border-4 border-forest-green/20 border-t-forest-green mx-auto"></div>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="w-8 h-8 bg-forest-green/20 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <p class="text-charcoal/70 text-lg font-medium">Loading your practice...</p>
                    <div class="mt-4 flex justify-center space-x-1">
                        <div class="w-2 h-2 bg-forest-green rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-forest-green rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-forest-green rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Set current page
        currentPage = pageName;
        
        // Performance optimized template lookup
        const pageTemplates = {
            'home': 'template-home',
            'timer': 'template-timer',
            'journal': 'template-journal',
            'workout': 'template-workout',
            'interview': 'template-interview',
            'about': 'template-about',
            'glossary': 'template-glossary',
            'category-meditation': 'template-category',
            'category-introduction': 'template-category',
            'article': 'template-article',
            'privacy': 'template-privacy',
            'terms': 'template-terms',
            'path': 'template-path',
            'searchResults': 'template-search-results'
        };
        
        const templateId = pageTemplates[pageName] || 'template-home';
        const template = document.getElementById(templateId);
        const pageContent = template ? template.content.cloneNode(true) : null;
        
        if (pageContent) {
            // Use requestAnimationFrame for optimal performance
            requestAnimationFrame(() => {
                mainContent.innerHTML = '';
                mainContent.appendChild(pageContent);
                
                // Lazy load page-specific logic
                const pageLogicHandlers = {
                    'home': attachHomeLogic,
                    'timer': attachTimerLogic,
                    'journal': () => {
                        attachJournalLogic();
                        setupEnhancedJournalFeatures();
                    },
                    'workout': () => {
                        attachWorkoutLogic();
                        setupEnhancedWorkoutFeatures();
                    },
                    'interview': () => {
                        attachInterviewLogic();
                        setupEnhancedInterviewFeatures();
                    },
                    'about': attachDataManagementLogic
                };
                
                const handler = pageLogicHandlers[pageName];
                if (handler) {
                    // Calling page handler
                    handler();
                } else {
                    // No handler found for page
                }
            });
        }
        
        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    }

    // Make navigation globally accessible
    window.navigateTo = navigateToPage;
    window.navigateToPage = navigateToPage;

    // ===== GLOBAL TIMER FUNCTIONS =====
    // These are defined at the top so they're available everywhere
    window.startTimer = function() {
        // Start timer called
        if (!window.isRunning) {
            window.isRunning = true;
            window.isPaused = false;
            
            if (window.startBtn) window.startBtn.classList.add('hidden');
            if (window.pauseBtn) window.pauseBtn.classList.remove('hidden');
                
            window.timerInterval = setInterval(() => {
                if (window.timeRemaining > 0) {
                    window.timeRemaining--;
                    window.updateDisplay();
                } else {
                    clearInterval(window.timerInterval);
                    window.isRunning = false;
                    if (window.status) window.status.textContent = 'Session complete! 🎉';
                    if (window.startBtn) {
                        window.startBtn.classList.remove('hidden');
                        window.startBtn.innerHTML = '<div class="flex items-center justify-center space-x-2"><span class="text-xl">▶️</span><span>Start Meditation</span></div>';
                    }
                    if (window.pauseBtn) window.pauseBtn.classList.add('hidden');
                }
            }, 1000);
        }
    };

    window.pauseTimer = function() {
        if (window.isRunning) {
            window.isRunning = false;
            window.isPaused = true;
            clearInterval(window.timerInterval);
            if (window.startBtn) window.startBtn.classList.remove('hidden');
            if (window.pauseBtn) window.pauseBtn.classList.add('hidden');
            window.updateDisplay();
        }
    };

    window.resetTimer = function() {
        clearInterval(window.timerInterval);
        window.isRunning = false;
        window.isPaused = false;
        if (window.durationSelect) {
            window.timeRemaining = parseInt(window.durationSelect.value);
            window.totalTime = window.timeRemaining;
        } else {
            window.timeRemaining = 600;
            window.totalTime = 600;
        }
        window.updateDisplay();
        if (window.startBtn) {
            window.startBtn.classList.remove('hidden');
            window.startBtn.innerHTML = '<div class="flex items-center justify-center space-x-2"><span class="text-xl">▶️</span><span>Start Meditation</span></div>';
        }
        if (window.pauseBtn) window.pauseBtn.classList.add('hidden');
    };

    window.updateDisplay = function() {
        if (window.display) {
            const minutes = Math.floor(window.timeRemaining / 60);
            const seconds = window.timeRemaining % 60;
            const displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            window.display.textContent = displayText;
        }
        if (window.status) {
            if (window.isRunning) {
                window.status.textContent = 'Meditating...';
            } else if (window.isPaused) {
                window.status.textContent = 'Paused';
            } else {
                window.status.textContent = 'Ready to begin';
            }
        }
    };

    // Home page logic
    function attachHomeLogic() {
        // Attaching home page logic
        // Home page doesn't need specific logic, just initialization
    }

    // Data Management UI Logic
    function attachDataManagementLogic() {
        // Update storage info
        function updateStorageInfo() {
            const storageInfo = DataManager.getStorageInfo();
            const totalStorageEl = document.getElementById('total-storage');
            const storageBarEl = document.getElementById('storage-bar');
            
            if (totalStorageEl) {
                totalStorageEl.textContent = storageInfo.totalSizeFormatted;
            }
            
            if (storageBarEl) {
                const percentage = (storageInfo.totalSize / storageInfo.availableSpace) * 100;
                storageBarEl.style.width = `${Math.min(percentage, 100)}%`;
            }
        }
        
        // Update progress stats
        function updateProgressStats() {
            const timerSettings = DataManager.get(DataManager.KEYS.TIMER_SETTINGS, DataManager.DEFAULTS.timerSettings);
            const workoutProgress = DataManager.get(DataManager.KEYS.WORKOUT_PROGRESS, DataManager.DEFAULTS.workoutProgress);
            const journalEntries = DataManager.get(DataManager.KEYS.JOURNAL_ENTRIES, []);
            
            const totalSessionsEl = document.getElementById('total-sessions');
            const totalWorkoutsEl = document.getElementById('total-workouts');
            const journalEntriesEl = document.getElementById('journal-entries');
            const totalTimeEl = document.getElementById('total-time');
            
            if (totalSessionsEl) totalSessionsEl.textContent = timerSettings.totalSessions || 0;
            if (totalWorkoutsEl) totalWorkoutsEl.textContent = workoutProgress.totalWorkouts || 0;
            if (journalEntriesEl) journalEntriesEl.textContent = journalEntries.length;
            if (totalTimeEl) totalTimeEl.textContent = Math.round((timerSettings.totalTime || 0) / 60);
        }
        
        // Export data
        function exportData() {
            try {
                const data = DataManager.exportData();
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `dhamma-path-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                showToast('Data exported successfully! 📤', 'success');
            } catch (error) {
                console.error('Export failed:', error);
                showToast('Export failed. Please try again.', 'error');
            }
        }
        
        // Import data
        function importData(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);
                    const result = DataManager.importData(importedData);
                    
                    if (result.success) {
                        showToast(`Successfully imported ${result.importedCount} data sets! 📥`, 'success');
                        updateStorageInfo();
                        updateProgressStats();
                    } else {
                        showToast(`Import failed: ${result.error}`, 'error');
                    }
                } catch (error) {
                    console.error('Import failed:', error);
                    showToast('Invalid file format. Please select a valid backup file.', 'error');
                }
            };
            reader.readAsText(file);
        }
        
        // Clear specific data
        function clearJournalData() {
            if (confirm('Are you sure you want to clear all journal entries? This cannot be undone.')) {
                DataManager.set(DataManager.KEYS.JOURNAL_ENTRIES, []);
                DataManager.remove(DataManager.KEYS.JOURNAL_DRAFT);
                showToast('Journal entries cleared', 'success');
                updateProgressStats();
            }
        }
        
        function clearTimerData() {
            if (confirm('Are you sure you want to clear timer history? This cannot be undone.')) {
                DataManager.set(DataManager.KEYS.TIMER_SETTINGS, DataManager.DEFAULTS.timerSettings);
                showToast('Timer history cleared', 'success');
                updateProgressStats();
            }
        }
        
        function clearAllData() {
            if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
                DataManager.clearAll();
                showToast('All data cleared', 'success');
                updateStorageInfo();
                updateProgressStats();
            }
        }
        
        // Event listeners
        const exportBtn = document.getElementById('export-data');
        const importInput = document.getElementById('import-data');
        const clearJournalBtn = document.getElementById('clear-journal');
        const clearTimerBtn = document.getElementById('clear-timer-data');
        const clearAllBtn = document.getElementById('clear-all-data');
        
        if (exportBtn) exportBtn.addEventListener('click', exportData);
        if (importInput) importInput.addEventListener('change', (e) => {
            if (e.target.files[0]) importData(e.target.files[0]);
        });
        if (clearJournalBtn) clearJournalBtn.addEventListener('click', clearJournalData);
        if (clearTimerBtn) clearTimerBtn.addEventListener('click', clearTimerData);
        if (clearAllBtn) clearAllBtn.addEventListener('click', clearAllData);
        
        // Initial updates
        updateStorageInfo();
        updateProgressStats();
        
        // Listen for data changes
        window.addEventListener('dataChanged', () => {
            updateStorageInfo();
            updateProgressStats();
        });
    }

    // Timer logic
    function attachTimerLogic() {
        // Attaching enhanced timer logic
        
        // Add a small delay to ensure DOM is fully rendered
        setTimeout(() => {
            // Looking for timer elements after delay
            
            const startBtn = document.getElementById('timer-start-btn');
            const pauseBtn = document.getElementById('timer-pause-btn');
            const resetBtn = document.getElementById('timer-reset-btn');
            const display = document.getElementById('timer-display');
            const status = document.getElementById('timer-status');
            const durationSelect = document.getElementById('timer-duration');
            const soundToggle = document.getElementById('timer-sound');
            const progressRing = document.getElementById('progress-ring');
            
            // Set global variables
            window.startBtn = startBtn;
            window.pauseBtn = pauseBtn;
            window.resetBtn = resetBtn;
            window.display = display;
            window.status = status;
            window.durationSelect = durationSelect;
            window.soundToggle = soundToggle;
            window.progressRing = progressRing;
            
            // Initialize timer state
            window.timeRemaining = parseInt(durationSelect ? durationSelect.value : 600);
            window.totalTime = window.timeRemaining;
            
            // Event listeners
            if (startBtn) {
                startBtn.addEventListener('click', window.startTimer);
            }
            if (pauseBtn) {
                pauseBtn.addEventListener('click', window.pauseTimer);
            }
            if (resetBtn) {
                resetBtn.addEventListener('click', window.resetTimer);
            }
            
            // Duration change
            if (durationSelect) {
                durationSelect.addEventListener('change', () => {
                    if (!window.isRunning) {
                        window.timeRemaining = parseInt(durationSelect.value);
                        window.totalTime = window.timeRemaining;
                        window.updateDisplay();
                    }
                });
            }
            
            // Initialize display
            window.updateDisplay();
        }, 100);
    }

    // Journal logic
    function attachJournalLogic() {
        // Attaching journal logic
        
        const saveBtn = document.getElementById('journal-save-btn');
        const entryText = document.getElementById('journal-entry');
        const entriesList = document.getElementById('journal-entries');
        
        function saveEntry() {
            if (entryText && entryText.value.trim()) {
                const entry = {
                    text: entryText.value.trim(),
                    date: new Date().toLocaleString()
                };
                
                let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
                entries.unshift(entry);
                localStorage.setItem('journalEntries', JSON.stringify(entries));
                
                // Clear textarea and draft
                entryText.value = '';
                localStorage.removeItem('journal-draft');
                
                // Hide save button
                if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
                
                // Show enhanced success feedback
                showToast('Entry saved successfully! ✍️', 'success');
                triggerHapticFeedback('success');
                
                // Add floating animation to save button
                if (saveBtn) {
                    saveBtn.classList.add('float-up');
                    setTimeout(() => {
                        saveBtn.classList.remove('float-up');
                    }, 600);
                }
                
                // Refresh entries list
                loadEntries();
            }
        }
        
        function loadEntries() {
            const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
            if (entriesList) {
                entriesList.innerHTML = entries.map(entry => `
                    <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200/50">
                        <div class="text-sm text-gray-600 mb-2">${entry.date}</div>
                        <div class="text-gray-800 leading-relaxed">${entry.text}</div>
                    </div>
                `).join('');
            }
        }
        
        // Event listeners
        if (saveBtn) {
            saveBtn.addEventListener('click', saveEntry);
        }
        
        // Auto-save draft
        if (entryText) {
            entryText.addEventListener('input', () => {
                localStorage.setItem('journal-draft', entryText.value);
                if (entryText.value.trim() && saveBtn) {
                    saveBtn.classList.remove('hidden');
                } else if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
            });
        }
        
        // Load draft on page load
        if (entryText) {
            const draft = localStorage.getItem('journal-draft');
            if (draft) {
                entryText.value = draft;
                if (draft.trim() && saveBtn) {
                    saveBtn.classList.remove('hidden');
                }
            }
        }
        
        // Load existing entries
        loadEntries();
    }

    // Workout logic

    // Global workout functions
    window.startWorkout = function() {
        if (!workoutIsRunning && workoutExerciseSelect && workoutExerciseSelect.value) {
            const exercise = exercises.find(e => e.id === workoutExerciseSelect.value);
            if (exercise) {
                workoutIsRunning = true;
                workoutIsPaused = false;
                workoutTimeRemaining = exercise.duration;
                workoutTotalTime = exercise.duration;
                
                if (workoutStartBtn) workoutStartBtn.classList.add('hidden');
                if (workoutPauseBtn) workoutPauseBtn.classList.remove('hidden');
                
                workoutInterval = setInterval(() => {
                    if (workoutTimeRemaining > 0) {
                        workoutTimeRemaining--;
                        updateWorkoutDisplay();
                    } else {
                        clearInterval(workoutInterval);
                        workoutIsRunning = false;
                        if (workoutStatus) workoutStatus.textContent = 'Exercise complete! 🎉';
                        if (workoutStartBtn) workoutStartBtn.classList.remove('hidden');
                        if (workoutPauseBtn) workoutPauseBtn.classList.add('hidden');
                    }
                }, 1000);
            }
        }
    };

    window.pauseWorkout = function() {
        if (workoutIsRunning) {
            workoutIsRunning = false;
            workoutIsPaused = true;
            clearInterval(workoutInterval);
            if (workoutStartBtn) workoutStartBtn.classList.remove('hidden');
            if (workoutPauseBtn) workoutPauseBtn.classList.add('hidden');
        }
    };

    window.resetWorkout = function() {
        clearInterval(workoutInterval);
        workoutIsRunning = false;
        workoutIsPaused = false;
        if (workoutExerciseSelect && workoutExerciseSelect.value) {
            const exercise = exercises.find(e => e.id === workoutExerciseSelect.value);
            if (exercise) {
                workoutTimeRemaining = exercise.duration;
                workoutTotalTime = exercise.duration;
            }
        }
        updateWorkoutDisplay();
        if (workoutStartBtn) workoutStartBtn.classList.remove('hidden');
        if (workoutPauseBtn) workoutPauseBtn.classList.add('hidden');
    };

    window.updateWorkoutDisplay = function() {
        if (workoutDisplay) {
            const minutes = Math.floor(workoutTimeRemaining / 60);
            const seconds = workoutTimeRemaining % 60;
            const displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            workoutDisplay.textContent = displayText;
        }
        if (workoutStatus) {
            if (workoutIsRunning) {
                workoutStatus.textContent = 'Exercising...';
            } else if (workoutIsPaused) {
                workoutStatus.textContent = 'Paused';
            } else {
                workoutStatus.textContent = 'Ready to begin';
            }
        }
    };

    
    // Timer variables - made global so they can be accessed by timer functions
    window.timerInterval = null;
    window.timeRemaining = 600; // 10 minutes default
    window.totalTime = 600;
    window.isRunning = false;
    window.isPaused = false;
    window.display = null;
    window.status = null;
    window.progressRing = null;
    window.startBtn = null;
    window.pauseBtn = null;
    window.resetBtn = null;
    window.durationSelect = null;
    window.soundToggle = null;

    // Timer functions - defined globally so they can be accessed by event listeners
    function updateDisplay() {
        console.log('=== UPDATE DISPLAY CALLED ===');
        console.log('timeRemaining:', timeRemaining);
        console.log('display element:', display);
        console.log('display element found:', !!display);
        
        if (display) {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            const displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            console.log('Setting display to:', displayText);
            console.log('Display element before update:', display.textContent);
            display.textContent = displayText;
            console.log('Display element after update:', display.textContent);
        } else {
            console.error('Display element not found!');
            console.log('Trying to find display element again...');
            const displayElement = document.getElementById('timer-display');
            console.log('Found display element:', displayElement);
            if (displayElement) {
                display = displayElement;
                console.log('Set display element to:', display);
                // Try updating again
                const minutes = Math.floor(timeRemaining / 60);
                const seconds = timeRemaining % 60;
                const displayText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                display.textContent = displayText;
                console.log('Updated display after finding element:', display.textContent);
            }
        }
        
        // Update progress ring
        if (progressRing) {
            const circumference = 2 * Math.PI * 45; // radius = 45
            const progress = (totalTime - timeRemaining) / totalTime;
            const offset = circumference - (progress * circumference);
            progressRing.style.strokeDashoffset = offset;
        }
        
        // Update status
        if (status) {
            if (isRunning) {
                status.textContent = 'Meditating...';
            } else if (isPaused) {
                status.textContent = 'Paused';
            } else {
                status.textContent = 'Ready to begin';
            }
        }
    }

    function startTimer() {
        // Start timer called
        console.log('Current state:', { isRunning, isPaused, timeRemaining, totalTime });
        if (!isRunning) {
            console.log('Starting timer...');
            isRunning = true;
            isPaused = false;
            
            // Haptic feedback for mobile
            triggerHapticFeedback('light');
            
            // Add pulsing effect to timer container
            const timerContainer = document.querySelector('.relative.w-48, .relative.w-56, .relative.w-64, .relative.w-72, .relative.w-80');
            if (timerContainer) {
                timerContainer.classList.add('timer-running');
                // Add start signal animation
                timerContainer.classList.add('timer-start-signal');
                // Remove animation class after animation completes
                setTimeout(() => {
                    timerContainer.classList.remove('timer-start-signal');
                }, 1500);
            }
            
            if (startBtn) startBtn.classList.add('hidden');
            if (pauseBtn) pauseBtn.classList.remove('hidden');
                
            console.log('Setting up setInterval...');
            timerInterval = setInterval(() => {
                console.log('=== SETINTERVAL TICK ===');
                console.log('timeRemaining before decrement:', timeRemaining);
                console.log('isRunning:', isRunning);
                console.log('timerInterval:', timerInterval);
                if (timeRemaining > 0) {
                    timeRemaining--;
                    console.log('timeRemaining after decrement:', timeRemaining);
                    console.log('About to call updateDisplay...');
                    updateDisplay();
                    console.log('updateDisplay called');
                    
                    // Play bell at specific intervals
                    if (timeRemaining === 0) {
                        // Final bell - play sound if enabled
                        if (soundToggle && soundToggle.checked) {
                            console.log('Playing final bell');
                        }
                    } else if (timeRemaining === 60 && totalTime > 120) {
                        // 1 minute warning
                        if (soundToggle && soundToggle.checked) {
                            console.log('Playing 1 minute warning');
                        }
                    } else if (timeRemaining === 300 && totalTime > 600) {
                        // 5 minute warning
                        if (soundToggle && soundToggle.checked) {
                            console.log('Playing 5 minute warning');
                        }
                    }
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    
                    // Remove pulsing effect
                    const timerContainerStop = document.querySelector('.relative.w-56');
                    if (timerContainerStop) {
                        timerContainerStop.classList.remove('timer-running');
                    }
                    
                    // Session complete
                    if (status) status.textContent = 'Session complete! 🎉';
                    
                    // Enhanced completion feedback
                    triggerHapticFeedback('success');
                    showToast('Meditation complete! Well done! 🧘‍♀️', 'success', 4000);
                    
                    // Add completion animation
                    const timerContainerComplete = document.querySelector('.relative.w-48, .relative.w-56, .relative.w-64, .relative.w-72, .relative.w-80');
                    if (timerContainerComplete) {
                        timerContainerComplete.classList.add('gentle-glow');
                        setTimeout(() => {
                            timerContainerComplete.classList.remove('gentle-glow');
                        }, 3000);
                    }
                    
                    // Show completion message with mobile-friendly approach
                    setTimeout(() => {
                        if (isMobile) {
                            // Use a more mobile-friendly notification
                            const notification = document.createElement('div');
                            notification.className = 'fixed top-4 left-4 right-4 bg-forest-green text-white p-4 rounded-lg shadow-lg z-50 text-center';
                            notification.innerHTML = '🧘‍♀️ Meditation Complete!<br><small>Take a moment to notice how you feel.</small>';
                            document.body.appendChild(notification);
                            
                            setTimeout(() => {
                                notification.remove();
                            }, 4000);
                        }
                    }, 500);
                    
                    if (startBtn) {
                        startBtn.classList.remove('hidden');
                        startBtn.innerHTML = '<div class="flex items-center justify-center space-x-2"><span class="text-xl">▶️</span><span>Start Meditation</span></div>';
                    }
                    if (pauseBtn) pauseBtn.classList.add('hidden');
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            isPaused = true;
            
            // Haptic feedback for mobile
            triggerHapticFeedback('medium');
            
            // Remove pulsing effect
            const timerContainerReset = document.querySelector('.relative.w-48, .relative.w-56, .relative.w-64, .relative.w-72, .relative.w-80');
            if (timerContainerReset) {
                timerContainerReset.classList.remove('timer-running');
            }
            
            if (startBtn) {
                startBtn.classList.remove('hidden');
                startBtn.innerHTML = '<div class="flex items-center justify-center space-x-2"><span class="text-xl">▶️</span><span>Resume</span></div>';
            }
            if (pauseBtn) pauseBtn.classList.add('hidden');
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        isPaused = false;
        
        // Haptic feedback for mobile
        triggerHapticFeedback('light');
        
        // Remove pulsing effect
        const timerContainerStop = document.querySelector('.relative.w-48, .relative.w-56, .relative.w-64, .relative.w-72, .relative.w-80');
        if (timerContainerStop) {
            timerContainerStop.classList.remove('timer-running');
        }
        
        // Reset to selected duration
        if (durationSelect) {
            timeRemaining = parseInt(durationSelect.value);
            totalTime = timeRemaining;
        } else {
            timeRemaining = 600;
            totalTime = 600;
        }
        
        updateDisplay();
        
        if (startBtn) {
            startBtn.classList.remove('hidden');
            startBtn.innerHTML = '<div class="flex items-center justify-center space-x-2"><span class="text-xl">▶️</span><span>Start Meditation</span></div>';
        }
        if (pauseBtn) pauseBtn.classList.add('hidden');
    }

    function attachTimerEventListeners(startBtnParam, pauseBtnParam, resetBtnParam, displayParam, statusParam, durationSelectParam, soundToggleParam, progressRingParam) {
        // Set global variables
        startBtn = startBtnParam;
        pauseBtn = pauseBtnParam;
        resetBtn = resetBtnParam;
        display = displayParam;
        status = statusParam;
        durationSelect = durationSelectParam;
        soundToggle = soundToggleParam;
        progressRing = progressRingParam;
        
        // Event listeners
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                startTimer();
            });
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                pauseTimer();
            });
        }
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                resetTimer();
            });
        }
        
        // Duration change
        if (durationSelect) {
            durationSelect.addEventListener('change', () => {
                if (!isRunning) {
                    timeRemaining = parseInt(durationSelect.value);
                    totalTime = timeRemaining;
                    updateDisplay();
                }
            });
        }
        
        // Initialize display
        console.log('=== INITIALIZING DISPLAY ===');
        console.log('timeRemaining:', timeRemaining);
        console.log('display element:', display);
        updateDisplay();
    }

    // Journal logic
    function attachJournalLogic() {
        // Attaching journal logic
        
        const saveBtn = document.getElementById('journal-save-btn');
        const entryText = document.getElementById('journal-entry');
        const entriesList = document.getElementById('journal-entries');
        
        function saveEntry() {
            if (entryText && entryText.value.trim()) {
                const entry = {
                    text: entryText.value.trim(),
                    date: new Date().toLocaleString()
                };
                
                let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
                entries.unshift(entry);
                localStorage.setItem('journalEntries', JSON.stringify(entries));
                
                // Clear textarea and draft
                entryText.value = '';
                localStorage.removeItem('journal-draft');
                
                // Hide save button
                if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
                
                // Show enhanced success feedback
                showToast('Entry saved successfully! ✍️', 'success');
                triggerHapticFeedback('success');
                
                // Add floating animation to save button
                if (saveBtn) {
                    saveBtn.classList.add('float-up');
                    setTimeout(() => {
                        saveBtn.classList.remove('float-up');
                    }, 600);
                }
                
                // Refresh entries list
                loadEntries();
            }
        }
        
        function loadEntries() {
            const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
            if (entriesList) {
                entriesList.innerHTML = entries.map(entry => `
                    <div class="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-gray-200/50">
                        <div class="text-sm text-gray-600 mb-2">${entry.date}</div>
                        <div class="text-gray-800 leading-relaxed">${entry.text}</div>
                    </div>
                `).join('');
            }
        }
        
        // Event listeners
        if (saveBtn) {
            saveBtn.addEventListener('click', saveEntry);
        }
        
        // Auto-save draft
        if (entryText) {
            entryText.addEventListener('input', () => {
                localStorage.setItem('journal-draft', entryText.value);
                if (entryText.value.trim() && saveBtn) {
                    saveBtn.classList.remove('hidden');
                } else if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
            });
        }
        
        // Load draft on page load
        if (entryText) {
            const draft = localStorage.getItem('journal-draft');
            if (draft) {
                entryText.value = draft;
                if (draft.trim() && saveBtn) {
                    saveBtn.classList.remove('hidden');
                }
            }
        }
        
        // Load existing entries
        loadEntries();
    }

    // Workout logic
    function attachWorkoutLogic() {
        console.log('Attaching workout logic...');
        console.log('Workout page - adding mobile-friendly sound functionality and timer');
        
        // Workout timer variables
        let workoutTimer = null;
        let currentTime = 30; // 30 seconds per exercise
        let isWorkoutRunning = false;
        let isWorkoutPaused = false;
        let currentExercise = 1;
        const totalExercises = 12;
        
        // Exercise data
        const exercises = [
            { name: "Jumping Jacks", emoji: "🤸", description: "Start with feet together, jump up spreading legs and raising arms overhead, then return to start position." },
            { name: "Wall Sit", emoji: "🪑", description: "Slide down the wall until your thighs are parallel to the floor, hold this position." },
            { name: "Push-ups", emoji: "💪", description: "Start in plank position, lower your body until chest nearly touches floor, then push back up." },
            { name: "Abdominal Crunches", emoji: "🏋️", description: "Lie on back, lift shoulders off ground by contracting abdominal muscles." },
            { name: "Step-ups", emoji: "🪜", description: "Step up onto a chair or step, alternating legs with each step." },
            { name: "Squats", emoji: "🦵", description: "Stand with feet shoulder-width apart, lower body as if sitting back into a chair." },
            { name: "Tricep Dips", emoji: "💺", description: "Sit on edge of chair, place hands beside hips, slide forward and lower body using arms." },
            { name: "Plank", emoji: "📏", description: "Hold a push-up position with body straight from head to heels." },
            { name: "High Knees", emoji: "🏃", description: "Run in place, bringing knees up toward chest as high as possible." },
            { name: "Lunges", emoji: "🚶", description: "Step forward with one leg, lowering hips until both knees are bent at 90 degrees." },
            { name: "Push-up & Rotation", emoji: "🔄", description: "Do a push-up, then rotate to one side lifting arm up, alternating sides." },
            { name: "Side Plank", emoji: "📐", description: "Lie on side, prop up on forearm, lift hips to form straight line from head to feet." }
        ];
        
        // DOM elements
        const startBtn = document.getElementById('workout-start-btn');
        const pauseBtn = document.getElementById('workout-pause-btn');
        const resetBtn = document.getElementById('workout-reset-btn');
        const timerDisplay = document.getElementById('workout-timer-display');
        const timerLabel = document.getElementById('workout-timer-label');
        const progressText = document.getElementById('workout-progress-text');
        const progressBar = document.getElementById('workout-progress-bar');
        const exerciseName = document.getElementById('current-exercise-name');
        const exerciseDescription = document.getElementById('current-exercise-description');
        const exerciseEmoji = document.getElementById('exercise-emoji');
        const exerciseInstructions = document.getElementById('exercise-instructions');
        
        // Mobile-friendly audio setup
        let audioContext;
        let isAudioInitialized = false;
        
        // Workout timer functions
        function updateTimerDisplay() {
            if (timerDisplay) {
                timerDisplay.textContent = currentTime;
            }
            if (timerLabel) {
                timerLabel.textContent = currentTime === 1 ? 'second remaining' : 'seconds remaining';
            }
        }
        
        function updateExerciseDisplay() {
            const exercise = exercises[currentExercise - 1];
            if (exercise) {
                if (exerciseName) exerciseName.textContent = exercise.name;
                if (exerciseDescription) exerciseDescription.textContent = `Exercise ${currentExercise} of ${totalExercises}`;
                if (exerciseEmoji) exerciseEmoji.textContent = exercise.emoji;
                if (exerciseInstructions) exerciseInstructions.textContent = exercise.description;
            }
        }
        
        function updateProgress() {
            if (progressText) {
                progressText.textContent = `Exercise ${currentExercise} of ${totalExercises}`;
            }
            if (progressBar) {
                const progress = ((currentExercise - 1) / totalExercises) * 100;
                progressBar.style.width = `${progress}%`;
            }
        }

        function startWorkout() {
            console.log('Start workout function called!');
            if (!isWorkoutRunning) {
                isWorkoutRunning = true;
                isWorkoutPaused = false;
                currentTime = 30;
                currentExercise = 1;
                
                if (startBtn) startBtn.classList.add('hidden');
                if (pauseBtn) pauseBtn.classList.remove('hidden');
                
                updateTimerDisplay();
                updateProgress();
                
                workoutTimer = setInterval(() => {
                    currentTime--;
                    updateTimerDisplay();
                    
                    if (currentTime <= 0) {
                        // Exercise complete
                        playBell(); // Play sound
                        currentExercise++;
                        
                        if (currentExercise > totalExercises) {
                            // Workout complete
                            clearInterval(workoutTimer);
                            isWorkoutRunning = false;
                            
                            if (timerDisplay) timerDisplay.textContent = 'Complete!';
                            if (timerLabel) timerLabel.textContent = 'Workout finished';
                            
                            if (startBtn) {
                                startBtn.classList.remove('hidden');
                                startBtn.textContent = 'Start Again';
                            }
                            if (pauseBtn) pauseBtn.classList.add('hidden');
                            
                            // Remove pulsing effect
                            const timerContainerMobile = document.querySelector('.relative.w-56');
                            if (timerContainerMobile) {
                                timerContainerMobile.classList.remove('timer-running');
                            }
                            
                            // Session complete
                            if (status) status.textContent = 'Session complete! 🎉';
                            
                            // Show start button again
                            if (startBtn) {
                                startBtn.classList.remove('hidden');
                                startBtn.innerHTML = '<div class="flex items-center justify-center space-x-2"><span class="text-xl">▶️</span><span>Start Meditation</span></div>';
                            }
                            if (pauseBtn) pauseBtn.classList.add('hidden');
                            
                            // Removed alert for production - using notification instead
                        } else {
                            // Next exercise
                            currentTime = 30;
                            updateProgress();
                            updateTimerDisplay();
                        }
                    }
                }, 1000);
            }
        }
    }

    // Interview logic
    function attachInterviewLogic() {
        console.log('Attaching interview logic...');
        console.log('Interview page - adding dynamic functionality with video recording');
        
        // Interview questions by category
        const interviewQuestions = {
            general: [
                "Tell me about yourself",
                "What are your greatest strengths?",
                "What are your greatest weaknesses?",
                "Why do you want this job?",
                "Why should we hire you?",
                "Where do you see yourself in 5 years?",
                "What motivates you?",
                "How do you handle stress?",
                "Describe a challenging situation you've faced",
                "What are your career goals?"
            ],
            behavioral: [
                "Tell me about a time you failed and how you handled it",
                "Describe a situation where you had to work with a difficult person",
                "Give me an example of when you went above and beyond",
                "Tell me about a time you had to make a difficult decision",
                "Describe a situation where you had to learn something new quickly",
                "Tell me about a time you had to work under pressure",
                "Give me an example of when you had to persuade someone",
                "Tell me about a time you had to work in a team",
                "Describe a situation where you had to solve a problem",
                "Tell me about a time you had to adapt to change"
            ],
            technical: [
                "What technical skills do you have?",
                "How do you stay up-to-date with technology?",
                "Describe a technical project you worked on",
                "What programming languages do you know?",
                "How do you approach debugging?",
                "What tools do you use for development?",
                "How do you ensure code quality?",
                "Describe your experience with databases",
                "What's your experience with version control?",
                "How do you handle technical challenges?"
            ]
        };
        
        // Current question and category
        let currentQuestion = '';
        let currentCategory = 'general';
        let questionIndex = 0;
        
        // DOM elements
        const questionDisplay = document.getElementById('current-question');
        const categorySelect = document.getElementById('question-category');
        const nextBtn = document.getElementById('next-question-btn');
        const recordBtn = document.getElementById('record-btn');
        const stopBtn = document.getElementById('stop-btn');
        const playBtn = document.getElementById('play-btn');
        const videoElement = document.getElementById('video-preview');
        const audioElement = document.getElementById('audio-preview');
        
        // Media recording
        let mediaRecorder = null;
        let recordedChunks = [];
        let isRecording = false;
        
        // Functions
        function getRandomQuestion(category) {
            const questions = interviewQuestions[category] || interviewQuestions.general;
            const randomIndex = Math.floor(Math.random() * questions.length);
            return questions[randomIndex];
        }
        
        function displayQuestion(question) {
            if (questionDisplay) {
                questionDisplay.textContent = question;
            }
        }
        
        function nextQuestion() {
            currentCategory = categorySelect ? categorySelect.value : 'general';
            currentQuestion = getRandomQuestion(currentCategory);
            displayQuestion(currentQuestion);
        }
        
        function startRecording() {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                }).then(stream => {
                    if (videoElement) {
                        videoElement.srcObject = stream;
                    }
                    
                    mediaRecorder = new MediaRecorder(stream);
                    recordedChunks = [];
                    
                    mediaRecorder.ondataavailable = event => {
                        if (event.data.size > 0) {
                            recordedChunks.push(event.data);
                        }
                    };
                    
                    mediaRecorder.onstop = () => {
                        const blob = new Blob(recordedChunks, { type: 'video/webm' });
                        const url = URL.createObjectURL(blob);
                        
                        if (videoElement) {
                            videoElement.src = url;
                            videoElement.controls = true;
                        }
                        
                        // Stop all tracks
                        stream.getTracks().forEach(track => track.stop());
                    };
                    
                    mediaRecorder.start();
                    isRecording = true;
                    
                    if (recordBtn) recordBtn.classList.add('hidden');
                    if (stopBtn) stopBtn.classList.remove('hidden');
                }).catch(error => {
                    console.error('Error accessing media devices:', error);
                    alert('Error accessing camera/microphone. Please check permissions.');
                });
            } else {
                alert('Media recording not supported in this browser.');
            }
        }
        
        function stopRecording() {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                isRecording = false;
                
                if (recordBtn) recordBtn.classList.remove('hidden');
                if (stopBtn) stopBtn.classList.add('hidden');
            }
        }
        
        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', nextQuestion);
        }
        
        if (recordBtn) {
            recordBtn.addEventListener('click', startRecording);
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', stopRecording);
        }
        
        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                nextQuestion();
            });
        }
        
        // Initialize
        nextQuestion();
    }
    function attachJournalLogic() {
        // Attaching journal logic
        
        const saveBtn = document.getElementById('journal-save-btn');
        const entryText = document.getElementById('journal-entry');
        const entriesList = document.getElementById('journal-entries');
        
        // Prevent zoom on double tap for mobile
        if (isTouchDevice) {
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
        
        function initAudio() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        }
        
        function playBell() {
            if (!soundToggle || !soundToggle.checked) return;
            
            initAudio();
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            
            // Create a simple bell sound using Web Audio API
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    }

    // Journal logic
    function attachJournalLogic() {
        // Attaching journal logic
        
        const saveBtn = document.getElementById('journal-save-btn');
        const entryText = document.getElementById('journal-entry');
        const entriesList = document.getElementById('journal-entries');
        
        function saveEntry() {
            if (entryText && entryText.value.trim()) {
                const entry = {
                    text: entryText.value.trim(),
                    date: new Date().toLocaleString()
                };
                
                let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
                entries.unshift(entry);
                localStorage.setItem('journalEntries', JSON.stringify(entries));
                
                // Clear textarea and draft
                entryText.value = '';
                localStorage.removeItem('journal-draft');
                
                // Hide save button
                if (saveBtn) {
                    saveBtn.classList.add('hidden');
                }
                
                displayEntries();
                
                // Show success feedback
                if (saveBtn) {
                    const originalText = saveBtn.innerHTML;
                    saveBtn.innerHTML = '<span class="flex items-center space-x-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Saved!</span></span>';
                    saveBtn.classList.add('bg-green-600');
                    setTimeout(() => {
                        saveBtn.innerHTML = originalText;
                        saveBtn.classList.remove('bg-green-600');
                    }, 2000);
                }
            }
        }
        
        function displayEntries() {
            if (entriesList) {
                const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
                entriesList.innerHTML = entries.map((entry, index) => `
                    <div class="journal-entry-item">
                        <div class="journal-entry-date">${entry.date}</div>
                        <div class="journal-entry-text">${entry.text}</div>
                        <div class="mt-3 flex justify-end">
                            <button onclick="deleteEntry(${index})" class="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors">Delete</button>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        function deleteEntry(index) {
            let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
            entries.splice(index, 1);
            localStorage.setItem('journalEntries', JSON.stringify(entries));
            displayEntries();
        }
        
        // Quick preset button functionality
        quickPresetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const duration = parseInt(btn.dataset.duration);
                if (durationSelect) {
                    durationSelect.value = duration;
                }
                // Trigger change event
                if (durationSelect) {
                    durationSelect.dispatchEvent(new Event('change'));
                }
            });
        });
        
        // Enhanced textarea behavior
        if (entryText) {
            // Auto-save functionality
            let saveTimeout;
            entryText.addEventListener('input', () => {
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    // Auto-save to localStorage
                    localStorage.setItem('journal-draft', entryText.value);
                }, 1000);
            });
            
            // Load draft on page load
            const draft = localStorage.getItem('journal-draft');
            if (draft) {
                entryText.value = draft;
            }
            
            // Show save button when there's content
            entryText.addEventListener('input', () => {
                if (saveBtn) {
                    if (entryText.value.trim()) {
                        saveBtn.classList.remove('hidden');
                    } else {
                        saveBtn.classList.add('hidden');
                    }
                }
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', saveEntry);
        }
        
        // Make deleteEntry globally accessible
        window.deleteEntry = deleteEntry;
        
        displayEntries();
    }

    // Workout logic
    function attachWorkoutLogic() {
        console.log('Attaching workout logic...');
        console.log('Workout page - adding mobile-friendly sound functionality and timer');
            
            // Workout timer variables
            let workoutTimer = null;
            let currentTime = 30; // 30 seconds per exercise
            let isWorkoutRunning = false;
            let isWorkoutPaused = false;
            let currentExercise = 1;
            const totalExercises = 12;
            
            // Exercise data
            const exercises = [
                { name: "Jumping Jacks", emoji: "🤸", description: "Start with feet together, jump up spreading legs and raising arms overhead, then return to start position." },
                { name: "Wall Sit", emoji: "🪑", description: "Slide down the wall until your thighs are parallel to the floor, hold this position." },
                { name: "Push-ups", emoji: "💪", description: "Start in plank position, lower your body until chest nearly touches floor, then push back up." },
                { name: "Abdominal Crunches", emoji: "🏋️", description: "Lie on back, lift shoulders off ground by contracting abdominal muscles." },
                { name: "Step-ups", emoji: "🪜", description: "Step up onto a chair or step, alternating legs with each step." },
                { name: "Squats", emoji: "🦵", description: "Stand with feet shoulder-width apart, lower body as if sitting back into a chair." },
                { name: "Tricep Dips", emoji: "💺", description: "Sit on edge of chair, place hands beside hips, slide forward and lower body using arms." },
                { name: "Plank", emoji: "📏", description: "Hold a push-up position with body straight from head to heels." },
                { name: "High Knees", emoji: "🏃", description: "Run in place, bringing knees up toward chest as high as possible." },
                { name: "Lunges", emoji: "🚶", description: "Step forward with one leg, lowering hips until both knees are bent at 90 degrees." },
                { name: "Push-up & Rotation", emoji: "🔄", description: "Do a push-up, then rotate to one side lifting arm up, alternating sides." },
                { name: "Side Plank", emoji: "📐", description: "Lie on side, prop up on forearm, lift hips to form straight line from head to feet." }
            ];
            
            // DOM elements
            const startBtn = document.getElementById('workout-start-btn');
            const pauseBtn = document.getElementById('workout-pause-btn');
            const resetBtn = document.getElementById('workout-reset-btn');
            const timerDisplay = document.getElementById('workout-timer-display');
            const timerLabel = document.getElementById('workout-timer-label');
            const progressText = document.getElementById('workout-progress-text');
            const progressBar = document.getElementById('workout-progress-bar');
            const exerciseName = document.getElementById('current-exercise-name');
            const exerciseDescription = document.getElementById('current-exercise-description');
            const exerciseEmoji = document.getElementById('exercise-emoji');
            const exerciseInstructions = document.getElementById('exercise-instructions');
            
            // Mobile-friendly audio setup
            let audioContext;
            let isAudioInitialized = false;
            
            // Workout timer functions
            function updateTimerDisplay() {
                if (timerDisplay) {
                    timerDisplay.textContent = currentTime;
                }
                if (timerLabel) {
                    timerLabel.textContent = currentTime === 1 ? 'second remaining' : 'seconds remaining';
                }
            }
            
            function updateExerciseDisplay() {
                const exercise = exercises[currentExercise - 1];
                if (exercise) {
                    if (exerciseName) exerciseName.textContent = exercise.name;
                    if (exerciseDescription) exerciseDescription.textContent = `Exercise ${currentExercise} of ${totalExercises}`;
                    if (exerciseEmoji) exerciseEmoji.textContent = exercise.emoji;
                    if (exerciseInstructions) exerciseInstructions.textContent = exercise.description;
                }
            }
            
            function updateProgress() {
                if (progressText) {
                    progressText.textContent = `Exercise ${currentExercise} of ${totalExercises}`;
                }
                if (progressBar) {
                    const progress = ((currentExercise - 1) / totalExercises) * 100;
                    progressBar.style.width = `${progress}%`;
                }
            }

            
            function pauseWorkout() {
                if (isWorkoutRunning) {
                    clearInterval(workoutTimer);
                    isWorkoutRunning = false;
                    isWorkoutPaused = true;
                    
                    if (startBtn) {
                        startBtn.classList.remove('hidden');
                startBtn.textContent = 'Resume';
                    }
                    if (pauseBtn) pauseBtn.classList.add('hidden');
                }
            }
            
            function resetWorkout() {
                clearInterval(workoutTimer);
                isWorkoutRunning = false;
                isWorkoutPaused = false;
                currentTime = 30;
                currentExercise = 1;
                
                if (startBtn) {
                startBtn.classList.remove('hidden');
                    startBtn.textContent = 'Start Workout';
                }
                if (pauseBtn) pauseBtn.classList.add('hidden');
                
                updateTimerDisplay();
                updateProgress();
            }
            
            // Event listeners
            if (startBtn) {
                console.log('Adding start button event listener');
                startBtn.addEventListener('click', startWorkout);
            } else {
                console.error('Start button not found!');
            }
            if (pauseBtn) {
                console.log('Adding pause button event listener');
                pauseBtn.addEventListener('click', pauseWorkout);
            } else {
                console.error('Pause button not found!');
            }
            if (resetBtn) {
                console.log('Adding reset button event listener');
                resetBtn.addEventListener('click', resetWorkout);
            } else {
                console.error('Reset button not found!');
            }
            
            // Initialize display
            updateTimerDisplay();
            updateProgress();
        
        function initAudio() {
            if (!audioContext) {
                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    isAudioInitialized = true;
                    console.log('🔊 Audio context initialized');
                } catch (error) {
                    console.log('Audio not supported:', error);
                    return false;
                }
            }
            return true;
        }
        
        function playBell() {
            try {
                // Initialize audio if not done yet
                if (!initAudio()) {
                    console.log('Audio not available');
                    return;
                }
                
                // Resume audio context if suspended (mobile requirement)
                if (audioContext.state === 'suspended') {
                    audioContext.resume().then(() => {
                        console.log('🔊 Audio context resumed');
                        playBellSound();
                    });
                } else {
                    playBellSound();
                }
                
            } catch (error) {
                console.log('Sound error:', error);
            }
        }
        
        function playBellSound() {
            try {
                // Create mobile-optimized bell sound
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // Mobile-friendly frequencies (lower, less harsh)
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
                
                // Mobile-optimized volume (louder, clearer)
                gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
                
                // Longer duration for mobile clarity
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.8);
                
                console.log('🔔 Mobile bell sound played!');
            } catch (error) {
                console.log('Bell sound error:', error);
            }
        }
        
        // Mobile-friendly test function
        window.testWorkoutSound = function() {
            console.log('Testing mobile sound...');
            playBell();
        };
        
        // Auto-initialize audio on first user interaction
        document.addEventListener('touchstart', function initAudioOnTouch() {
            if (!isAudioInitialized) {
                initAudio();
                document.removeEventListener('touchstart', initAudioOnTouch);
            }
        }, { once: true });
        
        document.addEventListener('click', function initAudioOnClick() {
            if (!isAudioInitialized) {
                initAudio();
                document.removeEventListener('click', initAudioOnClick);
            }
        }, { once: true });
        
        console.log('Mobile-friendly sound functionality added. Touch or click to initialize audio.');
    }

    // Interview logic
        function attachInterviewLogic() {
            console.log('Attaching interview logic...');
        console.log('Interview page - adding dynamic functionality with video recording');
        
        // Interview questions by category
        const interviewQuestions = {
            general: [
                "Tell me about yourself",
                "What are your greatest strengths?",
                "What are your areas for improvement?",
                "Why do you want this job?",
                "Where do you see yourself in 5 years?",
                "Why should we hire you?",
                "What questions do you have for us?",
                "What motivates you?",
                "How do you handle pressure?",
                "What's your ideal work environment?"
            ],
            storytelling: [
                "Tell me about a time you failed and what you learned",
                "Share a story about going above and beyond",
                "Describe a project you're particularly proud of",
                "Tell me about a time you had to persuade someone",
                "Share when you helped a teammate succeed",
                "Describe working with a difficult person",
                "Tell me about a tough decision you had to make",
                "Share a time you learned something quickly",
                "Describe how you adapted to change",
                "Tell me about dealing with conflict"
            ],
            communication: [
                "How do you handle constructive criticism?",
                "Describe your communication style",
                "How do you give difficult feedback?",
                "How do you build rapport with colleagues?",
                "Tell me about a recent presentation",
                "How do you ensure team understanding?",
                "Tell me about explaining complex topics",
                "How do you handle disagreements?",
                "How do you ensure your message is understood?",
                "Describe communicating bad news"
            ],
            creativity: [
                "How do you approach problem-solving?",
                "Tell me about a creative solution you implemented",
                "How do you stay innovative in your work?",
                "Describe thinking outside the box",
                "How do you generate new ideas?",
                "Tell me about a project with creative freedom",
                "How do you balance creativity with practicality?",
                "Describe finding a creative workaround",
                "How do you inspire creativity in others?",
                "Tell me about an ahead-of-its-time idea"
            ]
        };
            
            let currentCategory = 'general';
            let currentQuestionIndex = 0;
        let currentQuestions = interviewQuestions.general;
        let mediaRecorder;
        let recordedChunks = [];
        let stream;
        
        // DOM elements
        const categoryButtons = document.querySelectorAll('#interview-cat-btn');
        const questionElement = document.getElementById('current-question');
        const randomBtn = document.getElementById('random-question-btn');
        const prevBtn = document.getElementById('previous-question-btn');
        const nextBtn = document.getElementById('next-question-btn');
        const startCameraBtn = document.getElementById('start-camera-btn');
        const startRecordingBtn = document.getElementById('start-recording-btn');
        const stopRecordingBtn = document.getElementById('stop-recording-btn');
        const stopCameraBtn = document.getElementById('stop-camera-btn');
        const liveVideo = document.getElementById('live-video');
        const playbackVideo = document.getElementById('playback-video');
        const videoPlaceholder = document.getElementById('video-placeholder');
        const recordingsSection = document.getElementById('recordings-section');
        const recordingsList = document.getElementById('recordings-list');
        
        // Category selection
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                currentCategory = btn.dataset.category;
                currentQuestions = interviewQuestions[currentCategory];
                currentQuestionIndex = 0;
                
                // Update active button
                categoryButtons.forEach(b => b.classList.remove('ring-2', 'ring-white', 'ring-offset-2'));
                btn.classList.add('ring-2', 'ring-white', 'ring-offset-2');
                
                // Show first question
                showQuestion(0);
            });
        });
        
        // Question navigation
        randomBtn.addEventListener('click', () => {
            const randomIndex = Math.floor(Math.random() * currentQuestions.length);
            showQuestion(randomIndex);
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                showQuestion(currentQuestionIndex - 1);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentQuestionIndex < currentQuestions.length - 1) {
                showQuestion(currentQuestionIndex + 1);
            }
        });
        
        function showQuestion(index) {
            currentQuestionIndex = index;
            questionElement.textContent = currentQuestions[index];
            
            // Update navigation buttons
            prevBtn.disabled = index === 0;
            nextBtn.disabled = index === currentQuestions.length - 1;
            
            // Add visual feedback
            questionElement.style.animation = 'none';
            setTimeout(() => {
                questionElement.style.animation = 'fadeIn 0.5s ease-in';
            }, 10);
        }
        
        // Camera functionality
        startCameraBtn.addEventListener('click', async () => {
            try {
                // Enhanced mobile detection
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
                
                // Mobile-optimized video settings for better performance
                const videoConstraints = isMobile ? {
                    width: { ideal: 640, max: 1280 },
                    height: { ideal: 480, max: 720 },
                    facingMode: 'user',
                    frameRate: { ideal: 15, max: 30 },
                    aspectRatio: { ideal: 16/9 }
                } : {
                    width: { ideal: 1280, max: 1920 },
                    height: { ideal: 720, max: 1080 },
                    facingMode: 'user',
                    frameRate: { ideal: 30, max: 60 },
                    aspectRatio: { ideal: 16/9 }
                };
                
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: videoConstraints,
                    audio: { 
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true
                    }
                });
                
                    // Optimize video for mobile performance
                    liveVideo.srcObject = stream;
                    liveVideo.style.display = 'block';
                    liveVideo.muted = true; // Mute to prevent feedback
                    liveVideo.playsInline = true; // Important for iOS
                    liveVideo.setAttribute('playsinline', 'true'); // iOS compatibility
                    liveVideo.setAttribute('webkit-playsinline', 'true'); // Older iOS compatibility
                    
                    // Ensure video is visible and playing
                    liveVideo.play().catch(e => console.log('Video play failed:', e));
                
                videoPlaceholder.style.display = 'none';
                playbackVideo.style.display = 'none';
                
                // Show loading state
                startCameraBtn.innerHTML = '⏳ Starting Camera...';
                startCameraBtn.disabled = true;
                
                // Wait for video to load
                liveVideo.onloadedmetadata = () => {
                    startCameraBtn.style.display = 'none';
                    startRecordingBtn.style.display = 'block';
                    stopCameraBtn.style.display = 'block';
                    console.log('Camera started successfully');
                };
                
                // Fallback timeout
                setTimeout(() => {
                    if (startCameraBtn.disabled) {
                        startCameraBtn.innerHTML = '📹 Start Camera';
                        startCameraBtn.disabled = false;
                        startCameraBtn.style.display = 'block';
                        startRecordingBtn.style.display = 'none';
                        stopCameraBtn.style.display = 'none';
                    }
                }, 5000);
            } catch (error) {
                console.error('Error accessing camera:', error);
                
                // Reset button state
                startCameraBtn.innerHTML = '📹 Start Camera';
                startCameraBtn.disabled = false;
                
                // Better error messages for mobile
                let errorMessage = 'Unable to access camera. ';
                if (error.name === 'NotAllowedError') {
                    errorMessage += 'Please allow camera access in your browser settings and try again.';
                } else if (error.name === 'NotFoundError') {
                    errorMessage += 'No camera found. Please check your device.';
                } else if (error.name === 'NotSupportedError') {
                    errorMessage += 'Camera not supported on this device.';
                    } else {
                    errorMessage += 'Please check permissions and try again.';
                }
                
                // Removed alert for production - using console.error instead
                console.error(errorMessage);
            }
        });
        
        stopCameraBtn.addEventListener('click', () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
            }
            
            liveVideo.style.display = 'none';
            videoPlaceholder.style.display = 'block';
            playbackVideo.style.display = 'none';
            
            startCameraBtn.style.display = 'block';
            startRecordingBtn.style.display = 'none';
            stopRecordingBtn.style.display = 'none';
            stopCameraBtn.style.display = 'none';
            
            console.log('Camera stopped');
        });
        
        // Recording functionality
        startRecordingBtn.addEventListener('click', () => {
            if (!stream) return;
            
                        recordedChunks = [];
            
            // Mobile-optimized recording settings
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            let mimeType = 'video/webm;codecs=vp9,opus';
            
            // Fallback for mobile devices
            if (isMobile) {
                if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
                    mimeType = 'video/webm;codecs=vp8,opus';
                } else if (MediaRecorder.isTypeSupported('video/mp4')) {
                    mimeType = 'video/mp4';
                }
            }
            
            mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                videoBitsPerSecond: isMobile ? 1000000 : 2500000 // Lower bitrate for mobile
            });
            
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                
                // Show playback
                playbackVideo.src = url;
                playbackVideo.style.display = 'block';
                liveVideo.style.display = 'none';
                
                // Add to recordings list
                addRecordingToList(blob, url);
                
                console.log('Recording saved');
            };
            
            mediaRecorder.start();
            startRecordingBtn.style.display = 'none';
            stopRecordingBtn.style.display = 'block';
            
            console.log('Recording started');
        });
        
        stopRecordingBtn.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                stopRecordingBtn.style.display = 'none';
                startRecordingBtn.style.display = 'block';
                
                console.log('Recording stopped');
            }
        });
        
        function addRecordingToList(blob, url) {
            const recordingItem = document.createElement('div');
            recordingItem.className = 'bg-white rounded-lg p-4 shadow-md border border-gray-200';
            
            const timestamp = new Date().toLocaleString();
            const question = currentQuestions[currentQuestionIndex];
            
            recordingItem.innerHTML = `
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-semibold text-charcoal">Practice Recording</h4>
                    <span class="text-xs text-charcoal/60">${timestamp}</span>
                    </div>
                <p class="text-sm text-charcoal/70 mb-3">Question: "${question}"</p>
                <div class="flex gap-2">
                    <button onclick="playRecording('${url}')" class="px-3 py-1 bg-forest-green text-white text-xs rounded hover:bg-forest-green/90">
                        ▶️ Play
                    </button>
                    <a href="${url}" download="interview-practice-${Date.now()}.webm" class="px-3 py-1 bg-charcoal text-white text-xs rounded hover:bg-charcoal/90">
                        💾 Download
                    </a>
                </div>
            `;
            
            recordingsList.appendChild(recordingItem);
            recordingsSection.classList.remove('hidden');
        }
        
        // Global function for playing recordings
        window.playRecording = function(url) {
            playbackVideo.src = url;
            playbackVideo.style.display = 'block';
            liveVideo.style.display = 'none';
            playbackVideo.play();
        };
        
        // Initialize with first question
        showQuestion(0);
        
        console.log('Interview page functionality loaded successfully');
    }

    // Dark mode functionality
    function initDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile');
        const darkModeToggleMobileHeader = document.getElementById('dark-mode-toggle-mobile-header');
        
        function toggleDarkMode() {
            const isDark = !document.documentElement.classList.contains('dark');
            document.documentElement.classList.toggle('dark', isDark);
            localStorage.setItem('darkMode', isDark);
            
            // Update all dark mode icons
            updateDarkModeIcons(isDark);
        }
        
        function updateDarkModeIcons(isDark) {
            // Desktop icons
            const sunIcon = document.getElementById('sun-icon');
            const moonIcon = document.getElementById('moon-icon');
            
            // Mobile header icons
            const sunIconMobile = document.getElementById('sun-icon-mobile');
            const moonIconMobile = document.getElementById('moon-icon-mobile');
            
            if (isDark) {
                // Dark mode active - show moon icons
                if (sunIcon) sunIcon.classList.add('hidden');
                if (moonIcon) moonIcon.classList.remove('hidden');
                if (sunIconMobile) sunIconMobile.classList.add('hidden');
                if (moonIconMobile) moonIconMobile.classList.remove('hidden');
            } else {
                // Light mode active - show sun icons
                if (sunIcon) sunIcon.classList.remove('hidden');
                if (moonIcon) moonIcon.classList.add('hidden');
                if (sunIconMobile) sunIconMobile.classList.remove('hidden');
                if (moonIconMobile) moonIconMobile.classList.add('hidden');
            }
        }
        
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', toggleDarkMode);
        }
        if (darkModeToggleMobile) {
            darkModeToggleMobile.addEventListener('click', toggleDarkMode);
        }
        if (darkModeToggleMobileHeader) {
            darkModeToggleMobileHeader.addEventListener('click', toggleDarkMode);
        }
        
        // Apply saved preference
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            document.documentElement.classList.add('dark');
        }
        
        // Initialize icons based on current state
        updateDarkModeIcons(document.documentElement.classList.contains('dark'));
    }

    // Enhanced Keyboard Shortcuts
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only trigger shortcuts when not typing in input fields
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
                return;
            }
            
            // Alt + M = Meditation Timer
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                navigateToPage('timer');
                showToast('Opened Meditation Timer 🧘‍♀️', 'info', 2000);
            }
            
            // Alt + J = Journal
            if (e.altKey && e.key === 'j') {
                e.preventDefault();
                navigateToPage('journal');
                showToast('Opened Mindful Journal ✍️', 'info', 2000);
            }
            
            // Alt + W = Workout
            if (e.altKey && e.key === 'w') {
                e.preventDefault();
                navigateToPage('workout');
                showToast('Opened 7-Minute Workout 💪', 'info', 2000);
            }
            
            // Alt + I = Interview Practice
            if (e.altKey && e.key === 'i') {
                e.preventDefault();
                navigateToPage('interview');
                showToast('Opened Interview Practice 🎤', 'info', 2000);
            }
            
            // Alt + H = Home
            if (e.altKey && e.key === 'h') {
                e.preventDefault();
                navigateToPage('home');
                showToast('Returned to Home 🏠', 'info', 2000);
            }
            
            // Space bar to start/pause timer (when on timer page)
            if (e.code === 'Space' && currentPage === 'timer') {
                e.preventDefault();
                const startBtn = document.getElementById('timer-start-btn');
                const pauseBtn = document.getElementById('timer-pause-btn');
                
                if (startBtn && !startBtn.classList.contains('hidden')) {
                    startBtn.click();
                    showToast('Timer started! ⏰', 'success', 1500);
                } else if (pauseBtn && !pauseBtn.classList.contains('hidden')) {
                    pauseBtn.click();
                    showToast('Timer paused ⏸️', 'info', 1500);
                }
            }
        });
    }

    // Enhanced Mobile menu functionality
    function initMobileMenu() {
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuClose = document.getElementById('mobile-menu-close');
        const hamburgerIcon = document.getElementById('hamburger-icon');
        const closeIcon = document.getElementById('close-icon');
        const darkModeToggleMobile = document.getElementById('dark-mode-toggle-mobile-header');
        
        // Create backdrop element
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        backdrop.id = 'mobile-menu-backdrop';
        backdrop.style.display = 'none'; // Hide by default
        document.body.appendChild(backdrop);
        
        function openMobileMenu() {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('show');
            backdrop.style.display = 'block';
            backdrop.classList.add('show');
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
        
        function closeMobileMenu() {
            mobileMenu.classList.remove('show');
            mobileMenu.classList.add('hidden');
            backdrop.style.display = 'none';
            backdrop.classList.remove('show');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = ''; // Restore scrolling
        }
        
        if (mobileMenuButton && mobileMenu) {
            // Open menu
            mobileMenuButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (mobileMenu.classList.contains('hidden')) {
                    openMobileMenu();
                } else {
                    closeMobileMenu();
                }
            });
            
            // Close menu button
            if (mobileMenuClose) {
                mobileMenuClose.addEventListener('click', closeMobileMenu);
            }
            
            // Close on backdrop click
            backdrop.addEventListener('click', closeMobileMenu);
            
            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                    closeMobileMenu();
                }
            });
            
            // Close menu when clicking on navigation links
            const mobileNavLinks = mobileMenu.querySelectorAll('.main-nav-link');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(closeMobileMenu, 150); // Small delay for better UX
                });
            });
        }
        
        // Mobile dark mode toggle
        if (darkModeToggleMobile) {
            darkModeToggleMobile.addEventListener('click', () => {
                toggleDarkMode();
            });
        }
    }

    // Note: Glossary page now uses static HTML content
    
    // Note: Learning page now uses static HTML content

    // Search functionality
    function initSearch() {
        const searchInput = document.getElementById('search-input');
        const autocompleteResults = document.getElementById('autocomplete-results');
        
        if (searchInput && autocompleteResults) {
            searchInput.addEventListener('keyup', (e) => {
                const query = searchInput.value.toLowerCase().trim();
                
                if (e.key === 'Enter' && query) {
                    navigateToPage('searchResults', query);
                    autocompleteResults.classList.add('hidden');
                    searchInput.blur();
                    return;
                }

                if (query.length < 2) {
                    autocompleteResults.classList.add('hidden');
                    return;
                }
                
                // Simple search results
                const searchResults = [
                    { title: 'Meditation Timer', page: 'timer' },
                    { title: 'Mindful Journal', page: 'journal' },
                    { title: '7-Minute Workout', page: 'workout' },
                    { title: 'Interview Practice', page: 'interview' },
                    { title: 'Learning Center', page: 'category-meditation' },
                    { title: 'Pāli Glossary', page: 'glossary' },
                    { title: 'About Us', page: 'about' }
                ];
                
                const filteredResults = searchResults.filter(item => 
                    item.title.toLowerCase().includes(query)
                );
                
                if (filteredResults.length > 0) {
                    autocompleteResults.innerHTML = filteredResults.map(item => 
                        `<a href="#" data-page="${item.page}" class="main-nav-link block px-4 py-2 hover:bg-light-green dark:hover:bg-gray-700 text-charcoal dark:text-white">${item.title}</a>`
                    ).join('');
                    autocompleteResults.classList.remove('hidden');
                } else {
                    autocompleteResults.classList.add('hidden');
                }
            });
            
            // Hide search results when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !autocompleteResults.contains(e.target)) {
                    autocompleteResults.classList.add('hidden');
                }
            });
        }
    }

    // Performance optimized initialization
    document.addEventListener('DOMContentLoaded', () => {
        const initStart = performance.now();
        console.log('DOM loaded, initializing...');
        console.log('Throttle function available:', typeof throttle);
        console.log('Main content element:', document.getElementById('main-content'));
        
        mainContent = document.getElementById('main-content');
        
        // Initialize critical functionality first
        // Initialize data persistence
        DataManager.init();
        
        initDarkMode();
        initMobileMenu();
        initKeyboardShortcuts();
        
        // Defer non-critical functionality
        requestAnimationFrame(() => {
            initSearch();
            
            // Throttled global click handler for navigation links
            const throttledNavigation = throttle((e) => {
                console.log('Click detected on:', e.target);
                const link = e.target.closest('.main-nav-link');
                if (link) {
                    console.log('Navigation link clicked:', link.dataset.page);
                    e.preventDefault();
                    const page = link.dataset.page;
                    const id = link.dataset.articleId || link.dataset.pathId;
                    navigateToPage(page, id);
                } else {
                    console.log('No navigation link found');
                }
            }, 100);
            
            document.body.addEventListener('click', throttledNavigation);
            
        // Load home page by default
        navigateToPage('home');
        
        // Handle welcome overlay
        const welcomeOverlay = document.getElementById('welcome-overlay');
        const welcomeTryDemo = document.getElementById('welcome-try-demo');
        const welcomeExplore = document.getElementById('welcome-explore');
        
        if (welcomeOverlay) {
            // Hide overlay after 3 seconds automatically
            setTimeout(() => {
                welcomeOverlay.style.opacity = '0';
                welcomeOverlay.style.transition = 'opacity 0.5s ease-out';
                setTimeout(() => {
                    welcomeOverlay.style.display = 'none';
                }, 500);
            }, 3000);
            
            // Handle button clicks
            if (welcomeTryDemo) {
                welcomeTryDemo.addEventListener('click', () => {
                    welcomeOverlay.style.display = 'none';
                    navigateToPage('timer');
                });
            }
            
            if (welcomeExplore) {
                welcomeExplore.addEventListener('click', () => {
                    welcomeOverlay.style.display = 'none';
                    // Stay on home page to explore
                });
            }
            
            // Allow clicking anywhere on overlay to dismiss
            welcomeOverlay.addEventListener('click', (e) => {
                if (e.target === welcomeOverlay) {
                    welcomeOverlay.style.display = 'none';
                }
            });
        }
        });
        
        // Performance monitoring
        const initEnd = performance.now();
        console.log(`Initialization took ${(initEnd - initStart).toFixed(2)}ms`);
        
        if (typeof performance !== 'undefined') {
            const perfEntries = performance.getEntriesByType('navigation');
            if (perfEntries.length > 0) {
                const navTiming = perfEntries[0];
                console.log('Page load time:', navTiming.loadEventEnd - navTiming.loadEventStart, 'ms');
                console.log('DOM content loaded:', navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart, 'ms');
            }
        }
    });
    
    // Enhanced User Feedback System
    const userFeedback = {
        showNotification: (message, type = 'info', duration = 3000) => {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notification-text');
            
            if (notification && notificationText) {
                notificationText.textContent = message;
                notification.className = `fixed top-6 right-6 z-50 transform transition-all duration-500 ease-out ${
                    type === 'error' ? 'bg-red-500 text-white' : 
                    type === 'success' ? 'bg-green-500 text-white' : 
                    type === 'warning' ? 'bg-yellow-500 text-black' : 
                    'bg-forest-green text-white'
                } rounded-lg px-6 py-3 shadow-lg`;
                
                notification.classList.remove('translate-x-full');
                
                setTimeout(() => {
                    notification.classList.add('translate-x-full');
                }, duration);
            }
        },
        
        showLoading: (message = 'Loading...') => {
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.querySelector('p').textContent = message;
                loadingIndicator.classList.remove('hidden');
            }
        },
        
        hideLoading: () => {
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.classList.add('hidden');
            }
        }
    };

    // Lightweight Analytics and Error Reporting
    const analytics = {
        // Simple analytics without external dependencies
        track: (event, data = {}) => {
            if (typeof performance !== 'undefined') {
                console.log(`Analytics: ${event}`, data);
                // In production, you would send this to your analytics service
                // Example: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ event, data, timestamp: Date.now() }) });
            }
        },
        
        // Enhanced error reporting with user feedback
        reportError: (error, context = {}) => {
            console.error('Error reported:', error, context);
            userFeedback.showNotification('Something went wrong. Please try again.', 'error');
            // In production, you would send this to your error reporting service
            // Example: fetch('/api/errors', { method: 'POST', body: JSON.stringify({ error: error.message, stack: error.stack, context, timestamp: Date.now() }) });
        }
    };
    
    // Global error handler
    window.addEventListener('error', (event) => {
        analytics.reportError(event.error, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
        analytics.reportError(new Error(event.reason), {
            type: 'unhandledrejection'
        });
    });
    
    // Track page performance
    window.addEventListener('load', () => {
        if (typeof performance !== 'undefined') {
            const perfEntries = performance.getEntriesByType('navigation');
            if (perfEntries.length > 0) {
                const navTiming = perfEntries[0];
                analytics.track('page_load', {
                    loadTime: navTiming.loadEventEnd - navTiming.loadEventStart,
                    domContentLoaded: navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart,
                    firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0
                });
            }
        }
        
        // Register Service Worker for PWA functionality
        if ('serviceWorker' in navigator) {
            // Only register service worker if we're on localhost or if the sw.js file exists
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const isGitHubPages = window.location.hostname.includes('github.io');
            
            if (isLocalhost) {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered successfully:', registration);
                        analytics.track('pwa_sw_registered');
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                        // Don't report this as an error for localhost
                    });
            } else if (isGitHubPages) {
                console.log('Service Worker registration skipped for GitHub Pages deployment');
            } else {
                // For other domains, try to register but don't report errors
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered successfully:', registration);
                        analytics.track('pwa_sw_registered');
                    })
                    .catch(error => {
                        console.log('Service Worker not available for this domain:', error.message);
                        // Don't report this as an error
                    });
            }
        }
        
        // PWA Install Prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button or notification
            const installButton = document.createElement('button');
            installButton.textContent = 'Install App';
            installButton.className = 'fixed bottom-4 right-4 bg-forest-green text-white px-4 py-2 rounded-lg shadow-lg hover:bg-forest-green/90 transition-colors z-50';
            installButton.addEventListener('click', () => {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        analytics.track('pwa_installed');
                        userFeedback.showNotification('App installed successfully!', 'success');
                    }
                    deferredPrompt = null;
                    installButton.remove();
                });
            });
            document.body.appendChild(installButton);
        });
        
        // Track PWA install events
        window.addEventListener('appinstalled', () => {
            analytics.track('pwa_installed');
            userFeedback.showNotification('App installed successfully!', 'success');
        });
    });
    
    // Track navigation
    const originalNavigateToPage = navigateToPage;
    navigateToPage = (pageName, id = null) => {
        analytics.track('page_navigation', { page: pageName, id });
        return originalNavigateToPage(pageName, id);
    };
    
    // Enhanced Workout Features
    function setupEnhancedWorkoutFeatures() {
        // Workout state
        let workoutTimer = null;
        let currentTime = 30; // 30 seconds per exercise
        let isWorkoutRunning = false;
        let isWorkoutPaused = false;
        let currentExercise = 0; // Start at 0 for array indexing
        let isDoubleMode = false;
        let workoutStartTime = null;
        let workoutHistory = [];
        
        // Enhanced exercise data with detailed instructions
        const exercises = [
            { 
                name: "Jumping Jacks", 
                emoji: "🤸", 
                description: "Start with feet together, jump up spreading legs and raising arms overhead, then return to start position.",
                instructions: "Keep your core engaged and land softly on the balls of your feet. Maintain a steady rhythm.",
                category: "cardio"
            },
            { 
                name: "Wall Sit", 
                emoji: "🪑", 
                description: "Slide down the wall until your thighs are parallel to the floor, hold this position.",
                instructions: "Keep your back flat against the wall and ensure your knees are directly above your ankles.",
                category: "strength"
            },
            { 
                name: "Push-ups", 
                emoji: "💪", 
                description: "Start in plank position, lower your body until chest nearly touches floor, then push back up.",
                instructions: "Keep your body in a straight line from head to heels. Modify by doing knee push-ups if needed.",
                category: "strength"
            },
            { 
                name: "Abdominal Crunches", 
                emoji: "🏋️", 
                description: "Lie on back, lift shoulders off ground by contracting abdominal muscles.",
                instructions: "Keep your lower back pressed to the floor and lift with your abs, not your neck.",
                category: "core"
            },
            { 
                name: "Step-ups", 
                emoji: "🪜", 
                description: "Step up onto a chair or step, alternating legs with each step.",
                instructions: "Use a sturdy chair or step. Step up with control and step down slowly.",
                category: "cardio"
            },
            { 
                name: "Squats", 
                emoji: "🦵", 
                description: "Stand with feet shoulder-width apart, lower body as if sitting back into a chair.",
                instructions: "Keep your chest up and knees tracking over your toes. Go as low as comfortable.",
                category: "strength"
            },
            { 
                name: "Tricep Dips", 
                emoji: "💺", 
                description: "Sit on edge of chair, place hands beside hips, slide forward and lower body using arms.",
                instructions: "Keep your elbows close to your body and lower until your arms form 90-degree angles.",
                category: "strength"
            },
            { 
                name: "Plank", 
                emoji: "🤸", 
                description: "Hold a push-up position with body straight from head to heels.",
                instructions: "Engage your core and keep your body in a straight line. Breathe normally.",
                category: "core"
            },
            { 
                name: "High Knees", 
                emoji: "🏃", 
                description: "Run in place, bringing knees up towards chest as high as possible.",
                instructions: "Pump your arms and lift your knees as high as comfortable. Land softly.",
                category: "cardio"
            },
            { 
                name: "Lunges", 
                emoji: "🦵", 
                description: "Step forward with one leg, lowering hips until both knees are bent at 90 degrees.",
                instructions: "Keep your front knee over your ankle and your back knee hovering just above the ground.",
                category: "strength"
            },
            { 
                name: "Push-up & Rotation", 
                emoji: "🔄", 
                description: "Do a push-up, then rotate to one side, extending arm up, repeat on other side.",
                instructions: "Complete a full push-up, then rotate your body to one side while extending your arm up.",
                category: "strength"
            },
            { 
                name: "Side Plank", 
                emoji: "🤸", 
                description: "Lie on side, prop up on elbow, lift hips to form straight line from head to feet.",
                instructions: "Keep your body in a straight line and engage your core. Hold steady.",
                category: "core"
            }
        ];
        
        // DOM elements
        const timerDisplay = document.getElementById('workout-timer-display');
        const timerLabel = document.getElementById('workout-timer-label');
        const progressText = document.getElementById('workout-progress-text');
        const progressBar = document.getElementById('workout-progress-bar');
        const startBtn = document.getElementById('workout-start-btn');
        const pauseBtn = document.getElementById('workout-pause-btn');
        const resetBtn = document.getElementById('workout-reset-btn');
        const doubleModeCheckbox = document.getElementById('workout-double-mode');
        const soundSelect = document.getElementById('workout-sound');
        const exerciseName = document.getElementById('current-exercise-name');
        const exerciseDescription = document.getElementById('current-exercise-description');
        const exerciseInstructions = document.getElementById('exercise-instructions');
        const exerciseEmoji = document.getElementById('exercise-emoji');
        
        // Initialize workout
        initializeWorkout();
        
        function initializeWorkout() {
            // Set up event listeners
            if (startBtn) startBtn.addEventListener('click', startWorkout);
            if (pauseBtn) pauseBtn.addEventListener('click', pauseWorkout);
            if (resetBtn) resetBtn.addEventListener('click', resetWorkout);
            if (doubleModeCheckbox) doubleModeCheckbox.addEventListener('change', toggleDoubleMode);
            if (soundSelect) soundSelect.addEventListener('change', toggleSound);
            
            // Load workout history
            loadWorkoutHistory();
            
            // Update display
            updateWorkoutDisplay();
        }
        
        function startWorkout() {
            if (!isWorkoutRunning) {
                isWorkoutRunning = true;
                isWorkoutPaused = false;
                workoutStartTime = new Date();
                
                // Update button states
                if (startBtn) startBtn.classList.add('hidden');
                if (pauseBtn) pauseBtn.classList.remove('hidden');
                
                // Start the workout timer
                startWorkoutTimer();
                
                // Play start sound
                playWorkoutSound('start');
                
                // Show notification
                showNotification('Workout started! Let\'s go! 💪', 'success');
            }
        }
        
        function pauseWorkout() {
            if (isWorkoutRunning && !isWorkoutPaused) {
                isWorkoutPaused = true;
                clearInterval(workoutTimer);
                
                // Update button states
                if (pauseBtn) pauseBtn.innerHTML = '<span class="flex items-center space-x-3"><span class="text-2xl">▶️</span><span>Resume</span></span>';
                
                showNotification('Workout paused', 'info');
            } else if (isWorkoutPaused) {
                isWorkoutPaused = false;
                startWorkoutTimer();
                
                // Update button states
                if (pauseBtn) pauseBtn.innerHTML = '<span class="flex items-center space-x-3"><span class="text-2xl">⏸️</span><span>Pause</span></span>';
                
                showNotification('Workout resumed', 'success');
            }
        }
        
        function resetWorkout() {
            // Stop timer
            if (workoutTimer) {
                clearInterval(workoutTimer);
                workoutTimer = null;
            }
            
            // Reset state
            isWorkoutRunning = false;
            isWorkoutPaused = false;
            currentExercise = 0;
            currentTime = 30;
            
            // Update button states
            if (startBtn) startBtn.classList.remove('hidden');
            if (pauseBtn) pauseBtn.classList.add('hidden');
            
            // Reset display
            updateWorkoutDisplay();
            
            showNotification('Workout reset', 'info');
        }
        
        function startWorkoutTimer() {
            workoutTimer = setInterval(() => {
                if (currentTime > 0) {
                    currentTime--;
                    updateWorkoutDisplay();
                } else {
                    // Exercise completed
                    completeExercise();
                }
            }, 1000);
        }
        
        function completeExercise() {
            // Play completion sound
            playWorkoutSound('complete');
            
            // Move to next exercise
            currentExercise++;
            
            if (currentExercise < exercises.length) {
                // Next exercise
                currentTime = 30;
                updateWorkoutDisplay();
                showNotification(`Great job! Next: ${exercises[currentExercise].name}`, 'success');
            } else {
                // Workout completed
                completeWorkout();
            }
        }
        
        function completeWorkout() {
            // Stop timer
            if (workoutTimer) {
                clearInterval(workoutTimer);
                workoutTimer = null;
            }
            
            // Reset state
            isWorkoutRunning = false;
            isWorkoutPaused = false;
            
            // Calculate workout duration
            const workoutDuration = Math.round((new Date() - workoutStartTime) / 1000);
            
            // Save workout to history
            saveWorkoutToHistory(workoutDuration);
            
            // Update button states
            if (startBtn) startBtn.classList.remove('hidden');
            if (pauseBtn) pauseBtn.classList.add('hidden');
            
            // Show completion message
            showNotification('Workout completed! Great job! 🎉', 'success');
            
            // Reset for next workout
            currentExercise = 0;
            currentTime = 30;
            updateWorkoutDisplay();
        }
        
        function updateWorkoutDisplay() {
            // Update timer
            if (timerDisplay) timerDisplay.textContent = currentTime;
            
            // Update progress
            const totalExercises = exercises.length;
            const progress = ((currentExercise + 1) / totalExercises) * 100;
            
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `Exercise ${currentExercise + 1} of ${totalExercises}`;
            
            // Update current exercise info
            if (currentExercise < exercises.length) {
                const exercise = exercises[currentExercise];
                if (exerciseName) exerciseName.textContent = exercise.name;
                if (exerciseDescription) exerciseDescription.textContent = exercise.description;
                if (exerciseInstructions) exerciseInstructions.textContent = exercise.instructions;
                if (exerciseEmoji) exerciseEmoji.textContent = exercise.emoji;
            } else {
                if (exerciseName) exerciseName.textContent = 'Workout Complete!';
                if (exerciseDescription) exerciseDescription.textContent = 'Congratulations! You\'ve completed the 7-minute workout.';
                if (exerciseInstructions) exerciseInstructions.textContent = 'Take a moment to cool down and hydrate. Great work!';
                if (exerciseEmoji) exerciseEmoji.textContent = '🎉';
            }
        }
        
        function toggleDoubleMode() {
            isDoubleMode = doubleModeCheckbox.checked;
            showNotification(isDoubleMode ? '14-minute mode enabled' : '7-minute mode enabled', 'info');
        }
        
        function toggleSound() {
            const soundEnabled = soundSelect.value === 'on';
            showNotification(soundEnabled ? 'Sound enabled' : 'Sound disabled', 'info');
        }
        
        function playWorkoutSound(type) {
            const soundEnabled = soundSelect ? soundSelect.value === 'on' : true;
            if (!soundEnabled) return;
            
            // Simple sound feedback using Web Audio API
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                let frequency = 440; // A4 note
                if (type === 'start') frequency = 523; // C5
                if (type === 'complete') frequency = 659; // E5
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                // Fallback for browsers that don't support Web Audio API
                console.log('Sound not available');
            }
        }
        
        function saveWorkoutToHistory(duration) {
            const workout = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                duration: duration,
                exercises: exercises.length,
                isDoubleMode: isDoubleMode
            };
            
            workoutHistory.unshift(workout);
            if (workoutHistory.length > 50) { // Keep only last 50 workouts
                workoutHistory = workoutHistory.slice(0, 50);
            }
            
            localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
        }
        
        function loadWorkoutHistory() {
            const saved = localStorage.getItem('workoutHistory');
            if (saved) {
                workoutHistory = JSON.parse(saved);
            }
        }
        
        // Initialize display
        updateWorkoutDisplay();
    }

    // Enhanced Interview Features
    function setupEnhancedInterviewFeatures() {
        // Interview state
        let currentQuestionIndex = 0;
        let currentCategory = 'general';
        let currentDifficulty = 'intermediate';
        let practiceTimer = null;
        let practiceTimeRemaining = 120; // 2 minutes default
        let isPracticeRunning = false;
        let isRecording = false;
        let mediaRecorder = null;
        let recordedChunks = [];
        let stream = null;
        let interviewHistory = [];
        
        // Enhanced interview questions database
        const interviewQuestions = {
            general: [
                {
                    question: "Tell me about yourself",
                    difficulty: "beginner",
                    tips: "Structure your answer: present, past, future. Keep it relevant to the role.",
                    category: "general"
                },
                {
                    question: "What are your greatest strengths?",
                    difficulty: "beginner",
                    tips: "Use specific examples and relate them to the job requirements.",
                    category: "general"
                },
                {
                    question: "What are your areas for improvement?",
                    difficulty: "intermediate",
                    tips: "Be honest but show how you're actively working to improve.",
                    category: "general"
                },
                {
                    question: "Why do you want this job?",
                    difficulty: "beginner",
                    tips: "Show enthusiasm and connect your goals with the company's mission.",
                    category: "general"
                },
                {
                    question: "Where do you see yourself in 5 years?",
                    difficulty: "intermediate",
                    tips: "Show ambition while being realistic about growth within the company.",
                    category: "general"
                },
                {
                    question: "Why should we hire you?",
                    difficulty: "intermediate",
                    tips: "Summarize your unique value proposition with concrete examples.",
                    category: "general"
                },
                {
                    question: "What questions do you have for us?",
                    difficulty: "intermediate",
                    tips: "Ask thoughtful questions about the role, team, and company culture.",
                    category: "general"
                },
                {
                    question: "How do you handle pressure and tight deadlines?",
                    difficulty: "intermediate",
                    tips: "Provide specific examples of your time management and stress management skills.",
                    category: "general"
                },
                {
                    question: "What's your ideal work environment?",
                    difficulty: "beginner",
                    tips: "Be honest but show flexibility and adaptability.",
                    category: "general"
                },
                {
                    question: "How do you stay updated with industry trends?",
                    difficulty: "advanced",
                    tips: "Mention specific resources, courses, or professional development activities.",
                    category: "general"
                }
            ],
            storytelling: [
                {
                    question: "Tell me about a time you failed and what you learned",
                    difficulty: "intermediate",
                    tips: "Use the STAR method: Situation, Task, Action, Result. Focus on the learning.",
                    category: "storytelling"
                },
                {
                    question: "Share a story about going above and beyond for a customer",
                    difficulty: "intermediate",
                    tips: "Show your dedication and problem-solving skills with specific details.",
                    category: "storytelling"
                },
                {
                    question: "Describe a time you had to learn something new quickly",
                    difficulty: "intermediate",
                    tips: "Highlight your learning agility and resourcefulness.",
                    category: "storytelling"
                },
                {
                    question: "Tell me about a time you disagreed with your manager",
                    difficulty: "advanced",
                    tips: "Show professionalism, respect, and how you handled the disagreement constructively.",
                    category: "storytelling"
                },
                {
                    question: "Share an example of when you had to work with a difficult team member",
                    difficulty: "advanced",
                    tips: "Focus on your communication skills and ability to find common ground.",
                    category: "storytelling"
                },
                {
                    question: "Describe a project that didn't go as planned",
                    difficulty: "intermediate",
                    tips: "Show your problem-solving skills and ability to adapt under pressure.",
                    category: "storytelling"
                }
            ],
            communication: [
                {
                    question: "How do you explain complex technical concepts to non-technical people?",
                    difficulty: "intermediate",
                    tips: "Use analogies and simple language. Show patience and adaptability.",
                    category: "communication"
                },
                {
                    question: "Describe a time you had to deliver bad news",
                    difficulty: "advanced",
                    tips: "Show empathy, transparency, and how you managed the situation professionally.",
                    category: "communication"
                },
                {
                    question: "How do you handle conflicts in the workplace?",
                    difficulty: "intermediate",
                    tips: "Demonstrate emotional intelligence and conflict resolution skills.",
                    category: "communication"
                },
                {
                    question: "Tell me about a time you had to persuade someone to see your point of view",
                    difficulty: "advanced",
                    tips: "Show your influence skills and ability to build consensus.",
                    category: "communication"
                },
                {
                    question: "How do you ensure clear communication in remote work?",
                    difficulty: "intermediate",
                    tips: "Mention specific tools and practices for remote collaboration.",
                    category: "communication"
                }
            ],
            creativity: [
                {
                    question: "How do you approach problem-solving?",
                    difficulty: "intermediate",
                    tips: "Walk through your systematic approach with a specific example.",
                    category: "creativity"
                },
                {
                    question: "Describe a time you had to think outside the box",
                    difficulty: "intermediate",
                    tips: "Show your innovative thinking and willingness to try new approaches.",
                    category: "creativity"
                },
                {
                    question: "How do you stay creative under pressure?",
                    difficulty: "advanced",
                    tips: "Mention specific techniques you use to maintain creativity in stressful situations.",
                    category: "creativity"
                },
                {
                    question: "Tell me about an idea you had that was initially rejected but later accepted",
                    difficulty: "advanced",
                    tips: "Show persistence, communication skills, and ability to refine ideas.",
                    category: "creativity"
                }
            ],
            leadership: [
                {
                    question: "Describe a time you had to lead a team through a difficult change",
                    difficulty: "advanced",
                    tips: "Show your change management skills and ability to inspire others.",
                    category: "leadership"
                },
                {
                    question: "How do you motivate team members who are struggling?",
                    difficulty: "intermediate",
                    tips: "Demonstrate empathy, coaching skills, and ability to provide support.",
                    category: "leadership"
                },
                {
                    question: "Tell me about a time you had to make an unpopular decision",
                    difficulty: "advanced",
                    tips: "Show your decision-making process and how you communicated the decision.",
                    category: "leadership"
                },
                {
                    question: "How do you develop and mentor others?",
                    difficulty: "intermediate",
                    tips: "Provide specific examples of how you've helped others grow professionally.",
                    category: "leadership"
                }
            ],
            technical: [
                {
                    question: "Walk me through your approach to debugging a complex issue",
                    difficulty: "intermediate",
                    tips: "Show systematic thinking and problem-solving methodology.",
                    category: "technical"
                },
                {
                    question: "How do you stay current with new technologies?",
                    difficulty: "beginner",
                    tips: "Mention specific resources, projects, or learning methods you use.",
                    category: "technical"
                },
                {
                    question: "Describe a challenging technical project you worked on",
                    difficulty: "intermediate",
                    tips: "Explain the technical details while keeping it accessible to non-technical interviewers.",
                    category: "technical"
                },
                {
                    question: "How do you ensure code quality in your projects?",
                    difficulty: "intermediate",
                    tips: "Mention specific practices like code reviews, testing, and documentation.",
                    category: "technical"
                }
            ]
        };
        
        // DOM elements
        const categoryBtns = document.querySelectorAll('[data-category]');
        const difficultySelect = document.getElementById('interview-difficulty');
        const timerSelect = document.getElementById('interview-timer');
        const questionBox = document.getElementById('interview-question-box');
        const currentQuestion = document.getElementById('current-question');
        const questionInfo = document.getElementById('question-info');
        const questionCategory = document.getElementById('question-category');
        const questionDifficulty = document.getElementById('question-difficulty');
        const questionTips = document.getElementById('question-tips');
        const practiceTimerDiv = document.getElementById('practice-timer');
        const timerDisplay = document.getElementById('timer-display');
        const timerProgress = document.getElementById('timer-progress');
        const randomQuestionBtn = document.getElementById('random-question-btn');
        const previousQuestionBtn = document.getElementById('previous-question-btn');
        const nextQuestionBtn = document.getElementById('next-question-btn');
        const startPracticeBtn = document.getElementById('start-practice-btn');
        const stopPracticeBtn = document.getElementById('stop-practice-btn');
        const startCameraBtn = document.getElementById('start-camera-btn');
        const startRecordingBtn = document.getElementById('start-recording-btn');
        const stopRecordingBtn = document.getElementById('stop-recording-btn');
        const stopCameraBtn = document.getElementById('stop-camera-btn');
        const liveVideo = document.getElementById('live-video');
        const playbackVideo = document.getElementById('playback-video');
        const videoPlaceholder = document.getElementById('video-placeholder');
        const recordingsSection = document.getElementById('recordings-section');
        const recordingsList = document.getElementById('recordings-list');
        
        // Initialize interview
        initializeInterview();
        
        function initializeInterview() {
            // Set up event listeners
            setupEventListeners();
            
            // Load interview history
            loadInterviewHistory();
            
            // Show random question
            showRandomQuestion();
        }
        
        function setupEventListeners() {
            // Category selection
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    currentCategory = btn.dataset.category;
                    updateCategorySelection();
                    showRandomQuestion();
                });
            });
            
            // Difficulty change
            if (difficultySelect) {
                difficultySelect.addEventListener('change', () => {
                    currentDifficulty = difficultySelect.value;
                    showRandomQuestion();
                });
            }
            
            // Timer change
            if (timerSelect) {
                timerSelect.addEventListener('change', () => {
                    practiceTimeRemaining = parseInt(timerSelect.value) * 60;
                    updateTimerDisplay();
                });
            }
            
            // Question navigation
            if (randomQuestionBtn) randomQuestionBtn.addEventListener('click', showRandomQuestion);
            if (previousQuestionBtn) previousQuestionBtn.addEventListener('click', showPreviousQuestion);
            if (nextQuestionBtn) nextQuestionBtn.addEventListener('click', showNextQuestion);
            
            // Practice controls
            if (startPracticeBtn) startPracticeBtn.addEventListener('click', startPractice);
            if (stopPracticeBtn) stopPracticeBtn.addEventListener('click', stopPractice);
            
            // Recording controls
            if (startCameraBtn) startCameraBtn.addEventListener('click', startCamera);
            if (startRecordingBtn) startRecordingBtn.addEventListener('click', startRecording);
            if (stopRecordingBtn) stopRecordingBtn.addEventListener('click', stopRecording);
            if (stopCameraBtn) stopCameraBtn.addEventListener('click', stopCamera);
        }
        
        function updateCategorySelection() {
            categoryBtns.forEach(btn => {
                if (btn.dataset.category === currentCategory) {
                    btn.classList.add('ring-2', 'ring-forest-green', 'ring-offset-2');
                } else {
                    btn.classList.remove('ring-2', 'ring-forest-green', 'ring-offset-2');
                }
            });
        }
        
        function showRandomQuestion() {
            const questions = interviewQuestions[currentCategory] || interviewQuestions.general;
            const filteredQuestions = questions.filter(q => q.difficulty === currentDifficulty);
            
            if (filteredQuestions.length > 0) {
                const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
                const question = filteredQuestions[randomIndex];
                currentQuestionIndex = questions.indexOf(question);
                displayQuestion(question);
            } else {
                // Fallback to any difficulty
                const randomIndex = Math.floor(Math.random() * questions.length);
                const question = questions[randomIndex];
                currentQuestionIndex = randomIndex;
                displayQuestion(question);
            }
        }
        
        function showPreviousQuestion() {
            const questions = interviewQuestions[currentCategory] || interviewQuestions.general;
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                displayQuestion(questions[currentQuestionIndex]);
            }
        }
        
        function showNextQuestion() {
            const questions = interviewQuestions[currentCategory] || interviewQuestions.general;
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                displayQuestion(questions[currentQuestionIndex]);
            }
        }
        
        function displayQuestion(question) {
            if (currentQuestion) currentQuestion.textContent = question.question;
            if (questionCategory) questionCategory.textContent = `Category: ${question.category}`;
            if (questionDifficulty) questionDifficulty.textContent = `Difficulty: ${question.difficulty}`;
            if (questionTips) questionTips.textContent = `💡 Tip: ${question.tips}`;
            
            // Show question info
            if (questionInfo) questionInfo.classList.remove('hidden');
            
            // Show practice button
            if (startPracticeBtn) startPracticeBtn.classList.remove('hidden');
        }
        
        function startPractice() {
            if (!isPracticeRunning) {
                isPracticeRunning = true;
                practiceTimeRemaining = parseInt(timerSelect.value) * 60;
                
                // Update UI
                if (startPracticeBtn) startPracticeBtn.classList.add('hidden');
                if (stopPracticeBtn) stopPracticeBtn.classList.remove('hidden');
                if (practiceTimerDiv) practiceTimerDiv.classList.remove('hidden');
                
                // Start timer
                practiceTimer = setInterval(() => {
                    if (practiceTimeRemaining > 0) {
                        practiceTimeRemaining--;
                        updateTimerDisplay();
                    } else {
                        stopPractice();
                    }
                }, 1000);
                
                // Show notification
                showNotification('Practice started! Speak clearly and confidently. 🎤', 'success');
            }
        }
        
        function stopPractice() {
            if (isPracticeRunning) {
                isPracticeRunning = false;
                
                // Clear timer
                if (practiceTimer) {
                    clearInterval(practiceTimer);
                    practiceTimer = null;
                }
                
                // Update UI
                if (startPracticeBtn) startPracticeBtn.classList.remove('hidden');
                if (stopPracticeBtn) stopPracticeBtn.classList.add('hidden');
                if (practiceTimerDiv) practiceTimerDiv.classList.add('hidden');
                
                // Show completion message
                showNotification('Practice completed! Great job! 🎉', 'success');
                
                // Reset timer
                practiceTimeRemaining = parseInt(timerSelect.value) * 60;
                updateTimerDisplay();
            }
        }
        
        function updateTimerDisplay() {
            if (timerDisplay) {
                const minutes = Math.floor(practiceTimeRemaining / 60);
                const seconds = practiceTimeRemaining % 60;
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (timerProgress) {
                const totalTime = parseInt(timerSelect.value) * 60;
                const progress = ((totalTime - practiceTimeRemaining) / totalTime) * 100;
                timerProgress.style.width = `${progress}%`;
            }
        }
        
        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ 
                    video: true, 
                    audio: true 
                });
                
                if (liveVideo) {
                    liveVideo.srcObject = stream;
                    liveVideo.classList.remove('hidden');
                    videoPlaceholder.classList.add('hidden');
                }
                
                // Update buttons
                if (startCameraBtn) startCameraBtn.classList.add('hidden');
                if (startRecordingBtn) startRecordingBtn.classList.remove('hidden');
                if (stopCameraBtn) stopCameraBtn.classList.remove('hidden');
                
                showNotification('Camera started! Ready to record. 📹', 'success');
            } catch (error) {
                console.error('Error accessing camera:', error);
                showNotification('Unable to access camera. Please check permissions.', 'error');
            }
        }
        
        function startRecording() {
            if (stream && !isRecording) {
                recordedChunks = [];
                mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };
                
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'video/webm' });
                    const url = URL.createObjectURL(blob);
                    
                    if (playbackVideo) {
                        playbackVideo.src = url;
                        playbackVideo.classList.remove('hidden');
                        liveVideo.classList.add('hidden');
                    }
                    
                    // Save recording
                    saveRecording(blob);
                };
                
                mediaRecorder.start();
                isRecording = true;
                
                // Update buttons
                if (startRecordingBtn) startRecordingBtn.classList.add('hidden');
                if (stopRecordingBtn) stopRecordingBtn.classList.remove('hidden');
                
                showNotification('Recording started! 🔴', 'success');
            }
        }
        
        function stopRecording() {
            if (mediaRecorder && isRecording) {
                mediaRecorder.stop();
                isRecording = false;
                
                // Update buttons
                if (stopRecordingBtn) stopRecordingBtn.classList.add('hidden');
                if (startRecordingBtn) startRecordingBtn.classList.remove('hidden');
                
                showNotification('Recording stopped! Check your playback. ⏹️', 'success');
            }
        }
        
        function stopCamera() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                stream = null;
            }
            
            if (liveVideo) {
                liveVideo.classList.add('hidden');
                videoPlaceholder.classList.remove('hidden');
            }
            
            if (playbackVideo) {
                playbackVideo.classList.add('hidden');
            }
            
            // Update buttons
            if (startCameraBtn) startCameraBtn.classList.remove('hidden');
            if (startRecordingBtn) startRecordingBtn.classList.add('hidden');
            if (stopRecordingBtn) stopRecordingBtn.classList.add('hidden');
            if (stopCameraBtn) stopCameraBtn.classList.add('hidden');
            
            showNotification('Camera stopped', 'info');
        }
        
        function saveRecording(blob) {
            const recording = {
                id: Date.now(),
                date: new Date().toLocaleString(),
                category: currentCategory,
                difficulty: currentDifficulty,
                question: currentQuestion.textContent,
                duration: practiceTimeRemaining,
                blob: blob
            };
            
            interviewHistory.unshift(recording);
            if (interviewHistory.length > 20) { // Keep only last 20 recordings
                interviewHistory = interviewHistory.slice(0, 20);
            }
            
            localStorage.setItem('interviewHistory', JSON.stringify(interviewHistory));
            loadRecordings();
        }
        
        function loadRecordings() {
            if (recordingsList) {
                if (interviewHistory.length === 0) {
                    recordingsList.innerHTML = `
                        <div class="text-center py-8">
                            <div class="w-16 h-16 bg-forest-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-charcoal mb-2">No recordings yet</h3>
                            <p class="text-charcoal/70">Start recording to see your practice sessions here</p>
                        </div>
                    `;
                } else {
                    recordingsList.innerHTML = interviewHistory.map(recording => `
                        <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                            <div class="flex items-start justify-between mb-3">
                                <div>
                                    <div class="text-sm font-semibold text-charcoal">${recording.date}</div>
                                    <div class="text-xs text-charcoal/60">${recording.category} • ${recording.difficulty}</div>
                                </div>
                                <button onclick="deleteInterviewRecording(${recording.id})" class="text-charcoal/40 hover:text-red-500 transition-colors p-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                            <div class="text-charcoal text-sm mb-3">${recording.question}</div>
                            <div class="flex items-center space-x-2">
                                <button onclick="playRecording(${recording.id})" class="px-3 py-1 bg-forest-green text-white text-xs rounded-lg hover:bg-forest-green/90 transition-colors">
                                    ▶️ Play
                                </button>
                                <button onclick="downloadRecording(${recording.id})" class="px-3 py-1 bg-earthy-gold text-white text-xs rounded-lg hover:bg-earthy-gold/90 transition-colors">
                                    💾 Download
                                </button>
                            </div>
                        </div>
                    `).join('');
                }
            }
        }
        
        function loadInterviewHistory() {
            const saved = localStorage.getItem('interviewHistory');
            if (saved) {
                interviewHistory = JSON.parse(saved);
            }
            loadRecordings();
        }
        
        // Global functions for recording management
        window.deleteInterviewRecording = function(recordingId) {
            interviewHistory = interviewHistory.filter(r => r.id !== recordingId);
            localStorage.setItem('interviewHistory', JSON.stringify(interviewHistory));
            loadRecordings();
            showNotification('Recording deleted', 'info');
        };
        
        window.playRecording = function(recordingId) {
            const recording = interviewHistory.find(r => r.id === recordingId);
            if (recording && playbackVideo) {
                const url = URL.createObjectURL(recording.blob);
                playbackVideo.src = url;
                playbackVideo.classList.remove('hidden');
                liveVideo.classList.add('hidden');
            }
        };
        
        window.downloadRecording = function(recordingId) {
            const recording = interviewHistory.find(r => r.id === recordingId);
            if (recording) {
                const url = URL.createObjectURL(recording.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `interview-practice-${recording.date}.webm`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        };
        
        // Show recordings section if there are recordings
        if (interviewHistory.length > 0 && recordingsSection) {
            recordingsSection.classList.remove('hidden');
        }
    }

    // Notification System
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
        
        // Set colors based on type
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-black',
            info: 'bg-blue-500 text-white'
        };
        
        notification.className += ` ${colors[type] || colors.info}`;
        notification.textContent = message;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Journal Entry Management
    function loadJournalEntries() {
        const entriesList = document.getElementById('journal-history-list');
        if (entriesList) {
            const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
            
            if (entries.length === 0) {
                entriesList.innerHTML = `
                    <div class="text-center py-12">
                        <div class="w-16 h-16 bg-light-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-forest-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-charcoal mb-2">No entries yet</h3>
                        <p class="text-charcoal/70">Start writing to see your entries here</p>
                    </div>
                `;
            } else {
                entriesList.innerHTML = entries.map(entry => `
                    <div class="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                        <div class="flex items-start justify-between mb-3">
                            <div class="flex items-center space-x-3">
                                <span class="text-2xl">${entry.mood || '😊'}</span>
                                <div>
                                    <div class="text-sm font-semibold text-charcoal">${entry.date}</div>
                                    <div class="text-xs text-charcoal/60">${entry.wordCount || entry.text.split(/\s+/).length} words</div>
                                </div>
                            </div>
                            <button onclick="deleteJournalEntry(${entry.id})" class="text-charcoal/40 hover:text-red-500 transition-colors p-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="text-charcoal whitespace-pre-wrap leading-relaxed">${entry.text}</div>
                    </div>
                `).join('');
            }
        }
    }

    // Enhanced Journal Features
    function setupEnhancedJournalFeatures() {
        // Mood selection functionality
        const moodBtns = document.querySelectorAll('.mood-btn');
        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove selected class from all buttons
                moodBtns.forEach(b => b.classList.remove('selected', 'border-forest-green', 'bg-forest-green/10'));
                // Add selected class to clicked button
                btn.classList.add('selected', 'border-forest-green', 'bg-forest-green/10');
            });
        });
        
        // Auto-save functionality
        const entryText = document.getElementById('journal-entry');
        if (entryText) {
            // Auto-save every 30 seconds
            setInterval(() => {
                if (entryText.value.trim()) {
                    localStorage.setItem('journal-draft', entryText.value);
                }
            }, 30000);
            
            // Auto-save on input
            entryText.addEventListener('input', () => {
                localStorage.setItem('journal-draft', entryText.value);
            });
        }
        
        // Enhanced save functionality
        const saveBtn = document.getElementById('journal-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const entryText = document.getElementById('journal-entry');
                if (entryText && entryText.value.trim()) {
                    const selectedMood = document.querySelector('.mood-btn.selected');
                    const mood = selectedMood ? selectedMood.dataset.mood : '😊';
                    
                    const entry = {
                        id: Date.now(),
                        text: entryText.value.trim(),
                        date: new Date().toLocaleString(),
                        timestamp: new Date().getTime(),
                        mood: mood,
                        wordCount: entryText.value.trim().split(/\s+/).length
                    };
                    
                    let entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
                    entries.unshift(entry);
                    localStorage.setItem('journalEntries', JSON.stringify(entries));
                    
                    // Clear textarea and draft
                    entryText.value = '';
                    localStorage.removeItem('journal-draft');
                    
                    // Clear mood selection
                    moodBtns.forEach(b => b.classList.remove('selected', 'border-forest-green', 'bg-forest-green/10'));
                    
                    // Hide save button
                    saveBtn.classList.add('hidden');
                    
                    // Show success message
                    showNotification('Entry saved successfully! ✍️', 'success');
                    
                    // Reload entries
                    loadJournalEntries();
                }
            });
        }
    }

