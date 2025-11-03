import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBiNV8wzgAp9nGGK2w4_cNRl71B-5Ftp0w",
  authDomain: "optima-56cf3.firebaseapp.com",
  projectId: "optima-56cf3",
  storageBucket: "optima-56cf3.firebasestorage.app",
  messagingSenderId: "859990852085",
  appId: "1:859990852085:web:1eb2b7432557abf21760bc"
};

// Gemini API Configuration
export const GEMINI_API_KEY = "AIzaSyBdB4zF0VNq70VzvVOxbA7UPAGa331r6zU";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Firebase helper functions for activities

// Student activity data
export interface StudentActivityData {
  activityId: string;
  status: 'assigned' | 'in-progress' | 'completed';
  startedAt?: Date;
  completedAt?: Date;
  score?: number;
  attempts: number;
  feedback?: string;
}

export interface ActivityHistory {
  activityId: string;
  completedAt: Date;
  score: number;
  timeSpent: number;
}

export interface StudentPerformance {
  topicScores: Record<string, number>;
  avgCompletionTime: number;
  totalActivitiesCompleted: number;
}

export interface AIRecommendation {
  activityId: string;
  reason: string;
  assignedBy?: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

// Activity catalog
export interface Activity {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number; // in minutes
  type: 'custom' | 'netacad' | 'pka' | 'quiz' | 'lab';
  netacadUrl?: string;
  createdBy: string;
  tags: string[];
  prerequisites: string[];
  points: number;
  createdAt: Date;
}

// Save student activity data
export async function saveStudentActivity(studentId: string, activityId: string, data: StudentActivityData) {
  try {
    const docRef = doc(db, 'studentActivities', `${studentId}_${activityId}`);
    await setDoc(docRef, {
      studentId,
      ...data,
      updatedAt: Timestamp.now()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving student activity:', error);
    return false;
  }
}

// Get student activity data
export async function getStudentActivity(studentId: string, activityId: string): Promise<StudentActivityData | null> {
  try {
    const docRef = doc(db, 'studentActivities', `${studentId}_${activityId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as StudentActivityData;
    }
    return null;
  } catch (error) {
    console.error('Error getting student activity:', error);
    return null;
  }
}

// Save activity to catalog
export async function saveActivity(activity: Activity) {
  try {
    const docRef = doc(db, 'activities', activity.id);
    await setDoc(docRef, {
      ...activity,
      createdAt: Timestamp.now()
    });
    return true;
  } catch (error) {
    console.error('Error saving activity:', error);
    return false;
  }
}

// Get all activities
export async function getAllActivities(): Promise<Activity[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'activities'));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Activity));
  } catch (error) {
    console.error('Error getting activities:', error);
    return [];
  }
}

// Get activity by ID
export async function getActivity(activityId: string): Promise<Activity | null> {
  try {
    const docRef = doc(db, 'activities', activityId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Activity;
    }
    return null;
  } catch (error) {
    console.error('Error getting activity:', error);
    return null;
  }
}

// Save AI recommendation for student
export async function saveAIRecommendation(studentId: string, recommendation: AIRecommendation) {
  try {
    const docRef = doc(db, 'recommendations', studentId);
    const docSnap = await getDoc(docRef);
    
    let recommendations: AIRecommendation[] = [];
    if (docSnap.exists()) {
      recommendations = docSnap.data().recommendations || [];
    }
    
    recommendations.push({
      ...recommendation,
      timestamp: Timestamp.now() as any
    });
    
    await setDoc(docRef, { recommendations }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving AI recommendation:', error);
    return false;
  }
}

// Get AI recommendations for student
export async function getAIRecommendations(studentId: string): Promise<AIRecommendation[]> {
  try {
    const docRef = doc(db, 'recommendations', studentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().recommendations || [];
    }
    return [];
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return [];
  }
}

// Save student performance data
export async function saveStudentPerformance(studentId: string, performance: StudentPerformance) {
  try {
    const docRef = doc(db, 'users', studentId);
    await setDoc(docRef, {
      performance,
      updatedAt: Timestamp.now()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving student performance:', error);
    return false;
  }
}

// Get student performance data
export async function getStudentPerformance(studentId: string): Promise<StudentPerformance | null> {
  try {
    const docRef = doc(db, 'users', studentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().performance) {
      return docSnap.data().performance as StudentPerformance;
    }
    return null;
  } catch (error) {
    console.error('Error getting student performance:', error);
    return null;
  }
}

// Save activity history
export async function saveActivityHistory(studentId: string, history: ActivityHistory) {
  try {
    const docRef = doc(db, 'users', studentId);
    const docSnap = await getDoc(docRef);
    
    let activityHistory: ActivityHistory[] = [];
    if (docSnap.exists() && docSnap.data().activityHistory) {
      activityHistory = docSnap.data().activityHistory;
    }
    
    activityHistory.push({
      ...history,
      completedAt: Timestamp.now() as any
    });
    
    await setDoc(docRef, { activityHistory }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving activity history:', error);
    return false;
  }
}

// Get activity history
export async function getActivityHistory(studentId: string): Promise<ActivityHistory[]> {
  try {
    const docRef = doc(db, 'users', studentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().activityHistory) {
      return docSnap.data().activityHistory;
    }
    return [];
  } catch (error) {
    console.error('Error getting activity history:', error);
    return [];
  }
}

// Get student activities by status
export async function getStudentActivitiesByStatus(studentId: string, status: string): Promise<StudentActivityData[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'studentActivities'));
    const activities = querySnapshot.docs
      .map(doc => doc.data() as StudentActivityData)
      .filter(activity => activity.status === status);
    return activities;
  } catch (error) {
    console.error('Error getting student activities by status:', error);
    return [];
  }
}
