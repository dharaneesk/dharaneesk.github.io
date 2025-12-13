
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { RefreshCw } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

// Color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  return `${Math.round(seconds / 3600)}h ${Math.round((seconds % 3600) / 60)}m`;
};

export const AnalyticsDashboard: React.FC = () => {
  const { analyticsData, isLoading, error, fetchAnalytics } = useAnalytics(true);
  const [activeTab, setActiveTab] = useState('overview');

  const handleRefresh = () => {
    fetchAnalytics();
  };

  // Process data for charts
  const prepareChartData = (data: Record<string, number>) => {
    return Object.entries(data).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Process data for bar charts
  const prepareBarData = (data: { path: string; count: number }[]) => {
    return data.map(item => ({
      name: item.path === '/' ? 'Home' : item.path.replace(/^\//, ''),
      value: item.count,
    }));
  };

  return (
    <div className="space-y-4 w-full max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
        <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load analytics data. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Page Views */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-12 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {analyticsData?.totalPageViews?.toLocaleString() || '0'}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Average Session Duration */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-12 w-24" />
                ) : (
                  <div className="text-3xl font-bold">
                    {formatTime(analyticsData?.averageSessionDuration || 0)}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Last Updated */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-12 w-36" />
                ) : (
                  <div className="text-lg font-medium">
                    {analyticsData?.lastUpdated 
                      ? new Date(analyticsData.lastUpdated).toLocaleString() 
                      : 'Never'}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Top Pages Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={prepareBarData(analyticsData?.topPages || [])}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Views" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pages Tab */}
        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Page</th>
                        <th className="text-right p-2">Views</th>
                        <th className="text-right p-2">Avg. Load Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData?.topPages?.map((page, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2">{page.path === '/' ? 'Home' : page.path}</td>
                          <td className="text-right p-2">{page.count}</td>
                          <td className="text-right p-2">
                            {analyticsData?.averagePageLoadTimes[page.path] 
                              ? `${(analyticsData.averagePageLoadTimes[page.path] / 1000).toFixed(2)}s` 
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Page Load Times</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(analyticsData?.averagePageLoadTimes || {}).map(([path, time]) => ({
                      name: path === '/' ? 'Home' : path.replace(/^\//, ''),
                      value: time / 1000, // Convert to seconds
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${typeof value === 'number' ? value.toFixed(2) : value}s`, 'Load Time']} />
                    <Legend />
                    <Bar dataKey="value" name="Load Time (s)" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Device Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {isLoading ? (
                  <Skeleton className="h-64 w-64 rounded-full" />
                ) : (
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={prepareChartData(analyticsData?.deviceBreakdown || {})}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : 0}%`}
                      >
                        {prepareChartData(analyticsData?.deviceBreakdown || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            {/* Browser Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {isLoading ? (
                  <Skeleton className="h-64 w-64 rounded-full" />
                ) : (
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={prepareChartData(analyticsData?.browserBreakdown || {})}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : 0}%`}
                      >
                        {prepareChartData(analyticsData?.browserBreakdown || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
            
            {/* Screen Sizes */}
            <Card>
              <CardHeader>
                <CardTitle>Screen Sizes</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {isLoading ? (
                  <Skeleton className="h-64 w-64 rounded-full" />
                ) : (
                  <ResponsiveContainer width={200} height={200}>
                    <PieChart>
                      <Pie
                        data={prepareChartData(analyticsData?.screenSizeBreakdown || {})}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : 0}%`}
                      >
                        {prepareChartData(analyticsData?.screenSizeBreakdown || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Category</th>
                        <th className="text-right p-2">Count</th>
                        <th className="text-right p-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(analyticsData?.deviceBreakdown || {}).map(([device, count], i) => {
                        const total = Object.values(analyticsData?.deviceBreakdown || {}).reduce((sum, val) => sum + val, 0);
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        
                        return (
                          <tr key={i} className="border-b">
                            <td className="p-2 capitalize">{device}</td>
                            <td className="text-right p-2">{count}</td>
                            <td className="text-right p-2">{percentage.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Browser Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Browser</th>
                        <th className="text-right p-2">Count</th>
                        <th className="text-right p-2">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(analyticsData?.browserBreakdown || {}).map(([browser, count], i) => {
                        const total = Object.values(analyticsData?.browserBreakdown || {}).reduce((sum, val) => sum + val, 0);
                        const percentage = total > 0 ? (count / total) * 100 : 0;
                        
                        return (
                          <tr key={i} className="border-b">
                            <td className="p-2 capitalize">{browser}</td>
                            <td className="text-right p-2">{count}</td>
                            <td className="text-right p-2">{percentage.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Interactions Tab */}
        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top User Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={analyticsData?.topInteractions.map(item => ({
                      name: item.elementId.length > 20 ? `${item.elementId.slice(0, 20)}...` : item.elementId,
                      value: item.count,
                      fullName: item.elementId
                    })) || []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip labelFormatter={(label, data) => data[0]?.payload?.fullName || label} />
                    <Legend />
                    <Bar dataKey="value" name="Interactions" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Element ID</th>
                        <th className="text-right p-2">Clicks</th>
                        <th className="text-right p-2">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData?.topInteractions?.map((interaction, i) => {
                        const totalInteractions = analyticsData.topInteractions.reduce((sum, item) => sum + item.count, 0);
                        const percentage = totalInteractions > 0 ? (interaction.count / totalInteractions) * 100 : 0;
                        
                        return (
                          <tr key={i} className="border-b">
                            <td className="p-2 font-mono text-sm">{interaction.elementId}</td>
                            <td className="text-right p-2">{interaction.count}</td>
                            <td className="text-right p-2">{percentage.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interaction Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : analyticsData?.topInteractions?.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  No interaction data available yet
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-lg border h-96">
                  <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-900">
                    <div className="flex items-center justify-center h-full opacity-30">
                      <span className="text-xl font-mono">Your website layout</span>
                    </div>
                    
                    {analyticsData?.topInteractions?.map((interaction, i) => {
                      const size = Math.max(30, Math.min(100, interaction.count * 5));
                      const color = COLORS[i % COLORS.length];
                      const opacity = Math.min(0.8, Math.max(0.3, interaction.count / (analyticsData?.topInteractions[0]?.count || 1)));
                      
                      // Position dots randomly but weighted toward the center
                      const randomPosition = () => {
                        const center = 0.5;
                        const spread = 0.7;
                        return center + (Math.random() - 0.5) * spread;
                      };
                      
                      const x = randomPosition() * 100;
                      const y = randomPosition() * 100;
                      
                      return (
                        <div 
                          key={i}
                          className="absolute rounded-full flex items-center justify-center"
                          style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `calc(${x}% - ${size/2}px)`,
                            top: `calc(${y}% - ${size/2}px)`,
                            backgroundColor: color,
                            opacity: opacity,
                            zIndex: 10 + i,
                          }}
                          title={`${interaction.elementId}: ${interaction.count} clicks`}
                        >
                          <span className="text-xs text-white font-bold">
                            {interaction.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-2 text-center">
                Note: This is a simulated heatmap visualization. For precise element positioning, consider implementing a full heatmap solution.
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Interaction Trends</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">
                    Interaction trends by time will be shown here when more data is available.
                  </p>
                  <Button variant="outline" onClick={fetchAnalytics}>
                    Check for New Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {analyticsData && (
        <div className="text-sm text-muted-foreground text-center mt-4">
          Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
        </div>
      )}
      
      <div className="border-t pt-4 mt-8">
        <h3 className="text-lg font-semibold mb-2">Analytics Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data Collection Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Last 7 Days
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Last 30 Days
                </Button>
                <Button size="sm" variant="default" className="flex-1">
                  All Time
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: These filters will be functional when time-based filtering is implemented in the backend.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Export CSV
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Export JSON
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Generate Report
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Export functionality will be implemented in future updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;