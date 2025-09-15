/**
 * Init-Once Helper
 * Prevents double initialization during cache busting and hot reloads
 */

// tiny init-once helper
const __mods = (window.__mf ||= { mods: new Map() }).mods;

export function initOnce(name, fn) {
  if (__mods.has(name)) return __mods.get(name);
  const out = fn();
  __mods.set(name, out);
  return out;
}

// Cleanup helper
export function cleanupModule(name) {
  if (__mods.has(name)) {
    const module = __mods.get(name);
    if (module && typeof module.cleanup === 'function') {
      module.cleanup();
    }
    __mods.delete(name);
  }
}

// Cleanup all modules
export function cleanupAllModules() {
  __mods.forEach((module, name) => {
    if (module && typeof module.cleanup === 'function') {
      module.cleanup();
    }
  });
  __mods.clear();
}

// Global cleanup on page unload
window.addEventListener('beforeunload', cleanupAllModules);

// Export to global for non-module usage
window.initOnce = initOnce;
window.cleanupModule = cleanupModule;
window.cleanupAllModules = cleanupAllModules;
