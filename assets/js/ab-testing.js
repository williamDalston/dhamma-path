/**
 * A/B Testing Framework - Feature Optimization
 * 
 * Implements comprehensive A/B testing for feature optimization,
 * user experience improvements, and data-driven decision making.
 */

class ABTestingFramework {
    constructor() {
        this.experiments = new Map();
        this.userVariants = new Map();
        this.metrics = new Map();
        this.results = new Map();
        this.activeExperiments = [];
        
        this.init();
    }
    
    init() {
        this.loadUserVariants();
        this.setupExperimentTracking();
        this.initializeExperiments();
        console.log('🎯 A/B Testing Framework initialized');
    }
    
    setupExperimentTracking() {
        // Track experiment views
        this.trackExperimentView = (experimentId, variant) => {
            this.trackEvent('experiment_view', {
                experiment_id: experimentId,
                variant: variant,
                timestamp: Date.now()
            });
        };
        
        // Track experiment conversions
        this.trackExperimentConversion = (experimentId, variant, conversionType, value = null) => {
            this.trackEvent('experiment_conversion', {
                experiment_id: experimentId,
                variant: variant,
                conversion_type: conversionType,
                value: value,
                timestamp: Date.now()
            });
        };
        
        // Track experiment interactions
        this.trackExperimentInteraction = (experimentId, variant, interactionType, element = null) => {
            this.trackEvent('experiment_interaction', {
                experiment_id: experimentId,
                variant: variant,
                interaction_type: interactionType,
                element: element,
                timestamp: Date.now()
            });
        };
    }
    
    initializeExperiments() {
        // Define experiments
        this.experiments.set('button_color', {
            id: 'button_color',
            name: 'Button Color Optimization',
            description: 'Test different button colors for better conversion',
            variants: {
                control: {
                    name: 'Control (Green)',
                    cssClass: 'bg-green-500',
                    weight: 50
                },
                variant_a: {
                    name: 'Variant A (Blue)',
                    cssClass: 'bg-blue-500',
                    weight: 25
                },
                variant_b: {
                    name: 'Variant B (Purple)',
                    cssClass: 'bg-purple-500',
                    weight: 25
                }
            },
            metrics: ['click_rate', 'conversion_rate', 'engagement'],
            status: 'active',
            startDate: Date.now(),
            endDate: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        });
        
        this.experiments.set('timer_interface', {
            id: 'timer_interface',
            name: 'Timer Interface Design',
            description: 'Test different timer interface designs',
            variants: {
                control: {
                    name: 'Control (Circle)',
                    design: 'circle',
                    weight: 50
                },
                variant_a: {
                    name: 'Variant A (Progress Bar)',
                    design: 'progress_bar',
                    weight: 25
                },
                variant_b: {
                    name: 'Variant B (Digital)',
                    design: 'digital',
                    weight: 25
                }
            },
            metrics: ['completion_rate', 'session_duration', 'return_rate'],
            status: 'active',
            startDate: Date.now(),
            endDate: Date.now() + (30 * 24 * 60 * 60 * 1000)
        });
        
        this.experiments.set('welcome_message', {
            id: 'welcome_message',
            name: 'Welcome Message Personalization',
            description: 'Test different welcome message approaches',
            variants: {
                control: {
                    name: 'Control (Generic)',
                    message: 'Welcome to MorningFlow',
                    weight: 50
                },
                variant_a: {
                    name: 'Variant A (Personal)',
                    message: 'Good morning! Ready to start your day?',
                    weight: 25
                },
                variant_b: {
                    name: 'Variant B (Motivational)',
                    message: 'Your journey to mindfulness begins now',
                    weight: 25
                }
            },
            metrics: ['engagement_rate', 'session_duration', 'retention_rate'],
            status: 'active',
            startDate: Date.now(),
            endDate: Date.now() + (30 * 24 * 60 * 60 * 1000)
        });
        
        this.experiments.set('journal_prompts', {
            id: 'journal_prompts',
            name: 'Journal Prompt Types',
            description: 'Test different journal prompt approaches',
            variants: {
                control: {
                    name: 'Control (Open-ended)',
                    promptType: 'open_ended',
                    weight: 50
                },
                variant_a: {
                    name: 'Variant A (Guided)',
                    promptType: 'guided',
                    weight: 25
                },
                variant_b: {
                    name: 'Variant B (Question-based)',
                    promptType: 'question_based',
                    weight: 25
                }
            },
            metrics: ['completion_rate', 'word_count', 'satisfaction_score'],
            status: 'active',
            startDate: Date.now(),
            endDate: Date.now() + (30 * 24 * 60 * 60 * 1000)
        });
        
        // Initialize active experiments
        this.activeExperiments = Array.from(this.experiments.values()).filter(exp => exp.status === 'active');
    }
    
