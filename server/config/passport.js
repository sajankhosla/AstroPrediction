const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { randomUUID } = require('crypto');

// Configure Passport
const configurePassport = (db) => {
  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await db.getAsync('SELECT id, name, email, birthDate, birthTime, birthPlace, latitude, longitude, createdAt FROM users WHERE id = ?', [id]);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy (only if credentials are provided)
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Google OAuth: Processing user', profile.emails[0].value);
      
      // Check if user already exists with this email
      let user = await db.getAsync('SELECT * FROM users WHERE email = ?', [profile.emails[0].value]);
      
      if (user) {
        console.log('✅ Google OAuth: Existing user found');
        // Update Google ID if not set
        if (!user.googleId) {
          await db.runAsync('UPDATE users SET googleId = ? WHERE id = ?', [profile.id, user.id]);
          user.googleId = profile.id;
        }
        return done(null, user);
      } else {
        console.log('🆕 Google OAuth: Creating new user');
        // Create new user
        const userId = randomUUID();
        const newUser = {
          id: userId,
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          avatar: profile.photos[0]?.value,
          createdAt: new Date().toISOString()
        };

        await db.runAsync(`
          INSERT INTO users (id, name, email, googleId, avatar, createdAt)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [newUser.id, newUser.name, newUser.email, newUser.googleId, newUser.avatar, newUser.createdAt]);

        console.log('✅ Google OAuth: New user created');
        return done(null, newUser);
      }
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return done(error, null);
    }
  }));
  } else {
    console.log('⚠️ Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  }

  // Facebook OAuth Strategy (only if credentials are provided)
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ['id', 'displayName', 'emails', 'photos']
    },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('🔍 Facebook OAuth: Processing user', profile.emails[0].value);
      
      // Check if user already exists with this email
      let user = await db.getAsync('SELECT * FROM users WHERE email = ?', [profile.emails[0].value]);
      
      if (user) {
        console.log('✅ Facebook OAuth: Existing user found');
        // Update Facebook ID if not set
        if (!user.facebookId) {
          await db.runAsync('UPDATE users SET facebookId = ? WHERE id = ?', [profile.id, user.id]);
          user.facebookId = profile.id;
        }
        return done(null, user);
      } else {
        console.log('🆕 Facebook OAuth: Creating new user');
        // Create new user
        const userId = randomUUID();
        const newUser = {
          id: userId,
          name: profile.displayName,
          email: profile.emails[0].value,
          facebookId: profile.id,
          avatar: profile.photos[0]?.value,
          createdAt: new Date().toISOString()
        };

        await db.runAsync(`
          INSERT INTO users (id, name, email, facebookId, avatar, createdAt)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [newUser.id, newUser.name, newUser.email, newUser.facebookId, newUser.avatar, newUser.createdAt]);

        console.log('✅ Facebook OAuth: New user created');
        return done(null, newUser);
      }
    } catch (error) {
      console.error('❌ Facebook OAuth error:', error);
      return done(error, null);
    }
  }));
  } else {
    console.log('⚠️ Facebook OAuth not configured - missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET');
  }
};

module.exports = configurePassport;
