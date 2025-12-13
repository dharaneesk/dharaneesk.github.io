// src/lib/analytics/analytics-init.ts
import { analyticsService } from './analytics-service';

export const initAnalytics = (
  enabled = true,
  apiEndpoints?: { saveUrl?: string; summaryUrl?: string }
) => {
  // Default to enabled in production, configurable in development
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const shouldEnable = isDevelopment ? enabled : (enabled && localStorage.getItem('analytics-enabled') !== 'false');
  
  // Configure API endpoints if provided
  if (apiEndpoints) {
    analyticsService.updateEndpoints(apiEndpoints);
  }
  
  if (shouldEnable && typeof window !== 'undefined') {
    // Start tracking
    analyticsService.startTracking();
    
    // Set up navigation tracking for client-side routing
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    // Override pushState to track client-side navigation
    history.pushState = function(state, title, url) {
      originalPushState.apply(this, [state, title, url]);
      trackRouteChange();
    };
    
    // Override replaceState to track client-side navigation
    history.replaceState = function(state, title, url) {
      originalReplaceState.apply(this, [state, title, url]);
      trackRouteChange();
    };
    
    // Track when the user navigates using browser back/forward buttons
    window.addEventListener('popstate', trackRouteChange);
    
    // Track route changes
    function trackRouteChange() {
      // This will call trackPageView internally
      analyticsService.startTracking();
    }
    
    // Log initialization
    console.log(`Analytics tracking initialized (${isDevelopment ? 'development' : 'production'} mode)`);
  } else {
    console.log(`Analytics tracking disabled (${isDevelopment ? 'development' : 'production'} mode)`);
  }
  
  return analyticsService;
};