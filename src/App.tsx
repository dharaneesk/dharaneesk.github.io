import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics"; 
import TypingLoader from "./components/TypingLoader";
import { initAnalytics } from "./lib/analytics-init";


const API_ENDPOINTS = {
  development: {
    saveUrl: 'http://localhost:3001/save-analytics',
    summaryUrl: 'http://localhost:3001/get-analytics-summary'
  },
  production: {
    saveUrl: 'https://cquvi9wdo3.execute-api.us-east-1.amazonaws.com/prod/analytics',
    summaryUrl: 'https://cquvi9wdo3.execute-api.us-east-1.amazonaws.com/prod/analytics/summary'
  }
};

// Get current environment
const currentEnv = process.env.NODE_ENV || 'development';
const endpoints = API_ENDPOINTS[currentEnv === 'production' ? 'production' : 'development'];

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadApp = async () => {
      const analyticsEnabled = localStorage.getItem('analytics-enabled') !== 'false';
      
      if (analyticsEnabled) {
        // Pass the appropriate endpoints based on the environment
        initAnalytics(
          true, // Always enable if the localStorage flag is true
          endpoints
        );
        
        console.log(`Analytics initialized in ${currentEnv} environment with endpoints:`, endpoints);
      } else {
        console.log("Analytics tracking is disabled");
      }
      
      const domLoaded = new Promise<void>(resolve => {
        if (document.readyState === 'complete') {
          resolve();
        } else {
          window.addEventListener('load', () => resolve(), { once: true });
        }
      });
      
      const componentsLoaded = new Promise<void>(resolve => {
        const checkComponentsLoaded = () => {
          if (Index && NotFound) {
            resolve();
          }
        };
        checkComponentsLoaded();
        setTimeout(checkComponentsLoaded, 100);
      });
      
      // Create a promise that enforces a minimum animation duration
      const minimumAnimationTime = new Promise<void>(resolve => {
        // Show animation for at least 2 seconds (adjust as needed)
        setTimeout(resolve, 2000);
      });
      
      // Wait for DOM, components, and minimum animation time
      await Promise.all([domLoaded, componentsLoaded, minimumAnimationTime]);
      
      setIsLoading(false);
    };
    
    loadApp();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isLoading) {
        const loaderElement = document.getElementById('typing-loader');
        if (loaderElement) {
          loaderElement.classList.remove('animate');
          setTimeout(() => loaderElement.classList.add('animate'), 10);
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLoading]);
  
  if (isLoading) {
    return <TypingLoader id="typing-loader" />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;