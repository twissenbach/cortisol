import { legacy_createStore as createStore } from 'redux';
import { 
  toggleTask as toggleTaskInFirebase,
  updateTaskOrder as updateTaskOrderInFirebase,
  deleteTask as deleteTaskInFirebase,
  addTask as addTaskToFirebase,
} from './firebaseServices';

// Initial state
const initialState = {
  tasks: [
    { id: '1', title: 'Morning meditation', completed: false },
    { id: '2', title: 'Take medication', completed: false },
    { id: '3', title: 'Exercise for 30 minutes', completed: false },
    { id: '4', title: 'Eat a balanced meal', completed: false },
    { id: '5', title: 'Practice deep breathing', completed: false },
  ]
};

// Action Types
const TOGGLE_TASK = 'TOGGLE_TASK';
const UPDATE_TASK_ORDER = 'UPDATE_TASK_ORDER';
const DELETE_TASK = 'DELETE_TASK';
const ADD_TASK = 'ADD_TASK';
const SET_TASKS = 'SET_TASKS';

// Action Creators
export const toggleTask = (id) => {
  return async (dispatch) => {
    try {
      await toggleTaskInFirebase(id);
      dispatch({
        type: TOGGLE_TASK,
        id,
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };
};

export const updateTaskOrder = (tasks) => {
  return async (dispatch) => {
    try {
      await updateTaskOrderInFirebase(tasks);
      dispatch({
        type: UPDATE_TASK_ORDER,
        payload: tasks,
      });
    } catch (error) {
      console.error('Error updating task order:', error);
    }
  };
};

export const deleteTask = (id) => {
  return async (dispatch) => {
    try {
      await deleteTaskInFirebase(id);
      dispatch({
        type: DELETE_TASK,
        id,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
};

export const addTask = (taskData) => {
  return async (dispatch) => {
    try {
      const newTask = await addTaskToFirebase(taskData);
      dispatch({
        type: ADD_TASK,
        payload: newTask,
      });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
};

export const setTasks = (tasks) => ({
  type: SET_TASKS,
  payload: tasks,
});

// Middleware to handle async actions
const thunkMiddleware = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};

// Reducer
const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.id ? { ...task, completed: !task.completed } : task
        )
      };
      
    case UPDATE_TASK_ORDER:
      return {
        ...state,
        tasks: action.payload
      };
      
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.id)
      };
      
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };
      
    case SET_TASKS:
      return {
        ...state,
        tasks: action.payload
      };
      
    default:
      return state;
  }
};

// Create store with middleware
const createStoreWithMiddleware = (reducer) => {
  const store = createStore((state, action) => {
    try {
      return reducer(state, action);
    } catch (error) {
      console.error('Error in reducer:', error);
      return state;
    }
  });

  const dispatch = store.dispatch;
  store.dispatch = action => {
    return thunkMiddleware(store)(dispatch)(action);
  };

  return store;
};

const store = createStoreWithMiddleware(tasksReducer);

export default store;