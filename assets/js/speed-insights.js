/**
 * Vercel Speed Insights Integration
 * 
 * This module initializes Vercel Speed Insights for performance monitoring.
 * It uses the @vercel/speed-insights package to inject the analytics script.
 */

import { injectSpeedInsights } from '@vercel/speed-insights';

/**
 * Initialize Speed Insights
 * 
 * This is called automatically when the module loads.
 * Speed Insights will track Web Vitals and performance metrics.
 */
(function initSpeedInsights() {
  try {
    // Inject Speed Insights script
    // The script will only load in production environments on Vercel
    injectSpeedInsights({
      // Enable debug mode in development
      debug: false,
    });
  } catch (error) {
    // Fail silently if Speed Insights cannot be loaded
    console.debug('Speed Insights initialization failed:', error);
  }
})();
