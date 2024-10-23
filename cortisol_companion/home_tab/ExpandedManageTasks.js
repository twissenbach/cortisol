import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTask } from '../store';

const CustomCheckbox = ({ status, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[
      styles.checkbox,
      status === 'checked' && styles.checkboxChecked
    ]}>
      {status === 'checked' && (
        <Ionicons name="checkmark" size={18} color="#4CAF50" />
      )}
    </View>
  </TouchableOpacity>
);

export default function ExpandedManageTasks({ navigation }) {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  // Sort tasks so completed ones are at the bottom
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Manage Tasks</Text>
      
      <ScrollView style={styles.taskList}>
        {sortedTasks.map(task => (
          <View key={task.id} style={styles.taskItem}>
            <CustomCheckbox
              status={task.completed ? 'checked' : 'unchecked'}
              onPress={() => dispatch(toggleTask(task.id))}
            />
            <Text style={[
              styles.taskText,
              task.completed && styles.completedTaskText
            ]}>{task.title}</Text>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => {
                // Add delete task action here when ready
                // dispatch(deleteTask(task.id))
              }}
            >
              <Ionicons name="trash-outline" size={24} color="#FF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          // Add new task action here when ready
          // navigation.navigate('AddTask')
        }}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#white',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#transparent',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  taskText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 15,
    margin: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});