import { doc, getDoc, setDoc, updateDoc, query, where, getDocs, collection } from 'firebase/firestore';
import { db } from './firebase';
import { UserDocument } from './types';

/**
 * Get user document from Firestore
 */
export async function getUserDocument(uid: string): Promise<UserDocument | null> {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Please configure Firebase in your .env.local file.');
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserDocument;
    }
    return null;
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
}

/**
 * Create or update user document in Firestore
 */
export async function createOrUpdateUser(
  uid: string,
  data: Partial<UserDocument>
): Promise<void> {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Please configure Firebase in your .env.local file.');
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    const updateData: any = {
      email: data.email !== undefined ? data.email : '',
      subscriptionStatus: data.subscriptionStatus !== undefined ? data.subscriptionStatus : 'inactive',
      plan: data.plan !== undefined ? data.plan : null,
      stripeCustomerId: data.stripeCustomerId !== undefined ? data.stripeCustomerId : null,
      currentPeriodEnd: data.currentPeriodEnd !== undefined ? data.currentPeriodEnd : null,
    };
    
    if (userDoc.exists()) {
      // Update existing document - merge with existing data
      const existingData = userDoc.data();
      await updateDoc(userRef, {
        ...updateData,
        // Preserve createdAt if it exists
        createdAt: existingData.createdAt || new Date(),
      });
      console.log(`✅ Updated user document for ${uid}`);
      console.log(`   Subscription status: ${updateData.subscriptionStatus}`);
      console.log(`   Plan: ${updateData.plan}`);
      console.log(`   Customer ID: ${updateData.stripeCustomerId}`);
    } else {
      // Create new document
      await setDoc(userRef, {
        ...updateData,
        createdAt: new Date(),
      });
      console.log(`✅ Created new user document for ${uid}`);
      console.log(`   Subscription status: ${updateData.subscriptionStatus}`);
      console.log(`   Plan: ${updateData.plan}`);
    }
  } catch (error: any) {
    console.error('❌ Error creating/updating user document:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
}

/**
 * Find user by Stripe customer ID
 */
export async function findUserByStripeCustomerId(
  stripeCustomerId: string
): Promise<{ uid: string; data: UserDocument } | null> {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Please configure Firebase in your .env.local file.');
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('stripeCustomerId', '==', stripeCustomerId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        uid: doc.id,
        data: doc.data() as UserDocument,
      };
    }
    return null;
  } catch (error) {
    console.error('Error finding user by Stripe customer ID:', error);
    throw error;
  }
}
