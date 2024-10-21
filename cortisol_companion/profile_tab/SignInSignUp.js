import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function SignInSignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        Alert.alert("Logged in!", `Welcome back ${userCredential.user.email}`);
      })
      .catch(error => {
        Alert.alert("Login Error", error.message);
      });
  };

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        Alert.alert("Sign Up Successful!", `Welcome ${userCredential.user.email}`);
      })
      .catch(error => {
        Alert.alert("Sign Up Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={isLogin ? "Login" : "Sign Up"}
        onPress={isLogin ? handleLogin : handleSignUp}
        color="white"
      />
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>
          {isLogin ? "New? Sign Up" : "Already have an account? Log in"}
        </Text>
        <Button
          title={isLogin ? "Sign Up" : "Log in"}
          onPress={() => setIsLogin(!isLogin)}
          color="gray"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#333',
    padding: 10,
    marginBottom: 10,
    color: 'white',
    borderRadius: 5,
  },
  switchContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: 'white',
    marginBottom: 10,
  },
});