    loadUserVariants() {
        try {
            const storedVariants = localStorage.getItem('ab_testing_variants');
            if (storedVariants) {
                this.userVariants = new Map(JSON.parse(storedVariants));
            }
        } catch (error) {
            console.error('Error loading user variants:', error);
        }
    }
    
    saveUserVariants() {
        try {
            const variantsArray = Array.from(this.userVariants.entries());
            localStorage.setItem('ab_testing_variants', JSON.stringify(variantsArray));
        } catch (error) {
            console.error('Error saving user variants:', error);
        }
    }
    
    getUserVariant(experimentId) {
        // Check if user already has a variant for this experiment
        if (this.userVariants.has(experimentId)) {
            return this.userVariants.get(experimentId);
        }
        
        // Assign new variant based on experiment configuration
        const experiment = this.experiments.get(experimentId);
        if (!experiment) {
            return 'control';
        }
        
        const variant = this.assignVariant(experiment);
        this.userVariants.set(experimentId, variant);
        this.saveUserVariants();
        
        // Track experiment assignment
        this.trackExperimentView(experimentId, variant);
        
        return variant;
    }
    
    trackExperimentView(experimentId, variant) {
        // Track experiment view for analytics
        console.log(`🎯 Experiment view tracked: ${experimentId} - ${variant}`);
    }
    
    assignVariant(experiment) {
        const variants = Object.entries(experiment.variants);
        const totalWeight = variants.reduce((sum, [, variant]) => sum + variant.weight, 0);
        const random = Math.random() * totalWeight;
        
        let currentWeight = 0;
        for (const [variantId, variant] of variants) {
            currentWeight += variant.weight;
            if (random <= currentWeight) {
                return variantId;
            }
        }
        
        return 'control'; // Fallback
    }
    
    applyVariant(experimentId, variantId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) return;
        
        const variant = experiment.variants[variantId];
        if (!variant) return;
        
