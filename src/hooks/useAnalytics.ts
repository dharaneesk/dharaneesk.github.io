// src/hooks/useAnalytics.ts
import { useEffect, useState } from 'react';
import { analyticsService, AnalyticsSummary } from '../lib/analytics-service';

export const useAnalytics = (autoFetch = false) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Start tracking on component mount
  useEffect(() => {
    analyticsService.startTracking();
    
    // Subscribe to analytics updates
    const unsubscribe = analyticsService.subscribe((data) => {
      setAnalyticsData(data);
    });
    
    // Fetch analytics data if autoFetch is true
    if (autoFetch) {
      fetchAnalytics();
    }
    
    // Clean up on unmount
    return () => {
      unsubscribe();
    };
  }, [autoFetch]);

  // Function to fetch analytics data
  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await analyticsService.getAnalyticsSummary();
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    analyticsData,
    isLoading,
    error,
    fetchAnalytics,
  };
};