import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateTaskOrder, deleteTask } from '../store';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AddTaskModal from './AddTaskModal';

export default function ExpandedManageTasks({ navigation }) {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <ScaleDecorator>
        <View style={[
          styles.taskItem,
          isActive && styles.draggingItem
        ]}>
          <TouchableOpacity 
            onPressIn={drag}
            style={styles.dragHandleContainer}
          >
            <Ionicons 
              name="menu" 
              size={24} 
              color="#666"
              style={styles.dragHandle}
            />
          </TouchableOpacity>
          
          <Text style={styles.taskText}>{item.title}</Text>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => dispatch(deleteTask(item.id))}
          >
            <Ionicons name="trash-outline" size={24} color="#FF4444" />
          </TouchableOpacity>
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Manage Tasks</Text>
      
      <DraggableFlatList
        data={tasks}
        onDragEnd={({ data }) => dispatch(updateTaskOrder(data))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        containerStyle={styles.taskList}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setIsAddTaskModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>

      <AddTaskModal
        visible={isAddTaskModalVisible}
        onClose={() => setIsAddTaskModalVisible(false)}
      />
    </GestureHandlerRootView>
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
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3.84,
  },
  draggingItem: {
    backgroundColor: '#444',
    elevation: 5,
    shadowOpacity: 0.3,
  },
  dragHandleContainer: {
    padding: 5,
    marginRight: 10,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandle: {
    opacity: 0.7,
  },
  taskText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 10,
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