// get-analytics-summary.js - Lambda function to retrieve analytics summary
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const BUCKET_NAME = 'your-portfolio-analytics-bucket';
const ANALYTICS_FILE = 'analytics-data.json';

exports.handler = async (event) => {
  try {
    // Get analytics data from S3
    const s3Object = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: ANALYTICS_FILE
    }).promise();
    
    const analyticsData = JSON.parse(s3Object.Body.toString());
    
    // Calculate summary metrics
    const summary = {
      totalPageViews: Object.values(analyticsData.pageViews).reduce((sum, count) => sum + count, 0),
      averageSessionDuration: analyticsData.sessions.length > 0 
        ? analyticsData.sessions.reduce((sum, session) => sum + session.duration, 0) / analyticsData.sessions.length 
        : 0,
      topPages: Object.entries(analyticsData.pageViews)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, count]) => ({ path, count })),
      deviceBreakdown: analyticsData.deviceCategories,
      browserBreakdown: analyticsData.browserCategories,
      screenSizeBreakdown: analyticsData.screenSizeCategories,
      averagePageLoadTimes: Object.entries(analyticsData.pageLoadTimes).reduce((result, [path, times]) => {
        result[path] = times.reduce((sum, time) => sum + time, 0) / times.length;
        return result;
      }, {}),
      topInteractions: Object.entries(analyticsData.interactionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([elementId, count]) => ({ elementId, count })),
      lastUpdated: analyticsData.lastUpdated
    };
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this for production
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(summary)
    };
  } catch (error) {
    console.error('Error retrieving analytics data:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust this for production
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Failed to retrieve analytics data' })
    };
  }
};