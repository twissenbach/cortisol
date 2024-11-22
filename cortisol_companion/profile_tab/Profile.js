import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function ProfileScreen({ user }) {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Signed Out", "You have been successfully signed out.");
      })
      .catch(error => {
        Alert.alert("Sign Out Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, {user.email}</Text>
      <Button title="Sign Out" onPress={handleSignOut} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
});
