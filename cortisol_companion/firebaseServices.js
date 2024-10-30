import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

// Get user's document reference
const getUserDocRef = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return doc(db, 'users', user.uid);
};

// Initialize user data structure in Firestore
export const initializeUserData = async () => {
  try {
    const userDocRef = getUserDocRef();
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        tasks: [],
        stats: {
          totalTasksCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastCompletedDate: null
        }
      });
    }
  } catch (error) {
    console.error('Error initializing user data:', error);
    throw error;
  }
};

// Get user's tasks
export const getUserTasks = async () => {
  try {
    const userDocRef = getUserDocRef();
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data().tasks;
    }
    return [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    throw error;
  }
};

// Add new task
export const addTask = async (taskData) => {
  try {
    const userDocRef = getUserDocRef();
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    await updateDoc(userDocRef, {
      tasks: arrayUnion(newTask)
    });
    
    return newTask;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Delete task
export const deleteTask = async (taskId) => {
  try {
    const userDocRef = getUserDocRef();
    const userDoc = await getDoc(userDocRef);
    const tasks = userDoc.data().tasks;
    const taskToDelete = tasks.find(task => task.id === taskId);
    
    await updateDoc(userDocRef, {
      tasks: arrayRemove(taskToDelete)
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Toggle task completion
export const toggleTask = async (taskId) => {
  try {
    const userDocRef = getUserDocRef();
    const userDoc = await getDoc(userDocRef);
    const tasks = userDoc.data().tasks;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        completed: !updatedTasks[taskIndex].completed
      };

      // Update streak if completing task
      const now = new Date();
      const lastCompleted = userDoc.data().stats.lastCompletedDate;
      const isNewDay = !lastCompleted || new Date(lastCompleted).getDate() !== now.getDate();
      
      await updateDoc(userDocRef, {
        tasks: updatedTasks,
        'stats.totalTasksCompleted': updatedTasks[taskIndex].completed ? 
          increment(1) : increment(-1),
        'stats.lastCompletedDate': updatedTasks[taskIndex].completed ? 
          now.toISOString() : lastCompleted,
        'stats.currentStreak': isNewDay && updatedTasks[taskIndex].completed ? 
          increment(1) : increment(0)
      });
    }
  } catch (error) {
    console.error('Error toggling task:', error);
    throw error;
  }
};

// Update task order
export const updateTaskOrder = async (tasks) => {
  try {
    const userDocRef = getUserDocRef();
    await updateDoc(userDocRef, {
      tasks: tasks
    });
  } catch (error) {
    console.error('Error updating task order:', error);
    throw error;
  }
};