import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Tab1Screen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tab 1</Text>
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