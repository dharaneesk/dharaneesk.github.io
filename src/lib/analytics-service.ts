// src/lib/analytics/analytics-service.ts
import { v4 as uuidv4 } from 'uuid';

// Types for analytics data
export interface PageView {
  path: string;
  timestamp: string;
}

export interface SessionData {
  id: string;
  startTime: string;
  duration: number;
}

export interface DeviceInfo {
  deviceCategory: string;
  browserCategory: string;
  screenSizeCategory: string;
}

export interface PageLoadTime {
  path: string;
  loadTime: number;
}

export interface Interaction {
  elementId: string;
  type: string;
  timestamp: string;
}

export interface AnalyticsPayload {
  pageViews: Record<string, PageView[]>;
  sessionData: SessionData;
  deviceInfo: DeviceInfo;
  pageLoadTimes: PageLoadTime;
  interactionCounts: Record<string, Interaction[]>;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  averageSessionDuration: number;
  topPages: { path: string; count: number }[];
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  screenSizeBreakdown: Record<string, number>;
  averagePageLoadTimes: Record<string, number>;
  topInteractions: { elementId: string; count: number }[];
  lastUpdated: string;
}

const DEFAULT_API_ENDPOINTS = {
    SAVE_ANALYTICS: import.meta.env.VITE_ANALYTICS_SAVE_URL || 'http://localhost:3001/save-analytics',
    GET_ANALYTICS_SUMMARY: import.meta.env.VITE_ANALYTICS_SUMMARY_URL || 'http://localhost:3001/get-analytics-summary',
  };

const API_KEY = import.meta.env.VITE_ANALYTICS_API_KEY || '';


class AnalyticsService {
  private sessionId: string;
  private sessionStartTime: Date;
  private pageViews: Record<string, PageView[]> = {};
  private interactionCounts: Record<string, Interaction[]> = {};
  private deviceInfo: DeviceInfo;
  private pageLoadTime: PageLoadTime | null = null;
  private isTracking: boolean = false;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private saveInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(data: AnalyticsSummary) => void> = new Set();
  private apiEndpoints = { ...DEFAULT_API_ENDPOINTS };
  private isDevelopment = process.env.NODE_ENV !== 'production';

