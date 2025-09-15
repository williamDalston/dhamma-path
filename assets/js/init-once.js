/**
 * Init-Once Helper
 * Prevents double initialization during cache busting and hot reloads
 */

// Global app registry - load first, with defer or type="module"
window.DP = window.DP || {};              // global app registry
Object.seal(window.DP);                   // make accidental reassign obvious

// tiny init-once helper
const __mods = (window.__mf ||= { modules: new Map() }).modules;

function initOnce(name, fn) {
  if (__mods.has(name)) return __mods.get(name);
  const out = fn();
  __mods.set(name, out);
  return out;
}

// Cleanup helper
function cleanupModule(name) {
  if (__mods.has(name)) {
    const module = __mods.get(name);
    if (module && typeof module.cleanup === 'function') {
      module.cleanup();
    }
    __mods.delete(name);
  }
}

// Cleanup all modules
function cleanupAllModules() {
  __mods.forEach((module, name) => {
    if (module && typeof module.cleanup === 'function') {
      module.cleanup();
    }
  });
  __mods.clear();
}

// Global cleanup on page unload
window.addEventListener('beforeunload', cleanupAllModules);

// Wait for global function
function waitForGlobal(name, timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (window[name]) {
      resolve(window[name]);
      return;
    }
    
    const startTime = Date.now();
    const checkInterval = setInterval(() => {
      if (window[name]) {
        clearInterval(checkInterval);
        resolve(window[name]);
      } else if (Date.now() - startTime > timeout) {
        clearInterval(checkInterval);
        reject(new Error(`Global ${name} not found within ${timeout}ms`));
      }
    }, 100);
  });
}

// Export to global for non-module usage
window.initOnce = initOnce;
window.cleanupModule = cleanupModule;
window.cleanupAllModules = cleanupAllModules;
window.waitForGlobal = waitForGlobal;
