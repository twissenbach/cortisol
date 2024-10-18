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

// Actions
const TOGGLE_TASK = 'TOGGLE_TASK';

export const toggleTask = (id) => ({
  type: TOGGLE_TASK,
  id,
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
    default:
      return state;
  }
};

// Create store
const store = createStore(tasksReducer);

export default store;
