import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const PieChart = ({ percentage }) => {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Svg height="300" width="300" viewBox="0 0 300 300">
      <Circle
        cx="150"
        cy="150"
        r={radius}
        fill="transparent"
        stroke="#4CAF50"
        strokeWidth="30"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 150 150)"
      />
    </Svg>
  );
};

export default function ExpandedProgress({ route, navigation }) {
  const { percentage } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>Progress</Text>
      <PieChart percentage={percentage} />
      <Text style={styles.percentageText}>{percentage.toFixed(0)}% Complete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
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
  percentageText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
});