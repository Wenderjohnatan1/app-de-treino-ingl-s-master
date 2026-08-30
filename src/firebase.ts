import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { User, UserProgressData } from './types';

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  const fbUser = result.user;
  
  const appUser: User = {
    id: fbUser.uid,
    email: fbUser.email || '',
    name: fbUser.displayName || 'Estudante',
    createdAt: fbUser.metadata.creationTime || new Date().toISOString()
  };

  // Sync user profile to Firestore
  try {
    const userRef = doc(db, 'users', fbUser.uid);
    await setDoc(userRef, appUser, { merge: true });
  } catch (err) {
    console.warn('Could not sync user profile to Firestore:', err);
  }

  return appUser;
}

/**
 * Sign up with Email and Password
 */
export async function registerWithEmail(name: string, email: string, pass: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  // Set display name in auth
  if (name) {
    await updateProfile(fbUser, { displayName: name });
  }

  const appUser: User = {
    id: fbUser.uid,
    email: fbUser.email || email,
    name: name || 'Estudante',
    createdAt: new Date().toISOString()
  };

  try {
    const userRef = doc(db, 'users', fbUser.uid);
    await setDoc(userRef, appUser, { merge: true });
  } catch (err) {
    console.warn('Could not sync registered user to Firestore:', err);
  }

  return appUser;
}

/**
 * Login with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  const fbUser = userCredential.user;

  const appUser: User = {
    id: fbUser.uid,
    email: fbUser.email || email,
    name: fbUser.displayName || email.split('@')[0] || 'Estudante',
    createdAt: fbUser.metadata.creationTime || new Date().toISOString()
  };

  return appUser;
}

/**
 * Logout from Firebase Auth
 */
export async function logOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Save user progress data to Firestore (with local fallback)
 */
export async function saveUserProgressToFirestore(userId: string, progress: UserProgressData): Promise<void> {
  if (!userId || userId === 'convidado') return;

  try {
    const progressRef = doc(db, 'progress', userId);
    await setDoc(progressRef, progress, { merge: true });
  } catch (err) {
    console.warn('Firestore progress save failed, using local storage fallback:', err);
  }
}

/**
 * Load user progress data from Firestore
 */
export async function loadUserProgressFromFirestore(userId: string): Promise<UserProgressData | null> {
  if (!userId || userId === 'convidado') return null;

  try {
    const progressRef = doc(db, 'progress', userId);
    const snapshot = await getDoc(progressRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProgressData;
    }
  } catch (err) {
    console.warn('Firestore progress load failed, trying local storage:', err);
  }
  return null;
}

/**
 * Listen to Auth changes
 */
export function subscribeToAuthChanges(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
    if (fbUser) {
      const appUser: User = {
        id: fbUser.uid,
        email: fbUser.email || '',
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Estudante',
        createdAt: fbUser.metadata.creationTime || new Date().toISOString()
      };
      callback(appUser);
    } else {
      callback(null);
    }
  });
}
