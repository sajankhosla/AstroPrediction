const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '../data/astrology.db');

// Initialize database tables
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    console.log('🔧 Initializing database tables...');
    
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        birthDate TEXT,
        birthTime TEXT,
        birthPlace TEXT,
        latitude REAL,
        longitude REAL,
        createdAt TEXT NOT NULL
      )
    `, (err) => {
      if (err) {
        console.error('❌ Error creating users table:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Users table ready');
      
      // Create predictions table
      db.run(`
        CREATE TABLE IF NOT EXISTS predictions (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          predictionData TEXT NOT NULL,
          positivityScore REAL DEFAULT 0,
          createdAt TEXT NOT NULL,
          FOREIGN KEY (userId) REFERENCES users (id)
        )
      `, (err) => {
        if (err) {
          console.error('❌ Error creating predictions table:', err.message);
          reject(err);
          return;
        }
        console.log('✅ Predictions table ready');
        
        // Create milestones table
        db.run(`
          CREATE TABLE IF NOT EXISTS milestones (
            id TEXT PRIMARY KEY,
            userId TEXT,
            name TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT,
            category TEXT,
            impact TEXT,
            createdAt TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users (id)
          )
        `, (err) => {
          if (err) {
            console.error('❌ Error creating milestones table:', err.message);
            reject(err);
            return;
          }
          console.log('✅ Milestones table ready');
          console.log('🎉 Database initialization complete!');
          resolve();
        });
      });
    });
  });
};

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    // Initialize database tables
    initializeDatabase().catch(err => {
      console.error('❌ Database initialization failed:', err);
    });
  }
});

// Helper functions for database operations
const dbHelpers = {
  // Get a single row
  getAsync: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get all rows
  allAsync: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Run a query (INSERT, UPDATE, DELETE)
  runAsync: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            lastID: this.lastID,
            changes: this.changes
          });
        }
      });
    });
  }
};

// Add database helpers to the database object
Object.assign(db, dbHelpers);

module.exports = db;
