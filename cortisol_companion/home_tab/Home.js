import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTask } from '../store';

const { width } = Dimensions.get('window');

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

const PieChart = ({ percentage }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Svg height="100" width="100" viewBox="0 0 100 100">
      <Circle
        cx="50"
        cy="50"
        r={radius}
        fill="transparent"
        stroke="#4CAF50"
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)"
      />
    </Svg>
  );
};

export default function HomeScreen({ navigation }) {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  
  // Sort tasks so completed ones are at the bottom
  const sortedTasks = [...tasks].sort((a, b) => {
    // First, move completed tasks to the bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // For tasks with the same completion status, maintain their order
    // This assumes tasks array maintains the order from ExpandedManageTasks
    return 0;
  });
  
  const completedPercentage = (tasks.filter(task => task.completed).length / tasks.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.tileContainer}>
        <Text style={styles.tileTitle}>Daily Tasks</Text>
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
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity 
          style={styles.manageButton} 
          onPress={() => navigation.navigate('ExpandedManageTasks')}
        >
          <Text style={styles.manageButtonText}>Manage Tasks</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.squareCardContainer}>
        <View style={styles.squareCard}>
          <Text style={styles.squareCardTitle}>Streak</Text>
          <Text style={styles.squareCardContent}>7 Days</Text>
        </View>
        <TouchableOpacity 
          style={styles.squareCard}
          onPress={() => navigation.navigate('ExpandedProgress', { percentage: completedPercentage })}
        >
          <Text style={styles.squareCardTitle}>Progress</Text>
          <PieChart percentage={completedPercentage} />
        </TouchableOpacity>
      </View>
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
    height: '50%',
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    baackgroundColor: 'transparent',
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
  manageButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  manageButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 16,
  },
  squareCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  squareCard: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 15,
    width: '48%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareCardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  squareCardContent: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});