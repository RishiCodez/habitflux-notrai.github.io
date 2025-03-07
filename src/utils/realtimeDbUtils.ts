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

// Helper function to remove undefined values from an object
const removeUndefinedValues = (obj: any): any => {
  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// Real-time subscription functions
export const subscribeToSharedList = (listId: string, callback: (data: any) => void): DatabaseReference => {
  try {
    const db = checkDatabaseConnection();
    const listRef = ref(db, `sharedLists/${listId}`);
    
    onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
    
    return listRef;
  } catch (error) {
    console.error('Error subscribing to shared list:', error);
    throw error;
  }
};

export const unsubscribeFromSharedList = (listRef: DatabaseReference) => {
  try {
    off(listRef);
  } catch (error) {
    console.error('Error unsubscribing from shared list:', error);
  }
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
      pendingInvitations: {},
      accessType: 'private', // 'private' or 'public'
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
    
    // Remove any undefined values to prevent Firebase errors
    const cleanTask = removeUndefinedValues({
      ...task,
      id: taskId,
      sharedId: listId,
      createdAt: new Date().toISOString(),
    });
    
    await set(newTaskRef, cleanTask);
    
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
    
    // Remove undefined values to prevent Firebase errors
    const cleanUpdates = removeUndefinedValues({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    
    const taskRef = ref(db, `sharedLists/${listId}/tasks/${taskId}`);
    await update(taskRef, cleanUpdates);
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

export const addCollaborator = async (listId: string, email: string) => {
  try {
    const db = checkDatabaseConnection();
    const listRef = ref(db, `sharedLists/${listId}`);
    
    // Get current list data
    return new Promise((resolve, reject) => {
      onValue(listRef, async (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            // Check if the email is already in collaborators
            const collaborators = data.collaborators || [];
            if (collaborators.includes(email)) {
              resolve({ success: true, message: 'Email already a collaborator' });
              return;
            }
            
            // Check if invitation is already pending
            const pendingInvitations = data.pendingInvitations || {};
            if (pendingInvitations[email]) {
              resolve({ success: true, message: 'Invitation already sent' });
              return;
            }
            
            // Add to pending invitations with timestamp
            const pendingInvitationsUpdated = {
              ...pendingInvitations,
              [email]: {
                invitedAt: new Date().toISOString(),
                status: 'pending'
              }
            };
            
            // Update the pending invitations in the database
            await update(listRef, { pendingInvitations: pendingInvitationsUpdated });
            
            // In a real app, you would send an email here
            // But for this demo we'll simulate it by showing a notification
            
            resolve({ success: true, email });
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

export const acceptInvitation = async (listId: string, email: string) => {
  try {
    const db = checkDatabaseConnection();
    const listRef = ref(db, `sharedLists/${listId}`);
    
    return new Promise((resolve, reject) => {
      onValue(listRef, async (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            // Check if invitation exists
            const pendingInvitations = data.pendingInvitations || {};
            if (!pendingInvitations[email]) {
              reject(new Error('No invitation found for this email'));
              return;
            }
            
            // Add to collaborators
            const collaborators = data.collaborators || [];
            if (!collaborators.includes(email)) {
              collaborators.push(email);
            }
            
            // Remove from pending invitations
            delete pendingInvitations[email];
            
            // Update the database
            await update(listRef, { 
              collaborators, 
              pendingInvitations 
            });
            
            resolve({ success: true });
          } else {
            reject(new Error('Shared list not found'));
          }
        } catch (err) {
          reject(err);
        }
      }, { onlyOnce: true });
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    throw error;
  }
};

export const rejectInvitation = async (listId: string, email: string) => {
  try {
    const db = checkDatabaseConnection();
    const listRef = ref(db, `sharedLists/${listId}`);
    
    return new Promise((resolve, reject) => {
      onValue(listRef, async (snapshot) => {
        try {
          const data = snapshot.val();
          if (data) {
            // Check if invitation exists
            const pendingInvitations = data.pendingInvitations || {};
            if (!pendingInvitations[email]) {
              reject(new Error('No invitation found for this email'));
              return;
            }
            
            // Remove from pending invitations
            delete pendingInvitations[email];
            
            // Update the database
            await update(listRef, { pendingInvitations });
            
            resolve({ success: true });
          } else {
            reject(new Error('Shared list not found'));
          }
        } catch (err) {
          reject(err);
        }
      }, { onlyOnce: true });
    });
  } catch (error) {
    console.error('Error rejecting invitation:', error);
    throw error;
  }
};

export const updateListAccessType = async (listId: string, accessType: 'private' | 'public') => {
  try {
    const db = checkDatabaseConnection();
    const listRef = ref(db, `sharedLists/${listId}`);
    
    await update(listRef, { accessType });
    return { success: true };
  } catch (error) {
    console.error('Error updating list access type:', error);
    throw error;
  }
};

export const checkListAccess = async (listId: string, userEmail: string): Promise<{
  canAccess: boolean;
  canModify?: boolean;
  reason?: string;
  invitation?: any;
}> => {
  try {
    const db = checkDatabaseConnection();
    const listRef = ref(db, `sharedLists/${listId}`);
    
    return new Promise((resolve, reject) => {
      onValue(listRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          resolve({ canAccess: false, reason: 'list-not-found' });
          return;
        }
        
        // If list is public, anyone can access
        if (data.accessType === 'public') {
          resolve({ canAccess: true, reason: 'public-list' });
          return;
        }
        
        // If user is the creator or in collaborators, they can access
        if (data.createdBy === userEmail || 
            (data.collaborators && data.collaborators.includes(userEmail))) {
          resolve({ canAccess: true, reason: 'is-collaborator' });
          return;
        }
        
        // If user has a pending invitation, they can see but not modify
        if (data.pendingInvitations && data.pendingInvitations[userEmail]) {
          resolve({ 
            canAccess: true, 
            canModify: false,
            reason: 'has-invitation',
            invitation: data.pendingInvitations[userEmail]
          });
          return;
        }
        
        // Otherwise, no access
        resolve({ canAccess: false, reason: 'no-access' });
      }, { onlyOnce: true });
    });
  } catch (error) {
    console.error('Error checking list access:', error);
    throw error;
  }
};

export const getInvitationsForUser = async (userEmail: string): Promise<any[]> => {
  try {
    const db = checkDatabaseConnection();
    const listsRef = ref(db, 'sharedLists');
    
    return new Promise((resolve, reject) => {
      onValue(listsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          resolve([]);
          return;
        }
        
        const invitations = [];
        
        // Check all lists for pending invitations for this user
        for (const [listId, list] of Object.entries(data)) {
          const listData = list as any;
          
          if (listData.pendingInvitations && 
              listData.pendingInvitations[userEmail] && 
              listData.pendingInvitations[userEmail].status === 'pending') {
            
            invitations.push({
              listId,
              listName: listData.name,
              createdBy: listData.createdBy,
              invitedAt: listData.pendingInvitations[userEmail].invitedAt
            });
          }
        }
        
        resolve(invitations);
      }, { onlyOnce: true });
    });
  } catch (error) {
    console.error('Error getting invitations for user:', error);
    throw error;
  }
};

export const generateShareableLink = (listId: string) => {
  // Create a shareable link that includes the list ID with the full origin URL
  return `${window.location.origin}/tasks?shared=${listId}`;
};

export const getSharedListIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('shared');
};
