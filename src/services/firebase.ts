import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ChatMessage, MemoryItem, AlarmItem, VoicePreferences } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Error Handling according to Firebase Integration Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Firestore online connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Client is operating in offline mode.');
    }
    return false;
  }
}

// User Authentication
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Sign-in failed:', err);
    throw err;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Sign-out error:', err);
  }
}

// Cloud Profile & Sync Operations
export async function saveUserProfile(user: User, prefs: VoicePreferences) {
  const path = `users/${user.uid}`;
  try {
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      displayName: user.displayName || 'Pankaj Ji User',
      email: user.email || '',
      preferredLanguage: prefs.language,
      voiceGender: prefs.gender,
      speakingSpeed: prefs.speed,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveConversationToCloud(userId: string, message: ChatMessage) {
  const path = `users/${userId}/conversations/${message.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'conversations', message.id), {
      id: message.id,
      userId,
      role: message.role,
      content: message.content,
      voiceText: message.voiceText || message.content,
      timestamp: message.timestamp,
      language: message.language || 'Hinglish'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToCloudConversations(
  userId: string,
  onUpdate: (messages: ChatMessage[]) => void
) {
  const path = `users/${userId}/conversations`;
  const q = query(collection(db, 'users', userId, 'conversations'), orderBy('timestamp', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const cloudMessages: ChatMessage[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      cloudMessages.push({
        id: data.id,
        role: data.role,
        content: data.content,
        voiceText: data.voiceText,
        timestamp: data.timestamp,
        language: data.language,
        status: 'verified'
      });
    });
    if (cloudMessages.length > 0) {
      onUpdate(cloudMessages);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export async function saveMemoryToCloud(userId: string, item: MemoryItem) {
  const path = `users/${userId}/memories/${item.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'memories', item.id), {
      id: item.id,
      userId,
      type: item.type,
      key: item.key,
      value: item.value,
      timestamp: item.timestamp
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMemoryFromCloud(userId: string, memoryId: string) {
  const path = `users/${userId}/memories/${memoryId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'memories', memoryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToCloudMemories(
  userId: string,
  onUpdate: (memories: MemoryItem[]) => void
) {
  const path = `users/${userId}/memories`;
  const q = query(collection(db, 'users', userId, 'memories'), orderBy('timestamp', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const cloudMemories: MemoryItem[] = [];
    snapshot.forEach((d) => {
      const data = d.data();
      cloudMemories.push({
        id: data.id,
        type: data.type,
        key: data.key,
        value: data.value,
        timestamp: data.timestamp
      });
    });
    if (cloudMemories.length > 0) {
      onUpdate(cloudMemories);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export async function saveAlarmToCloud(userId: string, alarm: AlarmItem) {
  const path = `users/${userId}/alarms/${alarm.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'alarms', alarm.id), {
      id: alarm.id,
      userId,
      type: 'alarm',
      title: alarm.label,
      timeString: alarm.time,
      timestamp: Date.now(),
      enabled: alarm.enabled
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
