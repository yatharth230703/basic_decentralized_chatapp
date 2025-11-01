# Quick Start Guide

## Prerequisites

- Node.js 14+ and npm installed
- A Firebase project with Google Authentication enabled

## Step 1: Install Dependencies

```bash
npm install
```

**Note**: If you encounter peer dependency issues with Gun.js, use:

```bash
npm install --legacy-peer-deps
```

## Step 2: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable "Google" as a sign-in provider
   - Save your changes
4. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll down to "Your apps" section
   - Click the web icon (`</>`) if you haven't created a web app
   - Copy your configuration values

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
```

**Important**: Replace the placeholder values with your actual Firebase credentials.

## Step 4: Start the Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Step 5: Test the Application

1. Open the app in your browser
2. Click "Sign in with Google"
3. Select your Google account
4. Start chatting! Open another browser/incognito window to test peer-to-peer sync

## Troubleshooting

### Gun.js Connection Issues

If messages aren't syncing:
- Check browser console for errors
- The free relay servers might be down - try refreshing or wait a few minutes
- For production, consider hosting your own Gun.js relay server

### Firebase Authentication Errors

- Verify your Firebase config values in `.env.local`
- Make sure Google Sign-In is enabled in Firebase Console
- Check that your authorized domains include `localhost` (automatically added for development)

### Build Errors

If you get build errors related to Tailwind CSS:
```bash
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
```

### Image Upload Issues

- Check browser console for file size/type errors
- Images are compressed to max 500x500px and 200KB
- Supported formats: JPG, PNG, GIF, WebP

## Next Steps

- Deploy to Vercel or Netlify for production
- Share the URL with friends to test peer-to-peer sync
- Customize the UI colors in `tailwind.config.js`
- Add your own Gun.js relay server for better reliability

