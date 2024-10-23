import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { updateTaskOrder, deleteTask } from '../store';

export default function ExpandedManageTasks({ navigation }) {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [draggingIndex, setDraggingIndex] = useState(null);
  
  // Create a pan for the entire list instead of per item
  const pan = useRef(new Animated.ValueXY()).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: 0,
          y: 0,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        if (draggingIndex !== null) {
          const newIndex = Math.floor(
            draggingIndex + gestureState.dy / 60
          );
          if (
            newIndex !== draggingIndex && 
            newIndex >= 0 && 
            newIndex < tasks.length
          ) {
            const newTasks = [...tasks];
            const item = newTasks.splice(draggingIndex, 1)[0];
            newTasks.splice(newIndex, 0, item);
            dispatch(updateTaskOrder(newTasks));
          }
          setDraggingIndex(null);
        }
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const renderItem = ({ item, index }) => {
    return (
      <Animated.View
        style={[
          styles.taskItem,
          draggingIndex === index && {
            transform: [{ translateY: pan.y }],
            elevation: 5,
            shadowOpacity: 0.2,
          },
        ]}
      >
        <TouchableOpacity
          onPressIn={() => {
            setDraggingIndex(index);
          }}
          {...panResponder.panHandlers}
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
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Manage Tasks</Text>
      
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.taskList}
        scrollEnabled={draggingIndex === null}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          // Add new task action here
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
  dragHandle: {
    marginRight: 15,
    opacity: 0.7,
  },
  taskText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
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