        // Apply variant-specific changes
        switch (experimentId) {
            case 'button_color':
                this.applyButtonColorVariant(variant);
                break;
            case 'timer_interface':
                this.applyTimerInterfaceVariant(variant);
                break;
            case 'welcome_message':
                this.applyWelcomeMessageVariant(variant);
                break;
            case 'journal_prompts':
                this.applyJournalPromptsVariant(variant);
                break;
        }
    }
    
    applyButtonColorVariant(variant) {
        const buttons = document.querySelectorAll('.sacred-flow-button, .btn, button');
        buttons.forEach(button => {
            // Remove existing color classes
            button.classList.remove('bg-green-500', 'bg-blue-500', 'bg-purple-500');
            // Add variant color class
            button.classList.add(variant.cssClass);
        });
    }
    
    applyTimerInterfaceVariant(variant) {
        const timerDisplay = document.querySelector('.timer-display, .breathing-circle-container');
        if (!timerDisplay) return;
        
        switch (variant.design) {
            case 'progress_bar':
                timerDisplay.innerHTML = `
                    <div class="timer-progress-bar">
                        <div class="progress-container">
                            <div class="progress-fill" id="timer-progress"></div>
                        </div>
                        <div class="timer-text" id="timer-text">00:00</div>
                    </div>
                `;
                break;
            case 'digital':
                timerDisplay.innerHTML = `
                    <div class="timer-digital">
                        <div class="digital-display" id="timer-text">00:00</div>
                    </div>
                `;
                break;
            default: // circle
                timerDisplay.innerHTML = `
                    <div class="breathing-circle-container">
                        <div class="breathing-circle">
                            <div class="inner-circle"></div>
                        </div>
                    </div>
                `;
        }
    }
    
    applyWelcomeMessageVariant(variant) {
        const welcomeElements = document.querySelectorAll('.greeting-text, .welcome-message');
        welcomeElements.forEach(element => {
            element.textContent = variant.message;
        });
    }
    
    applyJournalPromptsVariant(variant) {
        const journalArea = document.querySelector('#journal-textarea');
        if (!journalArea) return;
        
        let placeholder = '';
        switch (variant.promptType) {
            case 'guided':
                placeholder = 'Begin with "Today I feel..." and let your thoughts flow naturally...';
                break;
            case 'question_based':
                placeholder = 'What is one thing you\'re grateful for today? What challenges are you facing?';
                break;
            default: // open_ended
                placeholder = 'Begin your sacred thoughts... Let your heart speak freely.';
        }
        
        journalArea.placeholder = placeholder;
    }
    
    trackEvent(eventType, properties) {
        // Send to analytics engine
        if (window.analyticsEngine) {
            window.analyticsEngine.trackEvent(eventType, properties);
        }
        
        // Store locally for analysis
        const event = {
            type: eventType,
            properties,
            timestamp: Date.now()
        };
        
        if (!this.metrics.has(eventType)) {
            this.metrics.set(eventType, []);
        }
        
        this.metrics.get(eventType).push(event);
    }
    
    trackConversion(experimentId, conversionType, value = null) {
        const variant = this.getUserVariant(experimentId);
        this.trackExperimentConversion(experimentId, variant, conversionType, value);
    }
    
    trackInteraction(experimentId, interactionType, element = null) {
        const variant = this.getUserVariant(experimentId);
        this.trackExperimentInteraction(experimentId, variant, interactionType, element);
    }
    
    calculateResults(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) return null;
        
        const results = {
            experiment_id: experimentId,
            variants: {},
            significance: {},
            recommendation: null
        };
        
        // Calculate metrics for each variant
        Object.keys(experiment.variants).forEach(variantId => {
            const variantData = this.getVariantData(experimentId, variantId);
            results.variants[variantId] = this.calculateVariantMetrics(variantData);
        });
        
        // Calculate statistical significance
        results.significance = this.calculateSignificance(experimentId, results.variants);
        
        // Generate recommendation
        results.recommendation = this.generateRecommendation(experimentId, results);
        
        this.results.set(experimentId, results);
        return results;
    }
    
    getVariantData(experimentId, variantId) {
        const events = Array.from(this.metrics.values()).flat();
        return events.filter(event => 
            event.properties.experiment_id === experimentId && 
            event.properties.variant === variantId
        );
    }
    
    calculateVariantMetrics(variantData) {
        const views = variantData.filter(e => e.type === 'experiment_view').length;
        const conversions = variantData.filter(e => e.type === 'experiment_conversion').length;
        const interactions = variantData.filter(e => e.type === 'experiment_interaction').length;
        
        return {
            views,
            conversions,
            interactions,
            conversion_rate: views > 0 ? (conversions / views) * 100 : 0,
            interaction_rate: views > 0 ? (interactions / views) * 100 : 0
        };
    }
    
    calculateSignificance(experimentId, variants) {
        // Simplified statistical significance calculation
        const control = variants.control;
        const significance = {};
        
        Object.entries(variants).forEach(([variantId, data]) => {
            if (variantId === 'control') return;
            
            const improvement = ((data.conversion_rate - control.conversion_rate) / control.conversion_rate) * 100;
            significance[variantId] = {
                improvement,
                confidence: this.calculateConfidence(control, data),
                significant: Math.abs(improvement) > 10 && this.calculateConfidence(control, data) > 0.95
            };
        });
        
        return significance;
    }
    
    calculateConfidence(control, variant) {
        // Simplified confidence calculation
        const n1 = control.views;
        const n2 = variant.views;
        const p1 = control.conversion_rate / 100;
        const p2 = variant.conversion_rate / 100;
        
        if (n1 < 30 || n2 < 30) return 0.8; // Low confidence for small samples
        
        const se = Math.sqrt((p1 * (1 - p1) / n1) + (p2 * (1 - p2) / n2));
        const z = Math.abs(p2 - p1) / se;
        
        // Convert z-score to confidence level (simplified)
        if (z > 2.58) return 0.99;
        if (z > 1.96) return 0.95;
        if (z > 1.65) return 0.90;
        return 0.80;
    }
    
    generateRecommendation(experimentId, results) {
        const { variants, significance } = results;
        const control = variants.control;
        
        let bestVariant = 'control';
        let bestImprovement = 0;
        
        Object.entries(significance).forEach(([variantId, data]) => {
            if (data.significant && data.improvement > bestImprovement) {
                bestVariant = variantId;
                bestImprovement = data.improvement;
            }
        });
        
        if (bestVariant === 'control') {
            return {
                action: 'keep_control',
                message: 'Control variant is performing best. No changes recommended.',
                confidence: 0.95
            };
        } else {
            return {
                action: 'implement_variant',
                variant: bestVariant,
                improvement: bestImprovement,
                message: `Implement ${bestVariant} - ${bestImprovement.toFixed(1)}% improvement`,
                confidence: significance[bestVariant].confidence
            };
        }
    }
    
    // Public methods
    runExperiment(experimentId) {
        const variant = this.getUserVariant(experimentId);
        this.applyVariant(experimentId, variant);
        
        // Set up tracking for this experiment
        this.setupExperimentTracking(experimentId, variant);
        
        return variant;
    }
    
    setupExperimentTracking(experimentId, variant) {
        // Track clicks on variant elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('button, .btn, .sacred-flow-button')) {
                this.trackInteraction(experimentId, 'button_click', e.target);
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackInteraction(experimentId, 'form_submit', e.target);
        });
        
        // Track timer completions
        window.addEventListener('timerCompleted', (e) => {
            this.trackConversion(experimentId, 'timer_completion', e.detail.duration);
        });
        
        // Track journal completions
        window.addEventListener('journalEntrySaved', (e) => {
            this.trackConversion(experimentId, 'journal_completion', e.detail.length);
        });
    }
    
    getExperimentResults(experimentId) {
        return this.calculateResults(experimentId);
    }
    
    getAllResults() {
        const allResults = {};
        this.experiments.forEach((experiment, experimentId) => {
            allResults[experimentId] = this.calculateResults(experimentId);
        });
        return allResults;
    }
    
    exportData() {
        return {
            experiments: Array.from(this.experiments.entries()),
            userVariants: Array.from(this.userVariants.entries()),
            metrics: Array.from(this.metrics.entries()),
            results: Array.from(this.results.entries())
        };
    }
    
    resetExperiment(experimentId) {
        this.userVariants.delete(experimentId);
        this.saveUserVariants();
        
        // Reset to control variant
        const experiment = this.experiments.get(experimentId);
        if (experiment) {
            this.applyVariant(experimentId, 'control');
        }
    }
    
    createExperiment(experimentConfig) {
        const experimentId = experimentConfig.id || `exp_${Date.now()}`;
        this.experiments.set(experimentId, {
            ...experimentConfig,
            id: experimentId,
            status: 'active',
            startDate: Date.now(),
            endDate: Date.now() + (experimentConfig.duration || 30) * 24 * 60 * 60 * 1000
        });
        
        return experimentId;
    }
    
    pauseExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (experiment) {
            experiment.status = 'paused';
        }
    }
    
    resumeExperiment(experimentId) {
        const experiment = this.experiments.get(experimentId);
        if (experiment) {
            experiment.status = 'active';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.abTesting = new ABTestingFramework();
    
    // Run active experiments
    window.abTesting.activeExperiments.forEach(experiment => {
        window.abTesting.runExperiment(experiment.id);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ABTestingFramework;
}
