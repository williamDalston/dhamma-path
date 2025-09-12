#!/usr/bin/env python3
"""
Timer Debug Script for index.html
This script checks if the timer elements exist and are properly configured
"""

import re

def debug_timer_elements(file_path):
    """Debug timer elements in the HTML file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("🔍 Timer Elements Debug")
    print("=" * 50)
    
    # Check if timer template exists
    timer_template = content.find('<template id="template-timer">')
    if timer_template != -1:
        print("✅ Timer template exists")
    else:
        print("❌ Timer template not found")
        return
    
    # Check timer elements
    timer_elements = [
        'timer-start-btn',
        'timer-pause-btn', 
        'timer-reset-btn',
        'timer-display',
        'timer-status',
        'timer-duration',
        'timer-sound',
        'progress-ring'
    ]
    
    print("\n📋 Timer Elements Check:")
    for element_id in timer_elements:
        pattern = f'id="{element_id}"'
        if pattern in content:
            print(f"✅ {element_id} found")
        else:
            print(f"❌ {element_id} NOT found")
    
    # Check timer JavaScript functions
    js_functions = [
        'function attachTimerLogic',
        'function attachTimerEventListeners',
        'function startTimer',
        'function pauseTimer',
        'function resetTimer',
        'function updateDisplay'
    ]
    
    print("\n📋 Timer JavaScript Functions:")
    for func in js_functions:
        if func in content:
            print(f"✅ {func} found")
        else:
            print(f"❌ {func} NOT found")
    
    # Check if timer is in page logic handlers
    page_handlers = content.find("'timer': attachTimerLogic")
    if page_handlers != -1:
        print("✅ Timer handler is registered")
    else:
        print("❌ Timer handler NOT registered")
    
    # Check timer template content
    template_start = content.find('<template id="template-timer">')
    template_end = content.find('</template>', template_start)
    if template_start != -1 and template_end != -1:
        template_content = content[template_start:template_end]
        print(f"\n📋 Timer Template Content ({len(template_content)} characters)")
        
        # Check for key elements in template
        if 'timer-start-btn' in template_content:
            print("✅ Start button in template")
        else:
            print("❌ Start button NOT in template")
            
        if 'timer-display' in template_content:
            print("✅ Timer display in template")
        else:
            print("❌ Timer display NOT in template")
    
    # Check for potential issues
    print("\n🚨 Potential Issues:")
    
    # Check for multiple timer duration elements
    timer_duration_count = content.count('id="timer-duration"')
    if timer_duration_count > 1:
        print(f"⚠️  Multiple timer-duration elements found: {timer_duration_count}")
    
    # Check for timer initialization
    if 'attachTimerLogic' in content:
        print("✅ Timer initialization function exists")
    else:
        print("❌ Timer initialization function missing")
    
    # Check for console.log statements in timer code
    timer_logs = re.findall(r'console\.log\([^)]*timer[^)]*\)', content, re.IGNORECASE)
    print(f"\n📋 Timer Debug Logs Found: {len(timer_logs)}")
    for log in timer_logs[:3]:  # Show first 3
        print(f"   {log}")

if __name__ == "__main__":
    debug_timer_elements("index.html")

