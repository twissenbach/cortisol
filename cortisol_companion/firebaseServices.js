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

// Update daily completion rate
export const updateDailyCompletionRate = async () => {
  try {
    const userDocRef = getUserDocRef();
    const userDoc = await getDoc(userDocRef);
    const tasks = userDoc.data().tasks;
    
    if (tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = (completedTasks / tasks.length) * 100;
    
    const today = new Date().toISOString().split('T')[0];
    
    await updateDoc(userDocRef, {
      [`completionHistory.${today}`]: completionRate
    });
    
    return completionRate;
  } catch (error) {
    console.error('Error updating completion rate:', error);
    throw error;
  }
};

// Get completion history
export const getCompletionHistory = async () => {
  try {
    const userDocRef = getUserDocRef();
    const userDoc = await getDoc(userDocRef);
    const history = userDoc.data()?.completionHistory || {};
    
    // Convert to grid format
    const today = new Date();
    const gridData = [];
    
    // Create 13 weeks of data
    for (let week = 0; week < 13; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - ((12 - week) * 7 + (6 - day)));
        const dateKey = date.toISOString().split('T')[0];
        weekData.push(history[dateKey] || null);
      }
      gridData.push(weekData);
    }
    
    return gridData;
  } catch (error) {
    console.error('Error getting completion history:', error);
    throw error;
  }
};