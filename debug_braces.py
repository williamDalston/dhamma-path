#!/usr/bin/env python3
"""
JavaScript Brace Debugger for index.html
This script analyzes the JavaScript code in index.html to find:
1. Missing closing braces
2. Indentation issues
3. Unmatched braces
4. Function/block structure problems
"""

import re
import sys

def analyze_javascript_braces(file_path):
    """Analyze JavaScript braces and indentation in the HTML file"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the main script section (the one with the marker)
    script_marker = content.find('// --- SIMPLIFIED WORKING JAVASCRIPT --- //')
    if script_marker == -1:
        print("❌ Could not find JavaScript marker")
        return
    
    # Find the script tag that contains the marker
    script_start = content.rfind('<script>', 0, script_marker)
    if script_start == -1:
        print("❌ Could not find script tag containing marker")
        return
    
    script_end = content.find('</script>', script_start)
    if script_end == -1:
        print("❌ Could not find closing script tag")
        return
    
    script_content = content[script_start:script_end]
    lines = script_content.split('\n')
    
    print("🔍 JavaScript Brace Analysis")
    print("=" * 50)
    
    # Track brace balance and indentation
    brace_stack = []
    brace_count = 0
    line_number = 0
    issues = []
    
    # Function/block tracking
    current_function = None
    function_stack = []
    
    for i, line in enumerate(lines):
        line_number = i + 1
        original_line = line
        line = line.strip()
        
        # Skip empty lines and comments
        if not line or line.startswith('//'):
            continue
            
        # Count braces in this line
        open_braces = line.count('{')
        close_braces = line.count('}')
        
        # Track function definitions
        if re.match(r'^\s*function\s+\w+\s*\(', line):
            func_name = re.search(r'function\s+(\w+)\s*\(', line)
            if func_name:
                current_function = func_name.group(1)
                function_stack.append((current_function, line_number))
                print(f"📝 Function: {current_function} (line {line_number})")
        
        # Track arrow functions
        elif '=>' in line and '{' in line:
            if 'function' in line or 'const' in line or 'let' in line or 'var' in line:
                func_name = "arrow_function"
                function_stack.append((func_name, line_number))
                print(f"📝 Arrow Function (line {line_number})")
        
        # Track object/array definitions
        elif re.match(r'^\s*(const|let|var)\s+\w+\s*=\s*\{', line):
            var_name = re.search(r'(const|let|var)\s+(\w+)\s*=', line)
            if var_name:
                current_function = f"object_{var_name.group(2)}"
                function_stack.append((current_function, line_number))
                print(f"📝 Object: {var_name.group(2)} (line {line_number})")
        
        # Track event listeners
        elif 'addEventListener' in line and '{' in line:
            current_function = "event_listener"
            function_stack.append((current_function, line_number))
            print(f"📝 Event Listener (line {line_number})")
        
        # Process braces
        for _ in range(open_braces):
            brace_count += 1
            brace_stack.append((line_number, current_function, 'open'))
        
        for _ in range(close_braces):
            brace_count -= 1
            if brace_stack:
                opened_line, opened_func, _ = brace_stack.pop()
                if opened_func != current_function and opened_func:
                    issues.append(f"⚠️  Line {line_number}: Closing brace may not match opening brace from line {opened_line} ({opened_func})")
            else:
                issues.append(f"❌ Line {line_number}: Extra closing brace")
        
        # Check for potential missing braces
        if brace_count < 0:
            issues.append(f"❌ Line {line_number}: Negative brace count: {brace_count}")
            break
        
        # Check indentation consistency
        if line and not line.startswith('//'):
            expected_indent = len(original_line) - len(original_line.lstrip())
            if expected_indent % 4 != 0 and expected_indent > 0:
                issues.append(f"⚠️  Line {line_number}: Inconsistent indentation (expected multiple of 4)")
    
    print(f"\n📊 Brace Analysis Results:")
    print(f"   Total opening braces: {script_content.count('{')}")
    print(f"   Total closing braces: {script_content.count('}')}")
    print(f"   Final brace count: {brace_count}")
    print(f"   Unclosed blocks: {len(brace_stack)}")
    
    if brace_count == 0:
        print("✅ Braces are balanced!")
    else:
        print(f"❌ Braces are NOT balanced! Difference: {brace_count}")
    
    # Show unclosed blocks
    if brace_stack:
        print(f"\n🔍 Unclosed blocks:")
        for line_num, func_name, _ in brace_stack:
            print(f"   Line {line_num}: {func_name}")
    
    # Show issues
    if issues:
        print(f"\n🚨 Issues found:")
        for issue in issues:
            print(f"   {issue}")
    else:
        print("\n✅ No major issues found!")
    
    # Show function structure
    print(f"\n📋 Function Structure:")
    for func_name, line_num in function_stack:
        print(f"   {func_name} (starts at line {line_num})")
    
    # Suggest fixes
    if brace_count > 0:
        print(f"\n💡 Suggested fixes:")
        print(f"   Add {brace_count} closing brace(s) to balance the code")
        if brace_stack:
            print(f"   Check these unclosed blocks:")
            for line_num, func_name, _ in brace_stack[-3:]:  # Show last 3
                print(f"     - {func_name} starting at line {line_num}")
    
    return brace_count, issues

if __name__ == "__main__":
    file_path = "index.html"
    try:
        brace_count, issues = analyze_javascript_braces(file_path)
        sys.exit(0 if brace_count == 0 else 1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)