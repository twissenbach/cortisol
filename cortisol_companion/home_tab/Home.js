import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CustomCheckbox = ({ status, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={[
      styles.checkbox,
      status === 'checked' && styles.checkboxChecked
    ]}>
      {status === 'checked' && <View style={styles.checkmark} />}
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Morning meditation', completed: false },
    { id: '2', title: 'Take medication', completed: false },
    { id: '3', title: 'Exercise for 30 minutes', completed: false },
    { id: '4', title: 'Eat a balanced meal', completed: false },
    { id: '5', title: 'Practice deep breathing', completed: false },
  ]);

  const [slideAnim] = useState(new Animated.Value(width));
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTask = (id) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      return [
        ...updatedTasks.filter(task => !task.completed),
        ...updatedTasks.filter(task => task.completed),
      ];
    });
  };

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tileContainer}>
        <Text style={styles.tileTitle}>Daily Tasks</Text>
        <ScrollView style={styles.taskList}>
          {tasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <CustomCheckbox
                status={task.completed ? 'checked' : 'unchecked'}
                onPress={() => toggleTask(task.id)}
              />
              <Text style={[
                styles.taskText,
                task.completed && styles.completedTaskText
              ]}>{task.title}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.manageButton} onPress={toggleMenu}>
        <Text style={styles.manageButtonText}>Manage Tasks &gt;</Text>
      </TouchableOpacity>

      <Animated.View style={[
        styles.slideMenu,
        { transform: [{ translateX: slideAnim }] }
      ]}>
        <TouchableOpacity style={styles.backButton} onPress={toggleMenu}>
          <Text style={styles.backButtonText}>&lt; Back</Text>
        </TouchableOpacity>
        <Text style={styles.menuTitle}>Manage Tasks</Text>
        {/* Add task management options here */}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 40,
  },
  tileContainer: {
    backgroundColor: '#333',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    height: '36%',
  },
  tileTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  manageButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 0,
    marginRight: 20,
    marginTop: -10, // Move the button up
  },
  manageButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 16,
  },
  slideMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#222',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 2,
  },
});