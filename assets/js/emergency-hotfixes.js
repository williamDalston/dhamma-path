/* ====== MORNINGFLOW RUNTIME HOTFIXES ====== */

// 0) Guard: don't double-apply
if (!window.__mfHotfixesApplied) {
  window.__mfHotfixesApplied = true;

  console.log('🚨 Loading comprehensive MorningFlow hotfixes...');

  // 1) physicsAnimations API expected by MobilePerformanceOptimizer
  (function ensurePhysicsAPI() {
    const g = window;
    g.physicsAnimations = g.physicsAnimations || {};
    if (typeof g.physicsAnimations.setQuality !== 'function') {
      g.physicsAnimations.setQuality = function () {
        console.info('[Hotfix] physicsAnimations.setQuality() noop');
      };
    }
  })();

  // 2) Make classList.add tolerant of space-joined tokens (temporary, low risk).
  (function tolerantClassAdd() {
    const proto = DOMTokenList && DOMTokenList.prototype;
    if (!proto || proto.__mfPatched) return;
    const origAdd = proto.add;
    proto.add = function (...args) {
      // split any "foo bar/baz" into tokens while preserving slashed classes
      const flat = args.flatMap(a => String(a).trim().split(/\s+/)).filter(Boolean);
      return origAdd.apply(this, flat);
    };
    proto.__mfPatched = true;
  })();

  // 3) Web Audio must start after a gesture (Chrome autoplay policy)
  (function gateAudioContext() {
    const resume = () => {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        const ctx = window.__audioCtx || new Ctx();
        window.__audioCtx = ctx;
        if (ctx.state === 'suspended') ctx.resume();
      } catch {}
    };
    window.addEventListener('pointerdown', resume, { once: true, passive: true });
  })();

  // 4) ServiceWorker cache.addAll can fail whole batch; use resilient per-item add instead.
  window.__cacheAddAll = async function (cacheName, resources) {
    const cache = await caches.open(cacheName);
    for (const url of resources) {
      try { await cache.add(url); }
      catch (e) { console.warn('[SW] Skipping cache item:', url, e?.message); }
    }
  };

  // 5) Patch missing instance methods with safe no-ops so constructors don't throw.
  function patchMissing(ctor, methods) {
    if (!ctor || !ctor.prototype) return;
    for (const name of methods) {
      if (typeof ctor.prototype[name] !== 'function') {
        ctor.prototype[name] = function () {
          console.info(`[Hotfix] ${ctor.name}.${name}() noop`);
        };
      }
    }
  }
  try { patchMissing(window.AccessibilityEnhancer, ['applyReducedMotion']); } catch {}
  try { patchMissing(window.DataPersistenceSystem, ['setupAnalytics']); } catch {}
  try { patchMissing(window.ProgressVisualizationSystem, ['setupInsightsEngine']); } catch {}
  try { patchMissing(window.WeatherIntegration, ['setupWeatherRecommendations']); } catch {}
  try { patchMissing(window.VisualPolish, ['setupStateTransitions']); } catch {}
  try { patchMissing(window.ProductionPolish, ['setupBreakReminder']); } catch {}

  // 6) New: A/B framework method missing
  try {
    patchMissing(window.ABTestingFramework, ['trackExperimentInteraction']);
    if (window.ABTestingFramework?.prototype?.trackExperimentInteraction.__mfShimmed !== true) {
      const orig = window.ABTestingFramework.prototype.trackExperimentInteraction;
      window.ABTestingFramework.prototype.trackExperimentInteraction = function (evt) {
        try {
          // If a real impl exists, call it
          if (orig && orig !== window.ABTestingFramework.prototype.trackExperimentInteraction) {
            return orig.call(this, evt);
          }
          // Minimal fallback
          const id = evt?.target?.dataset?.experimentId || 'unknown';
          this.analytics?.track?.('ab_interaction', { id, ts: Date.now() });
          console.info('[Hotfix] AB trackExperimentInteraction fallback used', id);
        } catch (e) {
          console.warn('[Hotfix] AB trackExperimentInteraction error', e);
        }
      };
      window.ABTestingFramework.prototype.trackExperimentInteraction.__mfShimmed = true;
    }
  } catch {}

  // 7) FocusManager missing global
  if (!window.FocusManager) {
    window.FocusManager = class {
      trap() {}
      release() {}
      moveToNext() {}
      moveToPrev() {}
    };
    console.info('[Hotfix] FocusManager fallback installed');
  }

  // 8) Additional mock classes for accessibility-polish.js
  window.ScreenReaderSupport = window.ScreenReaderSupport || class {
    constructor() { console.log('[Hotfix] Mock ScreenReaderSupport created'); }
    announce() { console.log('[Hotfix] ScreenReaderSupport.announce() - noop'); }
  };

  window.KeyboardNavigation = window.KeyboardNavigation || class {
    constructor() { console.log('[Hotfix] Mock KeyboardNavigation created'); }
    handleKey() { console.log('[Hotfix] KeyboardNavigation.handleKey() - noop'); }
  };

  window.ColorContrastChecker = window.ColorContrastChecker || class {
    constructor() { console.log('[Hotfix] Mock ColorContrastChecker created'); }
    check() { console.log('[Hotfix] ColorContrastChecker.check() - noop'); }
  };

  window.MotionPreferences = window.MotionPreferences || class {
    constructor() { console.log('[Hotfix] Mock MotionPreferences created'); }
    apply() { console.log('[Hotfix] MotionPreferences.apply() - noop'); }
  };

  console.log('✅ Comprehensive MorningFlow hotfixes loaded successfully');
}
