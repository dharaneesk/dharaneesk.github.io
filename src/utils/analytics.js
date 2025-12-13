import initSqlJs from 'sql.js';
import { detect } from 'detect-browser';
import { v4 as uuidv4 } from 'uuid';

class AnalyticsService {
  constructor() {
    this.db = null;
    this.sessionId = null;
    this.sessionStartTime = null;
    this.initialized = false;
    this.interactionListeners = new Map();
    this.pageLoadStartTime = performance.now();
    
    // Initialize on construction
    this.init();
  }

  async init() {
    try {
      // Initialize SQL.js
      const SQL = await initSqlJs({
        // Specify the path to the sql.js wasm file
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });
      
      this.db = new SQL.Database();
      
      // Create tables if they don't exist
      this.createTables();
      
      // Generate or retrieve session ID
      this.initSession();
      
      // Set up page load time tracking
      window.addEventListener('load', () => this.recordPageLoadTime());
      
      // Set up page view tracking - do this after DB is initialized
      this.recordPageView();

      // Set up visibility change to track session duration
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      
      // Set up unload event to record final session duration
      window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
      
      // Add global click listener
      document.addEventListener('click', this.handleGlobalClick.bind(this));
      
      this.initialized = true;
      console.log('Analytics service initialized');
    } catch (error) {
      console.error('Failed to initialize analytics service:', error);
    }
  }

  createTables() {
    // Create tables for all our analytics needs
    this.db.run(`
      CREATE TABLE IF NOT EXISTS page_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        page_path TEXT,
        timestamp INTEGER
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        start_time INTEGER,
        end_time INTEGER,
        duration INTEGER,
        device_category TEXT,
        browser_category TEXT,
        screen_size_category TEXT
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS page_load_times (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        page_path TEXT,
        load_time_ms INTEGER,
        timestamp INTEGER
      )
    `);

    this.db.run(`
      CREATE TABLE IF NOT EXISTS interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT,
        element_id TEXT,
        element_class TEXT,
        element_tag TEXT,
        page_path TEXT,
        timestamp INTEGER
      )
    `);
  }

  initSession() {
    // Try to get existing session ID from localStorage
    let existingSessionId = localStorage.getItem('analytics_session_id');
    let sessionStartTime = parseInt(localStorage.getItem('analytics_session_start'), 10);
    const now = Date.now();
    
    // If no session exists or it's older than 30 minutes, create a new one
    if (!existingSessionId || !sessionStartTime || (now - sessionStartTime > 30 * 60 * 1000)) {
      this.sessionId = uuidv4();
      this.sessionStartTime = now;
      
      localStorage.setItem('analytics_session_id', this.sessionId);
      localStorage.setItem('analytics_session_start', this.sessionStartTime.toString());
      
      // Record device, browser, and screen size on new session
      this.recordDeviceInfo();
    } else {
      this.sessionId = existingSessionId;
      this.sessionStartTime = sessionStartTime;
    }
  }

  handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      // Update session duration when tab becomes hidden
      this.updateSessionDuration();
    }
  }

  handleBeforeUnload() {
    // Update session info when the page is about to be unloaded
    this.updateSessionDuration();
    
    // Export the database to localStorage for persistence
    this.persistData();
  }

  updateSessionDuration() {
    const now = Date.now();
    const duration = now - this.sessionStartTime;
    
    this.db.run(`
      UPDATE sessions
      SET end_time = ?, duration = ?
      WHERE session_id = ?
    `, [now, duration, this.sessionId]);
  }

  recordDeviceInfo() {
    // Detect device category
    const deviceCategory = this.getDeviceCategory();
    
    // Detect browser category
    const browserInfo = detect();
    const browserCategory = browserInfo ? browserInfo.name : 'unknown';
    
    // Detect screen size category
    const screenSizeCategory = this.getScreenSizeCategory();
    
    // Store session info
    this.db.run(`
      INSERT OR REPLACE INTO sessions (
        session_id, start_time, end_time, duration,
        device_category, browser_category, screen_size_category
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      this.sessionId,
      this.sessionStartTime,
      null,  // end_time is null until session ends
      0,     // duration starts at 0
      deviceCategory,
      browserCategory,
      screenSizeCategory
    ]);
  }

  getDeviceCategory() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipad|ipod|windows phone|iemobile|blackberry/i.test(userAgent)) {
      // Further distinguish between tablet and mobile
      if (/ipad|tablet/i.test(userAgent) || (window.innerWidth >= 768)) {
        return 'tablet';
      }
      return 'mobile';
    }
    
    return 'desktop';
  }

  getScreenSizeCategory() {
    const width = window.innerWidth;
    
    if (width < 576) {
      return 'small';  // Mobile
    } else if (width < 992) {
      return 'medium'; // Tablet or small desktop
    } else {
      return 'large';  // Large desktop
    }
  }

  recordPageView() {
    if (!this.initialized) {
      // Queue this call for when we're initialized
      setTimeout(() => this.recordPageView(), 100);
      return;
    }
    
    const pagePath = window.location.pathname;
    const timestamp = Date.now();
    
    this.db.run(`
      INSERT INTO page_views (session_id, page_path, timestamp)
      VALUES (?, ?, ?)
    `, [this.sessionId, pagePath, timestamp]);
  }

  recordPageLoadTime() {
    const loadTime = performance.now() - this.pageLoadStartTime;
    const pagePath = window.location.pathname;
    const timestamp = Date.now();
    
    this.db.run(`
      INSERT INTO page_load_times (session_id, page_path, load_time_ms, timestamp)
      VALUES (?, ?, ?, ?)
    `, [this.sessionId, pagePath, Math.round(loadTime), timestamp]);
  }

  handleGlobalClick(event) {
    const element = event.target;
    const elementId = element.id || '';
    const elementClass = Array.from(element.classList).join(' ') || '';
    const elementTag = element.tagName.toLowerCase();
    const pagePath = window.location.pathname;
    const timestamp = Date.now();
    
    this.db.run(`
      INSERT INTO interactions (
        session_id, element_id, element_class, element_tag, 
        page_path, timestamp
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      this.sessionId,
      elementId,
      elementClass,
      elementTag,
      pagePath,
      timestamp
    ]);
  }

  // Track specific element interactions by adding listeners
  trackElementInteraction(elementSelector, name) {
    const elements = document.querySelectorAll(elementSelector);
    
    const handler = (event) => {
      const pagePath = window.location.pathname;
      const timestamp = Date.now();
      
      this.db.run(`
        INSERT INTO interactions (
          session_id, element_id, element_class, element_tag, 
          page_path, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        this.sessionId,
        name, // Using the provided name instead of actual ID
        event.target.classList.toString(),
        event.target.tagName.toLowerCase(),
        pagePath,
        timestamp
      ]);
    };
    
    elements.forEach(element => {
      element.addEventListener('click', handler);
      
      // Store reference to the handler so we can remove it later if needed
      if (!this.interactionListeners.has(elementSelector)) {
        this.interactionListeners.set(elementSelector, []);
      }
      
      this.interactionListeners.get(elementSelector).push({
        element,
        handler
      });
    });
  }

  persistData() {
    try {
      // Export the database to a Uint8Array
      const data = this.db.export();
      
      // Convert to base64 for localStorage
      const base64Data = this.arrayBufferToBase64(data);
      
      // Store in localStorage
      localStorage.setItem('analytics_db', base64Data);
    } catch (err) {
      console.error('Failed to persist analytics data:', err);
    }
  }

  loadPersistedData() {
    try {
      const base64Data = localStorage.getItem('analytics_db');
      if (base64Data) {
        const data = this.base64ToArrayBuffer(base64Data);
        this.db = new SQL.Database(new Uint8Array(data));
        return true;
      }
    } catch (err) {
      console.error('Failed to load persisted analytics data:', err);
    }
    return false;
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Method to get all analytics data
  getAllData() {
    return {
      pageViews: this.getPageViews(),
      sessions: this.getSessions(),
      loadTimes: this.getPageLoadTimes(),
      interactions: this.getInteractions()
    };
  }

  getPageViews() {
    const stmt = this.db.prepare(`SELECT * FROM page_views`);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  getSessions() {
    const stmt = this.db.prepare(`SELECT * FROM sessions`);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  getPageLoadTimes() {
    const stmt = this.db.prepare(`SELECT * FROM page_load_times`);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  getInteractions() {
    const stmt = this.db.prepare(`SELECT * FROM interactions`);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  // Helper method to query the database and get results as objects
  query(sql, params = []) {
    try {
      const stmt = this.db.prepare(sql);
      
      // Bind parameters if provided
      if (params && params.length) {
        stmt.bind(params);
      }
      
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    } catch (err) {
      console.error('Error executing query:', err);
      return [];
    }
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;