  constructor() {
    this.sessionId = this.getSessionId();
    this.sessionStartTime = new Date();
    this.deviceInfo = this.detectDeviceInfo();
    
    // Register listeners only once
    if (typeof window !== 'undefined') {
      window.addEventListener('load', this.handlePageLoad);
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
  }

  // Update API endpoints
  public updateEndpoints(endpoints: { saveUrl?: string; summaryUrl?: string }): void {
    if (endpoints.saveUrl) {
      this.apiEndpoints.SAVE_ANALYTICS = endpoints.saveUrl;
    }
    if (endpoints.summaryUrl) {
      this.apiEndpoints.GET_ANALYTICS_SUMMARY = endpoints.summaryUrl;
    }

    console.log('Analytics endpoints updated:', this.apiEndpoints);
  }

  // Start tracking user activity
  public startTracking(): void {
    if (this.isTracking || typeof window === 'undefined') return;

    this.isTracking = true;
    this.trackPageView();

    // Set up listeners for user interactions
    document.addEventListener('click', this.handleInteraction);
    
    // Set up automatic saving every 5 minutes in production
    // or every 1 minute in development for easier testing
    const saveInterval = this.isDevelopment ? 60 * 1000 : 5 * 60 * 1000;
    
    this.saveInterval = setInterval(() => {
      this.saveAnalytics();
    }, saveInterval);
    
    console.log(`Analytics tracking started (${this.isDevelopment ? 'development' : 'production'} mode)`);
  }

  // Stop tracking user activity
  public stopTracking(): void {
    if (!this.isTracking || typeof window === 'undefined') return;

    this.isTracking = false;
    document.removeEventListener('click', this.handleInteraction);
    
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
    
    console.log('Analytics tracking stopped');
  }

  // Subscribe to analytics updates
  public subscribe(callback: (data: AnalyticsSummary) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Get analytics summary data
  public async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    try {
      console.log(`Fetching analytics summary from: ${this.apiEndpoints.GET_ANALYTICS_SUMMARY}`);
      
      const response = await fetch(this.apiEndpoints.GET_ANALYTICS_SUMMARY, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },

      });
      
      if (!response.ok) {
        throw new Error(`Failed to get analytics: ${response.statusText}`);
      }

      const data: AnalyticsSummary = await response.json();
      
      // Notify listeners about new data
      this.listeners.forEach(listener => listener(data));
      
      return data;
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      
      // In development, return mock data for easier testing
      if (this.isDevelopment) {
        console.log('Using mock data in development mode');
        const mockData = this.generateMockData();
        this.listeners.forEach(listener => listener(mockData));
        return mockData;
      }
      
      throw error;
    }
  }

  // Private methods
  private getSessionId(): string {
    // Check if session ID already exists in sessionStorage
    const existingId = sessionStorage.getItem('analytics_session_id');
    if (existingId) return existingId;

    // Generate new session ID
    const newId = uuidv4();
    sessionStorage.setItem('analytics_session_id', newId);
    return newId;
  }

  private detectDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;

    // Detect device category
    let deviceCategory = 'desktop';
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
      deviceCategory = 'mobile';
      if (/iPad|tablet/i.test(userAgent) || width >= 768) {
        deviceCategory = 'tablet';
      }
    }

    // Detect browser
    let browserCategory = 'other';
    if (/Chrome/i.test(userAgent) && !/Chromium|OPR|Edge/i.test(userAgent)) {
      browserCategory = 'chrome';
    } else if (/Firefox/i.test(userAgent)) {
      browserCategory = 'firefox';
    } else if (/Safari/i.test(userAgent) && !/Chrome|Chromium|Edge/i.test(userAgent)) {
      browserCategory = 'safari';
    } else if (/Edge|Edg/i.test(userAgent)) {
      browserCategory = 'edge';
    }

    // Detect screen size category
    let screenSizeCategory = 'desktop';
    if (width < 576) {
      screenSizeCategory = 'xs';
    } else if (width < 768) {
      screenSizeCategory = 'sm';
    } else if (width < 992) {
      screenSizeCategory = 'md';
    } else if (width < 1200) {
      screenSizeCategory = 'lg';
    } else {
      screenSizeCategory = 'xl';
    }

    return {
      deviceCategory,
      browserCategory,
      screenSizeCategory,
    };
  }

  private trackPageView = (): void => {
    if (!this.isTracking) return;

    const path = window.location.pathname;
    const timestamp = new Date().toISOString();

    if (!this.pageViews[path]) {
      this.pageViews[path] = [];
    }

    this.pageViews[path].push({
      path,
      timestamp,
    });
    
    if (this.isDevelopment) {
      console.log(`Page view tracked: ${path}`);
    }
  };

  private handlePageLoad = (): void => {
    // Measure page load time
    if (window.performance) {
      const perfData = window.performance.timing;
      const loadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      this.pageLoadTime = {
        path: window.location.pathname,
        loadTime: Math.max(0, loadTime), // Ensure positive value
      };
      
      if (this.isDevelopment) {
        console.log(`Page load time: ${this.pageLoadTime.loadTime}ms for ${this.pageLoadTime.path}`);
      }
    }
  };

  private handleInteraction = (event: MouseEvent): void => {
    if (!this.isTracking) return;

    // Find the closest element with an ID or data attribute
    let target = event.target as HTMLElement;
    let elementId = '';
    
    while (target && !elementId && target !== document.body) {
      if (target.id) {
        elementId = target.id;
      } else if (target.dataset && target.dataset.analyticsId) {
        elementId = target.dataset.analyticsId;
      } else if (target.getAttribute('class')) {
        // Try to use the most specific class
        const classes = target.getAttribute('class')?.split(' ') || [];
        if (classes.length > 0) {
          // Find the least common class (potentially most specific)
          elementId = `class:${classes[classes.length - 1]}`;
        }
      }
      
      if (!elementId) {
        target = target.parentElement as HTMLElement;
      }
    }

    // Only track interactions with identifiable elements
    if (elementId) {
      if (!this.interactionCounts[elementId]) {
        this.interactionCounts[elementId] = [];
      }

      this.interactionCounts[elementId].push({
        elementId,
        type: 'click',
        timestamp: new Date().toISOString(),
      });

      if (this.isDevelopment) {
        console.log(`Interaction tracked: ${elementId}`);
      }

      // Debounce saving analytics after interaction
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      // Shorter debounce time in development
      const debounceTime = this.isDevelopment ? 10000 : 60000; // 10 seconds in dev, 1 minute in prod
      
      this.debounceTimer = setTimeout(() => {
        this.saveAnalytics();
      }, debounceTime);
    }
  };

  private handleBeforeUnload = (): void => {
    this.saveAnalytics();
  };

  private calculateSessionDuration(): number {
    const now = new Date();
    return (now.getTime() - this.sessionStartTime.getTime()) / 1000; // Duration in seconds
  }

  private async saveAnalytics(): Promise<void> {
    if (Object.keys(this.pageViews).length === 0 && Object.keys(this.interactionCounts).length === 0) {
      if (this.isDevelopment) {
        console.log('No analytics data to save');
      }
      return; // No data to save
    }

    const analyticsPayload: AnalyticsPayload = {
      pageViews: this.pageViews,
      sessionData: {
        id: this.sessionId,
        startTime: this.sessionStartTime.toISOString(),
        duration: this.calculateSessionDuration(),
      },
      deviceInfo: this.deviceInfo,
      pageLoadTimes: this.pageLoadTime || {
        path: window.location.pathname,
        loadTime: 0,
      },
      interactionCounts: this.interactionCounts,
    };

    try {
      if (this.isDevelopment) {
        console.log('Saving analytics data:', analyticsPayload);
        console.log(`API endpoint: ${this.apiEndpoints.SAVE_ANALYTICS}`);
      }
      
      const response = await fetch(this.apiEndpoints.SAVE_ANALYTICS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key'   : API_KEY,
        },
        body: JSON.stringify(analyticsPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to save analytics: ${response.statusText}`);
      }

      // Clear tracked data after successful save
      this.pageViews = {};
      this.interactionCounts = {};
      this.pageLoadTime = null;
      
      if (this.isDevelopment) {
        console.log('Analytics data saved successfully');
      }
      
    } catch (error) {
      console.error('Error saving analytics data:', error);
      
      if (this.isDevelopment) {
        console.log('Development mode: would have saved this data:', analyticsPayload);
      }
    }
  }

  // Generate mock data for development testing
  private generateMockData(): AnalyticsSummary {
    return {
      totalPageViews: 1250,
      averageSessionDuration: 185, // in seconds
      topPages: [
        { path: '/', count: 650 },
        { path: '/about', count: 320 },
        { path: '/projects', count: 175 },
        { path: '/contact', count: 85 },
        { path: '/blog', count: 20 },
      ],
      deviceBreakdown: {
        desktop: 720,
        mobile: 480,
        tablet: 50,
      },
      browserBreakdown: {
        chrome: 680,
        safari: 245,
        firefox: 180,
        edge: 125,
        other: 20,
      },
      screenSizeBreakdown: {
        xs: 250,
        sm: 230,
        md: 150,
        lg: 320,
        xl: 300,
      },
      averagePageLoadTimes: {
        '/': 850,
        '/about': 750,
        '/projects': 1150,
        '/contact': 680,
        '/blog': 980,
      },
      topInteractions: [
        { elementId: 'contact-button', count: 85 },
        { elementId: 'download-resume', count: 65 },
        { elementId: 'project-card-1', count: 48 },
        { elementId: 'project-card-2', count: 42 },
        { elementId: 'hamburger-menu', count: 38 },
        { elementId: 'theme-toggle', count: 35 },
        { elementId: 'github-link', count: 30 },
        { elementId: 'linkedin-link', count: 28 },
        { elementId: 'project-card-3', count: 25 },
        { elementId: 'header-nav-about', count: 22 },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();