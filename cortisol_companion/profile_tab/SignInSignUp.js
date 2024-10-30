import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useDispatch } from 'react-redux';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeUserData, getUserTasks } from '../firebaseServices';
import { setTasks } from '../store';

export default function SignInSignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const initializeUser = async (userCredential) => {
    try {
      // Initialize user data in Firebase
      await initializeUserData();
      
      // Get initial tasks
      const userTasks = await getUserTasks();
      
      // Update Redux store
      dispatch(setTasks(userTasks));
      
      Alert.alert(
        isLogin ? "Logged in!" : "Sign Up Successful!", 
        `Welcome ${userCredential.user.email}`
      );
    } catch (error) {
      console.error('Error initializing user data:', error);
      Alert.alert(
        "Setup Error",
        "There was an error setting up your account. Please try logging in again."
      );
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await initializeUser(userCredential);
    } catch (error) {
      Alert.alert("Login Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await initializeUser(userCredential);
    } catch (error) {
      Alert.alert("Sign Up Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>
            {isLogin ? "Signing in..." : "Creating account..."}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.mainButtonContainer}>
            <Button
              title={isLogin ? "Login" : "Sign Up"}
              onPress={isLogin ? handleLogin : handleSignUp}
              color="#3498db"
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>
              {isLogin ? "New to the app?" : "Already have an account?"}
            </Text>
            <Button
              title={isLogin ? "Create Account" : "Sign In"}
              onPress={() => setIsLogin(!isLogin)}
              color="gray"
            />
          </View>
        </>
      )}
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
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#333',
    padding: 15,
    marginBottom: 15,
    color: 'white',
    borderRadius: 8,
    fontSize: 16,
  },
  mainButtonContainer: {
    width: '100%',
    marginTop: 10,
  },
  switchContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  switchText: {
    color: 'white',
    marginBottom: 10,
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
});