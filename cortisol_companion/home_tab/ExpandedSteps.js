import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProgressBar = ({ steps, goal }) => {
  const progressPercentage = (steps / goal) * 100;
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
      <Text style={styles.stepsText}>
        {`${steps}/${goal}`}
      </Text>
    </View>
  );
};

export default function ExpandedSteps({ route, navigation }) {
  const { initialGoal = 8000 } = route.params || {};
  const [goal, setGoal] = useState(initialGoal);
  const steps = 2576;

  const handleSaveGoal = () => {
    navigation.navigate('Home', { updatedGoal: goal });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Steps</Text>
      <ProgressBar steps={steps} goal={goal} />
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={goal.toString()}  // Fixed syntax here
        onChangeText={(value) => setGoal(Number(value))}
        placeholder="Set new goal"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveGoal}>
        <Text style={styles.saveButtonText}>Save Goal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '80%',
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'green',
    position: 'absolute',
    left: 0,
  },
  stepsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    zIndex: 1,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 20,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});