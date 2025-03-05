import { 
  ref, 
  set, 
  onValue, 
  push, 
  remove, 
  update,
  off,
  DatabaseReference 
} from 'firebase/database';
import { database } from './firebase';

// Helper function to check database connection
const checkDatabaseConnection = () => {
  if (!database) {
    console.error('Firebase database is not initialized. Operation failed.');
    throw new Error('Firebase database connection error. Please check your Firebase configuration.');
  }
  return database;
};

// Shared task list operations
export const createSharedTaskList = async (name: string, createdBy: string) => {
  try {
    const db = checkDatabaseConnection();
    
    const listRef = ref(db, 'sharedLists');
    const newListRef = push(listRef);
    const listId = newListRef.key;
    
    if (!listId) {
      throw new Error('Failed to generate a new list ID');
    }
    
    await set(newListRef, {
      id: listId,
      name,
      createdBy,
      createdAt: new Date().toISOString(),
      collaborators: [createdBy],
      tasks: {} // Initialize tasks as empty object
    });
    
    return listId;
  } catch (error: any) {
    console.error('Error creating shared task list:', error);
    
    // Enhanced error handling for permission issues
    if (error.message && error.message.includes('PERMISSION_DENIED')) {
      throw new Error(
        'Permission denied. You need to update your Firebase Realtime Database security rules.\n\n' +
        'Go to the Firebase Console > Realtime Database > Rules and set the rules to:\n\n' +
        '{\n' +
        '  "rules": {\n' +
        '    ".read": "true",\n' +
        '    ".write": "true"\n' +
        '  }\n' +
        '}\n\n' +
        'Note: These rules allow anyone to read/write your database. For production, use proper authentication rules.'
      );
    }
    
    throw error;
  }
};

export const addTaskToSharedList = async (
  listId: string, 
  task: any
) => {
  try {
    const db = checkDatabaseConnection();
    
    const taskRef = ref(db, `sharedLists/${listId}/tasks`);
    const newTaskRef = push(taskRef);
    const taskId = newTaskRef.key;
    
    if (!taskId) {
      throw new Error('Failed to generate a new task ID');
    }
    
    await set(newTaskRef, {
      ...task,
      id: taskId,
      sharedId: listId,
      createdAt: new Date().toISOString(),
    });
    
    return taskId;
  } catch (error) {
    console.error('Error adding task to shared list:', error);
    throw error;
  }
};

export const updateSharedTask = async (
  listId: string, 
  taskId: string, 
  updates: any
) => {
  try {
    const db = checkDatabaseConnection();
    
    const taskRef = ref(db, `sharedLists/${listId}/tasks/${taskId}`);
    await update(taskRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating shared task:', error);
    throw error;
  }
};

export const deleteSharedTask = async (listId: string, taskId: string) => {
  try {
    const db = checkDatabaseConnection();
    
    const taskRef = ref(db, `sharedLists/${listId}/tasks/${taskId}`);
    await remove(taskRef);
  } catch (error) {
    console.error('Error deleting shared task:', error);
    throw error;
  }
};

export const addCollaborator = async (listId: string, userId: string) => {
  try {
    const db = checkDatabaseConnection();
    const listRef = ref(db, `sharedLists/${listId}`);
    
    // Get current collaborators
    return new Promise((resolve, reject) => {
      onValue(listRef, async (snapshot) => {
        try {
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
        } catch (err) {
          reject(err);
        }
      }, { onlyOnce: true });
    });
  } catch (error: any) {
    console.error('Error adding collaborator:', error);
    
    // Enhanced error handling for permission issues
    if (error.message && error.message.includes('PERMISSION_DENIED')) {
      throw new Error(
        'Permission denied. You need to update your Firebase Realtime Database security rules.\n\n' +
        'Go to the Firebase Console > Realtime Database > Rules and set the rules to:\n\n' +
        '{\n' +
        '  "rules": {\n' +
        '    ".read": "true",\n' +
        '    ".write": "true"\n' +
        '  }\n' +
        '}\n\n' +
        'Note: These rules allow anyone to read/write your database. For production, use proper authentication rules.'
      );
    }
    
    throw error;
  }
};

export const subscribeToSharedList = (
  listId: string, 
  callback: (data: any) => void
) => {
  try {
    const db = checkDatabaseConnection();
    
    const listRef = ref(db, `sharedLists/${listId}`);
    onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error('Error subscribing to shared list:', error);
      callback(null);
    });
    
    return listRef;
  } catch (error) {
    console.error('Error setting up subscription:', error);
    callback(null);
    return null;
  }
};

export const unsubscribeFromSharedList = (reference: DatabaseReference | null) => {
  if (reference) {
    off(reference);
  }
};

export const generateShareableLink = (listId: string) => {
  // Create a shareable link that includes the list ID
  return `${window.location.origin}/tasks?shared=${listId}`;
};

export const getSharedListIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('shared');
};
