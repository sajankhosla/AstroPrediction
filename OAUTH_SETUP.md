# OAuth Setup Guide

This guide explains how to set up Google and Facebook OAuth authentication for the Vedic Astrology app.

## Overview

The app now supports:
- ✅ Traditional email/password authentication
- ✅ Google OAuth login
- ✅ Facebook OAuth login
- ✅ Demo mode (for testing)

## Environment Variables Required

### Server (.env)
```env
# Required for OAuth functionality
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-session-secret-for-oauth-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Facebook OAuth Credentials
FACEBOOK_APP_ID=your-facebook-app-id-here
FACEBOOK_APP_SECRET=your-facebook-app-secret-here

# Frontend URL (important for OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

### Client (.env)
```env
# Optional - API base URL for production
REACT_APP_API_URL=
```

## Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### 2. Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - Development: `http://localhost:5001/api/auth/google/callback`
   - Production: `https://your-domain.vercel.app/api/auth/google/callback`
5. Copy the Client ID and Client Secret

### 3. Configure Environment
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Facebook OAuth Setup

### 1. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Choose **Consumer** app type

### 2. Add Facebook Login Product
1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web**

### 3. Configure OAuth Settings
1. Go to **Facebook Login** → **Settings**
2. Add Valid OAuth Redirect URIs:
   - Development: `http://localhost:5001/api/auth/facebook/callback`
   - Production: `https://your-domain.vercel.app/api/auth/facebook/callback`

### 4. Configure Environment
```env
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
```

## Production Deployment (Vercel)

### 1. Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add all the OAuth environment variables:
   - `JWT_SECRET`
   - `SESSION_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `FACEBOOK_APP_ID`
   - `FACEBOOK_APP_SECRET`
   - `FRONTEND_URL` (set to your Vercel app URL)

### 2. Update OAuth App Settings
Make sure your OAuth apps have the production callback URLs:
- Google: `https://your-app.vercel.app/api/auth/google/callback`
- Facebook: `https://your-app.vercel.app/api/auth/facebook/callback`

## Testing OAuth Locally

1. Set up your `.env` file with the OAuth credentials
2. Start the development server: `npm run dev`
3. Go to `http://localhost:3000/auth`
4. Click on "Continue with Google" or "Continue with Facebook"
5. Complete the OAuth flow
6. You should be redirected back and logged in

## How It Works

### OAuth Flow
1. User clicks "Continue with Google/Facebook"
2. User is redirected to Google/Facebook for authentication
3. After authentication, user is redirected to `/api/auth/[provider]/callback`
4. Server creates/finds user account and generates JWT token
5. User is redirected to frontend with token
6. Frontend stores token and user data in localStorage
7. User is logged in and redirected to dashboard

### Database Schema
The `users` table now supports OAuth fields:
- `googleId` - Google user ID
- `facebookId` - Facebook user ID
- `avatar` - Profile picture URL
- `password` - Now optional (for OAuth-only users)

### Security Features
- JWT tokens for stateless authentication
- Session-based OAuth state management
- Secure redirect validation
- User data sanitization

## Troubleshooting

### Common Issues

1. **"Authentication failed" error**
   - Check that OAuth credentials are correct
   - Verify callback URLs match exactly
   - Ensure environment variables are set

2. **Redirect URI mismatch**
   - Update OAuth app settings with correct callback URLs
   - Check FRONTEND_URL environment variable

3. **Database errors**
   - The app automatically adds OAuth columns to existing databases
   - Users with existing accounts can link OAuth providers

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your `.env` file.

## Features

### For Users
- One-click login with Google/Facebook
- No need to remember passwords
- Automatic account creation
- Profile picture from OAuth provider

### For Developers
- Secure OAuth implementation
- Automatic user account linking
- JWT-based authentication
- Session management for OAuth
- Database migration support
