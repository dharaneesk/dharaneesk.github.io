// save-analytics.js - Lambda function to store analytics data
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = 'your-portfolio-analytics-bucket';
const ANALYTICS_FILE = 'analytics-data.json';

exports.handler = async (event) => {
  try {
    // Parse the incoming analytics data
    const analyticsData = JSON.parse(event.body);
    
    // Get the current date for organizing data
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // First try to get existing analytics data
    let existingData;
    try {
      const existingObject = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: ANALYTICS_FILE
      }).promise();
      
      existingData = JSON.parse(existingObject.Body.toString());
    } catch (error) {
      // If file doesn't exist, create new data structure
      existingData = {
        pageViews: {},
        sessions: [],
        deviceCategories: {},
        browserCategories: {},
        screenSizeCategories: {},
        pageLoadTimes: {},
        interactionCounts: {},
        lastUpdated: now.toISOString()
      };
    }
    
    // Merge new analytics with existing data
    
    // Process page views
    Object.entries(analyticsData.pageViews).forEach(([path, views]) => {
      if (!existingData.pageViews[path]) {
        existingData.pageViews[path] = 0;
      }
      existingData.pageViews[path] += views.length;
    });
    
    // Add session data
    if (analyticsData.sessionData && analyticsData.sessionData.duration > 0) {
      existingData.sessions.push({
        id: analyticsData.sessionData.id,
        duration: analyticsData.sessionData.duration,
        date: dateKey
      });
    }
    
    // Process device info
    if (analyticsData.deviceInfo) {
      const { deviceCategory, browserCategory, screenSizeCategory } = analyticsData.deviceInfo;
      
      existingData.deviceCategories[deviceCategory] = (existingData.deviceCategories[deviceCategory] || 0) + 1;
      existingData.browserCategories[browserCategory] = (existingData.browserCategories[browserCategory] || 0) + 1;
      existingData.screenSizeCategories[screenSizeCategory] = (existingData.screenSizeCategories[screenSizeCategory] || 0) + 1;
    }
    
    // Process page load times
    if (analyticsData.pageLoadTimes) {
      const { path, loadTime } = analyticsData.pageLoadTimes;
      
      if (!existingData.pageLoadTimes[path]) {
        existingData.pageLoadTimes[path] = [];
      }
      
      existingData.pageLoadTimes[path].push(loadTime);
    }
    
    // Process interaction counts
    Object.entries(analyticsData.interactionCounts).forEach(([elementId, interactions]) => {
      if (!existingData.interactionCounts[elementId]) {
        existingData.interactionCounts[elementId] = 0;
      }
      existingData.interactionCounts[elementId] += interactions.length;
    });
    
    // Update timestamp
    existingData.lastUpdated = now.toISOString();
    
    // Save the updated data back to S3
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: ANALYTICS_FILE,
      Body: JSON.stringify(existingData),
      ContentType: 'application/json'
    }).promise();
    
    // Also save raw data for this session by session ID
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: `raw-sessions/${analyticsData.sessionData.id}.json`,
      Body: event.body,
      ContentType: 'application/json'
    }).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this for production
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: 'Analytics data saved successfully' })
    };
  } catch (error) {
    console.error('Error saving analytics data:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this for production
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Failed to save analytics data' })
    };
  }
};

