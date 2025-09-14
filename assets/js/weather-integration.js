/**
 * Weather Integration System
 * Provides weather-based recommendations and mood correlation tracking
 */

class WeatherIntegration {
    constructor() {
        this.apiKey = null; // Would be set from environment or user input
        this.currentWeather = null;
        this.weatherHistory = [];
        this.moodWeatherCorrelation = {};
        this.userLocation = null;
        this.isUSLocation = true; // Default to US
        this.temperatureUnit = 'F'; // Default to Fahrenheit
        
        this.initializeWeatherSystem();
    }
    
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        console.log('🌤️ Weather API key set:', apiKey ? 'Provided' : 'Not provided');
        if (apiKey && apiKey !== 'demo_key') {
            console.log('🌤️ Real weather data will now be fetched from OpenWeatherMap API');
        }
    }
    
    initializeWeatherSystem() {
        this.setupWeatherConditions();
        this.detectUserLocation();
        this.setupWeatherAPI();
        this.loadWeatherHistory();
        this.setupWeatherEvents();
    }
    
    async detectUserLocation() {
        try {
            // Don't request location automatically - wait for user gesture
            // Use browser-based detection first
            this.detectLocationFromBrowser();
            
            // Store location request function for user gesture
            this.requestLocationPermission = () => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            this.userLocation = {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude
                            };
                            
                            // Determine if user is in US based on coordinates
                            this.isUSLocation = this.isLocationInUS(position.coords.latitude, position.coords.longitude);
                            this.temperatureUnit = this.isUSLocation ? 'F' : 'C';
                            
                            console.log(`🌍 Location detected: ${this.isUSLocation ? 'US' : 'International'} - Using ${this.temperatureUnit}°`);
                            
                            // Retry weather fetch with real location
                            this.getCurrentWeather();
                        },
                        (error) => {
                            console.log('📍 Location access denied, keeping browser-based detection');
                        },
                        {
                            timeout: 5000,
                            enableHighAccuracy: false
                        }
                    );
                }
            };
            
        } catch (error) {
            console.log('🌍 Location detection failed, using browser-based detection');
            this.detectLocationFromBrowser();
        }
    }
    
    detectLocationFromBrowser() {
        // Try to detect location from browser settings
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        
        // Simple heuristic: if timezone contains US timezones, likely in US
        const usTimezones = ['America/', 'US/', 'Pacific/', 'Mountain/', 'Central/', 'Eastern/'];
        this.isUSLocation = usTimezones.some(tz => timezone.includes(tz));
        
        // Also check language setting
        if (language.startsWith('en-US')) {
            this.isUSLocation = true;
        } else if (language.startsWith('en-')) {
            // Other English-speaking countries, likely not US
            this.isUSLocation = false;
        }
        
        this.temperatureUnit = this.isUSLocation ? 'F' : 'C';
        
        // Set a default location based on detection for API calls
        if (this.isUSLocation) {
            this.userLocation = { latitude: 37.7749, longitude: -122.4194 }; // San Francisco
        } else {
            this.userLocation = { latitude: 51.5074, longitude: -0.1278 }; // London
        }
        
        console.log(`🌍 Browser-based detection: ${this.isUSLocation ? 'US' : 'International'} - Using ${this.temperatureUnit}°`);
    }
    
    isLocationInUS(lat, lng) {
        // Simple bounding box check for US territory
        // This is a rough approximation - in production you'd use a proper geolocation service
        return (
            lat >= 24.396308 && lat <= 71.538800 && // Latitude bounds
            lng >= -179.148909 && lng <= -66.885444 // Longitude bounds (includes Alaska and Hawaii)
        );
    }
    
    setupWeatherAPI() {
        // Use real weather API - OpenWeatherMap
        // Note: In production, this should be stored securely
        this.apiKey = 'e4b5f17998ad0477558acd5d3ac25255'; // ✅ Active API key
        this.baseURL = 'https://api.openweathermap.org/data/2.5';
        this.currentWeather = null;
        this.forecastData = null;
        this.dailyTemperatures = null;
        this.apiCallCount = 0;
        this.lastApiCall = 0;
        this.rateLimitDelay = 1000; // 1 second between calls
        
        // Fallback to mock data if API fails
        this.mockWeatherData = {
            current: {
                temperature: 72, // Fahrenheit
                condition: 'sunny',
                humidity: 45,
                windSpeed: 5,
                description: 'Clear sky',
                icon: '☀️'
            },
            dailyTemperatures: this.generateDailyTemperatureData(),
            forecast: [
                { day: 'Today', temp: 72, condition: 'sunny', icon: '☀️' },
                { day: 'Tomorrow', temp: 68, condition: 'partly-cloudy', icon: '⛅' },
                { day: 'Wednesday', temp: 65, condition: 'rainy', icon: '🌧️' },
                { day: 'Thursday', temp: 70, condition: 'cloudy', icon: '☁️' },
                { day: 'Friday', temp: 75, condition: 'sunny', icon: '☀️' }
            ]
        };
    }
    
    generateDailyTemperatureData() {
        // Generate hourly temperature data for the day
        const baseTemp = this.mockWeatherData?.current?.temperature || 72;
        const hourlyTemps = [];
        
        for (let hour = 0; hour < 24; hour++) {
            // Simulate daily temperature curve (cooler at night, warmer during day)
            const hourOffset = Math.sin((hour - 6) * Math.PI / 12) * 0.3; // Peak at 2 PM
            const randomVariation = (Math.random() - 0.5) * 4; // ±2 degrees variation
            const temp = Math.round(baseTemp + hourOffset * 15 + randomVariation);
            
            hourlyTemps.push({
                hour: hour,
                time: `${hour.toString().padStart(2, '0')}:00`,
                temperature: temp,
                condition: this.getConditionForHour(hour, temp)
            });
        }
        
        return hourlyTemps;
    }
    
    getConditionForHour(hour, temp) {
        // Simple logic to determine condition based on hour and temperature
        if (hour >= 6 && hour <= 18) {
            if (temp > 75) return 'sunny';
            if (temp > 65) return 'partly-cloudy';
            return 'cloudy';
        } else {
            return 'clear-night';
        }
    }
    
    convertTemperature(tempF, toUnit = null) {
        const unit = toUnit || this.temperatureUnit;
        if (unit === 'C') {
            return Math.round((tempF - 32) * 5/9);
        }
        return tempF;
    }
    
    formatTemperature(tempF, unit = null) {
        const temp = this.convertTemperature(tempF, unit);
        const unitSymbol = (unit || this.temperatureUnit) === 'C' ? '°C' : '°F';
        return `${temp}${unitSymbol}`;
    }
    
    createTemperatureGraph() {
        const dailyTemps = this.mockWeatherData.dailyTemperatures;
        const minTemp = Math.min(...dailyTemps.map(t => t.temperature));
        const maxTemp = Math.max(...dailyTemps.map(t => t.temperature));
        const currentHour = new Date().getHours();
        
        // Create SVG graph
        const graphWidth = 200;
        const graphHeight = 40;
        const padding = 4;
        
        let pathData = '';
        let points = '';
        
        dailyTemps.forEach((tempData, index) => {
            const x = (index / 23) * (graphWidth - padding * 2) + padding;
            const normalizedTemp = (tempData.temperature - minTemp) / (maxTemp - minTemp);
            const y = graphHeight - (normalizedTemp * (graphHeight - padding * 2)) - padding;
            
            if (index === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
            
            // Add current hour indicator
            if (tempData.hour === currentHour) {
                points += `<circle cx="${x}" cy="${y}" r="3" fill="#2D5A27" stroke="white" stroke-width="1"/>`;
            }
        });
        
        return `
            <svg width="${graphWidth}" height="${graphHeight}" class="absolute inset-0">
                <path d="${pathData}" stroke="#2D5A27" stroke-width="2" fill="none" opacity="0.8"/>
                <path d="${pathData}" stroke="#7BA05B" stroke-width="1" fill="url(#tempGradient)" opacity="0.3"/>
                <defs>
                    <linearGradient id="tempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#7BA05B;stop-opacity:0.6" />
                        <stop offset="100%" style="stop-color:#7BA05B;stop-opacity:0.1" />
                    </linearGradient>
                </defs>
                ${points}
            </svg>
        `;
    }
    
    setupWeatherConditions() {
        this.weatherConditions = {
            sunny: {
                name: 'Sunny',
                icon: '☀️',
                mood: 'energetic',
                recommendations: [
                    'The sun blesses your sacred practice today',
                    'Nature invites you to breathe deeply outdoors',
                    'Golden light amplifies your inner radiance'
                ],
                activitySuggestions: ['outdoor meditation', 'morning walk', 'gratitude practice']
            },
            rainy: {
                name: 'Rainy',
                icon: '🌧️',
                mood: 'calm',
                recommendations: [
                    'Rain whispers wisdom to your soul today',
                    'The gentle rhythm of water deepens your practice',
                    'Sacred stillness awaits in your indoor sanctuary'
                ],
                activitySuggestions: ['indoor meditation', 'deep journaling', 'listening to rain sounds']
            },
            cloudy: {
                name: 'Cloudy',
                icon: '☁️',
                mood: 'neutral',
                recommendations: [
                    'Soft clouds bring gentle, balanced energy',
                    'Perfect conditions for focused inner work',
                    'The sky holds space for your sacred routine'
                ],
                activitySuggestions: ['focused meditation', 'structured journaling', 'goal review']
            },
            'partly-cloudy': {
                name: 'Partly Cloudy',
                icon: '⛅',
                mood: 'optimistic',
                recommendations: [
                    'Nature offers both shadow and light for your journey',
                    'Perfect conditions to explore new practices',
                    'The sky mirrors your inner balance today'
                ],
                activitySuggestions: ['varied meditation', 'creative journaling', 'flexible routine']
            }
        };
    }
    
    async getCurrentWeather() {
        try {
            console.log('🌤️ Weather API check:', {
                hasLocation: !!this.userLocation,
                hasApiKey: !!this.apiKey,
                apiKeyLength: this.apiKey?.length,
                location: this.userLocation
            });
            
            // Try to get real weather data first
            if (this.userLocation && this.apiKey && this.apiKey.length > 10) {
                console.log('🌤️ Attempting to fetch real weather data...');
                const weatherData = await this.fetchRealWeatherData();
                if (weatherData) {
                    console.log('🌤️ Real weather data fetched successfully!');
                    this.currentWeather = weatherData;
                    this.saveWeatherData();
                    this.generateWeatherRecommendations();
                    return this.currentWeather;
                }
            }
            
            // Fallback to mock data if real API fails or no API key
            console.log('🌤️ Using mock weather data (no API key or API failed)');
            const conditions = Object.keys(this.weatherConditions);
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            
            this.currentWeather = {
                ...this.mockWeatherData.current,
                condition: randomCondition,
                ...this.weatherConditions[randomCondition]
            };
            
            this.saveWeatherData();
            this.generateWeatherRecommendations();
            
            return this.currentWeather;
        } catch (error) {
            console.error('Failed to fetch weather:', error);
            return null;
        }
    }
    
    async fetchRealWeatherData() {
        try {
            // Rate limiting to prevent API abuse
            const now = Date.now();
            if (now - this.lastApiCall < this.rateLimitDelay) {
                await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - (now - this.lastApiCall)));
            }
            this.lastApiCall = Date.now();
            this.apiCallCount++;
            
            const { latitude, longitude } = this.userLocation;
            
            console.log(`🌤️ Fetching weather data (call #${this.apiCallCount})...`);
            
            // Fetch current weather
            const currentResponse = await fetch(
                `${this.baseURL}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=${this.isUSLocation ? 'imperial' : 'metric'}`
            );
            
            if (!currentResponse.ok) {
                const errorText = await currentResponse.text();
                console.error('🌤️ Weather API error details:', {
                    status: currentResponse.status,
                    statusText: currentResponse.statusText,
                    response: errorText,
                    url: currentResponse.url
                });
                throw new Error(`Weather API error: ${currentResponse.status} - ${errorText}`);
            }
            
            const currentData = await currentResponse.json();
            
            // Fetch 5-day forecast
            const forecastResponse = await fetch(
                `${this.baseURL}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=${this.isUSLocation ? 'imperial' : 'metric'}`
            );
            
            let forecastData = null;
            if (forecastResponse.ok) {
                forecastData = await forecastResponse.json();
            }
            
            // Process and return weather data
            return this.processWeatherData(currentData, forecastData);
            
        } catch (error) {
            console.error('Real weather API failed:', error);
            return null;
        }
    }
    
    processWeatherData(currentData, forecastData) {
        // Convert OpenWeatherMap data to our format
        const condition = this.mapWeatherCondition(currentData.weather[0].main, currentData.weather[0].description);
        
        const processedData = {
            temperature: currentData.main.temp,
            condition: condition,
            humidity: currentData.main.humidity,
            windSpeed: currentData.wind.speed,
            description: currentData.weather[0].description,
            icon: this.getWeatherIcon(currentData.weather[0].main),
            name: this.weatherConditions[condition]?.name || condition,
            ...this.weatherConditions[condition]
        };
        
        // Process forecast if available
        if (forecastData) {
            this.forecastData = this.processForecastData(forecastData);
        }
        
        // Generate daily temperatures from real data
        this.dailyTemperatures = this.generateRealDailyTemperatures(currentData, forecastData);
        
        return processedData;
    }
    
    mapWeatherCondition(main, description) {
        const conditionMap = {
            'Clear': 'sunny',
            'Clouds': description.includes('few') || description.includes('scattered') ? 'partly-cloudy' : 'cloudy',
            'Rain': 'rainy',
            'Drizzle': 'rainy',
            'Thunderstorm': 'rainy',
            'Snow': 'rainy',
            'Mist': 'cloudy',
            'Fog': 'cloudy',
            'Haze': 'cloudy'
        };
        
        return conditionMap[main] || 'sunny';
    }
    
    getWeatherIcon(main) {
        const iconMap = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌧️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Fog': '🌫️',
            'Haze': '🌫️'
        };
        
        return iconMap[main] || '☀️';
    }
    
    processForecastData(forecastData) {
        // Group forecast by day and get daily summaries
        const dailyForecast = {};
        
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000).toDateString();
            if (!dailyForecast[date]) {
                dailyForecast[date] = {
                    temps: [],
                    conditions: [],
                    icons: []
                };
            }
            dailyForecast[date].temps.push(item.main.temp);
            dailyForecast[date].conditions.push(item.weather[0].main);
            dailyForecast[date].icons.push(this.getWeatherIcon(item.weather[0].main));
        });
        
        // Convert to our forecast format
        const forecast = [];
        const dayNames = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
        let dayIndex = 0;
        
        Object.keys(dailyForecast).slice(0, 5).forEach(date => {
            const dayData = dailyForecast[date];
            const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
            const mostCommonCondition = this.getMostCommonCondition(dayData.conditions);
            
            forecast.push({
                day: dayNames[dayIndex] || `Day ${dayIndex + 1}`,
                temp: Math.round(avgTemp),
                condition: this.mapWeatherCondition(mostCommonCondition, ''),
                icon: this.getWeatherIcon(mostCommonCondition)
            });
            dayIndex++;
        });
        
        return forecast;
    }
    
    getMostCommonCondition(conditions) {
        const counts = {};
        conditions.forEach(condition => {
            counts[condition] = (counts[condition] || 0) + 1;
        });
        
        return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    }
    
    generateRealDailyTemperatures(currentData, forecastData) {
        // Generate hourly temperatures based on real data
        const currentHour = new Date().getHours();
        const baseTemp = currentData.main.temp;
        const hourlyTemps = [];
        
        // Use forecast data to get more accurate hourly predictions
        if (forecastData && forecastData.list) {
            forecastData.list.slice(0, 24).forEach((item, index) => {
                const hour = (currentHour + index) % 24;
                hourlyTemps.push({
                    hour: hour,
                    time: `${hour.toString().padStart(2, '0')}:00`,
                    temperature: Math.round(item.main.temp),
                    condition: this.mapWeatherCondition(item.weather[0].main, item.weather[0].description)
                });
            });
        } else {
            // Fallback to generated data if no forecast
            return this.generateDailyTemperatureData();
        }
        
        return hourlyTemps;
    }
    
    saveWeatherData() {
        const weatherEntry = {
            date: new Date().toISOString().split('T')[0],
            weather: this.currentWeather,
            timestamp: new Date()
        };
        
        this.weatherHistory.push(weatherEntry);
        
        // Keep only last 30 days
        if (this.weatherHistory.length > 30) {
            this.weatherHistory = this.weatherHistory.slice(-30);
        }
        
        localStorage.setItem('weather-history', JSON.stringify(this.weatherHistory));
    }
    
    loadWeatherHistory() {
        const stored = localStorage.getItem('weather-history');
        if (stored) {
            this.weatherHistory = JSON.parse(stored).map(entry => ({
                ...entry,
                timestamp: new Date(entry.timestamp)
            }));
        }
        
        // Load mood correlation data
        const moodCorrelation = localStorage.getItem('mood-weather-correlation');
        if (moodCorrelation) {
            this.moodWeatherCorrelation = JSON.parse(moodCorrelation);
        }
    }
    
    generateWeatherRecommendations() {
        if (!this.currentWeather) return;
        
        const recommendations = {
            weather: this.currentWeather,
            suggestions: this.getWeatherSuggestions(),
            moodImpact: this.analyzeMoodImpact(),
            activityRecommendations: this.getActivityRecommendations()
        };
        
        this.displayWeatherRecommendations(recommendations);
        return recommendations;
    }
    
    getWeatherSuggestions() {
        const condition = this.currentWeather.condition;
        const weatherData = this.weatherConditions[condition];
        
        return {
            primary: weatherData.recommendations[0],
            secondary: weatherData.recommendations.slice(1),
            mood: weatherData.mood,
            activities: weatherData.activitySuggestions
        };
    }
    
    analyzeMoodImpact() {
        // Analyze how weather affects user's mood based on historical data
        const condition = this.currentWeather.condition;
        
        if (this.moodWeatherCorrelation[condition]) {
            return {
                impact: this.moodWeatherCorrelation[condition].impact,
                confidence: this.moodWeatherCorrelation[condition].confidence,
                description: `Weather typically makes you feel ${this.moodWeatherCorrelation[condition].impact}`
            };
        }
        
        // Default impact based on weather condition
        const defaultImpacts = {
            sunny: { impact: 'more positive', confidence: 'medium' },
            rainy: { impact: 'more reflective', confidence: 'medium' },
            cloudy: { impact: 'more focused', confidence: 'low' },
            'partly-cloudy': { impact: 'more balanced', confidence: 'low' }
        };
        
        return defaultImpacts[condition] || { impact: 'neutral', confidence: 'low' };
    }
    
    getActivityRecommendations() {
        const condition = this.currentWeather.condition;
        const suggestions = this.weatherConditions[condition].activitySuggestions;
        
        return suggestions.map(activity => ({
            activity,
            reason: this.getActivityReason(activity, condition),
            priority: this.getActivityPriority(activity, condition)
        }));
    }
    
    getActivityReason(activity, condition) {
        const reasons = {
            'outdoor meditation': 'Fresh air and natural sounds enhance mindfulness',
            'indoor meditation': 'Peaceful indoor environment for deep focus',
            'morning walk': 'Gentle movement in pleasant weather',
            'deep journaling': 'Reflective weather supports introspection',
            'gratitude practice': 'Positive weather enhances appreciation',
            'focused meditation': 'Stable weather conditions aid concentration'
        };
        
        return reasons[activity] || 'Weather conditions support this activity';
    }
    
    getActivityPriority(activity, condition) {
        // Determine priority based on weather suitability
        const priorities = {
            sunny: { 'outdoor meditation': 'high', 'morning walk': 'high', 'gratitude practice': 'medium' },
            rainy: { 'indoor meditation': 'high', 'deep journaling': 'high', 'listening to rain sounds': 'high' },
            cloudy: { 'focused meditation': 'high', 'structured journaling': 'high', 'goal review': 'medium' },
            'partly-cloudy': { 'varied meditation': 'medium', 'creative journaling': 'medium', 'flexible routine': 'medium' }
        };
        
        return priorities[condition]?.[activity] || 'low';
    }
    
    displayWeatherRecommendations(recommendations) {
        // Create weather widget
        this.createWeatherWidget(recommendations);
        
        // Show contextual recommendations
        this.showContextualRecommendations(recommendations);
    }
    
    createWeatherWidget(recommendations) {
        // Remove existing widget
        const existingWidget = document.getElementById('weather-widget');
        if (existingWidget) {
            existingWidget.remove();
        }
        
        const widget = document.createElement('div');
        widget.id = 'weather-widget';
        
        // Enhanced responsive positioning with better spacing
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        const isDesktop = window.innerWidth >= 1024;
        
        let positionClass = 'fixed top-20 left-4 z-40';
        if (isMobile) {
            positionClass = 'fixed top-20 left-2 right-2 z-40';
        } else if (isTablet) {
            positionClass = 'fixed top-20 left-4 z-40 max-w-sm';
        } else if (isDesktop) {
            positionClass = 'fixed top-20 right-4 z-40 max-w-xs';
        }
        
        widget.className = `weather-widget ${positionClass} z-30 bg-white/95 backdrop-blur-sm border border-sage-deep/20 rounded-lg p-3 sm:p-4 shadow-lg transition-all duration-300`;
        
        // Get daily temperature range from real data or fallback to mock
        const dailyTemps = this.dailyTemperatures || this.mockWeatherData.dailyTemperatures;
        const minTemp = Math.min(...dailyTemps.map(t => t.temperature));
        const maxTemp = Math.max(...dailyTemps.map(t => t.temperature));
        const currentHour = new Date().getHours();
        const currentTemp = dailyTemps[currentHour]?.temperature || recommendations.weather.temperature;

        widget.innerHTML = `
            <div class="weather-content">
                <div class="weather-header flex items-center justify-between mb-3">
                    <div class="weather-info">
                        <div class="weather-icon text-2xl">${recommendations.weather.icon}</div>
                        <div class="weather-temp text-lg font-semibold text-forest-deep">${this.formatTemperature(currentTemp)}</div>
                        <div class="temp-range text-xs text-charcoal/60">
                            ${this.formatTemperature(minTemp)} - ${this.formatTemperature(maxTemp)}
                        </div>
                    </div>
                    <div class="weather-details text-right">
                        <div class="weather-condition text-sm font-medium text-charcoal capitalize">${recommendations.weather.name}</div>
                        <div class="weather-description text-xs text-charcoal/60">${recommendations.weather.description}</div>
                        <div class="location-info text-xs text-sage-deep mt-1">
                            ${this.isUSLocation ? '🇺🇸 US' : '🌍 International'}
                        </div>
                    </div>
                </div>
                
                <div class="temperature-graph mb-3">
                    <div class="graph-title text-xs font-medium text-charcoal mb-2">Today's Temperature</div>
                    <div class="graph-container h-12 bg-sage-pale/20 rounded-lg p-2 relative overflow-hidden">
                        ${this.createTemperatureGraph()}
                    </div>
                </div>
                
                <div class="weather-recommendation">
                    <div class="recommendation-text text-sm text-forest-deep mb-2 font-medium">
                        🌸 ${recommendations.suggestions.primary}
                    </div>
                    <div class="mood-impact text-xs text-sage-deep italic">
                        ✨ ${recommendations.moodImpact.description}
                    </div>
                </div>
                
                <div class="weather-actions mt-3 flex flex-wrap gap-2">
                    <button class="weather-refresh text-xs text-sage-deep hover:text-forest-deep transition-colors px-2 py-1 rounded-md hover:bg-sage-pale/30">
                        🔄 Refresh
                    </button>
                    <button class="weather-details-btn text-xs text-sage-deep hover:text-forest-deep transition-colors px-2 py-1 rounded-md hover:bg-sage-pale/30">
                        📊 Details
                    </button>
                    <button class="weather-graph-btn text-xs text-sage-deep hover:text-forest-deep transition-colors px-2 py-1 rounded-md hover:bg-sage-pale/30">
                        📈 Graph
                    </button>
                    <button class="weather-minimize-btn text-xs text-sage-deep hover:text-forest-deep transition-colors px-2 py-1 rounded-md hover:bg-sage-pale/30">
                        ➖ Minimize
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Add event listeners
        widget.querySelector('.weather-refresh').addEventListener('click', () => {
            this.refreshWeather();
        });
        
        widget.querySelector('.weather-details-btn').addEventListener('click', () => {
            // If using default location, request permission
            if (this.userLocation && this.userLocation.latitude === 37.7749 && this.requestLocationPermission) {
                this.requestLocationPermission();
            }
            this.showWeatherDetails();
        });
        
        widget.querySelector('.weather-graph-btn').addEventListener('click', () => {
            this.showTemperatureGraph();
        });
        
        widget.querySelector('.weather-minimize-btn').addEventListener('click', () => {
            this.toggleWeatherWidget();
        });
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (widget.parentNode) {
                widget.style.opacity = '0.7';
            }
        }, 10000);
        
        // Handle window resize for responsive positioning
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            const isDesktop = window.innerWidth >= 1024;
            
            let positionClass = 'fixed top-20 left-4 z-40';
            if (isMobile) {
                positionClass = 'fixed top-20 left-2 right-2 z-40';
            } else if (isTablet) {
                positionClass = 'fixed top-20 left-4 z-40 max-w-sm';
            } else if (isDesktop) {
                positionClass = 'fixed top-20 right-4 z-40 max-w-xs';
            }
            
            // Update classes while preserving other styling
            const baseClasses = 'weather-widget bg-white/95 backdrop-blur-sm border border-sage-deep/20 rounded-lg p-3 sm:p-4 shadow-lg transition-all duration-300';
            widget.className = `${positionClass} ${baseClasses}`;
        };
        
        window.addEventListener('resize', handleResize);
        
        // Clean up resize listener when widget is removed
        const originalRemove = widget.remove;
        widget.remove = function() {
            window.removeEventListener('resize', handleResize);
            originalRemove.call(this);
        };
    }
    
    toggleWeatherWidget() {
        const widget = document.getElementById('weather-widget');
        if (!widget) return;
        
        const isMinimized = widget.classList.contains('minimized');
        
        if (isMinimized) {
            // Restore full widget
            widget.classList.remove('minimized');
            widget.style.height = 'auto';
            widget.style.overflow = 'visible';
            const minimizeBtn = widget.querySelector('.weather-minimize-btn');
            if (minimizeBtn) {
                minimizeBtn.textContent = '➖ Minimize';
            }
        } else {
            // Minimize to just temperature
            widget.classList.add('minimized');
            widget.style.height = '60px';
            widget.style.overflow = 'hidden';
            const minimizeBtn = widget.querySelector('.weather-minimize-btn');
            if (minimizeBtn) {
                minimizeBtn.textContent = '➕ Expand';
            }
        }
    }
    
    showContextualRecommendations(recommendations) {
        // Show recommendations based on current page
        document.addEventListener('pageChanged', (e) => {
            this.showPageSpecificRecommendations(e.detail.page, recommendations);
        });
        
        // Show for current page
        const currentPage = document.body.dataset.currentPage || 'home';
        this.showPageSpecificRecommendations(currentPage, recommendations);
    }
    
    showPageSpecificRecommendations(page, recommendations) {
        const highPriorityActivities = recommendations.activityRecommendations
            .filter(rec => rec.priority === 'high')
            .map(rec => rec.activity);
        
        let pageRecommendation = '';
        
        switch (page) {
            case 'timer':
                if (highPriorityActivities.includes('outdoor meditation')) {
                    pageRecommendation = '🌤️ Perfect weather for outdoor meditation! Consider moving outside.';
                } else if (highPriorityActivities.includes('indoor meditation')) {
                    pageRecommendation = '🏠 Cozy indoor meditation recommended today.';
                }
                break;
                
            case 'journal':
                if (highPriorityActivities.includes('deep journaling')) {
                    pageRecommendation = '📝 Weather supports deep reflection today.';
                } else if (highPriorityActivities.includes('creative journaling')) {
                    pageRecommendation = '✨ Creative energy in the air - perfect for expressive writing.';
                }
                break;
                
            case 'gratitude':
                if (recommendations.weather.condition === 'sunny') {
                    pageRecommendation = '☀️ Bright weather amplifies gratitude practice.';
                }
                break;
        }
        
        if (pageRecommendation) {
            this.showRecommendationMessage(pageRecommendation);
        }
    }
    
    showRecommendationMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'weather-recommendation-message fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-gradient-to-r from-sage-pale/95 to-forest-pale/95 backdrop-blur-sm border border-sage-deep/30 rounded-lg px-4 py-2 shadow-lg transition-all duration-300';
        messageDiv.innerHTML = `
            <div class="recommendation-content text-sm text-forest-deep font-medium">
                ${message}
            </div>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Animate in
        messageDiv.style.animation = 'slideInDown 0.5s ease-out';
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.animation = 'slideOutUp 0.3s ease-in';
                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    async refreshWeather() {
        const widget = document.getElementById('weather-widget');
        if (widget) {
            widget.style.opacity = '0.5';
        }
        
        await this.getCurrentWeather();
        
        if (widget) {
            widget.style.opacity = '1';
        }
    }
    
    showWeatherDetails() {
        const detailsModal = document.createElement('div');
        detailsModal.className = 'weather-details-modal fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        
        detailsModal.innerHTML = `
            <div class="modal-content bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <div class="modal-header flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-forest-deep">Weather Details</h2>
                    <button class="close-modal text-sage-deep hover:text-forest-deep text-xl">×</button>
                </div>
                
                <div class="weather-details-content space-y-4">
                    <div class="current-weather">
                        <h3 class="text-lg font-semibold text-forest-deep mb-3">Current Conditions</h3>
                        <div class="weather-grid grid grid-cols-2 gap-4">
                            <div class="weather-item">
                                <div class="text-3xl mb-2">${this.currentWeather.icon}</div>
                                <div class="text-2xl font-bold text-sage-deep">${this.formatTemperature(this.currentWeather.temperature)}</div>
                                <div class="text-sm text-charcoal/60">Temperature</div>
                            </div>
                            <div class="weather-item">
                                <div class="text-2xl font-semibold text-forest-deep capitalize">${this.currentWeather.name}</div>
                                <div class="text-sm text-charcoal/60">Condition</div>
                            </div>
                            <div class="weather-item">
                                <div class="text-lg font-semibold text-sage-deep">${this.currentWeather.humidity}%</div>
                                <div class="text-sm text-charcoal/60">Humidity</div>
                            </div>
                            <div class="weather-item">
                                <div class="text-lg font-semibold text-sage-deep">${this.currentWeather.windSpeed} mph</div>
                                <div class="text-sm text-charcoal/60">Wind Speed</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="forecast-section">
                        <h3 class="text-lg font-semibold text-forest-deep mb-3">5-Day Forecast</h3>
                        <div class="forecast-list space-y-2">
                            ${(this.forecastData || this.mockWeatherData.forecast).map(day => `
                                <div class="forecast-item flex items-center justify-between p-2 bg-sage-pale/30 rounded-lg">
                                    <div class="flex items-center">
                                        <span class="text-lg mr-3">${day.icon}</span>
                                        <span class="text-sm font-medium text-forest-deep">${day.day}</span>
                                    </div>
                                    <div class="text-sm text-sage-deep font-semibold">${this.formatTemperature(day.temp)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="recommendations-section">
                        <h3 class="text-lg font-semibold text-forest-deep mb-3">Today's Recommendations</h3>
                        <div class="recommendations-list space-y-2">
                            ${this.getWeatherSuggestions().secondary.map(rec => `
                                <div class="recommendation-item text-sm text-charcoal/80 p-2 bg-sage-pale/20 rounded">
                                    • ${rec}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(detailsModal);
        
        // Add event listeners
        detailsModal.querySelector('.close-modal').addEventListener('click', () => {
            detailsModal.remove();
        });
        
        detailsModal.addEventListener('click', (e) => {
            if (e.target === detailsModal) {
                detailsModal.remove();
            }
        });
    }
    
    showTemperatureGraph() {
        const dailyTemps = this.dailyTemperatures || this.mockWeatherData.dailyTemperatures;
        const minTemp = Math.min(...dailyTemps.map(t => t.temperature));
        const maxTemp = Math.max(...dailyTemps.map(t => t.temperature));
        const currentHour = new Date().getHours();
        
        const graphModal = document.createElement('div');
        graphModal.className = 'temperature-graph-modal fixed inset-0 bg-black/50 flex items-center justify-center z-50';
        
        graphModal.innerHTML = `
            <div class="modal-content bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div class="modal-header flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-forest-deep">24-Hour Temperature Graph</h2>
                    <button class="close-modal text-sage-deep hover:text-forest-deep text-xl">×</button>
                </div>
                
                <div class="graph-content">
                    <div class="graph-info mb-4">
                        <div class="flex items-center justify-between text-sm text-charcoal/60">
                            <span>Temperature Range: ${this.formatTemperature(minTemp)} - ${this.formatTemperature(maxTemp)}</span>
                            <span>Current: ${this.formatTemperature(dailyTemps[currentHour]?.temperature || 0)}</span>
                        </div>
                    </div>
                    
                    <div class="large-graph-container bg-sage-pale/20 rounded-lg p-4 mb-4">
                        <svg width="100%" height="300" viewBox="0 0 800 300" class="w-full">
                            ${this.createLargeTemperatureGraph(dailyTemps, minTemp, maxTemp, currentHour)}
                        </svg>
                    </div>
                    
                    <div class="hourly-breakdown">
                        <h3 class="text-lg font-semibold text-forest-deep mb-3">Hourly Breakdown</h3>
                        <div class="grid grid-cols-4 md:grid-cols-6 gap-2">
                            ${dailyTemps.map(tempData => `
                                <div class="hour-item p-2 bg-sage-pale/30 rounded-lg text-center ${tempData.hour === currentHour ? 'ring-2 ring-forest-deep bg-forest-pale/50' : ''}">
                                    <div class="text-xs font-medium text-charcoal">${tempData.time}</div>
                                    <div class="text-sm font-semibold text-sage-deep">${this.formatTemperature(tempData.temperature)}</div>
                                    <div class="text-xs text-charcoal/60 capitalize">${tempData.condition.replace('-', ' ')}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(graphModal);
        
        // Add event listeners
        graphModal.querySelector('.close-modal').addEventListener('click', () => {
            graphModal.remove();
        });
        
        graphModal.addEventListener('click', (e) => {
            if (e.target === graphModal) {
                graphModal.remove();
            }
        });
    }
    
    createLargeTemperatureGraph(dailyTemps, minTemp, maxTemp, currentHour) {
        const width = 800;
        const height = 300;
        const padding = 40;
        
        let pathData = '';
        let points = '';
        let hourLabels = '';
        
        dailyTemps.forEach((tempData, index) => {
            const x = (index / 23) * (width - padding * 2) + padding;
            const normalizedTemp = (tempData.temperature - minTemp) / (maxTemp - minTemp);
            const y = height - (normalizedTemp * (height - padding * 2)) - padding;
            
            if (index === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
            
            // Add hour labels
            if (index % 4 === 0) {
                hourLabels += `<text x="${x}" y="${height - 10}" text-anchor="middle" class="text-xs fill-charcoal/60">${tempData.time}</text>`;
            }
            
            // Add current hour indicator
            if (tempData.hour === currentHour) {
                points += `<circle cx="${x}" cy="${y}" r="6" fill="#2D5A27" stroke="white" stroke-width="2"/>`;
                points += `<text x="${x}" y="${y - 15}" text-anchor="middle" class="text-sm font-semibold fill-forest-deep">${this.formatTemperature(tempData.temperature)}</text>`;
            }
        });
        
        // Add temperature scale
        const tempScale = this.generateTemperatureScale(minTemp, maxTemp, height, padding);
        
        return `
            <defs>
                <linearGradient id="largeTempGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#7BA05B;stop-opacity:0.6" />
                    <stop offset="100%" style="stop-color:#7BA05B;stop-opacity:0.1" />
                </linearGradient>
            </defs>
            
            <!-- Grid lines -->
            ${this.createGridLines(width, height, padding, minTemp, maxTemp)}
            
            <!-- Temperature scale -->
            ${tempScale}
            
            <!-- Graph line -->
            <path d="${pathData}" stroke="#2D5A27" stroke-width="3" fill="none" opacity="0.8"/>
            <path d="${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z" stroke="#7BA05B" stroke-width="1" fill="url(#largeTempGradient)" opacity="0.3"/>
            
            <!-- Hour labels -->
            ${hourLabels}
            
            <!-- Points -->
            ${points}
        `;
    }
    
    generateTemperatureScale(minTemp, maxTemp, height, padding) {
        const tempRange = maxTemp - minTemp;
        const scaleSteps = 5;
        let scale = '';
        
        for (let i = 0; i <= scaleSteps; i++) {
            const temp = minTemp + (tempRange * i / scaleSteps);
            const y = height - padding - (i / scaleSteps) * (height - padding * 2);
            
            scale += `<line x1="${padding - 5}" y1="${y}" x2="${padding}" y2="${y}" stroke="#7BA05B" stroke-width="1"/>`;
            scale += `<text x="${padding - 10}" y="${y + 5}" text-anchor="end" class="text-xs fill-charcoal/60">${this.formatTemperature(temp)}</text>`;
        }
        
        return scale;
    }
    
    createGridLines(width, height, padding, minTemp, maxTemp) {
        const gridLines = 4;
        let grid = '';
        
        // Horizontal grid lines
        for (let i = 1; i < gridLines; i++) {
            const y = padding + (i / gridLines) * (height - padding * 2);
            grid += `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#7BA05B" stroke-width="0.5" opacity="0.3"/>`;
        }
        
        // Vertical grid lines (every 4 hours)
        for (let i = 1; i < 6; i++) {
            const x = padding + (i * 4 / 23) * (width - padding * 2);
            grid += `<line x1="${x}" y1="${padding}" x2="${x}" y2="${height - padding}" stroke="#7BA05B" stroke-width="0.5" opacity="0.3"/>`;
        }
        
        return grid;
    }
    
    trackMoodWeatherCorrelation(mood, activity) {
        if (!this.currentWeather) return;
        
        const condition = this.currentWeather.condition;
        
        if (!this.moodWeatherCorrelation[condition]) {
            this.moodWeatherCorrelation[condition] = {
                moods: [],
                activities: [],
                count: 0
            };
        }
        
        this.moodWeatherCorrelation[condition].moods.push(mood);
        this.moodWeatherCorrelation[condition].activities.push(activity);
        this.moodWeatherCorrelation[condition].count++;
        
        // Calculate correlation
        this.calculateMoodWeatherCorrelation(condition);
        
        // Save correlation data
        localStorage.setItem('mood-weather-correlation', JSON.stringify(this.moodWeatherCorrelation));
    }
    
    calculateMoodWeatherCorrelation(condition) {
        const data = this.moodWeatherCorrelation[condition];
        if (data.count < 5) return; // Need at least 5 data points
        
        // Simple correlation analysis
        const moodCounts = {};
        data.moods.forEach(mood => {
            moodCounts[mood] = (moodCounts[mood] || 0) + 1;
        });
        
        const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
            moodCounts[a] > moodCounts[b] ? a : b
        );
        
        const confidence = Math.min(data.count / 20, 1); // Max confidence at 20 data points
        
        data.impact = dominantMood;
        data.confidence = confidence > 0.3 ? 'high' : confidence > 0.1 ? 'medium' : 'low';
    }
    
    setupWeatherEvents() {
        // Listen for mood changes
        document.addEventListener('emotionSelected', (e) => {
            this.trackMoodWeatherCorrelation(e.detail.emotion, 'emotion_selection');
        });
        
        // Listen for activity completions
        document.addEventListener('activityCompleted', (e) => {
            this.trackMoodWeatherCorrelation('positive', e.detail.activity);
        });
        
        // Auto-refresh weather every 30 minutes
        setInterval(() => {
            this.refreshWeather();
        }, 30 * 60 * 1000);
    }
    
    getWeatherInsights() {
        if (this.weatherHistory.length < 7) {
            return { message: 'Need more data for weather insights' };
        }
        
        const recentWeather = this.weatherHistory.slice(-7);
        const conditions = recentWeather.map(entry => entry.weather.condition);
        
        const mostCommon = conditions.reduce((a, b, i, arr) =>
            arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        );
        
        return {
            mostCommonCondition: mostCommon,
            recentPattern: this.analyzeRecentPattern(recentWeather),
            moodCorrelation: this.moodWeatherCorrelation,
            recommendations: this.getLongTermRecommendations()
        };
    }
    
    analyzeRecentPattern(weatherData) {
        const conditions = weatherData.map(entry => entry.weather.condition);
        const uniqueConditions = [...new Set(conditions)];
        
        if (uniqueConditions.length === 1) {
            return `Consistent ${uniqueConditions[0]} weather`;
        } else if (uniqueConditions.length <= 3) {
            return `Mixed weather with ${uniqueConditions.join(', ')}`;
        } else {
            return 'Highly variable weather patterns';
        }
    }
    
    getLongTermRecommendations() {
        const insights = this.getWeatherInsights();
        const recommendations = [];
        
        if (insights.mostCommonCondition === 'sunny') {
            recommendations.push('Consider establishing outdoor meditation habits');
        } else if (insights.mostCommonCondition === 'rainy') {
            recommendations.push('Rainy weather supports indoor reflection practices');
        }
        
        return recommendations;
    }
}

// Expose WeatherIntegration to global scope
window.WeatherIntegration = WeatherIntegration;

// Initialize weather integration
document.addEventListener('DOMContentLoaded', () => {
    window.weatherIntegration = new WeatherIntegration();
    
    // ✅ OpenWeatherMap API key is configured and ready!
    // Real weather data will be fetched automatically
    
    // Load weather on app start
    setTimeout(() => {
        window.weatherIntegration.getCurrentWeather();
    }, 2000);
});
