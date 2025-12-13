// src/components/AnalyticsSection.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock, ArrowLeft, Shield } from 'lucide-react';
import AnalyticsDashboard from '@/components/Dashboard';

// Get password from environment variables, with fallback
const ADMIN_PASSWORD = import.meta.env.VITE_ANALYTICS_PASSWORD || 'portfolio-admin';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

interface AnalyticsSectionProps {
  onClose: () => void;
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    localStorage.getItem('analytics-enabled') !== 'false'
  );
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockExpiration, setLockExpiration] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    // Check if user is already authenticated
    const authToken = sessionStorage.getItem('analytics-auth');
    if (authToken === 'true') {
      setIsAuthenticated(true);
    }
    
    // Check if account is locked
    const storedLockExpiration = localStorage.getItem('analytics-lock-expiration');
    const storedAttemptCount = localStorage.getItem('analytics-attempt-count');
    
    if (storedLockExpiration) {
      const expirationTime = parseInt(storedLockExpiration, 10);
      if (expirationTime > Date.now()) {
        setIsLocked(true);
        setLockExpiration(expirationTime);
      } else {
        // Lock expired, clear it
        localStorage.removeItem('analytics-lock-expiration');
        localStorage.removeItem('analytics-attempt-count');
      }
    }
    
    if (storedAttemptCount && !isLocked) {
      setAttemptCount(parseInt(storedAttemptCount, 10));
    }
    
    // Scroll to top when analytics panel opens
    window.scrollTo(0, 0);
    
    // Disable scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Re-enable scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Update countdown timer when locked
  useEffect(() => {
    if (!isLocked || !lockExpiration) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      if (lockExpiration <= now) {
        setIsLocked(false);
        localStorage.removeItem('analytics-lock-expiration');
        localStorage.removeItem('analytics-attempt-count');
        setAttemptCount(0);
        clearInterval(interval);
        return;
      }
      
      const timeLeft = lockExpiration - now;
      const minutes = Math.floor(timeLeft / (60 * 1000));
      const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
      setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isLocked, lockExpiration]);

  const handleLogin = () => {
    if (isLocked) return;
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      sessionStorage.setItem('analytics-auth', 'true');
      // Reset attempt count on successful login
      setAttemptCount(0);
      localStorage.removeItem('analytics-attempt-count');
      localStorage.removeItem('analytics-lock-expiration');
    } else {
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      localStorage.setItem('analytics-attempt-count', newAttemptCount.toString());
      
      if (newAttemptCount >= MAX_ATTEMPTS) {
        // Lock the account
        const expirationTime = Date.now() + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockExpiration(expirationTime);
        localStorage.setItem('analytics-lock-expiration', expirationTime.toString());
        setError(`Too many failed attempts. Please try again in 30 minutes.`);
      } else {
        setError(`Invalid password. ${MAX_ATTEMPTS - newAttemptCount} attempts remaining.`);
      }
    }
    
    // Clear password field
    setPassword('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const toggleAnalytics = () => {
    const newValue = !analyticsEnabled;
    setAnalyticsEnabled(newValue);
    localStorage.setItem('analytics-enabled', newValue.toString());
    
    // Reload the page to apply the change
    window.location.reload();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('analytics-auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-4">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-background/80 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Portfolio</span>
        </button>
        
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Enter the admin password to access analytics</p>
          </div>
          
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          {isLocked ? (
            <div className="space-y-4">
              <div className="bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-md p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Account Temporarily Locked</h3>
                  <p className="text-sm">Too many failed login attempts. For security reasons, please wait before trying again.</p>
                  <div className="mt-2 text-center font-mono text-lg font-bold">
                    {remainingTime}
                  </div>
                </div>
              </div>
              <Button 
                className="w-full" 
                variant="outline" 
                onClick={onClose}
              >
                Return to Portfolio
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-2 rounded-md border border-input bg-background"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              
              <Button className="w-full" onClick={handleLogin}>
                Login
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-background overflow-auto">
      <header className="sticky top-0 bg-card border-b border-border p-4 z-10">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-background/80 transition-colors"
              aria-label="Back to Portfolio"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold">Portfolio Analytics</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch 
                id="analytics-toggle" 
                checked={analyticsEnabled}
                onCheckedChange={toggleAnalytics}
              />
              <Label htmlFor="analytics-toggle">
                {analyticsEnabled ? 'Analytics Enabled' : 'Analytics Disabled'}
              </Label>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6">
        <AnalyticsDashboard />
      </main>
    </div>
  );
};

export default AnalyticsSection;