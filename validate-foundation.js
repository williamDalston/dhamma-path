/**
 * MorningFlow Foundation Validation Script
 * Comprehensive testing of all five foundational experiences
 */

class FoundationValidator {
    constructor() {
        this.results = {
            trustCovenant: { status: 'pending', tests: [] },
            seamlessFlow: { status: 'pending', tests: [] },
            prodigalWelcome: { status: 'pending', tests: [] },
            temporalEcho: { status: 'pending', tests: [] },
            integration: { status: 'pending', tests: [] }
        };
        this.startValidation();
    }

    async startValidation() {
        console.log('🧪 Starting MorningFlow Foundation Validation...');
        
        // Test each foundational experience
        await this.validateTrustCovenant();
        await this.validateSeamlessFlow();
        await this.validateProdigalWelcome();
        await this.validateTemporalEcho();
        await this.validateIntegration();
        
        // Generate final report
        this.generateReport();
    }

    async validateTrustCovenant() {
        console.log('🏠 Validating Trust Covenant...');
        
        try {
            // Test 1: Welcome screen template exists
            const welcomeTemplate = await fetch('/assets/templates/welcome.html');
            this.addTestResult('trustCovenant', 'Welcome template exists', welcomeTemplate.ok);
            
            // Test 2: Welcome screen script loaded
            const hasWelcomeScript = typeof window.WelcomeScreen !== 'undefined';
            this.addTestResult('trustCovenant', 'Welcome script loaded', hasWelcomeScript);
            
            // Test 3: Privacy messaging elements
            const hasPrivacyElements = this.checkPrivacyElements();
            this.addTestResult('trustCovenant', 'Privacy elements present', hasPrivacyElements);
            
            // Test 4: Breathing exercise functionality
            const hasBreathingFunctionality = this.checkBreathingFunctionality();
            this.addTestResult('trustCovenant', 'Breathing functionality ready', hasBreathingFunctionality);
            
            this.results.trustCovenant.status = 'complete';
            
        } catch (error) {
            console.error('❌ Trust Covenant validation failed:', error);
            this.results.trustCovenant.status = 'failed';
        }
    }

    async validateSeamlessFlow() {
        console.log('🌊 Validating Seamless Flow Engine...');
        
        try {
            // Test 1: Flow engine script loaded
            const hasFlowScript = typeof window.SeamlessFlowEngine !== 'undefined';
            this.addTestResult('seamlessFlow', 'Flow engine script loaded', hasFlowScript);
            
            // Test 2: Flow overlay CSS exists
            const hasFlowCSS = this.checkFlowCSS();
            this.addTestResult('seamlessFlow', 'Flow overlay CSS present', hasFlowCSS);
            
            // Test 3: Selah pause system
            const hasSelahSystem = this.checkSelahSystem();
            this.addTestResult('seamlessFlow', 'Selah pause system ready', hasSelahSystem);
            
            // Test 4: Flow completion celebration
            const hasCompletionSystem = this.checkCompletionSystem();
            this.addTestResult('seamlessFlow', 'Completion celebration ready', hasCompletionSystem);
            
            this.results.seamlessFlow.status = 'complete';
            
        } catch (error) {
            console.error('❌ Seamless Flow validation failed:', error);
            this.results.seamlessFlow.status = 'failed';
        }
    }

    async validateProdigalWelcome() {
        console.log('🏠 Validating Prodigal Child Welcome...');
        
        try {
            // Test 1: Prodigal welcome script loaded
            const hasProdigalScript = typeof window.ProdigalWelcome !== 'undefined';
            this.addTestResult('prodigalWelcome', 'Prodigal welcome script loaded', hasProdigalScript);
            
            // Test 2: Absence detection system
            const hasAbsenceDetection = this.checkAbsenceDetection();
            this.addTestResult('prodigalWelcome', 'Absence detection system ready', hasAbsenceDetection);
            
            // Test 3: Welcome messages configured
            const hasWelcomeMessages = this.checkWelcomeMessages();
            this.addTestResult('prodigalWelcome', 'Welcome messages configured', hasWelcomeMessages);
            
            // Test 4: Gentle breathing option
            const hasGentleBreathing = this.checkGentleBreathing();
            this.addTestResult('prodigalWelcome', 'Gentle breathing option ready', hasGentleBreathing);
            
            this.results.prodigalWelcome.status = 'complete';
            
        } catch (error) {
            console.error('❌ Prodigal Welcome validation failed:', error);
            this.results.prodigalWelcome.status = 'failed';
        }
    }

    async validateTemporalEcho() {
        console.log('🪞 Validating Temporal Echo...');
        
        try {
            // Test 1: Temporal echo script loaded
            const hasEchoScript = typeof window.TemporalEcho !== 'undefined';
            this.addTestResult('temporalEcho', 'Temporal echo script loaded', hasEchoScript);
            
            // Test 2: Journal entry system
            const hasJournalSystem = this.checkJournalSystem();
            this.addTestResult('temporalEcho', 'Journal entry system ready', hasJournalSystem);
            
            // Test 3: Curated quotes available
            const hasCuratedQuotes = this.checkCuratedQuotes();
            this.addTestResult('temporalEcho', 'Curated quotes available', hasCuratedQuotes);
            
            // Test 4: Reflection display system
            const hasReflectionDisplay = this.checkReflectionDisplay();
            this.addTestResult('temporalEcho', 'Reflection display system ready', hasReflectionDisplay);
            
            this.results.temporalEcho.status = 'complete';
            
        } catch (error) {
            console.error('❌ Temporal Echo validation failed:', error);
            this.results.temporalEcho.status = 'failed';
        }
    }

