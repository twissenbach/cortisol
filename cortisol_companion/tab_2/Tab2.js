import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Tab2Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tab 2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});