# Decentralized Chatroom Web Application

A peer-to-peer group chatroom web application built with React, Gun.js, and Firebase Authentication. No centralized server required - data syncs directly between users' devices.

## Features

- ✅ Google OAuth authentication via Firebase
- ✅ Real-time peer-to-peer messaging using Gun.js
- ✅ Image sharing with automatic compression
- ✅ Image gallery view
- ✅ Clean, minimal UI with Tailwind CSS
- ✅ Fully responsive design (mobile & desktop)
- ✅ Offline support (data persists in IndexedDB)

## Technology Stack

- **Frontend**: React 18+
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Real-time P2P Database**: Gun.js
- **Authentication**: Firebase Authentication (Google OAuth)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Google Sign-In
4. Get your Firebase configuration values:
   - API Key
   - Project ID
   - Auth Domain (usually `your-project-id.firebaseapp.com`)

### 3. Create Environment File

Create a `.env.local` file in the root directory:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_PROJECT_ID=your_project_id_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
```

### 4. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## How It Works

### Decentralized Architecture

- Each user's browser acts as a node in the Gun.js network
- Messages and images are stored locally in IndexedDB
- Data automatically syncs peer-to-peer via WebRTC when users are online
- Gun.js relay servers help peers discover each other (no data stored on relay)

### Data Structure

```
gun.get('chatroom')
  ├── .get('messages')
  │   ├── messageId1 → { sender, text, timestamp, userId }
  │   └── messageId2 → { sender, text, timestamp, userId }
  └── .get('images')
      ├── imageId1 → { uploader, base64Data, timestamp, userId, fileName }
      └── imageId2 → { uploader, base64Data, timestamp, userId, fileName }
```

### Image Handling

- Images are compressed to max 500x500px and 200KB
- Stored as Base64 strings in Gun.js
- Automatically syncs across all connected peers
- Displayed in gallery view sorted by timestamp

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Import project in [Netlify](https://www.netlify.com/)
3. Add environment variables in Site settings
4. Deploy!

## Project Structure

```
src/
  ├── components/
  │   ├── LoginPage.js          # Google OAuth login
  │   ├── ChatroomPage.js       # Main chat interface
  │   ├── MessageList.js        # Display messages
  │   ├── MessageInput.js       # Send messages
  │   ├── ImageUpload.js        # Upload images
  │   └── GalleryPage.js        # View all images
  ├── config/
  │   ├── firebase.js           # Firebase configuration
  │   └── gunConfig.js          # Gun.js setup
  ├── context/
  │   └── AuthContext.js        # Authentication state
  ├── utils/
  │   └── imageUtils.js         # Image compression utilities
  ├── App.js                    # Main router
  └── index.js                  # Entry point
```

## Testing Checklist

- [ ] User can log in with Google
- [ ] Logged-in user name appears in header
- [ ] Message sent appears immediately
- [ ] Open app in two browsers → messages sync between both
- [ ] Image upload works on desktop and mobile
- [ ] Uploaded image appears in gallery
- [ ] Gallery shows all images chronologically
- [ ] App works offline (cached data from IndexedDB)
- [ ] UI is responsive on mobile and desktop
- [ ] No console errors or warnings

## Notes

- **Free Relay Server**: The app uses a free public Gun.js relay. For production with many users, consider hosting your own relay server.
- **Image Storage**: Base64 increases data size by ~33%, but compression mitigates this for most use cases.
- **Offline Support**: Messages and images persist in IndexedDB, so the app works offline with cached data.

## License

MIT

