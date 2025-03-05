import { initializeApp } from 'firebase/app';
import { 
  getDatabase, 
  ref, 
  set, 
  onValue, 
  push, 
  remove, 
  update,
  off,
  DatabaseReference 
} from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: `https://${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseio.com`,
};

// Initialize Firebase only if we have the required configuration
if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.warn('Firebase configuration is missing or incomplete. Real-time features will be disabled.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Shared task list operations
export const createSharedTaskList = async (name: string, createdBy: string) => {
  const listRef = ref(database, 'sharedLists');
  const newListRef = push(listRef);
  const listId = newListRef.key;
  
  await set(newListRef, {
    id: listId,
    name,
    createdBy,
    createdAt: new Date().toISOString(),
    collaborators: [createdBy],
  });
  
  return listId;
};

export const addTaskToSharedList = async (
  listId: string, 
  task: any
) => {
  const taskRef = ref(database, `sharedLists/${listId}/tasks`);
  const newTaskRef = push(taskRef);
  const taskId = newTaskRef.key;
  
  await set(newTaskRef, {
    ...task,
    id: taskId,
    sharedId: listId,
    createdAt: new Date().toISOString(),
  });
  
  return taskId;
};

export const updateSharedTask = async (
  listId: string, 
  taskId: string, 
  updates: any
) => {
  const taskRef = ref(database, `sharedLists/${listId}/tasks/${taskId}`);
  await update(taskRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteSharedTask = async (listId: string, taskId: string) => {
  const taskRef = ref(database, `sharedLists/${listId}/tasks/${taskId}`);
  await remove(taskRef);
};

export const addCollaborator = async (listId: string, userId: string) => {
  const listRef = ref(database, `sharedLists/${listId}`);
  
  // Get current collaborators
  return new Promise((resolve, reject) => {
    onValue(listRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const collaborators = data.collaborators || [];
        if (!collaborators.includes(userId)) {
          collaborators.push(userId);
          await update(listRef, { collaborators });
        }
        resolve(true);
      } else {
        reject(new Error('Shared list not found'));
      }
    }, { onlyOnce: true });
  });
};

export const subscribeToSharedList = (
  listId: string, 
  callback: (data: any) => void
) => {
  const listRef = ref(database, `sharedLists/${listId}`);
  onValue(listRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
  
  return listRef;
};

export const unsubscribeFromSharedList = (reference: DatabaseReference) => {
  off(reference);
};

export const generateShareableLink = (listId: string) => {
  // Create a shareable link that includes the list ID
  return `${window.location.origin}/tasks?shared=${listId}`;
};

export const getSharedListIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('shared');
};
