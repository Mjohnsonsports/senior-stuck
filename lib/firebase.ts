import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration - provided via environment variables
// Note: In Next.js, environment variables are only available at build time for client components
// Make sure to restart dev server after adding .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

// Debug: Log config status in development (without exposing values)
if (process.env.NODE_ENV === 'development') {
  const hasConfig = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
  if (!hasConfig) {
    console.error('⚠️ Firebase config missing!');
    console.error('Required env vars:', {
      apiKey: firebaseConfig.apiKey ? '✓ Set' : '✗ Missing',
      authDomain: firebaseConfig.authDomain ? '✓ Set' : '✗ Missing',
      projectId: firebaseConfig.projectId ? '✓ Set' : '✗ Missing',
      appId: firebaseConfig.appId ? '✓ Set' : '✗ Missing',
    });
    console.error('Make sure .env.local has NEXT_PUBLIC_FIREBASE_* variables and restart dev server.');
  } else {
    console.log('✓ Firebase config loaded successfully');
  }
}

// Check if Firebase config is valid
const isFirebaseConfigured = () => {
  const hasConfig = !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
  
  if (!hasConfig && typeof window !== 'undefined') {
    console.warn('Firebase configuration is missing. Please add Firebase environment variables to .env.local');
  }
  
  return hasConfig;
};

// Initialize Firebase only if config is present
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
const googleProvider = new GoogleAuthProvider();

if (isFirebaseConfigured()) {
  try {
    if (getApps().length === 0) {
      // Validate config before initializing
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
        throw new Error('Firebase config is incomplete. Missing required fields.');
      }
      
      app = initializeApp(firebaseConfig);
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✓ Firebase app initialized successfully');
      }
    } else {
      app = getApps()[0];
    }
    
    // Only initialize auth and db if app was successfully created
    if (app) {
      try {
        auth = getAuth(app);
        db = getFirestore(app);
        
        // Verify auth is properly initialized
        if (auth && auth.app) {
          if (process.env.NODE_ENV === 'development') {
            console.log('✓ Firebase Auth and Firestore initialized');
            console.log('✓ Auth app name:', auth.app.name);
          }
        } else {
          throw new Error('Auth object created but app property is missing');
        }
      } catch (authError: any) {
        console.error('Error initializing Firebase Auth/Firestore:', authError);
        // If auth fails, still allow app to work
        if (authError.code === 'auth/configuration-not-found' || authError.message?.includes('configuration')) {
          console.error('⚠️ Firebase Auth configuration not found. Make sure:');
          console.error('1. Go to Firebase Console → Authentication → Get Started');
          console.error('2. Enable Email/Password sign-in method');
          console.error('3. Enable Google sign-in method (if using Google auth)');
          console.error('4. Environment variables are correct in .env.local');
          console.error('5. Dev server was restarted after adding .env.local');
          console.error('6. Check authorized domains in Firebase Console → Authentication → Settings');
        }
        // Don't set auth to null here - let it try to work
      }
    }
  } catch (error: any) {
    console.error('❌ Firebase initialization error:', error);
    if (process.env.NODE_ENV === 'development') {
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      console.error('\nTroubleshooting steps:');
      console.error('1. Check .env.local file exists in project root');
      console.error('2. Verify all NEXT_PUBLIC_FIREBASE_* variables are set');
      console.error('3. Restart dev server: npm run dev');
      console.error('4. Check Firebase Console - Authentication must be enabled');
    }
    // Don't throw - allow app to work without Firebase
    app = null;
    auth = null;
    db = null;
  }
} else {
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Firebase configuration is missing!');
    console.error('Current config check:', {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      hasAppId: !!firebaseConfig.appId,
    });
    console.error('\nPlease add to .env.local:');
    console.error('NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key');
    console.error('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
    console.error('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
    console.error('NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id');
    console.error('\nThen restart: npm run dev');
  }
}

// Export with null checks - components should handle null cases
export { auth, db, googleProvider };
export default app;
