import { createStore } from 'redux';

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

// Action Creators
export const toggleTask = (id) => ({
  type: TOGGLE_TASK,
  id,
});

export const updateTaskOrder = (tasks) => ({
  type: UPDATE_TASK_ORDER,
  payload: tasks,
});

export const deleteTask = (id) => ({
  type: DELETE_TASK,
  id,
});

export const addTask = (title) => ({
  type: ADD_TASK,
  payload: {
    id: Date.now().toString(), // Simple way to generate unique IDs
    title,
    completed: false,
  },
});

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

    default:
      return state;
  }
};

// Create store
const store = createStore(tasksReducer);

export default store;