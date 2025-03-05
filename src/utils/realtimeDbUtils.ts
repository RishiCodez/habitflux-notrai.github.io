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

// Shared task list operations
export const createSharedTaskList = async (name: string, createdBy: string) => {
  if (!database) {
    console.warn('Firebase database is not initialized. Operation failed.');
    return null;
  }
  
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
  if (!database) {
    console.warn('Firebase database is not initialized. Subscription failed.');
    return null;
  }
  
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
