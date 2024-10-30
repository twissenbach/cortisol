import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Svg, Circle, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const PieChart = ({ percentage }) => {
  // Handle undefined or NaN cases
  const validPercentage = !isNaN(percentage) && percentage !== null ? percentage : 0;
  
  const radius = 80; // Smaller radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  return (
    <Svg height="200" width="200" viewBox="0 0 200 200">
      {/* Background circle */}
      <Circle
        cx="100"
        cy="100"
        r={radius}
        fill="transparent"
        stroke="#333"
        strokeWidth="20"
      />
      {/* Progress circle */}
      <Circle
        cx="100"
        cy="100"
        r={radius}
        fill="transparent"
        stroke="#4CAF50"
        strokeWidth="20"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 100 100)"
      />
    </Svg>
  );
};

const CompletionGrid = ({ completionData }) => {
  const screenWidth = Dimensions.get('window').width;
  const boxSize = 14;
  const boxMargin = 2;
  const numColumns = 13; // 13 weeks
  const numRows = 7; // 7 days per week
  
  // Helper function to get color based on completion percentage
  const getColor = (percentage) => {
    if (!percentage) return '#1a1a1a'; // Empty box color
    
    // Define color stops for the gradient
    const colorStops = [
      { threshold: 0, color: '#1a1a1a' },
      { threshold: 25, color: '#1e4620' },
      { threshold: 50, color: '#2d6f31' },
      { threshold: 75, color: '#3c9742' },
      { threshold: 100, color: '#4CAF50' },
    ];
    
    // Find appropriate color based on percentage
    for (let i = colorStops.length - 1; i >= 0; i--) {
      if (percentage >= colorStops[i].threshold) {
        return colorStops[i].color;
      }
    }
    return '#1a1a1a';
  };

  return (
    <View style={styles.gridContainer}>
      {/* Month labels */}
      <View style={styles.monthLabels}>
        {['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, i) => (
          <Text key={month} style={[styles.monthLabel, { left: (i * (boxSize + boxMargin) * 4) }]}>
            {month}
          </Text>
        ))}
      </View>

      {/* Day labels */}
      <View style={styles.dayLabels}>
        {['Mon', 'Wed', 'Fri'].map((day, i) => (
          <Text key={day} style={[styles.dayLabel, { top: (i * (boxSize + boxMargin) * 2) }]}>
            {day}
          </Text>
        ))}
      </View>

      {/* Grid */}
      <Svg
        width={numColumns * (boxSize + boxMargin)}
        height={numRows * (boxSize + boxMargin)}
        style={styles.grid}
      >
        {completionData.map((week, weekIndex) =>
          week.map((day, dayIndex) => (
            <Rect
              key={`${weekIndex}-${dayIndex}`}
              x={weekIndex * (boxSize + boxMargin)}
              y={dayIndex * (boxSize + boxMargin)}
              width={boxSize}
              height={boxSize}
              fill={getColor(day)}
              rx={2}
            />
          ))
        )}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendText}>0%</Text>
        {[0, 25, 50, 75, 100].map((value) => (
          <View
            key={value}
            style={[styles.legendBox, { backgroundColor: getColor(value) }]}
          />
        ))}
        <Text style={styles.legendText}>100%</Text>
      </View>
    </View>
  );
};

export default function ExpandedProgress({ route, navigation }) {
  const { percentage } = route.params;
  const [completionHistory, setCompletionHistory] = useState([]);

  useEffect(() => {
    // Here you would fetch the completion history from Firebase
    // For now, using dummy data
    const dummyData = Array(13).fill(null).map(() => 
      Array(7).fill(null).map(() => 
        Math.floor(Math.random() * 100)
      )
    );
    setCompletionHistory(dummyData);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.title}>Progress</Text>
      
      <View style={styles.chartContainer}>
        <PieChart percentage={percentage} />
        <Text style={styles.percentageText}>
          {!isNaN(percentage) ? `${percentage.toFixed(0)}% Complete` : 'No tasks'}
        </Text>
      </View>

      <CompletionGrid completionData={completionHistory} />
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
  chartContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  percentageText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  gridContainer: {
    padding: 20,
  },
  monthLabels: {
    flexDirection: 'row',
    marginLeft: 30,
    marginBottom: 5,
    height: 20,
  },
  monthLabel: {
    color: '#666',
    fontSize: 12,
    position: 'absolute',
  },
  dayLabels: {
    position: 'absolute',
    left: 0,
    top: 30,
  },
  dayLabel: {
    color: '#666',
    fontSize: 12,
    position: 'absolute',
  },
  grid: {
    marginLeft: 30,
    marginTop: 10,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  legendBox: {
    width: 14,
    height: 14,
    marginHorizontal: 2,
    borderRadius: 2,
  },
  legendText: {
    color: '#666',
    fontSize: 12,
    marginHorizontal: 8,
  },
});