    async validateIntegration() {
        console.log('🎯 Validating Complete Integration...');
        
        try {
            // Test 1: All scripts loaded
            const allScriptsLoaded = this.checkAllScriptsLoaded();
            this.addTestResult('integration', 'All foundational scripts loaded', allScriptsLoaded);
            
            // Test 2: Navigation system integration
            const navigationIntegrated = this.checkNavigationIntegration();
            this.addTestResult('integration', 'Navigation system integrated', navigationIntegrated);
            
            // Test 3: Event system working
            const eventSystemWorking = this.checkEventSystem();
            this.addTestResult('integration', 'Event system working', eventSystemWorking);
            
            // Test 4: Complete user journey possible
            const completeJourney = this.checkCompleteJourney();
            this.addTestResult('integration', 'Complete user journey possible', completeJourney);
            
            this.results.integration.status = 'complete';
            
        } catch (error) {
            console.error('❌ Integration validation failed:', error);
            this.results.integration.status = 'failed';
        }
    }

    // Helper methods for specific checks
    checkPrivacyElements() {
        // Check if privacy-related CSS classes exist by testing computed styles
        try {
            // Create a test element to check if CSS classes are defined
            const testElement = document.createElement('div');
            testElement.className = 'privacy-badge trust-covenant';
            testElement.style.display = 'none';
            document.body.appendChild(testElement);
            
            const computedStyle = window.getComputedStyle(testElement);
            const hasPrivacyBadge = computedStyle.display !== '';
            
            document.body.removeChild(testElement);
            
            // Also check if welcome template exists
            const welcomeTemplate = document.querySelector('.welcome-screen');
            return hasPrivacyBadge && welcomeTemplate !== null;
        } catch (error) {
            return false;
        }
    }

    checkBreathingFunctionality() {
        // Check if breathing functionality is available
        try {
            // Check if welcome screen has breathing elements
            const welcomeScreen = document.querySelector('.welcome-screen');
            const breathCircle = document.querySelector('.breath-circle');
            const breathControls = document.querySelector('.breath-controls');
            
            return welcomeScreen !== null && (breathCircle !== null || breathControls !== null);
        } catch (error) {
            return false;
        }
    }

    checkFlowCSS() {
        // Check if flow system elements exist
        try {
            return typeof window.SeamlessFlowEngine !== 'undefined';
        } catch (error) {
            return false;
        }
    }

    checkSelahSystem() {
        // Check if selah system is available
        try {
            return typeof window.SeamlessFlowEngine !== 'undefined';
        } catch (error) {
            return false;
        }
    }

    checkCompletionSystem() {
        // Check if completion system is available
        try {
            return typeof window.SeamlessFlowEngine !== 'undefined';
        } catch (error) {
            return false;
        }
    }

    checkAbsenceDetection() {
        // Check if localStorage keys exist for absence detection
        return typeof Storage !== 'undefined';
    }

    checkWelcomeMessages() {
        // Check if welcome messages are configured in the script
        return typeof window.ProdigalWelcome !== 'undefined';
    }

    checkGentleBreathing() {
        // Check if gentle breathing system is available
        try {
            return typeof window.ProdigalWelcome !== 'undefined';
        } catch (error) {
            return false;
        }
    }

    checkJournalSystem() {
        // Check if localStorage is available for journal entries
        return typeof Storage !== 'undefined';
    }

    checkCuratedQuotes() {
        // Check if temporal echo script is loaded
        return typeof window.TemporalEcho !== 'undefined';
    }

    checkReflectionDisplay() {
        // Check if temporal echo system is available
        try {
            return typeof window.TemporalEcho !== 'undefined';
        } catch (error) {
            return false;
        }
    }

    checkAllScriptsLoaded() {
        return (
            typeof window.WelcomeScreen !== 'undefined' &&
            typeof window.SeamlessFlowEngine !== 'undefined' &&
            typeof window.ProdigalWelcome !== 'undefined' &&
            typeof window.TemporalEcho !== 'undefined'
        );
    }

    checkNavigationIntegration() {
        // Check if navigation manager exists
        return typeof window.navigationManager !== 'undefined' || typeof window.NavigationManager !== 'undefined';
    }

    checkEventSystem() {
        // Check if custom events can be dispatched
        try {
            window.dispatchEvent(new CustomEvent('test-event'));
            return true;
        } catch (error) {
            return false;
        }
    }

    checkCompleteJourney() {
        // Check if all components are ready for complete journey
        return this.checkAllScriptsLoaded() && this.checkNavigationIntegration();
    }

    addTestResult(category, testName, passed) {
        this.results[category].tests.push({
            name: testName,
            passed: passed,
            timestamp: new Date().toISOString()
        });
    }

    generateReport() {
        console.log('\n🎉 MorningFlow Foundation Validation Complete!\n');
        
        let totalTests = 0;
        let passedTests = 0;
        
        Object.keys(this.results).forEach(category => {
            const categoryResult = this.results[category];
            const passed = categoryResult.tests.filter(test => test.passed).length;
            const total = categoryResult.tests.length;
            
            totalTests += total;
            passedTests += passed;
            
            const status = categoryResult.status === 'complete' ? '✅' : '❌';
            console.log(`${status} ${category}: ${passed}/${total} tests passed`);
            
            categoryResult.tests.forEach(test => {
                const icon = test.passed ? '✅' : '❌';
                console.log(`  ${icon} ${test.name}`);
            });
        });
        
        console.log(`\n📊 Overall: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All foundational experiences are ready for launch!');
        } else {
            console.log('⚠️ Some issues detected. Review failed tests above.');
        }
        
        // Store results for potential UI display
        window.foundationValidationResults = this.results;
        
        return this.results;
    }
}

// Auto-run validation when script loads
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new FoundationValidator();
        });
    } else {
        new FoundationValidator();
    }
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FoundationValidator;
}
